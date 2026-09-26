import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { describeItems, formatKes, sendTeamEmail } from './_lib/email.js';
import { readEtims } from './_lib/kra.js';
import { sendMetaPurchase } from './_lib/metaCapi.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { computeAuthoritativeTotals, type CheckoutItem } from './_lib/pricing.js';

// Disables Vercel's automatic JSON body parsing so we can verify Paystack's
// signature against the exact raw bytes they signed — parsing and
// re-serializing the body first would break the HMAC comparison.
export const config = {
  api: { bodyParser: false },
};

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

function readRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const COMMISSION_RATE = 0.1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: 'Server is missing PAYSTACK_SECRET_KEY.' });
    return;
  }

  const rawBody = await readRawBody(req);

  const expectedSignature = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
  const receivedSignature = req.headers['x-paystack-signature'];

  if (!receivedSignature || receivedSignature !== expectedSignature) {
    // Do not process anything from a request that didn't genuinely come
    // from Paystack.
    res.status(401).json({ error: 'Invalid signature.' });
    return;
  }

  let event: {
    event: string;
    data: {
      reference: string;
      metadata?: {
        customer_name?: string;
        customer_email?: string;
        customer_phone?: string;
        company?: string | null;
        items?: CheckoutItem[];
        referral_code?: string | null;
        needs_etims?: boolean;
        kra_pin?: string | null;
        kra_business_name?: string | null;
        // Present only when the customer accepted cookies (see api/checkout.ts).
        meta_consent?: boolean;
        meta_fbp?: string | null;
        meta_fbc?: string | null;
        meta_client_user_agent?: string | null;
        meta_client_ip?: string | null;
        meta_event_source_url?: string | null;
      };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    res.status(400).json({ error: 'Invalid JSON payload.' });
    return;
  }

  // Acknowledge every other event type without acting on it (e.g.
  // charge.failed) — Paystack only needs a 200, not a specific action.
  if (event.event !== 'charge.success') {
    res.status(200).json({ received: true });
    return;
  }

  const { reference, metadata } = event.data;
  if (!metadata?.items || !metadata.customer_email || !metadata.customer_name || !metadata.customer_phone) {
    res.status(400).json({ error: 'Webhook payload is missing order metadata.' });
    return;
  }
  const { customer_name, customer_email, customer_phone } = metadata;

  const supabase = getSupabaseAdmin();

  // Paystack may redeliver the same webhook; skip if we've already recorded
  // this transaction rather than creating a duplicate order.
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('paystack_reference', reference)
    .maybeSingle();

  if (existing) {
    res.status(200).json({ received: true, alreadyProcessed: true });
    return;
  }

  // The checkout route already validated these before the customer paid. Check
  // again here anyway, but never drop a paid order over it: if something is
  // somehow off, the order is still saved with what was sent, and the alert
  // says the details need checking.
  const etimsRequested = metadata.needs_etims === true;
  let etimsPin: string | null = null;
  let etimsName: string | null = null;
  let etimsProblem: string | null = null;
  if (etimsRequested) {
    const parsed = readEtims(true, metadata.kra_pin, metadata.kra_business_name);
    if ('error' in parsed) {
      etimsProblem = parsed.error;
      etimsPin = typeof metadata.kra_pin === 'string' ? metadata.kra_pin.trim().slice(0, 30) || null : null;
      etimsName = typeof metadata.kra_business_name === 'string' ? metadata.kra_business_name.trim().slice(0, 200) || null : null;
      console.error('Paid order has invalid eTIMS details:', parsed.error);
    } else if (parsed.etims) {
      etimsPin = parsed.etims.kraPin;
      etimsName = parsed.etims.businessName;
    }
  }

  let totals;
  try {
    totals = computeAuthoritativeTotals(metadata.items);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid order items.' });
    return;
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name,
      customer_email,
      customer_phone,
      company: metadata.company ?? null,
      items: metadata.items,
      subtotal: totals.subtotal,
      discount_applied: totals.discount > 0,
      total: totals.total,
      payment_status: 'paid',
      paystack_reference: reference,
      referral_code: metadata.referral_code ?? null,
      // Only sent when requested, so ordinary orders don't depend on these columns.
      ...(etimsRequested ? { needs_etims: true, kra_pin: etimsPin, kra_business_name: etimsName } : {}),
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Failed to insert order:', orderError);
    res.status(500).json({ error: 'Failed to record order.' });
    return;
  }

  let referralNote: string | null = null;
  if (metadata.referral_code) {
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, status')
      .eq('referral_code', metadata.referral_code)
      .maybeSingle();

    // Pending affiliates' codes are stored on the order for the record, but
    // don't earn a commission until manually approved (status flipped to
    // 'active' in Supabase).
    if (affiliate && affiliate.status === 'active') {
      const { error: commissionError } = await supabase.from('referral_commissions').insert({
        affiliate_id: affiliate.id,
        order_id: order.id,
        commission_amount: totals.total * COMMISSION_RATE,
        payout_status: 'unpaid',
      });
      if (commissionError) {
        // The order itself is already recorded; log and move on rather
        // than fail the whole webhook over the commission row.
        console.error('Failed to insert referral commission:', commissionError);
        referralNote = `${metadata.referral_code} (commission could not be recorded, check the logs)`;
      } else {
        referralNote = `${metadata.referral_code} (active affiliate, commission recorded)`;
      }
    } else if (affiliate) {
      referralNote = `${metadata.referral_code} (affiliate is still pending approval, no commission)`;
    } else {
      referralNote = `${metadata.referral_code} (no affiliate has this code, no commission)`;
    }
  }

  // The order is saved. Everything below is best-effort and never affects the
  // response Paystack sees: sendTeamEmail and sendMetaPurchase both log their
  // own failures instead of throwing, and the Meta call has its own timeout.
  // The Meta Purchase goes only to customers who accepted cookies, and carries
  // no KRA, name or company details.
  const metaPurchase =
    metadata.meta_consent === true
      ? sendMetaPurchase({
          reference,
          value: totals.total,
          email: customer_email,
          phone: customer_phone,
          items: metadata.items.map((i) => ({ name: i.name, quantity: i.quantity })),
          eventSourceUrl: metadata.meta_event_source_url,
          clientUserAgent: metadata.meta_client_user_agent,
          clientIpAddress: metadata.meta_client_ip,
          fbp: metadata.meta_fbp,
          fbc: metadata.meta_fbc,
        })
      : Promise.resolve();

  const teamEmail = sendTeamEmail({
    subject: `New paid order${etimsRequested ? ' (eTIMS invoice needed)' : ''}: ${customer_name} (${formatKes(totals.total)})`,
    heading: 'New paid order',
    rows: [
      ['Customer', customer_name],
      ['Email', customer_email],
      ['Phone', customer_phone],
      ['Company', metadata.company],
      ['Items', describeItems(metadata.items)],
      ['Total', formatKes(totals.total)],
      ['Payment reference', reference],
      ['Referral code', referralNote],
      ...(etimsRequested
        ? ([
            ['eTIMS invoice', 'REQUESTED'],
            ['KRA PIN', etimsPin],
            ['Registered business name', etimsName],
          ] as [string, string | null][])
        : []),
    ],
    note: etimsRequested
      ? etimsProblem
        ? `eTIMS invoice requested, but the details look wrong (${etimsProblem}) Contact the customer to confirm their KRA PIN and business name before issuing the invoice.`
        : `eTIMS invoice requested: issue a tax invoice to KRA PIN ${etimsPin}, business name ${etimsName}.`
      : undefined,
    replyTo: customer_email,
  });

  await Promise.allSettled([teamEmail, metaPurchase]);

  res.status(200).json({ received: true });
}

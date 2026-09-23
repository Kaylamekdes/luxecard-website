import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';
import { computeAuthoritativeTotals, type CheckoutItem } from './_lib/pricing';

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
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Failed to insert order:', orderError);
    res.status(500).json({ error: 'Failed to record order.' });
    return;
  }

  if (metadata.referral_code) {
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id')
      .eq('referral_code', metadata.referral_code)
      .maybeSingle();

    if (affiliate) {
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
      }
    }
  }

  res.status(200).json({ received: true });
}

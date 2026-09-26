import type { IncomingMessage, ServerResponse } from 'http';
import { readEtims } from './_lib/kra.js';
import { computeAuthoritativeTotals, type CheckoutItem } from './_lib/pricing.js';

type CheckoutRequestBody = {
  items: CheckoutItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    // Present only when the business form's "I need an eTIMS tax invoice" box was ticked.
    etims?: { kraPin?: unknown; businessName?: unknown };
  };
  referralCode?: string | null;
  // Sent by the browser only when the visitor accepted cookies.
  metaTracking?: { consent?: unknown; fbp?: unknown; fbc?: unknown };
};

const clip = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;

// The details the Paystack webhook needs to send this purchase to Meta's
// Conversions API, carried through Paystack's transaction metadata. Only
// built when the visitor accepted cookies; otherwise nothing is added and the
// webhook never contacts Meta. Deliberately excludes KRA and payment details.
function metaTrackingMetadata(req: VercelRequest, tracking: CheckoutRequestBody['metaTracking'], origin: string) {
  if (tracking?.consent !== true) return {};
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim() || null;
  return {
    meta_consent: true,
    meta_fbp: clip(tracking.fbp, 256),
    meta_fbc: clip(tracking.fbc, 512),
    meta_client_user_agent: clip(req.headers['user-agent'], 512),
    meta_client_ip: clip(ip, 64),
    meta_event_source_url: `${origin}/order-confirmation`,
  };
}

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

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

  let body: CheckoutRequestBody;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as CheckoutRequestBody);
  } catch {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  const { items, customer, referralCode, metaTracking } = body ?? {};

  if (!customer?.name || !customer?.email || !customer?.phone) {
    res.status(400).json({ error: 'Missing customer name, email, or phone.' });
    return;
  }

  let totals;
  try {
    totals = computeAuthoritativeTotals(items);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid cart.' });
    return;
  }

  // Validate before any money moves: a bad PIN must never reach Paystack.
  const etimsResult = readEtims(!!customer.etims, customer.etims?.kraPin, customer.etims?.businessName);
  if ('error' in etimsResult) {
    res.status(400).json({ error: etimsResult.error });
    return;
  }
  const { etims } = etimsResult;

  const origin =
    (req.headers.origin as string | undefined) ??
    `https://${req.headers.host}`;

  try {
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customer.email,
        // Paystack amounts are in the smallest currency subunit (KES cents).
        amount: Math.round(totals.total * 100),
        currency: 'KES',
        callback_url: `${origin}/order-confirmation`,
        metadata: {
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          company: customer.company ?? null,
          items,
          subtotal: totals.subtotal,
          discount_applied: totals.discount > 0,
          total: totals.total,
          referral_code: referralCode ?? null,
          needs_etims: !!etims,
          kra_pin: etims?.kraPin ?? null,
          kra_business_name: etims?.businessName ?? null,
          // Shown on the transaction page in the Paystack dashboard.
          custom_fields: etims
            ? [
                { display_name: 'eTIMS invoice', variable_name: 'etims_invoice', value: 'Requested' },
                { display_name: 'KRA PIN', variable_name: 'kra_pin', value: etims.kraPin },
                { display_name: 'Registered business name', variable_name: 'kra_business_name', value: etims.businessName },
              ]
            : undefined,
          // Sends the user back here with their cart reopened when they
          // cancel from Paystack's checkout page (the X button), rather
          // than leaving them on whatever default Paystack falls back to.
          cancel_action: `${origin}/?checkout=cancelled`,
          ...metaTrackingMetadata(req, metaTracking, origin),
        },
      }),
    });

    const paystackData = (await paystackRes.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string };
    };

    if (!paystackRes.ok || !paystackData?.status || !paystackData.data) {
      res.status(502).json({ error: paystackData?.message ?? 'Paystack initialization failed.' });
      return;
    }

    res.status(200).json({ authorization_url: paystackData.data.authorization_url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unexpected server error.' });
  }
}

import type { IncomingMessage, ServerResponse } from 'http';
import { computeAuthoritativeTotals, type CheckoutItem } from './_lib/pricing';

type CheckoutRequestBody = {
  items: CheckoutItem[];
  customer: { name: string; email: string; phone: string; company?: string };
  referralCode?: string | null;
};

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

  const { items, customer, referralCode } = body ?? {};

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

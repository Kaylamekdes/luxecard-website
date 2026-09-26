import type { IncomingMessage, ServerResponse } from 'http';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: IncomingMessage, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const reference = new URL(req.url ?? '', 'http://localhost').searchParams.get('reference');
  if (!reference) {
    res.status(400).json({ error: 'Missing reference.' });
    return;
  }

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from('orders')
    .select('payment_status, total')
    .eq('paystack_reference', reference)
    .maybeSingle();

  // `value` (the order total in KES, nothing else about the order) lets the
  // confirmation page report the Purchase to Meta with the right amount.
  if (order?.payment_status === 'paid') {
    res.status(200).json({ paid: true, value: Number(order.total) });
    return;
  }

  // No paid row yet — either the webhook hasn't landed, or this payment
  // never succeeded and never will. Ask Paystack directly to tell those
  // two cases apart instead of leaving the caller to guess.
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    res.status(200).json({ paid: false });
    return;
  }

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const verifyData = (await verifyRes.json()) as { data?: { status?: string; amount?: number } };
    const paid = verifyRes.ok && verifyData?.data?.status === 'success';
    const amount = verifyData?.data?.amount;
    // Paystack amounts are in the smallest subunit (KES cents).
    res.status(200).json(paid && typeof amount === 'number' ? { paid, value: amount / 100 } : { paid });
  } catch {
    res.status(200).json({ paid: false });
  }
}

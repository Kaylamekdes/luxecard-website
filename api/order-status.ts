import type { IncomingMessage, ServerResponse } from 'http';
import { recordPaidOrder, type PaystackOrderMetadata } from './_lib/orders.js';
import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

// The confirmation page polls this every couple of seconds while waiting
// for payment to land, so this needs real headroom - comfortably above
// what even an unusually long wait would produce for one genuine
// customer (or several sharing an office/mobile-carrier IP), while still
// capping a scripted flood (a miss here calls Paystack's own API too).
const MAX_ATTEMPTS_PER_IP = 60;
const WINDOW_MS = 5 * 60 * 1000;

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

  if (await isRateLimited('order-status', getClientIp(req), MAX_ATTEMPTS_PER_IP, WINDOW_MS)) {
    res.status(429).json({ error: 'Too many requests. Please try again in a few minutes.' });
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
    const verifyData = (await verifyRes.json()) as {
      data?: { status?: string; amount?: number; metadata?: PaystackOrderMetadata };
    };
    const paid = verifyRes.ok && verifyData?.data?.status === 'success';

    // Self-heal: Paystack confirms this was paid, but our own webhook
    // either hasn't landed yet or never will. Create the order right now,
    // with the exact same validation, alert and commission logic the
    // webhook itself uses (recordPaidOrder upserts on paystack_reference,
    // so if the webhook wins the race a moment later, or already did, this
    // is a safe no-op). Never lets a failure here affect the response the
    // customer's own confirmation page is waiting on.
    if (paid && verifyData.data?.metadata) {
      try {
        await recordPaidOrder(reference, verifyData.data.metadata, 'order-status');
      } catch (err) {
        console.error('order-status self-heal failed:', err);
      }
    }

    const amount = verifyData?.data?.amount;
    // Paystack amounts are in the smallest subunit (KES cents).
    res.status(200).json(paid && typeof amount === 'number' ? { paid, value: amount / 100 } : { paid });
  } catch {
    res.status(200).json({ paid: false });
  }
}

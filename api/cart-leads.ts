import type { IncomingMessage, ServerResponse } from 'http';
import { sendTeamEmail, describeItems, formatKes } from './_lib/email.js';
import { cleanString, isEmail, isHoneypotTripped, oneHourAgo, MAX_MESSAGE, MAX_SHORT } from './_lib/input.js';
import { computeAuthoritativeTotals, type CheckoutItem } from './_lib/pricing.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

type CartLeadBody = {
  type?: unknown;
  fullName?: unknown;
  jobTitle?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  items?: unknown;
  message?: unknown;
  hp?: unknown;
};

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const MAX_ITEMS = 20;
const MAX_QUANTITY = 10000;
const MAX_LEADS_PER_EMAIL_PER_HOUR = 10;
// Stops a bot spamming business submissions from burning the email quota
// and burying real enquiries; the lead is still saved, only the email skips.
const MAX_BUSINESS_ALERTS_PER_HOUR = 20;

// Add-to-cart is never blocked by this route: the browser adds to the cart
// first and calls this fire-and-forget. A failed save is logged here, and a
// business submission still emails the team even if the save failed, since
// it carries a message that needs a reply.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body: CartLeadBody;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as CartLeadBody);
  } catch {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  // A bot filled the hidden field: pretend it worked and store nothing.
  if (isHoneypotTripped(body?.hp)) {
    res.status(200).json({ ok: true });
    return;
  }

  const type = body?.type === 'individual' || body?.type === 'business' ? body.type : null;
  const fullName = cleanString(body?.fullName, MAX_SHORT);
  const jobTitle = cleanString(body?.jobTitle, MAX_SHORT);
  const company = cleanString(body?.company, MAX_SHORT);
  const email = cleanString(body?.email, MAX_SHORT).toLowerCase();
  const phone = cleanString(body?.phone, 50);
  const message = cleanString(body?.message, MAX_MESSAGE);

  if (!type || !fullName || !phone || !isEmail(email)) {
    res.status(400).json({ error: 'Missing or invalid name, email, or phone.' });
    return;
  }

  const rawItems = Array.isArray(body?.items) ? body.items.slice(0, MAX_ITEMS) : [];
  const items: CheckoutItem[] = rawItems.map((item: { name?: unknown; subOption?: unknown; quantity?: unknown }) => ({
    name: cleanString(item?.name, MAX_SHORT),
    subOption: cleanString(item?.subOption, MAX_SHORT) || undefined,
    quantity: typeof item?.quantity === 'number' ? Math.min(item.quantity, MAX_QUANTITY) : 0,
  }));

  let total: number;
  try {
    total = computeAuthoritativeTotals(items).total;
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid items.' });
    return;
  }

  let saved = false;
  let sendAlert = type === 'business';

  try {
    const supabase = getSupabaseAdmin();
    const since = oneHourAgo();

    const { count: fromThisEmail } = await supabase
      .from('cart_leads')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', since);
    if ((fromThisEmail ?? 0) >= MAX_LEADS_PER_EMAIL_PER_HOUR) {
      res.status(429).json({ error: 'Too many submissions. Please try again later.' });
      return;
    }

    if (type === 'business') {
      const { count: recentBusiness } = await supabase
        .from('cart_leads')
        .select('id', { count: 'exact', head: true })
        .eq('type', 'business')
        .gte('created_at', since);
      if ((recentBusiness ?? 0) >= MAX_BUSINESS_ALERTS_PER_HOUR) {
        console.error('Business alert email skipped: hourly alert limit reached.');
        sendAlert = false;
      }
    }

    const { error } = await supabase.from('cart_leads').insert({
      type,
      full_name: fullName,
      job_title: jobTitle || null,
      company: company || null,
      email,
      phone,
      items,
      total,
      message: message || null,
    });
    if (error) {
      console.error('Failed to save cart lead:', error);
    } else {
      saved = true;
    }
  } catch (err) {
    console.error('Failed to save cart lead:', err);
  }

  if (sendAlert) {
    await sendTeamEmail({
      subject: `New business enquiry: ${company || fullName}`,
      heading: 'New business enquiry (items added to cart)',
      rows: [
        ['Organization', company],
        ['Contact', fullName],
        ['Email', email],
        ['Phone', phone],
        ['Items', describeItems(items)],
        ['Total', formatKes(total)],
        ['Message', message],
      ],
      note: saved ? undefined : 'This enquiry could NOT be saved to Supabase, so this email is the only record of it.',
      replyTo: email,
    });
  }

  if (!saved) {
    res.status(500).json({ error: 'Could not save.' });
    return;
  }
  res.status(200).json({ ok: true });
}

import type { IncomingMessage, ServerResponse } from 'http';
import { sendTeamEmail, describeItems, formatKes } from './_lib/email.js';
import { cleanString, isEmail, isHoneypotTripped, oneHourAgo, MAX_MESSAGE, MAX_SHORT } from './_lib/input.js';
import { readEtims } from './_lib/kra.js';
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
  needsEtims?: unknown;
  kraPin?: unknown;
  kraBusinessName?: unknown;
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

  // eTIMS details only exist on business submissions; anything sent with an
  // individual one (or without the box ticked) is discarded, not stored.
  const etimsResult =
    type === 'business' ? readEtims(body?.needsEtims, body?.kraPin, body?.kraBusinessName) : { etims: null };
  if ('error' in etimsResult) {
    res.status(400).json({ error: etimsResult.error });
    return;
  }
  const { etims } = etimsResult;

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
      // Only sent when requested, so ordinary leads don't depend on these columns.
      ...(etims ? { needs_etims: true, kra_pin: etims.kraPin, kra_business_name: etims.businessName } : {}),
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
      subject: `New business enquiry${etims ? ' (eTIMS invoice requested)' : ''}: ${company || fullName}`,
      heading: 'New business enquiry (items added to cart)',
      rows: [
        ['Organization', company],
        ['Contact', fullName],
        ['Email', email],
        ['Phone', phone],
        ['Items', describeItems(items)],
        ['Total', formatKes(total)],
        ['Message', message],
        ...(etims
          ? ([
              ['eTIMS invoice', 'REQUESTED'],
              ['KRA PIN', etims.kraPin],
              ['Registered business name', etims.businessName],
            ] as [string, string][])
          : []),
      ],
      note:
        [
          etims ? `eTIMS invoice requested with this enquiry: issue a tax invoice to KRA PIN ${etims.kraPin}, business name ${etims.businessName} once they pay.` : '',
          saved ? '' : 'This enquiry could NOT be saved to Supabase, so this email is the only record of it.',
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      replyTo: email,
    });
  }

  if (!saved) {
    res.status(500).json({ error: 'Could not save.' });
    return;
  }
  res.status(200).json({ ok: true });
}

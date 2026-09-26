import crypto from 'crypto';

// Meta Conversions API: the server-side Purchase, sent from the Paystack
// webhook only for customers who accepted cookies. It shares its event_id
// (the Paystack reference) with the browser Pixel's Purchase, so Meta counts
// each purchase once.
//
// Env: META_CAPI_TOKEN (server-only access token, never VITE_-prefixed) and
// the Pixel ID (META_PIXEL_ID, falling back to the browser's
// VITE_META_PIXEL_ID so only one ID has to be configured). Optional
// META_TEST_EVENT_CODE routes events to Events Manager > Test events.
const GRAPH_API_VERSION = 'v26.0';
const TIMEOUT_MS = 4000;

export type MetaPurchase = {
  reference: string;
  value: number;
  email: string;
  phone: string;
  items: { name: string; quantity: number }[];
  eventSourceUrl?: string | null;
  clientUserAgent?: string | null;
  clientIpAddress?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

// Meta: trim + lowercase before hashing.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Meta: digits only, including the country code, no leading zeros or "+".
// Kenyan numbers are often typed locally (0712 345 678 or 712 345 678), so
// those get the 254 prefix.
export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9 && /^[17]/.test(digits)) return `254${digits}`;
  return digits;
}

// Never throws and never blocks for long: a failed or slow Meta call is
// logged and ignored, so it can't affect saving the order or the webhook
// response.
export async function sendMetaPurchase(purchase: MetaPurchase): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = process.env.META_PIXEL_ID ?? process.env.VITE_META_PIXEL_ID;
  if (!token || !pixelId) return;

  const phone = normalizePhone(purchase.phone);
  const userData: Record<string, unknown> = {
    em: [sha256(normalizeEmail(purchase.email))],
    ...(phone ? { ph: [sha256(phone)] } : {}),
    ...(purchase.clientUserAgent ? { client_user_agent: purchase.clientUserAgent } : {}),
    ...(purchase.clientIpAddress ? { client_ip_address: purchase.clientIpAddress } : {}),
    ...(purchase.fbp ? { fbp: purchase.fbp } : {}),
    ...(purchase.fbc ? { fbc: purchase.fbc } : {}),
  };

  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: purchase.reference,
        action_source: 'website',
        ...(purchase.eventSourceUrl ? { event_source_url: purchase.eventSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          value: purchase.value,
          currency: 'KES',
          content_type: 'product',
          contents: purchase.items.map((i) => ({ id: i.name, quantity: i.quantity })),
          num_items: purchase.items.reduce((n, i) => n + i.quantity, 0),
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
    access_token: token,
  };

  // A plain timer (rather than AbortSignal.timeout, whose timer doesn't keep
  // the process alive on its own) so the cut-off always fires.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(pixelId)}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      // Meta's error body names the problem; it contains no customer data.
      console.error('Meta Conversions API rejected Purchase:', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    const reason = controller.signal.aborted ? controller.signal.reason : err;
    console.error('Meta Conversions API call failed:', reason instanceof Error ? reason.message : reason);
  } finally {
    clearTimeout(timer);
  }
}

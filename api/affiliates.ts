import type { IncomingMessage, ServerResponse } from 'http';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

type AffiliateSignupBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  social?: string;
};

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const MAX_REFERRAL_CODE_ATTEMPTS = 5;
// Postgres unique_violation — used here to retry on a referral_code collision.
const UNIQUE_VIOLATION = '23505';

function generateReferralCode(fullName: string): string {
  const base =
    fullName
      .split(/\s+/)[0]
      ?.replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 8) || 'LUXE';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${suffix}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body: AffiliateSignupBody;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as AffiliateSignupBody);
  } catch {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  const fullName = body?.fullName?.trim();
  const email = body?.email?.trim();
  const phone = body?.phone?.trim();
  const social = body?.social?.trim();

  if (!fullName || !email || !phone) {
    res.status(400).json({ error: 'Missing full name, email, or phone.' });
    return;
  }

  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < MAX_REFERRAL_CODE_ATTEMPTS; attempt++) {
    const referralCode = generateReferralCode(fullName);
    // New affiliates start 'pending': their referral_code exists but is not
    // yet honored at checkout (see paystack-webhook.ts) until this is
    // flipped to 'active' by hand in Supabase.
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        name: fullName,
        email,
        phone,
        social_handle: social || null,
        referral_code: referralCode,
        status: 'pending',
      })
      .select('referral_code, status')
      .single();

    if (!error && data) {
      res.status(200).json({ referralCode: data.referral_code, status: data.status });
      return;
    }

    if (error?.code !== UNIQUE_VIOLATION) {
      console.error('Failed to insert affiliate:', error);
      res.status(500).json({ error: 'Could not complete signup. Please try again.' });
      return;
    }
    // Otherwise: referral_code collision, loop and try a freshly generated one.
  }

  res.status(500).json({ error: 'Could not generate a unique referral code. Please try again.' });
}

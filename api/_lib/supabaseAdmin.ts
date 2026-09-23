import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Server-only client using the service_role key, which bypasses Row Level
// Security entirely. This must never be imported from any src/ file that
// ends up in the browser bundle — only from api/ serverless functions.
// Deliberately reads plain (non-VITE_-prefixed) env vars: those are only
// ever set in the Vercel serverless environment, not exposed to Vite's
// client build.
let cached: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (cached) return cached;

  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the server environment.');
  }

  cached = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

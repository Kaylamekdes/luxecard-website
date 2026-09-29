import type { IncomingMessage } from 'http';
import { getSupabaseAdmin } from './supabaseAdmin.js';

// Shared per-key (usually an IP; cart-leads.ts/affiliates.ts also use this
// for a per-email check alongside their own) rate limiter, backed by the
// rate_limit_hits table (migration 0006). Records this attempt regardless
// of outcome, so a sustained flood stays capped instead of aging back
// under the limit between bursts.
export async function isRateLimited(route: string, key: string, max: number, windowMs: number): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - windowMs).toISOString();

  const { count } = await supabase
    .from('rate_limit_hits')
    .select('id', { count: 'exact', head: true })
    .eq('route', route)
    .eq('key', key)
    .gte('created_at', since);

  // Fire-and-forget: recording the hit must never be why a request fails.
  supabase
    .from('rate_limit_hits')
    .insert({ route, key })
    .then(({ error }) => {
      if (error) console.error(`Failed to record rate-limit hit for ${route}:`, error);
    });

  return (count ?? 0) >= max;
}

// The client's own address, from the header Vercel sets from the real
// connecting IP - the first entry is the actual client; anything after it
// was added by intermediate proxies. 'unknown' (rather than throwing) for
// a request that somehow arrives without one, so a limiter never blocks
// everyone over a missing header.
export function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = first?.split(',')[0]?.trim();
  return ip || 'unknown';
}

-- LuxeCard: a ready-to-copy referral link on every affiliate.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- referral_link is a generated column: Postgres computes it from
-- referral_code, so it can never drift out of sync and needs no code changes
-- to populate. Existing affiliates get it automatically.
-- (Codes are only A-Z and 0-9, so no URL-encoding is needed.)
-- RLS is unchanged: the table stays reachable only through the server.

alter table public.affiliates
  add column if not exists referral_link text
  generated always as ('https://www.luxecard.co.ke/?ref=' || referral_code) stored;

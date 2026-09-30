-- ============================================================
-- LuxeCard: a shared table for per-IP rate limiting
--
-- Run once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: every statement is idempotent.
--
-- Used by api/checkout.ts and api/order-status.ts (which have no other
-- table of their own to count against) and, alongside the existing
-- per-email checks, by cart-leads.ts and affiliates.ts. Every row is just
-- one attempt at one route from one IP; nothing here is customer data.
-- ============================================================

create table if not exists public.rate_limit_hits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  route text not null,
  key text not null -- an IP address (or, for the existing per-email checks, an email).
);

-- RLS on with no policies = neither anon nor authenticated can read or
-- write this table at all. Only service_role (server-side) can.
alter table public.rate_limit_hits enable row level security;
revoke all on table public.rate_limit_hits from anon, authenticated;

create index if not exists rate_limit_hits_route_key_created_idx
  on public.rate_limit_hits (route, key, created_at desc);

-- Housekeeping: rows are only ever queried within their own short window
-- (minutes), so anything older is just dead weight. Cleaned up daily by
-- api/reconcile-orders.ts (deletes rows older than 1 day) rather than by a
-- schema-level job, so it's visible alongside that cron's other work.

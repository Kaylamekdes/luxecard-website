-- ============================================================
-- LuxeCard: eTIMS tax-invoice details on orders and cart leads
--
-- Run once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: every statement is idempotent.
--
-- Captured on the business ("for teams") order form when the customer ticks
-- "I need an eTIMS tax invoice". The KRA PIN format (^[A-Z][0-9]{9}[A-Z]$)
-- is enforced by the API routes on purpose, NOT by a CHECK constraint here:
-- a constraint could reject the insert of an order the customer has already
-- paid for.
--
-- Row Level Security is unchanged: both tables already have it enabled with
-- no public access, so these columns are only reachable through the
-- server-side API routes (service_role).
-- ============================================================

alter table public.orders
  add column if not exists needs_etims boolean not null default false,
  add column if not exists kra_pin text,
  add column if not exists kra_business_name text;

alter table public.cart_leads
  add column if not exists needs_etims boolean not null default false,
  add column if not exists kra_pin text,
  add column if not exists kra_business_name text;

-- Lets the team list "orders that still need an invoice" quickly.
create index if not exists orders_needs_etims_idx
  on public.orders (created_at desc)
  where needs_etims;

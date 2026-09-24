-- ============================================================
-- LuxeCard: cart_leads table + close the public-insert holes
--
-- Run once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: every statement is idempotent.
--
-- Every write to the database now goes through a server-side API route
-- (api/*.ts) using the service_role key, which bypasses Row Level
-- Security. The public (anon) key therefore needs no access at all.
-- ============================================================

-- ---------------------------------------------------------------
-- cart_leads: every "Add to Cart" form submission (individual and
-- business tabs), so abandoned carts can be compared with paid orders.
-- Compare by email:  lower(orders.customer_email) = cart_leads.email
-- (cart_leads.email is stored lowercased).
-- ---------------------------------------------------------------
create table if not exists public.cart_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('individual', 'business')),
  -- Individual tab: the person. Business tab: the contact person.
  full_name text not null,
  job_title text,
  -- Individual tab: company. Business tab: organization name.
  company text,
  email text not null,
  phone text not null,
  -- [{ "name": "Wood", "subOption": "Black", "quantity": 2 }, ...]
  items jsonb not null,
  -- Recomputed on the server from the price list, never taken from the browser.
  total numeric(12, 2) not null,
  -- Business tab "Message / Notes" only.
  message text
);

-- RLS on with NO policies = the anon and authenticated roles can neither
-- read nor write this table. Only service_role (server-side) can.
alter table public.cart_leads enable row level security;

-- Belt and braces: also remove the table privileges Supabase grants to
-- the public roles by default.
revoke all on table public.cart_leads from anon, authenticated;

create index if not exists cart_leads_email_created_idx on public.cart_leads (email, created_at desc);
create index if not exists cart_leads_created_at_idx on public.cart_leads (created_at desc);

-- Lets you match orders to leads by email without a full table scan.
create index if not exists orders_customer_email_lower_idx on public.orders (lower(customer_email));

-- ---------------------------------------------------------------
-- Drop the public-insert policies from 0001.
--
-- With them, anyone holding the public key (it ships in the site's
-- JavaScript) could insert rows straight into these tables from their
-- browser: e.g. an affiliate with status 'active' (skipping approval)
-- or a fake 'paid' order. Nothing in the site needs them: signups, the
-- webhook and the order-status check all use the service_role key.
-- ---------------------------------------------------------------
drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "affiliates_insert_public" on public.affiliates;

-- ============================================================
-- LuxeCard: checkout + affiliate tracking schema
--
-- Run this once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run), or via
-- `supabase db push` if the project is linked with the CLI.
--
-- Scope: schema + Row Level Security only. No Paystack integration
-- or affiliate code-generation logic is wired up by this migration.
-- ============================================================

-- Needed for gen_random_uuid() below.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- affiliates
-- ---------------------------------------------------------------
create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  social_handle text,
  referral_code text not null unique,
  status text not null default 'pending' check (status in ('active', 'pending'))
);

alter table public.affiliates enable row level security;

-- The public site can create a new affiliate signup...
create policy "affiliates_insert_public"
  on public.affiliates
  for insert
  to anon
  with check (true);

-- ...but cannot select, update, or delete affiliate records. With RLS
-- enabled and no such policy, those operations are denied by default
-- for the anon role, which keeps every affiliate's contact details and
-- referral code out of reach of anyone just browsing the site.

-- ---------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  company text,
  items jsonb not null,
  subtotal numeric(12, 2) not null,
  discount_applied boolean not null default false,
  total numeric(12, 2) not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  paystack_reference text,
  referral_code text references public.affiliates (referral_code)
);

alter table public.orders enable row level security;

-- The public site can create a new order at checkout...
create policy "orders_insert_public"
  on public.orders
  for insert
  to anon
  with check (true);

-- ...but customer PII, payment status, and the Paystack reference are
-- not publicly readable or editable (no select/update/delete policy
-- for anon).

-- ---------------------------------------------------------------
-- referral_commissions
-- ---------------------------------------------------------------
create table if not exists public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  affiliate_id uuid not null references public.affiliates (id),
  order_id uuid not null references public.orders (id),
  commission_amount numeric(12, 2) not null,
  payout_status text not null default 'unpaid' check (payout_status in ('unpaid', 'paid'))
);

alter table public.referral_commissions enable row level security;

-- Purely internal bookkeeping between the other two tables: no insert,
-- select, update, or delete policy for anon at all. This table is only
-- ever meant to be touched by trusted backend/admin logic using the
-- service_role key, which bypasses RLS entirely — never by the public
-- site.

-- ---------------------------------------------------------------
-- Indexes for the lookups this app will actually do
-- ---------------------------------------------------------------
create index if not exists orders_referral_code_idx on public.orders (referral_code);
create index if not exists orders_paystack_reference_idx on public.orders (paystack_reference);
create index if not exists referral_commissions_affiliate_id_idx on public.referral_commissions (affiliate_id);
create index if not exists referral_commissions_order_id_idx on public.referral_commissions (order_id);

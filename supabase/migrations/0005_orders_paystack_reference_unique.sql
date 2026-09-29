-- ============================================================
-- LuxeCard: make orders.paystack_reference UNIQUE
--
-- Run once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
--
-- Before running this: check for existing duplicates first (a webhook
-- retry racing an earlier insert, before this fix, could in theory have
-- created two rows for the same reference). Run this query on its own
-- first and confirm it returns no rows:
--
--   select paystack_reference, count(*)
--   from public.orders
--   where paystack_reference is not null
--   group by paystack_reference
--   having count(*) > 1;
--
-- If it DOES return rows, resolve those duplicates by hand (decide which
-- row to keep per reference, delete the other(s)) before running the
-- ALTER TABLE below - it will fail with a clear error rather than
-- silently doing the wrong thing if any duplicates still exist, but it's
-- cleaner to check first.
-- ============================================================

-- The old plain (non-unique) index is superseded by the unique constraint
-- below, which creates its own index - no need to keep both.
drop index if exists public.orders_paystack_reference_idx;

alter table public.orders
  add constraint orders_paystack_reference_key unique (paystack_reference);

-- Postgres treats every NULL as distinct from every other NULL, so this
-- constraint does NOT block multiple orders that have no reference yet -
-- only genuine duplicate reference values are rejected.

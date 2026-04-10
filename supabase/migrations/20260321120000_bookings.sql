-- Boat rental booking data — PostgreSQL (Supabase)
-- Run in Supabase SQL editor or via `supabase db push` after linking the project.

-- Extensions (gen_random_uuid) — usually enabled on Supabase; safe if already present
create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Contact (from booking form)
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,

  -- Schedule
  rental_start timestamptz not null,
  duration_hours integer not null check (duration_hours >= 2),

  -- Pricing snapshot at submit time (display + optional cents)
  quoted_price_display text not null,
  quoted_price_cents integer,

  -- Lifecycle
  status text not null default 'draft'
    check (status in ('draft', 'pending_payment', 'paid', 'cancelled', 'completed')),

  -- Stripe (fill after checkout integration)
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,

  -- Extra JSON for notes, marketing consent, device info, etc.
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists bookings_email_idx on public.bookings (lower(email));
create index if not exists bookings_rental_start_idx on public.bookings (rental_start);
create index if not exists bookings_status_idx on public.bookings (status);

comment on table public.bookings is 'Customer booking requests; payment fields populated after Stripe checkout.';

-- Optional: add an updated_at trigger in Supabase (SQL editor) if you want auto-bumps on UPDATE.

-- Row Level Security: enable in Supabase when you add auth / policies.
-- alter table public.bookings enable row level security;
-- Inserts from Next.js should use a Route Handler + service role key (bypasses RLS),
-- or define policies for anon/authenticated roles as needed.

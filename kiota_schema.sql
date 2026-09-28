-- =====================================================================
-- KIOTA — Supabase schema + Row-Level Security
-- Run this whole file in Supabase Dashboard → SQL Editor → New query
-- =====================================================================

-- ---------- ENUM TYPES ----------
create type user_role as enum ('seeker', 'poster', 'admin');
create type verification_status as enum ('unverified', 'pending_verification', 'verified', 'rejected');
create type listing_category as enum ('rental', 'shop_office', 'airbnb');
create type listing_status as enum ('pending', 'approved', 'rejected');
create type trust_tier as enum ('bronze', 'silver', 'gold', 'platinum');
create type unlock_channel as enum ('paystack_mpesa', 'manual_mpesa');
create type payout_status as enum ('pending', 'released', 'frozen', 'refunded');

-- =====================================================================
-- USERS
-- One row per app user, linked 1:1 to Supabase Auth (auth.users).
-- `role` and `trust_score`/`trust_tier` are server-controlled — see
-- the trigger below that blocks clients from changing them directly.
-- =====================================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique not null,
  name text not null,
  email text,
  role user_role not null default 'seeker',
  verification_status verification_status not null default 'unverified',
  national_id_masked text,               -- store only a masked version (e.g. "1234****"), never the full ID
  trust_score integer not null default 0,
  trust_tier trust_tier not null default 'bronze',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only ONE super admin should ever be seeded manually by you, directly in
-- the Supabase table editor or via a one-off SQL update — never through
-- client-facing signup code, and never based on a "magic phrase".

-- =====================================================================
-- LISTINGS
-- =====================================================================
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references public.users(id) on delete cascade,
  category listing_category not null,
  title text not null,
  description text,
  area text not null,
  price numeric not null,                -- the rent/sale price shown to seekers
  unlock_price numeric not null,         -- what a seeker pays to unlock (KES 100–400)
  status listing_status not null default 'pending',
  rejection_reason text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  is_platinum_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_idx on public.listings(status);
create index listings_poster_idx on public.listings(poster_id);
create index listings_category_idx on public.listings(category);

-- =====================================================================
-- MEDIA
-- Photos/video attached to a listing. file_hash enables duplicate-image
-- detection during admin review (flagging recycled photos).
-- =====================================================================
create table public.media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  media_type text not null check (media_type in ('photo', 'video')),
  file_hash text,
  created_at timestamptz not null default now()
);

create index media_listing_idx on public.media(listing_id);
create index media_hash_idx on public.media(file_hash);

-- =====================================================================
-- UNLOCKS
-- One row per seeker unlocking a listing. Rows here should ONLY ever be
-- inserted by your Paystack webhook handler (using the service role key),
-- never directly by a client — see RLS policies below.
-- =====================================================================
create table public.unlocks (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seeker_id uuid not null references public.users(id) on delete cascade,
  amount_paid numeric not null,
  payment_reference text not null unique,   -- Paystack transaction reference
  channel unlock_channel not null default 'paystack_mpesa',
  verified boolean not null default false,  -- only true after server-side Paystack verification
  reported boolean not null default false,
  report_reason text,
  created_at timestamptz not null default now()
);

create index unlocks_listing_idx on public.unlocks(listing_id);
create index unlocks_seeker_idx on public.unlocks(seeker_id);

-- =====================================================================
-- PAYOUTS
-- One row per host earn-share, tied to an unlock. Also service-role-only
-- to write; this is where the 24–48h payout delay lives (release_at).
-- =====================================================================
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  unlock_id uuid not null references public.unlocks(id) on delete cascade,
  host_id uuid not null references public.users(id) on delete cascade,
  amount numeric not null,
  tier_at_time trust_tier not null,
  status payout_status not null default 'pending',
  release_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index payouts_host_idx on public.payouts(host_id);
create index payouts_status_idx on public.payouts(status);

-- =====================================================================
-- HELPER: is_admin() — used inside RLS policies below
-- =====================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =====================================================================
-- TRIGGER: protect role / trust_score / trust_tier from client edits
-- RLS is row-level, not column-level — this trigger is what stops a user
-- from setting their own role to 'admin' via a normal update call.
-- =====================================================================
create or replace function public.protect_privileged_user_columns()
returns trigger
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.trust_score := old.trust_score;
    new.trust_tier := old.trust_tier;
    new.verification_status := old.verification_status;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_privileged_user_columns_trg
before update on public.users
for each row execute function public.protect_privileged_user_columns();

-- Same idea for listings: only admins can change status/review fields.
create or replace function public.protect_listing_review_columns()
returns trigger
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    new.status := old.status;
    new.rejection_reason := old.rejection_reason;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_listing_review_columns_trg
before update on public.listings
for each row execute function public.protect_listing_review_columns();

-- =====================================================================
-- ENABLE ROW-LEVEL SECURITY
-- =====================================================================
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.media enable row level security;
alter table public.unlocks enable row level security;
alter table public.payouts enable row level security;

-- ---------- USERS policies ----------
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.users for select
  using (public.is_admin());

create policy "Users can insert their own profile on signup"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);
  -- role/trust_score/trust_tier/verification_status are still protected
  -- by the trigger above even though this policy allows the update call.

-- ---------- LISTINGS policies ----------
create policy "Anyone can view approved listings"
  on public.listings for select
  using (status = 'approved');

create policy "Posters can view their own listings regardless of status"
  on public.listings for select
  using (auth.uid() = poster_id);

create policy "Admins can view all listings"
  on public.listings for select
  using (public.is_admin());

create policy "Authenticated users can create a listing"
  on public.listings for insert
  with check (auth.uid() = poster_id);

create policy "Posters can update their own pending listing"
  on public.listings for update
  using (auth.uid() = poster_id and status = 'pending');

create policy "Admins can update any listing"
  on public.listings for update
  using (public.is_admin());

-- ---------- MEDIA policies ----------
create policy "Media visible if its listing is visible"
  on public.media for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'approved' or l.poster_id = auth.uid() or public.is_admin())
    )
  );

create policy "Posters can add media to their own listing"
  on public.media for insert
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.poster_id = auth.uid()
    )
  );

-- ---------- UNLOCKS policies ----------
-- Deliberately NO client-facing insert policy — unlocks may only be
-- written by your Paystack webhook function using the service role key,
-- which bypasses RLS entirely. This is what fixes "anyone can unlock
-- for free": there is no path for a browser to create an unlock row.
create policy "Seekers can view their own unlocks"
  on public.unlocks for select
  using (auth.uid() = seeker_id);

create policy "Hosts can view unlocks on their own listings"
  on public.unlocks for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.poster_id = auth.uid()
    )
  );

create policy "Admins can view all unlocks"
  on public.unlocks for select
  using (public.is_admin());

-- ---------- PAYOUTS policies ----------
-- Also no client-facing insert/update policy — payouts are only written
-- by server-side logic (the webhook function + a scheduled release job).
create policy "Hosts can view their own payouts"
  on public.payouts for select
  using (auth.uid() = host_id);

create policy "Admins can view all payouts"
  on public.payouts for select
  using (public.is_admin());

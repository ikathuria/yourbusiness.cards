-- YourBusiness.Cards — initial schema (Milestone 3)
-- Tables: accounts, business_cards, card_links, card_views
-- RLS: public read on PUBLISHED cards only; owner-scoped writes.
-- Run via Supabase SQL Editor or `supabase db push`.

-- ─────────────────────────── Tables ───────────────────────────

create table if not exists public.accounts (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_cards (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts (id) on delete cascade, -- nullable: demo/seed cards have no owner
  slug text not null unique,
  template_id text not null default 'aurora',
  theme_overrides jsonb not null default '{}'::jsonb,
  business_name text not null,
  tagline text,
  description text,
  logo_url text,
  cover_url text,
  contact jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9-]+$')
);
create index if not exists business_cards_account_id_idx on public.business_cards (account_id);
create index if not exists business_cards_slug_idx on public.business_cards (slug);

create table if not exists public.card_links (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.business_cards (id) on delete cascade,
  label text not null,
  url text not null,
  icon text,
  position int not null default 0
);
create index if not exists card_links_card_id_idx on public.card_links (card_id);

create table if not exists public.card_views (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.business_cards (id) on delete cascade,
  source text not null default 'link' check (source in ('link', 'qr')),
  created_at timestamptz not null default now()
);
create index if not exists card_views_card_id_idx on public.card_views (card_id);

-- ─────────────────────── Triggers / functions ───────────────────────

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists business_cards_set_updated_at on public.business_cards;
create trigger business_cards_set_updated_at
before update on public.business_cards
for each row execute function public.set_updated_at();

-- auto-create an account row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.accounts (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;
-- security-definer trigger fn must not be callable via the Data API
revoke execute on function public.handle_new_user() from anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ─────────────────────────── RLS ───────────────────────────

alter table public.accounts enable row level security;
alter table public.business_cards enable row level security;
alter table public.card_links enable row level security;
alter table public.card_views enable row level security;

-- accounts: owner only
create policy "accounts_select_own" on public.accounts
  for select to authenticated using (id = (select auth.uid()));
create policy "accounts_update_own" on public.accounts
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- business_cards: anyone may read PUBLISHED cards; owners do everything to their own
create policy "cards_public_read" on public.business_cards
  for select to anon, authenticated using (published = true);
create policy "cards_owner_read" on public.business_cards
  for select to authenticated using (account_id = (select auth.uid()));
create policy "cards_owner_insert" on public.business_cards
  for insert to authenticated with check (account_id = (select auth.uid()));
create policy "cards_owner_update" on public.business_cards
  for update to authenticated using (account_id = (select auth.uid())) with check (account_id = (select auth.uid()));
create policy "cards_owner_delete" on public.business_cards
  for delete to authenticated using (account_id = (select auth.uid()));

-- card_links: readable when the parent card is published; owners manage their own
create policy "links_public_read" on public.card_links
  for select to anon, authenticated
  using (exists (select 1 from public.business_cards c where c.id = card_id and c.published));
create policy "links_owner_all" on public.card_links
  for all to authenticated
  using (exists (select 1 from public.business_cards c where c.id = card_id and c.account_id = (select auth.uid())))
  with check (exists (select 1 from public.business_cards c where c.id = card_id and c.account_id = (select auth.uid())));

-- card_views: anyone may log a view; only the card owner may read them
create policy "views_insert_any" on public.card_views
  for insert to anon, authenticated with check (true);
create policy "views_owner_read" on public.card_views
  for select to authenticated
  using (exists (select 1 from public.business_cards c where c.id = card_id and c.account_id = (select auth.uid())));

-- ─────────────────────── Data API grants ───────────────────────
-- (RLS controls rows; these grant table access to the API roles.)
grant select on public.business_cards to anon, authenticated;
grant select on public.card_links to anon, authenticated;
grant insert on public.card_views to anon, authenticated;
grant select, insert, update, delete on public.business_cards to authenticated;
grant select, insert, update, delete on public.card_links to authenticated;
grant select, insert on public.card_views to authenticated;
grant select, update on public.accounts to authenticated;

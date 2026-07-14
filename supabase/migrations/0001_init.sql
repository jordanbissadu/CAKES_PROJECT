-- IDI's Cakes — initial schema (products + orders) with RLS.
-- Run in the Supabase SQL editor (or `supabase db push`).

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- products (catalogue)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  category    text not null default 'gateaux'
              check (category in ('gateaux', 'divers')),
  description text,
  base_price  integer,                      -- in F (whole number)
  price_label text,                         -- e.g. "dès 6 000F", "6 pour 5 000F"
  badge       text,                         -- e.g. "Best-seller", "Nouveau"
  flavors     text[],
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  cake             text not null,
  cake_sub         text,
  portions         text,
  mode             text not null default 'retrait'
                   check (mode in ('retrait', 'livraison')),
  delivery_address text,
  fulfillment_date date,
  fulfillment_time text,
  status           text not null default 'nouvelle'
                   check (status in ('nouvelle', 'apreparer', 'enpreparation', 'prete', 'annulee')),
  amount           integer,                 -- in F
  message          text,
  allergenes       text[],
  source           text not null default 'web'
                   check (source in ('web', 'manuel')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_date_idx on public.orders (fulfillment_date);
create index if not exists orders_created_idx on public.orders (created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Human-friendly order numbers (#C-2052, #C-2053, …)
-- ---------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 2052;

create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number = '#C-' || nextval('public.order_number_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_set_number on public.orders;
create trigger orders_set_number
  before insert on public.orders
  for each row execute function public.set_order_number();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- products: anyone can read active products; staff (authenticated) manage them.
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (is_active = true);

drop policy if exists "products_staff_all" on public.products;
create policy "products_staff_all"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- orders: NO anon access. Only authenticated staff can read/update/insert.
-- Public inserts go through a Server Action using the service role key,
-- which bypasses RLS entirely.
drop policy if exists "orders_staff_read" on public.orders;
create policy "orders_staff_read"
  on public.orders for select
  to authenticated
  using (true);

drop policy if exists "orders_staff_write" on public.orders;
create policy "orders_staff_write"
  on public.orders for all
  to authenticated
  using (true)
  with check (true);

-- IDI's Cakes — site settings (single-row config), Phase 2.

create table if not exists public.settings (
  id             text primary key default 'main',
  phone_pretty   text not null default '+228 96 628 864',
  phone_tel      text not null default '+22896628864',
  tiktok         text not null default 'IDI''S CAKE',
  email          text default '',
  address        text default '',
  hours          text default 'Commandes à passer à l''avance',
  currency       text not null default 'F',
  hero_title     text not null default E'Des douceurs\nfaites main,',
  hero_accent    text not null default 'rien que pour toi.',
  hero_subtitle  text not null default 'Gâteaux, tartes et petites merveilles préparés chaque jour avec des ingrédients choisis et beaucoup de cœur, à IDI''s Cakes.',
  order_intro    text not null default 'Dis-nous ce dont tu rêves — le nom à écrire, le goût, la crème — et pour quand. On te répond vite avec un devis tout doux.',
  footer_tagline text not null default 'La pâtisserie faite avec le cœur',
  updated_at     timestamptz not null default now(),
  -- keep it a single row
  constraint settings_singleton check (id = 'main')
);

-- Seed the single row (id defaults to 'main').
insert into public.settings (id) values ('main')
on conflict (id) do nothing;

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- RLS: public can read (storefront), staff can update.
alter table public.settings enable row level security;

drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read"
  on public.settings for select
  using (true);

drop policy if exists "settings_staff_write" on public.settings;
create policy "settings_staff_write"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);

-- IDI's Cakes — add an image URL to products (catalogue admin, Phase 2).
alter table public.products
  add column if not exists image_url text;

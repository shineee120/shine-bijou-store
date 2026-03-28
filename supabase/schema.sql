create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  link_label text default 'Ver todo',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  long_description text,
  price integer not null default 0,
  compare_at_price integer,
  stock integer not null default 0,
  category_slug text not null references public.categories(slug) on update cascade,
  featured boolean not null default false,
  new_arrival boolean not null default false,
  best_seller boolean not null default false,
  show_tags_on_home boolean not null default false,
  sku text,
  tags jsonb not null default '[]'::jsonb,
  weight_grams integer not null default 0,
  images jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.manual_orders (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  channel text not null check (channel in ('manual', 'whatsapp', 'mercadopago')),
  status text not null check (status in ('pending', 'paid', 'preparing', 'delivered')),
  total integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.checkout_orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  channel text not null check (channel in ('whatsapp', 'mercadopago')),
  status text not null default 'pending',
  total integer not null default 0,
  items jsonb not null default '[]'::jsonb,
  shipping_data jsonb not null default '{}'::jsonb,
  customer_data jsonb not null default '{}'::jsonb,
  payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.home_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  cta_label text,
  cta_href text,
  secondary_label text,
  secondary_href text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categories add column if not exists link_label text default 'Ver todo';
alter table public.products add column if not exists show_tags_on_home boolean not null default false;
alter table public.home_banners add column if not exists cta_label text;
alter table public.home_banners add column if not exists cta_href text;
alter table public.home_banners add column if not exists secondary_label text;
alter table public.home_banners add column if not exists secondary_href text;
alter table public.home_banners add column if not exists image_url text;

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null,
  type text not null check (type in ('percentage', 'fixed')),
  value integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.categories (name, slug, description, featured, sort_order)
values
  ('Collares', 'collares', 'Cadenas delicadas, chokers y collares.', true, 1),
  ('Aros', 'aros', 'Argollas, aros mini y protagonistas.', true, 2),
  ('Pulseras', 'pulseras', 'Pulseras minimalistas y combinables.', false, 3),
  ('Conjuntos', 'conjuntos', 'Sets para regalar o combinar.', false, 4),
  ('Otros', 'otros', 'Novedades y accesorios especiales.', false, 5)
on conflict (slug) do nothing;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.manual_orders enable row level security;
alter table public.checkout_orders enable row level security;
alter table public.home_banners enable row level security;
alter table public.faq_items enable row level security;
alter table public.coupons enable row level security;

create policy "Public read categories"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Public read products"
on public.products
for select
to anon, authenticated
using (true);

create policy "Admins manage categories"
on public.categories
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage manual orders"
on public.manual_orders
for all
to authenticated
using (true)
with check (true);

create policy "Read and write checkout orders"
on public.checkout_orders
for all
to anon, authenticated
using (true)
with check (true);

create policy "Public read home banners"
on public.home_banners
for select
to anon, authenticated
using (true);

create policy "Public read faq items"
on public.faq_items
for select
to anon, authenticated
using (true);

create policy "Public read coupons"
on public.coupons
for select
to anon, authenticated
using (active = true);

create policy "Admins manage home banners"
on public.home_banners
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage faq items"
on public.faq_items
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage coupons"
on public.coupons
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('shine-products', 'shine-products', true)
on conflict (id) do nothing;

create policy "Public read product images"
on storage.objects
for select
to public
using (bucket_id = 'shine-products');

create policy "Authenticated upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'shine-products');

create policy "Authenticated update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'shine-products')
with check (bucket_id = 'shine-products');

-- ============================================================
-- Relocost.ru — initial schema (4 таблицы по ТЗ v1.0, раздел 2)
-- ============================================================

-- ---------- cities ----------
create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name_ru text not null,
  name_en text not null,
  slug text not null unique,
  country_ru text not null,
  country_en text not null,
  country_slug text not null,
  flag_emoji text,
  population text,
  climate text,
  language text,
  currency text,
  flight_from_moscow text,
  is_foreign boolean not null default false,
  difficulty_score smallint check (difficulty_score between 1 and 5),
  is_popular boolean not null default false,
  seo_title text,
  seo_description text,
  intro_text text,
  lat double precision,
  lng double precision,
  unsplash_photo_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cities_country_slug_idx on public.cities (country_slug);
create index cities_is_popular_idx on public.cities (is_popular) where is_popular = true;
create index cities_is_foreign_idx on public.cities (is_foreign);

-- ---------- prices ----------
create table public.prices (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete cascade,
  category text not null check (category in ('rent','food','transport','utilities','cafe','health','entertainment')),
  item_name_ru text not null,
  price_min integer not null check (price_min >= 0),
  price_max integer not null check (price_max >= price_min),
  is_premium boolean not null default false,
  updated_at timestamptz not null default now()
);

create index prices_city_id_idx on public.prices (city_id);
create index prices_city_category_idx on public.prices (city_id, category);

-- ---------- purchases ----------
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete restrict,
  package_type text not null check (package_type in ('places','guide','budget','bundle')),
  email text not null,
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  created_at timestamptz not null default now()
);

create index purchases_email_idx on public.purchases (email);
create index purchases_city_email_idx on public.purchases (city_id, email) where status = 'paid';
create index purchases_status_idx on public.purchases (status);

-- ---------- blog_posts ----------
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  city_id uuid references public.cities (id) on delete set null,
  country_slug text,
  tag text,
  read_time integer check (read_time > 0),
  content_md text not null,
  seo_title text,
  seo_description text,
  cover_unsplash_id text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index blog_posts_published_idx on public.blog_posts (published, created_at desc) where published = true;
create index blog_posts_city_id_idx on public.blog_posts (city_id);
create index blog_posts_country_slug_idx on public.blog_posts (country_slug);
create index blog_posts_tag_idx on public.blog_posts (tag);

-- ============================================================
-- updated_at триггеры
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger cities_set_updated_at before update on public.cities
  for each row execute function public.set_updated_at();

create trigger prices_set_updated_at before update on public.prices
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.cities enable row level security;
alter table public.prices enable row level security;
alter table public.purchases enable row level security;
alter table public.blog_posts enable row level security;

-- Публичное чтение каталога — для anon и authenticated
create policy "cities readable by anyone"
  on public.cities for select
  to anon, authenticated
  using (true);

create policy "prices readable by anyone"
  on public.prices for select
  to anon, authenticated
  using (true);

create policy "published blog_posts readable by anyone"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);

-- purchases — никаких политик для anon/authenticated, доступ только через service_role
-- (service_role минует RLS — используется в /api/payment/* серверных роутах)

-- Записи во все таблицы — только через service_role (без политик insert/update/delete для anon)

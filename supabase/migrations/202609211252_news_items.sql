-- ============================================================
-- Relocost.ru — раздел «Новости»: ежедневная подборка мировых новостей
-- (общих, не обязательно про релокацию), с CTA на оплату в каждой карточке.
-- ============================================================

create table public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  content_md text not null,
  category text,
  source_name text,
  source_url text,
  event_date date,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index news_items_published_idx on public.news_items (published, created_at desc) where published = true;
create index news_items_category_idx on public.news_items (category);

alter table public.news_items enable row level security;

create policy "published news_items readable by anyone"
  on public.news_items for select
  to anon, authenticated
  using (published = true);

-- Записи — только через service_role (без insert/update/delete политик для anon).

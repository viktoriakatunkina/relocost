-- Таблица сбора email-подписчиков (лид-магнит: чек-лист переезда).
-- Уникальность по email: повторный сабмит одного адреса — тихий no-op на уровне сервера.

create table if not exists email_leads (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  source     text,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_leads_email      on email_leads (email);
create index if not exists idx_email_leads_created_at on email_leads (created_at desc);

-- RLS: вставку разрешаем всем (anon тоже), чтение — только service_role.
alter table email_leads enable row level security;

create policy "anyone can insert email_leads"
  on email_leads for insert
  with check (true);

-- Чтение закрыто для anon, только service_role (admin-аналитика).

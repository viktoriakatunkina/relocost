-- Пакеты СТРАН в purchases (country_overview 29 ₽, country_cities 49 ₽)
--
-- Проблема (найдена 2026-09-09 боем на проде):
--   POST /api/payment/create {"slug":"georgia","pkg":"country_overview"}
--   → 404 {"error":"Город не найден"}
-- Маршрут искал город по slug, а таблица purchases физически не могла
-- хранить страновую покупку:
--   1) package_type check-constraint допускал только
--      ('places','guide','budget','bundle');
--   2) city_id — NOT NULL с FK на cities, а у страны города нет.
-- То есть оба страновых пакета были некупляемы с момента запуска
-- страниц стран. Проверено пробным insert'ом: 23514 (check) и 23502 (not null).
--
-- Миграция аддитивная: существующие городские покупки не трогает.
--
-- Применить: Supabase Studio → SQL Editor → выполнить целиком.

-- 1. Покупка страны не привязана к городу.
alter table public.purchases
  alter column city_id drop not null;

-- 2. Привязка к стране (slug из lib/countries-content.ts: georgia, serbia, …).
alter table public.purchases
  add column if not exists country_slug text;

-- 3. Разрешаем страновые типы пакетов. Имя ограничения — то, что даёт
--    Postgres по умолчанию для inline check в create table.
alter table public.purchases
  drop constraint if exists purchases_package_type_check;

alter table public.purchases
  add constraint purchases_package_type_check
  check (
    package_type in (
      'places', 'guide', 'budget', 'bundle',
      'country_cities', 'country_overview'
    )
  );

-- 4. У покупки обязан быть ровно один адресат — город ИЛИ страна.
alter table public.purchases
  drop constraint if exists purchases_target_check;

alter table public.purchases
  add constraint purchases_target_check
  check (
    (city_id is not null and country_slug is null)
    or (city_id is null and country_slug is not null)
  );

-- 5. Индекс под восстановление доступа по email (/api/payment/access).
create index if not exists purchases_country_email_idx
  on public.purchases (country_slug, email)
  where status = 'paid';

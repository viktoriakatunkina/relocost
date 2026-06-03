-- ============================================================
-- Relocost.ru — расширение cities полями Unsplash-атрибуции
-- ============================================================
-- Unsplash требует обязательной атрибуции авторов фото.
-- Существующего поля unsplash_photo_id недостаточно — добавляем url и автора.

alter table public.cities
  add column if not exists unsplash_url text,
  add column if not exists unsplash_author_name text,
  add column if not exists unsplash_author_url text;

comment on column public.cities.unsplash_url is 'Base URL фото (без размерных параметров) — будем дополнять &w=&q= на лету';
comment on column public.cities.unsplash_author_name is 'Имя автора фото, отображается в атрибуции';
comment on column public.cities.unsplash_author_url is 'Ссылка на профиль автора (с utm для Unsplash)';

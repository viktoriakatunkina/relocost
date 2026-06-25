-- ============================================================
-- Relocost.ru — локальные URL фото в Supabase Storage
-- ============================================================
-- Причина: images.unsplash.com недоступен с российского VPS (таймаут).
-- Все фото перенесены в публичный bucket Supabase Storage (`photos`),
-- который доступен и с сервера, и с клиента.
--
-- Добавляем колонки под локальные (storage) URL. Старые unsplash_* НЕ удаляем:
--   1) они остаются фолбэком, если local-URL пустой;
--   2) в них хранится атрибуция авторов (Unsplash требует указывать автора).
-- В коде сайта используется image_url || unsplash_url (фолбэк).
--
-- Галерея (cities.gallery, jsonb [{u,n,h}]) обновляется отдельно скриптом:
-- поле .u переписывается на storage-URL прямо in-place, имя автора (n) и
-- ссылка на профиль (h) сохраняются для атрибуции.

alter table public.cities
  add column if not exists image_url text;

comment on column public.cities.image_url is
  'Локальный URL hero-фото в Supabase Storage (bucket photos). Фолбэк — unsplash_url. Атрибуция автора остаётся в unsplash_author_name/url.';

alter table public.blog_posts
  add column if not exists cover_image_url text;

comment on column public.blog_posts.cover_image_url is
  'Локальный URL обложки в Supabase Storage (bucket photos). Фолбэк — cover_url. Атрибуция автора — cover_author_name/url.';

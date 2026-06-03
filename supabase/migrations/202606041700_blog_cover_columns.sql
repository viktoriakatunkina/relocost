-- ============================================================
-- Relocost.ru — обложки статей блога
-- ============================================================
-- Раньше карточки и hero статей рисовались только градиентом.
-- Добавляем реальную обложку Unsplash с обязательной атрибуцией автора.
-- Для статей с городом обложку копируем из cities (unsplash_url/автор),
-- для статей без города (например «Топ-7 направлений») — отдельное фото.

alter table public.blog_posts
  add column if not exists cover_url text,
  add column if not exists cover_author_name text,
  add column if not exists cover_author_url text;

comment on column public.blog_posts.cover_url is 'Base URL обложки Unsplash (без размерных параметров) — дополняем &w=&q= на лету';
comment on column public.blog_posts.cover_author_name is 'Имя автора фото-обложки для атрибуции Unsplash';
comment on column public.blog_posts.cover_author_url is 'Ссылка на профиль автора обложки (с utm для Unsplash)';

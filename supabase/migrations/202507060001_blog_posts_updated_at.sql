-- Добавляем updated_at в blog_posts для корректного lastmod в sitemap.xml.
-- Яндекс использует lastmod как сигнал свежести контента: правильная дата
-- обновления ускоряет переиндексацию отредактированных статей.

alter table public.blog_posts
  add column if not exists updated_at timestamptz;

-- Заполняем существующие строки значением created_at (лучше, чем NULL или now()).
update public.blog_posts
  set updated_at = created_at
  where updated_at is null;

-- Триггер автоматически проставляет updated_at при UPDATE.
-- Функция set_updated_at() уже создана в первой миграции.
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute procedure public.set_updated_at();

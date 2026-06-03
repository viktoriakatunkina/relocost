-- Галерея фото для страниц городов.
-- Массив объектов {u: base_url, n: author_name, h: author_html_url}.

alter table public.cities
  add column if not exists gallery jsonb default '[]'::jsonb;

comment on column public.cities.gallery is 'Массив объектов фото {u,n,h} для блока «<город> в кадрах»';

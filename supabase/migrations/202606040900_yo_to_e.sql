-- ============================================================
-- Глобальная замена «ё»/«Ё» → «е»/«Е» в текстовых данных
-- ============================================================
-- Виктория ведет единый визуальный стиль без «ё» во всех своих
-- продуктах. Эта миграция приводит уже сидированные данные к
-- тому же правилу, что и исходники сайта.

update public.cities set
  name_ru          = replace(replace(name_ru,          'ё','е'), 'Ё','Е'),
  country_ru       = replace(replace(country_ru,       'ё','е'), 'Ё','Е'),
  population       = replace(replace(population,       'ё','е'), 'Ё','Е'),
  climate          = replace(replace(climate,          'ё','е'), 'Ё','Е'),
  language         = replace(replace(language,         'ё','е'), 'Ё','Е'),
  currency         = replace(replace(currency,         'ё','е'), 'Ё','Е'),
  flight_from_moscow = replace(replace(flight_from_moscow,'ё','е'),'Ё','Е'),
  seo_title        = replace(replace(seo_title,        'ё','е'), 'Ё','Е'),
  seo_description  = replace(replace(seo_description,  'ё','е'), 'Ё','Е'),
  intro_text       = replace(replace(intro_text,       'ё','е'), 'Ё','Е')
where
  name_ru || coalesce(country_ru,'') || coalesce(population,'') ||
  coalesce(climate,'') || coalesce(language,'') || coalesce(currency,'') ||
  coalesce(flight_from_moscow,'') || coalesce(seo_title,'') ||
  coalesce(seo_description,'') || coalesce(intro_text,'') ~ '[ёЁ]';

update public.prices set
  item_name_ru = replace(replace(item_name_ru, 'ё','е'), 'Ё','Е')
where item_name_ru ~ '[ёЁ]';

update public.blog_posts set
  title           = replace(replace(title,           'ё','е'), 'Ё','Е'),
  content_md      = replace(replace(content_md,      'ё','е'), 'Ё','Е'),
  seo_title       = replace(replace(seo_title,       'ё','е'), 'Ё','Е'),
  seo_description = replace(replace(seo_description, 'ё','е'), 'Ё','Е')
where
  title || coalesce(content_md,'') || coalesce(seo_title,'') ||
  coalesce(seo_description,'') ~ '[ёЁ]';

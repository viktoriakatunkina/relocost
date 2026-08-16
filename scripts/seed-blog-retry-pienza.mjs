import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';
const H = os.homedir();
const SUPA_URL = fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim();
const SUPA_KEY = fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim();
const sb = createClient(SUPA_URL, SUPA_KEY, {auth:{persistSession:false}});
async function getPhoto(q) { return null; }

const p = {
  slug: 'pienza-italy-dn-2026',
  title: 'Италия Пьенца DN 2026: €600-1100/мес; «ИДЕАЛЬНЫЙ ГОРОД»: единственный город в мире построенный по единому ренессансному плану 1462 года',
  seo_title: 'Жизнь в Пьенца 2026: цены, жильё, UNESCO Val d Orcia, Тоскана | Relocost',
  seo_description: 'Пьенца, Тоскана — цены €600-1100/мес, UNESCO идеальный ренессансный город 1462 года, Val d Orcia, пекорино тоскано, вид на Монте-Амиата. Гайд 2026.',
  tag: 'города',
  read_time: 7,
  country_slug: 'italy',
  content_md: `## Пьенца: идеальный город Ренессанса

Пьенца (Pienza) — маленький городок (2000 жителей) в провинции Сиена, построенный Папой Пием II в 1459-1462 годах по проекту Бернардо Росселлино как «идеальный ренессансный город». ЮНЕСКО включила его в Список всемирного наследия в 1996 году: главная площадь Piazza Pio II с собором, дворцом папы и ратушей — единственный полностью реализованный проект идеального города XV в.

Val d Orcia — долина вокруг (также UNESCO) — тосканский пейзаж открыток.

## Цены на жильё 2026

Одни из самых доступных в туристической Тоскане. Однокомнатные — €600-800/мес, двухкомнатные — €800-1100/мес. Малый рынок аренды, но стабильный.

## Транспорт

До Монтепульчано — 15 минут, до Кьюзи-Кьянчано (ж/д) — 25 минут, до Сиены — 55 минут. Автобус в Монтепульчано и Сиену. Машина удобна.

## Идеальная площадь и пекорино

Piazza Pio II — прямоугольная площадь с собором, двумя дворцами и колодцем: это весь «идеальный» квартал 1462 года целиком. Вход на площадь свободный; музей Palazzo Piccolomini (вход 7 евро) — интерьеры и сады.

Pecorino di Pienza — мягкий и выдержанный овечий сыр, специфический для этого района. Продают на каждом углу: в лавках Corso il Rossellino; дегустации с местным медом и вином.

## Практические советы

**Школы:** Scuola primaria в городе; средняя — в Монтепульчано.

**Медицина:** Ambulatorio medico в Пьенца, больница — в Монтальчино или Сиене.

**Продукты:** Маленькие провизионные лавки; COOP в Монтепульчано.

## Плюсы и минусы

**Плюсы:** Единственный реализованный «идеальный город» Ренессанса, UNESCO Val d Orcia вокруг, пекорино и вино, доступные цены.

**Минусы:** Маленький, туристы, мало жилья, нужна машина.

## Итог

Пьенца — для тех, кто хочет жить в уникальном историческом месте. «Идеальный ренессансный город» Папы Пия II — единственный в своем роде на планете.`,
};

async function run() {
  const { data: existing } = await sb.from('blog_posts').select('id').eq('slug', p.slug).maybeSingle();
  if (existing) { console.log('[SKIP]', p.slug); return; }
  const photo = await getPhoto(p.slug);
  const { error } = await sb.from('blog_posts').insert({
    slug: p.slug,
    title: p.title,
    seo_title: p.seo_title,
    seo_description: p.seo_description,
    tag: p.tag,
    read_time: p.read_time,
    country_slug: p.country_slug,
    content_md: p.content_md,
    cover_url: photo?.url ?? null,
    cover_author_name: photo?.author ?? null,
    cover_author_url: photo?.author_url ?? null,
    published: true,
  });
  if (error) { console.error('[ERR]', p.slug, error.message); }
  else { console.log('[OK]', p.slug); }
  console.log('done');
}
run();

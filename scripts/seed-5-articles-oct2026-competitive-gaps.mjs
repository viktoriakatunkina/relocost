// 5 новых SEO-статей — волна конкурентного анализа (октябрь 2026), закрывающая
// НЕ точечные пробелы по городам-сиротам (прошлые волны), а содержательные
// пробелы в семантике: темы, которых нет среди 5241 постов блога, найденные
// через WebSearch/WebFetch конкурентного анализа (relocatefrom.ru, T-J,
// harant.ru, terms.law, meduza.io, jam-news.net и др.), а не через
// автоматическое затыкание дыр по city_id.
//
// Процесс отбора (полностью — см. финальный отчет агента в чате):
//  1. Экспорт всех 5241 заголовков/slug'ов blog_posts (offset-пагинация по
//     1000) в scratchpad, чтобы проверять дубли по смыслу, а не только по
//     точному совпадению slug.
//  2. 9 кандидатов-тем проверены на: (а) отсутствие в блоге — grep по
//     заголовкам на десятки формулировок каждой темы; (б) реальный спрос —
//     WebSearch по формулировкам из форумов/юрфирм/T-J; (в) актуальность
//     2026 года — где возможно, привязка к реальному изменению закона.
//  3. Из 9 кандидатов отобраны 5: два полностью новых изменения закона 2026
//     года (Таиланд, Грузия), один навигатор по теме с неверным публичным
//     представлением (Испания), два процессных пробела, явно попавших в
//     фокус задания (развод, дистанционное обучение). Отклонены: военный
//     учет (политически чувствительная тема, демографический спрос
//     подтвержден, но решено не включать в эту волну без отдельного
//     решения), многодетные семьи (подтвержден 0 покрытия, но уже и так
//     плотно покрыта соседняя тема "семьи с детьми"), ограничения на Бали
//     2026 (новость на уровне "заявление одного чиновника", не закон —
//     риск писать как факт непроверенное), гражданство ребенка рожденного
//     за рубежом (найдена существующая опубликованная статья — не пробел),
//     аренда жилья удаленно (найдены 4 неопубликованных черновика на
//     практически эту же тему — не пробел, уже решено не публиковать).
//
// Числа: цены пакетов сверены в lib/packages.ts перед написанием — не
// изменились с прошлой волны (places=19₽, budget=49₽, bundle=59₽,
// country_overview=29₽, country_cities=49₽). Курс ориентир ЦБ РФ на
// октябрь 2026: 1 $ ≈ 84 ₽, 1 € ≈ 95 ₽, 1 GEL ≈ 24 ₽ (видно по уже
// опубликованным цифрам в vnzh-gruzii-2026-novye-pravila и
// strakhovka-dlya-vezda-v-gruziyu-2026). Цены по городам (Чиангмай,
// Барселона, Тбилиси) — из таблицы prices по city_id, не выдуманы.
//
// Запуск: node scripts/seed-5-articles-oct2026-competitive-gaps.mjs --dry-run  (по умолчанию)
//         node scripts/seed-5-articles-oct2026-competitive-gaps.mjs --live
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs
  .readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8")
  .trim();
const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const LIVE = process.argv.includes("--live");
console.log(LIVE ? "LIVE — will INSERT into blog_posts" : "DRY RUN — no writes (pass --live)");

// city: null => статья не привязана к одному городу (национальная/межстрановая
// тема). country_slug берется напрямую, без обязательной привязки к городу.
const POSTS = {
  "tailand-nalog-na-dohody-iz-za-rubezha-2026": { city: null, country_slug: "thailand" },
  "ispaniya-golden-visa-zakryta-alternativy-2026": { city: null, country_slug: "spain" },
  "vnzh-gruzii-cherez-brak-2026-novye-pravila": { city: "tbilisi", country_slug: "georgia" },
  "razvod-za-rubezhom-2026-kak-oformit": { city: null, country_slug: null },
  "distancionnoe-obuchenie-detej-za-rubezhom-2026": { city: null, country_slug: null },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, opts, retries = 4, backoffMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;
      const body = await res.text();
      console.error(`  attempt ${attempt}/${retries}: ${res.status} ${body.slice(0, 300)}`);
    } catch (e) {
      console.error(`  attempt ${attempt}/${retries}: ${e.message}`);
    }
    if (attempt < retries) await sleep(backoffMs * attempt);
    else throw new Error(`Giving up after ${retries} attempts`);
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    fm[line.slice(0, colon).trim()] = line
      .slice(colon + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }
  // Тело статьи оставляем КАК ЕСТЬ, включая ведущий "# Заголовок" — на
  // live-примере (vnzh-gruzii-2026-novye-pravila) content_md в базе хранит
  // H1 первой строкой, и шаблон страницы блога умеет убирать дублирующийся
  // <h1> из рендера markdown (см. app/[locale]/blog/[slug]/page.tsx,
  // комментарий "рендерит его как второй h1 ... убирает тег при рендере").
  const body = match[2].trim();
  return { fm, body };
}

async function loadCities(slugs) {
  const wanted = [...new Set(slugs.filter(Boolean))];
  if (!wanted.length) return new Map();
  const res = await fetchWithRetry(
    `${SB_URL}/rest/v1/cities?select=id,slug,unsplash_url,unsplash_author_name,unsplash_author_url&slug=in.(${wanted.join(",")})`,
    { headers },
  );
  const rows = await res.json();
  return new Map(rows.map((r) => [r.slug, r]));
}

const slugs = Object.keys(POSTS);
const citySlugs = Object.values(POSTS).map((p) => p.city);
const cityBySlug = await loadCities(citySlugs);

const base = Date.now();
let added = 0,
  skipped = 0,
  errors = 0;

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const meta = POSTS[slug];
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    console.error(`✗ файл не найден: ${slug}.md`);
    errors++;
    continue;
  }

  const existsRes = await fetchWithRetry(
    `${SB_URL}/rest/v1/blog_posts?slug=eq.${slug}&select=id`,
    { headers },
  );
  const existing = await existsRes.json();
  if (existing.length) {
    console.log(`skip (уже есть): ${slug}`);
    skipped++;
    continue;
  }

  const { fm, body } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
  const city = meta.city ? cityBySlug.get(meta.city) : null;
  if (meta.city && !city) {
    console.error(`✗ ${slug}: город "${meta.city}" не найден в cities`);
    errors++;
    continue;
  }

  const row = {
    title: fm.title,
    slug,
    tag: fm.tag ?? "Гайды и подборки",
    read_time: parseInt(fm.reading_time ?? "11", 10),
    content_md: body,
    seo_title: fm.title,
    seo_description: fm.description ?? null,
    country_slug: meta.country_slug,
    city_id: city?.id ?? null,
    cover_url: city?.unsplash_url || fm.cover_url || null,
    cover_unsplash_id: null,
    cover_author_name: city?.unsplash_author_name ?? fm.cover_author_name ?? null,
    cover_author_url: city?.unsplash_author_url ?? fm.cover_author_url ?? null,
    published: fm.published !== "false",
    created_at: new Date(base - i * 3600 * 1000).toISOString(),
  };

  if (!LIVE) {
    console.log(
      `[dry] + ${slug} | city=${meta.city ?? "—"} country=${row.country_slug ?? "—"} | cover=${row.cover_url ? "ok" : "MISSING"} | ${row.content_md.length} симв. | «${row.title}»`,
    );
    added++;
    continue;
  }

  await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
  });
  console.log(`+ ${slug} (city=${meta.city ?? "—"}, country=${row.country_slug ?? "—"})`);
  added++;
  await sleep(400);
}

console.log(`\ndone. added=${added} skipped=${skipped} errors=${errors} / total=${slugs.length}`);

// ============================================================
// Relocost.ru — чинит перепутанные подписи у inline-картинок в статьях блога.
//
// Проблема (аудит качества блога, 2026-09): scripts/fill-blog-images.mjs при
// тонком тематическом фото-пуле (см. там комментарий "запас, если пул вдруг
// тонкий") подмешивал в inline-картинки статьи общий travel-пул heroPool —
// фото городов СОВЕРШЕННО другой страны, с их настоящими подписями (caption
// = c.name_ru реального города фото). В статье про Мумбаи появлялись фото с
// подписью «Гоа»/«Пхукет»/«Рио-де-Жанейро», в статье про Вену — «Пномпень»,
// «Ларнака» и т.п. — подпись прямо врёт о месте на фото относительно темы
// статьи, которую читает пользователь.
//
// Что считаем нарушением: caption картинки — это ТОЧНОЕ имя города из
// таблицы cities (так их и проставлял fill-blog-images.mjs: caption = c.name_ru),
// а его страна не встречается НИГДЕ в теме статьи. Тема статьи — объединение:
//   • city_id / country_slug из самой строки blog_posts (если заполнены);
//   • все города/страны, упомянутые ТЕКСТОМ в заголовке и теле статьи
//     (без картиночной разметки — иначе подпись голосовала бы сама за себя).
// Это специально щедрое определение "темы": статьи-подборки/рейтинги/сравнения
// («Топ-10 стран», «Норвегия vs Швеция», «15 направлений по климату») обычно
// называют текстом все страны, которые реально обсуждают — такие фото НЕ
// считаются нарушением, даже если случайно совпало по topicCountries.size===0
// (тогда тема вообще не определена — такие статьи пропускаем, а не гадаем).
//
// Фикс (не automated LLM, чисто программный, безопасный для тысяч статей):
// у 5200+ фото по 2100+ статьям искать "правильную" замену на каждое место
// вручную нереально и рискованно (легко ошибиться с географией повторно).
// Вместо этого убираем ТОЛЬКО враньё — подпись с неверным городом:
//   ![Гоа](url "Автор::ссылка")  →  ![](url "Автор::ссылка")
// Сама фотография и атрибуция автора остаются (это не выдумка, реальное
// фото реального автора с Unsplash, ссылка рабочая) — просто убираем
// текст, который лжёт о том, ЧТО на фото. components.img в
// app/[locale]/blog/[slug]/page.tsx уже поддерживает пустой alt: подпись-
// плашка тогда просто не показывает место, но сохраняет "Фото: Автор /
// Unsplash" под картинкой (проверено, ничего не ломается).
//
// Запуск:
//   node scripts/fix-blog-caption-mismatches.mjs               # dry-run (по умолчанию)
//   node scripts/fix-blog-caption-mismatches.mjs --dry-run      # то же явно
//   node scripts/fix-blog-caption-mismatches.mjs --live         # реальные PATCH
// ============================================================
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

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

const LIVE = process.argv.includes("--live");
console.log(LIVE ? "LIVE — will PATCH content_md" : "DRY RUN — no writes (pass --live to apply)");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, opts, retries = 4, backoffMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    const body = await res.text();
    console.error(`  attempt ${attempt}/${retries} failed: ${res.status} ${body.slice(0, 300)}`);
    if (attempt < retries) await sleep(backoffMs * attempt);
    else throw new Error(`Giving up after ${retries} attempts: ${res.status}`);
  }
}

async function fetchAllPaged(urlBase, pageSize = 1000) {
  const all = [];
  let offset = 0;
  for (;;) {
    const res = await fetchWithRetry(`${urlBase}&offset=${offset}&limit=${pageSize}`, { headers });
    const rows = await res.json();
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// --- Матчинг город/страна в тексте (тот же подход, что lib/blog-city-match.ts
// и scripts/backfill-blog-city-country.mjs: word-boundary над name_ru/country_ru,
// без учёта регистра/ё) — здесь без CONFIDENT_POS_MAX-отсечки и без обрезки по
// ";", потому что тут не ищем ОДНУ уверенную тему для CTA, а наоборот щедро
// собираем ВСЕ страны, упомянутые где-либо в статье, чтобы не наплодить
// ложных срабатываний на подборках/сравнениях/рейтингах. ---
const normalize = (s) => s.toLowerCase().replace(/ё/g, "е");
const wordBoundaryRegex = (name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![а-яa-z0-9])${escaped}(?![а-яa-z0-9])`, "i");
};
function allCityCountries(t, cities) {
  const set = new Set();
  for (const c of cities) {
    const name = normalize(c.name_ru);
    if (name.length < 3) continue;
    if (wordBoundaryRegex(name).test(t)) set.add(c.country_slug);
  }
  return set;
}
function allCountryMentions(t, countryList) {
  const set = new Set();
  for (const [slug, name] of countryList) {
    if (wordBoundaryRegex(normalize(name)).test(t)) set.add(slug);
  }
  return set;
}

// Подписи тематических (не гео) картинок из fill-blog-images.mjs — никогда не
// содержат имя города, пропускаем сразу.
const TAG_CAPTION_VALUES = new Set([
  "Деньги и финансы за рубежом",
  "Визы и документы для переезда",
  "Направления для переезда",
  "Куда переехать",
  "Жизнь за границей",
  "Переезд",
]);

// caption(url "author::href") — как их вставляет imgMarkdown() в fill-blog-images.mjs.
const IMG_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
const stripImages = (md) => md.replace(IMG_RE, " ");

const cities = await fetchAllPaged(
  `${SB_URL}/rest/v1/cities?select=id,slug,name_ru,country_ru,country_slug`,
);
console.log(`Cities loaded: ${cities.length}`);
const cityById = Object.fromEntries(cities.map((c) => [c.id, c]));
const nameMap = new Map();
for (const c of cities) {
  const key = normalize(c.name_ru.trim());
  if (!nameMap.has(key)) nameMap.set(key, []);
  nameMap.get(key).push(c);
}
const countryList = [...new Map(cities.map((c) => [c.country_slug, c.country_ru])).entries()];

const posts = await fetchAllPaged(
  `${SB_URL}/rest/v1/blog_posts?select=id,slug,title,city_id,country_slug,content_md&published=eq.true`,
);
console.log(`Published posts: ${posts.length}`);

function topicCountries(p, textForScan) {
  const set = new Set();
  if (p.city_id && cityById[p.city_id]) set.add(cityById[p.city_id].country_slug);
  if (p.country_slug) set.add(p.country_slug);
  const t = normalize(textForScan);
  for (const cs of allCityCountries(t, cities)) set.add(cs);
  for (const cs of allCountryMentions(t, countryList)) set.add(cs);
  return set;
}

let articlesWithImgs = 0;
let totalImgs = 0;
let mismatchImgs = 0;
let articlesFlagged = 0;
let noTopicSkipped = 0;
const updates = []; // { id, slug, content_md, removed: [{caption,url}] }
const allExamples = [];

for (const p of posts) {
  const md = p.content_md || "";
  const matches = [...md.matchAll(IMG_RE)];
  if (!matches.length) continue;
  articlesWithImgs++;
  totalImgs += matches.length;

  const scanText = `${p.title}\n${stripImages(md)}`;
  const allowed = topicCountries(p, scanText);

  // Индексы вставок, которые надо обезличить (снизу вверх, чтобы не сбить offset).
  const toStrip = [];
  for (const m of matches) {
    const caption = m[1].trim();
    if (!caption || TAG_CAPTION_VALUES.has(caption)) continue;
    const hit = nameMap.get(normalize(caption));
    if (!hit) continue; // подпись — не имя города из БД (тематическая/иная), не трогаем
    const imgCity = hit[0];
    if (allowed.size === 0) {
      noTopicSkipped++;
      continue; // тема статьи вообще не определена — не рискуем, пропускаем
    }
    if (!allowed.has(imgCity.country_slug)) {
      mismatchImgs++;
      toStrip.push({ index: m.index, length: m[0].length, url: m[2], title: m[3], caption });
    }
  }

  if (!toStrip.length) continue;
  articlesFlagged++;

  let newMd = md;
  toStrip
    .slice()
    .sort((a, b) => b.index - a.index)
    .forEach((s) => {
      const titlePart = s.title ? ` "${s.title}"` : "";
      const replacement = `![](${s.url}${titlePart})`;
      newMd = newMd.slice(0, s.index) + replacement + newMd.slice(s.index + s.length);
    });

  updates.push({ id: p.id, slug: p.slug, content_md: newMd, removed: toStrip });
  if (allExamples.length < 10) {
    allExamples.push({
      slug: p.slug,
      title: p.title.slice(0, 80),
      removedCaptions: toStrip.map((s) => s.caption),
    });
  }
}

console.log(`\nСтатей с картинками: ${articlesWithImgs}, всего картинок: ${totalImgs}`);
console.log(`Картинок с перепутанной подписью (страна не по теме статьи): ${mismatchImgs}`);
console.log(`Статей затронуто: ${articlesFlagged}`);
console.log(`Пропущено (тема статьи не определена — не рискуем): ${noTopicSkipped}`);

console.log(`\n=== Примеры (до → после), первые ${allExamples.length} ===`);
for (const ex of allExamples) {
  console.log(`\n--- ${ex.slug}`);
  console.log(`    ${ex.title}`);
  console.log(`    убраны неверные подписи: ${ex.removedCaptions.map((c) => `«${c}»`).join(", ")}`);
}

if (!LIVE) {
  console.log(`\nDRY RUN: к записи ${updates.length} статей. Ничего не записано — повторите с --live.`);
  process.exit(0);
}

console.log(`\nЗапись ${updates.length} статей...`);
let written = 0;
for (const u of updates) {
  const res = await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=eq.${u.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ content_md: u.content_md }),
  });
  const rows = await res.json();
  if (!rows.length) throw new Error(`update ${u.slug}: no rows returned`);
  written++;
  if (written % 100 === 0) process.stdout.write(`\r  записано ${written}/${updates.length}  `);
  await sleep(60);
}
console.log(`\n✓ Записано статей: ${written}/${updates.length}`);
console.log(`✓ Убрано неверных подписей всего: ${mismatchImgs}`);

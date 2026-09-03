// Бэкафилл city_id/country_slug у статей блога, у которых ОБА поля пустые,
// но заголовок однозначно называет конкретный город или страну.
//
// Почему это важно (аудит воронки блог → монетизируемые страницы, 2026-09):
// у ~1846 из 4258 опубликованных статей (43%) не было ни city_id, ни
// country_slug — из-за этого автоматические CTA внутри статьи (см.
// app/[locale]/blog/[slug]/page.tsx, ArticleInlineCTA/BlogReportCTA) вели на
// нерелевантный общий фолбэк «топ-8 популярных городов» вместо города/страны,
// о которых реально шла речь в статье. Например, статья «Мексика Мехико
// переезд DN 2026: ...» вела читателя не на /city/mexico-city, а на список
// Тбилиси/Еревана/Стамбула и т.п. — то есть CTA были технически на месте, но
// НЕ релевантны теме, что и объясняет провал конверсии клика по CTA.
//
// Алгоритм: для каждой такой статьи ищем в её title() точное совпадение
// name_ru города (с границами слова, без учёта регистра/ё) — если найден
// РОВНО один город, проставляем city_id. Если городов не найдено, но найдена
// РОВНО одна страна (country_ru) — проставляем country_slug. Неоднозначные
// случаи (упомянуто несколько городов — статьи-сравнения вида «Тбилиси vs
// Ереван») и статьи без географического упоминания вовсе — НЕ трогаем, для
// них есть отдельный рантайм-фолбэк по тому же алгоритму (см.
// lib/blog-city-match.ts), который на лету показывает все найденные города
// вместо жёсткой БД-привязки.
//
// Тот же алгоритм сопоставления (word-boundary над name_ru/country_ru)
// продублирован в lib/blog-city-match.ts (TS, используется в рантайме
// Next.js) — здесь отдельная копия на чистом JS, т.к. scripts/ не имеет
// ts-node/tsx в зависимостях (см. другие скрипты в этой папке).
//
// Запуск: node scripts/backfill-blog-city-country.mjs --dry-run   (по умолчанию)
//         node scripts/backfill-blog-city-country.mjs --live      (реальные PATCH)
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
console.log(LIVE ? "LIVE — will PATCH city_id/country_slug" : "DRY RUN — no writes (pass --live to apply)");

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

// --- Матчинг (копия lib/blog-city-match.ts — см. подробное объяснение
// эвристик (кавычки-ёлочки, обрезка по ";", CONFIDENT_POS_MAX) там же) ---
const CONFIDENT_POS_MAX = 60;
function normalize(s) {
  return s.toLowerCase().replace(/ё/g, "е");
}
function prepTitle(title) {
  const withoutQuotes = title.replace(/«[^»]*»/g, " ");
  return normalize(withoutQuotes.split(";")[0]);
}
function wordBoundaryRegex(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![а-яa-z0-9])${escaped}(?![а-яa-z0-9])`, "i");
}
function rawCityMatches(t, cities) {
  const found = [];
  for (const c of cities) {
    const name = normalize(c.name_ru);
    if (name.length < 3) continue;
    const m = t.match(wordBoundaryRegex(name));
    if (m && m.index !== undefined) found.push({ city: c, index: m.index });
  }
  found.sort((a, b) => a.index - b.index || b.city.name_ru.length - a.city.name_ru.length);
  const seen = new Set();
  const result = [];
  for (const f of found) {
    if (seen.has(f.city.id)) continue;
    seen.add(f.city.id);
    result.push(f);
  }
  return result;
}
// Для бэкафилла (в отличие от рантайм-фолбэка) интересны только ОДНОЗНАЧНЫЕ
// совпадения — ровно один город/страна, уверенно (позиция < CONFIDENT_POS_MAX).
// Статьи с несколькими совпадениями (сравнения) сознательно пропускаем — их
// на лету обслуживает lib/blog-city-match.ts (показывает все найденные города).
function matchSingleCityConfident(title, cities) {
  const hits = rawCityMatches(prepTitle(title), cities);
  if (hits.length !== 1) return null;
  if (hits[0].index >= CONFIDENT_POS_MAX) return null;
  return hits[0].city;
}
function matchSingleCountryConfident(title, cities) {
  const t = prepTitle(title);
  const byCountry = new Map();
  for (const c of cities) byCountry.set(c.country_slug, c.country_ru);
  const found = [];
  byCountry.forEach((name, slug) => {
    const m = t.match(wordBoundaryRegex(normalize(name)));
    if (m && m.index !== undefined) found.push({ slug, name, index: m.index });
  });
  if (found.length !== 1) return null;
  if (found[0].index >= CONFIDENT_POS_MAX) return null;
  return found[0];
}

const cities = await fetchAllPaged(
  `${SB_URL}/rest/v1/cities?select=id,slug,name_ru,country_ru,country_slug`,
);
console.log(`Cities loaded: ${cities.length}`);

const posts = await fetchAllPaged(
  `${SB_URL}/rest/v1/blog_posts?select=id,slug,title&published=eq.true&city_id=is.null&country_slug=is.null&order=created_at.desc`,
);
console.log(`Posts without city_id/country_slug: ${posts.length}`);

const cityMatches = []; // { id, slug, title, cityId, citySlug, cityName }
const countryMatches = []; // { id, slug, title, countrySlug, countryName }
let ambiguous = 0;
let unresolved = 0;

for (const p of posts) {
  const rawHits = rawCityMatches(prepTitle(p.title), cities);
  if (rawHits.length > 1) {
    // Несколько городов в заголовке — статья-сравнение, оставляем для
    // рантайм-фолбэка (lib/blog-city-match.ts показывает их все).
    ambiguous += 1;
    continue;
  }
  const cityHit = matchSingleCityConfident(p.title, cities);
  if (cityHit) {
    cityMatches.push({
      id: p.id,
      slug: p.slug,
      title: p.title,
      cityId: cityHit.id,
      citySlug: cityHit.slug,
      cityName: cityHit.name_ru,
    });
    continue;
  }
  const ctm = matchSingleCountryConfident(p.title, cities);
  if (ctm) {
    countryMatches.push({
      id: p.id,
      slug: p.slug,
      title: p.title,
      countrySlug: ctm.slug,
      countryName: ctm.name,
    });
    continue;
  }
  unresolved += 1;
}

console.log(`\nRESOLVED city_id:      ${cityMatches.length}`);
console.log(`RESOLVED country_slug: ${countryMatches.length}`);
console.log(`Ambiguous (multi-city, left for runtime fallback): ${ambiguous}`);
console.log(`Unresolved (no geo mention, left for popular-cities fallback): ${unresolved}`);

console.log(`\n=== Sample city matches (first 15) ===`);
for (const m of cityMatches.slice(0, 15)) {
  console.log(`  [${m.cityName} / ${m.citySlug}]  ${m.title}`);
}
console.log(`\n=== Sample country matches (first 15) ===`);
for (const m of countryMatches.slice(0, 15)) {
  console.log(`  [${m.countryName} / ${m.countrySlug}]  ${m.title}`);
}

// Сохраняем полный список для ручной проверки (dry-run) вне зависимости от режима.
const outPath = path.join(os.tmpdir(), "relocost-blog-city-backfill-report.json");
fs.writeFileSync(
  outPath,
  JSON.stringify({ cityMatches, countryMatches, ambiguous, unresolved }, null, 2),
);
console.log(`\nFull report written to ${outPath}`);

if (!LIVE) {
  console.log("\nDry run complete — no writes made. Re-run with --live to apply.");
  process.exit(0);
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

console.log("\nApplying city_id...");
let updatedCity = 0;
for (const batch of chunk(cityMatches, 1)) {
  // По одному id за PATCH — у каждой статьи свой city_id, батчить нечем без
  // множественного UPDATE ... CASE; объём (≈450) небольшой, оставляем просто.
  const m = batch[0];
  const res = await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=eq.${m.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ city_id: m.cityId }),
  });
  const rows = await res.json();
  updatedCity += rows.length;
  if (updatedCity % 50 === 0) console.log(`  ...${updatedCity}/${cityMatches.length}`);
  await sleep(120);
}
console.log(`City_id updated: ${updatedCity}/${cityMatches.length}`);

console.log("\nApplying country_slug...");
let updatedCountry = 0;
for (const batch of chunk(countryMatches, 1)) {
  const m = batch[0];
  const res = await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=eq.${m.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ country_slug: m.countrySlug }),
  });
  const rows = await res.json();
  updatedCountry += rows.length;
  if (updatedCountry % 50 === 0) console.log(`  ...${updatedCountry}/${countryMatches.length}`);
  await sleep(120);
}
console.log(`Country_slug updated: ${updatedCountry}/${countryMatches.length}`);

console.log("\nDone.");

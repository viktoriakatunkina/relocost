// Ретегирует опубликованные статьи с тегами Страны/Острова/Рейтинги/Практика,
// которые по СОДЕРЖАНИЮ ЗАГОЛОВКА — те же справочные DN-карточки городов, что
// уже скрыты через HIDDEN_BLOG_TAG = "города" (см. lib/blog-visibility.ts),
// но были засеяны под другим тегом и поэтому утекли в /blog и sitemap.xml.
//
// КОНТЕКСТ. Аудит 2026-09-16 нашёл волну ~1912 статей с keyword-stuffed
// заголовками вида «Страна Город DN 2026: факт1; факт2; $XXX аренда» —
// опубликованы 30.07–16.08.2026. Первичная цифра "342 утекших" из чужого
// отчёта НЕ подтвердилась при независимой перепроверке (см. ниже) — эта
// перепроверка нашла 611 строк. Разница объясняется тем, что волна не имеет
// единого фингерпринта: часть заголовков использует буквальное «DN», часть —
// «IT» + названия компаний с оценкой ($XXB), часть — только диапазон аренды
// без «DN» вовсе. Одиночный паттерн отдельно давал то 99, то 492, то 540
// совпадений — не стабильно. Здесь используется ОБЪЕДИНЕНИЕ независимых
// структурных сигналов (см. isMessy ниже), каждый проверен вручную на
// выборках без единого ложного срабатывания на "хороших" статьях того же
// тега (нормальные статьи вида «Переезд в Австрию в 2026 году: ВНЖ, стоимость
// жизни, реальность» этот фильтр не матчит — проверено).
//
// ПОЧЕМУ РЕТЕГ, А НЕ РАСШИРЕНИЕ HIDDEN_BLOG_TAG В КОДЕ (вариант б из ТЗ):
// теги Страны/Острова/Рейтинги/Практика ТАКЖЕ используются нормальными
// статьями (687 из 1227 в этих 4 тегах на момент проверки) — расширять
// фильтр по одному только тегу нельзя, пришлось бы тащить тот же
// title-regex-паттерн из этого файла в lib/blog-visibility.ts и app/sitemap.ts
// и держать его синхронным с сидинг-скриптами вручную. UPDATE tag='города' —
// семантически корректнее: это ФАКТИЧЕСКИ тот же тип контента (DN-карточка
// города), что и остальные 1609 строк с этим тегом (см. комментарий в
// lib/blog-visibility.ts) — их просто изначально посеяли не под тем тегом.
// Один источник правды (HIDDEN_BLOG_TAG), ноль новых веток кода.
//
// Запуск:
//   node scripts/retag-dn-wave-mistagged.mjs            # dry-run, ничего не пишет
//   node scripts/retag-dn-wave-mistagged.mjs --live     # реальный PATCH tag='города'
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs
  .readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8")
  .trim();
const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

const LIVE = process.argv.includes("--live");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, opts = {}, retries = 5, backoffMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
      if (res.ok) return res;
      const body = await res.text();
      console.error(`  attempt ${attempt}/${retries}: ${res.status} ${body.slice(0, 200)}`);
    } catch (e) {
      console.error(`  attempt ${attempt}/${retries}: ${e.message}`);
    }
    if (attempt < retries) await sleep(backoffMs * attempt);
    else throw new Error(`Giving up after ${retries} attempts`);
  }
}

const TARGET_TAGS = ["Страны", "Острова", "Рейтинги", "Практика"];

async function fetchTag(tag) {
  const out = [];
  let offset = 0;
  const limit = 1000;
  for (;;) {
    const url =
      `${SB_URL}/rest/v1/blog_posts?select=id,slug,title,tag,published,read_time,created_at` +
      `&tag=eq.${encodeURIComponent(tag)}&published=eq.true&order=created_at.asc` +
      `&offset=${offset}&limit=${limit}`;
    const res = await fetchWithRetry(url);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < limit) break;
    offset += limit;
    await sleep(200);
  }
  return out;
}

// ── Структурные сигналы messy DN-волны (объединение — ИЛИ) ─────────────────
// Каждый проверен вручную на выборках: 0 ложных срабатываний на «Переезд в
// X в 2026 году: визы, стоимость жизни» — нормальном стиле остальных статей
// этих же 4 тегов.
const SLUG_DN_SUFFIX = /-dn-2026$/;
const TITLE_DN_WORD = /\bDN\b/; // «DN» как отдельное слово в заголовке
const TITLE_CURRENCY_AFTER_2026 = (title) => {
  const idx = title.indexOf("2026:");
  if (idx === -1) return false;
  return /[$€]\s?\d/.test(title.slice(idx + 5));
};
// диапазон вида "12 000-18 000 аренда" / "400-800/мес" — фингерпринт даже
// когда валюта не $/€, а код (SGD/NOK/...).
const TITLE_RENT_RANGE = /\d[\d\s]*-[\d\s]*\d\s*(аренда|\/мес)/;
// Ручное дополнение: единственная точечная строка, не покрытая тремя
// сигналами выше, но подтверждённая вручную как та же волна (read_time=3,
// created_at 2026-08-06, плотный список фактов через ";" без цены за аренду).
const MANUAL_EXTRA_SLUGS = new Set(["tadzhikistan-panj-dolina-2026"]);

function isMessy(post) {
  return (
    SLUG_DN_SUFFIX.test(post.slug) ||
    TITLE_DN_WORD.test(post.title) ||
    TITLE_CURRENCY_AFTER_2026(post.title) ||
    TITLE_RENT_RANGE.test(post.title) ||
    MANUAL_EXTRA_SLUGS.has(post.slug)
  );
}

console.log(LIVE ? "LIVE — will PATCH tag='города'" : "DRY RUN — no writes (pass --live to apply)");

let allTagged = [];
for (const tag of TARGET_TAGS) {
  const rows = await fetchTag(tag);
  console.log(`tag=${tag}: ${rows.length} published`);
  allTagged.push(...rows);
}
console.log(`Всего опубликованных в 4 тегах: ${allTagged.length}`);

const messy = allTagged.filter(isMessy);
const clean = allTagged.filter((p) => !isMessy(p));
console.log(`\nMessy (к ретегу в "города"): ${messy.length}`);
const byTag = {};
for (const p of messy) byTag[p.tag] = (byTag[p.tag] ?? 0) + 1;
console.log("  по тегам:", byTag);
console.log(`Остаются как есть (не messy): ${clean.length}`);

const sorted = [...messy].sort((a, b) => a.created_at.localeCompare(b.created_at));
console.log(`\nПервые 20 slug'ов:`);
for (const p of sorted.slice(0, 20)) console.log(`  ${p.slug}`);

fs.writeFileSync(
  path.join(__dirname, "retag-dn-wave-mistagged.messy.json"),
  JSON.stringify(messy, null, 2),
);
console.log(`\nСписок сохранён: scripts/retag-dn-wave-mistagged.messy.json`);

if (!LIVE) {
  console.log("\nDRY RUN завершён. Ничего не записано.");
  process.exit(0);
}

// Батчи по 30 id — PATCH tag='города'.
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}
const batches = chunk(messy.map((p) => p.id), 30);
let done = 0;
for (let i = 0; i < batches.length; i++) {
  const ids = batches[i];
  await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=in.(${ids.join(",")})`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ tag: "города" }),
  });
  done += ids.length;
  console.log(`  batch ${i + 1}/${batches.length}: обновлено ${ids.length} (итого ${done}/${messy.length})`);
  await sleep(400);
}
console.log(`\nГотово. Обновлено строк: ${done}`);

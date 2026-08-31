// Этап 3 консолидации каннибализации блога (2026-08-31/09-01): помечает published=false
// у статей-дублей 21 кластера, не привязанных к городу, из ПЕРВОГО полного аудита блога,
// которые не дошли до реализации в этапах 1-2 — пенсии (куда переехать, Панама, Эквадор/Куэнка,
// Коста-Рика), школа для детей за рубежом, апостиль/легализация документов, самозанятость/ИП,
// аренда жилья, перевозка вещей, ВНЖ Черногории/Сербии/Кипра/Грузии/Армении, переезд с детьми —
// общий чек-лист, водительские права, удалённая работа на РФ-компанию (налоги), нострификация
// диплома (врач/медик и общий гайд), рейтинг стран для удалёнки, банковский счёт в Грузии.
// 301-редирект на выжившую статью уже настроен в next.config.mjs через config/blog-redirects.json.
//
// Победитель в каждом кластере выбран вручную после прочтения кандидата с максимальным read_time
// и 1-3 альтернатив (как в этапе 2, НЕ по одному read_time) — см. комментарий
// "_comment_cluster_dedup_stage3_2026" в config/blog-redirects.json: там же список исправленных
// фактических ошибок и один технический баг (задвоенный YAML-фронтматтер в content_md у 13 статей).
//
// Скрипт читает ВЕСЬ redirects-объект (446 записей — 132 из этапа 1 + 124 из этапа 2 + 190 из
// этапа 3), а не только новые: это безопасно и идемпотентно — уже unpublished строки прошлых
// этапов просто перезаписываются тем же значением. id подтягиваются с Supabase на лету.
//
// Запуск: node scripts/cluster-dedup-stage3/01-unpublish-losers.mjs [--dry-run]
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
  Prefer: "return=representation",
};

const configPath = path.join(__dirname, "../../config/blog-redirects.json");
const { redirects: redirectMap } = JSON.parse(fs.readFileSync(configPath, "utf8"));
const loserSlugs = Object.keys(redirectMap);
console.log(`Loser slugs (all stages) to unpublish: ${loserSlugs.length}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function fetchWithRetry(url, opts, retries = 3, backoffMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    const body = await res.text();
    console.error(`  attempt ${attempt}/${retries} failed: ${res.status} ${body}`);
    if (attempt < retries) await sleep(backoffMs * attempt);
    else throw new Error(`Giving up after ${retries} attempts: ${res.status} ${body}`);
  }
}

// Подтягиваем актуальные id по slug.
const idBySlug = new Map();
const lookupChunks = chunk(loserSlugs, 25);
for (let i = 0; i < lookupChunks.length; i++) {
  const c = lookupChunks[i];
  const res = await fetchWithRetry(
    `${SB_URL}/rest/v1/blog_posts?slug=in.(${c.join(",")})&select=id,slug`,
    { headers },
  );
  const rows = await res.json();
  for (const r of rows) idBySlug.set(r.slug, r.id);
  console.log(`Lookup chunk ${i + 1}/${lookupChunks.length}: got ${rows.length}/${c.length}`);
  await sleep(800);
}

const missing = loserSlugs.filter((s) => !idBySlug.has(s));
if (missing.length) {
  console.error(`ABORT: ${missing.length} loser slugs not found in DB (deleted?):`, missing);
  process.exit(1);
}

const DRY_RUN = process.argv.includes("--dry-run");
console.log(DRY_RUN ? "DRY RUN — no writes" : "LIVE — will PATCH published=false");

const batches = chunk(loserSlugs, 20);
let totalUpdated = 0;
for (let i = 0; i < batches.length; i++) {
  const batchSlugs = batches[i];
  const ids = batchSlugs.map((s) => idBySlug.get(s));
  if (DRY_RUN) {
    console.log(`[dry] batch ${i + 1}/${batches.length}: would update ${ids.length} rows`);
    await sleep(200);
    continue;
  }
  const res = await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=in.(${ids.join(",")})`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ published: false }),
  });
  const rows = await res.json();
  totalUpdated += rows.length;
  console.log(`Batch ${i + 1}/${batches.length}: updated ${rows.length} rows`);
  await sleep(800);
}

console.log(`\nTotal updated: ${totalUpdated}/${loserSlugs.length}`);

// Этап 4 консолидации каннибализации блога (2026-09-01/02): помечает published=false
// у статей-дублей 40 гео/тематических кластеров размера 5+ из ВТОРОГО полного аудита блога
// (эвристика на редких стемах слов, не биграммы, по ~4400 ранее непроверенным статьям) —
// Вьетнам, Малайзия, Хорватия, Швейцария, Юж.Корея, Израиль, Сингапур, Новая Зеландия, Канада,
// Венгрия, Аргентина, Нидерланды, Япония, ОАЭ, Греция, Таиланд, Чили/Лат.Америка, Квартира/ипотека
// в РФ, Испания, Коста-Рика, Казахстан, Перу, Шри-Ланка, Польша, Сев.Македония, Албания, Двойное
// налогообложение, Турция, Швеция, Перевод денег за рубеж, Мексика, Прибалтика, Бразилия, Переезд
// учителя, Оман, Дания, Черногория, Колумбия, Филиппины, Как открыть ИП/компанию за рубежом.
// 301-редирект на выжившую статью уже настроен в next.config.mjs через config/blog-redirects.json.
//
// Победитель в каждом кластере выбран вручную после прочтения 2-3 кандидатов с максимальным
// структурным сигналом (FAQ + внутренние ссылки + таблицы + h2, НЕ read_time) — как в этапах 2-3.
// 4 кластера потребовали больше одного победителя (разные интенты внутри одного стем-кластера):
// ОАЭ (сравнение городов vs общий IT-гайд), Чили/ЛатАм (страна vs обзор региона — по прямому указанию
// в задаче), Черногория (3 разных сравнения пар городов). См. "_comment_cluster_dedup_stage4_2026"
// в config/blog-redirects.json — там же список крупных фактических ошибок, исправленных в
// статьях-победителях (визы/налоги/сроки ВНЖ, несколько случаев неверных данных 2024-2026 годов).
//
// Скрипт читает ВЕСЬ redirects-объект (744 записи — 132+124+190 из этапов 1-3, 298 из этапа 4),
// а не только новые: это безопасно и идемпотентно — уже unpublished строки прошлых этапов просто
// перезаписываются тем же значением. id подтягиваются с Supabase на лету.
//
// Запуск: node scripts/cluster-dedup-stage4/01-unpublish-losers.mjs [--dry-run]
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

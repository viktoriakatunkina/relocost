// Помечает published=false у статей-дублей DN-городов, перечисленных как
// "проигравшие" в config/blog-redirects.json (301-редирект на выжившую
// статью уже настроен в next.config.mjs). Строки НЕ удаляются — только
// published меняется, обратимо.
//
// Самодостаточен: id подтягиваются с Supabase на лету (не из кеша), поэтому
// скрипт безопасно перезапускать (идемпотентен — уже unpublished строки
// просто перезаписываются тем же значением).
//
// Батчи по 20 id, пауза 500мс между запросами — Supabase недавно
// восстановилась после многочасовой аварии, не бомбим.
//
// Запуск: node scripts/dn-dedup/02-unpublish-losers.mjs [--dry-run]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const configPath = path.join(__dirname, "../../config/blog-redirects.json");
const { redirects: redirectMap } = JSON.parse(fs.readFileSync(configPath, "utf8"));
const loserSlugs = Object.keys(redirectMap);
console.log(`Loser slugs to unpublish: ${loserSlugs.length}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// Подтягиваем актуальные id по slug (не полагаемся на кеш из другого запуска).
const idBySlug = new Map();
const lookupChunks = chunk(loserSlugs, 50);
for (let i = 0; i < lookupChunks.length; i++) {
  const c = lookupChunks[i];
  const res = await fetch(`${SB_URL}/rest/v1/blog_posts?slug=in.(${c.join(",")})&select=id,slug`, {
    headers,
  });
  if (!res.ok) {
    console.error(`Lookup chunk ${i} FAILED: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const rows = await res.json();
  for (const r of rows) idBySlug.set(r.slug, r.id);
  await sleep(400);
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
    await sleep(150);
    continue;
  }
  const res = await fetch(`${SB_URL}/rest/v1/blog_posts?id=in.(${ids.join(",")})`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ published: false }),
  });
  if (!res.ok) {
    console.error(`Batch ${i + 1} FAILED: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const rows = await res.json();
  totalUpdated += rows.length;
  console.log(`Batch ${i + 1}/${batches.length}: updated ${rows.length} rows`);
  await sleep(500);
}

console.log(`\nTotal updated: ${totalUpdated}/${loserSlugs.length}`);

// Критический SEO-аудит 2026-10-28, находка №4: 2036 статей blog_posts с
// тегом "города" (HIDDEN_BLOG_TAG, lib/blog-visibility.ts — РЕГИСТР ЗНАЧИМ,
// нижний регистр) уже скрыты из sitemap/журнала/robots-индексации (noindex в
// generateMetadata app/[locale]/blog/[slug]/page.tsx), но страницы продолжают
// жить и отдавать 200 по прямому URL — это и мусорит в индексе Google у тех,
// кто уже успел их проиндексировать раньше, и просто лишние 2000+ живых URL
// без ценности. Переводим published=false — ОБРАТИМО, не хард-делит.
//
// Это НЕ дубли друг друга (в отличие от scripts/bank-dedup-2026-10) — каждая
// такая DN-карточка уникальна по городу/стране, редирект на другую статью
// не нужен. Просто скрываем всю пачку.
//
// Батчи по 50 id, пауза 500мс между запросами — обычный паттерн этого
// проекта для батчевых PATCH (см. scripts/dn-dedup/02-unpublish-losers.mjs).
//
// Запуск:
//   node scripts/dn-wave-tag-unpublish-2026-10/01-unpublish.mjs --dry-run
//   node scripts/dn-wave-tag-unpublish-2026-10/01-unpublish.mjs
import fs from "node:fs";
import os from "node:os";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(HOME + "/.relocost/supabase_url", "utf8").trim();
const SB_KEY = fs
  .readFileSync(HOME + "/.relocost/supabase_service_role_key", "utf8")
  .trim();
const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// Регистр значим: "города" (нижний регистр) — DN-карточки; "Города" (с
// большой буквы) — нормальные статьи журнала, их НЕ трогаем.
const TAG = "города";

const DRY_RUN = process.argv.includes("--dry-run");
console.log(DRY_RUN ? "DRY RUN — no writes" : "LIVE — will PATCH published=false");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// Собираем ВСЕ id постранично (PostgREST лимит по умолчанию — 1000 строк).
async function fetchAllIds() {
  let all = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const h = {
      ...headers,
      Range: `${offset}-${offset + pageSize - 1}`,
      "Range-Unit": "items",
    };
    const url = `${SB_URL}/rest/v1/blog_posts?select=id,slug&tag=eq.${encodeURIComponent(
      TAG,
    )}&published=eq.true&order=id`;
    const res = await fetch(url, { headers: h });
    if (!res.ok) throw new Error(`fetch failed: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    all = all.concat(rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

const rows = await fetchAllIds();
console.log(`Found ${rows.length} published rows with tag="${TAG}".`);

if (DRY_RUN) {
  console.log(`[dry] would PATCH published=false on ${rows.length} row(s).`);
  console.log("Sample (first 10):");
  for (const r of rows.slice(0, 10)) console.log(`  ${r.slug}`);
  process.exit(0);
}

const batches = chunk(rows.map((r) => r.id), 50);
let totalUpdated = 0;
for (let i = 0; i < batches.length; i++) {
  const ids = batches[i];
  const res = await fetch(`${SB_URL}/rest/v1/blog_posts?id=in.(${ids.join(",")})`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ published: false }),
  });
  if (!res.ok) {
    console.error(`Batch ${i + 1}/${batches.length} FAILED:`, res.status, await res.text());
    console.error(`Stopping — ${totalUpdated}/${rows.length} updated so far. Safe to re-run (idempotent).`);
    process.exit(1);
  }
  const updated = await res.json();
  totalUpdated += updated.length;
  console.log(`Batch ${i + 1}/${batches.length}: updated ${updated.length} rows (total ${totalUpdated}/${rows.length})`);
  await sleep(500);
}

console.log(`\nDone. Total updated: ${totalUpdated}/${rows.length}`);

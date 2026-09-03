// Часть аудита воронки блог → монетизируемые страницы (2026-09): 337
// опубликованных статей ссылаются на country_slug, которого НЕТ ни у одного
// города в таблице cities → /country/{slug} отдаёт 404, CTA статьи технически
// кликабелен, но ведёт в никуда. Для большинства (нет такой страны в БД
// вовсе — Panama, Kosovo, Norway...) единственный вменяемый фолбэк — общий
// (см. рантайм-фолбэк в app/[locale]/blog/[slug]/page.tsx, matchCitiesInTitle/
// matchCountryInTitle). НО часть орфанов — просто расхождение в написании
// slug (подчёркивание вместо дефиса, альтернативное имя) для страны, которая
// РЕАЛЬНО есть в cities с другим slug — тут правильный фикс проще и лучше:
// нормализовать country_slug статьи на канонический, и CTA поведёт на
// полноценную страницу страны с реальными городами вместо общего фолбэка.
//
// Запуск: node scripts/fix-orphan-country-slug-aliases.mjs [--dry-run] (по умолчанию)
//         node scripts/fix-orphan-country-slug-aliases.mjs --live
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
console.log(LIVE ? "LIVE — will PATCH country_slug aliases" : "DRY RUN — no writes (pass --live to apply)");

// Алиас → канонический country_slug (проверено: канонический существует в cities).
const ALIASES = {
  uk: "united-kingdom",
  united_kingdom: "united-kingdom",
  czechia: "czech-republic",
  czech_republic: "czech-republic",
  south_korea: "south-korea",
  sri_lanka: "sri-lanka",
  srilanka: "sri-lanka",
  south_africa: "south-africa",
  north_macedonia: "north-macedonia",
  hong_kong: "hong-kong",
};

async function fetchWithRetry(url, opts, retries = 4, backoffMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    const body = await res.text();
    console.error(`  attempt ${attempt}/${retries} failed: ${res.status} ${body.slice(0, 300)}`);
    if (attempt < retries) await new Promise((r) => setTimeout(r, backoffMs * attempt));
    else throw new Error(`Giving up: ${res.status}`);
  }
}

let totalUpdated = 0;
for (const [alias, canon] of Object.entries(ALIASES)) {
  const res = await fetchWithRetry(
    `${SB_URL}/rest/v1/blog_posts?select=id,slug&published=eq.true&country_slug=eq.${alias}`,
    { headers },
  );
  const rows = await res.json();
  console.log(`${alias} -> ${canon}: ${rows.length} posts`);
  if (!rows.length) continue;
  if (!LIVE) continue;
  const ids = rows.map((r) => r.id);
  const patchRes = await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=in.(${ids.join(",")})`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ country_slug: canon }),
  });
  const updated = await patchRes.json();
  totalUpdated += updated.length;
  console.log(`  updated ${updated.length}`);
  await new Promise((r) => setTimeout(r, 300));
}
console.log(`\nTotal updated: ${totalUpdated}`);

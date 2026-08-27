// Сверяет config/blog-redirects.json с ЖИВЫМИ данными Supabase: находит все
// slug'и (победители + проигравшие), проверяет что правило выбора победителя
// (макс. read_time, при равенстве — самый ранний created_at) всё ещё
// выполняется на текущих данных. Ничего не пишет — только читает.
// Самодостаточен: единственный источник правды — config/blog-redirects.json.
//
// Запуск: node scripts/dn-dedup/01-verify-live.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

const configPath = path.join(__dirname, "../../config/blog-redirects.json");
const { redirects: redirectMap } = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Реконструируем группы: winner -> [losers]
const groups = new Map();
for (const [loser, winner] of Object.entries(redirectMap)) {
  if (!groups.has(winner)) groups.set(winner, []);
  groups.get(winner).push(loser);
}
console.log(`Groups: ${groups.size}, redirect entries (losers): ${Object.keys(redirectMap).length}`);

const allSlugs = [...groups.keys(), ...Object.keys(redirectMap)];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const bySlug = new Map();
const chunks = chunk(allSlugs, 50);
for (let i = 0; i < chunks.length; i++) {
  const c = chunks[i];
  const res = await fetch(
    `${SB_URL}/rest/v1/blog_posts?slug=in.(${c.join(",")})&select=id,slug,read_time,created_at,published`,
    { headers },
  );
  if (!res.ok) {
    console.error(`Chunk ${i} FAILED: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const rows = await res.json();
  for (const r of rows) bySlug.set(r.slug, r);
  console.log(`Chunk ${i + 1}/${chunks.length}: got ${rows.length}/${c.length}`);
  await sleep(400);
}

console.log(`\nTotal fetched: ${bySlug.size}/${allSlugs.length}`);
const missing = allSlugs.filter((s) => !bySlug.has(s));
console.log(`Missing from live DB: ${missing.length}`, missing);

let ruleMismatches = 0;
for (const [winner, losers] of groups) {
  const members = [winner, ...losers].map((s) => bySlug.get(s)).filter(Boolean);
  if (members.length !== 1 + losers.length) continue;
  const sorted = [...members].sort((a, b) => {
    const rtDiff = (b.read_time || 0) - (a.read_time || 0);
    if (rtDiff !== 0) return rtDiff;
    return a.created_at.localeCompare(b.created_at);
  });
  if (sorted[0].slug !== winner) {
    ruleMismatches++;
    console.log(`RULE MISMATCH: config winner=${winner}, live-recomputed winner=${sorted[0].slug}`);
  }
}
console.log(`\nRule mismatches (live vs config): ${ruleMismatches}`);

const winnersNotPublished = [...groups.keys()].filter((s) => bySlug.has(s) && !bySlug.get(s).published);
console.log(`Winners currently NOT published: ${winnersNotPublished.length}`, winnersNotPublished);

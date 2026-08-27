// Независимая проверка после 02-unpublish-losers.mjs (можно перезапускать
// в любой момент как health-check):
//  - все "проигравшие" slug'и из config/blog-redirects.json существуют
//    (не удалены физически) и published=false
//  - все "выжившие" slug'и существуют и published=true (не задеты)
//
// Самодостаточен: единственный источник правды — config/blog-redirects.json.
// Запуск: node scripts/dn-dedup/03-verify.mjs
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

const losers = Object.keys(redirectMap);
const winners = [...new Set(Object.values(redirectMap))];
const all = [...winners, ...losers];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const bySlug = new Map();
const chunks = chunk(all, 50);
for (let i = 0; i < chunks.length; i++) {
  const c = chunks[i];
  const res = await fetch(`${SB_URL}/rest/v1/blog_posts?slug=in.(${c.join(",")})&select=slug,published`, {
    headers,
  });
  const rows = await res.json();
  for (const r of rows) bySlug.set(r.slug, r);
  await sleep(350);
}

console.log(`Fetched: ${bySlug.size}/${all.length}`);

const missingWinners = winners.filter((s) => !bySlug.has(s));
const winnersNotPublished = winners.filter((s) => bySlug.has(s) && !bySlug.get(s).published);
const missingLosers = losers.filter((s) => !bySlug.has(s));
const losersStillPublished = losers.filter((s) => bySlug.has(s) && bySlug.get(s).published);

console.log(`\nWinners: ${winners.length}, missing: ${missingWinners.length}, wrongly unpublished: ${winnersNotPublished.length}`);
if (missingWinners.length) console.log("  MISSING WINNERS:", missingWinners);
if (winnersNotPublished.length) console.log("  WINNERS NOT PUBLISHED:", winnersNotPublished);

console.log(`\nLosers: ${losers.length}, missing (deleted!): ${missingLosers.length}, still published (not unpublished!): ${losersStillPublished.length}`);
if (missingLosers.length) console.log("  MISSING LOSERS (rows deleted?!):", missingLosers);
if (losersStillPublished.length) console.log("  LOSERS STILL PUBLISHED:", losersStillPublished);

const ok =
  missingWinners.length === 0 &&
  winnersNotPublished.length === 0 &&
  missingLosers.length === 0 &&
  losersStillPublished.length === 0;
console.log(`\n${ok ? "OK — всё как ожидалось" : "PROBLEMS FOUND — see above"}`);

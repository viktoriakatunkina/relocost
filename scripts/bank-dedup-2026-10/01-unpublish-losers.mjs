// Точечная чистка после критического SEO-аудита (2026-10-28): помечает
// published=false у 2 статей-дублей "как открыть счет в банке X" (Армения,
// Казахстан), подтверждённых аудитором и проверенных вручную (полный текст
// прочитан, победитель — более полная статья в обеих парах, см.
// _comment_bank_account_dedup_2026_10_28 в config/blog-redirects.json).
// 301-редирект на выжившую статью уже настроен там же (ключ -> значение).
//
// Строки НЕ удаляются — только published меняется, обратимо.
// Самодостаточен и идемпотентен, как и предыдущие скрипты дедупа
// (scripts/dn-dedup, scripts/thematic-dedup, scripts/cluster-dedup-stage3/4):
// читает ТОЛЬКО 2 конкретных слага ниже (не весь redirects-объект — остальные
// 946 записей уже обработаны прошлыми волнами), id подтягиваются с Supabase
// на лету.
//
// Запуск: node scripts/bank-dedup-2026-10/01-unpublish-losers.mjs --dry-run
//         node scripts/bank-dedup-2026-10/01-unpublish-losers.mjs
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

// loser -> winner (информационно; редирект уже лежит в config/blog-redirects.json)
const PAIRS = {
  "schet-v-banke-armenii-2026": "otkryt-schet-v-banke-armenii-2026",
  "schet-v-banke-kazahstana-2026": "kak-otkryt-schet-v-banke-kazakhstana-2026",
};
const loserSlugs = Object.keys(PAIRS);

const DRY_RUN = process.argv.includes("--dry-run");
console.log(DRY_RUN ? "DRY RUN — no writes" : "LIVE — will PATCH published=false");
console.log("Loser slugs to unpublish:", loserSlugs);

const res = await fetch(
  `${SB_URL}/rest/v1/blog_posts?slug=in.(${loserSlugs.join(",")})&select=id,slug,published`,
  { headers },
);
if (!res.ok) {
  console.error("Lookup failed:", res.status, await res.text());
  process.exit(1);
}
const rows = await res.json();
console.log(`Found ${rows.length}/${loserSlugs.length} loser rows in DB:`);
for (const r of rows) console.log(`  ${r.slug} (id=${r.id}, published=${r.published})`);

const missing = loserSlugs.filter((s) => !rows.some((r) => r.slug === s));
if (missing.length) {
  console.error("ABORT: missing loser slugs (deleted or renamed?):", missing);
  process.exit(1);
}

if (DRY_RUN) {
  console.log(
    `\n[dry] would PATCH published=false on ${rows.length} row(s): ${rows
      .map((r) => r.slug)
      .join(", ")}`,
  );
  process.exit(0);
}

const ids = rows.map((r) => r.id);
const patchRes = await fetch(`${SB_URL}/rest/v1/blog_posts?id=in.(${ids.join(",")})`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({ published: false }),
});
if (!patchRes.ok) {
  console.error("PATCH failed:", patchRes.status, await patchRes.text());
  process.exit(1);
}
const updated = await patchRes.json();
console.log(`\nUpdated ${updated.length} row(s):`, updated.map((r) => r.slug));

// Одноразовый фикс падежей в cities.seo_title / cities.seo_description.
//
// БАГ (SEO-аудит 2026-09-07): мета городов генерились шаблоном
//   «Стоимость жизни в {name_ru} 2026: виза, цены, отзывы | Relocost»
// с подстановкой ИМЕНИТЕЛЬНОГО падежа. На выходе — «Стоимость жизни в
// Гамбург 2026», «в Ницца», «в Копенгаген», «в Лос-Анджелес» и т.д.
// Это и в <title> выдачи видно, и по запросу «стоимость жизни в гамбурге»
// точного вхождения не даёт.
//
// Источник правды по падежам — lib/city-prepositional.ts (тот же словарь,
// что использует рантайм). Парсим его регуляркой, а не импортируем: scripts/
// работают на чистом JS без ts-node (тот же приём, что в
// scripts/backfill-blog-city-country.mjs).
//
// Запуск:
//   node scripts/fix-city-meta-cases.mjs          # dry-run
//   node scripts/fix-city-meta-cases.mjs --live   # реальные PATCH
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
    else throw new Error("Giving up");
  }
}

// Читаем словарь предложного падежа из TS-файла.
const tsSrc = fs.readFileSync(path.join(__dirname, "../lib/city-prepositional.ts"), "utf8");
const PREP = {};
for (const m of tsSrc.matchAll(/^\s+"?([a-z0-9-]+)"?:\s*"([^"]+)",/gm)) PREP[m[1]] = m[2];
console.log(`Словарь предложного падежа: ${Object.keys(PREP).length} городов`);

// ё/е в БД и в словаре пишутся по-разному («Кёльн» vs «Кельне») — сравниваем
// и матчим без учёта ё (общее правило проекта: везде «е»).
const noYo = (s) => s.replace(/ё/g, "е").replace(/Ё/g, "Е");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

console.log(LIVE ? "LIVE — will PATCH cities" : "DRY RUN — no writes (pass --live to apply)");

const res = await fetchWithRetry(
  `${SB_URL}/rest/v1/cities?select=id,slug,name_ru,seo_title,seo_description&order=slug&limit=1000`,
);
const cities = await res.json();
console.log(`Городов: ${cities.length}`);

const plan = [];
for (const c of cities) {
  const correct = PREP[c.slug];
  if (!correct) continue;
  // Уже правильно («в Тбилиси» совпадает с именительным) — нечего чинить.
  if (noYo(correct) === noYo(`в ${c.name_ru}`)) continue;

  // Ищем «в|во|на <Название в именительном>» и меняем на верную форму.
  // ВАЖНО: \b здесь не работает — в JS это ASCII-граница ([A-Za-z0-9_]), а
  // предлог «в» кириллический, между пробелом и «в» границы нет и регулярка
  // молча не находит ничего. Поэтому левая граница задана явным lookbehind.
  const nameRe = new RegExp(
    `(?<=^|[\\s(«"])(?:во|на|в)\\s+${escapeRe(noYo(c.name_ru))}(?=[\\s,.:;)!?—-]|$)`,
    "gu",
  );

  const patch = {};
  for (const field of ["seo_title", "seo_description"]) {
    const val = c[field];
    if (!val) continue;
    const fixed = noYo(val).replace(nameRe, correct);
    if (fixed !== noYo(val)) patch[field] = fixed;
  }
  if (Object.keys(patch).length) plan.push({ city: c, patch });
}

console.log(`К обновлению городов: ${plan.length}\n`);
for (const { city, patch } of plan) {
  console.log(`── ${city.slug} (${city.name_ru})`);
  if (patch.seo_title) console.log(`   T было: ${city.seo_title}\n   T стало: ${patch.seo_title}`);
  if (patch.seo_description)
    console.log(`   D было: ${city.seo_description}\n   D стало: ${patch.seo_description}`);
}

if (!LIVE) {
  console.log("\nDRY RUN завершён. Ничего не записано.");
  process.exit(0);
}

let done = 0;
for (const { city, patch } of plan) {
  await fetchWithRetry(`${SB_URL}/rest/v1/cities?id=eq.${city.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  done++;
  await sleep(60);
}
console.log(`\nГотово. Обновлено городов: ${done}`);

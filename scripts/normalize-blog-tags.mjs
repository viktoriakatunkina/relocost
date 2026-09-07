// Одноразовая нормализация blog_posts.tag.
//
// ЗАЧЕМ. В базе накопилось ~105 различных значений tag, среди которых десятки
// регистровых/числовых дублей одного и того же смысла: «страны»/«Страны»/
// «страна», «Сравнение»/«сравнения»/«Сравнения»/«сравнение», «практика»/
// «Практика» и т.д. Из-за этого: (1) на /blog рисуется стена из ~100 чипов-
// фильтров вместо ~70 осмысленных, (2) RelatedPosts (components/blog/
// RelatedPosts.tsx) начисляет +3 балла за совпадение тега — и статьи с
// «Сравнение» никогда не матчатся со статьями «сравнения».
//
// ⚠️ КРИТИЧЕСКОЕ ИСКЛЮЧЕНИЕ: «города» и «Города» НЕЛЬЗЯ сливать.
// Это РАЗНЫЙ контент, а не регистровый дубль:
//   • «города» (1609 published) — справочные DN-карточки городов вида
//     «Танзания Морогоро DN 2026: 400-680 USD/мес; …». Намеренно исключены
//     из /blog и из sitemap (см. lib/blog-visibility.ts) — это сырьё для
//     CityArticles, а не материалы журнала.
//   • «Города» (113 published) — полноценные статьи журнала вида
//     «Стоимость жизни в Рио-де-Жанейро 2026: реальные цифры»,
//     «Лучшие районы Праги для жизни эмигрантов в 2026 году». Они ДОЛЖНЫ
//     быть и в блоге, и в sitemap; так их и создают seed-скрипты
//     (см. scripts/seed-10-night-batch9-aug-2026.mjs: tag: "Города").
// Слияние регистра здесь выкинуло бы 113 хороших статей из индекса.
// Проверено на реальных данных 2026-09-07 — не «чинить» это.
//
// Запуск:
//   node scripts/normalize-blog-tags.mjs            # dry-run
//   node scripts/normalize-blog-tags.mjs --live     # реальные PATCH
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

async function fetchAllPaged(urlBase, pageSize = 1000) {
  const all = [];
  let offset = 0;
  for (;;) {
    const res = await fetchWithRetry(`${urlBase}&offset=${offset}&limit=${pageSize}`);
    const rows = await res.json();
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// Карта «как в базе» → «канонический тег». Составлена по фактическому
// распределению значений (см. шапку), а не придумана: сливаем только
// регистровые/числовые варианты одного слова и однозначные синонимы.
// «города» и «Города» в карте намеренно ОТСУТСТВУЮТ — см. предупреждение выше.
const MAP = {
  // страна/страны
  страны: "Страны",
  страна: "Страны",
  // сравнения
  Сравнение: "Сравнения",
  сравнение: "Сравнения",
  сравнения: "Сравнения",
  // практика
  практика: "Практика",
  // визы
  визы: "Визы",
  Виза: "Визы",
  виза: "Визы",
  "ВНЖ и визы": "Визы",
  // финансы / деньги
  финансы: "Финансы",
  деньги: "Деньги",
  // рейтинги
  рейтинги: "Рейтинги",
  Рейтинг: "Рейтинги",
  // жизнь
  жизнь: "Жизнь",
  "Образ жизни": "Жизнь",
  Лайфстайл: "Жизнь",
  // переезд
  переезд: "Переезд",
  // документы
  документы: "Документы",
  // работа / карьера / профессии
  работа: "Работа",
  карьера: "Работа",
  профессии: "Профессии",
  профессия: "Профессии",
  // регионы
  европа: "Европа",
  азия: "Азия",
  африка: "Африка",
  "ближний восток": "Ближний Восток",
  "латинская америка": "Латинская Америка",
  латам: "Латинская Америка",
  америка: "Северная Америка",
  "северная америка": "Северная Америка",
  "средняя азия": "Центральная Азия",
  австралия: "Австралия",
  австралазия: "Австралия",
  балканы: "Европа",
  кавказ: "Кавказ",
  // прочее
  аналитика: "Аналитика",
  психология: "Психология",
  семья: "Семья",
  налоги: "Налоги",
  бизнес: "Бизнес",
  образование: "Образование",
  жилье: "Жильё",
  Жилье: "Жильё",
  гайд: "Гайд",
  гиды: "Гайд",
  советы: "Советы",
  острова: "Острова",
  Гражданство: "ВНЖ",
  "цифровые кочевники": "Цифровые кочевники",
};

console.log(LIVE ? "LIVE — will PATCH tag" : "DRY RUN — no writes (pass --live to apply)");

const rows = await fetchAllPaged(`${SB_URL}/rest/v1/blog_posts?select=id,slug,tag,published&order=created_at.desc`);
console.log(`Загружено строк: ${rows.length}`);

const before = new Map();
for (const r of rows) before.set(r.tag ?? "(null)", (before.get(r.tag ?? "(null)") ?? 0) + 1);
console.log(`Уникальных тегов ДО: ${before.size}`);

const targets = rows.filter((r) => r.tag && MAP[r.tag] && MAP[r.tag] !== r.tag);
console.log(`К обновлению строк: ${targets.length}`);

const moves = new Map();
for (const r of targets) {
  const k = `${r.tag} → ${MAP[r.tag]}`;
  moves.set(k, (moves.get(k) ?? 0) + 1);
}
for (const [k, n] of [...moves].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);

const after = new Map();
for (const r of rows) {
  const t = r.tag ? (MAP[r.tag] ?? r.tag) : "(null)";
  after.set(t, (after.get(t) ?? 0) + 1);
}
console.log(`Уникальных тегов ПОСЛЕ: ${after.size}`);

// Страховка: «города» и «Города» обязаны остаться разными значениями.
if (!after.has("города") || !after.has("Города")) {
  console.error('ОСТАНОВ: карта слила «города»/«Города» — это разный контент, см. шапку файла.');
  process.exit(1);
}
console.log(`  контроль: «города»=${after.get("города")}, «Города»=${after.get("Города")} — не слиты, ок`);

if (!LIVE) {
  console.log("\nDRY RUN завершён. Ничего не записано.");
  process.exit(0);
}

// Обновляем группой по исходному тегу — один PATCH на весь тег вместо
// построчных запросов (PostgREST умеет UPDATE ... WHERE tag = ...).
const byOldTag = new Map();
for (const r of targets) {
  if (!byOldTag.has(r.tag)) byOldTag.set(r.tag, 0);
  byOldTag.set(r.tag, byOldTag.get(r.tag) + 1);
}
let done = 0;
for (const [oldTag, n] of byOldTag) {
  await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?tag=eq.${encodeURIComponent(oldTag)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ tag: MAP[oldTag] }),
  });
  done += n;
  console.log(`  ${oldTag} → ${MAP[oldTag]} (${n})`);
  await sleep(150);
}
console.log(`Готово. Обновлено строк: ${done}`);

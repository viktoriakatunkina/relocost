// ============================================================
// Relocost.ru — чинит капслок-раздел «Itogo» в конце статей блога.
//
// Проблема (аудит качества блога, 2026-09): у статей бывшей DN-волны
// (city_id/country_slug DN-генератор, тег в основном "города") в конце почти
// каждой статьи есть markdown-раздел с заголовком «## Itogo» (транслит-опечатка
// вместо «Итог») и телом вида:
//   Марокко Фес DN 2026: БЕЗВИЗ 90 ДНЕЙ; $400-700 БЮДЖЕТ; ЮНЕСКО 1981; ...;
//   МИНУС: нет прямых рейсов РФ; агрессивные торговцы (...); ...
// — капслок-вставки, разделённые «;», читаются как список ключевых слов, а не
// связный текст. Проверено: разделы под ПРАВИЛЬНО написанным заголовком
// «## Итог»/«## Итого» (другие генераторы, не DN-волна) уже написаны нормальным
// связным текстом и капслока не содержат — их не трогаем (см. вывод
// scripts/_tmp_itog6 в истории сессии: там просто плотные бизнес-акронимы
// ИП/ООО/ВНЖ/НДФЛ, это нормальная лексика, а не капслок-стаффинг).
//
// Что делает:
//   1. Находит markdown-заголовок «## Itogo» / «### ITOGO» и т.п. (транслит,
//      любой регистр) — переименовывает в «## Итог».
//   2. Берёт текст раздела (до следующего заголовка/конца статьи), режет его
//      на предложения по «;» ВЕРХНЕГО уровня (вне скобок «(...)» и кавычек-
//      ёлочек «...» — там «;» это часть перечисления внутри одного факта, не
//      разделитель предложений).
//   3. В каждом предложении гасит КАПС: слово из 2+ подряд заглавных кириллических
//      букв (с границей слова) заменяется на:
//        - как есть, если это известная аббревиатура (РФ, США, ЕС, ОАЭ, ВНЖ,
//          ЮНЕСКО, ШЕНГЕН(нет, это обычное слово — не в списке) и т.п., см.
//          ACRONYM_WHITELIST ниже — только настоящие институциональные
//          сокращения, НЕ единицы измерения км/мин/млн/мес — те гасим);
//        - с заглавной первой буквы, если это известное имя города/страны из
//          таблицы cities (словарь строится из name_ru/country_ru — те же
//          данные, что в scripts/fix-blog-caption-mismatches.mjs для задачи
//          №1, никакого отдельного маленького списка вручную);
//        - иначе — строчными.
//      Первая буква каждого получившегося предложения принудительно делается
//      заглавной (обычная логика начала предложения).
//   4. Склеивает предложения через ". " вместо "; " — связный текст вместо
//      списка. Не трогает контент ВНЕ раздела «Itogo».
//
// Программная (не LLM) трансформация — детерминированная, безопасна для
// массового прогона на тысячах статей. Возможные мелкие огрехи (несловарное
// имя собственное посреди фразы может остаться со строчной буквы) — это
// стилистическая мелочь, не фактическая ошибка; альтернатива (капслок-список)
// была хуже.
//
// Запуск:
//   node scripts/fix-blog-itogo-capslock.mjs               # dry-run (по умолчанию)
//   node scripts/fix-blog-itogo-capslock.mjs --dry-run      # то же явно
//   node scripts/fix-blog-itogo-capslock.mjs --live         # реальные PATCH
// ============================================================
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
console.log(LIVE ? "LIVE — will PATCH content_md" : "DRY RUN — no writes (pass --live to apply)");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, opts, retries = 4, backoffMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    const body = await res.text();
    console.error(`  attempt ${attempt}/${retries} failed: ${res.status} ${body.slice(0, 300)}`);
    if (attempt < retries) await sleep(backoffMs * attempt);
    else throw new Error(`Giving up after ${retries} attempts: ${res.status}`);
  }
}

async function fetchAllPaged(urlBase, pageSize = 1000) {
  const all = [];
  let offset = 0;
  for (;;) {
    const res = await fetchWithRetry(`${urlBase}&offset=${offset}&limit=${pageSize}`, { headers });
    const rows = await res.json();
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// --- Известные институциональные аббревиатуры (НЕ единицы измерения — км,
// мин, млн, млрд, тыс, мес, лет, год, кг, см, га — те гасим намеренно, по
// русской типографике они пишутся строчными). Список собран по частотному
// разбору всех "Itogo"-разделов (см. историю сессии) + здравый смысл. ---
const ACRONYM_WHITELIST = new Set([
  "РФ", "США", "ЕС", "ОАЭ", "ВНЖ", "ПМЖ", "НДФЛ", "ИП", "ООО", "ЮАР", "ЮНЕСКО",
  "СНГ", "ВВП", "НДС", "ФНС", "МИД", "СМИ", "ООН", "НАТО", "ВТО", "ЕАЭС",
  "ГДР", "ФРГ", "СССР", "ЦБ", "МВД", "КИК", "УКЭП", "НПД", "ГЭС", "АЭС",
  "ЕЦБ", "ЗАГС", "НИИ", "ЦЕРН", "КПП", "ЕСПЧ", "ВОЗ", "УЕФА", "МФЦА", "ДРК",
  "ЮВА", "ГБАО", "КНР", "СЭЗ", "АТЭС", "БРИКС", "ОПЕК", "ЮНИСЕФ", "ЭЦП",
  "НКО", "ДНК", "МККК", "УСН", "ЖД", "ВВ", "МСК", "НЛО", "СП", "ВС", "ВОВ",
  "НАН", "МВД", "ГПН", "ЦРУ", "ФБР", "ФСБ", "КГБ", "ЖКХ", "ВИЧ", "ОРВИ",
  "СИЗО", "ЕГЭ", "ВУЗ", "МФЦ", "ГОСТ", "ИНН", "СНИЛС", "ОМС", "ДМС", "ЧМ",
]);

const normalize = (s) => s.toLowerCase().replace(/ё/g, "е");
const wordBoundaryRegex = (name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![а-яa-z0-9])${escaped}(?![а-яa-z0-9])`, "i");
};

const cities = await fetchAllPaged(
  `${SB_URL}/rest/v1/cities?select=id,slug,name_ru,country_ru,country_slug`,
);
console.log(`Cities loaded: ${cities.length}`);

// Словарь "нормализованное слово -> оригинальное написание" из названий
// городов/стран (в т.ч. частей составных имён вроде "Рио-де-Жанейро" ->
// рио/де/жанейро, каждая часть с исходным регистром — "де" остаётся строчным,
// как в БД, "Рио"/"Жанейро" — с заглавной).
const PROPER_NOUNS = new Map();
const wordSplitRe = /[А-ЯЁа-яё]+/g;
for (const c of cities) {
  for (const src of [c.name_ru, c.country_ru]) {
    if (!src) continue;
    for (const w of src.match(wordSplitRe) || []) {
      const key = normalize(w);
      if (key.length < 2) continue;
      if (!PROPER_NOUNS.has(key)) PROPER_NOUNS.set(key, w);
    }
  }
}
console.log(`Proper-noun word dictionary: ${PROPER_NOUNS.size} entries`);

// Для нечёткого сопоставления словоформ (падежи): "мадрида" (Р.п.) не
// совпадает буквально со словарным "мадрид" (И.п.) — пробуем by-prefix:
// склонение почти всегда ДОБАВЛЯЕТ окончание 1-3 буквы к основе, префикс не
// меняется. Ключи длиной от 4 букв, отсортированы по убыванию длины (сначала
// самый длинный/точный вариант).
const PROPER_NOUN_KEYS_DESC = [...PROPER_NOUNS.keys()]
  .filter((k) => k.length >= 4)
  .sort((a, b) => b.length - a.length);

function properNounFor(normKey) {
  if (PROPER_NOUNS.has(normKey)) return PROPER_NOUNS.get(normKey);
  for (const key of PROPER_NOUN_KEYS_DESC) {
    if (normKey.length <= key.length) continue;
    if (normKey.startsWith(key) && normKey.length - key.length <= 3) {
      const stem = PROPER_NOUNS.get(key);
      const suffix = normKey.slice(key.length);
      return stem + suffix;
    }
  }
  return null;
}

// --- Заголовок раздела: любой регистр, транслит "Itogo" (не путать с
// правильным русским "Итог"/"Итого" — те не трогаем, см. шапку файла). ---
const HEADING_RE = /^(#{2,3})\s*Itogo\s*$/im;

// Токен КАПСА: (а) 2+ подряд заглавных кириллических буквы — без учёта границ
// соседних символов (нарочно: артефакты вида "АЛЬКаЗАР" со случайной строчной
// буквой внутри капс-слова встречаются в исходных данных, и по обе стороны от
// неё капс всё равно нужно погасить); (б) ОДНА заглавная буква-токен (предлоги
// «В»/«К»/«С» и т.п., которые тоже попадали в капс-фразу) — но ТОЛЬКО если она
// действительно стоит отдельным словом (не первая буква обычного Title-Case
// слова вроде «Тбилиси» — там сразу после неё идёт строчная буква без границы).
const CAPS_TOKEN_RE =
  /(?<![А-ЯЁа-яё])[А-ЯЁ](?![А-ЯЁа-яё])|[А-ЯЁ]{2,}/g;

function fixCapsInClause(clause) {
  let out = clause.replace(CAPS_TOKEN_RE, (tok) => {
    if (ACRONYM_WHITELIST.has(tok)) return tok;
    const key = normalize(tok);
    const proper = properNounFor(key);
    if (proper) return proper;
    return key; // строчными
  });
  // Заглавная первая буква предложения (первый буквенный символ, пропуская
  // ведущие «, (, цифры, пробелы) — кроме случая, когда это стилизованное
  // название вида "eVisa"/"e-Residency" (строчная латинская буква сразу перед
  // заглавной — форсированная заглавная тут испортит бренд/термин).
  const m = out.match(/[А-ЯЁа-яёA-Za-z]/);
  if (m && m.index !== undefined) {
    const i = m.index;
    const isStylizedLead = /^[a-z][A-Z]/.test(out.slice(i));
    if (!isStylizedLead) {
      out = out.slice(0, i) + out[i].toUpperCase() + out.slice(i + 1);
    }
  }
  return out;
}

// Разбивает текст раздела на предложения по ";" ВЕРХНЕГО уровня — то есть вне
// круглых скобок и кавычек-ёлочек «...» (см. пример "АЛЬ-КАРАУИИН (859 Г.;
// СТАРЕЙШИЙ УНИВЕРСИТЕТ!)" — «;» внутри скобок остаётся частью одного факта).
function splitTopLevel(text) {
  const clauses = [];
  let depth = 0;
  let inQuote = false;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (ch === "«") inQuote = true;
    else if (ch === "»") inQuote = false;
    else if (ch === ";" && depth === 0 && !inQuote) {
      clauses.push(text.slice(start, i));
      start = i + 1;
    }
  }
  clauses.push(text.slice(start));
  return clauses.map((c) => c.trim()).filter(Boolean);
}

// Убирает дублирующую концевую пунктуацию — частый артефакт исходных данных:
// "!)!" -> "!)" (двойное "!" вокруг закрывающей скобки) и "!." / ".." / "?!"
// и т.п. напрямую подряд -> один самый выразительный знак ("!" > "?" > ".").
function dedupeTerminalPunct(s) {
  return s
    .replace(/([!?.])\)([!?.])/g, "$1)")
    .replace(/[.!?]{2,}/g, (m) => (m.includes("!") ? "!" : m.includes("?") ? "?" : "."));
}

function rewriteSection(sectionBody) {
  const clauses = splitTopLevel(sectionBody);
  const rewritten = clauses.map((clause) => {
    const fixed = fixCapsInClause(clause);
    const trimmed = fixed.trim();
    if (!trimmed) return "";
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  });
  const joined = rewritten.filter(Boolean).join(" ");
  return dedupeTerminalPunct(joined);
}

const posts = await fetchAllPaged(
  `${SB_URL}/rest/v1/blog_posts?select=id,slug,title,content_md&published=eq.true`,
);
console.log(`Published posts: ${posts.length}`);

const updates = []; // { id, slug, content_md, before, after }

for (const p of posts) {
  const md = p.content_md || "";
  const hm = md.match(HEADING_RE);
  if (!hm) continue;
  const headingStart = hm.index;
  const headingLevel = hm[1];
  const bodyStart = headingStart + hm[0].length;
  // Конец раздела — следующий заголовок любого уровня, либо конец текста.
  const rest = md.slice(bodyStart);
  const nextHeadMatch = rest.match(/^\s*#{1,6}\s/m);
  const bodyEnd = nextHeadMatch ? bodyStart + nextHeadMatch.index : md.length;
  const sectionBody = md.slice(bodyStart, bodyEnd);

  const newBody = rewriteSection(sectionBody);
  if (!newBody) continue;

  const newHeading = `${headingLevel} Итог`;
  const newMd =
    md.slice(0, headingStart) + newHeading + "\n\n" + newBody + "\n" + md.slice(bodyEnd);

  updates.push({
    id: p.id,
    slug: p.slug,
    content_md: newMd,
    before: sectionBody.trim(),
    after: newBody.trim(),
  });
}

console.log(`\nСтатей с разделом «Itogo»: ${updates.length}`);

// --- Санити-проверка перед массовой записью: остаточный капслок (за вычетом
// вайтлиста аббревиатур — ожидаемо встречается, это нормально) и битая
// пунктуация. ---
{
  let residualCaps = 0;
  let doublePunct = 0;
  let emptyAfter = 0;
  for (const u of updates) {
    if (!u.after) {
      emptyAfter++;
      continue;
    }
    const toks = u.after.match(/[А-ЯЁ]{2,}/g) || [];
    const nonWhitelisted = toks.filter((t) => !ACRONYM_WHITELIST.has(t));
    if (nonWhitelisted.length) residualCaps++;
    if (/[.!?]{2,}|\.\s*\./.test(u.after)) doublePunct++;
  }
  console.log(`Санити: пустой результат: ${emptyAfter}`);
  console.log(`Санити: остаточный капслок вне вайтлиста (после лучшей попытки): ${residualCaps}`);
  console.log(`Санити: подозрительная двойная пунктуация: ${doublePunct}`);
  if (process.argv.includes("--show-punct-issues")) {
    let shown = 0;
    for (const u of updates) {
      if (!/[.!?]{2,}|\.\s*\./.test(u.after || "")) continue;
      console.log(`\n--- ${u.slug}`);
      console.log(u.after);
      if (++shown >= 15) break;
    }
  }
}

const onlySlugsArg = process.argv.find((a) => a.startsWith("--slugs="));
if (onlySlugsArg) {
  const want = new Set(onlySlugsArg.slice("--slugs=".length).split(","));
  console.log(`\n=== --slugs фильтр ===`);
  for (const u of updates) {
    if (!want.has(u.slug)) continue;
    console.log(`\n--- ${u.slug}`);
    console.log("ДО:   ", u.before);
    console.log("ПОСЛЕ:", u.after);
  }
  process.exit(0);
}

console.log(`\n=== Примеры (до → после), 8 штук ===`);
const shownIdx = [
  0,
  Math.floor(updates.length / 4),
  Math.floor(updates.length / 2),
  Math.floor((3 * updates.length) / 4),
  updates.length - 1,
].filter((i) => i >= 0 && i < updates.length);
const seen = new Set();
for (const i of shownIdx) {
  if (seen.has(i)) continue;
  seen.add(i);
  const u = updates[i];
  console.log(`\n--- ${u.slug}`);
  console.log("ДО:   ", u.before.slice(0, 500));
  console.log("ПОСЛЕ:", u.after.slice(0, 500));
}
// плюс несколько случайных для разнообразия
const rand = updates
  .map((u, i) => [Math.random(), i])
  .sort((a, b) => a[0] - b[0])
  .slice(0, 4)
  .map(([, i]) => i);
for (const i of rand) {
  if (seen.has(i)) continue;
  seen.add(i);
  const u = updates[i];
  console.log(`\n--- ${u.slug}`);
  console.log("ДО:   ", u.before.slice(0, 500));
  console.log("ПОСЛЕ:", u.after.slice(0, 500));
}

if (!LIVE) {
  console.log(`\nDRY RUN: к записи ${updates.length} статей. Ничего не записано — повторите с --live.`);
  process.exit(0);
}

console.log(`\nЗапись ${updates.length} статей...`);
let written = 0;
for (const u of updates) {
  const res = await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=eq.${u.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ content_md: u.content_md }),
  });
  const rows = await res.json();
  if (!rows.length) throw new Error(`update ${u.slug}: no rows returned`);
  written++;
  if (written % 100 === 0) process.stdout.write(`\r  записано ${written}/${updates.length}  `);
  await sleep(60);
}
console.log(`\n✓ Записано статей: ${written}/${updates.length}`);

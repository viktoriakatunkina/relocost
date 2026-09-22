// 2026-09-22 (SEO-аудит, батч 2): после первого прохода (fix-stuffed-titles-sep2026.mjs,
// порог >90 символов без пунктуации) осталась вторая волна той же природы —
// keyword-salad seo_title короче 90 символов, часто с утекшим техническим
// токеном "DN" (внутреннее кодовое имя волны генерации контента, не должно
// быть видно пользователям/поисковикам).
//
// Ключевое наблюдение: у подавляющего большинства таких постов поле `title`
// уже нормальное, человекочитаемое, с пунктуацией (кластеры ключевых слов
// разделены через ":" и ";"). Поэтому seo_title для этой волны генерируется
// АЛГОРИТМИЧЕСКИ из `title` того же поста — без ручной правки 895 заголовков
// и без лишнего платного API-вызова. `title` при этом не трогается вообще.
//
// Использование:
//   node scripts/fix-stuffed-seo-titles-batch2-sep2026.mjs
//     -> dry-run: находит кандидатов, пишет полный список
//        (slug, oldSeoTitle, newSeoTitle) в scratch-fix-batch2-preview.json,
//        в консоль печатает только сводку + 20 случайных примеров.
//
//   node scripts/fix-stuffed-seo-titles-batch2-sep2026.mjs --live
//     -> применяет newSeoTitle в Supabase (обновляет ТОЛЬКО seo_title).

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import os from "os";
import path from "path";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(H + "/.relocost/supabase_url", "utf8").trim(),
  fs.readFileSync(H + "/.relocost/supabase_service_role_key", "utf8").trim(),
  { auth: { persistSession: false } }
);

const LIVE = process.argv.includes("--live");

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const PREVIEW_OUT = path.join(process.cwd(), "scratch-fix-batch2-preview.json");

const SUFFIX_RE = /(?:\s*\|\s*Relocost\s*)+$/i;
// Признак keyword-salad: ни одного из этих разделителей между кластерами слов.
const PUNCT_RE = /[,:;—–-]/;

function stripSuffix(str) {
  return str.replace(SUFFIX_RE, "").trim();
}

function isCandidate(seoTitle) {
  if (!seoTitle) return false;
  const base = stripSuffix(seoTitle);
  if (base.length <= 50) return false;
  if (PUNCT_RE.test(base)) return false;
  return true;
}

// Убирает висячую пунктуацию/пробелы с конца строки (":", ";", ",", "-", "—", "–").
function trimTrailingPunct(str) {
  return str.replace(/[\s,;:.\-—–]+$/u, "").trim();
}

// Обрезает по последнему пробелу перед лимитом символов (не режет слово).
function truncateAtWord(str, limit) {
  if (str.length <= limit) return str;
  const slice = str.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim();
}

// В ~400 заголовках DN стоит сразу после предлога ("для DN", "от DN" и т.п. —
// "для digital nomad'ов"). Если удалить только DN, предлог повисает без
// объекта ("Пхукет и Самуи для 2026"). Поэтому предлог + DN убираем как
// единую пару. Границы слов проверяем через пробел/начало строки/скобку,
// т.к. \b в JS не работает с кириллицей (она вне \w).
const PREP_GROUP = "(?:для|от|из|за|по|на|с|к|в|у|о)";
const PREP_DN_RE = new RegExp(`(^|[\\s(])${PREP_GROUP}\\s+DN\\b`, "giu");

// Короткие служебные слова, на которых не должен обрываться заголовок
// (остаются "висячими" после обрезки по лимиту символов или после удаления
// предлог+DN в конце строки).
const TRAILING_STOPWORDS = new Set([
  "и", "а", "но", "или", "да", "что", "как", "для", "от", "из", "за", "по",
  "на", "с", "к", "в", "у", "о", "до", "при", "не", "ли", "же", "vs",
]);

function stripTrailingStopwords(str) {
  const words = str.split(" ");
  let guard = 0;
  while (guard < 3 && words.length > 1) {
    const last = words[words.length - 1].replace(/[.,!?;:]+$/u, "").toLowerCase();
    if (!TRAILING_STOPWORDS.has(last)) break;
    words.pop();
    guard += 1;
  }
  return words.join(" ").trim();
}

function generateSeoTitleFromTitle(title) {
  // 1. Убрать утекший технический токен DN (и предлог перед ним, если есть)
  // как отдельное слово, схлопнуть пробелы.
  let cleaned = title
    .replace(PREP_DN_RE, "$1")
    .replace(/\s*\bDN\b\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    // Убрать осиротевший пробел перед пунктуацией (напр. "для DN, $700" ->
    // "для , $700" после удаления DN) и задвоенные запятые.
    .replace(/\s+([,;:.!?])/g, "$1")
    .replace(/,\s*,/g, ",")
    .trim();

  // 2. Найти позиции разделителей кластеров (":" или ";").
  const sepRe = /[:;]/g;
  const positions = [];
  let m;
  while ((m = sepRe.exec(cleaned)) !== null) {
    positions.push(m.index);
  }

  // Идем по разделителям по порядку и берем первый, который дает кусок
  // длиной >=20 символов (обычно это первый, иногда второй — как в примерах
  // из ТЗ). Если ни один разделитель не подошел (например, единственный
  // разделитель стоит сразу после вводного слова вроде "Тест:", "Сравнение:")
  // — используем весь заголовок целиком, чтобы не терять смысл.
  let candidate = cleaned;
  if (positions.length > 0) {
    let found = null;
    for (const pos of positions) {
      const part = cleaned.slice(0, pos).trim();
      if (part.length >= 20) {
        found = part;
        break;
      }
    }
    candidate = found || cleaned;
  }

  // 3. Если все еще длиннее 70 — обрезать по последнему пробелу перед 65-м символом.
  if (candidate.length > 70) {
    candidate = truncateAtWord(candidate, 65);
  }

  // 4. Убрать висячий предлог/союз в конце (мог остаться после обрезки по
  // лимиту символов или после удаления предлог+DN в самом конце строки),
  // затем убрать висячую пунктуацию.
  candidate = stripTrailingStopwords(candidate);
  candidate = trimTrailingPunct(candidate);

  // 5. Добавить суффикс, если его еще нет.
  if (!/\|\s*relocost\s*$/i.test(candidate)) {
    candidate = `${candidate} | Relocost`;
  }

  return candidate;
}

async function fetchAllPosts() {
  let all = [];
  let from = 0;
  const PAGE = 1000;
  for (;;) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("id,slug,title,seo_title")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    all = all.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

function pickRandom(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

async function main() {
  const localSlugs = new Set(
    fs.readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
  );
  console.log(`content/blog: ${localSlugs.size} md-файлов (эти slug'и исключаем)`);

  const allPosts = await fetchAllPosts();
  console.log(`blog_posts всего: ${allPosts.length}`);

  const eligible = allPosts.filter((p) => !localSlugs.has(p.slug));
  const candidates = eligible.filter((p) => isCandidate(p.seo_title));
  console.log(`кандидатов (seo_title >50 симв. без пунктуации, нет локального .md): ${candidates.length}`);

  const plan = candidates.map((p) => ({
    slug: p.slug,
    oldSeoTitle: p.seo_title,
    newSeoTitle: generateSeoTitleFromTitle(p.title),
    title: p.title,
    id: p.id,
  }));

  fs.writeFileSync(
    PREVIEW_OUT,
    JSON.stringify(
      plan.map(({ slug, oldSeoTitle, newSeoTitle }) => ({ slug, oldSeoTitle, newSeoTitle })),
      null,
      2
    ),
    "utf8"
  );
  console.log(`\nПолный список (${plan.length} записей) записан в: ${PREVIEW_OUT}`);

  const sample = pickRandom(plan, 20);
  console.log(`\n20 случайных примеров (старый -> новый):\n`);
  for (const s of sample) {
    console.log(`--- ${s.slug}`);
    console.log(`  title: ${s.title}`);
    console.log(`  было:  ${s.oldSeoTitle}`);
    console.log(`  стало: ${s.newSeoTitle}`);
  }

  if (!LIVE) {
    console.log(`\nDRY-RUN: в БД ничего не записано. Проверь ${PREVIEW_OUT} и примеры выше, затем запусти с --live.`);
    return;
  }

  console.log("\n--live: применяем апдейты (только seo_title)...");
  let updated = 0;
  for (const p of plan) {
    const { error } = await sb
      .from("blog_posts")
      .update({ seo_title: p.newSeoTitle })
      .eq("id", p.id);
    if (error) {
      console.error(`  [ERR] ${p.slug}: ${error.message}`);
      continue;
    }
    updated += 1;
  }
  console.log(`Обновлено постов в Supabase: ${updated} / ${plan.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

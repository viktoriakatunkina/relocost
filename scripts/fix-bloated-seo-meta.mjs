// Одноразовый фикс раздутых seo_title / seo_description в blog_posts.
//
// БАГ (найден SEO-аудитом 2026-09-07): скрипты генерации статей заливали в
// МЕТА-поля не короткий заголовок, а кусок тела статьи целиком — через
// разделители ": " и "; ". Живой пример:
//   /blog/kak-nayti-rabotu-v-it-v-germanii-2026
//   seo_title       = 3881 символ (!), seo_description = 1971 символ
// Google/Яндекс такие <title> обрезают и трактуют как спам-заголовки, вся
// страница теряет релевантность по своему же главному запросу.
//
// Масштаб на момент фикса: seo_title > 150 — 1462 строки (1282 published),
// seo_description > 300 — 709 строк (537 published), суммарно 1819 (1568 pub).
//
// ВАЖНО: тело статьи (content_md) и H1 (title) НЕ трогаем — баг только в
// двух мета-полях. Каждое поле чинится независимо: если раздут только
// seo_title, seo_description остаётся как есть.
//
// АЛГОРИТМ. Обе строки имеют одну и ту же структуру: осмысленная «шапка»,
// затем ": "/"; " и сваленное тело (обычно КАПСОМ). Поэтому:
//   1) режем строку на сегменты по ": " / "; " (разделители сохраняем);
//   2) жадно набираем сегменты, пока укладываемся в лимит поля;
//   3) для title дополнительно останавливаемся на первом КАПС-сегменте —
//      это маркер начала сваленного тела (для description капс НЕ маркер:
//      там капс — штатный стиль оформления, см. сотни нормальных описаний);
//   4) если набралось слишком мало — добираем начало следующего сегмента
//      по границе слова;
//   5) чистим хвост: висящие предлоги/союзы, непарные скобки и кавычки.
//
// Запуск:
//   node scripts/fix-bloated-seo-meta.mjs                 # dry-run, все строки
//   node scripts/fix-bloated-seo-meta.mjs --sample=20     # dry-run на 20 строках
//   node scripts/fix-bloated-seo-meta.mjs --live          # реальные PATCH
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
const sampleArg = process.argv.find((a) => a.startsWith("--sample="));
const SAMPLE = sampleArg ? Number(sampleArg.split("=")[1]) : 0;
const OUT = process.argv.find((a) => a.startsWith("--out="))?.split("=")[1];

// Пороги «раздутости» (что чиним) и целевые длины (во что превращаем).
const TITLE_BLOATED = 150;
const DESC_BLOATED = 300;
const TITLE_MAX = 70; // верхняя граница нового seo_title
const TITLE_MIN = 30; // ниже — пробуем добрать следующий сегмент
const TITLE_STRETCH = 6; // на столько можно превысить MAX, чтобы взять сегмент ЦЕЛИКОМ
const DESC_MAX = 160;
const DESC_MIN = 90;
const DESC_STRETCH = 12;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Стандартный для проекта паттерн устойчивости к нестабильному Supabase
// (см. scripts/backfill-blog-city-country.mjs): raw REST + ретраи с бэкоффом.
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
    else throw new Error(`Giving up after ${retries} attempts: ${url.slice(0, 120)}`);
  }
}

// PostgREST молча режет ответ по db-max-rows=1000 — всегда ходим страницами.
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

// ── Разбор строки на сегменты ──────────────────────────────────────────────
// Делим по ": " и "; " (с пробелом после знака — чтобы не разорвать "10:30",
// "1:2" и подобное). Разделители сохраняем, чтобы склеивать обратно как было.
function splitSegments(s) {
  const parts = s.split(/(:\s+|;\s+)/);
  const segs = [];
  for (let i = 0; i < parts.length; i += 2) {
    const text = (parts[i] ?? "").trim();
    const sepAfter = (parts[i + 1] ?? "").trim(); // ":" или ";"
    if (text) segs.push({ text, sepAfter: sepAfter ? `${sepAfter} ` : "" });
  }
  return segs;
}

// КАПС-сегмент = маркер начала сваленного тела статьи в seo_title.
function isCapsDump(text) {
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length < 8) return false;
  const upper = letters.filter((c) => c === c.toUpperCase() && c !== c.toLowerCase());
  return upper.length / letters.length > 0.7;
}

// Обрезка по границе слова, без многоточия. Границей считаем не только
// пробел, но и «,» и «/»: в этих метах часто встречаются длинные перечисления
// без пробелов («Meetup.com/Internations/Facebook-группы/LinkedIn»), на
// которых обрезка только по пробелу выкидывала бы весь блок целиком.
function trimWords(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max + 1);
  const idx = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf(","), cut.lastIndexOf("/"));
  return (idx > 0 ? cut.slice(0, idx) : s.slice(0, max)).trim();
}

const DANGLING =
  /\s(?:и|или|а|но|в|во|на|за|из|от|до|по|с|со|к|ко|у|о|об|обо|для|при|про|над|под|без|же|как|что|чем|где|это|the|of|in|on|for|and|or|to|a|с\.|г\.)$/iu;

const TAIL_JUNK = /\s*[,;:.\-–—«"'(\[/|+&]+$/u;
const countOf = (s, ch) => s.split(ch).length - 1;

// Хвост после обрезки: убрать висящие знаки, предлоги и непарные скобки.
//
// minKeep — сколько символов обязаны остаться. Непарную открывающую скобку
// можно убрать двумя способами: отрезать её вместе с содержимым (короче, но
// чище) либо закрыть скобку. Первое предпочтительнее, но если после отреза
// строка становится короче minKeep — закрываем скобку, иначе получаются
// огрызки вида «Эстония IT 2026: e-Residency.» (29 символов) вместо
// нормального описания на 120+.
function cleanupTail(sRaw, minKeep = 0) {
  let s = sRaw.trim();
  const stripJunk = (v) => {
    let x = v.trim();
    for (let i = 0; i < 6; i++) {
      const before = x;
      x = x.replace(TAIL_JUNK, "").trim();
      if (DANGLING.test(x)) x = x.replace(DANGLING, "").trim();
      if (x === before) break;
    }
    return x;
  };

  s = stripJunk(s);
  for (const [open, close] of [
    ["(", ")"],
    ["«", "»"],
    ["[", "]"],
  ]) {
    for (let guard = 0; guard < 4; guard++) {
      if (countOf(s, open) <= countOf(s, close)) break;
      const idx = s.lastIndexOf(open);
      if (idx <= 0) break;
      const cut = stripJunk(s.slice(0, idx));
      if (cut.length >= minKeep) s = cut;
      else {
        s = stripJunk(s) + close;
        break;
      }
    }
  }
  // Нечётные прямые кавычки — просто снимаем последнюю.
  if (countOf(s, '"') % 2 === 1) {
    const idx = s.lastIndexOf('"');
    if (idx > 0) s = stripJunk(s.slice(0, idx));
  }
  return s.replace(/\s*[,;:.\-–—]+$/u, "").trim();
}

// Хвостовой сегмент-ярлык («…; условия», «…: ОКЛЕНД») — остаток разметки тела
// статьи, а не смысл. Отрезаем, если без него строка всё ещё содержательна.
function dropTrailingLabel(acc, min) {
  const m = acc.match(/^(.*)(?::\s|;\s)([^:;]{1,12})$/su);
  if (!m) return acc;
  const [, head, tail] = m;
  if (/\d/.test(tail)) return acc; // «…: €900-1800» — это цифра, она ценна
  if (head.trim().length < Math.round(min * 0.7)) return acc;
  return head.trim();
}

// Жадный набор сегментов до лимита.
function assemble(segs, { max, min, stretch, stopOnCaps }) {
  if (!segs.length) return "";
  let acc = segs[0].text;
  let i = 1;
  // Если тело свалено с самого первого сегмента — брать нечего.
  if (stopOnCaps && isCapsDump(acc)) return trimWords(acc, max);
  for (; i < segs.length; i++) {
    const seg = segs[i];
    if (stopOnCaps && isCapsDump(seg.text)) break;
    const cand = `${acc}${segs[i - 1].sepAfter || " "}${seg.text}`;
    if (cand.length > max) break;
    acc = cand;
  }
  if (acc.length > max) acc = trimWords(acc, max);
  // Слишком коротко — добираем следующий сегмент. Сначала пробуем взять его
  // ЦЕЛИКОМ (допускаем небольшой перебор лимита) — так не рвём мысль
  // посередине; и только если целиком совсем не влезает, режем по границе
  // слова. Обрывки вида «…Oakham Castle XII» — хуже короткого заголовка,
  // поэтому порог добора низкий (min), а не «целевая длина».
  if (acc.length < min && i < segs.length) {
    const joined = `${acc}${segs[i - 1].sepAfter || " "}${segs[i].text}`;
    if (joined.length <= max + stretch) acc = joined;
    else if (acc.length < Math.round(min * 0.8)) {
      // Резать сегмент посередине — крайняя мера: даёт хвосты вида
      // «…Аль-Карауин 859 г старейший действующий». Идём на это, только если
      // без добора строка совсем куцая.
      const partial = trimWords(joined, max);
      if (partial.length > acc.length) acc = partial;
    }
  }
  return dropTrailingLabel(acc, min);
}

const TITLE_OPTS = { max: TITLE_MAX, min: TITLE_MIN, stretch: TITLE_STRETCH, stopOnCaps: true };
const DESC_OPTS = { max: DESC_MAX, min: DESC_MIN, stretch: DESC_STRETCH, stopOnCaps: false };

function buildTitle(row) {
  const src = row.seo_title || "";
  // minKeep=20: в заголовке короткий и чистый вариант лучше длинного с
  // придаточным в скобках, поэтому скобку почти всегда отрезаем.
  let out = cleanupTail(assemble(splitSegments(src), TITLE_OPTS), 20);
  // Фолбэк: если из seo_title осмысленного не вышло (например он весь капсом),
  // строим из H1 — он от бага не пострадал по смыслу, только по длине.
  if (out.length < 15) {
    out = cleanupTail(assemble(splitSegments(row.title || ""), TITLE_OPTS), 20);
  }
  return out;
}

function buildDescription(row) {
  const src = row.seo_description || "";
  // Для description капс — штатный стиль оформления, не маркер мусора.
  let out = cleanupTail(assemble(splitSegments(src), DESC_OPTS), DESC_MIN);
  if (out.length < 25) {
    out = cleanupTail(assemble(splitSegments(row.title || ""), DESC_OPTS), DESC_MIN);
  }
  // Описание — предложение: точка в конце, если её нет.
  if (out && !/[.!?»)]$/u.test(out)) out += ".";
  return out;
}

// ── main ───────────────────────────────────────────────────────────────────
console.log(LIVE ? "LIVE — will PATCH seo_title/seo_description" : "DRY RUN — no writes (pass --live to apply)");

const rows = await fetchAllPaged(
  `${SB_URL}/rest/v1/blog_posts?select=id,slug,published,tag,title,seo_title,seo_description&order=created_at.desc`,
);
console.log(`Загружено строк blog_posts: ${rows.length}`);

const targets = rows.filter(
  (r) => (r.seo_title || "").length > TITLE_BLOATED || (r.seo_description || "").length > DESC_BLOATED,
);
console.log(
  `Раздутых: ${targets.length} (published ${targets.filter((r) => r.published).length}, ` +
    `drafts ${targets.filter((r) => !r.published).length})`,
);

const plan = [];
for (const r of targets) {
  const patch = {};
  if ((r.seo_title || "").length > TITLE_BLOATED) {
    const t = buildTitle(r);
    if (t && t !== r.seo_title) patch.seo_title = t;
  }
  if ((r.seo_description || "").length > DESC_BLOATED) {
    const d = buildDescription(r);
    if (d && d !== r.seo_description) patch.seo_description = d;
  }
  if (Object.keys(patch).length) plan.push({ row: r, patch });
}
console.log(`К обновлению: ${plan.length}`);

const slice = SAMPLE ? plan.slice(0, SAMPLE) : plan;

// Отчёт до/после — для глазами-проверки осмысленности, а не только длины.
const report = slice.map(({ row, patch }) => ({
  slug: row.slug,
  tag: row.tag,
  published: row.published,
  h1: row.title,
  title_before_len: (row.seo_title || "").length,
  title_before: (row.seo_title || "").slice(0, 300),
  title_after: patch.seo_title ?? "(не менялся)",
  title_after_len: patch.seo_title ? patch.seo_title.length : null,
  desc_before_len: (row.seo_description || "").length,
  desc_before: (row.seo_description || "").slice(0, 300),
  desc_after: patch.seo_description ?? "(не менялся)",
  desc_after_len: patch.seo_description ? patch.seo_description.length : null,
}));
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`Отчёт: ${OUT}`);
}

// Сводка длин после фикса — быстрый контроль, что нигде не осталось хвостов.
const tl = slice.filter((p) => p.patch.seo_title).map((p) => p.patch.seo_title.length);
const dl = slice.filter((p) => p.patch.seo_description).map((p) => p.patch.seo_description.length);
const stat = (a) =>
  a.length ? `n=${a.length} min=${Math.min(...a)} avg=${Math.round(a.reduce((x, y) => x + y, 0) / a.length)} max=${Math.max(...a)}` : "n=0";
console.log(`  seo_title после:       ${stat(tl)}`);
console.log(`  seo_description после: ${stat(dl)}`);

if (!LIVE) {
  console.log("\nDRY RUN завершён. Ничего не записано.");
  process.exit(0);
}

let done = 0;
for (const { row, patch } of slice) {
  await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts?id=eq.${row.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  done++;
  if (done % 100 === 0) console.log(`  ...${done}/${slice.length}`);
  await sleep(35); // щадим Supabase — база на этом проекте нестабильна под нагрузкой
}
console.log(`Готово. Обновлено строк: ${done}`);

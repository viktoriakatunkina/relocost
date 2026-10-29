/**
 * ЗАДАЧА #blog-outdated-package-prices
 *
 * Ищет и чинит устаревшие хардкод-цены пакетов (49₽, 149₽, 199₽, 249₽ —
 * из ценовых эпох до правки lib/packages.ts 2026-10-14) в живом content_md
 * таблицы blog_posts в Supabase. Актуальные цены (lib/packages.ts):
 *   places (short "Места")            — 79 ₽
 *   budget (short "Расходы")          — 99 ₽
 *   bundle (short "Все включено"/"Комбо") — 129 ₽
 *   country_cities (short "Города")   — 99 ₽
 *   country_overview (short "Обзор")  — 79 ₽
 *
 * Правило сопоставления (НЕ бездумный global replace числа):
 * цена меняется только там, где рядом явно назван конкретный пакет —
 * через «Квотированный Лейбл» или markdown-ссылку [обзор страны](...) —
 * и число у этого лейбла расходится с актуальной ценой из lib/packages.ts.
 * Всё остальное (общие диапазоны вида "за 149–249 ₽" без привязки к одному
 * пакету, bare-числа без опознаваемого лейбла) печатается в отдельный
 * список AMBIGUOUS и НЕ трогается автоматически.
 *
 * Запуск:
 *   node scripts/fix-blog-outdated-package-prices.mjs            # dry-run (по умолчанию)
 *   node scripts/fix-blog-outdated-package-prices.mjs --apply    # применить замены
 *   node scripts/fix-blog-outdated-package-prices.mjs --apply --backup-only  # (не используется, бэкап всегда делается перед apply)
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim(),
  fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim(),
  { auth: { persistSession: false } }
);

const APPLY = process.argv.includes("--apply");

// ---------------------------------------------------------------------------
// Актуальные цены — должны совпадать с lib/packages.ts. Если lib/packages.ts
// поменяется, этот список тоже надо обновить (он не импортируется напрямую,
// т.к. это .mjs-скрипт без доступа к TS-модулю без лишней сборки).
// ---------------------------------------------------------------------------
const CURRENT_PRICES = {
  places: 79,
  budget: 99,
  bundle: 129,
  country_cities: 99,
  country_overview: 79,
};
const CITY_MIN = Math.min(CURRENT_PRICES.places, CURRENT_PRICES.budget, CURRENT_PRICES.bundle); // 79
const CITY_MAX = Math.max(CURRENT_PRICES.places, CURRENT_PRICES.budget, CURRENT_PRICES.bundle); // 129

// Лейблы (включая кавычки «...») → ключ пакета. Проверяем по тексту внутри «».
const LABEL_TO_PACKAGE = [
  [/^(все\s+|весь\s+список\s+)?расходы(\s+и\s+визы)?$/i, "budget"],
  [/^(лучшие\s+)?места$/i, "places"],
  [/^комбо$/i, "bundle"],
  [/^все включено$/i, "bundle"],
  [/^(лучшие\s+)?города$/i, "country_cities"],
  [/^обзор$/i, "country_overview"],
];

function packageForLabel(label) {
  const norm = label.trim();
  for (const [re, pkg] of LABEL_TO_PACKAGE) {
    if (re.test(norm)) return pkg;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Находим все кандидаты в одной статье.
// Возвращает { fixes: [{start,end,oldText,newText,reason}], ambiguous: [{index,snippet}] }
// ---------------------------------------------------------------------------
function analyze(content) {
  const fixes = [];
  const ambiguous = [];
  const seenRanges = new Set(); // чтобы не задвоить один и тот же диапазон двумя правилами

  function markFixed(start, end) {
    for (let i = start; i < end; i++) seenRanges.add(i);
  }
  function isMarked(start, end) {
    for (let i = start; i < end; i++) if (seenRanges.has(i)) return true;
    return false;
  }

  // --- Правило 1: «Лейбл» ... ЦЕНА ₽ — лейбл перед ценой, в пределах ОДНОЙ
  //     строки (без \n), с запретом перескакивать через другую «...» —
  //     чтобы не приписать чужую цену не тому пакету. Окно специально
  //     широкое (до 200 симв.), потому что в шаблоне часто между лейблом
  //     и ценой стоит "калькулятора Relocost по городу [Город](/city/x): " ---
  const labelPriceRe = /«([^»\n]{2,25})»(?:(?!«)[^\n]){0,200}?(\d{2,3})\s?₽/gu;
  let m;
  while ((m = labelPriceRe.exec(content))) {
    const label = m[1];
    const pkg = packageForLabel(label);
    if (!pkg) continue;
    const oldPrice = parseInt(m[2], 10);
    const correctPrice = CURRENT_PRICES[pkg];
    const numStart = m.index + m[0].lastIndexOf(m[2]);
    const numEnd = numStart + m[2].length;
    // ВАЖНО: помечаем диапазон "занятым" ДАЖЕ когда цена уже верна — иначе
    // правило 1b (обратный порядок) при повторном запуске на уже
    // исправленном тексте может перехватить это же число и приписать его
    // СЛЕДУЮЩЕМУ по тексту лейблу (напр. «Расходы» 99 ₽ ... «Комбо» —
    // правило 1b нашло бы "99" свободным и решило бы, что это цена для
    // «Комбо», испортив корректное значение). Баг пойман на втором
    // dry-run прогоне после реального apply — в БД данные остались верными,
    // потому что это обнаружилось раньше повторного --apply.
    if (isMarked(numStart, numEnd)) continue;
    markFixed(numStart, numEnd);
    if (oldPrice === correctPrice) continue; // уже актуально — фикс не нужен
    fixes.push({
      start: numStart,
      end: numEnd,
      oldText: m[2],
      newText: String(correctPrice),
      reason: `label «${label}» (after) → ${pkg} (${oldPrice}→${correctPrice})`,
      context: content.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20).replace(/\n/g, "⏎"),
    });
  }

  // --- Правило 1b: ЦЕНА ₽ ... «Лейбл» — обратный порядок, встречается в
  //     шаблоне "разовый платёж от 49 ₽ за пакет «Расходы», без подписки" ---
  const priceLabelRe = /(\d{2,3})\s?₽(?:(?!«)[^\n]){0,60}?«([^»\n]{2,25})»/gu;
  while ((m = priceLabelRe.exec(content))) {
    const label = m[2];
    const pkg = packageForLabel(label);
    if (!pkg) continue;
    const oldPrice = parseInt(m[1], 10);
    const correctPrice = CURRENT_PRICES[pkg];
    const numStart = m.index;
    const numEnd = numStart + m[1].length;
    if (isMarked(numStart, numEnd)) continue;
    markFixed(numStart, numEnd);
    if (oldPrice === correctPrice) continue;
    fixes.push({
      start: numStart,
      end: numEnd,
      oldText: m[1],
      newText: String(correctPrice),
      reason: `label «${label}» (before) → ${pkg} (${oldPrice}→${correctPrice})`,
      context: content.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20).replace(/\n/g, "⏎"),
    });
  }

  // --- Правило 2: markdown-ссылка [обзор ...](/country/...) ... ЦЕНА ₽ ---
  // NB: НЕ используем \b после кириллицы — в JS \b определён по ASCII
  // [A-Za-z0-9_], после кириллической буквы \b не сработает (обе стороны
  // "не словесные" для движка) и регэксп тихо не матчится.
  const linkPriceRe = /\[([^\]\n]{2,40})\]\([^)]*\)[^.\n]{0,25}?(\d{2,3})\s?₽/gu;
  while ((m = linkPriceRe.exec(content))) {
    const linkText = m[1].toLowerCase();
    let pkg = null;
    if (/^обзор(\s|$)/.test(linkText)) pkg = "country_overview";
    else if (/^(лучшие\s+)?города(\s|$)/.test(linkText)) pkg = "country_cities";
    if (!pkg) continue;
    const oldPrice = parseInt(m[2], 10);
    const correctPrice = CURRENT_PRICES[pkg];
    const numStart = m.index + m[0].lastIndexOf(m[2]);
    const numEnd = numStart + m[2].length;
    if (isMarked(numStart, numEnd)) continue;
    markFixed(numStart, numEnd);
    if (oldPrice === correctPrice) continue;
    fixes.push({
      start: numStart,
      end: numEnd,
      oldText: m[2],
      newText: String(correctPrice),
      reason: `link "[${m[1]}]" → ${pkg} (${oldPrice}→${correctPrice})`,
      context: content.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20).replace(/\n/g, "⏎"),
    });
  }

  // --- Правило 3: общий диапазон "за NNN–NNN ₽" / "за NNN-NNN ₽" без привязки
  //     к одному лейблу — это суммарный разброс цен по всем пакетам города,
  //     заменяем на актуальный разброс CITY_MIN–CITY_MAX ---
  const rangeRe = /(\d{2,3})\s?[–-]\s?(\d{2,3})\s?₽/gu;
  while ((m = rangeRe.exec(content))) {
    const start = m.index;
    const end = start + m[0].length;
    if (isMarked(start, end)) continue;
    const lo = parseInt(m[1], 10);
    const hi = parseInt(m[2], 10);
    // Эвристика: это старый диапазон цен пакетов города, если числа похожи на
    // старые ценовые точки (49/149/199/249) — а не что-то другое (например,
    // диапазон аренды 4500-6500 ₽, который НЕ про пакеты).
    const oldPricePoints = new Set([19, 29, 49, 59, 149, 199, 249]);
    const looksLikePackageRange = oldPricePoints.has(lo) && oldPricePoints.has(hi) && hi - lo <= 220;
    if (!looksLikePackageRange) continue;
    markFixed(start, end);
    if (lo === CITY_MIN && hi === CITY_MAX) continue; // уже актуально
    const dash = m[0].includes("–") ? "–" : "-";
    fixes.push({
      start,
      end,
      oldText: m[0],
      newText: `${CITY_MIN}${dash}${CITY_MAX} ₽`,
      reason: `generic package-price range (${lo}–${hi}→${CITY_MIN}–${CITY_MAX})`,
      context: content.slice(Math.max(0, start - 60), end + 20).replace(/\n/g, "⏎"),
    });
  }

  // --- Правило 4: "разовый платёж от NN ₽ за пакет" БЕЗ конкретного лейбла
  //     в кавычках рядом — обобщённое упоминание стартовой/минимальной цены
  //     по городу, заменяем на актуальный минимум CITY_MIN (сейчас = places). ---
  const genericFromRe = /от\s+(19|29|49|149|199)\s?₽/gu;
  while ((m = genericFromRe.exec(content))) {
    const start = m.index + m[0].indexOf(m[1]);
    const end = start + m[1].length;
    if (isMarked(start, end)) continue;
    const windowStart = Math.max(0, m.index - 60);
    const windowEnd = Math.min(content.length, m.index + m[0].length + 60);
    const windowText = content.slice(windowStart, windowEnd);
    if (!/пакет/i.test(windowText)) continue; // не про пакеты вообще — не трогаем
    if (/«/.test(windowText)) continue; // рядом есть конкретный лейбл — это не generic-случай, пусть разберут правила 1/1b
    const oldPrice = parseInt(m[1], 10);
    markFixed(start, end);
    if (oldPrice === CITY_MIN) continue; // уже актуально
    fixes.push({
      start,
      end,
      oldText: m[1],
      newText: String(CITY_MIN),
      reason: `generic "от ${oldPrice} ₽ за пакет" (no label) → CITY_MIN (${oldPrice}→${CITY_MIN})`,
      context: content.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\n/g, "⏎"),
    });
  }

  // --- Остальное: любые оставшиеся вхождения старых ценовых точек рядом со
  //     словами-триггерами (пакет/калькулятор/расходы/все цены), которые
  //     НЕ попали в fixes выше — это кандидаты, требующие ручного решения. ---
  const triggerWords = /пакет|калькулятор|расходы|все цены|комбо|бюджет на жизнь считается/i;
  const bareOldPriceRe = /\b(19|29|49|59|149|199|249)\s?₽/gu;
  while ((m = bareOldPriceRe.exec(content))) {
    const start = m.index;
    const end = start + m[0].length;
    if (isMarked(start, end)) continue;
    const windowStart = Math.max(0, start - 80);
    const windowEnd = Math.min(content.length, end + 80);
    const windowText = content.slice(windowStart, windowEnd);
    if (!triggerWords.test(windowText)) continue; // не похоже на цену пакета вообще
    ambiguous.push({
      index: start,
      snippet: windowText.replace(/\n/g, "⏎"),
    });
  }

  return { fixes, ambiguous };
}

function applyFixes(content, fixes) {
  // Применяем от конца к началу, чтобы индексы не сдвигались.
  const sorted = [...fixes].sort((a, b) => b.start - a.start);
  let result = content;
  for (const f of sorted) {
    result = result.slice(0, f.start) + f.newText + result.slice(f.end);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Основной цикл
// ---------------------------------------------------------------------------
async function main() {
  let allPosts = [];
  let from = 0;
  while (true) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("id, slug, content_md, published")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    if (!data.length) break;
    allPosts.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }

  console.log(`Всего статей в blog_posts: ${allPosts.length}`);

  const report = [];
  let totalFixCount = 0;
  let postsWithFixes = 0;
  let postsWithAmbiguous = 0;

  for (const post of allPosts) {
    const content = post.content_md || "";
    if (!content) continue;
    const { fixes, ambiguous } = analyze(content);
    if (fixes.length === 0 && ambiguous.length === 0) continue;

    if (fixes.length) {
      postsWithFixes++;
      totalFixCount += fixes.length;
    }
    if (ambiguous.length) postsWithAmbiguous++;

    report.push({
      id: post.id,
      slug: post.slug,
      published: post.published,
      fixes,
      ambiguous,
    });
  }

  console.log(`\nСтатей с автоматически определяемыми фиксами: ${postsWithFixes} (всего замен: ${totalFixCount})`);
  console.log(`Статей с AMBIGUOUS-кандидатами (не трогаем автоматически): ${postsWithAmbiguous}`);

  // Подробный вывод
  console.log("\n=== ПОДРОБНО: FIXES (будут применены при --apply) ===");
  for (const r of report) {
    if (!r.fixes.length) continue;
    console.log(`\n[${r.slug}] (published=${r.published})`);
    for (const f of r.fixes) {
      console.log(`  ${f.oldText} → ${f.newText}  | ${f.reason}`);
      console.log(`    контекст: ...${f.context}...`);
    }
  }

  console.log("\n=== ПОДРОБНО: AMBIGUOUS (НЕ трогаем, нужно ручное решение) ===");
  for (const r of report) {
    if (!r.ambiguous.length) continue;
    console.log(`\n[${r.slug}] (published=${r.published})`);
    for (const a of r.ambiguous) {
      console.log(`    контекст: ...${a.snippet}...`);
    }
  }

  // Машиночитаемый отчёт для ревью
  const outDir = `${H}/.relocost`; // постоянное хранилище бэкапов проекта (см. prices-backup-*.json там же)
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, "blog-price-fix-report.json"),
      JSON.stringify(report, null, 2),
      "utf8"
    );
    console.log(`\nJSON-отчёт сохранён: ${path.join(outDir, "blog-price-fix-report.json")}`);
  } catch (e) {
    console.error("Не удалось сохранить JSON-отчёт:", e.message);
  }

  if (!APPLY) {
    console.log("\n--- DRY RUN: изменения НЕ применены. Запустите с --apply после ревью отчёта. ---");
    return;
  }

  // --- APPLY: сначала бэкап затронутых content_md ---
  const toApply = report.filter((r) => r.fixes.length > 0);
  const backupPath = path.join(
    outDir,
    `blog-price-fix-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`
  );
  const backupData = toApply.map((r) => ({ id: r.id, slug: r.slug, content_md_before: allPosts.find((p) => p.id === r.id).content_md }));
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), "utf8");
  console.log(`\nБэкап ${toApply.length} статей сохранён: ${backupPath}`);

  let applied = 0,
    failed = 0;
  for (const r of toApply) {
    const post = allPosts.find((p) => p.id === r.id);
    const newContent = applyFixes(post.content_md, r.fixes);
    const { error } = await sb.from("blog_posts").update({ content_md: newContent }).eq("id", r.id);
    if (error) {
      console.error(`  ✗ ${r.slug}: ${error.message}`);
      failed++;
      continue;
    }
    applied++;
    console.log(`  ✓ ${r.slug} (${r.fixes.length} замен)`);
  }

  console.log(`\nГотово: применено к ${applied} статьям, ошибок ${failed}.`);
  console.log(`Откат: восстановить content_md из ${backupPath} по полю id.`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

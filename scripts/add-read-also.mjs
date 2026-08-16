/**
 * add-read-also.mjs
 * Добавляет блок «Читайте также» в конец content_md каждой статьи блога.
 * Подбирает 3 тематически близких статьи по тегу.
 * Пропускает статьи, у которых блок уже есть.
 *
 * Запуск: node scripts/add-read-also.mjs
 * Для тест-прогона без записи: node scripts/add-read-also.mjs --dry-run
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";

const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 50;      // размер батча при обработке
const FETCH_PAGE = 200;     // сколько строк тянем из Supabase за раз
const TARGET_LIMIT = 999;   // обработать все оставшиеся статьи
const DELAY_MS = 200;       // пауза между запросами на запись (мс)
const MAX_RETRIES = 4;      // максимум повторов при 5xx ошибках
const RETRY_DELAY_MS = 3000; // начальная пауза при retry (удваивается)

const SUPABASE_URL = fs.readFileSync(os.homedir() + "/.relocost/supabase_url", "utf8").trim();
const SUPABASE_KEY = fs.readFileSync(os.homedir() + "/.relocost/supabase_service_role_key", "utf8").trim();
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

// ---------- Утилиты ----------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Обёртка вокруг Supabase .update() с retry на 5xx / сетевые сбои.
 */
async function updateWithRetry(sb, table, patch, idField, idValue) {
  let delay = RETRY_DELAY_MS;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const { error } = await sb.from(table).update(patch).eq(idField, idValue);
    if (!error) return null; // успех

    const msg = typeof error === "string" ? error : (error.message || JSON.stringify(error));
    const isTransient =
      msg.includes("fetch failed") ||
      msg.includes("520") ||
      msg.includes("522") ||
      msg.includes("Connection timed out") ||
      msg.includes("unknown error");

    if (!isTransient || attempt === MAX_RETRIES) return msg; // неисправимая ошибка

    console.log(`    [retry ${attempt}/${MAX_RETRIES}] transient error, wait ${delay}ms...`);
    await sleep(delay);
    delay *= 2; // exponential backoff
  }
  return "max retries exceeded";
}

// ---------- Вспомогательные функции ----------

/** Замена ё → е во всей строке */
const noYo = (s) => (typeof s === "string" ? s.replace(/ё/g, "е").replace(/Ё/g, "Е") : s);

/**
 * Извлекает «ключевые слова» из slug (разбивает по дефису, берёт первые 2 токена).
 * Используется для проверки схожести slug'ов.
 */
function slugTokens(slug) {
  return slug.split("-").slice(0, 2);
}

/** Проверяет, слишком ли схожи два slug'а (совпадают 2+ первых токена) */
function tooSimilar(slugA, slugB) {
  const tokA = slugTokens(slugA);
  const tokB = slugTokens(slugB);
  return tokA.every((t) => tokB.includes(t));
}

/**
 * Перемешивает массив (Fisher–Yates) in place, возвращает его же.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Подбирает 3 «похожие» статьи для поста.
 * Алгоритм:
 *   1. Из статей с тем же тегом (кроме самой статьи) берём случайные кандидаты.
 *   2. Если меньше 3 — добираем из других тегов.
 *   3. Исключаем статьи со слишком похожим slug.
 */
function pickRelated(post, allPosts) {
  const samTag = shuffle(
    allPosts.filter(
      (p) => p.id !== post.id && p.tag === post.tag && !tooSimilar(p.slug, post.slug)
    )
  );
  const other = shuffle(
    allPosts.filter(
      (p) => p.id !== post.id && p.tag !== post.tag && !tooSimilar(p.slug, post.slug)
    )
  );

  const picked = [];
  for (const p of samTag) {
    if (picked.length >= 3) break;
    picked.push(p);
  }
  for (const p of other) {
    if (picked.length >= 3) break;
    picked.push(p);
  }
  return picked;
}

/**
 * Формирует markdown-блок «Читайте также».
 */
function buildBlock(related) {
  const lines = related.map((p) => `- [${noYo(p.title)}](/blog/${p.slug})`);
  return `\n\n---\n\n## Читайте также\n\n${lines.join("\n")}\n`;
}

/**
 * Вставляет блок в конец content_md.
 * Стратегия: просто добавляем в самый конец (задача сказала «перед последним ## или в самый конец»,
 * но так как контент уже завершён, добавляем в конец, чтобы не ломать структуру заголовков).
 */
function appendBlock(content, block) {
  return content.trimEnd() + block;
}

// ---------- Загрузка всех постов ----------

async function loadAllPosts() {
  // Шаг 1: грузим только метаданные (без content_md) — маленький payload
  const all = [];
  let from = 0;
  while (true) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("id, slug, title, tag")
      .eq("published", true)
      .range(from, from + 199);

    if (error) throw new Error(`Supabase select error: ${error.message}`);
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < 200) break;
    from += 200;
  }
  return all;
}

async function loadContentMd(id) {
  let delay = 3000;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("content_md")
      .eq("id", id)
      .single();
    if (!error) return data?.content_md || "";
    const msg = error.message || "";
    const isTransient = msg.includes("timeout") || msg.includes("upstream") || msg.includes("522") || msg.includes("fetch failed");
    if (!isTransient || attempt === 5) throw new Error(`content fetch error: ${msg}`);
    console.log(`    [retry ${attempt}/5] ${msg.slice(0,60)}, wait ${delay}ms...`);
    await sleep(delay);
    delay = Math.min(delay * 2, 30000);
  }
}

// ---------- Главная функция ----------

async function main() {
  console.log(`Режим: ${DRY_RUN ? "DRY-RUN (без записи)" : "LIVE (запись в Supabase)"}`);
  console.log("Загружаем все статьи...");

  const allPosts = await loadAllPosts();
  console.log(`Загружено статей: ${allPosts.length}`);

  // Определяем какие статьи нужно обновить — через отдельный count-запрос
  // Поскольку content_md не загружен, фильтруем через Supabase
  const { data: withBlock } = await sb.from("blog_posts")
    .select("id")
    .eq("published", true)
    .ilike("content_md", "%## Читайте также%");
  const withBlockIds = new Set((withBlock || []).map(p => p.id));

  const needUpdate = allPosts.filter(p => !withBlockIds.has(p.id));
  const alreadyDone = allPosts.length - needUpdate.length;
  console.log(`Уже с блоком: ${alreadyDone}, нужно обновить: ${needUpdate.length}`);

  // Обрабатываем не более TARGET_LIMIT
  const toProcess = needUpdate.slice(0, TARGET_LIMIT);
  console.log(`Будем обрабатывать: ${toProcess.length} статей (лимит ${TARGET_LIMIT})`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Обрабатываем батчами по BATCH_SIZE
  for (let batchStart = 0; batchStart < toProcess.length; batchStart += BATCH_SIZE) {
    const batch = toProcess.slice(batchStart, batchStart + BATCH_SIZE);
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);
    console.log(`\n--- Батч ${batchNum}/${totalBatches} (статьи ${batchStart + 1}–${batchStart + batch.length}) ---`);

    for (const post of batch) {
      // Загружаем content_md индивидуально (избегаем bulk timeout)
      const contentMd = await loadContentMd(post.id);

      if (contentMd.includes("## Читайте также")) {
        skipped++;
        continue;
      }

      const related = pickRelated(post, allPosts);
      if (related.length === 0) {
        console.log(`  [ПРОПУСК] ${post.slug} — не найдено похожих статей`);
        skipped++;
        continue;
      }

      const block = buildBlock(related);
      const newContent = appendBlock(contentMd, block);

      if (DRY_RUN) {
        console.log(`  [DRY] ${post.slug} → добавим ссылки на: ${related.map((r) => r.slug).join(", ")}`);
        updated++;
        continue;
      }

      const errMsg = await updateWithRetry(sb, "blog_posts", { content_md: newContent }, "id", post.id);
      await sleep(DELAY_MS); // пауза между записями

      if (errMsg) {
        console.log(`  [ОШИБКА] ${post.slug}: ${errMsg}`);
        errors++;
      } else {
        console.log(`  [OK] ${post.slug} (тег: ${post.tag}) → ${related.map((r) => r.slug).join(", ")}`);
        updated++;
      }
    }
  }

  console.log("\n========================================");
  console.log(`Итог:`);
  console.log(`  Всего статей в базе:  ${allPosts.length}`);
  console.log(`  Уже с блоком:         ${alreadyDone}`);
  console.log(`  Обновлено:            ${updated}`);
  console.log(`  Пропущено:            ${skipped}`);
  console.log(`  Ошибок:               ${errors}`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Критическая ошибка:", err.message);
  process.exit(1);
});

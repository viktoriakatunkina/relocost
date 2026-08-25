// 10 SEO/GEO-статей блога Relocost — кластер "цитируемость ИИ-ассистентами"
// (август 2026): состав семьи и бюджет, три сценария бюджета, фрилансер и
// часовые пояса, студент, пенсионер, сравнение 8 популярных городов, пути
// легализации/ВНЖ, рублевый доход, сезонная релокация, хроническое
// заболевание. Читает .md файлы из content/blog/ (формат фронтматтера
// slug/title/description/tag/read_time/published), вставляет в blog_posts.
//
// ВАЖНО: Supabase в момент написания скрипта был перегружен параллельной
// нагрузкой нескольких агентов — добавлены щедрые ретраи с бэкоффом и паузы
// между запросами, чтобы не усугублять нагрузку. Не хаммерить повторными
// быстрыми запусками — при неудаче подождать минимум 30-60 сек перед retry.
//
// Обложки НЕ грузятся тут — после сева прогнать node scripts/fill-blog-images.mjs
// (storage-фото, 0 запросов к Unsplash).
//
// Запуск: node scripts/seed-10-geo-aeo-articles-aug-2026.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOME = os.homedir();

const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();

// Supabase-js по умолчанию не таймаутит fetch — если БД вообще не отвечает
// (не принимает соединение), запрос виснет на неопределенное время вместо
// ошибки, и наша ретрай-логика ниже никогда не срабатывает. Оборачиваем fetch
// в AbortController с явным таймаутом 20с, как это сделано в lib/supabase.ts.
const fetchWithTimeout = (input, init) => {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 20_000);
  const prevSignal = init?.signal;
  if (prevSignal) prevSignal.addEventListener("abort", () => ctrl.abort(), { once: true });
  return fetch(input, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(tid));
};

const sb = createClient(SUPA_URL, KEY, {
  auth: { persistSession: false },
  global: { fetch: fetchWithTimeout },
});

const SLUGS = [
  "sostav-semi-byudzhet-pereezda-2026",
  "byudzhet-50-100-200-tysyach-tri-scenariya-2026",
  "top-15-gorodov-dlya-frilansera-2026",
  "kuda-pereekhat-studentu-2026",
  "kuda-pereekhat-pensioneru-sravnenie-gorodov-2026",
  "sravnenie-8-populyarnyh-gorodov-pereezd-2026",
  "kak-poluchit-vnzh-sravnenie-sposobov-legalizatsii-2026",
  "pereezd-s-zarplatoy-v-rublyah-2026",
  "sezonny-pereezd-zima-leto-2026",
  "kuda-pereekhat-s-hronicheskim-zabolevaniem-2026",
];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Парсит формат фронтматтера: ---\nkey: value\n---\nContent
function parseMd(slug) {
  const filePath = path.join(ROOT, "content", "blog", `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`No frontmatter found in ${slug}.md`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^"|"$/g, "");
    meta[key] = val;
  }
  const content_md = m[2].trim();
  const h1Match = content_md.match(/^#\s+(.+)$/m);
  const title = meta.title || (h1Match ? h1Match[1].trim() : slug);
  return { meta, content_md, title };
}

// Ретрай с щедрым бэкоффом — Supabase в моменте может быть перегружена.
async function withRetry(fn, label, tries = 2) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const waitMs = 15000 + i * 15000; // 15s, 30s — короче, чтобы быстрее пройти весь список и повторить проход при необходимости
      console.error(`  ~ ${label}: попытка ${i + 1}/${tries} не удалась (${e.message || e}), жду ${waitMs / 1000}с...`);
      if (i < tries - 1) await delay(waitMs);
    }
  }
  throw lastErr;
}

async function run() {
  const base = Date.now();
  let added = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`Старт: ${SLUGS.length} статей, ${new Date().toISOString()}`);

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];
    console.log(`[${i + 1}/${SLUGS.length}] ${slug}...`);

    let existing;
    try {
      existing = await withRetry(async () => {
        const { data, error } = await sb
          .from("blog_posts")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      }, `select ${slug}`);
    } catch (e) {
      console.error(`✗ ${slug}: не удалось проверить существование (${e.message}) — пропуск`);
      errors++;
      await delay(5000);
      continue;
    }

    if (existing) {
      console.log(`skip (exists): ${slug}`);
      skipped++;
      await delay(2000);
      continue;
    }

    let parsed;
    try {
      parsed = parseMd(slug);
    } catch (e) {
      console.error(`parse error ${slug}: ${e.message}`);
      errors++;
      continue;
    }

    const { meta, content_md, title } = parsed;
    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      title,
      slug,
      tag: meta.tag || "Подборка",
      read_time: meta.read_time ? parseInt(meta.read_time, 10) : Math.round(content_md.split(/\s+/).length / 200),
      content_md,
      seo_title: title,
      seo_description: meta.description || null,
      country_slug: null,
      city_id: null,
      cover_unsplash_id: null,
      cover_url: null,
      cover_author_name: null,
      cover_author_url: null,
      published: meta.published !== "false",
      created_at: createdAt,
    };

    try {
      await withRetry(async () => {
        const { error } = await sb.from("blog_posts").insert(row);
        if (error) throw error;
      }, `insert ${slug}`);
      added++;
      console.log(`+ ${slug}`);
    } catch (e) {
      console.error(`insert error ${slug}: ${e.message}`);
      errors++;
    }

    // Пауза между статьями, чтобы не долбить Supabase подряд.
    await delay(3000);
  }

  console.log(`\ndone. added ${added}/${SLUGS.length}, skipped ${skipped}, errors ${errors}`);
  if (added > 0) {
    console.log(`\nNext step: node scripts/fill-blog-images.mjs   (обложки + inline-картинки из storage)`);
  }
  if (errors > 0) process.exitCode = 1;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

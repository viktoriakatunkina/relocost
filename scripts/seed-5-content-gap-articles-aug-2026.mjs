// 5 SEO-статей блога Relocost — заполнение реальных пробелов контента (31 августа
// 2026), проверенных против полной выгрузки blog_posts (4991 строка на момент
// проверки, пагинация — см. reference-supabase-select-1000-limit) и против
// config/blog-redirects.json (381+ статья каннибализации уже закрыта редиректами,
// не дублируем эти темы: банковский счет за рубежом, перевозка животных,
// медстраховка за рубежом, российская пенсия за рубежом, культурный шок).
//
// Метод поиска пробелов: по каждому городу в cities посчитано число блог-постов
// с city_id = этот город (JOIN blog_posts.city_id). Найдено 2 города с 0 постов
// (Братислава, Рио-де-Жанейро) и ряд городов с ровно 1 постом одного формата —
// либо "стоимость жизни", либо "как переехать", но не оба. Для 3 таких городов
// (Ларнака, Мюнхен, София) добавлен ИМЕННО недостающий формат — второй, более
// глубокий и подробный, чем существующие короткие DN-vignette статьи (200-500
// слов) по тем же городам, которые уже есть в блоге под другими slug и НЕ
// привязаны к city_id (поэтому не показываются на странице города в блоке
// "Читайте также" — getPostsForCity фильтрует по city_id).
//
// 5 статей (2000-2300 слов каждая, реальные данные из Supabase prices,
// city_id + country_slug, курс ЦБ РФ EUR≈99.7/BRL≈16.6 на 29.08.2026):
//   1. stoimost-zhizni-v-larnake-2026        — Ларнака, Кипр (был только "как переехать")
//   2. kak-pereekhat-v-myunkhen-2026         — Мюнхен, Германия (был только "стоимость жизни")
//   3. stoimost-zhizni-v-sofii-2026          — София, Болгария (был только "как переехать")
//   4. kak-pereekhat-v-bratislavu-2026       — Братислава, Словакия (0 постов)
//   5. stoimost-zhizni-v-rio-de-zhaneyro-2026 — Рио-де-Жанейро, Бразилия (0 постов)
//
// Визовые/налоговые цифры (Blue Card €50 700/45 934 в год, Sperrkonto ~€1000-1100,
// Sлoвакия 15%/19-25% налоги, Бразилия VITEM XIV $1500/мес или $18000 накоплений,
// Кипр — статус Шенгена на 14.08.2026) — проверены WebSearch перед написанием,
// не выдуманы.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---
// (как в seed-10-night-batch7-aug-2026.mjs). city_id и country_slug берутся
// из таблицы cities по slug города (country_slug — производный, как в
// seed-blog-batch-6.mjs). Обложка — hero-фото города из cities (уже в Storage,
// без обращения к Unsplash API).
//
// Используем сырой REST fetch с таймаутом + повторными попытками (не
// supabase-js — под нагрузкой может зависать без таймаута, см.
// reference-relocost-vps). Пауза 5с между вставками.
//
// Идемпотентно: upsert по slug.
// Запуск: node scripts/seed-5-content-gap-articles-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOME = os.homedir();

const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(ROOT, "content", "blog");

// city — slug города в таблице cities (для city_id, country_slug и обложки).
const META = [
  {
    slug: "stoimost-zhizni-v-larnake-2026",
    title: "Стоимость жизни в Ларнаке 2026: реальные цифры",
    tag: "Города",
    city: "larnaca",
  },
  {
    slug: "kak-pereekhat-v-myunkhen-2026",
    title: "Как переехать в Мюнхен 2026: пошаговая инструкция",
    tag: "Гайд",
    city: "munich",
  },
  {
    slug: "stoimost-zhizni-v-sofii-2026",
    title: "Стоимость жизни в Софии 2026: реальные цифры",
    tag: "Города",
    city: "sofia",
  },
  {
    slug: "kak-pereekhat-v-bratislavu-2026",
    title: "Как переехать в Братиславу 2026: пошаговая инструкция",
    tag: "Гайд",
    city: "bratislava",
  },
  {
    slug: "stoimost-zhizni-v-rio-de-zhaneyro-2026",
    title: "Стоимость жизни в Рио-де-Жанейро 2026: реальные цифры",
    tag: "Города",
    city: "rio-de-janeiro",
  },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  body = body.replace(/^#\s+.*\n+/, "");
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  readTime = Math.max(6, Math.min(20, readTime || 10));
  return { seoTitle, seoDesc, readTime, body, words };
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = 40000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(t);
  }
}

async function withRetry(label, fn, tries = 6, baseDelay = 45000) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fn();
      console.error(`OK: ${label}`);
      return r;
    } catch (e) {
      console.error(`${label} attempt ${i + 1}/${tries} failed: ${e.message}`);
      if (i === tries - 1) throw e;
      console.error(`  waiting ${baseDelay}ms before retry...`);
      await new Promise((r) => setTimeout(r, baseDelay));
    }
  }
}

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

async function run() {
  const cities = await withRetry("cities lookup", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/cities?select=id,slug,country_slug,unsplash_url,unsplash_author_name,unsplash_author_url`,
      { headers },
      40000
    )
  );
  const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

  let ok = 0, fail = 0;
  for (const m of META) {
    const file = path.join(DIR, `${m.slug}.md`);
    if (!fs.existsSync(file)) {
      console.error(`✗ ${m.slug}: файл не найден, пропуск`);
      fail++;
      continue;
    }
    let parsed;
    try {
      parsed = parseArticle(fs.readFileSync(file, "utf8"));
    } catch (e) {
      console.error(`✗ ${m.slug}: ${e.message}`);
      fail++;
      continue;
    }

    let cover = {};
    let countrySlug = null;
    const c = m.city ? cityBySlug.get(m.city) : null;
    if (m.city && !c) {
      console.error(`⚠ ${m.slug}: город "${m.city}" не найден в cities — city_id будет null`);
    }
    if (c) {
      countrySlug = c.country_slug ?? null;
      if (c.unsplash_url) {
        cover = {
          cover_url: c.unsplash_url,
          cover_author_name: c.unsplash_author_name,
          cover_author_url: c.unsplash_author_url,
        };
      }
    }

    const row = {
      slug: m.slug,
      title: m.title,
      tag: m.tag,
      city_id: c?.id ?? null,
      country_slug: countrySlug,
      read_time: parsed.readTime,
      content_md: parsed.body,
      seo_title: parsed.seoTitle,
      seo_description: parsed.seoDesc,
      published: true,
      ...cover,
    };

    try {
      await withRetry(`upsert ${m.slug}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/blog_posts?on_conflict=slug`,
          {
            method: "POST",
            headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify(row),
          },
          40000
        )
      );
      console.log(
        `✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, city:${m.city}, city_id:${c?.id ? "да" : "нет"}, country_slug:${countrySlug || "—"}`
      );
      ok++;
    } catch (e) {
      console.error(`✗ ${m.slug}: не удалось записать — ${e.message}`);
      fail++;
    }
    // мягкая пауза между вставками — не долбим базу подряд
    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);
  if (ok > 0) {
    console.log(`Next: node scripts/fill-blog-images.mjs   (inline-картинки из storage для секций без фото)`);
  }
  if (fail > 0) process.exitCode = 1;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

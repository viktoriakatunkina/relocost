// Batch 7: 10 новых SEO-статей для Relocost.ru
// Темы: Лиссабон, Прага, Черногория vs Сербия, ВНЖ Таиланда, Токио, Узбекистан, Мексика, Варшава, дети, работа
// Запуск: node scripts/seed-blog-batch7-10articles.mjs

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

let UNSPLASH = "";
try {
  UNSPLASH = fs.readFileSync(`${HOME}/.relocost/unsplash_access_key`, "utf8").trim();
} catch {
  console.warn("unsplash_access_key не найден — обложки будут пропущены");
}

const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

// slug -> имя файла в content/blog/ (если отличается от slug)
const ARTICLES = [
  {
    slug: "stoimost-zhizni-v-lissabone-2026",
    file: "stoimost-zhizni-v-lissabone-2026",
    tag: "Переезд",
    read_time: 9,
    country_slug: "portugal",
    unsplash_query: "Lisbon Portugal city view tram",
  },
  {
    slug: "pereezd-v-prag-2026",
    file: "pereezd-v-prag-2026",
    tag: "Переезд",
    read_time: 9,
    country_slug: "czech-republic",
    unsplash_query: "Prague city bridge castle evening",
  },
  {
    slug: "chernogoria-ili-serbiya-2026",
    file: "chernogoria-ili-serbiya-2026",
    tag: "Сравнение",
    read_time: 8,
    country_slug: null,
    unsplash_query: "Montenegro Adriatic coast sea",
  },
  {
    slug: "vnzh-tailanda-2026",
    file: "vnzh-tailanda-2026",
    tag: "Практика",
    read_time: 9,
    country_slug: "thailand",
    unsplash_query: "Thailand temple golden Bangkok",
  },
  {
    slug: "zhizn-v-tokio-dlya-rossiyan-2026",
    file: "zhizn-v-tokio-dlya-rossiyan-2026",
    tag: "Переезд",
    read_time: 10,
    country_slug: "japan",
    unsplash_query: "Tokyo city night lights skyscrapers",
  },
  {
    slug: "uzregistratsiya-dlya-rossiyan-2026",
    file: "uzregistratsiya-dlya-rossiyan-2026",
    tag: "Практика",
    read_time: 8,
    country_slug: "uzbekistan",
    unsplash_query: "Tashkent Uzbekistan city architecture",
  },
  {
    slug: "meksika-dlya-pereezda-2026",
    file: "meksika-dlya-pereezda-2026",
    tag: "Переезд",
    read_time: 9,
    country_slug: "mexico",
    unsplash_query: "Mexico City colorful streets architecture",
  },
  {
    slug: "zhizn-v-varshave-2026",
    // Читаем из нового файла (старый — в старом формате без ---CONTENT---)
    file: "zhizn-v-varshave-novaya-2026",
    tag: "Переезд",
    read_time: 9,
    country_slug: "poland",
    unsplash_query: "Warsaw Poland old town square",
  },
  {
    slug: "pereezd-s-detmi-za-rubezh-2026",
    file: "pereezd-s-detmi-za-rubezh-2026",
    tag: "Практика",
    read_time: 10,
    country_slug: null,
    unsplash_query: "family children travel airport luggage",
  },
  {
    slug: "kak-nayti-rabotu-za-rubezhom-2026",
    file: "kak-nayti-rabotu-za-rubezhom-2026",
    tag: "Практика",
    read_time: 9,
    country_slug: null,
    unsplash_query: "laptop remote work coffee coworking office",
  },
];

function parseMd(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^﻿/, "");
  const lines = raw.split("\n");
  const meta = {};
  let contentStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("SEO_TITLE:")) {
      meta.seo_title = line.replace("SEO_TITLE:", "").trim();
    } else if (line.startsWith("SEO_DESCRIPTION:")) {
      meta.seo_description = line.replace("SEO_DESCRIPTION:", "").trim();
    } else if (line.startsWith("READ_TIME:")) {
      meta.read_time = parseInt(line.replace("READ_TIME:", "").trim(), 10);
    } else if (line.trim() === "---CONTENT---") {
      contentStart = i + 1;
      break;
    }
  }

  if (contentStart === -1) {
    throw new Error(`No ---CONTENT--- marker in file`);
  }

  const content_md = lines.slice(contentStart).join("\n").trim();
  const h1Match = content_md.match(/^#\s+(.+)$/m);
  const title = h1Match ? h1Match[1].trim() : "Без заголовка";
  const words = content_md.split(/\s+/).filter(Boolean).length;

  // Извлекаем excerpt: первый абзац после заголовка без **TL;DR**-блока
  const paragraphs = content_md.split(/\n\n+/);
  let excerpt = "";
  for (const p of paragraphs) {
    const clean = p.replace(/^#+\s+/, "").replace(/\*\*/g, "").trim();
    if (clean && !clean.startsWith("**TL;DR") && !clean.startsWith("TL;DR") && !clean.startsWith("-")) {
      excerpt = clean.slice(0, 300);
      break;
    }
  }

  return { title, content_md, seo_title: meta.seo_title, seo_description: meta.seo_description, words, excerpt };
}

async function fetchUnsplash(query) {
  if (!UNSPLASH) return null;
  try {
    const u = new URL("https://api.unsplash.com/search/photos");
    u.searchParams.set("query", query);
    u.searchParams.set("per_page", "5");
    u.searchParams.set("orientation", "landscape");
    const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
    if (!res.ok) throw new Error(`Unsplash ${res.status}`);
    const json = await res.json();
    const pick = json.results?.[0];
    if (!pick) return null;
    return {
      cover_unsplash_id: pick.id,
      cover_url: pick.urls.raw,
      cover_author_name: pick.user.name,
      cover_author_url: pick.user.links.html,
    };
  } catch (e) {
    console.warn(`  unsplash failed for "${query}": ${e.message}`);
    return null;
  }
}

async function run() {
  const base = Date.now();
  let added = 0;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const filePath = path.join(ROOT, "content", "blog", `${a.file}.md`);

    if (!fs.existsSync(filePath)) {
      console.error(`✗ ${a.slug}: файл ${a.file}.md не найден`);
      errors++;
      continue;
    }

    let parsed;
    try {
      parsed = parseMd(filePath);
    } catch (e) {
      console.error(`✗ ${a.slug}: ошибка парсинга — ${e.message}`);
      errors++;
      continue;
    }

    // Проверяем — есть ли уже в базе
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id, slug")
      .eq("slug", a.slug)
      .maybeSingle();

    // Получаем обложку
    const cover = await fetchUnsplash(a.unsplash_query);

    const readTime = a.read_time ?? Math.max(4, Math.min(12, Math.round(parsed.words / 180)));
    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      slug: a.slug,
      title: parsed.title,
      tag: a.tag,
      read_time: readTime,
      content_md: parsed.content_md,
      seo_title: parsed.seo_title || null,
      seo_description: parsed.seo_description || null,
      country_slug: a.country_slug ?? null,
      city_id: null,
      cover_unsplash_id: cover?.cover_unsplash_id ?? null,
      cover_url: cover?.cover_url ?? null,
      cover_author_name: cover?.cover_author_name ?? null,
      cover_author_url: cover?.cover_author_url ?? null,
      published: true,
      created_at: createdAt,
    };

    let dbError;
    if (existing) {
      // Обновляем существующую запись
      const { error } = await sb
        .from("blog_posts")
        .update(row)
        .eq("slug", a.slug);
      dbError = error;
      if (!error) updated++;
    } else {
      // Вставляем новую
      const { error } = await sb.from("blog_posts").insert(row);
      dbError = error;
      if (!error) added++;
    }

    if (dbError) {
      console.error(`✗ ${a.slug}: DB error — ${dbError.message}`);
      errors++;
      continue;
    }

    const action = existing ? "обновлено" : "добавлено";
    console.log(`✓ ${action}: ${a.slug} | ${parsed.words} сл | ${readTime} мин | cover:${cover ? "да" : "нет"}`);
  }

  console.log(`\nИтого: добавлено ${added}, обновлено ${updated}, ошибок ${errors} из ${ARTICLES.length}.`);
  if (errors > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

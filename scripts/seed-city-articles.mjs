// seed-city-articles.mjs
// Сеет 5 статей про новые города (Майами, Хельсинки, Копенгаген, Тулум, Гамбург) в blog_posts.
// Upsert по slug. Обложки: сначала из cities.unsplash_url, иначе Unsplash API по coverQuery.
// Запуск: node scripts/seed-city-articles.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(HOME, ".relocost/unsplash_access_key"), "utf8").trim();

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

// Мета-данные статей: slug = имя файла (без .md), city = slug из таблицы cities
const META = [
  {
    slug: "zhizn-v-majami-dlya-rossiyan-2026",
    city: "miami",
    coverQuery: "miami florida beach palm",
  },
  {
    slug: "pereezd-v-finlandiyu-2026",
    city: "helsinki",
    coverQuery: "helsinki finland winter",
  },
  {
    slug: "zhizn-v-kopengagene-2026",
    city: "copenhagen",
    coverQuery: "copenhagen denmark canal colorful",
  },
  {
    slug: "tulum-dlya-tsifrovogo-kochevnika-2026",
    city: "tulum",
    coverQuery: "tulum mexico ruins beach",
  },
  {
    slug: "zhizn-v-gamburgye-2026",
    city: "hamburg",
    coverQuery: "hamburg germany harbor speicherstadt",
  },
];

// Парсит YAML frontmatter и тело из файлов вида:
// ---
// slug: ...
// title: "..."
// description: "..."
// tag: ...
// city: ...
// reading_time: N
// published: true
// ---
// {тело статьи без H1}
function parseFrontmatter(content) {
  const match = content.replace(/^﻿/, "").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("frontmatter не найден");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^"(.*)"$/, "$1");
    if (key) fm[key] = val;
  }
  const body = match[2].trim();
  // Удаляем первый H1, если он случайно попал в тело
  const cleanBody = body.replace(/^#\s+.+\n+/, "");
  const words = cleanBody.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(4, Math.min(20, parseInt(fm.reading_time || "7", 10)));
  return { fm, body: cleanBody, words, readTime };
}

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash HTTP ${res.status} для "${query}"`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    cover_url: pick.urls.raw,
    cover_author_name: pick.user.name,
    cover_author_url: pick.user.links.html,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  // Загружаем все города для поиска city_id по slug
  const { data: cities, error: cErr } = await sb
    .from("cities")
    .select("id, slug, unsplash_url, unsplash_author_name, unsplash_author_url");
  if (cErr) throw new Error(`Ошибка загрузки cities: ${cErr.message}`);
  const cityBySlug = new Map(cities.map((c) => [c.slug, c]));
  console.log(`Загружено городов: ${cities.length}`);

  const base = Date.now();
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < META.length; i++) {
    const m = META[i];
    const filePath = path.join(BLOG_DIR, `${m.slug}.md`);

    if (!fs.existsSync(filePath)) {
      console.error(`✗ ${m.slug}: файл не найден — пропуск`);
      fail++;
      continue;
    }

    // Ищем город
    const city = cityBySlug.get(m.city);
    if (!city) {
      console.warn(`~ ${m.slug}: город "${m.city}" не найден в cities — вставляем без city_id`);
    }

    // Парсим статью
    let parsed;
    try {
      parsed = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.error(`✗ ${m.slug}: ошибка парсинга — ${e.message}`);
      fail++;
      continue;
    }

    // Обложка: сначала из города, потом Unsplash API
    let cover = {};
    if (city?.unsplash_url) {
      cover = {
        cover_url: city.unsplash_url,
        cover_author_name: city.unsplash_author_name ?? null,
        cover_author_url: city.unsplash_author_url ?? null,
      };
      console.log(`  обложка из города ${m.city}`);
    } else {
      // Пауза 1.5с между запросами к Unsplash
      if (i > 0) await sleep(1500);
      try {
        const co = await fetchUnsplash(m.coverQuery);
        if (co) {
          cover = co;
          console.log(`  обложка с Unsplash: "${m.coverQuery}"`);
        }
      } catch (e) {
        console.warn(`  ~ ${m.slug}: обложка не получена (${e.message})`);
      }
    }

    // created_at убывает, чтобы новые статьи шли сверху в списке блога
    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      slug: m.slug,
      title: parsed.fm.title,
      seo_title: parsed.fm.title,
      seo_description: parsed.fm.description ?? null,
      tag: parsed.fm.tag ?? "Жизнь",
      city_id: city?.id ?? null,
      read_time: parsed.readTime,
      content_md: parsed.body,
      published: parsed.fm.published !== "false",
      created_at: createdAt,
      ...cover,
    };

    const { error: upErr } = await sb
      .from("blog_posts")
      .upsert(row, { onConflict: "slug" });

    if (upErr) {
      console.error(`✗ ${m.slug}: upsert ошибка — ${upErr.message}`);
      fail++;
      continue;
    }

    console.log(
      `✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, ` +
      `city_id:${city?.id ?? "null"}, cover:${cover.cover_url ? "да" : "нет"}`
    );
    ok++;
  }

  console.log(`\nГотово. Успешно: ${ok}, ошибок: ${fail}, всего: ${META.length}`);
}

run().catch((e) => {
  console.error("Критическая ошибка:", e);
  process.exit(1);
});

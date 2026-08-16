// 10 новых SEO-статей блога Relocost: питомцы, страховка, пенсионеры,
// Польша, Испания, Дубай с детьми, Тбилиси-аренда, удаленка, климат.
// Запуск: node scripts/seed-blog-new-10.mjs

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
const UNSPLASH = fs.readFileSync(`${HOME}/.relocost/unsplash_access_key`, "utf8").trim();

const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

// Метаданные статей — slug совпадает с именем .md файла в content/blog/
const ARTICLES = [
  {
    slug: "pereezd-s-koshkoy-za-granitsu-2026",
    tag: "Гайд",
    read_time: 8,
    country_slug: null,
    city_slug: null,
    unsplash_query: "cat travel carrier pet cozy",
  },
  {
    slug: "pereezd-s-sobakey-za-granitsu-2026",
    tag: "Гайд",
    read_time: 9,
    country_slug: null,
    city_slug: null,
    unsplash_query: "dog travel airport pet carrier",
  },
  {
    slug: "strahovka-dlya-relokanta-2026",
    tag: "Финансы",
    read_time: 7,
    country_slug: null,
    city_slug: null,
    unsplash_query: "insurance health documents expat",
  },
  {
    slug: "luchshie-strany-dlya-pensionerov-2026",
    tag: "Гайд",
    read_time: 8,
    country_slug: null,
    city_slug: null,
    unsplash_query: "senior couple travel retirement abroad",
  },
  {
    slug: "pereezd-v-polshu-iz-rossii-2026",
    tag: "Гайд",
    read_time: 9,
    country_slug: "poland",
    city_slug: null,
    unsplash_query: "warsaw poland city old town street",
  },
  {
    slug: "zhizn-s-detmi-v-dubai-2026",
    tag: "Гайд",
    read_time: 9,
    country_slug: "uae",
    city_slug: "dubai",
    unsplash_query: "dubai family children playground park",
  },
  {
    slug: "pereezd-v-ispaniyu-2026",
    tag: "Гайд",
    read_time: 9,
    country_slug: "spain",
    city_slug: null,
    unsplash_query: "barcelona spain city streets sunlight",
  },
  {
    slug: "kak-snyat-kvartiru-v-tbilisi-2026",
    tag: "Гайд",
    read_time: 8,
    country_slug: "georgia",
    city_slug: "tbilisi",
    unsplash_query: "tbilisi georgia apartment balcony old town",
  },
  {
    slug: "top10-stran-dlya-udalennoy-raboty-2026",
    tag: "Гайд",
    read_time: 9,
    country_slug: null,
    city_slug: null,
    unsplash_query: "remote work laptop coworking space cafe",
  },
  {
    slug: "klimat-za-rubezhom-kuda-pereekhat-po-pogode-2026",
    tag: "Гайд",
    read_time: 9,
    country_slug: null,
    city_slug: null,
    unsplash_query: "mediterranean sea coast sunny weather travel",
  },
];

/**
 * Читает .md файл из content/blog/ и парсит поля:
 * SEO_TITLE, SEO_DESCRIPTION, READ_TIME (опционально), ---CONTENT--- и заголовок H1.
 */
function parseMd(slug) {
  const filePath = path.join(ROOT, "content", "blog", `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");

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
    throw new Error(`No ---CONTENT--- marker found in ${slug}.md`);
  }

  const content_md = lines.slice(contentStart).join("\n").trim();

  // Извлекаем заголовок H1 из контента
  const h1Match = content_md.match(/^#\s+(.+)$/m);
  const title = h1Match ? h1Match[1].trim() : slug;

  return { title, content_md, seo_title: meta.seo_title, seo_description: meta.seo_description };
}

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    cover_unsplash_id: pick.id,
    cover_url: pick.urls.raw,
    cover_author_name: pick.user.name,
    cover_author_url: pick.user.links.html,
  };
}

async function run() {
  const base = Date.now();
  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];

    // Проверяем: статья уже в базе?
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", a.slug)
      .maybeSingle();

    if (existing) {
      console.log(`skip (exists): ${a.slug}`);
      skipped++;
      continue;
    }

    // Парсим .md
    let parsed;
    try {
      parsed = parseMd(a.slug);
    } catch (e) {
      console.error(`parse error ${a.slug}: ${e.message}`);
      errors++;
      continue;
    }

    // Unsplash фото
    let cover = null;
    try {
      cover = await fetchUnsplash(a.unsplash_query);
    } catch (e) {
      console.warn(`unsplash failed ${a.slug}: ${e.message}`);
    }

    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      title: parsed.title,
      slug: a.slug,
      tag: a.tag,
      read_time: a.read_time,
      content_md: parsed.content_md,
      seo_title: parsed.seo_title,
      seo_description: parsed.seo_description,
      country_slug: a.country_slug ?? null,
      city_id: null,
      cover_unsplash_id: cover?.cover_unsplash_id ?? null,
      cover_url: cover?.cover_url ?? null,
      cover_author_name: cover?.cover_author_name ?? null,
      cover_author_url: cover?.cover_author_url ?? null,
      published: true,
      created_at: createdAt,
    };

    const { error } = await sb.from("blog_posts").insert(row);
    if (error) {
      console.error(`insert error ${a.slug}: ${error.message}`);
      errors++;
      continue;
    }

    added++;
    console.log(`+ ${a.slug}${cover ? " + cover" : " (no cover)"}`);
  }

  console.log(`\ndone. added ${added}/${ARTICLES.length}, skipped ${skipped}, errors ${errors}`);
  if (errors > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

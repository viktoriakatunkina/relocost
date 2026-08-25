// 10 SEO-статей блога Relocost — кластер «рейтинги/подборки» (август 2026):
// бюджет РФ/зарубежье, безвиз+море, удаленка/доход, самые дешевые города,
// аренда, безопасность, дети/школы, банки/счета, медицина, честный рейтинг
// плюсов-минусов. Читает .md файлы из content/blog/ (новый формат фронтматтера
// slug/title/description/tag/read_time/published), вставляет в blog_posts.
// Обложки/inline-картинки НЕ грузятся тут (raw Unsplash недоступен с VPS) —
// после сева прогнать node scripts/fill-blog-images.mjs (storage-фото, 0 запросов к Unsplash).
//
// Запуск: node scripts/seed-10-rating-articles-aug-2026.mjs

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
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const SLUGS = [
  "goroda-do-50000-rubley-rossiya-i-zarubezhe-2026",
  "bezvizovye-goroda-u-morya-2026",
  "gde-vygodnee-rabotat-udalenno-dlya-rossiyan-2026",
  "gde-deshevle-vsego-zhit-rossiyaninu-2026",
  "gde-vygodnee-snimat-zhile-reyting-gorodov-2026",
  "samye-bezopasnye-goroda-dlya-pereezda-2026",
  "kuda-pereekhat-s-detmi-reyting-gorodov-2026",
  "gde-proshche-otkryt-schet-reyting-stran-2026",
  "top-gorodov-luchshaya-meditsina-dlya-relokantov-2026",
  "stoit-li-pereezzhat-chestny-reyting-gorodov-2026",
];

// Парсит новый формат фронтматтера: ---\nkey: value\n---\nContent
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

async function run() {
  const base = Date.now();
  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];

    const { data: existing } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      console.log(`skip (exists): ${slug}`);
      skipped++;
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
      tag: meta.tag || "Рейтинг",
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

    const { error } = await sb.from("blog_posts").insert(row);
    if (error) {
      console.error(`insert error ${slug}: ${error.message}`);
      errors++;
      continue;
    }

    added++;
    console.log(`+ ${slug}`);
  }

  console.log(`\ndone. added ${added}/${SLUGS.length}, skipped ${skipped}, errors ${errors}`);
  if (added > 0) {
    console.log(`\nNext step: node scripts/fill-blog-images.mjs   (обложки + inline-картинки из storage)`);
  }
  if (errors > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

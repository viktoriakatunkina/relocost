// Пилот нового формата блога: "типичный переезд" — собирательный,
// иллюстративный сценарий первых месяцев в городе (НЕ интервью конкретного
// человека — явно оговорено в каждой статье). Закрывает пробел, отмеченный
// в SEO-аудите: формат "личная история/день из жизни" был слабым местом
// Relocost относительно Т—Ж.
//
// 3 пилотных города: Батуми, Анталья, Пхукет — выбраны по подтвержденному
// WebSearch спросу (у Т—Ж есть отдельные страницы t-j.ru/batumi-life/ и
// t-j.ru/life-on-phuket/) и по наличию богатого материала (районы, best_places,
// визовые правила) в lib/cities-content.ts и Supabase prices.
//
// Читает .md-файлы из content/blog/ (новый формат frontmatter), резолвит
// city_id по cities.slug, вставляет в blog_posts с tag "Личный опыт".
// Cover — реальное фото города, уже используемое на странице /city/<slug>
// (cities.unsplash_url + атрибуция), без новых запросов к Unsplash API.
//
// Запуск: node scripts/seed-blog-personal-collective-pilot.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const BLOG_DIR = path.join(import.meta.dirname, "../content/blog");

const SLUGS = [
  "batumi-tipichnyy-pereezd-2026",
  "antalya-tipichnyy-pereezd-2026",
  "phuket-tipichnyy-pereezd-2026",
];

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("Не удалось распарсить frontmatter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^"|"$/g, "");
    meta[key] = val;
  }
  return { meta, content: m[2].trim() };
}

async function run() {
  let added = 0;
  let skipped = 0;

  for (const slug of SLUGS) {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const raw = fs.readFileSync(filePath, "utf8");
    const { meta, content } = parseFrontmatter(raw);

    const { data: existingPost } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existingPost) {
      console.log(`skip (exists): ${slug}`);
      skipped++;
      continue;
    }

    const citySlug = meta.city;
    const { data: city, error: cityErr } = await sb
      .from("cities")
      .select("id, country_slug, unsplash_url, unsplash_author_name, unsplash_author_url")
      .eq("slug", citySlug)
      .maybeSingle();
    if (cityErr) throw new Error(`city lookup ${citySlug}: ${cityErr.message}`);
    if (!city) throw new Error(`city not found: ${citySlug}`);

    const readTime = meta.reading_time ? parseInt(meta.reading_time, 10) : null;

    const row = {
      title: meta.title,
      slug,
      city_id: city.id,
      country_slug: city.country_slug ?? null,
      tag: meta.tag || "Личный опыт",
      read_time: readTime,
      content_md: content,
      seo_title: meta.title,
      seo_description: meta.description ?? null,
      cover_unsplash_id: null,
      cover_url: city.unsplash_url ?? null,
      cover_author_name: city.unsplash_author_name ?? null,
      cover_author_url: city.unsplash_author_url ?? null,
      published: true,
    };

    const { error } = await sb.from("blog_posts").insert(row);
    if (error) throw new Error(`insert ${slug}: ${error.message}`);
    added++;
    console.log(`+ ${slug}`);
  }

  console.log(`\nГотово: добавлено ${added}, пропущено (уже существуют) ${skipped}.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

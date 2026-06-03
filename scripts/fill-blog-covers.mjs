// Заполняет blog_posts обложками (cover_url / cover_author_name / cover_author_url).
//  • Для статей с city_id — копирует unsplash_url и автора из связанного города.
//  • Для статей без города (например «Топ-7 направлений») — 1 запрос к Unsplash.
//
// ВАЖНО: перед запуском в Supabase должна быть применена миграция
//   supabase/migrations/202606041700_blog_cover_columns.sql
//   (колонки cover_url / cover_author_name / cover_author_url).
// Скрипт сам проверит наличие колонок и подскажет, если их нет.
//
// Запуск: node scripts/fill-blog-covers.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SB_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

// Запросы к Unsplash для статей без города (по slug статьи)
const QUERIES = {
  "top-7-napravleniy-relokatsii-2026": "relocation travel airport passport world",
};

async function fetchOnePhoto(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return { url: p.urls.raw, name: p.user.name, html: p.user.links.html };
}

// 0. Проверяем, что колонки обложек существуют
{
  const { error } = await sb.from("blog_posts").select("cover_url").limit(1);
  if (error && /cover_url/.test(error.message)) {
    console.error("\n✗ Колонки обложек ещё не созданы в базе.");
    console.error("  Сначала примените миграцию в Supabase Studio → SQL Editor:");
    console.error("  supabase/migrations/202606041700_blog_cover_columns.sql");
    console.error("  Затем запустите скрипт снова.\n");
    process.exit(1);
  }
  if (error) throw error;
}

// 1. Загружаем статьи
const { data: posts, error: postsErr } = await sb
  .from("blog_posts")
  .select("id, slug, title, city_id");
if (postsErr) throw postsErr;

// 2. Загружаем города для атрибуции
const { data: cities, error: citiesErr } = await sb
  .from("cities")
  .select("id, slug, unsplash_url, unsplash_author_name, unsplash_author_url");
if (citiesErr) throw citiesErr;
const cityById = new Map(cities.map((c) => [c.id, c]));

let ok = 0;
let skipped = 0;

for (const post of posts) {
  let cover = null;

  if (post.city_id) {
    const city = cityById.get(post.city_id);
    if (city?.unsplash_url) {
      cover = {
        cover_url: city.unsplash_url,
        cover_author_name: city.unsplash_author_name,
        cover_author_url: city.unsplash_author_url,
      };
    } else {
      console.log(`~ ${post.slug}: у города нет unsplash_url, пропуск`);
      skipped++;
      continue;
    }
  } else {
    const q = QUERIES[post.slug];
    if (!q) {
      console.log(`~ ${post.slug}: нет города и нет запроса в QUERIES, пропуск`);
      skipped++;
      continue;
    }
    try {
      const photo = await fetchOnePhoto(q);
      if (!photo) {
        console.log(`~ ${post.slug}: Unsplash не вернул фото для "${q}", пропуск`);
        skipped++;
        continue;
      }
      cover = {
        cover_url: photo.url,
        cover_author_name: photo.name,
        cover_author_url: photo.html,
      };
    } catch (e) {
      console.error(`✗ ${post.slug}: ${e.message}`);
      skipped++;
      continue;
    }
  }

  const { error: upErr } = await sb.from("blog_posts").update(cover).eq("id", post.id);
  if (upErr) {
    console.error(`✗ ${post.slug}: update failed — ${upErr.message}`);
    skipped++;
    continue;
  }
  console.log(`✓ ${post.slug} → ${cover.cover_author_name} (${cover.cover_url.slice(0, 60)}…)`);
  ok++;
}

console.log(`\nГотово. Обновлено: ${ok}, пропущено: ${skipped}.`);

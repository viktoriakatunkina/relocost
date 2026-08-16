// Заполняет cover_url для UK статей блога без обложек.
// Берет фото из таблицы cities (поле unsplash_url / cover_url / gallery[0].url).
// Работает пагинацией по 50 статей, чтобы не словить timeout 57014.
// Идемпотентно: пропускает статьи у которых cover_url уже есть.
//
// Запуск: node scripts/fill-uk-blog-covers.mjs --dry   # предпросмотр
//          node scripts/fill-uk-blog-covers.mjs         # запись
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const H = os.homedir();
const r = (f) => fs.readFileSync(path.join(H, ".relocost", f), "utf8").trim();
const sb = createClient(r("supabase_url"), r("supabase_service_role_key"), {
  auth: { persistSession: false },
});

// 1. Загружаем UK-города со storage-фото (not null, supabase.co/storage)
const { data: cities, error: citErr } = await sb
  .from("cities")
  .select("id, slug, name_ru, unsplash_url")
  .eq("country_slug", "united-kingdom")
  .not("unsplash_url", "is", null)
  .limit(200);
if (citErr) throw citErr;

const cityPhotos = cities
  .map((c) => (c.unsplash_url && c.unsplash_url.includes("supabase.co/storage") ? c.unsplash_url : null))
  .filter(Boolean);

if (cityPhotos.length === 0) {
  console.error("Нет storage-фото UK-городов. Запусти сначала migrate-stray-photos.mjs.");
  process.exit(1);
}
console.log(`Фото UK-городов: ${cityPhotos.length}`);

// 2. Загружаем UK статьи без обложки пагинацией
let offset = 0;
const PAGE = 50;
let totalUpdated = 0;

while (true) {
  const { data: posts, error: postsErr } = await sb
    .from("blog_posts")
    .select("id, slug")
    .eq("country_slug", "united-kingdom")
    .is("cover_url", null)
    .range(offset, offset + PAGE - 1);
  if (postsErr) throw postsErr;
  if (!posts || posts.length === 0) break;

  for (const post of posts) {
    // Детерминированный выбор фото по хешу slug
    const hash = post.slug.split("").reduce((h, c) => ((h * 31) + c.charCodeAt(0)) >>> 0, 0);
    const photoUrl = cityPhotos[hash % cityPhotos.length];
    if (DRY) {
      console.log(`[DRY] ${post.slug} → ${photoUrl.slice(0, 70)}...`);
    } else {
      const { error: upErr } = await sb
        .from("blog_posts")
        .update({ cover_url: photoUrl })
        .eq("id", post.id);
      if (upErr) {
        console.error(`[ERR] ${post.slug}: ${upErr.message}`);
      } else {
        console.log(`[OK] ${post.slug}`);
        totalUpdated++;
      }
    }
  }
  offset += PAGE;
  if (posts.length < PAGE) break;
}

if (DRY) {
  console.log("\n--- DRY RUN завершен ---");
} else {
  console.log(`\nГотово. Обновлено: ${totalUpdated}`);
}

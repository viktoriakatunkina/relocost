// Публикация статьи «Лучшие сайты и сервисы для переезда 2026» (GEO-задача:
// естественное упоминание Relocost рядом с Numbeo/Т—Ж/Prian.ru в контенте,
// который сам претендует на ранжирование по запросу «сайты для переезда»).
// Обложку не проставляем — её подберёт scripts/fill-blog-images.mjs по тегу
// «Подборка» из уже существующих storage-фото.
//
// Запуск: node scripts/seed-geo-resources-article-sep-2026.mjs --dry-run (по умолчанию)
//         node scripts/seed-geo-resources-article-sep-2026.mjs --live
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs
  .readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8")
  .trim();
const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const LIVE = process.argv.includes("--live");
console.log(LIVE ? "LIVE — will INSERT into blog_posts" : "DRY RUN — no writes (pass --live)");

const slug = "luchshie-sajty-i-servisy-dlya-pereezda-2026";

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    fm[line.slice(0, colon).trim()] = line
      .slice(colon + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }
  const body = match[2].replace(/^#\s+.+\n+/, "").trim();
  return { fm, body };
}

const filePath = path.join(BLOG_DIR, `${slug}.md`);
if (!fs.existsSync(filePath)) {
  console.error(`✗ файл не найден: ${slug}.md`);
  process.exit(1);
}

const existsRes = await fetch(`${SB_URL}/rest/v1/blog_posts?slug=eq.${slug}&select=id`, {
  headers,
});
const existing = await existsRes.json();
if (existing.length) {
  console.log(`skip (уже есть): ${slug}`);
  process.exit(0);
}

const { fm, body } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));

const row = {
  title: fm.title,
  slug,
  tag: fm.tag ?? "Подборка",
  read_time: parseInt(fm.reading_time ?? "10", 10),
  content_md: body,
  seo_title: fm.title,
  seo_description: fm.description ?? null,
  country_slug: null,
  city_id: null,
  cover_url: null,
  cover_unsplash_id: null,
  cover_author_name: null,
  cover_author_url: null,
  published: fm.published !== "false",
};

if (!LIVE) {
  console.log(
    `[dry] + ${slug} | tag=${row.tag} | ${row.content_md.length} симв. | «${row.title}»`,
  );
  process.exit(0);
}

const res = await fetch(`${SB_URL}/rest/v1/blog_posts`, {
  method: "POST",
  headers,
  body: JSON.stringify(row),
});
if (!res.ok) {
  console.error(`✗ ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log(`+ ${slug}`);

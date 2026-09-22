// Шестая большая волна (50 статей) сентября 2026, суб-волна 2 из 5.
//
// Тема суб-волны: пошаговые чек-листы легализации/визы, привязанные к 10
// приоритетным новым городам каталога — формат, которого на блоге почти не
// было (только 2 общих checklist-файла до этой волны). Каждый город получает
// 2-ю или 3-ю статью иного формата, чем в суб-волне 1 (смета бюджета), —
// избегаем тонкого дублирования.
//
// Визовые факты (безвиз Китая до 30 дней продлен до конца 2027, K-ETA Кореи
// не заменяет рабочую визу, отсутствие безвиза Японии, упрощенное гражданство
// Кыргызстана, закрытие Go-No-Go для алии, требования визы Digital Nomad
// Испании IPREM 2026 и т.д.) проверены через WebSearch в ходе сессии.
// Цифры бюджета — из живых данных таблицы prices по city_id.
//
// Запуск: node scripts/seed-10-commercial-intent-sep2026-wave6-sub2.mjs --dry-run  (по умолчанию)
//         node scripts/seed-10-commercial-intent-sep2026-wave6-sub2.mjs --live
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

const POSTS = {
  "chek-list-grazhdanstvo-kirgizii-cherez-osh-2026": { city: "osh", country_slug: "kyrgyzstan" },
  "chek-list-vnzh-turcii-arenda-trabzon-2026": { city: "trabzon", country_slug: "turkey" },
  "chek-list-aliya-izrail-netaniya-2026": { city: "netanya", country_slug: "israel" },
  "chek-list-rabochaya-viza-yuzhnaya-koreya-pusan-2026": { city: "busan", country_slug: "south-korea" },
  "chek-list-viza-i-vnzh-yaponiya-fukuoka-2026": { city: "fukuoka", country_slug: "japan" },
  "chek-list-rabochaya-viza-kitay-guanchzhou-2026": { city: "guangzhou", country_slug: "china" },
  "chek-list-vnzh-serbiya-nish-2026": { city: "nis", country_slug: "serbia" },
  "chek-list-cifrovoy-kochevnik-ispaniya-marbelya-2026": { city: "marbella", country_slug: "spain" },
  "chek-list-pereezd-kazakhstan-shymkent-2026": { city: "shymkent", country_slug: "kazakhstan" },
  "chek-list-frilans-viza-oae-ras-el-khayma-2026": { city: "ras-al-khaimah", country_slug: "uae" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, opts, retries = 4, backoffMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;
      const body = await res.text();
      console.error(`  attempt ${attempt}/${retries}: ${res.status} ${body.slice(0, 300)}`);
    } catch (e) {
      console.error(`  attempt ${attempt}/${retries}: ${e.message}`);
    }
    if (attempt < retries) await sleep(backoffMs * attempt);
    else throw new Error(`Giving up after ${retries} attempts`);
  }
}

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

async function loadCities(slugs) {
  const wanted = [...new Set(slugs.filter(Boolean))];
  if (!wanted.length) return new Map();
  const res = await fetchWithRetry(
    `${SB_URL}/rest/v1/cities?select=id,slug,unsplash_url,unsplash_author_name,unsplash_author_url&slug=in.(${wanted.join(",")})`,
    { headers },
  );
  const rows = await res.json();
  return new Map(rows.map((r) => [r.slug, r]));
}

const slugs = Object.keys(POSTS);
const citySlugs = Object.values(POSTS).map((p) => p.city);
const cityBySlug = await loadCities(citySlugs);

const base = Date.now();
let added = 0,
  skipped = 0,
  errors = 0;

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const meta = POSTS[slug];
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    console.error(`✗ файл не найден: ${slug}.md`);
    errors++;
    continue;
  }

  const existsRes = await fetchWithRetry(
    `${SB_URL}/rest/v1/blog_posts?slug=eq.${slug}&select=id`,
    { headers },
  );
  const existing = await existsRes.json();
  if (existing.length) {
    console.log(`skip (уже есть): ${slug}`);
    skipped++;
    continue;
  }

  const { fm, body } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
  const city = meta.city ? cityBySlug.get(meta.city) : null;
  if (meta.city && !city) {
    console.error(`✗ ${slug}: город "${meta.city}" не найден в cities`);
    errors++;
    continue;
  }

  const row = {
    title: fm.title,
    slug,
    tag: fm.tag ?? "Визы и документы",
    read_time: parseInt(fm.reading_time ?? "10", 10),
    content_md: body,
    seo_title: fm.title,
    seo_description: fm.description ?? null,
    country_slug: meta.country_slug,
    city_id: city?.id ?? null,
    cover_url: city?.unsplash_url || fm.cover_url || null,
    cover_unsplash_id: null,
    cover_author_name: city?.unsplash_author_name ?? null,
    cover_author_url: city?.unsplash_author_url ?? null,
    published: fm.published !== "false",
    created_at: new Date(base - i * 3600 * 1000).toISOString(),
  };

  if (!LIVE) {
    console.log(
      `[dry] + ${slug} | city=${meta.city ?? "—"} country=${row.country_slug ?? "—"} | cover=${row.cover_url ? "ok" : "MISSING"} | ${row.content_md.length} симв. | «${row.title}»`,
    );
    added++;
    continue;
  }

  await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
  });
  console.log(`+ ${slug} (city=${meta.city ?? "—"}, country=${row.country_slug ?? "—"})`);
  added++;
  await sleep(400);
}

console.log(`\ndone. added=${added} skipped=${skipped} errors=${errors} / total=${slugs.length}`);

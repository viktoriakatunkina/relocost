// 5 статей с явным коммерческим/транзакционным интентом — сентябрь 2026.
//
// Темы отобраны по реальным данным purchases в Supabase (paid=8 за всё
// время): Грузия — Батуми x2, Кутаиси x1 (сильнейший кластер), Черногория —
// Будва x1, Турция — Стамбул x1, Таиланд — Пхукет x1. Дубай (Free Zone,
// 1 покупка) сознательно пропущен — направление уже перенасыщено 10
// статьями в блоге, новая статья рисковала каннибализировать существующий
// трафик вместо того чтобы его усиливать.
//
// Формат статей — не «стоимость жизни» (это уже покрыто в блоге), а разовая
// СМЕТА переезда (перелёт+депозит+легализация) или прямое сравнение двух
// городов по бюджету — оба формата ближе к моменту принятия решения о
// покупке, чем общий обзор города.
//
// Читает frontmatter из content/blog/*.md, пишет в blog_posts через raw REST
// с ретраями (см. scripts/seed-6-migration-stats-sep-2026.mjs — тот же
// паттерн). cover_url берём из cities.unsplash_url там, где есть city_id.
//
// Запуск: node scripts/seed-5-commercial-intent-sep-2026.mjs --dry-run  (по умолчанию)
//         node scripts/seed-5-commercial-intent-sep-2026.mjs --live
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

// slug -> { city: slug в cities.slug | null, country_slug }
// city заполняется → country_slug у статьи не проставляем (getCityForPost сам
// подтянет страну через city_id при необходимости на других страницах).
const POSTS = {
  "skolko-nuzhno-deneg-na-pereezd-v-gruziyu-2026": { city: null, country_slug: "georgia" },
  "batumi-ili-tbilisi-gde-deshevle-zhit-2026": { city: "batumi", country_slug: null },
  "pereezd-v-budvu-smeta-2026": { city: "budva", country_slug: null },
  "stambul-ili-antaliya-gde-deshevle-zhit-2026": { city: "istanbul", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-na-phuket-2026": { city: "phuket", country_slug: null },
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
  // H1 рендерится шаблоном из title, из тела его убираем, если он там есть.
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
    tag: fm.tag ?? "Переезд",
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
    // разносим по времени, чтобы в ленте блога не слиплись в одну секунду
    created_at: new Date(base - i * 3600 * 1000).toISOString(),
  };

  if (!LIVE) {
    console.log(
      `[dry] + ${slug} | city=${meta.city ?? "—"} country=${row.country_slug ?? "—"} | ${row.content_md.length} симв. | «${row.title}»`,
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

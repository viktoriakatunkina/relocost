// 6 статей кластера «статистика эмиграции» — сентябрь 2026.
//
// Почему именно этот кластер: по Я.Метрике за 30 дней статьи со статистикой
// эмиграции дают несоизмеримо больше трафика, чем всё остальное в блоге
// (kuda-ukhali-rossiyane-statistika-2025-2026 — 432 визита,
// skolko-rossiyan-uehalo-2025-2026-statistika — 73), при этом «почему»-формат
// того же кластера (pochemu-it-ukhodyat-iz-rossii-statistika-2026) даёт 0.
// Вывод: работает количественная формулировка «сколько / куда», не «почему».
// Темы отобраны по подсказкам Yandex Suggest, все цифры — из проверяемых
// источников (Росстат, UN DESA, Geostat, МВД РК/Сербии, Göç İdaresi, Destatis).
//
// Читает frontmatter из content/blog/*.md, пишет в blog_posts через raw REST
// с ретраями (как в остальных seed-скриптах), проставляет country_slug там,
// где статья однозначно про одну страну (тот же принцип, что в
// scripts/backfill-blog-city-country.mjs — country-level CTA вместо city-level).
//
// Запуск: node scripts/seed-6-migration-stats-sep-2026.mjs --dry-run  (по умолчанию)
//         node scripts/seed-6-migration-stats-sep-2026.mjs --live
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

// slug -> country_slug (null = статья про несколько стран сразу, CTA берёт фолбэк)
const POSTS = {
  "emigratsiya-iz-rossii-po-godam-statistika-2026": null,
  "skolko-rossiyan-zhivet-za-granitsey-2026-po-stranam": null,
  "skolko-rossiyan-v-kazahstane-2026-statistika": "kazakhstan",
  "skolko-rossiyan-v-gruzii-2026-statistika": "georgia",
  "skolko-rossiyan-v-serbii-2026-statistika": "serbia",
  "skolko-rossiyan-v-turtsii-2026-statistika": "turkey",
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
  // H1 рендерится шаблоном из title, из тела его убираем
  const body = match[2].replace(/^#\s+.+\n+/, "").trim();
  return { fm, body };
}

const slugs = Object.keys(POSTS);
const base = Date.now();
let added = 0,
  skipped = 0,
  errors = 0;

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
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
  const row = {
    title: fm.title,
    slug,
    tag: fm.tag ?? "Аналитика",
    read_time: parseInt(fm.reading_time ?? "10", 10),
    content_md: body,
    seo_title: fm.title,
    seo_description: fm.description ?? null,
    country_slug: POSTS[slug],
    city_id: null,
    cover_url: fm.cover_url || null,
    cover_unsplash_id: null,
    cover_author_name: null,
    cover_author_url: null,
    published: fm.published !== "false",
    // разносим по времени, чтобы в ленте блога не слиплись в одну секунду
    created_at: new Date(base - i * 3600 * 1000).toISOString(),
  };

  if (!LIVE) {
    console.log(
      `[dry] + ${slug} | country=${row.country_slug ?? "—"} | ${row.content_md.length} симв. | «${row.title}»`,
    );
    added++;
    continue;
  }

  await fetchWithRetry(`${SB_URL}/rest/v1/blog_posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
  });
  console.log(`+ ${slug} (country=${row.country_slug ?? "—"})`);
  added++;
  await sleep(400);
}

console.log(`\ndone. added=${added} skipped=${skipped} errors=${errors} / total=${slugs.length}`);

// Восьмая волна сентября 2026. Стратегия: НЕ широкие коммерческие темы, а
// низкочастотные («long-tail») узкие вопросы с высоким интентом и почти
// нулевой конкуренцией у крупных игроков (relocatefrom.ru, gogov.ru, Т-Ж).
// Темы найдены через WebSearch по автодополнениям, форумам (travelask.ru,
// vc.ru) и официальным источникам (gosuslugi.ru, МИД РФ, defacto.kz,
// srb.guide) в ходе сессии — не выдуманы. Ключевые факты, проверенные через
// WebSearch: справка о несудимости не входит в стандартный список для
// временного ВНЖ Сербии (community-гайд srb.guide, форумы), но требуется для
// ПМЖ/гражданства; уведомление МВД о ВНЖ другой страны обязательно только
// при въезде в РФ (разъяснение МИД, pravo.ru), проект об обязанности для
// живущих за рубежом с 2028 года (МИД, декабрь 2025, meduza.io); в Грузии
// нет посольства РФ с 2008 года, консульские функции — секция интересов РФ
// при посольстве Швейцарии в Тбилиси (kdmid.ru, nlevshits.com); Казахстан
// освобождает граждан РФ от регистрации на 30 дней вместо 5 (defacto.kz);
// лимит наличных без декларации на границе РФ — 10 000 $ (customs.gov.ru,
// t-j.ru); самозанятость сохраняется за рубежом при доходе от российских
// заказчиков (qugo.ru), приложение «Мой налог» нестабильно работает с
// иностранного IP.
//
// Запуск: node scripts/seed-10-longtail-sep2026-wave8.mjs --dry-run  (по умолчанию)
//         node scripts/seed-10-longtail-sep2026-wave8.mjs --live
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
  "nesudimost-dlya-vnzh-v-serbii-2026": { city: "belgrade", country_slug: "serbia" },
  "soglasie-na-vyvoz-rebenka-za-granitsu-pri-pereezde-2026": { city: null, country_slug: null },
  "uvedomlenie-o-vnzh-v-mvd-2026": { city: null, country_slug: null },
  "zagranpasport-v-tbilisi-gde-poluchit-2026": { city: "tbilisi", country_slug: "georgia" },
  "gosuslugi-za-granitsey-posle-pereezda-2026": { city: null, country_slug: null },
  "sim-karta-v-gruzii-bez-vnzh-2026": { city: "tbilisi", country_slug: "georgia" },
  "registratsiya-v-kazakhstane-dlya-rossiyan-2026": { city: "almaty", country_slug: "kazakhstan" },
  "skolko-nalichnykh-mozhno-provezti-pri-pereezde-2026": { city: null, country_slug: null },
  "doverennost-na-kvartiru-iz-tbilisi-2026": { city: "tbilisi", country_slug: "georgia" },
  "samozanyatost-nahodyas-za-granitsey-2026": { city: null, country_slug: null },
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
    tag: fm.tag ?? "Гайд",
    read_time: parseInt(fm.reading_time ?? "9", 10),
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

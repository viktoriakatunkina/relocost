// Девятая волна сентября 2026, суб-волна 2 из 2 (финальная). Сметы переезда
// для оставшихся 6 из 16 городов каталога (208 городов) без единой статьи в
// блоге (Ванадзор, Чэнду, Дидим, Хуахин, Фантхьет, Канди) — плюс 4 статьи-
// сравнения городов внутри одной страны (Болгария: Бургас/Пловдив/Русе;
// Хорватия: Задар/Пула; Казахстан: Атырау/Павлодар; Израиль: Ашдод/Бат-Ям),
// чтобы не дублировать одиночные городские статьи из суб-волны 1 почти
// идентичным контентом.
//
// Все цифры — из таблицы prices в Supabase по этим городам (запрос
// выполнен в ходе сессии) и из lib/countries-content.ts (канонические
// visa_note/intro для стран, которые правит Виктория). Факты, дополнительно
// проверенные через WebSearch в ходе сессии: Таиланд сократил безвиз для
// России до 30 дней с 15 сентября 2026 (возврат к соглашению 2005 года,
// currenttime.tv, ngs.ru); Китай продлил безвизовый режим для россиян
// (30 дней, без ограничений по числу въездов) до 31 декабря 2027 года
// (aviasales.ru, unitours.ru); Шри-Ланка сделала туристическую ETA
// бесплатной для россиян с 25 мая 2026 года (kp.ru, hikka.ru, eta.gov.lk).
//
// Запуск: node scripts/seed-10-new-cities-budget-sep2026-wave9-sub2.mjs --dry-run  (по умолчанию)
//         node scripts/seed-10-new-cities-budget-sep2026-wave9-sub2.mjs --live
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
  "skolko-nuzhno-deneg-na-pereezd-v-vanadzor-2026": { city: "vanadzor", country_slug: "armenia" },
  "skolko-nuzhno-deneg-na-pereezd-v-chengdu-2026": { city: "chengdu", country_slug: "china" },
  "skolko-nuzhno-deneg-na-pereezd-v-didim-2026": { city: "didim", country_slug: "turkey" },
  "skolko-nuzhno-deneg-na-pereezd-v-huakhin-2026": { city: "hua-hin", country_slug: "thailand" },
  "skolko-nuzhno-deneg-na-pereezd-v-fantkhet-2026": { city: "phan-thiet", country_slug: "vietnam" },
  "skolko-nuzhno-deneg-na-pereezd-v-kandi-2026": { city: "kandy", country_slug: "sri-lanka" },
  "burgas-plovdiv-ruse-gde-deshevle-zhit-v-bolgarii-2026": { city: "burgas", country_slug: "bulgaria" },
  "zadar-ili-pula-gde-deshevle-zhit-v-khorvatii-2026": { city: "zadar", country_slug: "croatia" },
  "atyrau-ili-pavlodar-gde-deshevle-zhit-v-kazakhstane-2026": { city: "atyrau", country_slug: "kazakhstan" },
  "ashdod-ili-bat-yam-gde-deshevle-zhit-v-izraile-2026": { city: "ashdod", country_slug: "israel" },
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
  // Статьи волны 9 сознательно начинаются с "## " (не дублируют H1 страницы),
  // поэтому ведущий "# " здесь срезать не нужно.
  const body = match[2].trim();
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
      `[dry] + ${slug} | city=${meta.city ?? "—"} country=${row.country_slug ?? "—"} | cover=${row.cover_url ? "ok" : "MISSING"} | ${row.content_md.length} симв. | title(${row.title.length})=«${row.title}»`,
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

// Четвёртая волна коммерческого контента сентября 2026 (после
// seed-5-commercial-intent-sep-2026.mjs от 14.09,
// seed-10-commercial-intent-sep-2026.mjs от 18.09 и
// seed-5-new-cities-commercial-sep2026.mjs от 18.09).
//
// Контекст: проверка purchases не выявила новых пробелов — все оплаченные
// города (Пхукет/Дубай/Москва/Стамбул/Батуми/Кутаиси/Сингапур/Будва) уже
// плотно покрыты статьями. Из 5 оставшихся новых городов без статей
// (Шанхай, Шэньчжэнь, Котор, Пусан, Фукуока) через WebSearch (наличие
// отдельных материалов у relocatefrom.ru/Т-Ж) подтверждён спрос только на
// Шанхай (t-j.ru/shanhai, relocatefrom.ru/china/shanghai) и Шэньчжэнь
// (relocatefrom.ru/china/shenzhen) — Котор/Пусан/Фукуока у конкурентов
// отдельных cost-of-living страниц не имеют, оставлены без статьи.
//
// Остальные 8 статей — расширение охвата за пределы города: сравнения между
// городами разных волн без готовой статьи (Дубай/Рас-эль-Хайма, Северный/
// Южный Кипр, Белград/Нови-Сад, Сан-Франциско/Лос-Анджелес, Майорка/
// Барселона — для каждой пары подтверждён реальный поисковый спрос через
// WebSearch: дедublicated материалы у elitrazbor.ru, t-j.ru, cityexpert.rs)
// и сегменты аудитории, ранее не покрытые для этих городов (IT-специалист
// в Сан-Франциско, семья с детьми на Майорке, пенсионеры на Северном Кипре
// — все три подтверждены отдельными материалами у конкурентов/нишевых
// сайтов при WebSearch).
//
// Цифры — из живых данных таблицы prices по city_id (см. scratchpad
// исследования), не придуманы. Курс — ориентир ЦБ РФ (lib/currency.ts):
// 1 $ ≈ 84,24 ₽, 1 € ≈ 97,3 ₽.
//
// Читает frontmatter из content/blog/*.md, пишет в blog_posts через raw REST
// с ретраями (тот же паттерн, что в предыдущих волнах). cover_url — из
// cities.unsplash_url по city_id, все 10 задействованных городов уже имеют
// фото в базе — Unsplash API здесь не используется.
//
// Запуск: node scripts/seed-10-commercial-intent-sep2026-wave4.mjs --dry-run  (по умолчанию)
//         node scripts/seed-10-commercial-intent-sep2026-wave4.mjs --live
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

// slug -> { city: slug в cities.slug | null, country_slug: string | null }
const POSTS = {
  "skolko-nuzhno-deneg-na-pereezd-v-shankhay-2026": { city: "shanghai", country_slug: "china" },
  "skolko-nuzhno-deneg-na-pereezd-v-shenchzhen-2026": { city: "shenzhen", country_slug: "china" },
  "dubai-ili-ras-el-khayma-gde-deshevle-zhit-2026": { city: "dubai", country_slug: null },
  "severnyy-ili-yuzhnyy-kipr-2026": { city: "kyrenia", country_slug: null },
  "belgrad-ili-novi-sad-2026": { city: "novi-sad", country_slug: null },
  "san-francisko-dlya-it-specialista-2026": { city: "san-francisco", country_slug: "usa" },
  "san-francisko-ili-los-andzheles-gde-deshevle-zhit-2026": { city: "san-francisco", country_slug: null },
  "mayorka-ili-barselona-gde-deshevle-zhit-2026": { city: "palma-de-mallorca", country_slug: null },
  "pereezd-s-detmi-na-mayorku-2026": { city: "palma-de-mallorca", country_slug: "spain" },
  "pereezd-pensionerov-na-severnyy-kipr-2026": { city: "kyrenia", country_slug: "northern-cyprus" },
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
    tag: fm.tag ?? "Финансы",
    read_time: parseInt(fm.reading_time ?? "11", 10),
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

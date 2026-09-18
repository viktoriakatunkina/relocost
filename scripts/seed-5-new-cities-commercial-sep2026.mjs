// 5 статей с явным коммерческим/транзакционным интентом («сколько нужно денег
// на переезд») — сентябрь 2026, третья волна коммерческого контента (после
// seed-5-commercial-intent-sep-2026.mjs от 14.09 и
// seed-10-commercial-intent-sep-2026.mjs от 18.09).
//
// Контекст: сегодня в каталог добавлено 10 новых городов (Шанхай, Шэньчжэнь,
// Нови-Сад, Сан-Франциско, Кирения, Рас-эль-Хайма, Котор, Пусан, Фукуока,
// Пальма-де-Майорка) — про все них пока не было ни одной статьи в блоге.
// Проверка purchases не выявила новых оплат по городам без сметы (все
// купленные города — Пхукет/Дубай/Москва/Стамбул/Батуми/Кутаиси/Сингапур/
// Будва — уже покрыты статьями предыдущих волн).
//
// Из 10 новых городов выбраны 5 с наибольшим подтверждённым поисковым
// потенциалом (WebSearch: наличие у прямых конкурентов — Т-Ж, relocatefrom.ru —
// отдельных материалов именно по этому городу = подтверждённый спрос,
// а не только наполненность каталога):
//  - Кирения (Северный Кипр) — плотная экосистема риэлторских статей про
//    переезд/недвижимость, уже есть общая статья про Северный Кипр в блоге,
//    но не было материала конкретно по Кирении.
//  - Нови-Сад (Сербия) — отдельные статьи у Т-Ж и relocatefrom.ru, второй по
//    популярности город Сербии после Белграда.
//  - Пальма-де-Майорка (Испания) — отдельная статья у Т-Ж (t-j.ru/mallorca).
//  - Рас-эль-Хайма (ОАЭ) — плотная экосистема риэлторских статей, растущая
//    альтернатива Дубаю для россиян.
//  - Сан-Франциско (США) — отдельные статьи у Т-Ж и relocatefrom.ru.
// Шанхай/Шэньчжэнь/Пусан/Фукуока/Котор — оценены как более нишевые по
// объективному поисковому спросу у русскоязычной аудитории (см. отчёт).
//
// Цифры — из живых данных калькулятора (таблица prices по city_id), не
// придуманы. Курс — ориентир ЦБ РФ (lib/currency.ts): 1 $ ≈ 84,24 ₽,
// 1 € ≈ 97,3 ₽.
//
// Читает frontmatter из content/blog/*.md, пишет в blog_posts через raw REST
// с ретраями (тот же паттерн, что в seed-10-commercial-intent-sep-2026.mjs).
// cover_url берём из cities.unsplash_url по city_id — у всех 5 городов фото
// уже залиты (см. fill-hero-photos-5new-cities*.mjs), Unsplash API здесь не
// используется.
//
// Запуск: node scripts/seed-5-new-cities-commercial-sep2026.mjs --dry-run  (по умолчанию)
//         node scripts/seed-5-new-cities-commercial-sep2026.mjs --live
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

// slug -> { city: slug в cities.slug, country_slug: string | null }
const POSTS = {
  "skolko-nuzhno-deneg-na-pereezd-v-kireniyu-2026": { city: "kyrenia", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-novi-sad-2026": { city: "novi-sad", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-na-mayorku-2026": { city: "palma-de-mallorca", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-ras-el-khaymu-2026": { city: "ras-al-khaimah", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-san-francisko-2026": { city: "san-francisco", country_slug: null },
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

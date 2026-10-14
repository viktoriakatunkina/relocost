// Блог: 2 статьи, продолжение контент-роста 14.10.2026 — закрывают СВЕЖИЙ
// пробел, созданный этим же днем: коммит 0aaf71a добавил в каталог 2 новых
// города (Улан-Батор/Монголия, Занзибар/Танзания), и ни у одного пока нет
// полноценной статьи блога с привязкой city_id/country_slug. Это тот же
// паттерн, что уже использовался для городов-сирот (udon-thani/sunny-beach/
// weligama, волна oct2026): формат «Сколько нужно денег на переезд в X».
//
// Проверка на дубли ПЕРЕД написанием: прямой запрос к blog_posts по slug
// ILIKE %ulaanbaatar%/%zanzibar%/%ulan-bator%/%mongoli%/%tanzani% нашел 25
// существующих постов с этими темами, НО все они — бывшие bulk-generated
// короткие "DN-карточки" (tag "города", 1600-3700 символов — примерно
// 300-550 слов, телеграфный стиль таблиц-бусétов без нарратива, city_id
// везде NULL — не привязаны к реальной записи города). У zanzibar-dn-2026,
// например, фактическая ошибка: заявляет несуществующую "Tanzania Digital
// Nomad Visa $300/год", хотя lib/visa.ts и lib/cities-content.ts (сами
// только что обновлены 14.10.2026) фиксируют: виза по прилету/e-visa 50$,
// официальной DN-визы нет. Эти статьи НЕ являются полноценными SEO-гайдами
// 2500+ слов с FAQ/таблицами/честной структурой — две новые статьи здесь
// качественно другой продукт (глубина, точность, привязка city_id), не
// дублирование.
//
// Все цены и визовые факты — из lib/cities-content.ts (ulaanbaatar/zanzibar,
// добавлены в этот же день) и таблицы prices в Supabase (61 позиция на
// город, 7 категорий). Цены пакетов — lib/packages.ts на 14.10.2026: places
// 79₽, budget 99₽, bundle 129₽, country_overview 79₽, country_cities 99₽
// (подняты сегодня с 19/49/59 — см. коммит bd9d32c).
//
// Пишет в blog_posts через service-role REST (паттерн как в
// scripts/seed-5-blog-articles-oct2026.mjs).
//
// Запуск: node scripts/seed-2-blog-ulaanbaatar-zanzibar-oct14-2026.mjs             (dry-run)
//         node scripts/seed-2-blog-ulaanbaatar-zanzibar-oct14-2026.mjs --live      (реальная запись)
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
  "skolko-nuzhno-deneg-na-pereezd-v-ulan-bator-2026": { city: "ulaanbaatar", country_slug: "mongolia" },
  "skolko-nuzhno-deneg-na-pereezd-na-zanzibar-2026": { city: "zanzibar", country_slug: "tanzania" },
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
    tag: fm.tag ?? "Стоимость жизни",
    read_time: parseInt(fm.reading_time ?? "12", 10),
    content_md: body,
    seo_title: fm.title,
    seo_description: fm.description ?? null,
    country_slug: meta.country_slug,
    city_id: city?.id ?? null,
    cover_url: city?.unsplash_url || fm.cover_url || null,
    cover_unsplash_id: null,
    cover_author_name: city?.unsplash_author_name ?? fm.cover_author_name ?? null,
    cover_author_url: city?.unsplash_author_url ?? fm.cover_author_url ?? null,
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

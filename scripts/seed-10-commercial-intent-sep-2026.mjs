// 10 статей с явным коммерческим/транзакционным интентом — сентябрь 2026,
// вторая волна (после seed-5-commercial-intent-sep-2026.mjs от 14.09).
//
// Контекст: каталог из 174 городов полностью наполнен (районы, работа/удалёнка,
// 12 мест, 3 маршрута на день, расширенная аренда), цены на пакеты подняты
// (города: места 149₽/расходы 199₽/всё включено 249₽; страны: обзор 149₽/
// города 199₽ — было 19-59₽). Первая волна закрыла кластер Грузия+Будва+
// Стамбул/Антальи+Пхукет; эта волна расширяет охват на новые кластеры,
// проверенные на пересечение с уже 723 статьями в блоге:
//
//  - Формат «сколько нужно денег на переезд» (разовая смета, не месячный
//    бюджет) — для стран/городов, где он ещё не использовался: Узбекистан/
//    Ташкент, Аргентина/Буэнос-Айрес, Сингапур, Таиланд (Бангкок/Паттайя/
//    Чиангмай), Вьетнам (Дананг/Нячанг/Хошимин), Кипр (Лимасол/Ларнака/
//    Никосия), Подгорица, Анталья. Формат «pereezd-v-X-pod-klyuch»/«smeta»
//    уже занят Алматы, Белградом, Дубаем, Ереваном, Измиром, Тбилиси —
//    сознательно пропущены.
//  - Формат «X или Y — где дешевле жить» — для пар городов без готового
//    прямого сравнения: Лимасол/Ларнака, Бангкок/Паттайя.
//
// Дубай пропущен намеренно второй раз подряд — 15 существующих статей,
// включая pereezd-v-dubai-pod-klyuch-2026.md с тем же форматом сметы.
//
// Цифры — из живых данных калькулятора (таблица prices по city_id), не
// придуманы. Курс — ориентир ЦБ РФ на 16.09.2026 (lib/currency.ts):
// 1 $ ≈ 84,24 ₽, 1 € ≈ 97,3 ₽.
//
// Читает frontmatter из content/blog/*.md, пишет в blog_posts через raw REST
// с ретраями (тот же паттерн, что в seed-5-commercial-intent-sep-2026.mjs).
// cover_url берём из cities.unsplash_url там, где есть city_id; для
// country-level статей (city: null) обложка проставляется отдельным
// прогоном scripts/fill-blog-images.mjs после публикации.
//
// Запуск: node scripts/seed-10-commercial-intent-sep-2026.mjs --dry-run  (по умолчанию)
//         node scripts/seed-10-commercial-intent-sep-2026.mjs --live
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
  "skolko-nuzhno-deneg-na-pereezd-v-uzbekistan-2026": { city: "tashkent", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-argentinu-2026": { city: "buenos-aires", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-singapur-2026": { city: "singapore", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-tailand-2026": { city: null, country_slug: "thailand" },
  "skolko-nuzhno-deneg-na-pereezd-vo-vetnam-2026": { city: null, country_slug: "vietnam" },
  "skolko-nuzhno-deneg-na-pereezd-na-kipr-2026": { city: null, country_slug: "cyprus" },
  "limassol-ili-larnaka-gde-deshevle-zhit-2026": { city: "limassol", country_slug: null },
  "bangkok-ili-pattaya-gde-deshevle-zhit-2026": { city: "bangkok", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-podgoricu-2026": { city: "podgorica", country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-antaliyu-2026": { city: "antalya", country_slug: null },
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

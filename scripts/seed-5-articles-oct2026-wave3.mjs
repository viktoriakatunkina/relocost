// 5 новых SEO-статей — третья волна октября 2026, закрывающая города-сироты.
//
// Контекст: после волны 2 (26e9fa6) из 9 городов-сирот осталось 6: Ханья,
// Риека, Караганда, Кашкайш, Кос, Цетинье. Перед написанием — повторная
// проверка на дубли (city_id без единой статьи в blog_posts — подтверждено
// для всех 6 запросом к blog_posts.eq(city_id, ...), результат пустой
// массив по каждому) и явное подтверждение спроса через WebSearch для
// каждого города отдельно (не просто "город есть в каталоге").
//
// Результат проверки спроса:
//  - Ханья (chania) — подтверждено: Крит мега-популярен у русскоязычных,
//    Ханья — известный хаб цифровых кочевников (WorkHub coworking),
//    венецианская гавань, отдельные статьи tonkosti.ru/komandirovka.ru.
//  - Риека (rijeka) — подтверждено: Хорватия top relocation destination,
//    у Риеки отдельные англоязычные cost-of-living гайды (bookiscout.com:
//    rijeka-cost-guide/prices/apartments/seniors/vs-split/vs-zagreb),
//    статья aristipp.com "где жить в Хорватии".
//  - Караганда (karaganda) — подтверждено: Казахстан — топ-направление
//    релокации с 2022 (сотни тысяч переехавших, inform.kz), есть
//    выделенная русскоязычная статья "сколько стоит месяц жизни в
//    Караганде" (inform.kz), новости о ценах на жилье (kapital.kz).
//  - Кашкайш (cascais) — подтверждено: Португалия — один из главных хабов
//    русскоязычной эмиграции (meduza.io), Кашкайш — престижный приморский
//    район с международным сообществом, упоминается в контексте ВНЖ
//    (immigrantinvest.com), недвижимость на idealista.pt (русский раздел).
//  - Цетинье (cetinje) — подтверждено: Черногория — топ-направление,
//    прямое подтверждение "в Цетинье уже живут больше сотни русскоязычных
//    эмигрантов" (общий поиск по теме), общий спрос на бюджет Черногории
//    очень высокий (vc.ru, t-j.ru, habr.com).
//  - Кос (kos) — НЕ включен в эту волну. Целевые запросы вернули в основном
//    туристический контент и материалы про беженцев/мигрантов на острове,
//    а не релокацию; в подборках "лучшие греческие острова для переезда"
//    фигурируют Крит, Корфу, Парос — Кос не упоминается. Единственный
//    релокационный источник — relocatefrom.ru/greece/kos (конкурентная
//    страница, подтверждена через WebFetch), но самостоятельного
//    русскоязычного спроса (форумы, личный опыт, "лучшие острова"
//    подборки) не нашлось. Решение: не писать статью с придуманным
//    спросом, оставить Кос на будущее, если спрос появится.
//
// Цены пакетов проверены в lib/packages.ts перед написанием (budget=49₽,
// places=19₽, bundle=59₽, country_overview=29₽, country_cities=49₽) —
// не изменились с волны 2.
//
// Цифры бюджета — из таблицы prices по city_id каждого города (запрос
// по category rent/food/cafe/transport/utilities/health/communication/
// sports), не придуманы. Курс — тот же ориентир, что в волне 2: 1 € ≈ 95 ₽.
//
// Запуск: node scripts/seed-5-articles-oct2026-wave3.mjs --dry-run  (по умолчанию)
//         node scripts/seed-5-articles-oct2026-wave3.mjs --live
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
  "skolko-nuzhno-deneg-na-pereezd-v-khanyu-2026": { city: "chania", country_slug: "greece" },
  "skolko-nuzhno-deneg-na-pereezd-v-rieku-2026": { city: "rijeka", country_slug: "croatia" },
  "skolko-nuzhno-deneg-na-pereezd-v-karagandu-2026": { city: "karaganda", country_slug: "kazakhstan" },
  "skolko-nuzhno-deneg-na-pereezd-v-kashkaysh-2026": { city: "cascais", country_slug: "portugal" },
  "skolko-nuzhno-deneg-na-pereezd-v-cetinye-2026": { city: "cetinje", country_slug: "montenegro" },
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

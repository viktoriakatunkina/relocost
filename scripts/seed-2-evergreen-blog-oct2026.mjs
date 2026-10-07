// SEO-анализ Метрики (начало октября 2026) показал: топ-3 статьи блога дают
// 28% всего органического трафика — это новостная статистика ("сколько
// россиян уехало", "эмиграция 2026"), зависящая от новостного цикла и
// требующая ежегодного обновления. Риск концентрации — нужен второй эшелон
// evergreen-контента. Параллельно зафиксирован спрос по 161 длиннохвостой
// фразе "сколько нужно денег/стоит жизнь в [город]", который должен ловиться
// city-страницей с калькулятором, но перехватывается блогом, и раздел /list
// (14 подборок) почти не получает трафика (9 визитов/30 дней) — слабая
// перелинковка из блога.
//
// Эта волна — 2 evergreen-статьи, выбранные под оба наблюдения:
//
// 1) samye-teplye-strany-dlya-pereezda-reyting-2026 — рейтинг теплых стран
//    по среднегодовой температуре (не привязан к новостной статистике года).
//    Проверка по всем 14 слагам /list показала: ни одна статья блога не
//    ссылается на /list/teplye-strany (0 явных ссылок, тема "теплые страны"
//    по рейтингу температуры тоже не встречается в заголовках — в отличие от
//    do-80000-rubley и dlya-pensionerov, где тема уже многократно покрыта).
//    Числа по городам — реальный climateTemp() из lib/city-signals.ts,
//    посчитан напрямую по полю cities.climate (экспорт в scratchpad сессии).
//
// 2) skolko-nuzhno-deneg-na-pereezd-v-ulcin-2026 — бюджет переезда в Улцинь
//    (Черногория), город-сирота каталога: из 229 городов в cities 11 не
//    имели ни одной статьи блога с city_id (проверено запросом к blog_posts).
//    Улцинь выбран из 11 кандидатов (Банско, Брно, Кашкайш, Цетинье, Ханья,
//    Кос, Риека, Солнечный Берег, Удонтхани, Улцинь, Велигама) — у него
//    подтвержденный спрос в русскоязычных источниках (iworld.com,
//    chernogoriya-club.ru — реальные цифры по недвижимости и ВНЖ), визовый
//    режим проще большинства других кандидатов (безвиз 30 дней), и статья
//    закрывает очевидный пробел в уже существующей тройке Черногории —
//    "сколько нужно денег" по Котору и Бару уже есть, по Улциню не было.
//    Брно отклонен несмотря на city_id=null — у него уже 3 содержательных
//    DN-профиля (Red Hat, Mendel, Шпилберк) без city_id, что создало бы
//    риск дублирования фактов, а не реальное закрытие пробела.
//
// Цифры по Улциню — из таблицы prices по city_id города (экспорт в
// scratchpad сессии). Курс — ориентир ЦБ РФ: 1 $ ≈ 84,2 ₽.
//
// Запуск: node scripts/seed-2-evergreen-blog-oct2026.mjs --dry-run  (по умолчанию)
//         node scripts/seed-2-evergreen-blog-oct2026.mjs --live
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

// city: null => статья не привязана к одному городу (рейтинг по многим городам),
// используем только country_slug/city там, где это применимо.
const POSTS = {
  "samye-teplye-strany-dlya-pereezda-reyting-2026": { city: null, country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-ulcin-2026": { city: "ulcinj", country_slug: "montenegro" },
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
    tag: fm.tag ?? "Гайды и подборки",
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

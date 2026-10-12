// 5 новых SEO-статей — отдельная волна конкурентного анализа (октябрь
// 2026), независимая от волны 3bd0fe7 (Таиланд-налоги, Испания Golden Visa,
// Грузия брак, развод, дистанционное обучение) и от волн "wave2"/"wave3"
// (города-сироты: Банско/Брно/Герцлия/Стамбул/Баку и последующие). Тема
// «военный учет за границей» НЕ рассматривалась — решение по ней отложено
// Викторией, трогать не нужно.
//
// Процесс отбора (подробно — в финальном отчете агента в чате):
//  1. Экспорт всех 5246 заголовков/слагов blog_posts (offset-пагинация по
//     1000) в scratchpad для проверки дублей по смыслу, не только по slug.
//  2. 10 кандидатов проверены на: (а) отсутствие в блоге — grep по
//     заголовкам и полнотекстовый ILIKE по content_md; (б) реальный спрос и
//     актуальность — WebSearch по форумам/новостным агрегаторам/т-ж;
//     (в) фактчек дат и цифр — отдельные WebSearch на каждую цифру.
//  3. Отобраны 5: два свежих изменения визового режима 2026 года с точными
//     датами (Черногория, Казахстан), один межрегиональный бизнес-компаратив
//     (ОАЭ vs Турция — закрывает одновременно пробел «нет статьи про бизнес
//     в Турции» и явно запрошенный формат «направление vs направление»),
//     один межрегиональный визовый компаратив, который связывает новости
//     Черногории и Сербии со стабильностью Закавказья (Балканы vs
//     Закавказье — тоже явно запрошенный формат), и одна жизненная ситуация
//     с углом, которого не было в блоге (переезд ВО ВРЕМЯ беременности —
//     логистика, не «роды ради гражданства»: другая тема и другой
//     поисковый интент, чем уже опубликованные rody-za-rubezhom-2026 и
//     rody-za-granitsey-dlya-rossiyan-2026).
//
//     Отклонены после проверки (полный список 10 кандидатов — в отчете):
//     Сербия 90/180 отдельной статьей — решено не дублировать, факт уже
//     раскрыт внутри статьи про Балканы vs Закавказье; переезд пенсионной
//     пары — слишком близко к уже насыщенному кластеру статей про
//     пенсионеров (10+ статей), не нашли достаточно нового угла;
//     Азербайджан-Россия дипломатическая напряженность — отклонено по той
//     же логике, что и военный учет: политически чувствительная тема,
//     выходит за рамки позиционирования калькулятора стоимости жизни.
//
// Числа: цены пакетов сверены в lib/packages.ts НЕПОСРЕДСТВЕННО перед
// написанием — не изменились с прошлой волны (places=19₽, budget=49₽,
// bundle=59₽, country_overview=29₽, country_cities=49₽). Все факты по
// визам/датам/налогам — из WebSearch (Новая газета, T-J, Коммерсантъ,
// aif.ru, tengrinews, источники по корпоративному налогу Турции/ОАЭ) — см.
// источники в финальном отчете агента, не выдуманы.
//
// Запуск: node scripts/seed-5-articles-oct2026-visa-process-wave.mjs --dry-run  (по умолчанию)
//         node scripts/seed-5-articles-oct2026-visa-process-wave.mjs --live
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

// city: null => статья не привязана к одному городу (страновая/межстрановая/
// межрегиональная тема). country_slug берется напрямую, без обязательной
// привязки к городу. Cover у всех пяти уже прописан в frontmatter .md (взят
// из существующих city.unsplash_url — Котор, Алматы, Дубай, Тбилиси — и из
// уже опубликованного cover rody-za-rubezhom-2026, чтобы не делать новых
// запросов к Unsplash API сверх дневного лимита), поэтому meta.city здесь
// не используется для подмены cover — только как потенциальный city_id
// (везде null, все пять тем страновые/межрегиональные, а не про один город).
const POSTS = {
  "chernogoriya-viza-dlya-rossiyan-s-1-noyabrya-2026": { city: null, country_slug: "montenegro" },
  "kazahstan-qazeta-elektronnoe-razreshenie-2026": { city: null, country_slug: "kazakhstan" },
  "oae-ili-turtsiya-dlya-biznesa-2026": { city: null, country_slug: null },
  "balkany-ili-zakavkazye-bezviz-2026": { city: null, country_slug: null },
  "pereezd-vo-vremya-beremennosti-2026": { city: null, country_slug: null },
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
  // Тело оставляем КАК ЕСТЬ, включая ведущий "# Заголовок" — шаблон страницы
  // блога убирает дублирующийся <h1> при рендере (см. прошлую волну,
  // app/[locale]/blog/[slug]/page.tsx).
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
    tag: fm.tag ?? "Гайды и подборки",
    read_time: parseInt(fm.reading_time ?? "11", 10),
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

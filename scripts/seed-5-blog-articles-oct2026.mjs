// SEO-аудит блока "AI Marketing/контент" (начало октября 2026): 28% органики
// блога концентрируется в топ-3 новостных статьях (зависят от ежегодного
// обновления статистики эмиграции), а evergreen-контент — второй эшелон —
// недостаточен. Параллельно: /list (14 подборок) почти не получает трафика
// из-за слабой перелинковки из блога, а 231-city каталог содержит города без
// единой статьи с их city_id.
//
// Эта волна — 5 статей, закрывающих оба наблюдения с проверкой дублей ПЕРЕД
// написанием (запрос к blog_posts по заголовкам/content_md):
//
// 1) kuda-pereekhat-aytishniku-reyting-gorodov-2026 — фидер /list/dlya-ayti.
//    Проверка по всем 14 слагам /list показала 4 подборки с нулём входящих
//    ссылок из блога: do-80000-rubley, dlya-ayti, evropa, dlya-pensionerov.
//    Из них dlya-pensionerov и evropa отклонены — по содержанию они уже
//    фактически покрыты существующими статьями (kuda-pereekhat-pensioneru-
//    sravnenie-gorodov-2026 — таблица 10 городов по медицине/климату/визе,
//    практически готовый фидер без ссылки; evropa — 4+ статьи сравнения цен
//    по Европе). Писать туда заново — риск дублирования, а не реальное
//    закрытие пробела. dlya-ayti — чистый пробел: единственная близкая статья
//    (top-stran-dlya-itishnikov-2026) сравнивает страны по налогам/зарплатам,
//    а не города по бюджету IT-инфраструктуры — угол другой.
//    Данные — реальный живой рейтинг /list/dlya-ayti (itScore из lib/lists.ts),
//    30 городов с monthly_from, выгружено прямым запросом к продакшену.
//
// 2) kuda-pereekhat-s-byudzhetom-50000-80000-reyting-gorodov-2026 — фидер
//    /list/do-80000-rubley. Старая статья kuda-pereekhat-s-budzhetom-80000
//    покрывает близкую тему (7 стран, курс 90-95 ₽/$, без привязки к городам
//    каталога) — риск учтён, новая статья явно ссылается на старую как на
//    "общий обзор по странам" и даёт другой, более узкий угол: конкретные
//    города каталога Relocost, бюджет именно 50-80к (не "до 80к"), курс и
//    цифры 2026 года. Данные — реальный живой рейтинг /list/do-80000-rubley,
//    30 городов с monthly_from.
//
// 3-5) skolko-nuzhno-deneg-na-pereezd-v-{udonthani,solnechnyy-bereg,veligamu}
//    — города-сироты каталога (city_id без единой статьи блога). Из 12
//    городов без статьи (bansko, brno, cascais, cetinje, chania, herzliya,
//    karaganda, kos, rijeka, sunny-beach, udon-thani, weligama) выбраны три
//    с подтверждённым через WebSearch спросом:
//    — Удонтхани: устойчивый англоязычный спрос как "дешёвая альтернатива
//      Паттайе/Чиангмаю для пенсионеров" (expatexchange.com и аналоги),
//      город десятилетиями принимает иностранных пенсионеров.
//    — Солнечный Берег: спрос в русскоязычных источниках (cian.ru, prian.ru)
//      как самый доступный болгарский курорт для пенсионеров; отдельно
//      проверен и зафиксирован переход Болгарии на евро и полноценный Шенген
//      с 2026 года (устаревшая информация о безвизе — частая ошибка в сети).
//    — Велигама: растущий серф/коливинг-хаб Шри-Ланки, подтверждён спрос на
//      тему через T—Ж и профильные турагрегаторы; при этом в блоге она
//      упоминалась только проездом в статьях про Галле — не было отдельного
//      бюджета. Банско, Цетинье, Риека, Кос, Херцлия, Караганда, Кашкайш —
//      рассмотрены и отложены (ниже подтверждённый спрос или свежая
//      карточка города без явного дефицита контента).
//    Цифры — из таблицы prices по city_id каждого города (72 строки на
//    город), курс ЦБ РФ на начало октября 2026: ~83,5 ₽/$, ~94,5 ₽/€.
//
// Запуск: node scripts/seed-5-blog-articles-oct2026.mjs --dry-run  (по умолчанию)
//         node scripts/seed-5-blog-articles-oct2026.mjs --live
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

// city: null => статья не привязана к одному городу (рейтинг по многим городам).
const POSTS = {
  "kuda-pereekhat-aytishniku-reyting-gorodov-2026": { city: null, country_slug: null },
  "kuda-pereekhat-s-byudzhetom-50000-80000-reyting-gorodov-2026": { city: null, country_slug: null },
  "skolko-nuzhno-deneg-na-pereezd-v-udonthani-2026": { city: "udon-thani", country_slug: "thailand" },
  "skolko-nuzhno-deneg-na-pereezd-v-solnechnyy-bereg-2026": { city: "sunny-beach", country_slug: "bulgaria" },
  "skolko-nuzhno-deneg-na-pereezd-v-veligamu-2026": { city: "weligama", country_slug: "sri-lanka" },
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

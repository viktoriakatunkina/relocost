// Личный опыт от первого лица: батчи 2–5 (статьи 6–25).
// Читает .md файлы из content/blog/ и вставляет в blog_posts (Supabase).
// Запуск: node scripts/seed-blog-personal-2to5.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${HOME}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const BLOG_DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

// Метаданные для каждой статьи. content_file — имя .md файла.
// parseFile читает SEO_TITLE / SEO_DESCRIPTION / READ_TIME из шапки файла.
const META = [
  // Батч 2 (статьи 6–10)
  {
    slug: "istanbul-kadikoy-1200-euro-inflyatsiya",
    title: "Стамбул, Кадыкёй: €1200 в месяц и жизнь в условиях инфляции",
    tag: "Личный опыт",
    country_slug: "turkey",
    city_slug: "istanbul",
    unsplash_query: "istanbul kadikoy bosphorus ferry",
    content_file: "istanbul-kadikoy-1200-euro-inflyatsiya.md",
  },
  {
    slug: "varshava-it-specialist-1800-euro",
    title: "Варшава: IT-специалист, €1800 в месяц — реальный бюджет переезда",
    tag: "Личный опыт",
    country_slug: "poland",
    city_slug: "warsaw",
    unsplash_query: "warsaw poland old town city",
    content_file: "varshava-it-specialist-1800-euro.md",
  },
  {
    slug: "praga-ip-frilanser-1600-euro",
    title: "Прага: как открыли ИП, €1600 в месяц — личный опыт",
    tag: "Личный опыт",
    country_slug: "czech-republic",
    city_slug: "prague",
    unsplash_query: "prague czech republic bridge old town",
    content_file: "praga-ip-frilanser-1600-euro.md",
  },
  {
    slug: "almaty-vozvrat-iz-es-450-tenge",
    title: "Алматы: возвратная миграция из ЕС, ₸450 000 в месяц — личный опыт",
    tag: "Личный опыт",
    country_slug: "kazakhstan",
    city_slug: "almaty",
    unsplash_query: "almaty kazakhstan mountains city skyline",
    content_file: "almaty-vozvrat-iz-es-450-tenge.md",
  },
  {
    slug: "lissabon-viza-d7-2200-euro",
    title: "Лиссабон: виза D7 для удаленщика, €2200 в месяц",
    tag: "Личный опыт",
    country_slug: "portugal",
    city_slug: "lisbon",
    unsplash_query: "lisbon portugal tram streets alfama",
    content_file: "lissabon-viza-d7-2200-euro.md",
  },
  // Батч 3 (статьи 11–15)
  {
    slug: "barselona-studentka-1700-euro",
    title: "Барселона: студентка, €1700 в месяц — жизнь на учебной визе",
    tag: "Личный опыт",
    country_slug: "spain",
    city_slug: "barcelona",
    unsplash_query: "barcelona spain sagrada familia streets",
    content_file: "barselona-studentka-1700-euro.md",
  },
  {
    slug: "budapesht-pensionery-1100-euro",
    title: "Будапешт: пенсионеры, €1100 в месяц — жизнь двух человек",
    tag: "Личный опыт",
    country_slug: "hungary",
    city_slug: "budapest",
    unsplash_query: "budapest hungary danube parliament building",
    content_file: "budapesht-pensionery-1100-euro.md",
  },
  {
    slug: "kip-limasol-semya-koshki-2000-euro",
    title: "Кипр, Лимассол: семья с двумя кошками, €2000 в месяц",
    tag: "Личный опыт",
    country_slug: "cyprus",
    city_slug: "limassol",
    unsplash_query: "limassol cyprus mediterranean sea promenade",
    content_file: "kip-limasol-semya-koshki-2000-euro.md",
  },
  {
    slug: "chernogoriya-budva-udalenka-900-euro",
    title: "Черногория, Будва: удаленщик, €900 в месяц — реальная жизнь вне сезона",
    tag: "Личный опыт",
    country_slug: "montenegro",
    city_slug: "budva",
    unsplash_query: "budva montenegro adriatic sea old town",
    content_file: "chernogoriya-budva-udalenka-900-euro.md",
  },
  {
    slug: "bangkok-tsifrovoy-kochevnik-1100-dollar",
    title: "Бангкок: цифровой кочевник, $1100 в месяц — реальные расходы 2024",
    tag: "Личный опыт",
    country_slug: "thailand",
    city_slug: "bangkok",
    unsplash_query: "bangkok thailand skyline night street food",
    content_file: "bangkok-tsifrovoy-kochevnik-1100-dollar.md",
  },
  // Батч 4 (статьи 16–20)
  {
    slug: "kuala-lumpur-semya-1500-dollar",
    title: "Куала-Лумпур: семья из трех человек, $1500 в месяц",
    tag: "Личный опыт",
    country_slug: "malaysia",
    city_slug: null,
    unsplash_query: "kuala lumpur malaysia petronas towers city",
    content_file: "kuala-lumpur-semya-1500-dollar.md",
  },
  {
    slug: "vena-studentka-1900-euro",
    title: "Вена: студентка, €1900 в месяц — жизнь в самом комфортном городе мира",
    tag: "Личный опыт",
    country_slug: "austria",
    city_slug: null,
    unsplash_query: "vienna austria stephansplatz buildings classical",
    content_file: "vena-studentka-1900-euro.md",
  },
  {
    slug: "berlin-bez-nemetskogo-2400-euro",
    title: "Берлин без знания немецкого: €2400 в месяц — реальный опыт 2023",
    tag: "Личный опыт",
    country_slug: "germany",
    city_slug: null,
    unsplash_query: "berlin germany brandenburger tor streets",
    content_file: "berlin-bez-nemetskogo-2400-euro.md",
  },
  {
    slug: "mehiko-gorod-1200-dollar-bezopasnost",
    title: "Мехико: $1200 в месяц — жизнь и вопрос о безопасности",
    tag: "Личный опыт",
    country_slug: null,
    city_slug: null,
    unsplash_query: "mexico city cdmx roma condesa streets",
    content_file: "mehiko-gorod-1200-dollar-bezopasnost.md",
  },
  {
    slug: "tel-aviv-do-i-posle-2023-15000-shekel",
    title: "Тель-Авив: жизнь до и после октября 2023 года, ₪15 000 в месяц",
    tag: "Личный опыт",
    country_slug: null,
    city_slug: null,
    unsplash_query: "tel aviv israel beach promenade city",
    content_file: "tel-aviv-do-i-posle-2023-15000-shekel.md",
  },
  // Батч 5 (статьи 21–25)
  {
    slug: "amsterdam-programmist-3000-euro",
    title: "Амстердам: программист, €3000 в месяц — честный разговор о ценах",
    tag: "Личный опыт",
    country_slug: "netherlands",
    city_slug: null,
    unsplash_query: "amsterdam netherlands canals bicycles flowers",
    content_file: "amsterdam-programmist-3000-euro.md",
  },
  {
    slug: "tirana-samyy-deshevyy-evropa-750-euro",
    title: "Тирана: самый дешевый выбор в Европе, €750 в месяц",
    tag: "Личный опыт",
    country_slug: "albania",
    city_slug: null,
    unsplash_query: "tirana albania blloku cafe street",
    content_file: "tirana-samyy-deshevyy-evropa-750-euro.md",
  },
  {
    slug: "pafos-kip-zhizn-u-morya-1400-euro",
    title: "Пафос, Кипр: жизнь у моря, €1400 в месяц — тихий вариант острова",
    tag: "Личный опыт",
    country_slug: "cyprus",
    city_slug: null,
    unsplash_query: "paphos cyprus sea sunset coast",
    content_file: "pafos-kip-zhizn-u-morya-1400-euro.md",
  },
  {
    slug: "bishkek-neozhidanno-komfortno-55000-rub",
    title: "Бишкек: неожиданно комфортно, ₽55 000 в месяц — откровенный отчет",
    tag: "Личный опыт",
    country_slug: "kyrgyzstan",
    city_slug: null,
    unsplash_query: "bishkek kyrgyzstan mountains city streets",
    content_file: "bishkek-neozhidanno-komfortno-55000-rub.md",
  },
  {
    slug: "yerevan-cherez-god-pereotsenka",
    title: "Ереван через год: честная переоценка — что изменилось в 2024",
    tag: "Личный опыт",
    country_slug: "armenia",
    city_slug: "yerevan",
    unsplash_query: "yerevan armenia ararat mountain city",
    content_file: "yerevan-cherez-god-pereotsenka.md",
  },
];

function parseFile(filename) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error(`нет маркера ---CONTENT--- в ${filename}`);
  const header = text.slice(0, marker);
  const body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  readTime = Math.max(4, Math.min(8, readTime || 5));
  return { seoTitle, seoDesc, readTime, contentMd: body };
}

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    cover_unsplash_id: pick.id,
    cover_url: pick.urls.raw,
    cover_author_name: pick.user.name,
    cover_author_url: pick.user.links.html,
  };
}

async function run() {
  const base = Date.now();
  let added = 0;
  let skipped = 0;
  for (let i = 0; i < META.length; i++) {
    const m = META[i];
    // Проверяем, существует ли уже
    const { data: existing } = await sb.from("blog_posts").select("id").eq("slug", m.slug).maybeSingle();
    if (existing) { console.log(`skip (exists): ${m.slug}`); skipped++; continue; }

    // Читаем .md файл
    let parsed;
    try { parsed = parseFile(m.content_file); } catch (e) {
      console.error(`FAIL read ${m.content_file}: ${e.message}`); continue;
    }

    // Получаем обложку
    let cover = null;
    try { cover = await fetchUnsplash(m.unsplash_query); } catch (e) {
      console.warn(`unsplash failed ${m.slug}: ${e.message}`);
    }

    const createdAt = new Date(base - i * 3600 * 1000).toISOString();
    const row = {
      title: m.title,
      slug: m.slug,
      tag: m.tag,
      read_time: parsed.readTime,
      content_md: parsed.contentMd,
      seo_title: parsed.seoTitle,
      seo_description: parsed.seoDesc,
      country_slug: m.country_slug ?? null,
      city_id: null,
      cover_unsplash_id: cover?.cover_unsplash_id ?? null,
      cover_url: cover?.cover_url ?? null,
      cover_author_name: cover?.cover_author_name ?? null,
      cover_author_url: cover?.cover_author_url ?? null,
      published: true,
      created_at: createdAt,
    };
    const { error } = await sb.from("blog_posts").insert(row);
    if (error) throw new Error(`insert ${m.slug}: ${error.message}`);
    added++;
    console.log(`+ ${m.slug}${cover ? " + cover" : ""}`);
  }
  console.log(`\ndone. added ${added}/${META.length}, skipped ${skipped}`);
}

run().catch((e) => { console.error(e); process.exit(1); });

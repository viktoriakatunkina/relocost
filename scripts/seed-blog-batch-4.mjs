// Сеет 30 новых SEO-статей из content/blog/*.md в таблицу blog_posts (upsert по slug).
//  • title / tag / slug / city / country / coverQuery — из META ниже (контролируем мы).
//  • seo_title / seo_description / read_time / content_md — из .md файла.
//  • Обложка: для статьи с city копируется из cities, иначе — 1 запрос к Unsplash по coverQuery.
//  • country_slug: из города (если city) либо из META (country).
//  • created_at разносится по минуте, порядок META = порядок в ленте (новые сверху).
// Идемпотентно: повторный запуск обновляет существующие строки по slug.
// Обложки Unsplash здесь — raw-URL; после прогона запусти
//   node scripts/migrate-photos-to-storage.mjs
// чтобы перенести их в Supabase Storage (images.unsplash.com недоступен с VPS).
// Запуск: node scripts/seed-blog-batch-4.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(HOME, ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

// Порядок = порядок публикации (новые сверху). city — slug города (или null).
// country — country_slug (или null). coverQuery — запрос к Unsplash для статей без города.
const META = [
  // --- Города-гайды (обложка из профиля города) ---
  { slug: "kak-pereekhat-v-budapesht-2026", title: "Как переехать в Будапешт: пошаговая инструкция 2026", tag: "Гайд", city: "budapest", country: "hungary" },
  { slug: "kak-pereekhat-v-podgoritsu-2026", title: "Как переехать в Подгорицу: пошаговая инструкция 2026", tag: "Гайд", city: "podgorica", country: "montenegro" },
  { slug: "kak-pereekhat-v-valensiyu-2026", title: "Как переехать в Валенсию: пошаговая инструкция 2026", tag: "Гайд", city: "valencia", country: "spain" },
  { slug: "kak-pereekhat-v-astanu-2026", title: "Как переехать в Астану: пошаговая инструкция 2026", tag: "Гайд", city: "astana", country: "kazakhstan" },
  { slug: "kak-pereekhat-v-porto-2026", title: "Как переехать в Порту: пошаговая инструкция 2026", tag: "Гайд", city: "porto", country: "portugal" },
  { slug: "kak-pereekhat-v-bodrum-2026", title: "Как переехать в Бодрум: пошаговая инструкция 2026", tag: "Гайд", city: "bodrum", country: "turkey" },
  { slug: "kak-pereekhat-v-kutaisi-2026", title: "Как переехать в Кутаиси: пошаговая инструкция 2026", tag: "Гайд", city: "kutaisi", country: "georgia" },
  { slug: "kak-pereekhat-v-pafos-2026", title: "Как переехать в Пафос: пошаговая инструкция 2026", tag: "Гайд", city: "paphos", country: "cyprus" },
  { slug: "kak-pereekhat-v-danang-2026", title: "Как переехать в Дананг: пошаговая инструкция 2026", tag: "Гайд", city: "da-nang", country: "vietnam" },
  { slug: "kak-pereekhat-v-tivat-2026", title: "Как переехать в Тиват: пошаговая инструкция 2026", tag: "Гайд", city: "tivat", country: "montenegro" },

  // --- Сравнения (мульти-страна, обложка из Unsplash) ---
  { slug: "tailand-ili-vietnam-2026", title: "Таиланд или Вьетнам: где удаленщику жить лучше в 2026", tag: "Сравнение", city: null, country: null, coverQuery: "vietnam thailand tropical beach" },
  { slug: "ispaniya-ili-portugaliya-2026", title: "Испания или Португалия: что выбрать для переезда в 2026", tag: "Сравнение", city: null, country: null, coverQuery: "spain portugal europe old town" },
  { slug: "serbiya-ili-chernogoriya-2026", title: "Сербия или Черногория: где осесть россиянину в 2026", tag: "Сравнение", city: null, country: null, coverQuery: "montenegro balkans coastal town" },
  { slug: "bali-ili-vietnam-2026", title: "Бали или Вьетнам: куда переехать удаленщику в 2026", tag: "Сравнение", city: null, country: null, coverQuery: "bali rice terrace tropical" },
  { slug: "kipr-ili-turtsiya-2026", title: "Кипр или Турция: где жить у моря в 2026", tag: "Сравнение", city: null, country: null, coverQuery: "cyprus mediterranean sea coast" },

  // --- Визы (привязка к стране, обложка из Unsplash) ---
  { slug: "nomad-viza-horvatii-2026", title: "Виза цифрового кочевника Хорватии в 2026", tag: "Визы", city: null, country: "croatia", coverQuery: "croatia dubrovnik adriatic coast" },
  { slug: "vnzh-bolgarii-2026", title: "ВНЖ Болгарии в 2026: виза D и основания", tag: "Визы", city: null, country: "bulgaria", coverQuery: "sofia bulgaria city center" },
  { slug: "zhivnostensky-list-chehii-2026", title: "Живностенский лист Чехии в 2026: ВНЖ через ИП", tag: "Визы", city: null, country: "czech-republic", coverQuery: "prague czech old town" },
  { slug: "bezviz-albaniya-god-2026", title: "Албания для россиян в 2026: год без визы", tag: "Визы", city: null, country: "albania", coverQuery: "albania riviera coast town" },
  { slug: "rezidentskaya-viza-meksiki-2026", title: "Резидентская виза Мексики в 2026 для россиян", tag: "Визы", city: null, country: "mexico", coverQuery: "mexico colorful colonial street" },

  // --- Деньги ---
  { slug: "schet-v-banke-serbii-2026", title: "Как открыть счет в банке Сербии в 2026", tag: "Деньги", city: null, country: "serbia", coverQuery: "belgrade serbia city architecture" },
  { slug: "schet-v-banke-turtsii-2026", title: "Как открыть счет в банке Турции в 2026", tag: "Деньги", city: null, country: "turkey", coverQuery: "istanbul turkey finance city" },
  { slug: "wise-i-alternativy-dlya-relokanta-2026", title: "Wise и альтернативы для релоканта в 2026", tag: "Деньги", city: null, country: null, coverQuery: "fintech mobile banking phone app" },
  { slug: "kak-prinimat-oplatu-ot-rf-klientov-2026", title: "Как принимать оплату от РФ-клиентов из-за границы в 2026", tag: "Деньги", city: null, country: null, coverQuery: "freelancer laptop payment desk" },

  // --- Быт / гайды без привязки ---
  { slug: "kak-vyuchit-yazyk-pered-pereezdom-2026", title: "Как выучить язык перед переездом в 2026", tag: "Гайд", city: null, country: null, coverQuery: "language learning study books" },
  { slug: "apostil-i-legalizatsiya-dokumentov-2026", title: "Апостиль и легализация документов в 2026", tag: "Гайд", city: null, country: null, coverQuery: "official documents stamp paperwork" },
  { slug: "nostrifikatsiya-diploma-za-granitsey-2026", title: "Нострификация диплома за границей в 2026", tag: "Гайд", city: null, country: null, coverQuery: "university diploma graduation" },
  { slug: "kak-otkryt-kompaniyu-za-granitsey-2026", title: "Как открыть компанию за границей в 2026", tag: "Гайд", city: null, country: null, coverQuery: "business office meeting startup" },

  // --- Подборки ---
  { slug: "strany-s-prostym-vnzh-dlya-rossiyan-2026", title: "Страны с простым ВНЖ для россиян в 2026", tag: "Подборка", city: null, country: null, coverQuery: "passport world map residence" },
  { slug: "luchshie-goroda-u-morya-dlya-zhizni-2026", title: "Лучшие города у моря для жизни в 2026", tag: "Подборка", city: null, country: null, coverQuery: "seaside mediterranean coastal town" },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  body = body.replace(/^#\s+.*\n+/, ""); // убрать случайный H1
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  readTime = Math.max(4, Math.min(9, readTime || 6));
  return { seoTitle, seoDesc, readTime, body, words };
}

async function fetchCover(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return {
    cover_unsplash_id: p.id,
    cover_url: p.urls.raw,
    cover_author_name: p.user.name,
    cover_author_url: p.user.links.html,
  };
}

// Карта городов: slug -> {id, country_slug, обложка}
const { data: cities, error: cErr } = await sb
  .from("cities")
  .select("id, slug, country_slug, unsplash_url, unsplash_author_name, unsplash_author_url");
if (cErr) throw cErr;
const cityBySlug = new Map((cities || []).map((c) => [c.slug, c]));

const base = Date.now();
let ok = 0, fail = 0;
for (let i = 0; i < META.length; i++) {
  const m = META[i];
  const file = path.join(DIR, `${m.slug}.md`);
  if (!fs.existsSync(file)) {
    console.error(`✗ ${m.slug}: файл не найден, пропуск`);
    fail++;
    continue;
  }
  let parsed;
  try {
    parsed = parseArticle(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`✗ ${m.slug}: ${e.message}`);
    fail++;
    continue;
  }

  // Обложка + city_id + country_slug
  let cover = {};
  let cityId = null;
  let countrySlug = m.country ?? null;
  if (m.city) {
    const c = cityBySlug.get(m.city);
    if (!c) {
      console.error(`  ~ ${m.slug}: город ${m.city} не найден в cities`);
    } else {
      cityId = c.id;
      countrySlug = c.country_slug ?? countrySlug;
      if (c.unsplash_url) {
        cover = {
          cover_url: c.unsplash_url,
          cover_author_name: c.unsplash_author_name,
          cover_author_url: c.unsplash_author_url,
        };
      }
    }
  } else if (m.coverQuery) {
    try {
      const co = await fetchCover(m.coverQuery);
      if (co) cover = co;
    } catch (e) {
      console.error(`  ~ ${m.slug}: обложка не получена (${e.message})`);
    }
  }

  const row = {
    slug: m.slug,
    title: m.title,
    tag: m.tag,
    city_id: cityId,
    country_slug: countrySlug,
    read_time: parsed.readTime,
    content_md: parsed.body,
    seo_title: parsed.seoTitle,
    seo_description: parsed.seoDesc,
    published: true,
    created_at: new Date(base - i * 60 * 1000).toISOString(),
    ...cover,
  };

  const { error: upErr } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (upErr) {
    console.error(`✗ ${m.slug}: upsert — ${upErr.message}`);
    fail++;
    continue;
  }
  console.log(`✓ ${m.slug} — ${parsed.words} сл, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : "нет"}, city:${m.city || "—"}, country:${countrySlug || "—"}`);
  ok++;
}

console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);

// Сеет 10 новых SEO-статей (batch 5) из content/blog/*.md в таблицу blog_posts (upsert по slug).
//  • title / tag / slug / city / country / coverQuery — из META ниже (контролируем мы).
//  • seo_title / seo_description / read_time / content_md — из .md файла.
//  • Обложка: для статьи с city копируется из cities, иначе — 1 запрос к Unsplash по coverQuery.
//  • country_slug: из города (если city) либо из META (country).
//  • created_at разносится по минуте, порядок META = порядок в ленте (новые сверху).
// Идемпотентно: повторный запуск обновляет существующие строки по slug.
// Обложки Unsplash здесь — raw-URL; после прогона запусти
//   node scripts/migrate-photos-to-storage.mjs
// чтобы перенести их в Supabase Storage (images.unsplash.com недоступен с VPS).
// Запуск: node scripts/seed-blog-batch-5.mjs
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
  // --- Деньги ---
  { slug: "schet-v-banke-uzbekistana-2026", title: "Как открыть счет в банке Узбекистана в 2026: Humo, UZCARD и Visa", tag: "Деньги", city: null, country: "uzbekistan", coverQuery: "tashkent uzbekistan bank finance city" },
  { slug: "schet-v-banke-tailanda-2026", title: "Как открыть счет в банке Таиланда в 2026: Bangkok Bank и Kasikorn", tag: "Деньги", city: null, country: "thailand", coverQuery: "bangkok thailand bank skyline finance" },
  { slug: "nalog-na-samozanyatost-za-granitsey-2026", title: "Самозанятость и НПД при жизни за границей в 2026", tag: "Деньги", city: null, country: null, coverQuery: "freelancer laptop tax documents desk" },

  // --- Города-гайды (обложка из профиля города) ---
  { slug: "kak-pereekhat-v-seoul-2026", title: "Как переехать в Сеул в 2026: визы Кореи, жилье, цены", tag: "Гайд", city: "seoul", country: "south-korea" },
  { slug: "kak-pereekhat-v-hoshimin-2026", title: "Как переехать в Хошимин в 2026: визы Вьетнама, жилье, бюджет", tag: "Гайд", city: "ho-chi-minh", country: "vietnam" },
  { slug: "kak-pereekhat-v-afiny-2026", title: "Как переехать в Афины в 2026: ВНЖ Греции, жилье, цены", tag: "Гайд", city: "athens", country: "greece" },

  // --- Визы ---
  { slug: "rezidentskie-vizy-bahrein-oman-katar-2026", title: "Резидентские визы Бахрейна, Омана и Катара в 2026 для россиян", tag: "Визы", city: null, country: null, coverQuery: "persian gulf city skyline middle east" },

  // --- Деньги / Гайд по Азии ---
  { slug: "kak-snimat-nalichnye-v-azii-2026", title: "Как снимать и привозить наличные в Азии в 2026: Бали, Таиланд, Вьетнам", tag: "Деньги", city: null, country: null, coverQuery: "atm cash money asia street" },
  { slug: "mobilnaya-svyaz-internet-v-azii-2026", title: "Мобильная связь и интернет в Азии в 2026: Таиланд, Вьетнам, Бали", tag: "Гайд", city: null, country: null, coverQuery: "sim card smartphone asia street" },

  // --- Сравнение ---
  { slug: "gruziya-ili-armeniya-2026", title: "Грузия или Армения: где удаленщику жить дешевле в 2026", tag: "Сравнение", city: null, country: "georgia", coverQuery: "tbilisi yerevan caucasus old town" },
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

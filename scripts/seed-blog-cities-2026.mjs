// Сеет 30 SEO-статей-гайдов «Как переехать в <город>» из content/blog/*.md в blog_posts (upsert по slug).
//  • title / tag / slug / city — из META ниже (контролируем мы).
//  • seo_title / seo_description / read_time / content_md — из .md файла.
//  • Обложка: копируется из города (cities.unsplash_url); если у города фото нет — 1 запрос к Unsplash по названию.
//  • created_at — убывающим шагом, чтобы новые статьи шли сверху списка /blog в предсказуемом порядке.
// Идемпотентно: повторный запуск обновляет существующие строки по slug.
// Запуск: node scripts/seed-blog-cities-2026.mjs
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

// city — slug города в таблице cities (обязателен: даёт city_id для калькулятора сбоку и обложку).
// coverQuery — fallback к Unsplash, если у города нет фото.
const META = [
  { slug: "kak-pereekhat-v-madrid-2026", title: "Как переехать в Мадрид: пошаговая инструкция 2026", tag: "Гайд", city: "madrid", coverQuery: "madrid spain city" },
  { slug: "kak-pereekhat-v-malagu-2026", title: "Как переехать в Малагу: пошаговая инструкция 2026", tag: "Гайд", city: "malaga", coverQuery: "malaga spain coast" },
  { slug: "kak-pereekhat-v-sevilyu-2026", title: "Как переехать в Севилью: пошаговая инструкция 2026", tag: "Гайд", city: "seville", coverQuery: "seville spain city" },
  { slug: "kak-pereekhat-v-split-2026", title: "Как переехать в Сплит: пошаговая инструкция 2026", tag: "Гайд", city: "split", coverQuery: "split croatia coast" },
  { slug: "kak-pereekhat-v-dubrovnik-2026", title: "Как переехать в Дубровник: пошаговая инструкция 2026", tag: "Гайд", city: "dubrovnik", coverQuery: "dubrovnik croatia old town" },
  { slug: "kak-pereekhat-v-ankaru-2026", title: "Как переехать в Анкару: пошаговая инструкция 2026", tag: "Гайд", city: "ankara", coverQuery: "ankara turkey city" },
  { slug: "kak-pereekhat-v-izmir-2026", title: "Как переехать в Измир: пошаговая инструкция 2026", tag: "Гайд", city: "izmir", coverQuery: "izmir turkey bay" },
  { slug: "kak-pereekhat-v-fethiye-2026", title: "Как переехать в Фетхие: пошаговая инструкция 2026", tag: "Гайд", city: "fethiye", coverQuery: "fethiye turkey marina" },
  { slug: "kak-pereekhat-v-saloniki-2026", title: "Как переехать в Салоники: пошаговая инструкция 2026", tag: "Гайд", city: "thessaloniki", coverQuery: "thessaloniki greece waterfront" },
  { slug: "kak-pereekhat-v-iraklion-2026", title: "Как переехать в Ираклион: пошаговая инструкция 2026", tag: "Гайд", city: "heraklion", coverQuery: "heraklion crete greece" },
  { slug: "kak-pereekhat-v-hanoy-2026", title: "Как переехать в Ханой: пошаговая инструкция 2026", tag: "Гайд", city: "hanoi", coverQuery: "hanoi vietnam city" },
  { slug: "kak-pereekhat-na-fukuok-2026", title: "Как переехать на Фукуок: пошаговая инструкция 2026", tag: "Гайд", city: "phu-quoc", coverQuery: "phu quoc vietnam island beach" },
  { slug: "kak-pereekhat-v-krabi-2026", title: "Как переехать в Краби: пошаговая инструкция 2026", tag: "Гайд", city: "krabi", coverQuery: "krabi thailand cliffs beach" },
  { slug: "kak-pereekhat-na-samui-2026", title: "Как переехать на Самуи: пошаговая инструкция 2026", tag: "Гайд", city: "samui", coverQuery: "koh samui thailand beach" },
  { slug: "kak-pereekhat-v-dzhakartu-2026", title: "Как переехать в Джакарту: пошаговая инструкция 2026", tag: "Гайд", city: "jakarta", coverQuery: "jakarta indonesia skyline" },
  { slug: "kak-pereekhat-v-abu-dabi-2026", title: "Как переехать в Абу-Даби: пошаговая инструкция 2026", tag: "Гайд", city: "abu-dhabi", coverQuery: "abu dhabi uae skyline" },
  { slug: "kak-pereekhat-v-shardzhu-2026", title: "Как переехать в Шарджу: пошаговая инструкция 2026", tag: "Гайд", city: "sharjah", coverQuery: "sharjah uae city" },
  { slug: "kak-pereekhat-v-dohu-2026", title: "Как переехать в Доху: пошаговая инструкция 2026", tag: "Гайд", city: "doha", coverQuery: "doha qatar skyline" },
  { slug: "kak-pereekhat-v-maskat-2026", title: "Как переехать в Маскат: пошаговая инструкция 2026", tag: "Гайд", city: "muscat", coverQuery: "muscat oman city" },
  { slug: "kak-pereekhat-v-amman-2026", title: "Как переехать в Амман: пошаговая инструкция 2026", tag: "Гайд", city: "amman", coverQuery: "amman jordan city" },
  { slug: "kak-pereekhat-v-larnaku-2026", title: "Как переехать в Ларнаку: пошаговая инструкция 2026", tag: "Гайд", city: "larnaca", coverQuery: "larnaca cyprus seafront" },
  { slug: "kak-pereekhat-v-nikosiyu-2026", title: "Как переехать в Никосию: пошаговая инструкция 2026", tag: "Гайд", city: "nicosia", coverQuery: "nicosia cyprus old town" },
  { slug: "kak-pereekhat-v-varnu-2026", title: "Как переехать в Варну: пошаговая инструкция 2026", tag: "Гайд", city: "varna", coverQuery: "varna bulgaria sea garden" },
  { slug: "kak-pereekhat-v-skopje-2026", title: "Как переехать в Скопье: пошаговая инструкция 2026", tag: "Гайд", city: "skopje", coverQuery: "skopje north macedonia city" },
  { slug: "kak-pereekhat-v-baku-2026", title: "Как переехать в Баку: пошаговая инструкция 2026", tag: "Гайд", city: "baku", coverQuery: "baku azerbaijan city" },
  { slug: "kak-pereekhat-v-kair-2026", title: "Как переехать в Каир: пошаговая инструкция 2026", tag: "Гайд", city: "cairo", coverQuery: "cairo egypt city" },
  { slug: "kak-pereekhat-v-hurgadu-2026", title: "Как переехать в Хургаду: пошаговая инструкция 2026", tag: "Гайд", city: "hurghada", coverQuery: "hurghada egypt red sea" },
  { slug: "kak-pereekhat-v-marrakesh-2026", title: "Как переехать в Марракеш: пошаговая инструкция 2026", tag: "Гайд", city: "marrakesh", coverQuery: "marrakesh morocco medina" },
  { slug: "kak-pereekhat-na-penang-2026", title: "Как переехать на Пенанг: пошаговая инструкция 2026", tag: "Гайд", city: "penang", coverQuery: "penang malaysia georgetown" },
  { slug: "kak-pereekhat-v-tel-aviv-2026", title: "Как переехать в Тель-Авив: пошаговая инструкция 2026", tag: "Гайд", city: "tel-aviv", coverQuery: "tel aviv israel beach" },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  body = body.replace(/^#\s+.*\n+/, "");
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  readTime = Math.max(4, Math.min(8, readTime || 5));
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
  return { cover_url: p.urls.raw, cover_author_name: p.user.name, cover_author_url: p.user.links.html };
}

const { data: cities, error: cErr } = await sb
  .from("cities")
  .select("id, slug, unsplash_url, unsplash_author_name, unsplash_author_url");
if (cErr) throw cErr;
const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

const base = Date.now();
let ok = 0, fail = 0;
for (let i = 0; i < META.length; i++) {
  const m = META[i];
  const file = path.join(DIR, `${m.slug}.md`);
  if (!fs.existsSync(file)) { console.error(`✗ ${m.slug}: файл не найден, пропуск`); fail++; continue; }

  const c = cityBySlug.get(m.city);
  if (!c) { console.error(`✗ ${m.slug}: город «${m.city}» не найден в cities`); fail++; continue; }

  let parsed;
  try { parsed = parseArticle(fs.readFileSync(file, "utf8")); }
  catch (e) { console.error(`✗ ${m.slug}: ${e.message}`); fail++; continue; }

  // Обложка: из города, иначе fallback к Unsplash.
  let cover = {};
  if (c.unsplash_url) {
    cover = { cover_url: c.unsplash_url, cover_author_name: c.unsplash_author_name, cover_author_url: c.unsplash_author_url };
  } else if (m.coverQuery) {
    try { const co = await fetchCover(m.coverQuery); if (co) cover = co; }
    catch (e) { console.error(`  ~ ${m.slug}: обложка не получена (${e.message})`); }
  }

  // created_at: новые статьи сверху, шаг 1 час, в порядке META.
  const createdAt = new Date(base - i * 3600 * 1000).toISOString();

  const row = {
    slug: m.slug,
    title: m.title,
    tag: m.tag,
    city_id: c.id,
    read_time: parsed.readTime,
    content_md: parsed.body,
    seo_title: parsed.seoTitle,
    seo_description: parsed.seoDesc,
    published: true,
    created_at: createdAt,
    ...cover,
  };

  const { error: upErr } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (upErr) { console.error(`✗ ${m.slug}: upsert — ${upErr.message}`); fail++; continue; }
  console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : "нет"}, city:${m.city}`);
  ok++;
}

console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);

// Сеет 20 новых SEO-статей (batch 6) из content/blog/*.md в таблицу blog_posts (upsert по slug).
//  • title / tag / slug / city_id / country / coverQuery — из META ниже (контролируем мы).
//  • seo_title / seo_description / read_time / content_md — из .md файла.
//  • Обложка: для статьи с city_id копируется из cities (профиль города), иначе — 1 запрос к Unsplash по coverQuery.
//  • country_slug: из города (если city_id) либо из META (country).
//  • created_at разносится по минуте, порядок META = порядок в ленте (новые сверху).
// Идемпотентно: повторный запуск обновляет существующие строки по slug.
// Обложки Unsplash здесь — raw-URL; после прогона запусти
//   node scripts/migrate-photos-to-storage.mjs
// чтобы перенести их в Supabase Storage (images.unsplash.com недоступен с VPS),
// затем дозаписать cover_url из плана (migrate пишет в cover_image_url, а в таблице — cover_url).
// Запуск: node scripts/seed-blog-batch-6.mjs
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

// Порядок = порядок публикации (новые сверху).
// cityId — UUID города (или null). country — country_slug (или null).
// coverQuery — запрос к Unsplash для статей без города (для city-гайдов — фолбэк, если у города нет обложки).
const META = [
  // --- Города-гайды (обложка из профиля города по city_id) ---
  { slug: "kak-pereekhat-v-sofiyu-2026",   title: "Как переехать в Софию в 2026 году: ВНЖ, жилье, цены",            tag: "Гайд", cityId: "ce79b48e-b14b-42f5-a344-7bcc4c95e5e2", country: "bulgaria",    coverQuery: "Sofia Bulgaria old town" },
  { slug: "kak-pereekhat-v-tiranu-2026",   title: "Как переехать в Тирану в 2026 году: безвиз, жилье, бюджет",      tag: "Гайд", cityId: "13abfd2a-1d6e-4615-8724-35cea4ba9f33", country: "albania",     coverQuery: "Tirana Albania city" },
  { slug: "kak-pereekhat-na-goa-2026",     title: "Как переехать на Гоа в 2026 году: визы Индии, жилье, цены",      tag: "Гайд", cityId: "c96a9189-b732-41fe-9a64-115a6aeb35d6", country: "india",       coverQuery: "Goa India beach palm" },
  { slug: "kak-pereekhat-v-kolombo-2026",  title: "Как переехать в Коломбо в 2026 году: Шри-Ланка для зимовки",     tag: "Гайд", cityId: "186932da-6db9-4c84-a544-736782d9bd9e", country: "sri-lanka",   coverQuery: "Colombo Sri Lanka skyline" },
  { slug: "kak-pereekhat-v-bukharu-2026",  title: "Как переехать в Бухару в 2026 году: жилье, виза, цены",          tag: "Гайд", cityId: "88b38781-3690-4906-9203-02805597846c", country: "uzbekistan",  coverQuery: "Bukhara Uzbekistan architecture" },
  { slug: "kak-pereekhat-v-kishinev-2026", title: "Как переехать в Кишинев в 2026 году: ВНЖ, жилье, цены",          tag: "Гайд", cityId: "a7495aff-9fd5-4ad3-a565-3dc9aebb13fc", country: "moldova",     coverQuery: "Chisinau Moldova city park" },

  // --- Деньги ---
  { slug: "schet-v-banke-kirgizii-2026",        title: "Как открыть счет в банке Киргизии в 2026 году",          tag: "Деньги", cityId: null, country: "kyrgyzstan", coverQuery: "Bishkek Kyrgyzstan building" },
  { slug: "schet-v-banke-chernogorii-2026",     title: "Как открыть счет в банке Черногории в 2026 году",        tag: "Деньги", cityId: null, country: "montenegro", coverQuery: "Montenegro Adriatic coast" },
  { slug: "schet-v-banke-kipra-2026",           title: "Как открыть счет в банке Кипра в 2026 году",             tag: "Деньги", cityId: null, country: "cyprus",     coverQuery: "Cyprus Limassol finance" },
  { slug: "schet-v-banke-vietnama-2026",        title: "Как открыть счет в банке Вьетнама в 2026 году",          tag: "Деньги", cityId: null, country: "vietnam",    coverQuery: "Vietnam Ho Chi Minh district" },
  { slug: "swift-perevody-dlya-relokanta-2026", title: "SWIFT-переводы для релоканта: что работает в 2026 году",  tag: "Деньги", cityId: null, country: null,        coverQuery: "international money transfer" },
  { slug: "nalogovaya-deklaracziya-relokanta-2026", title: "Налоговая декларация релоканта: где и как подавать в 2026", tag: "Деньги", cityId: null, country: null, coverQuery: "tax declaration documents" },

  // --- Визы ---
  { slug: "viza-cifrovogo-kochevnika-vietnam-2026", title: "Виза цифрового кочевника во Вьетнаме в 2026 году",       tag: "Визы", cityId: null, country: "vietnam",     coverQuery: "Vietnam digital nomad beach" },
  { slug: "viza-d8-shri-lanka-2026",                title: "Виза цифрового кочевника Шри-Ланки в 2026 году",         tag: "Визы", cityId: null, country: "sri-lanka",   coverQuery: "Sri Lanka coworking nomad" },
  { slug: "vnzh-kambodzhi-2026",                    title: "ВНЖ и визы Камбоджи для россиян в 2026 году",            tag: "Визы", cityId: null, country: "cambodia",    coverQuery: "Cambodia Angkor temple" },
  { slug: "viza-filippin-dlya-rossiyan-2026",       title: "Визы Филиппин для россиян: SRRV и долгосрок в 2026",     tag: "Визы", cityId: null, country: "philippines", coverQuery: "Philippines island palm" },
  { slug: "vnzh-moldovy-dlya-rossiyan-2026",        title: "ВНЖ Молдовы для россиян в 2026 году",                    tag: "Визы", cityId: null, country: "moldova",     coverQuery: "Moldova residence document" },

  // --- Сравнения и подборка ---
  { slug: "gruziya-ili-kazahstan-2026",          title: "Грузия или Казахстан: где жить релоканту в 2026 году",     tag: "Сравнение", cityId: null, country: null, coverQuery: "Tbilisi city" },
  { slug: "bali-ili-shri-lanka-2026",            title: "Бали или Шри-Ланка: куда на зимовку в 2026 году",          tag: "Сравнение", cityId: null, country: null, coverQuery: "Bali Sri Lanka tropical beach" },
  { slug: "luchshie-strany-dlya-startapa-2026",  title: "Лучшие страны для запуска бизнеса релокантом в 2026",      tag: "Подборка",  cityId: null, country: null, coverQuery: "startup coworking founders" },
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

// Карта городов по id: id -> {country_slug, обложка}
const { data: cities, error: cErr } = await sb
  .from("cities")
  .select("id, slug, country_slug, unsplash_url, unsplash_author_name, unsplash_author_url");
if (cErr) throw cErr;
const cityById = new Map((cities || []).map((c) => [c.id, c]));

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
  let cityId = m.cityId ?? null;
  let countrySlug = m.country ?? null;
  if (cityId) {
    const c = cityById.get(cityId);
    if (!c) {
      console.error(`  ~ ${m.slug}: город ${cityId} не найден в cities`);
      cityId = null;
    } else {
      countrySlug = c.country_slug ?? countrySlug;
      if (c.unsplash_url) {
        cover = {
          cover_url: c.unsplash_url,
          cover_author_name: c.unsplash_author_name,
          cover_author_url: c.unsplash_author_url,
        };
      }
    }
  }
  // Если обложки от города нет (или статья без города) — берём из Unsplash по coverQuery
  if (!cover.cover_url && m.coverQuery) {
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
  console.log(`✓ ${m.slug} — ${parsed.words} сл, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : "нет"}, city:${cityId ? cityId.slice(0, 8) : "—"}, country:${countrySlug || "—"}`);
  ok++;
}

console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);

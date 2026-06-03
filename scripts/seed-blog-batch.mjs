// Сеет 20 SEO-статей из content/blog/*.md в таблицу blog_posts (upsert по slug).
//  • title / tag / slug / city — из META ниже (контролируем мы).
//  • seo_title / seo_description / read_time / content_md — из .md файла (пишет workflow).
//  • Обложка: для статьи с городом копируется из cities, иначе — 1 запрос к Unsplash по coverQuery.
// Идемпотентно: повторный запуск обновляет существующие строки по slug.
// Запуск: node scripts/seed-blog-batch.mjs
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

// Метаданные статей (порядок = порядок публикации). city — slug города (или null).
// coverQuery — запрос к Unsplash для статей без города.
const META = [
  { slug: "karty-dlya-rossiyan-za-granitsey-2026", title: "Какие банковские карты работают за границей для россиян в 2026 году", tag: "Деньги", city: null, coverQuery: "credit card payment travel" },
  { slug: "bezvizovye-strany-dlya-rossiyan-2026", title: "Безвизовые страны для россиян в 2026 году: полный список", tag: "Подборка", city: null, coverQuery: "passport travel world map" },
  { slug: "samye-deshevye-strany-dlya-zhizni-2026", title: "Самые дешевые страны для жизни в 2026 году", tag: "Подборка", city: null, coverQuery: "asia street market budget" },
  { slug: "viza-cifrovogo-kochevnika-2026", title: "Виза цифрового кочевника в 2026: где и как получить", tag: "Визы", city: null, coverQuery: "laptop remote work cafe beach" },
  { slug: "nalogi-dlya-udalenshika-iz-rossii-2026", title: "Налоги для удаленщика из России: как платить из-за границы в 2026", tag: "Деньги", city: null, coverQuery: "documents calculator finance desk" },
  { slug: "kak-otkryt-schet-v-zarubezhnom-banke-2026", title: "Как открыть счет в зарубежном банке россиянину в 2026", tag: "Деньги", city: null, coverQuery: "bank building finance" },
  { slug: "vnzh-za-nedvizhimost-2026", title: "ВНЖ за недвижимость в 2026: страны и минимальные суммы", tag: "Визы", city: null, coverQuery: "modern apartment real estate keys" },
  { slug: "kuda-pereekhat-s-detmi-2026", title: "Куда переехать с детьми в 2026: школы, безопасность, цены", tag: "Подборка", city: null, coverQuery: "family children city park" },
  { slug: "skolko-stoit-pereezd-za-granitsu-2026", title: "Сколько стоит переезд за границу: полная смета на 2026", tag: "Деньги", city: null, coverQuery: "moving boxes suitcase luggage" },
  { slug: "kak-pereekhat-v-yerevan-2026", title: "Как переехать в Ереван: пошаговая инструкция 2026", tag: "Гайд", city: "yerevan" },
  { slug: "kak-pereekhat-v-belgrad-2026", title: "Как переехать в Белград: пошаговая инструкция 2026", tag: "Гайд", city: "belgrade" },
  { slug: "kak-pereekhat-v-almaty-2026", title: "Как переехать в Алматы: пошаговая инструкция 2026", tag: "Гайд", city: "almaty" },
  { slug: "kak-pereekhat-na-bali-2026", title: "Как переехать на Бали: пошаговая инструкция 2026", tag: "Гайд", city: "bali" },
  { slug: "kak-pereekhat-v-dubai-2026", title: "Как переехать в Дубай: пошаговая инструкция 2026", tag: "Гайд", city: "dubai" },
  { slug: "kak-pereekhat-v-batumi-2026", title: "Как переехать в Батуми: пошаговая инструкция 2026", tag: "Гайд", city: "batumi" },
  { slug: "bali-ili-phuket-2026", title: "Бали или Пхукет: где удаленщику жить лучше в 2026", tag: "Сравнение", city: "bali" },
  { slug: "dubai-ili-istanbul-2026", title: "Дубай или Стамбул: где осесть в 2026 году", tag: "Сравнение", city: "dubai" },
  { slug: "belgrad-ili-budapesht-2026", title: "Белград или Будапешт: что выбрать для переезда в 2026", tag: "Сравнение", city: "belgrade" },
  { slug: "almaty-ili-tashkent-2026", title: "Алматы или Ташкент: куда переехать в Средней Азии в 2026", tag: "Сравнение", city: "almaty" },
  { slug: "chernogoriya-ili-gruziya-2026", title: "Черногория или Грузия: где дешевле и проще осесть в 2026", tag: "Сравнение", city: null, coverQuery: "montenegro adriatic coast town" },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  // Снимаем случайные обертки ```...``` вокруг всего тела
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  // Убираем дублирующий H1 в начале (заголовок рендерится отдельно)
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

// Карта городов: slug -> {id, обложка}
const { data: cities, error: cErr } = await sb
  .from("cities")
  .select("id, slug, unsplash_url, unsplash_author_name, unsplash_author_url");
if (cErr) throw cErr;
const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

let ok = 0, fail = 0;
for (const m of META) {
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

  // Обложка
  let cover = {};
  if (m.city) {
    const c = cityBySlug.get(m.city);
    if (c?.unsplash_url) {
      cover = { cover_url: c.unsplash_url, cover_author_name: c.unsplash_author_name, cover_author_url: c.unsplash_author_url };
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
    city_id: m.city ? cityBySlug.get(m.city)?.id ?? null : null,
    read_time: parsed.readTime,
    content_md: parsed.body,
    seo_title: parsed.seoTitle,
    seo_description: parsed.seoDesc,
    published: true,
    ...cover,
  };

  const { error: upErr } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (upErr) {
    console.error(`✗ ${m.slug}: upsert — ${upErr.message}`);
    fail++;
    continue;
  }
  console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : "нет"}, city:${m.city || "—"}`);
  ok++;
}

console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);

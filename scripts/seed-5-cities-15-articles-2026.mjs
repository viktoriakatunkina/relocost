// Сеет 15 SEO-статей про топ-5 городов по органическому трафику (Лондон, Париж,
// Осака, Санкт-Петербург, Калининград) — по 3 статьи на город с разными углами.
// Формат файлов: SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT--- (как в
// scripts/seed-blog-batch.mjs). Обложка — из фото города в таблице cities.
// Идемпотентно: повторный запуск обновляет существующие строки по slug.
// Запуск: node scripts/seed-5-cities-15-articles-2026.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

// city — slug города в таблице cities (для city_id и обложки).
const META = [
  // Лондон
  { slug: "london-stoimost-zhizni-rossiyanin-2026", title: "Стоимость жизни в Лондоне для россиянина в 2026 году: сколько нужно в месяц", tag: "Города", city: "london" },
  { slug: "london-viza-dlya-rossiyan-2026", title: "Виза в Лондон для россиян в 2026 году: все легальные пути переезда", tag: "Визы", city: "london" },
  { slug: "stoit-li-pereezzhat-v-london-2026", title: "Стоит ли переезжать в Лондон в 2026 году: честно о плюсах, минусах и реальности", tag: "Журнал", city: "london" },
  // Париж
  { slug: "parizh-stoimost-zhizni-rossiyanin-2026", title: "Стоимость жизни в Париже для россиянина в 2026 году: реальный бюджет", tag: "Города", city: "paris" },
  { slug: "parizh-viza-vnzh-dlya-rossiyan-2026", title: "Виза во Францию для россиян в 2026 году: как получить ВНЖ и переехать в Париж", tag: "Визы", city: "paris" },
  { slug: "stoit-li-pereezzhat-v-parizh-2026", title: "Стоит ли переезжать в Париж в 2026 году: плюсы, минусы и на кого он рассчитан", tag: "Журнал", city: "paris" },
  // Осака
  { slug: "osaka-stoimost-zhizni-rossiyanin-2026", title: "Стоимость жизни в Осаке для россиянина в 2026 году: сколько нужно в месяц", tag: "Города", city: "osaka" },
  { slug: "osaka-viza-yaponiya-dlya-rossiyan-2026", title: "Виза в Японию для россиян в 2026 году: как переехать в Осаку легально", tag: "Визы", city: "osaka" },
  { slug: "stoit-li-pereezzhat-v-osaku-2026", title: "Стоит ли переезжать в Осаку в 2026 году: жизнь россиянина в Японии", tag: "Журнал", city: "osaka" },
  // Санкт-Петербург
  { slug: "rabota-zarplaty-sankt-peterburg-2026", title: "Работа и зарплаты в Санкт-Петербурге в 2026 году: сколько платят и как искать", tag: "Гайд", city: "spb" },
  { slug: "arenda-kvartiry-sankt-peterburg-2026", title: "Аренда жилья в Санкт-Петербурге в 2026 году: цены по районам", tag: "Города", city: "spb" },
  { slug: "sankt-peterburg-ili-moskva-2026", title: "Санкт-Петербург или Москва: куда переехать в 2026 году", tag: "Сравнение", city: "spb" },
  // Калининград
  { slug: "kaliningrad-anklav-logistika-dostavka-2026", title: "Жизнь в Калининграде-анклаве в 2026 году: логистика, доставка и выезд «на большую землю»", tag: "Гайд", city: "kaliningrad" },
  { slug: "rabota-v-kaliningrade-2026", title: "Работа в Калининграде в 2026 году: вакансии, зарплаты, как искать", tag: "Города", city: "kaliningrad" },
  { slug: "kaliningrad-ili-sochi-2026", title: "Калининград или Сочи: где лучше жить у моря в России в 2026 году", tag: "Сравнение", city: "kaliningrad" },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  // Убираем дублирующий H1 в начале (заголовок рендерится отдельно из title)
  body = body.replace(/^#\s+.*\n+/, "");
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  // Статьи длиннее обычных (1700-2200 слов) — не клипуем искусственно к 8 мин,
  // даем честное время чтения в разумных пределах.
  readTime = Math.max(5, Math.min(14, readTime || 8));
  return { seoTitle, seoDesc, readTime, body, words };
}

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

  let cover = {};
  const c = m.city ? cityBySlug.get(m.city) : null;
  if (c?.unsplash_url) {
    cover = { cover_url: c.unsplash_url, cover_author_name: c.unsplash_author_name, cover_author_url: c.unsplash_author_url };
  }

  const row = {
    slug: m.slug,
    title: m.title,
    tag: m.tag,
    city_id: c?.id ?? null,
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
  console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : "нет"}, city:${m.city}`);
  ok++;
}

console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);

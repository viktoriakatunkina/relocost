// 10 SEO-статей блога Relocost — шестая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch5-aug-2026.mjs
// (Джокьякарта + врач/дизайнер/бьюти-мастер/репетитор/психолог/грудной
// ребенок/многодетная семья/одиночка/подросток).
//
// Проверка на дубли перед отбором: город-пул для city_id исчерпан (см.
// комментарий в batch5 — 28 из 29 свободных городов в браке по ценам,
// Джокьякарта уже использована). Поэтому эта партия — снова 2 трека:
//
// 1) ТЕМАТИЧЕСКИЙ (3 статьи) — из списка задания проверены через grep по
//    content/blog/*.md И через полную выгрузку Supabase blog_posts (4939
//    строк — выяснилось, что в базе НАМНОГО больше постов, чем локальных
//    .md-файлов: часть контента, включая тематические статьи по профессиям/
//    семье/медицине, писалась предыдущими агентами напрямую в Supabase без
//    сохранения .md — см. reference-relocost, пайплайн предполагает
//    content/blog → seed, но по факту это нарушалось). Из восьми тем задания
//    (IT-специалист, пенсионер, digital nomad+семья, животные, пара без
//    детей, образование детей, предприниматель, инвалидность) ШЕСТЬ уже
//    закрыты (найдено в Supabase, не только в content/blog):
//    - kuda-pereekhat-it-spetsialistu-iz-rossii-2026 (июль)
//    - kuda-pereekhat-pensioneru-sravnenie-gorodov-2026 (25 авг, прошлая ночь)
//    - domashnie-zhivotnye-pri-pereezde / pereezd-s-pitomtsem-za-rubezh-2026 /
//      pereezd-s-sobakey-za-granitsu-2026 / pereezd-s-koshkoy-za-granitsu-2026
//    - kak-otpravit-rebenka-uchitsya-za-rubezh-2026 (образование детей)
//    - kuda-pereekhat-predprinimatelyu-iz-rossii-2026 (июль)
//    - top-stran-dlya-pereezda-invalidov-2026 / kak-pereekhat-diseyblam-s-invalidnostyu-za-rubezh-2026
//    Свободными и непокрытыми (0 совпадений и в content/blog, и в полной
//    выгрузке Supabase) оказались только: цифровой кочевник с семьей и
//    молодая пара без детей. Третья тема добавлена сверх списка задания
//    (тоже 0 совпадений после broad-search) — переезд с ребенком с
//    особенностями развития (аутизм/ЗПР/ОВЗ), реально непокрытый и
//    востребованный сегмент.
//
// 2) СРАВНЕНИЯ ГОРОДОВ (7 статей) — между уже написанными городами (все с
//    city_id, автолинки на /city/[slug] корректны). Из примеров задания
//    Рига vs Вильнюс vs Таллин уже закрыто (tallin-riga-vilnyus-sravnenie-2026,
//    есть в Supabase) — пропущено. Убуд vs Семиньяк и Бангалор vs Мумбаи vs
//    Ченнаи — свободны, взяты. Остальные 5 пар подобраны из 147 городов с
//    city_id систематической проверкой против ВСЕХ 246 существующих
//    сравнительных постов (slug содержит vs/-ili-/sravnenie) — только пары с
//    0 совпадений: Доха vs Абу-Даби, Астана vs Бишкек, Берлин vs Гамбург,
//    Хельсинки vs Стокгольм, Баку vs Тбилиси.
//
// Все цифры — из Numbeo/Expatistan/livingcost.org 2026, локальных
// агрегаторов (krisha.kz, gogov.ru) и данных Supabase (cities.currency,
// prices) там, где они прошли проверку на правдоподобие. Курс 1$≈90₽,
// 1€≈95₽ — по конвенции, уже принятой в других статьях блога (см.
// byudzhet-50-100-200-tysyach-tri-scenariya-2026.md).
//
// ⚠️ Найдено при подготовке: таблица prices в Supabase для Дохи и Абу-Даби
// содержит ДУБЛИРОВАННЫЕ строки rent в разных масштабах величин (похоже,
// смешаны разные единицы/конвенции из разных партий сидирования) — цифры
// для этих двух городов в статье поэтому взяты из внешних источников
// (Expatistan/livingcost), а не из Supabase.prices. Стоит почистить отдельно,
// вне рамок этой контентной партии.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25). Мягкая пауза 5с между вставками — не долбим базу подряд.
//
// Запуск: node scripts/seed-10-night-batch6-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

// city — slug города в таблице cities (для city_id и обложки). null — без привязки.
const META = [
  {
    slug: "tsifrovoy-kochevnik-s-semyey-kuda-pereekhat-2026",
    title: "Цифровой кочевник с семьей: куда переехать в 2026 году",
    tag: "Лайфстайл",
    city: null,
  },
  {
    slug: "pereezd-molodoy-pary-bez-detey-2026",
    title: "Переезд вдвоем: куда молодой паре без детей в 2026 году",
    tag: "Лайфстайл",
    city: null,
  },
  {
    slug: "pereezd-s-rebenkom-s-osobennostyami-razvitiya-2026",
    title: "Переезд с ребенком с особенностями развития за рубеж в 2026 году",
    tag: "Семья",
    city: null,
  },
  {
    slug: "ubud-vs-seminyak-gde-zhit-na-bali-2026",
    title: "Убуд или Семиньяк: где жить на Бали в 2026 году",
    tag: "Сравнения",
    city: "ubud",
  },
  {
    slug: "bangalor-vs-mumbai-vs-chennai-2026",
    title: "Бангалор, Мумбаи или Ченнаи: куда переехать в Индию в 2026 году",
    tag: "Сравнения",
    city: "bangalore",
  },
  {
    slug: "doha-vs-abu-dabi-2026",
    title: "Доха или Абу-Даби: где жить в Персидском заливе в 2026 году",
    tag: "Сравнения",
    city: "doha",
  },
  {
    slug: "astana-vs-bishkek-2026",
    title: "Астана или Бишкек: куда переехать в Центральной Азии в 2026 году",
    tag: "Сравнения",
    city: "astana",
  },
  {
    slug: "berlin-vs-gamburg-2026",
    title: "Берлин или Гамбург: где жить в Германии в 2026 году",
    tag: "Сравнения",
    city: "berlin",
  },
  {
    slug: "helsinki-vs-stokgolm-2026",
    title: "Хельсинки или Стокгольм: скандинавское сравнение 2026",
    tag: "Сравнения",
    city: "helsinki",
  },
  {
    slug: "baku-vs-tbilisi-2026",
    title: "Баку или Тбилиси: куда переехать на Кавказ в 2026 году",
    tag: "Сравнения",
    city: "baku",
  },
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
  readTime = Math.max(6, Math.min(20, readTime || 10));
  return { seoTitle, seoDesc, readTime, body, words };
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = 40000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(t);
  }
}

async function withRetry(label, fn, tries = 6, baseDelay = 45000) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fn();
      console.error(`OK: ${label}`);
      return r;
    } catch (e) {
      console.error(`${label} attempt ${i + 1}/${tries} failed: ${e.message}`);
      if (i === tries - 1) throw e;
      console.error(`  waiting ${baseDelay}ms before retry...`);
      await new Promise((r) => setTimeout(r, baseDelay));
    }
  }
}

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

async function run() {
  const cities = await withRetry("cities lookup", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/cities?select=id,slug,unsplash_url,unsplash_author_name,unsplash_author_url`,
      { headers },
      40000
    )
  );
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
    if (m.city && !c) {
      console.error(`⚠ ${m.slug}: город "${m.city}" не найден в cities — city_id будет null`);
    }
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

    try {
      await withRetry(`upsert ${m.slug}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/blog_posts?on_conflict=slug`,
          {
            method: "POST",
            headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify(row),
          },
          40000
        )
      );
      console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, city:${m.city || "—"}, city_id:${c?.id ? "да" : "нет"}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${m.slug}: не удалось записать — ${e.message}`);
      fail++;
    }
    // мягкая пауза между вставками — не долбим базу подряд
    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);
  if (ok > 0) {
    console.log(`Next: node scripts/fill-blog-images.mjs   (обложки/inline-картинки из storage, если ещё не проставлены)`);
  }
  if (fail > 0) process.exitCode = 1;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

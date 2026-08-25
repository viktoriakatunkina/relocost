// 10 SEO-статей блога Relocost — второй эшелон городов (не топ-города,
// уже закрытые сегодняшними батчами: Лондон/Париж/СПб/Калининград/Осака,
// Тбилиси/Ереван/Белград/Алматы/Дубай/Батуми/Астана/Бишкек/Гюмри/Минск/
// Баку/Актау/Аланья/Кутаиси/Ташкент/Казань/Екатеринбург-сравнения).
// Каждая статья привязана к city_id для автоматического inline-CTA
// (ArticleInlineCTA/ArticleCityData в app/[locale]/blog/[slug]/page.tsx) —
// ведёт на /city/<slug> с реальными ценами из cities+prices. Города и углы:
//   - Москва (0 city_id-статей ранее) — бюджет для переехавших из региона
//   - Екатеринбург — аренда по типам жилья (продолжение паттерна СПб)
//   - Пафос (Кипр) — сценарий "пенсионер"
//   - Лимассол (Кипр) — сценарий "удаленщик/фрилансер"
//   - Валенсия (Испания) — сценарий "семья с детьми"
//   - Малага (Испания) — бюджет на одного/пару/семью (household.ts)
//   - Измир (Турция) — "под ключ" смета переезда
//   - Кишинев (Молдова) — "сколько накопить" перед переездом
//   - Подгорица vs Будва (Черногория) — прямое сравнение
//   - Пенанг (Малайзия) — сценарий "пенсионер" + MM2H виза
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Раздатчик заголовка H1 — первая строка body, вырезается парсером (сайт
// рендерит H1 из поля title). Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25). Мягкая пауза 3с между вставками — не долбим базу подряд.
//
// Запуск: node scripts/seed-10-second-tier-cities-aug-2026.mjs
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
    slug: "moskva-stoimost-zhizni-dlya-pereehavshih-2026",
    title: "Москва 2026: сколько нужно денег переехавшему из региона",
    tag: "Финансы",
    city: "moscow",
  },
  {
    slug: "arenda-kvartiry-ekaterinburg-2026",
    title: "Аренда квартиры в Екатеринбурге 2026: цены и как снять",
    tag: "Города",
    city: "yekaterinburg",
  },
  {
    slug: "pafos-dlya-pensionera-2026",
    title: "Пафос для пенсионера 2026: бюджет, ВНЖ, жизнь у моря",
    tag: "Финансы",
    city: "paphos",
  },
  {
    slug: "limassol-dlya-udalenshchika-2026",
    title: "Лимассол для удаленщика 2026: бюджет, налоги, легализация",
    tag: "Удаленная работа",
    city: "limassol",
  },
  {
    slug: "valensiya-s-detmi-2026",
    title: "Валенсия с детьми 2026: школы, районы, бюджет семьи",
    tag: "Семья",
    city: "valencia",
  },
  {
    slug: "malaga-byudzhet-odin-para-semya-2026",
    title: "Малага: точный бюджет на одного, пару и семью в 2026 году",
    tag: "Финансы",
    city: "malaga",
  },
  {
    slug: "pereezd-v-izmir-pod-klyuch-2026",
    title: "Переезд в Измир под ключ 2026: смета расходов от визы до первой аренды",
    tag: "Финансы",
    city: "izmir",
  },
  {
    slug: "skolko-nakopit-pered-pereezdom-v-kishinev-2026",
    title: "Сколько нужно накопить перед переездом в Кишинев в 2026 году",
    tag: "Финансы",
    city: "chisinau",
  },
  {
    slug: "podgoritsa-ili-budva-2026",
    title: "Подгорица или Будва: где дешевле жить в Черногории в 2026",
    tag: "Сравнение",
    city: "podgorica",
  },
  {
    slug: "penang-dlya-pensionera-mm2h-2026",
    title: "Пенанг для пенсионера 2026: MM2H виза и бюджет без спешки",
    tag: "Визы",
    city: "penang",
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

async function withRetry(label, fn, tries = 6, baseDelay = 40000) {
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
    await new Promise((r) => setTimeout(r, 3000));
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

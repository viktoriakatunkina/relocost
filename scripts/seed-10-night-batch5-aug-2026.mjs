// 10 SEO-статей блога Relocost — пятая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch4-aug-2026.mjs
// (Ченнаи/Дели/Пондичерри/Ломбок/Медан/Семиньяк/Любляна/Таллин/Рейкьявик/
// Мерида) и большой волны листинговых/сравнительных статей той же ночи
// (top-15-gorodov-dlya-frilansera, kuda-pereekhat-studentu, "X или Y" и
// т.д. — см. content/blog/*-2026.md с mtime 24-26 августа).
//
// Проверка на дубли перед отбором: выгружены ВСЕ 175 городов cities и ВСЕ
// city_id блог-постов (377 постов, 146 уникальных городов). Свободных от
// city_id городов осталось 29 — и 28 из них это уже известный список брака
// цен (Мюнхен/Валлетта/Тенерифе/Джокьякарта(!)/Братислава/Вроцлав/
// Бухарест/Рио/Санья/Тайбэй/Гданьск/Лос-Анджелес/Неаполь/Монреаль/
// Ванкувер/Нью-Йорк/Флоренция/Цюрих/Франкфурт/Фуншал/Касабланка/
// Гонконг/Сидней/Кельн/Брюссель/Женева/Аделаида/Йоханнесбург) —
// ИСКЛЮЧЕНИЕ: Джокьякарта (yogyakarta) вручную перепроверена по всем 20
// позициям prices — ratio дублей ок, абсолютные цифры в рублях биются с
// Numbeo/Wise/Expatistan 2026 (общий бюджет 1 чел. ~$641/мес по внешним
// источникам ≈ 55-58k ₽, наш расчет по тарифу «Эконом» дает 21.9-39.8k
// плюс премиум-категории — совпадает по порядку величины) → это ЕДИНСТВЕННЫЙ
// новый чистый city_id-кандидат в базе на сегодня.
//
// Раз новых чистых городов для city_id больше нет, оставшиеся 9 статей —
// не про конкретный город/страну, а закрывают реально непокрытый пласт
// тем (проверено grep по всем 637 файлам content/blog — 0 совпадений):
// профессии (врач, дизайнер/творческий фрилансер, бьюти-мастер, репетитор,
// психолог для онлайн-практики) и состав семьи (грудной ребенок 0-1 год,
// многодетная семья, переезд в одиночку, подросток 13-17 лет) — с
// внутренними ссылками на уже опубликованные city/country страницы
// (Тбилиси, Батуми, Белград, Лимассол, Дубай, Валенсия и т.д.), а не
// собственным city_id/country_slug.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25; и отдельно reference-relocost-vps-supabase-network-quirk —
// сетевые таймауты VPS↔Supabase). Мягкая пауза 5с между вставками — не
// долбим базу подряд (feedback-relocost-supabase-concurrency-limit: этот
// прогон — единственный активный писатель в Supabase на момент запуска).
//
// Запуск: node scripts/seed-10-night-batch5-aug-2026.mjs
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
    slug: "dzhokyakarta-stoimost-zhizni-2026",
    title: "Джокьякарта 2026: стоимость жизни в культурной столице Явы",
    tag: "Города",
    city: "yogyakarta",
  },
  {
    slug: "kuda-pereekhat-vrachu-2026",
    title: "Куда переехать врачу из России: признание диплома в 2026 году",
    tag: "Профессии",
    city: null,
  },
  {
    slug: "kuda-pereekhat-dizayneru-i-tvorcheskomu-frilanseru-2026",
    title: "Куда переехать дизайнеру и творческому фрилансеру в 2026 году",
    tag: "Профессии",
    city: null,
  },
  {
    slug: "kuda-pereekhat-byuti-masteru-2026",
    title: "Куда переехать мастеру маникюра и парикмахеру в 2026 году",
    tag: "Профессии",
    city: null,
  },
  {
    slug: "kuda-pereekhat-repetitoru-i-prepodavatelyu-2026",
    title: "Куда переехать репетитору и преподавателю в 2026 году",
    tag: "Профессии",
    city: null,
  },
  {
    slug: "kuda-pereekhat-psihologu-dlya-onlayn-praktiki-2026",
    title: "Куда переехать психологу для онлайн-практики в 2026 году",
    tag: "Профессии",
    city: null,
  },
  {
    slug: "pereezd-s-grudnym-rebenkom-2026",
    title: "Переезд с грудным ребенком за границу в 2026 году: что учесть",
    tag: "Семья",
    city: null,
  },
  {
    slug: "pereezd-mnogodetnoy-semyi-2026",
    title: "Переезд многодетной семьи за границу в 2026 году: бюджет и визы",
    tag: "Семья",
    city: null,
  },
  {
    slug: "pereezd-v-odinochku-2026",
    title: "Переезд в одиночку в 2026 году: куда, как не потеряться и не разориться",
    tag: "Лайфстайл",
    city: null,
  },
  {
    slug: "pereezd-s-podrostkom-2026",
    title: "Переезд с подростком за границу в 2026: школа, ЕГЭ, адаптация",
    tag: "Семья",
    city: null,
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

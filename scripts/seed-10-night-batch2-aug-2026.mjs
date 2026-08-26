// 10 SEO-статей блога Relocost — вторая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-second-tier-cities-aug-2026.mjs
// (Москва/Екатеринбург/Пафос/Лимассол/Валенсия/Малага/Измир/Кишинев/
// Подгорица-Будва/Пенанг). Города выбраны по критерию: 0-1 city_id-статья
// в blog_posts + чистые данные в prices (49-89 позиций, проверено вручную —
// ratio min/max между дублирующимися строками одного товара близко к 1,
// без признаков смешения конвертированной/неконвертированной валюты; города
// с явным браком (Санья/Китай, Рио-де-Жанейро — ratio >10x на аренде)
// намеренно исключены). Каждая статья привязана к city_id для автоматического
// inline-CTA — ведет на /city/<slug> с реальными ценами из cities+prices.
// Города и углы:
//   - Шарм-эль-Шейх (Египет) — зимовка, бюджет на 1-6 месяцев
//   - Плая-дель-Кармен (Мексика) — общий бюджет курорта Ривьеры-Майя
//   - Себу (Филиппины) — языковая школа английского + бюджет
//   - Катманду (Непал) — самый бюджетный вариант долгого проживания в Азии
//   - Сус (Тунис) — бюджет жизни у моря без визы
//   - Манама (Бахрейн) — жизнь без подоходного налога, альтернатива Дубаю
//   - Аликанте (Испания) — аренда жилья, районы, цены (отличается от
//     Валенсии/Малаги предыдущей партии — фокус на рынке аренды)
//   - Сиемреап (Камбоджа) — бюджет и виза рядом с Ангкор-Ватом
//   - Пномпень (Камбоджа) — бюджет для удаленщика и предпринимателя
//   - Скопье (Северная Македония) — самая доступная столица Балкан
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25). Мягкая пауза 4с между вставками — не долбим базу подряд.
//
// Запуск: node scripts/seed-10-night-batch2-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  {
    slug: "sharm-el-sheikh-zima-2026",
    title: "Шарм-эль-Шейх зимой 2026: бюджет для долгого проживания",
    tag: "Финансы",
    city: "sharm-el-sheikh",
  },
  {
    slug: "playa-del-karmen-stoimost-zhizni-2026",
    title: "Плая-дель-Кармен 2026: сколько стоит жизнь у моря в Мексике",
    tag: "Города",
    city: "playa-del-carmen",
  },
  {
    slug: "sebu-yazykovaya-shkola-byudzhet-2026",
    title: "Себу 2026: языковая школа, бюджет и жизнь на Филиппинах",
    tag: "Образование",
    city: "cebu",
  },
  {
    slug: "katmandu-byudzhet-2026",
    title: "Катманду 2026: самый бюджетный вариант долгого проживания в Азии",
    tag: "Финансы",
    city: "kathmandu",
  },
  {
    slug: "sus-tunis-byudzhet-2026",
    title: "Сус в Тунисе 2026: бюджет жизни у моря без визы",
    tag: "Финансы",
    city: "sousse",
  },
  {
    slug: "manama-bahrejn-bez-naloga-2026",
    title: "Манама 2026: жизнь в Бахрейне без подоходного налога",
    tag: "Финансы",
    city: "manama",
  },
  {
    slug: "arenda-zhilya-alikante-2026",
    title: "Аренда жилья в Аликанте 2026: районы, цены, как снять",
    tag: "Города",
    city: "alicante",
  },
  {
    slug: "siem-reap-angkor-vat-2026",
    title: "Сиемреап 2026: жизнь рядом с Ангкор-Ватом — бюджет и виза",
    tag: "Города",
    city: "siem-reap",
  },
  {
    slug: "pnompen-udalenshchik-2026",
    title: "Пномпень 2026: бюджет для удаленщика и предпринимателя",
    tag: "Удаленная работа",
    city: "phnom-penh",
  },
  {
    slug: "skope-deshevaya-stolitsa-2026",
    title: "Скопье 2026: самая доступная столица Балкан для переезда",
    tag: "Города",
    city: "skopje",
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
    await new Promise((r) => setTimeout(r, 4000));
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

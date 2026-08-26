// 1 SEO-статья блога Relocost — двенадцатая (разведывательная) ночная партия
// (26 августа 2026).
//
// Партия была разведывательной: проверить, остался ли ещё ценный материал
// после 11 партий (~314+ статей за 25-26.08). Результат — приоритет снова
// на данные, не на объём (тот же вывод, что в batch11 после предупреждения
// о каннибализации: пенсии 50+, психология 22+, апостиль 15+ статей и т.д.).
//
// Три "битых" города из списка на проверку:
//   - Братислава — починена (fix-bratislava-prices.mjs): баг был глубже, чем
//     просто валюта — item_name_ru были НЕканоническими (не матчили паттерны
//     в components/city/Calculator.tsx и lib/prices.ts/.cities.ts/.countries.ts),
//     плюс сырые EUR вместо рублей, плюс отсутствовала категория "cafe"
//     целиком. Полная пересборка 13 → 27 строк. НЕ написана статья — по
//     запросу в blog_posts уже существует 13 (!) почти дублирующих статей
//     про Братиславу/Словакию ("Словакия Братислава DN 2026" и т.п.,
//     формата "факты в таблицах", city_id=null у всех) — писать 14-ю
//     означало бы усугубить уже обнаруженную каннибализацию, а не найти
//     новую ценность.
//   - Санья — починена (fix-sanya-prices.mjs): дедупликация трёх волн сидов
//     (89 → 49 строк), тот же класс бага, что у Бухареста в batch10. В
//     отличие от Братиславы и Рио, у Саньи РЕАЛЬНО не было ни одной
//     полноценной статьи (только 1 туманно связанная про безвиз на Хайнань
//     в целом) — здесь дописана статья, см. META ниже.
//   - Рио-де-Жанейро — НЕ тронут. Диагностика (тем же методом волн по
//     updated_at) показала тот же класс проблемы, что у Саньи (49 уникальных
//     позиций + 20 задублированных), но у Рио уже 7 статей в блоге — правка
//     цен всё ещё стоила бы сделать в отдельной сессии ради корректности
//     калькулятора, но написание 8-й статьи не оправдано.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// Запуск: node scripts/seed-1-night-batch12-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  {
    slug: "stoimost-zhizni-v-sanye-2026",
    title: "Стоимость жизни в Санье 2026: реальные цифры",
    tag: "Города",
    city: "sanya",
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
    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);
  if (fail > 0) process.exitCode = 1;
}

run();

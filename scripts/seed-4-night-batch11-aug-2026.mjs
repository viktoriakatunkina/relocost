// 4 SEO-статьи блога Relocost — одиннадцатая ночная партия (26 августа 2026).
//
// Приоритет 1 этой партии — не контент, а данные: починены цены (валютный
// баг PLN/CHF/USD/EUR не сконвертированы в рубли, плюс наименования
// rent-позиций, ломающие точный .eq() лукап) для 4 городов, отмеченных как
// кандидаты ещё в batch10: Вроцлав (fix-wroclaw-prices.mjs, 8 строк PLN),
// Женева (fix-geneva-prices.mjs, 16 строк CHF + rename 4 rent-строк),
// Лос-Анджелес (fix-los-angeles-prices.mjs, 16 строк USD + rename 4
// rent-строк), Тенерифе (fix-tenerife-prices.mjs, 8 строк EUR). Все четыре
// — единственные "чистые по названию, но не по данным" города, упомянутые
// в комментарии batch10 (проверка ~130 городов без city_id-статьи).
//
// Для каждого починенного города — статья "Стоимость жизни в X 2026:
// реальные цифры" с city_id (по образцу Бухареста из batch10): быстрый
// ответ, разбивка по категориям, детальная аренда, честный разбор визовой
// ситуации для россиян (особо важно для Вроцлава — Польша фактически не
// выдаёт туристические визы с 2022 года, только узкий список оснований),
// работа/налоги, продукты, транспорт, медицина, плюсы/минусы, кому
// подходит, итог, FAQ. Все бюджетные таблицы посчитаны из СВЕЖЕ починенных
// цен (см. price-fix скрипты), курсы ЦБ РФ на 26.08.2026: PLN 22,8936,
// CHF 105,198, USD 84,4635, EUR 98,5182. Факты (визовые режимы, налоги,
// Blue Card, Digital Nomad Visa, IGIC Канар) проверены через WebSearch.
//
// НЕ включена задача "добора до 10" — приоритет качество/количество:
// после починки 4 городов и написания 4 полноценных (~1800-1870 слов)
// статей с реальными данными решено не гнаться за темами про добор,
// учитывая предупреждение о каннибализации в блоге (пенсии 50+, психология
// 22+, апостиль 15+ и т.д.) и то, что лёгких новых тем почти не осталось
// (см. итоги batch10). 4 сильных статьи > 10 слабых.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// Запуск: node scripts/seed-4-night-batch11-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  {
    slug: "stoimost-zhizni-vo-vrotslave-2026",
    title: "Стоимость жизни во Вроцлаве 2026: реальные цифры",
    tag: "Города",
    city: "wroclaw",
  },
  {
    slug: "stoimost-zhizni-v-zheneve-2026",
    title: "Стоимость жизни в Женеве 2026: реальные цифры",
    tag: "Города",
    city: "geneva",
  },
  {
    slug: "stoimost-zhizni-v-los-andzhelese-2026",
    title: "Стоимость жизни в Лос-Анджелесе 2026: реальные цифры",
    tag: "Города",
    city: "los-angeles",
  },
  {
    slug: "stoimost-zhizni-na-tenerife-2026",
    title: "Стоимость жизни на Тенерифе 2026: реальные цифры",
    tag: "Города",
    city: "tenerife",
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
  if (ok > 0) {
    console.log(`Next: node scripts/fill-blog-images.mjs   (обложки/inline-картинки из storage, если ещё не проставлены)`);
  }
  if (fail > 0) process.exitCode = 1;
}

run();

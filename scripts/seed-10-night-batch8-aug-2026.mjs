// 10 SEO-статей блога Relocost — восьмая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch7-aug-2026.mjs.
//
// Задача в два трека:
//
// 1) РАЗБЛОКИРОВКА «БРАКОВАННЫХ» ГОРОДОВ (6 статей). Из списка 21 города,
//    оставшегося непроверенным после batch7 (город заведен в местной валюте
//    — HKD/CAD/EUR — но только 3-4 «ключевых» айтема бюджет-калькулятора
//    донасыщены в рублях прогоном 17.08, а хвостовые строки — аренда, кафе,
//    развлечения, здоровье, часть транспорта/ЖКХ — остались в исходной
//    валюте), вручную проверены и ТОЧЕЧНО ИСПРАВЛЕНЫ через UPDATE в prices:
//    Гонконг, Ванкувер, Монреаль, Флоренция, Неаполь, Франкфурт (выбраны по
//    SEO-потенциалу среди 21 города). Для каждого — «легаси»-строки (updated_at
//    до 01.08.2026) переведены в рубли по курсу ЦБ на 26.08.2026 (HKD≈10,7748,
//    CAD≈61,0197, EUR≈98,5182), суммы округлены до разумного шага. Проверено:
//    Рио-де-Жанейро и Санья из тех же 21 — НЕ трогали, структура грязная
//    (дублирующиеся строки от нескольких прогонов, 69 и 89 строк вместо 20) —
//    чинить надежно не вышло, оставлены как есть.
//
//    ВАЖНО (найдено в этом прогоне, чего не было в batch7-заметках): помимо
//    budgetBreakdown() (lib/budget-breakdown.ts, ищет подстроки «окраине»/
//    «Продукты»/«проездной»/«ЖКХ»/«Домашний»/«Мобильная»), есть ЕЩЕ 4 места
//    с ТОЧНЫМ (.eq) сравнением item_name_ru === "1-комн. квартира на окраине"
//    — lib/prices.ts, lib/cities.ts, lib/countries.ts (x2), app/[locale]/
//    favorites/page.tsx. Из-за этого простого rename на «окраине» внутри
//    старого имени недостаточно — переименовывали СТРОГО в канонический вид
//    без префикса «Аренда» и без городских суффиксов типа «(NT)» (сверено с
//    уже исправленным в batch7 Мюнхеном, который использует ту же голую
//    форму: «1-комн. квартира на окраине», «Студия в центре», «Комната» и
//    т.д.). Остальные rent-строки (Комната/Студия/2-комн./1-комн. в центре)
//    тоже приведены к этому стилю для консистентности отображения. После
//    фикса для каждого города точечно проверено: budgetBreakdown() дает
//    ненулевой бюджет, а .eq("item_name_ru","1-комн. квартира на окраине")
//    возвращает ровно 1 строку (не 0, не 2) — так же, как у уже
//    подтвержденных 5 городов из batch7.
//
//    Итоговые цифры сверены с Numbeo Aug-2026 (rent outside/in centre,
//    utilities) через WebSearch — отклонение в пределах обычного разброса
//    диапазонов, без искажений порядка величины. Оставшиеся 15 городов из
//    исходного списка 21 (за вычетом 6 исправленных и Рио/Саньи) НЕ
//    проверялись в этом прогоне — следующий проход.
//
// 2) ДОБОР ДО 10 (4 статьи). Проверка Supabase blog_posts показала:
//    налоговое резидентство и SWIFT/банковские переводы — НАСЫЩЕНЫ (15+ и
//    13+ постов соответственно), эти темы из ТЗ пропущены как неактуальные.
//    Реальные пробелы (0 совпадений): (а) специальность-ориентированное
//    высшее образование за рубежом для СТУДЕНТОВ (не путать с насыщенным
//    кластером «переезд врача/архитектора с признанием диплома» — там речь
//    о готовых специалистах) — закрыто 2 статьями: IT/Computer Science и
//    медицина; (б) интернет-магазины/пересылка посылок при переезде
//    (Wildberries/Ozon/AliExpress/форвардеры) — 0 совпадений вообще, закрыто
//    1 статьей; (в) русские школы ПО ГОРОДАМ — общий пост есть
//    (russkie-shkoly-za-rubezhom-dlya-detej-2026), city-level разбора нет ни
//    для одного города (проверено Дубай/Бали/Тбилиси/Лимассол/Белград/
//    Батуми) — закрыто для Дубая (крупнейший русскоязычный хаб с city_id,
//    единственная лицензированная KHDA школа по ФГОС — реальные факты и цены
//    через WebSearch, не выдуманы).
//
// Все цифры городов — из Supabase prices (после точечного фикса для 6
// городов), Numbeo 2026 для сверки. Курс ЦБ РФ на 26.08.2026 указан в
// тексте статей явно (HKD 10,7748 / CAD 61,0197 / EUR 98,5182 / AED 22,9989).
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — см. reference-relocost-vps-supabase-network-
// quirk. Мягкая пауза 5с между вставками — не долбим базу подряд (см.
// feedback-relocost-supabase-concurrency-limit).
//
// Запуск: node scripts/seed-10-night-batch8-aug-2026.mjs
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
    slug: "stoimost-zhizni-v-gonkonge-2026",
    title: "Стоимость жизни в Гонконге 2026: реальные цифры",
    tag: "Города",
    city: "hong-kong",
  },
  {
    slug: "stoimost-zhizni-v-vankuvere-2026",
    title: "Стоимость жизни в Ванкувере 2026: реальные цифры",
    tag: "Города",
    city: "vancouver",
  },
  {
    slug: "stoimost-zhizni-v-monreale-2026",
    title: "Стоимость жизни в Монреале 2026: реальные цифры",
    tag: "Города",
    city: "montreal",
  },
  {
    slug: "stoimost-zhizni-vo-florencii-2026",
    title: "Стоимость жизни во Флоренции 2026: реальные цифры",
    tag: "Города",
    city: "florence",
  },
  {
    slug: "stoimost-zhizni-v-neapole-2026",
    title: "Стоимость жизни в Неаполе 2026: реальные цифры",
    tag: "Города",
    city: "naples",
  },
  {
    slug: "stoimost-zhizni-vo-frankfurte-2026",
    title: "Стоимость жизни во Франкфурте 2026: реальные цифры",
    tag: "Города",
    city: "frankfurt",
  },
  {
    slug: "it-obrazovanie-za-rubezhom-2026",
    title: "IT-образование за рубежом 2026: куда поступить на программиста",
    tag: "Гайд",
    city: null,
  },
  {
    slug: "medicinskoe-obrazovanie-za-rubezhom-2026",
    title: "Медицинское образование за рубежом 2026: куда поступить на врача",
    tag: "Гайд",
    city: null,
  },
  {
    slug: "russkaya-shkola-v-dubae-2026",
    title: "Русская школа в Дубае 2026: программы, цены, поступление",
    tag: "Гайд",
    city: "dubai",
  },
  {
    slug: "internet-magaziny-dostavka-posylok-pri-pereezde-2026",
    title: "Заказы и доставка посылок при переезде 2026: что реально работает",
    tag: "Лайфстайл",
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

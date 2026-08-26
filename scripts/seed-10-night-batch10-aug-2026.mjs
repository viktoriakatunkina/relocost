// 10 SEO-статей блога Relocost — десятая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch9-aug-2026.mjs.
//
// Задача в два трека:
//
// 1) БУХАРЕСТ (1 статья). Из списка проблемных городов, оставшихся после
//    batch9 (город заведён в местной валюте — RON — но только часть
//    "ключевых" айтемов донасыщена в рублях прогоном 17.08, хвостовые
//    строки остались в исходной валюте ИЛИ задублированы несколькими
//    прогонами сидирования), Бухарест был единственным "среднесложным"
//    кандидатом (46 строк вместо ожидаемых ~20-35, вперемешку дубли трёх
//    волн сидирования + 6 строк в чистом RON вместо рублей). Починен
//    вручную построчно (scripts/fix-bucharest-prices.mjs, уже выполнен:
//    11 дублей удалено, 6 позиций конвертированы RON→RUB по курсу ЦБ
//    26.08.2026 — 18,7638 ₽/RON). Итог: 46 → 35 строк, без дублей и без
//    валютных багов. Гипотеза о "нераспознанном RON" подтверждена через
//    WebSearch (Numbeo/Investropa, авг 2026): городская аренда 2-комн. в
//    Бухаресте ~3250-6250 RON/мес — цена "2-комн. в центре" в базе
//    5500-9500 (якобы ₽) даёт разумную наценку за центр при пересчёте как
//    RON; билет в кино 30-50 RON, вода 1.5л 3-6 RON, консультация врача
//    120-380 RON — все совпадают с реальными румынскими ценами.
//    НЕ ТРОНУТЫ (остаются на будущий проход): Братислава (не хватает целых
//    категорий), Рио-де-Жанейро и Санья (сильно грязные, много дублей).
//    Дополнительно при проверке ~130 городов без city_id-статьи (167 из
//    175 городов имеют хотя бы одну привязанную статью) обнаружено ещё
//    4 "чистых по названию, но не по данным" кандидата — Женева,
//    Лос-Анджелес, Тенерифе, Вроцлав — у всех похожий валютный баг
//    (CHF/USD/EUR/PLN не сконвертированы в большинстве строк health/
//    entertainment/части rent и transport, только food/часть rent
//    корректны), причём хуже, чем у Бухареста (баг размазан по большему
//    числу категорий, не локализован в 1-2). Чинить не стали — вне
//    объёма сегодняшней задачи, отмечено для будущего прохода.
//
// 2) ДОБОР ДО 10 (9 статей). Проверка content/blog (grep, без тяжёлых
//    ILIKE) + точечные ILIKE по title в Supabase (по одному условию за
//    раз, с паузами — тяжёлые multi-OR запросы не использовались) по 5
//    темам из ТЗ показала:
//    - водительские права по странам — НАСЫЩЕНО (8 почти идентичных
//      статей: kak-poluchit-prava-v-drugoy-strane-2026 и другие, все
//      разбирают МВУ/обмен по EU/ОАЭ/UK/Канаде/Австралии) — пропущено,
//      добавлять 9-ю почти дублирующую статью не имеет смысла.
//    - аренда коворкинга/офиса для малого бизнеса — коворкинг закрыт
//      (kovorking-v-populyarnykh-gorodakh.md), но именно аренда ОФИСА под
//      юрлицо (юрадрес, договор аренды, free zone ОАЭ) — реальный пробел
//      (0 совпадений на "офис для бизнеса"). Написана статья.
//    - вывоз домашней библиотеки/личных вещей почтой — общая перевозка
//      вещей закрыта дважды (kak-perevezti-veshi-za-granicu.md +
//      kak-perevezti-veshchi-za-rubezh-2026.md, последняя уже упоминает
//      EMS/почту, но крайне тонко — без фокуса на книгах, таможенных
//      лимитах на посылки по странам и упаковке). Написана более глубокая
//      статья с фокусом на книгах/личных вещах и почтовых лимитах.
//    - знакомства и социализация — НАСЫЩЕНО, закрыто качественно
//      (kak-nayti-druzei-posle-pereezda.md, 8 методов + FAQ) — пропущено.
//    - спорт и фитнес-инфраструктура по городам — реальный пробел (0
//      совпадений на "фитнес" в title). Написана статья на РЕАЛЬНЫХ
//      данных prices (health/"Фитнес-клуб") по 10 городам с уже
//      проверенными чистыми ценами (9 городов batch9 + Бухарест).
//
//    Дополнительно проверены и найдены НАСЫЩЕННЫМИ (пропущены, во избежание
//    каннибализации): нострификация диплома (9), самозанятость/ИП за
//    рубежом (8), пенсии (50!), апостиль/легализация (15), домашние
//    животные при переезде (16), психология переезда (22), обустройство
//    квартиры/мебель (есть obustroistvo-kvartiry-za-rubezhom-2026),
//    воссоединение семьи/виза супруга (1, оставлено как есть).
//    Найдены и закрыты ЧИСТЫЕ пробелы (0 совпадений): хранение вещей
//    (self-storage), перевод денег за рубеж, продажа квартиры перед
//    переездом, хоумскулинг, сортировка мусора, роды за рубежом — по
//    каждой написана статья с проверкой актуальных фактов через WebSearch
//    (курсы ЦБ, лимиты СБП/Золотая Корона 2026, статус хоумскулинга по
//    странам 2026, изменения миграционных правил Аргентины DNU 366/2025).
//
// Итог состава партии (10): Бухарест (город/city_id) + 9 тематических
// статей без city_id.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — см. reference-relocost-vps-supabase-network-
// quirk. Пауза 5с между вставками — не долбим базу подряд (см.
// feedback-relocost-supabase-concurrency-limit).
//
// Запуск: node scripts/seed-10-night-batch10-aug-2026.mjs
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
    slug: "stoimost-zhizni-v-buhareste-2026",
    title: "Стоимость жизни в Бухаресте 2026: реальные цифры",
    tag: "Города",
    city: "bucharest",
  },
  {
    slug: "arenda-ofisa-dlya-malogo-biznesa-za-rubezhom-2026",
    title: "Аренда офиса для малого бизнеса за рубежом 2026",
    tag: "Работа",
    city: null,
  },
  {
    slug: "kak-peresylat-knigi-i-lichnye-veshchi-pochtoy-2026",
    title: "Как переслать книги и личные вещи почтой при переезде 2026",
    tag: "Гайд",
    city: null,
  },
  {
    slug: "sport-i-fitnes-za-rubezhom-2026",
    title: "Спорт и фитнес за рубежом 2026: инфраструктура и цены по городам",
    tag: "Образ жизни",
    city: null,
  },
  {
    slug: "hranenie-veshchey-pri-pereezde-2026",
    title: "Хранение вещей при переезде за рубеж 2026: склады и self-storage",
    tag: "Гайд",
    city: null,
  },
  {
    slug: "kak-perevesti-dengi-za-rubezh-iz-rossii-2026",
    title: "Как перевести деньги за рубеж из России 2026",
    tag: "Финансы",
    city: null,
  },
  {
    slug: "prodazha-kvartiry-pered-pereezdom-za-rubezh-2026",
    title: "Продажа квартиры в России перед переездом за рубеж 2026",
    tag: "Финансы",
    city: null,
  },
  {
    slug: "houmskuling-za-rubezhom-2026",
    title: "Хоумскулинг за рубежом 2026: где это легально, а где под запретом",
    tag: "Дети",
    city: null,
  },
  {
    slug: "sortirovka-musora-za-rubezhom-2026",
    title: "Сортировка мусора за рубежом 2026: правила по странам и что грозит за ошибку",
    tag: "Образ жизни",
    city: null,
  },
  {
    slug: "rody-za-rubezhom-2026",
    title: "Роды за рубежом 2026: где рожать, сколько стоит и что с гражданством ребёнка",
    tag: "Гайд",
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

run();

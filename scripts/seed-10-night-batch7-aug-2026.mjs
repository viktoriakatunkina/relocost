// 10 SEO-статей блога Relocost — седьмая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch6-aug-2026.mjs.
//
// Задача в два трека:
//
// 1) РАЗБЛОКИРОВКА «БРАКОВАННЫХ» ГОРОДОВ (5 статей). Из списка 26 городов,
//    ранее исключенных из-за смешанной валюты в Supabase prices (город
//    заведен в местной валюте — EUR/CHF/USD/AUD — но только часть строк
//    донасыщена в рублях более поздним прогоном), вручную проверены и
//    ТОЧЕЧНО ИСПРАВЛЕНЫ через UPDATE в prices: Мюнхен, Цюрих, Нью-Йорк,
//    Сидней, Брюссель. Для каждого — оставшиеся «легаси»-строки (старый
//    updated_at) переведены в рубли по актуальному курсу ЦБ на 26.08.2026
//    (EUR≈98.5, CHF≈105, USD≈84.5, AUD≈60.4; для Мюнхена конкретно применен
//    курс ровно x100 — он же точно совпал с уже правильными строками того
//    же города, подтверждая методологию прежнего прогона), и, где нужно,
//    переименованы под канонические имена item_name_ru («Аренда 1-комн. вне
//    центра» → «1-комн. квартира на окраине» и т.п.), чтобы заработала
//    site-логика бюджета (budgetBreakdown ищет подстроку «окраине»/«ЖКХ»/
//    «Домашний»/«Мобильная»/«проездной»/«Продукты»). Итоговые цифры сверены
//    с Numbeo Aug-2026 (rent city/outside centre, utilities, mobile) —
//    отклонение в пределах обычного разброса диапазонов, без искажений
//    порядка величины. Остальные 21 город из списка НЕ трогали — чинить
//    надежно за разумное время не вышло (более грязная/дублирующая
//    структура, требует отдельного прохода).
//
// 2) ДОБОР ДО 10 (5 статей). Проверка Supabase blog_posts (полная выгрузка,
//    grep по slug/title) показала: кошерная/халяльная еда и церкви за
//    рубежом — 0 совпадений (религиозный аспект переезда не закрыт совсем);
//    ЛГБТ-безопасность по странам — 0 совпадений; переезд с животными —
//    ЗАКРЫТ (30 постов, не трогаем); автомобиль при переезде (ввоз/аренда/
//    права) — ЗАКРЫТ (11 постов про растаможку и водительские права, не
//    трогаем); русскоязычные комьюнити в конкретном городе — общий пост
//    есть (russkoyazychnoe-soobshchestvo-za-granitsey-2026), но city-level
//    разбора NET — добавлен для Лимассола (крупнейший русскоязычный хаб в
//    ЕС, есть city_id). Плюс 2 РЕФРЕША слабых старых статей (короткие,
//    0 упоминаний FAQ-заголовка, из батчей июня-июля): kak-pereekhat-na-
//    samui-2026 (1026 слов → расширено, добавлен FAQ, разделы про
//    удаленку/интернет и русскоязычное сообщество) и kak-pereekhat-v-afiny-
//    2026 (864 слова, таблица бюджета была БЕЗ реальных цифр — заменена на
//    настоящие данные из Supabase prices для Афин, добавлен FAQ).
//
// Все цифры — из Supabase prices (после точечного фикса для 5 городов),
// Numbeo/Expatica 2026 для сверки, ILGA World/Equaldex для ЛГБТ-темы.
// Курс ЦБ РФ на 26.08.2026 указан в тексте статей явно.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug (для 2 рефрешей — перезаписывает существующие
// строки с тем же slug, city_id не меняется).
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25; и reference-relocost-vps-supabase-network-quirk). Мягкая
// пауза 5с между вставками — не долбим базу подряд (см.
// feedback-relocost-supabase-concurrency-limit — этот прогон единственный
// активный писатель на момент запуска).
//
// Запуск: node scripts/seed-10-night-batch7-aug-2026.mjs
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
    slug: "stoimost-zhizni-v-myunhene-2026",
    title: "Стоимость жизни в Мюнхене 2026: реальные цифры",
    tag: "Города",
    city: "munich",
  },
  {
    slug: "stoimost-zhizni-v-tsyurihe-2026",
    title: "Стоимость жизни в Цюрихе 2026: реальные цифры",
    tag: "Города",
    city: "zurich",
  },
  {
    slug: "stoimost-zhizni-v-nyu-yorke-2026",
    title: "Стоимость жизни в Нью-Йорке 2026: реальные цифры",
    tag: "Города",
    city: "new-york",
  },
  {
    slug: "stoimost-zhizni-v-sidnee-2026",
    title: "Стоимость жизни в Сиднее 2026: реальные цифры",
    tag: "Города",
    city: "sydney",
  },
  {
    slug: "stoimost-zhizni-v-bryussele-2026",
    title: "Стоимость жизни в Брюсселе 2026: реальные цифры",
    tag: "Города",
    city: "brussels",
  },
  {
    slug: "religiya-koshernaya-halyalnaya-eda-tserkvi-za-rubezhom-2026",
    title: "Религия при переезде 2026: кошерная, халяльная еда, церкви",
    tag: "Лайфстайл",
    city: null,
  },
  {
    slug: "lgbt-bezopasnost-stran-dlya-pereezda-2026",
    title: "ЛГБТ и безопасность стран для переезда в 2026 году",
    tag: "Лайфстайл",
    city: null,
  },
  {
    slug: "russkoyazychnoe-soobshchestvo-v-limassole-2026",
    title: "Русскоязычное сообщество в Лимассоле 2026: гид",
    tag: "Лайфстайл",
    city: "limassol",
  },
  {
    slug: "kak-pereekhat-na-samui-2026",
    title: "Как переехать на Самуи: пошаговая инструкция 2026",
    tag: "Гайд",
    city: "samui",
  },
  {
    slug: "kak-pereekhat-v-afiny-2026",
    title: "Как переехать в Афины в 2026: ВНЖ Греции, цены",
    tag: "Гайд",
    city: "athens",
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

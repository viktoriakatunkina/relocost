// 10 SEO-статей блога Relocost — девятая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch8-aug-2026.mjs.
//
// Задача в два трека:
//
// 1) РАЗБЛОКИРОВКА «БРАКОВАННЫХ» ГОРОДОВ (9 статей). Из списка 15 городов,
//    оставшихся непроверенными после batch7/8 (город заведен в местной
//    валюте — TWD/AUD/ZAR/EUR/MAD/PLN — но только 3-4 «ключевых» айтема
//    бюджет-калькулятора донасыщены в рублях прогоном 17.08, а хвостовые
//    строки — аренда, кафе, развлечения, здоровье, часть транспорта/ЖКХ —
//    остались в исходной валюте), вручную проверены и ТОЧЕЧНО ИСПРАВЛЕНЫ
//    через PATCH в prices (scripts/fix-prices-night9-batch.mjs, уже
//    выполнен, 144 строки обновлено, 0 ошибок): Тайбэй, Аделаида,
//    Йоханнесбург, Кёльн, Дюссельдорф, Касабланка, Гданьск, Фуншал,
//    Валлетта. Курс ЦБ РФ на 26.08.2026: EUR 98.5182, PLN 22.8936,
//    AUD 60.3914, ZAR 5.27518 (прямые котировки ЦБ); MAD≈9.1526 и
//    TWD≈2.6486 — оценочно, кросс-курс через USD (ЦБ USD 84.4635,
//    рыночные USD/MAD и USD/TWD на 24-25.08.2026). Тайбэй оказался
//    ОСОБЫМ случаем — прогон 17.08 почти не затронул город (только 1 из
//    20 строк была рублифицирована), пришлось конвертировать 19 строк.
//    Валлетта была ближе всего к рабочему состоянию — canonical-строка
//    «на окраине» уже была в рублях, но с городским суффиксом
//    «(Биркиркара и др.)», ломавшим точный .eq() — переименована без
//    смены суммы, плюс конвертированы 6 оставшихся легаси-строк.
//    Для каждого города проверено: .eq("item_name_ru","1-комн. квартира
//    на окраине") возвращает ровно 1 строку. Итоговые цифры сверены с
//    Numbeo Aug-2026 через WebSearch (курс USD/MAD, USD/TWD) — отклонение
//    в пределах обычного разброса диапазонов.
//
//    НЕ ТРОНУТЫ (отдельный проход): Бухарест (46 строк вместо 20 — дубли
//    от нескольких прогонов вперемешку с уже корректными каноническими
//    строками; ключевая "1-комн. на окраине" уже в рублях, но 2 rent-
//    позиции "2-комн./3-комн. в центре" явно занижены — нужна ручная
//    построчная дедупликация, не блочный пересчет). Братислава (13 строк
//    вместо 20 — не хватает целых категорий: нет "Мобильная связь", нет
//    "Домашний интернет", это баг другого рода, не только валюта).
//    Рио-де-Жанейро (69 строк) и Санья (89 строк) — по заметке из batch8,
//    дубли от нескольких прогонов, чинить не пытались.
//
// 2) ДОБОР ДО 10 (1 статья). Проверка content/blog (grep по ключевым
//    словам вместо тяжелого ILIKE-запроса к Supabase — во время работы
//    поймали аномальную задержку 18.9с/40.5с на простом select, сделали
//    паузу ~40с до восстановления нормального времени ответа 0.5-2.6с,
//    дальше использовали только легкие point-запросы) показала: страхование
//    имущества/гражданской ответственности при переезде — 0 совпадений,
//    реальный пробел (медстраховка встречается в 243 статьях, но
//    Hausratversicherung/Haftpflichtversicherung/renters insurance — нигде).
//    Остальные 4 идеи из ТЗ оказались уже насыщены: аренда офиса для
//    бизнеса — есть "kovorking-v-populyarnykh-gorodakh.md", но это про
//    коворкинг-места для фрилансеров, не про регистрацию офиса под бизнес
//    (частичное пересечение, не 0); языковые курсы — 19 совпадений
//    (в основном упоминания внутри других статей, не отдельная статья
//    "курсы для взрослых", пограничный случай); перевозка вещей/контейнер —
//    ЗАКРЫТ (kak-perevezti-veshi-za-granicu.md, 1144 слова, разбирает
//    контейнер/авиабагаж/транспортные компании с ценами); второе
//    гражданство/паспорт за инвестиции — ЗАКРЫТ (grazhdanstvo-za-
//    investicii.md, vtoroy-pasport-dlya-rossiyan-2026.md). Выбран
//    единственный чистый (0 совпадений) пробел — страхование имущества.
//
// Все цифры городов — из Supabase prices (после точечного фикса для 9
// городов), Numbeo/рыночные курсы для сверки. Курс ЦБ РФ на 26.08.2026
// указан в тексте статей явно.
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — см. reference-relocost-vps-supabase-network-
// quirk. Мягкая пауза 5с между вставками — не долбим базу подряд (см.
// feedback-relocost-supabase-concurrency-limit — учтено, что в эту ночь
// параллельно могут работать другие агенты).
//
// Запуск: node scripts/seed-10-night-batch9-aug-2026.mjs
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
    slug: "stoimost-zhizni-v-tajbee-2026",
    title: "Стоимость жизни в Тайбэе 2026: реальные цифры",
    tag: "Города",
    city: "taipei",
  },
  {
    slug: "stoimost-zhizni-v-adelaide-2026",
    title: "Стоимость жизни в Аделаиде 2026: реальные цифры",
    tag: "Города",
    city: "adelaide",
  },
  {
    slug: "stoimost-zhizni-v-iohannesburge-2026",
    title: "Стоимость жизни в Йоханнесбурге 2026: реальные цифры",
    tag: "Города",
    city: "johannesburg",
  },
  {
    slug: "stoimost-zhizni-v-kelne-2026",
    title: "Стоимость жизни в Кёльне 2026: реальные цифры",
    tag: "Города",
    city: "cologne",
  },
  {
    slug: "stoimost-zhizni-v-dyusseldorfe-2026",
    title: "Стоимость жизни в Дюссельдорфе 2026: реальные цифры",
    tag: "Города",
    city: "dusseldorf",
  },
  {
    slug: "stoimost-zhizni-v-kasablanke-2026",
    title: "Стоимость жизни в Касабланке 2026: реальные цифры",
    tag: "Города",
    city: "casablanca",
  },
  {
    slug: "stoimost-zhizni-v-gdanske-2026",
    title: "Стоимость жизни в Гданьске 2026: реальные цифры",
    tag: "Города",
    city: "gdansk",
  },
  {
    slug: "stoimost-zhizni-v-funshale-2026",
    title: "Стоимость жизни в Фуншале 2026: реальные цифры",
    tag: "Города",
    city: "funchal",
  },
  {
    slug: "stoimost-zhizni-v-vallette-2026",
    title: "Стоимость жизни в Валлетте 2026: реальные цифры",
    tag: "Города",
    city: "valletta",
  },
  {
    slug: "strahovanie-imushchestva-otvetstvennosti-pri-pereezde-2026",
    title: "Страхование имущества и ответственности при переезде 2026",
    tag: "Финансы",
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

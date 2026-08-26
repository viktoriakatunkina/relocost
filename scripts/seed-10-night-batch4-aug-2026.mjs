// 10 SEO-статей блога Relocost — четвертая ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-night-batch3-aug-2026.mjs
// (Рига/Вильнюс/Херцег-Нови/Убуд/Кейптаун/Бангалор/Мумбаи/Токио/Сингапур/
// Монтевидео).
//
// Города выбраны по критерию: 0 city_id-статей в blog_posts на момент отбора
// + чистые данные в prices, проверено вручную тремя способами:
//   1) ratio min/max между дублирующимися строками одного товара;
//   2) правдоподобие абсолютных величин в рублях по каждой позиции —
//      исключены Кельн/Монреаль/Лос-Анджелес/Флоренция/Франкфурт/
//      Дюссельдорф/Аделаида/Женева/Наполи/Нью-Йорк/Ванкувер/Брюссель
//      (аренда в сырой местной валюте, а не в рублях — тот же паттерн,
//      что и у ранее исключенных Братиславы/Тенерифе/Касабланки/Мюнхена/
//      Цюриха/Вроцлава/Гонконга/Сиднея/Фуншала/Бухареста), а также
//      Гданьск (аренда в сырых злотых) и Тайбэй (аренда в сырых TWD) —
//      подтверждено сверкой с Numbeo и пересчетом по курсу. Йоханнесбург
//      исключен как пограничный случай (аренда ниже ожидаемой при
//      пересчете из ZAR примерно в 2.5-3 раза, паттерн не бьется чисто
//      ни с "все ок", ни с "сырая валюта" — решили не рисковать). Валлетта
//      исключена явно — часть строк аренды в сырых евро вперемешку с
//      конвертированными рублями. Санья и Рио-де-Жанейро исключены по
//      известному браку аренды (ratio >10x), см. предыдущие партии;
//   3) кросс-сверка с Numbeo (Reykjavik/Taipei/Gdansk/Johannesburg/
//      Ljubljana/Tallinn/Merida/Chennai/Yogyakarta) и с уже опубликованными
//      бенчмарками Relocost (Bangalore, Ubud) для проверки внутренней
//      согласованности индийских и индонезийских цифр.
// Города и углы:
//   - Ченнаи (Индия) — южноиндийский промышленный город, бесплатная
//     e-Visa с 2026, дешевле и спокойнее Бангалора
//   - Дели (Индия) — столица, единственный индийский город с прямым
//     рейсом Аэрофлота из Москвы, честно про смог и безопасность
//   - Пондичерри (Индия) — французская колония, йога/Ауровиль, сравнение
//     бюджета с Гоа
//   - Ломбок (Индонезия) — тихая и дешевая альтернатива Бали, острова Гили
//   - Медан (Индонезия) — Суматра, самый дешевый крупный город страны,
//     озеро Тоба
//   - Семиньяк (Бали, Индонезия) — премиум-пляжный район, сравнение
//     с Убудом и Чангу
//   - Любляна (Словения) — шенгенская виза все еще реально работает
//     для россиян в 2026, в отличие от Балтии
//   - Таллин (Эстония) — честно про визовый тупик с 2022, сравнение
//     с Ригой и Вильнюсом (внутренние ссылки на обе статьи)
//   - Рейкьявик (Исландия) — самый дорогой город партии, консульство
//     закрыто с 2023, виза через другую страну Шенгена
//   - Мерида (Мексика) — безвиз 180 дней с бесплатным SAE, самый
//     безопасный крупный город Мексики
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25). Мягкая пауза 4с между вставками — не долбим базу подряд.
//
// Запуск: node scripts/seed-10-night-batch4-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  {
    slug: "chennai-stoimost-zhizni-2026",
    title: "Ченнаи 2026: стоимость жизни и бесплатная виза в Индию",
    tag: "Города",
    city: "chennai",
  },
  {
    slug: "deli-stoimost-zhizni-2026",
    title: "Дели 2026: стоимость жизни в столице Индии и бесплатная виза",
    tag: "Города",
    city: "delhi",
  },
  {
    slug: "pondicherri-stoimost-zhizni-2026",
    title: "Пондичерри 2026: французская Индия — бюджет жизни и виза",
    tag: "Города",
    city: "pondicherry",
  },
  {
    slug: "lombok-byudzhet-zhizni-2026",
    title: "Ломбок 2026: бюджет жизни — тихая альтернатива Бали",
    tag: "Удаленная работа",
    city: "lombok",
  },
  {
    slug: "medan-stoimost-zhizni-2026",
    title: "Медан 2026: стоимость жизни на Суматре для переезда",
    tag: "Города",
    city: "medan",
  },
  {
    slug: "seminyak-byudzhet-zhizni-2026",
    title: "Семиньяк 2026: бюджет жизни на престижном берегу Бали",
    tag: "Удаленная работа",
    city: "seminyak",
  },
  {
    slug: "lyublyana-stoimost-zhizni-2026",
    title: "Любляна 2026: стоимость жизни в Словении и шенгенская виза",
    tag: "Финансы",
    city: "ljubljana",
  },
  {
    slug: "tallin-stoimost-zhizni-2026",
    title: "Таллин 2026: стоимость жизни в Эстонии и визовый тупик",
    tag: "Визы",
    city: "tallinn",
  },
  {
    slug: "reikyavik-stoimost-zhizni-2026",
    title: "Рейкьявик 2026: самый дорогой город Европы и виза",
    tag: "Финансы",
    city: "reykjavik",
  },
  {
    slug: "merida-stoimost-zhizni-2026",
    title: "Мерида 2026: безопасный город Мексики — бюджет без визы",
    tag: "Города",
    city: "merida",
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

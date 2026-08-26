// 10 SEO-статей блога Relocost — третья ночная партия (26 августа 2026),
// продолжение ночной кампании после seed-10-second-tier-cities-aug-2026.mjs
// (Москва/Екатеринбург/Пафос/Лимассол/Валенсия/Малага/Измир/Кишинев/
// Подгорица-Будва/Пенанг) и seed-10-night-batch2-aug-2026.mjs (Шарм-эль-Шейх/
// Плая-дель-Кармен/Себу/Катманду/Сус/Манама/Аликанте/Сиемреап/Пномпень/Скопье).
//
// Города выбраны по критерию: 0 city_id-статей в blog_posts на момент отбора
// + чистые данные в prices, проверено вручную двумя способами:
//   1) ratio min/max между дублирующимися строками одного товара (нет
//      дублей ни в одном из 10 городов — все свежие карточки без брака);
//   2) правдоподобие абсолютных величин в рублях по каждой позиции —
//      обнаружено и отсеяно несколько городов с несконвертированной
//      локальной валютой в отдельных строках (Братислава — почти весь
//      датасет в сырых евро, Тенерифе и Касабланка — аренда/студия в
//      сырых евро/дирхамах вперемешку с рублями, Мюнхен/Цюрих/Вроцлав/
//      Гонконг/Сидней/Фуншал/Бухарест — аналогичный брак минимум на одной
//      строке аренды). Все они исключены из этой партии, несмотря на
//      формальный 0 city_id. Санья и Рио-де-Жанейро исключены по
//      известному браку аренды (ratio >10x), см. предыдущие партии.
// Города и углы:
//   - Рига (Латвия) — цены + честно о визовом тупике для россиян с 2022
//   - Вильнюс (Литва) — цены + финтех-рынок труда, сравнение с Ригой
//   - Херцег-Нови (Черногория) — тише и дешевле Будвы, сравнение с
//     Будвой/Подгорицей (внутренние ссылки на обе статьи)
//   - Убуд (Бали, Индонезия) — бюджет фрилансера/йога-туриста, отдельно
//     от прибрежных Чангу/Семиньяка
//   - Кейптаун (ЮАР) — безвиз 90 дней, курсовой арбитраж для дохода в валюте
//   - Бангалор (Индия) — IT-бюджет + бесплатная e-Visa для россиян с 2026
//   - Мумбаи (Индия) — деловая столица, отличается от IT-угла Бангалора
//   - Токио (Япония) — виза Highly Skilled Professional + прямые рейсы
//     Владивосток-Токио
//   - Сингапур — самый дорогой город Азии, отдельный угол от уже
//     существующих статей про EP/PR (даем ссылку, не дублируем)
//   - Монтевидео (Уругвай) — безвиз 90 дней, самый доступный бюджет партии
//
// Формат файлов — SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---.
// Идемпотентно: upsert по slug.
//
// ВАЖНО: используем сырой REST fetch с явным таймаутом + повторными
// попытками (не supabase-js) — под нагрузкой на Supabase supabase-js может
// зависать без внятного таймаута (см. reference-relocost-vps, инцидент
// 2026-08-25). Мягкая пауза 4с между вставками — не долбим базу подряд.
//
// Запуск: node scripts/seed-10-night-batch3-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  {
    slug: "riga-stoimost-zhizni-2026",
    title: "Рига 2026: стоимость жизни, виза и ВНЖ для россиян",
    tag: "Финансы",
    city: "riga",
  },
  {
    slug: "vilnius-stoimost-zhizni-2026",
    title: "Вильнюс 2026: стоимость жизни в Литве и виза для россиян",
    tag: "Финансы",
    city: "vilnius",
  },
  {
    slug: "herceg-novi-deshevle-budvy-2026",
    title: "Херцег-Нови 2026: тише и дешевле Будвы — сравниваем цены",
    tag: "Города",
    city: "herceg-novi",
  },
  {
    slug: "ubud-bali-byudzhet-frilansera-2026",
    title: "Убуд на Бали 2026: бюджет для фрилансера и йога-туриста",
    tag: "Удаленная работа",
    city: "ubud",
  },
  {
    slug: "keiptaun-stoimost-zhizni-2026",
    title: "Кейптаун 2026: стоимость жизни для тех, кто зарабатывает в валюте",
    tag: "Финансы",
    city: "cape-town",
  },
  {
    slug: "bangalor-it-stolitsa-byudzhet-2026",
    title: "Бангалор 2026: IT-столица Индии — бюджет для айтишника",
    tag: "Удаленная работа",
    city: "bangalore",
  },
  {
    slug: "mumbai-stoimost-zhizni-2026",
    title: "Мумбаи 2026: деловая столица Индии — сколько стоит жизнь",
    tag: "Города",
    city: "mumbai",
  },
  {
    slug: "tokio-viza-hsp-byudzhet-2026",
    title: "Токио 2026: виза HSP для специалистов и бюджет жизни",
    tag: "Визы",
    city: "tokyo",
  },
  {
    slug: "singapur-samyj-dorogoj-gorod-2026",
    title: "Сингапур 2026: самый дорогой город Азии — сколько нужно денег",
    tag: "Финансы",
    city: "singapore",
  },
  {
    slug: "montevideo-tihaya-zhizn-2026",
    title: "Монтевидео 2026: тихая и безопасная жизнь в Уругвае",
    tag: "Города",
    city: "montevideo",
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

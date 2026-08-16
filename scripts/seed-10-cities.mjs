/**
 * Seed 10 новых городов: Краков, Милан, Мюнхен, Лондон, Тайбэй,
 * Осака, Валлетта, Торонто, Вроцлав, Тенерифе.
 *
 * Для каждого города:
 *   1. upsert в cities (onConflict: slug)
 *   2. delete + insert 20 записей в prices
 *   3. скачать фото Unsplash → залить в Storage bucket "photos" → обновить image_url + unsplash_url
 *
 * Запуск: node scripts/seed-10-cities.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const H = os.homedir();
const r = (f) => fs.readFileSync(path.join(H, ".relocost", f), "utf8").trim();

const sb = createClient(r("supabase_url"), r("supabase_service_role_key"), {
  auth: { persistSession: false },
});
const UNSPLASH_KEY = r("unsplash_access_key");
const BUCKET = "photos";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const norm = (u) => (u ? u.split("?")[0] : u);
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);

function storageUrl(objectPath) {
  return sb.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

// ─── Unsplash search → первое landscape-фото ─────────────────────────────────
async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!res.ok) throw new Error(`Unsplash (${query}): HTTP ${res.status}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    photo_id: pick.id,
    base_url: pick.urls.raw,
    author_name: pick.user.name,
    author_url: pick.user.links.html,
  };
}

// ─── Скачать с Unsplash CDN и залить в Supabase Storage ──────────────────────
async function transferToStorage(baseUrl) {
  const objectPath = `u/${hash(norm(baseUrl))}.jpg`;
  const dl = `${norm(baseUrl)}?w=1600&q=80&fm=jpg&fit=max&auto=format`;
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(dl, { signal: AbortSignal.timeout(45000) });
      if (res.status === 429 || res.status === 403) {
        await sleep(4000 * (attempt + 1));
        lastErr = `HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) { lastErr = `HTTP ${res.status}`; break; }
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) { lastErr = `not image (${ct})`; break; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024) { lastErr = `too small (${buf.length}b)`; break; }
      const { error } = await sb.storage.from(BUCKET).upload(objectPath, buf, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: true,
      });
      if (error) { lastErr = `storage: ${error.message}`; break; }
      return storageUrl(objectPath);
    } catch (e) {
      lastErr = e.message;
      await sleep(3000 * (attempt + 1));
    }
  }
  throw new Error(`transferToStorage failed for ${baseUrl}: ${lastErr}`);
}

// ─── Данные городов ───────────────────────────────────────────────────────────
const CITIES = [
  {
    name_ru: "Краков",
    name_en: "Krakow",
    slug: "krakow",
    country_ru: "Польша",
    country_en: "Poland",
    country_slug: "poland",
    flag_emoji: "🇵🇱",
    population: "800 тыс",
    climate: "+9°C ср.",
    language: "Польский",
    currency: "Польский злотый, PLN",
    flight_from_moscow: "3 часа",
    is_foreign: true,
    difficulty_score: 2,
    is_popular: true,
    lat: 50.0647,
    lng: 19.9450,
    seo_title: "Стоимость жизни в Кракове в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Кракове? Аренда от 1800 PLN, цены на еду, транспорт и ЖКХ 2026. Реальный бюджет переехавшего в Польшу.",
    intro_text: "Второй по величине город Польши с богатой историей и низкими (по меркам ЕС) ценами. Популярен среди IT-релокантов: развитой рынок труда, много русскоязычного сообщества, архитектура Старого города.",
    unsplash_query: "krakow old town market square",
  },
  {
    name_ru: "Милан",
    name_en: "Milan",
    slug: "milan",
    country_ru: "Италия",
    country_en: "Italy",
    country_slug: "italy",
    flag_emoji: "🇮🇹",
    population: "1.4 млн",
    climate: "+13°C ср.",
    language: "Итальянский",
    currency: "Евро, EUR",
    flight_from_moscow: "4 часа",
    is_foreign: true,
    difficulty_score: 3,
    is_popular: true,
    lat: 45.4642,
    lng: 9.1900,
    seo_title: "Стоимость жизни в Милане в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Милане? Аренда от 900 EUR, цены на еду, транспорт и ЖКХ 2026. Деловая и финансовая столица Италии.",
    intro_text: "Деловая и финансовая столица Италии, центр моды и дизайна. Дороже Рима, но больше возможностей для работы в крупных компаниях. Хорошо развитый общественный транспорт.",
    unsplash_query: "milan city centro italy",
  },
  {
    name_ru: "Мюнхен",
    name_en: "Munich",
    slug: "munich",
    country_ru: "Германия",
    country_en: "Germany",
    country_slug: "germany",
    flag_emoji: "🇩🇪",
    population: "1.5 млн",
    climate: "+9°C ср.",
    language: "Немецкий",
    currency: "Евро, EUR",
    flight_from_moscow: "3.5 часа",
    is_foreign: true,
    difficulty_score: 3,
    is_popular: true,
    lat: 48.1351,
    lng: 11.5820,
    seo_title: "Стоимость жизни в Мюнхене в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Мюнхене? Аренда от 1300 EUR, цены на еду, транспорт и ЖКХ 2026. Самый дорогой крупный город Германии.",
    intro_text: "Самый дорогой крупный город Германии с высоким уровнем жизни и зарплат. Центр IT, инженерии и биотеха. Близко к Альпам, богатая культурная жизнь.",
    unsplash_query: "munich marienplatz bavaria",
  },
  {
    name_ru: "Лондон",
    name_en: "London",
    slug: "london",
    country_ru: "Великобритания",
    country_en: "United Kingdom",
    country_slug: "united-kingdom",
    flag_emoji: "🇬🇧",
    population: "9 млн",
    climate: "+11°C ср.",
    language: "Английский",
    currency: "Фунт стерлингов, GBP",
    flight_from_moscow: "4 часа (нет прямых)",
    is_foreign: true,
    difficulty_score: 5,
    is_popular: true,
    lat: 51.5074,
    lng: -0.1278,
    seo_title: "Стоимость жизни в Лондоне в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Лондоне? Аренда от 1400 GBP, цены на еду, транспорт и ЖКХ 2026. Крупнейший финансовый центр Европы.",
    intro_text: "Крупнейший финансовый и культурный центр Европы. Требует визы (стандартная рабочая виза или виза таланта), но дает доступ к высоким зарплатам. Очень дорого, но с хорошим доходом — комфортно.",
    unsplash_query: "london cityscape thames tower bridge",
  },
  {
    name_ru: "Тайбэй",
    name_en: "Taipei",
    slug: "taipei",
    country_ru: "Тайвань",
    country_en: "Taiwan",
    country_slug: "taiwan",
    flag_emoji: "🇹🇼",
    population: "2.7 млн",
    climate: "+23°C ср.",
    language: "Мандаринский китайский",
    currency: "Тайваньский доллар, TWD",
    flight_from_moscow: "11 часов",
    is_foreign: true,
    difficulty_score: 3,
    is_popular: true,
    lat: 25.0330,
    lng: 121.5654,
    seo_title: "Стоимость жизни в Тайбэе в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Тайбэе? Аренда от 12000 TWD, цены на еду, транспорт и ЖКХ 2026. Хаб цифровых кочевников в Азии.",
    intro_text: "Хаб цифровых кочевников в Азии: быстрый интернет, безопасность, современная инфраструктура, интересная азиатская кухня. Виза по прилету на 30-90 дней для россиян.",
    unsplash_query: "taipei city skyline night",
  },
  {
    name_ru: "Осака",
    name_en: "Osaka",
    slug: "osaka",
    country_ru: "Япония",
    country_en: "Japan",
    country_slug: "japan",
    flag_emoji: "🇯🇵",
    population: "2.7 млн",
    climate: "+16°C ср.",
    language: "Японский",
    currency: "Японская иена, JPY",
    flight_from_moscow: "9 часов",
    is_foreign: true,
    difficulty_score: 4,
    is_popular: true,
    lat: 34.6937,
    lng: 135.5023,
    seo_title: "Стоимость жизни в Осаке в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Осаке? Аренда от 55000 JPY, цены на еду, транспорт и ЖКХ 2026. Гастрономическая столица Японии.",
    intro_text: "Гастрономическая столица Японии: дешевле Токио на 20-30%, более расслабленная атмосфера. Кухня (окономияки, такояки), близость к Киото и Наре. Популярен среди аниме-фанатов и гурманов.",
    unsplash_query: "osaka japan city dotonbori",
  },
  {
    name_ru: "Валлетта",
    name_en: "Valletta",
    slug: "valletta",
    country_ru: "Мальта",
    country_en: "Malta",
    country_slug: "malta",
    flag_emoji: "🇲🇹",
    population: "6 тыс (вся Мальта: 530 тыс)",
    climate: "+19°C ср.",
    language: "Мальтийский, английский",
    currency: "Евро, EUR",
    flight_from_moscow: "3.5 часа",
    is_foreign: true,
    difficulty_score: 3,
    is_popular: true,
    lat: 35.8989,
    lng: 14.5146,
    seo_title: "Стоимость жизни в Валлетте (Мальта) в 2026 году — калькулятор | Relocost",
    seo_description: "Сколько стоит жить в Валлетте? Аренда от 800 EUR, цены на еду, транспорт и ЖКХ 2026. Островное государство ЕС с английским языком.",
    intro_text: "Маленькое островное государство в Средиземноморье с английским языком и статусом страны ЕС. Популярна за программу ВНЖ по инвестициям и мягкий климат. Работа преимущественно в финтехе, игорном и ИТ-секторе.",
    unsplash_query: "valletta malta mediterranean",
  },
  {
    name_ru: "Торонто",
    name_en: "Toronto",
    slug: "toronto",
    country_ru: "Канада",
    country_en: "Canada",
    country_slug: "canada",
    flag_emoji: "🇨🇦",
    population: "6 млн (агломерация)",
    climate: "+8°C ср.",
    language: "Английский, французский",
    currency: "Канадский доллар, CAD",
    flight_from_moscow: "12 часов",
    is_foreign: true,
    difficulty_score: 5,
    is_popular: true,
    lat: 43.6532,
    lng: -79.3832,
    seo_title: "Стоимость жизни в Торонто в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Торонто? Аренда от 1600 CAD, цены на еду, транспорт и ЖКХ 2026. Крупнейший город Канады.",
    intro_text: "Крупнейший город Канады с мультикультурным населением и сильным рынком труда (IT, финансы, медицина). Иммиграция через Express Entry или провинциальные программы. Дороже Монреаля, но больше возможностей.",
    unsplash_query: "toronto skyline cn tower",
  },
  {
    name_ru: "Вроцлав",
    name_en: "Wroclaw",
    slug: "wroclaw",
    country_ru: "Польша",
    country_en: "Poland",
    country_slug: "poland",
    flag_emoji: "🇵🇱",
    population: "640 тыс",
    climate: "+9°C ср.",
    language: "Польский",
    currency: "Польский злотый, PLN",
    flight_from_moscow: "3 часа",
    is_foreign: true,
    difficulty_score: 2,
    is_popular: true,
    lat: 51.1079,
    lng: 17.0385,
    seo_title: "Стоимость жизни во Вроцлаве в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить во Вроцлаве? Аренда от 1600 PLN, цены на еду, транспорт и ЖКХ 2026. Четвертый город Польши.",
    intro_text: "Четвертый город Польши на берегу Одры — «Польская Венеция» с 12 островами и 130 мостами. Развивающийся IT-кластер, дешевле Варшавы и Кракова. Хорошо развитая инфраструктура и университетская среда.",
    unsplash_query: "wroclaw market square poland",
  },
  {
    name_ru: "Тенерифе",
    name_en: "Tenerife",
    slug: "tenerife",
    country_ru: "Испания",
    country_en: "Spain",
    country_slug: "spain",
    flag_emoji: "🇪🇸",
    population: "920 тыс",
    climate: "+22°C ср.",
    language: "Испанский",
    currency: "Евро, EUR",
    flight_from_moscow: "6 часов (нет прямых)",
    is_foreign: true,
    difficulty_score: 3,
    is_popular: true,
    lat: 28.2916,
    lng: -16.6291,
    seo_title: "Стоимость жизни на Тенерифе в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить на Тенерифе? Аренда от 650 EUR, цены на еду, транспорт и ЖКХ 2026. Канарский остров с вечным летом.",
    intro_text: "Крупнейший остров Канарского архипелага с вечным летом: +22°C круглый год. Часть Испании (ЕС), безвизовый въезд для шенгена. Популярен у цифровых кочевников за климат, цены ниже Барселоны и Мадрида, и пляжи.",
    unsplash_query: "tenerife canary island beach teide",
  },
];

// ─── Цены (20 позиций на город) ───────────────────────────────────────────────
// Формат: [category, item_name_ru, price_min, price_max, is_premium]
// Все цены в МЕСТНОЙ ВАЛЮТЕ.
const PRICES = {
  krakow: [
    // Аренда (PLN)
    ["rent", "1-комн. квартира в центре", 2500, 3500, false],
    ["rent", "1-комн. квартира на окраине", 1800, 2500, false],
    ["rent", "2-комн. квартира в центре", 3500, 5000, false],
    ["rent", "Комната в квартире", 1200, 1800, false],
    ["rent", "Студия (каваларка) в центре", 2200, 3200, false],
    // Еда (PLN)
    ["food", "Обед в кафе", 35, 55, false],
    ["food", "Ужин на двоих в ресторане", 120, 200, false],
    ["food", "Капучино", 13, 20, false],
    ["food", "Продукты на месяц на 1 человека", 1500, 2000, false],
    ["food", "Бизнес-ланч", 30, 50, false],
    // Транспорт (PLN)
    ["transport", "Месячный проездной (MPK)", 110, 140, false],
    ["transport", "Такси (5 км)", 18, 28, false],
    ["transport", "Бензин (1 л)", 7, 8, false],
    // ЖКХ и связь (PLN)
    ["utilities", "ЖКХ за 1-комн. квартиру", 500, 900, false],
    ["utilities", "Домашний интернет (100 Мбит)", 60, 90, false],
    ["utilities", "Мобильная связь (месяц)", 30, 60, false],
    // Медицина (PLN)
    ["health", "Визит к частному врачу", 150, 250, true],
    ["health", "Фитнес-клуб (месяц)", 100, 180, true],
    // Развлечения (PLN)
    ["entertainment", "Кино (билет)", 30, 45, false],
    ["entertainment", "Ресторан для двоих (с вином)", 150, 250, false],
  ],

  milan: [
    // Аренда (EUR)
    ["rent", "1-комн. квартира в центре", 1400, 1900, false],
    ["rent", "1-комн. квартира на окраине", 900, 1300, false],
    ["rent", "2-комн. квартира в центре", 2000, 2800, false],
    ["rent", "Комната в квартире", 700, 1000, false],
    ["rent", "Студия в центре", 1200, 1700, false],
    // Еда (EUR)
    ["food", "Обед в кафе (меню дня)", 15, 25, false],
    ["food", "Ужин на двоих в ресторане", 60, 100, false],
    ["food", "Капучино", 2, 3, false],
    ["food", "Продукты на месяц на 1 человека", 400, 600, false],
    ["food", "Пицца (одна порция)", 10, 18, false],
    // Транспорт (EUR)
    ["transport", "Месячный проездной (ATM)", 39, 39, false],
    ["transport", "Такси (5 км)", 15, 22, false],
    ["transport", "Бензин (1 л)", 2, 2, false],
    // ЖКХ и связь (EUR)
    ["utilities", "ЖКХ за 1-комн. квартиру", 150, 250, false],
    ["utilities", "Домашний интернет (100 Мбит)", 25, 40, false],
    ["utilities", "Мобильная связь (месяц)", 10, 25, false],
    // Медицина (EUR)
    ["health", "Визит к частному врачу", 80, 150, true],
    ["health", "Фитнес-клуб (месяц)", 50, 90, true],
    // Развлечения (EUR)
    ["entertainment", "Кино (билет)", 10, 15, false],
    ["entertainment", "Ресторан для двоих (с вином)", 80, 140, false],
  ],

  munich: [
    // Аренда (EUR)
    ["rent", "1-комн. квартира в центре", 1800, 2400, false],
    ["rent", "1-комн. квартира на окраине", 1300, 1800, false],
    ["rent", "2-комн. квартира в центре", 2400, 3400, false],
    ["rent", "Комната в квартире (WG)", 900, 1300, false],
    ["rent", "Студия в центре", 1600, 2200, false],
    // Еда (EUR)
    ["food", "Обед в кафе / Mittagessen", 15, 22, false],
    ["food", "Ужин на двоих в ресторане", 60, 100, false],
    ["food", "Капучино", 3, 5, false],
    ["food", "Продукты на месяц на 1 человека", 400, 550, false],
    ["food", "Bratwurst с пивом в биргартене", 12, 20, false],
    // Транспорт (EUR)
    ["transport", "Месячный проездной (MVV, внутр. зона)", 57, 57, false],
    ["transport", "Такси (5 км)", 15, 22, false],
    ["transport", "Бензин (1 л)", 2, 2, false],
    // ЖКХ и связь (EUR)
    ["utilities", "ЖКХ за 1-комн. квартиру", 200, 320, false],
    ["utilities", "Домашний интернет (100 Мбит)", 30, 50, false],
    ["utilities", "Мобильная связь (месяц)", 15, 35, false],
    // Медицина (EUR)
    ["health", "Визит к частному врачу", 80, 180, true],
    ["health", "Фитнес-клуб (месяц)", 50, 100, true],
    // Развлечения (EUR)
    ["entertainment", "Кино (билет)", 12, 18, false],
    ["entertainment", "Ресторан для двоих (с вином)", 90, 160, false],
  ],

  london: [
    // Аренда (GBP)
    ["rent", "1-комн. квартира в центре", 2000, 2800, false],
    ["rent", "1-комн. квартира на окраине", 1400, 2000, false],
    ["rent", "2-комн. квартира в центре", 2800, 4200, false],
    ["rent", "Комната в квартире (HMO)", 900, 1400, false],
    ["rent", "Студия в центре", 1800, 2500, false],
    // Еда (GBP)
    ["food", "Обед в кафе", 15, 25, false],
    ["food", "Ужин на двоих в ресторане", 70, 130, false],
    ["food", "Капучино", 4, 6, false],
    ["food", "Продукты на месяц на 1 человека", 400, 600, false],
    ["food", "Фиш-энд-чипс (порция)", 10, 18, false],
    // Транспорт (GBP)
    ["transport", "Месячный проездной (Zones 1-2, TfL)", 180, 180, false],
    ["transport", "Такси (5 км)", 18, 30, false],
    ["transport", "Бензин (1 л)", 2, 2, false],
    // ЖКХ и связь (GBP)
    ["utilities", "ЖКХ за 1-комн. квартиру", 200, 350, false],
    ["utilities", "Домашний интернет (100 Мбит)", 30, 55, false],
    ["utilities", "Мобильная связь (месяц)", 15, 40, false],
    // Медицина (GBP)
    ["health", "Визит к частному врачу", 100, 250, true],
    ["health", "Фитнес-клуб (месяц)", 60, 120, true],
    // Развлечения (GBP)
    ["entertainment", "Кино (билет)", 14, 22, false],
    ["entertainment", "Ресторан для двоих (с вином)", 100, 180, false],
  ],

  taipei: [
    // Аренда (TWD)
    ["rent", "1-комн. квартира в центре", 18000, 25000, false],
    ["rent", "1-комн. квартира на окраине", 12000, 18000, false],
    ["rent", "2-комн. квартира в центре", 25000, 40000, false],
    ["rent", "Комната в квартире", 8000, 14000, false],
    ["rent", "Студия у метро", 16000, 23000, false],
    // Еда (TWD)
    ["food", "Обед в кафе (бентобокс)", 150, 250, false],
    ["food", "Ужин на двоих в ресторане", 800, 1800, false],
    ["food", "Капучино", 120, 180, false],
    ["food", "Продукты на месяц на 1 человека", 8000, 12000, false],
    ["food", "Тарелка лапши в нудл-шопе", 80, 150, false],
    // Транспорт (TWD)
    ["transport", "Месячный проездной (MRT)", 1280, 1600, false],
    ["transport", "Такси (5 км)", 200, 350, false],
    ["transport", "Бензин (1 л)", 35, 40, false],
    // ЖКХ и связь (TWD)
    ["utilities", "ЖКХ за 1-комн. квартиру", 2000, 4000, false],
    ["utilities", "Домашний интернет (100 Мбит)", 500, 800, false],
    ["utilities", "Мобильная связь (месяц)", 500, 900, false],
    // Медицина (TWD)
    ["health", "Визит к частному врачу", 500, 1500, true],
    ["health", "Фитнес-клуб (месяц)", 1200, 2500, true],
    // Развлечения (TWD)
    ["entertainment", "Кино (билет)", 300, 400, false],
    ["entertainment", "Ресторан для двоих (с напитками)", 1000, 2500, false],
  ],

  osaka: [
    // Аренда (JPY)
    ["rent", "1-комн. квартира в центре", 80000, 120000, false],
    ["rent", "1-комн. квартира на окраине", 55000, 80000, false],
    ["rent", "2-комн. квартира в центре", 120000, 180000, false],
    ["rent", "Комната в маншоне", 40000, 65000, false],
    ["rent", "Студия в центре", 70000, 110000, false],
    // Еда (JPY)
    ["food", "Обед в кафе (тейшоку)", 800, 1500, false],
    ["food", "Ужин на двоих в ресторане", 5000, 10000, false],
    ["food", "Капучино", 500, 800, false],
    ["food", "Продукты на месяц на 1 человека", 40000, 60000, false],
    ["food", "Такояки (порция 8 шт.)", 400, 700, false],
    // Транспорт (JPY)
    ["transport", "Месячный проездной (Osaka Metro)", 8000, 12000, false],
    ["transport", "Такси (5 км)", 2000, 3500, false],
    ["transport", "Бензин (1 л)", 175, 210, false],
    // ЖКХ и связь (JPY)
    ["utilities", "ЖКХ за 1-комн. квартиру", 15000, 25000, false],
    ["utilities", "Домашний интернет (100 Мбит)", 4000, 6000, false],
    ["utilities", "Мобильная связь (месяц)", 3000, 6000, false],
    // Медицина (JPY)
    ["health", "Визит к частному врачу", 5000, 10000, true],
    ["health", "Фитнес-клуб (месяц)", 8000, 15000, true],
    // Развлечения (JPY)
    ["entertainment", "Кино (билет)", 1900, 2200, false],
    ["entertainment", "Ресторан для двоих (с напитками)", 8000, 18000, false],
  ],

  valletta: [
    // Аренда (EUR)
    ["rent", "1-комн. квартира в Валлетте / Слиме", 1100, 1600, false],
    ["rent", "1-комн. квартира на окраине (Биркиркара и др.)", 800, 1200, false],
    ["rent", "2-комн. квартира в центре", 1500, 2200, false],
    ["rent", "Комната в квартире", 500, 900, false],
    ["rent", "Студия в Гзире (вид на яхты)", 1000, 1500, false],
    // Еда (EUR)
    ["food", "Обед в кафе (пастицци + кофе)", 12, 20, false],
    ["food", "Ужин на двоих в ресторане", 50, 90, false],
    ["food", "Капучино", 2, 3, false],
    ["food", "Продукты на месяц на 1 человека", 300, 450, false],
    ["food", "Пастицци (традиционная выпечка)", 1, 2, false],
    // Транспорт (EUR)
    ["transport", "Месячный проездной (автобус Malta Public Transport)", 26, 26, false],
    ["transport", "Такси (5 км)", 12, 20, false],
    ["transport", "Бензин (1 л)", 2, 2, false],
    // ЖКХ и связь (EUR)
    ["utilities", "ЖКХ за 1-комн. квартиру", 100, 180, false],
    ["utilities", "Домашний интернет (100 Мбит)", 25, 40, false],
    ["utilities", "Мобильная связь (месяц)", 15, 30, false],
    // Медицина (EUR)
    ["health", "Визит к частному врачу", 50, 120, true],
    ["health", "Фитнес-клуб (месяц)", 40, 80, true],
    // Развлечения (EUR)
    ["entertainment", "Кино (билет)", 10, 14, false],
    ["entertainment", "Ресторан для двоих (с вином)", 70, 130, false],
  ],

  toronto: [
    // Аренда (CAD)
    ["rent", "1-комн. квартира в центре (Downtown)", 2200, 3000, false],
    ["rent", "1-комн. квартира на окраине", 1600, 2200, false],
    ["rent", "2-комн. квартира в центре", 3000, 4200, false],
    ["rent", "Комната в квартире", 1000, 1500, false],
    ["rent", "Студия в центре", 1900, 2600, false],
    // Еда (CAD)
    ["food", "Обед в кафе", 18, 28, false],
    ["food", "Ужин на двоих в ресторане", 80, 140, false],
    ["food", "Капучино", 5, 8, false],
    ["food", "Продукты на месяц на 1 человека", 500, 700, false],
    ["food", "Poutine (порция)", 14, 22, false],
    // Транспорт (CAD)
    ["transport", "Месячный проездной (TTC)", 156, 156, false],
    ["transport", "Такси (5 км)", 18, 28, false],
    ["transport", "Бензин (1 л)", 2, 2, false],
    // ЖКХ и связь (CAD)
    ["utilities", "ЖКХ за 1-комн. квартиру", 150, 250, false],
    ["utilities", "Домашний интернет (100 Мбит)", 60, 90, false],
    ["utilities", "Мобильная связь (месяц)", 60, 100, false],
    // Медицина (CAD)
    ["health", "Визит к частному врачу", 100, 250, true],
    ["health", "Фитнес-клуб (месяц)", 60, 120, true],
    // Развлечения (CAD)
    ["entertainment", "Кино (билет)", 15, 22, false],
    ["entertainment", "Ресторан для двоих (с напитками)", 100, 180, false],
  ],

  wroclaw: [
    // Аренда (PLN)
    ["rent", "1-комн. квартира в центре", 2200, 3200, false],
    ["rent", "1-комн. квартира на окраине", 1600, 2200, false],
    ["rent", "2-комн. квартира в центре", 3200, 4500, false],
    ["rent", "Комната в квартире", 1100, 1700, false],
    ["rent", "Студия в центре", 2000, 2900, false],
    // Еда (PLN)
    ["food", "Обед в кафе", 30, 50, false],
    ["food", "Ужин на двоих в ресторане", 100, 180, false],
    ["food", "Капучино", 12, 18, false],
    ["food", "Продукты на месяц на 1 человека", 1200, 1800, false],
    ["food", "Флячки или пиероги (порция)", 25, 40, false],
    // Транспорт (PLN)
    ["transport", "Месячный проездной (MPK Wroclaw)", 110, 130, false],
    ["transport", "Такси (5 км)", 18, 28, false],
    ["transport", "Бензин (1 л)", 7, 8, false],
    // ЖКХ и связь (PLN)
    ["utilities", "ЖКХ за 1-комн. квартиру", 450, 800, false],
    ["utilities", "Домашний интернет (100 Мбит)", 55, 85, false],
    ["utilities", "Мобильная связь (месяц)", 30, 55, false],
    // Медицина (PLN)
    ["health", "Визит к частному врачу", 150, 250, true],
    ["health", "Фитнес-клуб (месяц)", 100, 170, true],
    // Развлечения (PLN)
    ["entertainment", "Кино (билет)", 28, 42, false],
    ["entertainment", "Ресторан для двоих (с пивом)", 140, 240, false],
  ],

  tenerife: [
    // Аренда (EUR)
    ["rent", "1-комн. квартира в центре (Санта-Крус)", 900, 1400, false],
    ["rent", "1-комн. квартира на окраине", 650, 1000, false],
    ["rent", "2-комн. квартира в центре", 1200, 1900, false],
    ["rent", "Комната в квартире", 450, 750, false],
    ["rent", "Студия у моря (Лас-Америкас, Адехе)", 850, 1300, false],
    // Еда (EUR)
    ["food", "Обед в кафе (menu del dia)", 10, 18, false],
    ["food", "Ужин на двоих в ресторане", 50, 90, false],
    ["food", "Капучино", 2, 3, false],
    ["food", "Продукты на месяц на 1 человека", 300, 450, false],
    ["food", "Папас аррugadas (традиционное блюдо)", 6, 12, false],
    // Транспорт (EUR)
    ["transport", "Месячный проездной (TITSA)", 30, 50, false],
    ["transport", "Такси (5 км)", 10, 16, false],
    ["transport", "Бензин (1 л)", 2, 2, false],
    // ЖКХ и связь (EUR)
    ["utilities", "ЖКХ за 1-комн. квартиру", 80, 150, false],
    ["utilities", "Домашний интернет (100 Мбит)", 30, 50, false],
    ["utilities", "Мобильная связь (месяц)", 15, 30, false],
    // Медицина (EUR)
    ["health", "Визит к частному врачу", 60, 130, true],
    ["health", "Фитнес-клуб (месяц)", 35, 70, true],
    // Развлечения (EUR)
    ["entertainment", "Кино (билет)", 8, 13, false],
    ["entertainment", "Ресторан для двоих (с вином)", 60, 110, false],
  ],
};

// ─── Основной цикл ────────────────────────────────────────────────────────────
async function run() {
  console.log("Seed 10 городов стартует...\n");

  let citiesAdded = 0;
  let citiesSkipped = 0;
  let pricesTotal = 0;
  let photosUploaded = 0;

  for (const c of CITIES) {
    // 1. Проверить, существует ли уже город
    const { data: existing } = await sb
      .from("cities")
      .select("id, unsplash_url, image_url")
      .eq("slug", c.slug)
      .maybeSingle();

    let cityId;
    let isNew = false;

    if (existing) {
      cityId = existing.id;
      console.log(`~ существует: ${c.slug} (id=${cityId})`);
      citiesSkipped++;
    } else {
      // 2. Вставить город (без фото пока)
      const row = {
        name_ru: c.name_ru,
        name_en: c.name_en,
        slug: c.slug,
        country_ru: c.country_ru,
        country_en: c.country_en,
        country_slug: c.country_slug,
        flag_emoji: c.flag_emoji,
        population: c.population,
        climate: c.climate,
        language: c.language,
        currency: c.currency,
        flight_from_moscow: c.flight_from_moscow,
        is_foreign: c.is_foreign,
        difficulty_score: c.difficulty_score,
        is_popular: c.is_popular,
        lat: c.lat,
        lng: c.lng,
        seo_title: c.seo_title,
        seo_description: c.seo_description,
        intro_text: c.intro_text,
      };
      const { data: inserted, error: insertErr } = await sb
        .from("cities")
        .insert(row)
        .select("id")
        .single();
      if (insertErr) {
        console.error(`  ! ошибка вставки ${c.slug}: ${insertErr.message}`);
        continue;
      }
      cityId = inserted.id;
      isNew = true;
      console.log(`+ добавлен: ${c.name_ru} (${c.slug})`);
      citiesAdded++;
    }

    // 3. Цены — всегда пересоздать (delete + insert) чтобы не дублировать
    const { error: delErr } = await sb
      .from("prices")
      .delete()
      .eq("city_id", cityId);
    if (delErr) {
      console.warn(`  ! не удалось удалить старые цены для ${c.slug}: ${delErr.message}`);
    }

    const priceRows = (PRICES[c.slug] || []).map(
      ([category, item_name_ru, price_min, price_max, is_premium]) => ({
        city_id: cityId,
        category,
        item_name_ru,
        price_min: Math.round(price_min),
        price_max: Math.round(price_max),
        is_premium,
      })
    );

    if (priceRows.length) {
      const { error: priceErr } = await sb.from("prices").insert(priceRows);
      if (priceErr) {
        console.error(`  ! ошибка цен ${c.slug}: ${priceErr.message}`);
      } else {
        pricesTotal += priceRows.length;
        console.log(`  цены: ${priceRows.length} позиций`);
      }
    }

    // 4. Фото — скачать с Unsplash и залить в Storage
    // (для существующих городов тоже обновляем если нет image_url)
    const needsPhoto = !existing?.image_url;
    if (needsPhoto) {
      try {
        console.log(`  фото: ищем "${c.unsplash_query}"...`);
        const photo = await fetchUnsplash(c.unsplash_query);

        if (photo) {
          console.log(`  фото: нашли ${photo.photo_id} by ${photo.author_name}, заливаем в Storage...`);
          const storUrl = await transferToStorage(photo.base_url);

          const { error: photoErr } = await sb
            .from("cities")
            .update({
              unsplash_photo_id: photo.photo_id,
              unsplash_url: storUrl,      // перезаписываем сразу Storage URL
              image_url: storUrl,
              unsplash_author_name: photo.author_name,
              unsplash_author_url: photo.author_url,
            })
            .eq("id", cityId);

          if (photoErr) {
            console.warn(`  ! ошибка обновления фото ${c.slug}: ${photoErr.message}`);
          } else {
            console.log(`  фото: залито → Storage`);
            photosUploaded++;
          }
        } else {
          console.warn(`  ! фото не найдено на Unsplash для "${c.unsplash_query}"`);
        }
      } catch (e) {
        console.warn(`  ! ошибка фото ${c.slug}: ${e.message}`);
      }

      // Пауза между Unsplash-запросами
      await sleep(1500);
    } else {
      console.log(`  фото: уже есть (${existing.image_url})`);
    }

    console.log("");
  }

  console.log("════════════════════════════════════════");
  console.log(`Готово:`);
  console.log(`  Городов добавлено:    ${citiesAdded}`);
  console.log(`  Городов обновлено:    ${citiesSkipped}`);
  console.log(`  Позиций цен:          ${pricesTotal}`);
  console.log(`  Фото загружено:       ${photosUploaded}`);
  console.log("════════════════════════════════════════");
}

run().catch((e) => {
  console.error("КРИТИЧЕСКАЯ ОШИБКА:", e.message);
  process.exit(1);
});

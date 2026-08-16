// Seed 20 новых городов: Флоренция, Цюрих, Гамбург, Франкфурт, Ницца,
// Копенгаген, Стокгольм, Хельсинки, Гданьск, Неаполь,
// Ванкувер, Монреаль, Майами, Нью-Йорк, Лос-Анджелес, Тулум,
// Сантьяго, Найроби, Касабланка, Фуншал.
// Запуск: node scripts/seed-20-cities.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const HOME = os.homedir();
const dot = (n) => fs.readFileSync(path.join(HOME, ".relocost", n), "utf8").trim();

const SUPA_URL    = dot("supabase_url");
const SUPA_KEY    = dot("supabase_service_role_key");
const UNSPLASH    = dot("unsplash_access_key");
const R2_ACCOUNT  = dot("r2_account_id");
const R2_ACCESS   = dot("r2_access_key_id");
const R2_SECRET   = dot("r2_secret_key");
const R2_BUCKET   = dot("r2_bucket");
const R2_PUB_URL  = dot("r2_public_url");
const R2_ENDPOINT = `https://${R2_ACCOUNT}.r2.cloudflarestorage.com`;

const sb = createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: false } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── R2 helpers ────────────────────────────────────────────────────────────────
function hmac(key, msg, enc) {
  const k = typeof key === "string" ? Buffer.from(key, "utf8") : key;
  return crypto.createHmac("sha256", k).update(msg, "utf8").digest(enc || "");
}

async function r2Request(method, key, buffer = null) {
  const now  = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const ts   = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
  const bodyHash = buffer
    ? crypto.createHash("sha256").update(buffer).digest("hex")
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const hdrs = {
    host: `${R2_ACCOUNT}.r2.cloudflarestorage.com`,
    "x-amz-date": ts,
    "x-amz-content-sha256": bodyHash,
    ...(buffer ? { "content-type": "image/jpeg" } : {}),
  };
  const sk  = Object.keys(hdrs).sort();
  const ch  = sk.map((k) => `${k}:${hdrs[k]}\n`).join("");
  const sh  = sk.join(";");
  const cr  = [method, `/${R2_BUCKET}/${key}`, "", ch, sh, bodyHash].join("\n");
  const sc  = `${date}/auto/s3/aws4_request`;
  const sts = ["AWS4-HMAC-SHA256", ts, sc,
    crypto.createHash("sha256").update(cr).digest("hex")].join("\n");
  const sk2 = hmac(hmac(hmac(hmac(`AWS4${R2_SECRET}`, date), "auto"), "s3"), "aws4_request");
  const sig = crypto.createHmac("sha256", sk2).update(sts).digest("hex");
  const auth = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS}/${sc},SignedHeaders=${sh},Signature=${sig}`;
  const url  = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const opts = { method, headers: { ...hdrs, Authorization: auth } };
  if (buffer) { opts.body = buffer; opts.duplex = "half"; }
  const res = await fetch(url, opts);
  if (method === "HEAD") return res.ok;
  if (!res.ok) throw new Error(`R2 ${method} ${res.status}: ${await res.text()}`);
  return res;
}

async function existsInR2(key) { return r2Request("HEAD", key); }
async function uploadToR2(key, buffer) { return r2Request("PUT", key, buffer); }

// ─── Unsplash helper ────────────────────────────────────────────────────────────
async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status} for "${query}"`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    photo_id: pick.id,
    raw_url: pick.urls.raw,
    author_name: pick.user.name,
    author_url: pick.user.links.html,
  };
}

// Скачать фото с Unsplash CDN и залить в R2, вернуть R2-URL
async function downloadAndUpload(rawUrl, slug) {
  const key = `city/${slug}.jpg`;
  if (await existsInR2(key)) {
    console.log(`    R2 cache hit: ${key}`);
    return `${R2_PUB_URL}/${key}`;
  }
  const dl = `${rawUrl}?w=1600&q=80&fm=jpg&fit=max&auto=format`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(dl, { signal: AbortSignal.timeout(40000) });
      if (!res.ok) { await sleep(2000); continue; }
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) throw new Error(`not image: ${ct}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 4096) throw new Error(`too small: ${buf.length}b`);
      await uploadToR2(key, buf);
      return `${R2_PUB_URL}/${key}`;
    } catch (e) {
      console.warn(`    attempt ${attempt + 1} failed: ${e.message}`);
      await sleep(2000 * (attempt + 1));
    }
  }
  return null;
}

// ─── Данные городов ─────────────────────────────────────────────────────────────
const YEAR = 2026;

const CITIES = [
  // Европа
  {
    name_ru: "Флоренция", name_en: "Florence", slug: "florence",
    country_ru: "Италия", country_en: "Italy", country_slug: "italy", flag_emoji: "🇮🇹",
    population: "370 тыс", climate: "+14°C ср.", language: "Итальянский", currency: "Евро, EUR",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 3, is_popular: true,
    intro_text: "Культурная столица Тосканы с крупнейшей в мире концентрацией произведений искусства. Дороже Рима, но размером с крупный районный центр. Популярна у арт-директоров, дизайнеров и фрилансеров.",
    lat: 43.7696, lng: 11.2558, unsplash_query: "florence italy ponte vecchio",
  },
  {
    name_ru: "Цюрих", name_en: "Zurich", slug: "zurich",
    country_ru: "Швейцария", country_en: "Switzerland", country_slug: "switzerland", flag_emoji: "🇨🇭",
    population: "430 тыс", climate: "+10°C ср.", language: "Немецкий/Английский", currency: "Швейцарский франк, CHF",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Финансовая столица Швейцарии — один из самых дорогих городов мира. Зарплаты IT и финансов компенсируют стоимость: 120-200k CHF/год — норма. Швейцарские банки до сих пор открывают счета россиянам при наличии ВНЖ.",
    lat: 47.3769, lng: 8.5417, unsplash_query: "zurich switzerland lake city",
  },
  {
    name_ru: "Гамбург", name_en: "Hamburg", slug: "hamburg",
    country_ru: "Германия", country_en: "Germany", country_slug: "germany", flag_emoji: "🇩🇪",
    population: "1.9 млн", climate: "+10°C ср.", language: "Немецкий", currency: "Евро, EUR",
    flight_from_moscow: "3 часа", is_foreign: true, difficulty_score: 3, is_popular: true,
    intro_text: "Второй по величине город Германии и крупнейший порт страны. Либеральная атмосфера, морской колорит, развитая культурная сцена. Дешевле Мюнхена на 20-30%, больше возможностей для работы в логистике, медиа, IT.",
    lat: 53.5511, lng: 9.9937, unsplash_query: "hamburg germany speicherstadt",
  },
  {
    name_ru: "Франкфурт", name_en: "Frankfurt", slug: "frankfurt",
    country_ru: "Германия", country_en: "Germany", country_slug: "germany", flag_emoji: "🇩🇪",
    population: "760 тыс", climate: "+11°C ср.", language: "Немецкий", currency: "Евро, EUR",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 3, is_popular: true,
    intro_text: "Финансовый центр Европы с крупнейшим аэропортом региона. Штаб-квартира ЕЦБ, Deutsche Bank, Commerzbank. Деловой и немного скучный снаружи, но с отличной транспортной доступностью и высокими зарплатами.",
    lat: 50.1109, lng: 8.6821, unsplash_query: "frankfurt germany skyline",
  },
  {
    name_ru: "Ницца", name_en: "Nice", slug: "nice",
    country_ru: "Франция", country_en: "France", country_slug: "france", flag_emoji: "🇫🇷",
    population: "340 тыс", climate: "+16°C ср.", language: "Французский", currency: "Евро, EUR",
    flight_from_moscow: "4.5 часа", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Столица Лазурного берега на границе с Монако и Италией. Мягкий средиземноморский климат, пляжи, высокий уровень жизни. Дешевле Парижа на 30-40%. Популярна у пенсионеров и удаленных работников с европейским ВНЖ.",
    lat: 43.7102, lng: 7.2620, unsplash_query: "nice france riviera promenade",
  },
  {
    name_ru: "Копенгаген", name_en: "Copenhagen", slug: "copenhagen",
    country_ru: "Дания", country_en: "Denmark", country_slug: "denmark", flag_emoji: "🇩🇰",
    population: "800 тыс", climate: "+9°C ср.", language: "Датский/Английский", currency: "Датская крона, DKK",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Столица Дании с самым высоким в Европе рейтингом качества жизни. Велосипедный город, хюгге, дизайн-мышление. Один из самых дорогих городов континента, но зарплаты также одни из высших в Европе.",
    lat: 55.6761, lng: 12.5683, unsplash_query: "copenhagen denmark nyhavn",
  },
  {
    name_ru: "Стокгольм", name_en: "Stockholm", slug: "stockholm",
    country_ru: "Швеция", country_en: "Sweden", country_slug: "sweden", flag_emoji: "🇸🇪",
    population: "1 млн", climate: "+8°C ср.", language: "Шведский/Английский", currency: "Шведская крона, SEK",
    flight_from_moscow: "3 часа", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Столица Швеции и один из главных tech-хабов Европы (Spotify, Klarna, King, Mojang). Город на 14 островах, чистый, безопасный, с развитым рынком IT-труда. Шведский не обязателен в IT-секторе.",
    lat: 59.3293, lng: 18.0686, unsplash_query: "stockholm sweden gamla stan",
  },
  {
    name_ru: "Хельсинки", name_en: "Helsinki", slug: "helsinki",
    country_ru: "Финляндия", country_en: "Finland", country_slug: "finland", flag_emoji: "🇫🇮",
    population: "660 тыс", climate: "+6°C ср.", language: "Финский/Шведский", currency: "Евро, EUR",
    flight_from_moscow: "2 часа", is_foreign: true, difficulty_score: 3, is_popular: true,
    intro_text: "Ближайшая к России европейская столица: паром из Санкт-Петербурга за 12 часов. Финляндия — лидер по индексу счастья, чистоте и безопасности. Хороший выбор для IT-специалистов с желанием переехать в ЕС без лишнего шума.",
    lat: 60.1699, lng: 24.9384, unsplash_query: "helsinki finland architecture",
  },
  {
    name_ru: "Гданьск", name_en: "Gdansk", slug: "gdansk",
    country_ru: "Польша", country_en: "Poland", country_slug: "poland", flag_emoji: "🇵🇱",
    population: "490 тыс", climate: "+9°C ср.", language: "Польский", currency: "Польский злотый, PLN",
    flight_from_moscow: "3 часа", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Портовый город на Балтийском море с историческим старым городом. Дешевле Варшавы и Кракова, развивается быстро. Популярен у IT-релокантов и семей. Рядом — морские курорты Сопот и Гдыня.",
    lat: 54.3520, lng: 18.6466, unsplash_query: "gdansk poland old town",
  },
  {
    name_ru: "Неаполь", name_en: "Naples", slug: "naples",
    country_ru: "Италия", country_en: "Italy", country_slug: "italy", flag_emoji: "🇮🇹",
    population: "1 млн", climate: "+16°C ср.", language: "Итальянский", currency: "Евро, EUR",
    flight_from_moscow: "4.5 часа", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Одна из самых дешевых столиц юга Европы. Родина пиццы, мощная гастросцена, Везувий и Помпеи рядом. Шумный, хаотичный, но невероятно живой. Идеален для тех, кто хочет Италию без итальянских цен.",
    lat: 40.8518, lng: 14.2681, unsplash_query: "naples italy vesuvius",
  },
  // Северная Америка
  {
    name_ru: "Ванкувер", name_en: "Vancouver", slug: "vancouver",
    country_ru: "Канада", country_en: "Canada", country_slug: "canada", flag_emoji: "🇨🇦",
    population: "2.5 млн", climate: "+11°C ср.", language: "Английский", currency: "Канадский доллар, CAD",
    flight_from_moscow: "13 часов", is_foreign: true, difficulty_score: 5, is_popular: true,
    intro_text: "Самый «теплый» крупный город Канады на берегу Тихого океана. Крупная азиатская диаспора, горные лыжи в получасе езды. Дороже Монреаля, но мягче климат. Иммиграция — через провинциальную программу BC PNP или Express Entry.",
    lat: 49.2827, lng: -123.1207, unsplash_query: "vancouver canada mountains",
  },
  {
    name_ru: "Монреаль", name_en: "Montreal", slug: "montreal",
    country_ru: "Канада", country_en: "Canada", country_slug: "canada", flag_emoji: "🇨🇦",
    population: "4.2 млн", climate: "+7°C ср.", language: "Французский/Английский", currency: "Канадский доллар, CAD",
    flight_from_moscow: "10 часов", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Самый европейский город Северной Америки с двуязычной культурой. Значительно дешевле Торонто и Ванкувера. Сильный IT-сектор (Ubisoft, Shopify), доступный жилищный рынок и знаменитая гастросцена. Зима холодная, но инфраструктура к ней приспособлена.",
    lat: 45.5017, lng: -73.5673, unsplash_query: "montreal canada city",
  },
  {
    name_ru: "Майами", name_en: "Miami", slug: "miami",
    country_ru: "США", country_en: "USA", country_slug: "usa", flag_emoji: "🇺🇸",
    population: "6.2 млн", climate: "+25°C ср.", language: "Английский/Испанский", currency: "Доллар США, USD",
    flight_from_moscow: "14 часов", is_foreign: true, difficulty_score: 5, is_popular: true,
    intro_text: "Финансовая столица Латинской Америки на территории США. Круглогодичное лето, океан, латинская культура. Крупнейшая русскоязычная диаспора во Флориде. Налоги штата Флорида одни из самых низких в стране — нет подоходного налога штата.",
    lat: 25.7617, lng: -80.1918, unsplash_query: "miami florida ocean drive",
  },
  {
    name_ru: "Нью-Йорк", name_en: "New York", slug: "new-york",
    country_ru: "США", country_en: "USA", country_slug: "usa", flag_emoji: "🇺🇸",
    population: "8.3 млн", climate: "+13°C ср.", language: "Английский", currency: "Доллар США, USD",
    flight_from_moscow: "13 часов", is_foreign: true, difficulty_score: 5, is_popular: true,
    intro_text: "Деловая и культурная столица мира. Миллион возможностей и столь же высокая стоимость жизни. Крупная русскоязычная диаспора (Брайтон-Бич). Въезд требует визы или ESTA. Для IT-специалистов — H-1B виза, для предпринимателей — E-2 инвестиционная.",
    lat: 40.7128, lng: -74.0060, unsplash_query: "new york city skyline manhattan",
  },
  {
    name_ru: "Лос-Анджелес", name_en: "Los Angeles", slug: "los-angeles",
    country_ru: "США", country_en: "USA", country_slug: "usa", flag_emoji: "🇺🇸",
    population: "4 млн", climate: "+21°C ср.", language: "Английский", currency: "Доллар США, USD",
    flight_from_moscow: "14 часов", is_foreign: true, difficulty_score: 5, is_popular: true,
    intro_text: "Город кино, солнца и свободы. Центр мировой киноиндустрии, крупный IT-хаб (Силиконовый пляж). Автомобильный город — без машины неудобно. Калифорния дорогая, но самые высокие зарплаты в IT в мире.",
    lat: 34.0522, lng: -118.2437, unsplash_query: "los angeles california",
  },
  {
    name_ru: "Тулум", name_en: "Tulum", slug: "tulum",
    country_ru: "Мексика", country_en: "Mexico", country_slug: "mexico", flag_emoji: "🇲🇽",
    population: "35 тыс", climate: "+27°C ср.", language: "Испанский", currency: "Мексиканское песо, MXN",
    flight_from_moscow: "15 часов", is_foreign: true, difficulty_score: 3, is_popular: true,
    intro_text: "Главный хаб цифровых кочевников в Латинской Америке. Карибское море, джунгли, ценники ниже Мехико в пересчете на комфорт. Огромное международное экспат-сообщество, коворкинги, yoga-retreats. Безвизово 180 дней, легко продлевается.",
    lat: 20.2114, lng: -87.4654, unsplash_query: "tulum mexico beach jungle",
  },
  // Латинская Америка
  {
    name_ru: "Сантьяго", name_en: "Santiago", slug: "santiago",
    country_ru: "Чили", country_en: "Chile", country_slug: "chile", flag_emoji: "🇨🇱",
    population: "7 млн", climate: "+14°C ср.", language: "Испанский", currency: "Чилийское песо, CLP",
    flight_from_moscow: "18 часов", is_foreign: true, difficulty_score: 4, is_popular: false,
    intro_text: "Самый развитый город Южной Америки. Стабильная экономика, высокий уровень жизни по региональным меркам, чистый и безопасный центр. Виза для россиян не нужна до 90 дней. Растущий IT-сектор, испанский обязателен.",
    lat: -33.4489, lng: -70.6693, unsplash_query: "santiago chile andes city",
  },
  // Африка
  {
    name_ru: "Найроби", name_en: "Nairobi", slug: "nairobi",
    country_ru: "Кения", country_en: "Kenya", country_slug: "kenya", flag_emoji: "🇰🇪",
    population: "4.4 млн", climate: "+20°C ср.", language: "Суахили/Английский", currency: "Кенийский шиллинг, KES",
    flight_from_moscow: "9 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Восходящий хаб цифровых кочевников в Африке с Nomad Digital Visa до 2 лет. Быстрый 4G/5G, теплый климат, сафари в 3 часах езды. Англоязычная среда, активная стартап-экосистема. Цены в 3-4 раза ниже Европы.",
    lat: -1.2921, lng: 36.8219, unsplash_query: "nairobi kenya city",
  },
  // Марокко
  {
    name_ru: "Касабланка", name_en: "Casablanca", slug: "casablanca",
    country_ru: "Марокко", country_en: "Morocco", country_slug: "morocco", flag_emoji: "🇲🇦",
    population: "4 млн", climate: "+18°C ср.", language: "Арабский/Французский", currency: "Марокканский дирхам, MAD",
    flight_from_moscow: "5.5 часов", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Экономическая столица Марокко и крупнейший деловой центр Северной Африки. Теплый климат круглый год, близость к Европе (паром до Испании 1 час), доступные цены. Французский язык открывает двери для профессионалов.",
    lat: 33.5731, lng: -7.5898, unsplash_query: "casablanca morocco city",
  },
  // Португалия (Мадейра)
  {
    name_ru: "Фуншал", name_en: "Funchal", slug: "funchal",
    country_ru: "Португалия", country_en: "Portugal", country_slug: "portugal", flag_emoji: "🇵🇹",
    population: "110 тыс", climate: "+20°C ср.", language: "Португальский", currency: "Евро, EUR",
    flight_from_moscow: "6 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица острова Мадейра (автономный регион Португалии, ЕС). Субтропический климат 12 месяцев в году, без массового туризма. Специальный налоговый режим для резидентов (20% фиксированный НДФЛ). Популярен у цифровых кочевников и NHR-получателей из ЕС.",
    lat: 32.6669, lng: -16.9241, unsplash_query: "funchal madeira portugal",
  },
];

// ─── Цены по городам ────────────────────────────────────────────────────────────
// Категории (check constraint): rent, food, transport, utilities, cafe, health, entertainment
// Формат: [category, item_name_ru, price_min, price_max]
const PRICES = {
  florence: [
    ["rent", "Аренда 1-комн. в центре", 1200, 1800],
    ["rent", "Аренда 1-комн. вне центра", 800, 1200],
    ["rent", "Аренда 2-комн. в центре", 1800, 2800],
    ["utilities", "Коммунальные услуги", 120, 200],
    ["food", "Обед в кафе", 12, 20],
    ["food", "Продукты на месяц", 350, 500],
    ["cafe", "Кофе", 1, 2],
    ["food", "Бизнес-ланч", 15, 25],
    ["transport", "Месячный проездной", 40, 50],
    ["transport", "Такси 5 км", 12, 20],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 25, 40],
    ["utilities", "Мобильная связь", 10, 20],
    ["health", "Фитнес-клуб/мес", 50, 80],
    ["entertainment", "Кино", 10, 15],
    ["entertainment", "Ресторан на двоих", 50, 100],
    ["entertainment", "Музей Уффици (билет)", 20, 30],
    ["entertainment", "Экскурсия по Тоскане", 60, 120],
    ["food", "Пицца (ресторан)", 8, 15],
    ["rent", "Аренда комнаты", 500, 800],
  ],
  zurich: [
    ["rent", "Аренда 1-комн. в центре", 2800, 3800],
    ["rent", "Аренда 1-комн. вне центра", 2000, 2800],
    ["rent", "Аренда 2-комн. в центре", 3800, 5500],
    ["utilities", "Коммунальные услуги", 200, 350],
    ["food", "Обед в кафе", 20, 35],
    ["food", "Продукты на месяц", 600, 900],
    ["cafe", "Кофе", 4, 7],
    ["food", "Бизнес-ланч", 25, 40],
    ["transport", "Месячный проездной", 100, 110],
    ["transport", "Такси 5 км", 20, 35],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 50, 80],
    ["utilities", "Мобильная связь", 25, 50],
    ["health", "Фитнес-клуб/мес", 80, 150],
    ["entertainment", "Кино", 18, 25],
    ["entertainment", "Ресторан на двоих", 100, 200],
    ["entertainment", "Музей (средний)", 15, 30],
    ["entertainment", "Ски-пасс (день)", 80, 120],
    ["cafe", "Пиво в баре", 7, 12],
    ["rent", "Аренда комнаты", 1200, 1800],
  ],
  hamburg: [
    ["rent", "Аренда 1-комн. в центре", 1400, 2000],
    ["rent", "Аренда 1-комн. вне центра", 1000, 1500],
    ["rent", "Аренда 2-комн. в центре", 2000, 3000],
    ["utilities", "Коммунальные услуги", 150, 250],
    ["food", "Обед в кафе", 10, 18],
    ["food", "Продукты на месяц", 300, 450],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 12, 22],
    ["transport", "Месячный проездной", 75, 90],
    ["transport", "Такси 5 км", 12, 20],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 30, 50],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 40, 80],
    ["entertainment", "Кино", 12, 17],
    ["entertainment", "Ресторан на двоих", 60, 120],
    ["entertainment", "Гамбургский музей (билет)", 12, 18],
    ["entertainment", "Концерт (средний)", 30, 80],
    ["food", "Рыбный рынок (обед)", 8, 15],
    ["rent", "Аренда комнаты", 600, 1000],
  ],
  frankfurt: [
    ["rent", "Аренда 1-комн. в центре", 1600, 2200],
    ["rent", "Аренда 1-комн. вне центра", 1100, 1600],
    ["rent", "Аренда 2-комн. в центре", 2200, 3200],
    ["utilities", "Коммунальные услуги", 160, 270],
    ["food", "Обед в кафе", 10, 18],
    ["food", "Продукты на месяц", 300, 450],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 12, 22],
    ["transport", "Месячный проездной", 80, 100],
    ["transport", "Такси 5 км", 12, 22],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 30, 50],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 45, 90],
    ["entertainment", "Кино", 12, 18],
    ["entertainment", "Ресторан на двоих", 60, 130],
    ["entertainment", "Прогулка по набережной", 0, 0],
    ["entertainment", "Штедель-музей (билет)", 16, 16],
    ["cafe", "Яблочное вино (Apfelwein)", 2, 5],
    ["rent", "Аренда комнаты", 700, 1100],
  ],
  nice: [
    ["rent", "Аренда 1-комн. в центре", 1100, 1700],
    ["rent", "Аренда 1-комн. вне центра", 800, 1200],
    ["rent", "Аренда 2-комн. в центре", 1700, 2600],
    ["utilities", "Коммунальные услуги", 100, 180],
    ["food", "Обед в кафе", 12, 20],
    ["food", "Продукты на месяц", 300, 450],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 15, 25],
    ["transport", "Месячный проездной", 40, 55],
    ["transport", "Такси 5 км", 12, 22],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 30, 45],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 40, 80],
    ["entertainment", "Кино", 10, 15],
    ["entertainment", "Ресторан на двоих", 60, 130],
    ["entertainment", "Пляж (лежак)", 20, 40],
    ["entertainment", "Монако (поездка)", 5, 10],
    ["food", "Сокка (фастфуд)", 3, 6],
    ["rent", "Аренда комнаты", 500, 900],
  ],
  copenhagen: [
    ["rent", "Аренда 1-комн. в центре", 12000, 16000],
    ["rent", "Аренда 1-комн. вне центра", 8000, 12000],
    ["rent", "Аренда 2-комн. в центре", 16000, 24000],
    ["utilities", "Коммунальные услуги", 1200, 2000],
    ["food", "Обед в кафе", 120, 200],
    ["food", "Продукты на месяц", 3000, 4500],
    ["cafe", "Кофе", 40, 70],
    ["food", "Бизнес-ланч", 150, 250],
    ["transport", "Месячный проездной", 500, 650],
    ["transport", "Такси 5 км", 100, 200],
    ["transport", "Бензин 1 л", 15, 18],
    ["utilities", "Интернет 100 Мбит/с", 200, 350],
    ["utilities", "Мобильная связь", 100, 200],
    ["health", "Фитнес-клуб/мес", 400, 700],
    ["entertainment", "Кино", 110, 160],
    ["entertainment", "Ресторан на двоих", 600, 1200],
    ["entertainment", "Тиволи (вход)", 150, 200],
    ["entertainment", "Аренда велосипеда (мес)", 400, 700],
    ["cafe", "Пиво в баре", 70, 120],
    ["rent", "Аренда комнаты", 5000, 8000],
  ],
  stockholm: [
    ["rent", "Аренда 1-комн. в центре", 14000, 20000],
    ["rent", "Аренда 1-комн. вне центра", 10000, 14000],
    ["rent", "Аренда 2-комн. в центре", 20000, 30000],
    ["utilities", "Коммунальные услуги", 1000, 1800],
    ["food", "Обед в кафе", 120, 200],
    ["food", "Продукты на месяц", 3000, 4500],
    ["cafe", "Кофе", 40, 70],
    ["food", "Бизнес-ланч", 150, 250],
    ["transport", "Месячный проездной", 1000, 1200],
    ["transport", "Такси 5 км", 100, 180],
    ["transport", "Бензин 1 л", 18, 22],
    ["utilities", "Интернет 100 Мбит/с", 300, 500],
    ["utilities", "Мобильная связь", 150, 300],
    ["health", "Фитнес-клуб/мес", 400, 700],
    ["entertainment", "Кино", 130, 180],
    ["entertainment", "Ресторан на двоих", 700, 1500],
    ["entertainment", "Скансен (этнопарк, вход)", 200, 250],
    ["entertainment", "Аренда каяка (день)", 400, 700],
    ["cafe", "Пиво в баре", 80, 130],
    ["rent", "Аренда комнаты", 6000, 10000],
  ],
  helsinki: [
    ["rent", "Аренда 1-комн. в центре", 1400, 1900],
    ["rent", "Аренда 1-комн. вне центра", 900, 1300],
    ["rent", "Аренда 2-комн. в центре", 1900, 2800],
    ["utilities", "Коммунальные услуги", 120, 220],
    ["food", "Обед в кафе", 12, 20],
    ["food", "Продукты на месяц", 350, 520],
    ["cafe", "Кофе", 3, 5],
    ["food", "Бизнес-ланч", 12, 20],
    ["transport", "Месячный проездной", 50, 70],
    ["transport", "Такси 5 км", 15, 25],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 25, 45],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 50, 90],
    ["entertainment", "Кино", 13, 18],
    ["entertainment", "Ресторан на двоих", 60, 120],
    ["entertainment", "Паром Хельсинки–Таллин", 30, 80],
    ["entertainment", "Сауна (публичная)", 12, 20],
    ["cafe", "Пиво в баре", 7, 12],
    ["rent", "Аренда комнаты", 550, 900],
  ],
  gdansk: [
    ["rent", "Аренда 1-комн. в центре", 2000, 3000],
    ["rent", "Аренда 1-комн. вне центра", 1500, 2200],
    ["rent", "Аренда 2-комн. в центре", 2800, 4200],
    ["utilities", "Коммунальные услуги", 500, 900],
    ["food", "Обед в кафе", 25, 45],
    ["food", "Продукты на месяц", 900, 1400],
    ["cafe", "Кофе", 8, 15],
    ["food", "Бизнес-ланч", 30, 50],
    ["transport", "Месячный проездной", 90, 130],
    ["transport", "Такси 5 км", 20, 35],
    ["transport", "Бензин 1 л", 6, 7],
    ["utilities", "Интернет 100 Мбит/с", 50, 80],
    ["utilities", "Мобильная связь", 20, 45],
    ["health", "Фитнес-клуб/мес", 120, 200],
    ["entertainment", "Кино", 30, 45],
    ["entertainment", "Ресторан на двоих", 120, 250],
    ["entertainment", "Пляж на Балтике (лежак)", 10, 20],
    ["entertainment", "Сопот (поездка)", 10, 20],
    ["cafe", "Пиво в баре", 10, 18],
    ["rent", "Аренда комнаты", 800, 1400],
  ],
  naples: [
    ["rent", "Аренда 1-комн. в центре", 700, 1100],
    ["rent", "Аренда 1-комн. вне центра", 500, 800],
    ["rent", "Аренда 2-комн. в центре", 1100, 1700],
    ["utilities", "Коммунальные услуги", 100, 180],
    ["food", "Обед в кафе", 8, 15],
    ["food", "Продукты на месяц", 250, 400],
    ["cafe", "Кофе", 1, 2],
    ["food", "Бизнес-ланч", 10, 18],
    ["transport", "Месячный проездной", 40, 55],
    ["transport", "Такси 5 км", 10, 18],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 25, 40],
    ["utilities", "Мобильная связь", 10, 20],
    ["health", "Фитнес-клуб/мес", 30, 60],
    ["entertainment", "Кино", 8, 13],
    ["entertainment", "Ресторан на двоих", 40, 80],
    ["entertainment", "Помпеи (билет)", 15, 20],
    ["entertainment", "Везувий (тур)", 20, 50],
    ["food", "Пицца (лучшая в мире)", 5, 10],
    ["rent", "Аренда комнаты", 300, 550],
  ],
  vancouver: [
    ["rent", "Аренда 1-комн. в центре", 2500, 3500],
    ["rent", "Аренда 1-комн. вне центра", 1800, 2500],
    ["rent", "Аренда 2-комн. в центре", 3500, 5000],
    ["utilities", "Коммунальные услуги", 100, 180],
    ["food", "Обед в кафе", 15, 25],
    ["food", "Продукты на месяц", 400, 600],
    ["cafe", "Кофе", 4, 7],
    ["food", "Бизнес-ланч", 18, 30],
    ["transport", "Месячный проездной", 100, 120],
    ["transport", "Такси 5 км", 12, 22],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 60, 90],
    ["utilities", "Мобильная связь", 50, 90],
    ["health", "Фитнес-клуб/мес", 50, 100],
    ["entertainment", "Кино", 14, 20],
    ["entertainment", "Ресторан на двоих", 80, 160],
    ["entertainment", "Горнолыжный курорт Уистлер (день)", 120, 180],
    ["entertainment", "Стэнли-парк (велопрокат)", 12, 20],
    ["food", "Суши (рол)", 6, 12],
    ["rent", "Аренда комнаты", 900, 1400],
  ],
  montreal: [
    ["rent", "Аренда 1-комн. в центре", 1800, 2400],
    ["rent", "Аренда 1-комн. вне центра", 1200, 1800],
    ["rent", "Аренда 2-комн. в центре", 2400, 3500],
    ["utilities", "Коммунальные услуги", 100, 180],
    ["food", "Обед в кафе", 14, 22],
    ["food", "Продукты на месяц", 350, 550],
    ["cafe", "Кофе", 3, 6],
    ["food", "Бизнес-ланч", 16, 28],
    ["transport", "Месячный проездной", 95, 100],
    ["transport", "Такси 5 км", 12, 20],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 55, 85],
    ["utilities", "Мобильная связь", 40, 80],
    ["health", "Фитнес-клуб/мес", 40, 90],
    ["entertainment", "Кино", 13, 18],
    ["entertainment", "Ресторан на двоих", 70, 150],
    ["entertainment", "Монреальский джазовый фестиваль", 0, 80],
    ["entertainment", "Лыжный курорт (день)", 60, 100],
    ["food", "Путин (poutine)", 10, 18],
    ["rent", "Аренда комнаты", 700, 1100],
  ],
  miami: [
    ["rent", "Аренда 1-комн. в центре", 2800, 4000],
    ["rent", "Аренда 1-комн. вне центра", 2000, 3000],
    ["rent", "Аренда 2-комн. в центре", 4000, 6000],
    ["utilities", "Коммунальные услуги", 150, 250],
    ["food", "Обед в кафе", 15, 25],
    ["food", "Продукты на месяц", 400, 600],
    ["cafe", "Кофе", 3, 6],
    ["food", "Бизнес-ланч", 18, 30],
    ["transport", "Месячный проездной", 70, 120],
    ["transport", "Такси 5 км", 15, 25],
    ["transport", "Бензин 1 л", 1, 1],
    ["utilities", "Интернет 100 Мбит/с", 50, 80],
    ["utilities", "Мобильная связь", 40, 80],
    ["health", "Фитнес-клуб/мес", 40, 90],
    ["entertainment", "Кино", 13, 20],
    ["entertainment", "Ресторан на двоих", 80, 180],
    ["entertainment", "Art Deco District (прогулка)", 0, 0],
    ["entertainment", "Яхта (аренда, день)", 300, 800],
    ["cafe", "Кубинский кофе (колада)", 2, 4],
    ["rent", "Аренда комнаты", 900, 1500],
  ],
  "new-york": [
    ["rent", "Аренда 1-комн. в центре", 3500, 5000],
    ["rent", "Аренда 1-комн. вне центра", 2500, 3500],
    ["rent", "Аренда 2-комн. в центре", 5000, 8000],
    ["utilities", "Коммунальные услуги", 150, 300],
    ["food", "Обед в кафе", 15, 28],
    ["food", "Продукты на месяц", 450, 700],
    ["cafe", "Кофе", 3, 7],
    ["food", "Бизнес-ланч", 20, 35],
    ["transport", "Месячный проездной", 132, 132],
    ["transport", "Такси 5 км", 15, 30],
    ["transport", "Бензин 1 л", 1, 1],
    ["utilities", "Интернет 100 Мбит/с", 50, 90],
    ["utilities", "Мобильная связь", 50, 100],
    ["health", "Фитнес-клуб/мес", 50, 150],
    ["entertainment", "Кино", 15, 25],
    ["entertainment", "Ресторан на двоих", 100, 250],
    ["entertainment", "Бродвейский спектакль", 80, 300],
    ["entertainment", "Метрополитен-музей", 30, 30],
    ["food", "Нью-йоркский бейгл", 3, 6],
    ["rent", "Аренда комнаты", 1200, 2000],
  ],
  "los-angeles": [
    ["rent", "Аренда 1-комн. в центре", 2500, 4000],
    ["rent", "Аренда 1-комн. вне центра", 1800, 3000],
    ["rent", "Аренда 2-комн. в центре", 3800, 6000],
    ["utilities", "Коммунальные услуги", 120, 220],
    ["food", "Обед в кафе", 14, 25],
    ["food", "Продукты на месяц", 400, 650],
    ["cafe", "Кофе", 4, 8],
    ["food", "Бизнес-ланч", 18, 30],
    ["transport", "Месячный проездной", 100, 100],
    ["transport", "Такси 5 км", 15, 28],
    ["transport", "Бензин 1 л", 1, 1],
    ["utilities", "Интернет 100 Мбит/с", 50, 80],
    ["utilities", "Мобильная связь", 40, 80],
    ["health", "Фитнес-клуб/мес", 40, 100],
    ["entertainment", "Кино", 15, 22],
    ["entertainment", "Ресторан на двоих", 80, 200],
    ["entertainment", "Диснейленд (1 день)", 100, 200],
    ["entertainment", "Серфинг (урок)", 80, 150],
    ["food", "Тако (уличный)", 3, 6],
    ["rent", "Аренда комнаты", 900, 1500],
  ],
  tulum: [
    ["rent", "Аренда 1-комн. в центре", 18000, 30000],
    ["rent", "Аренда 1-комн. вне центра", 12000, 20000],
    ["rent", "Аренда 2-комн. в центре", 28000, 45000],
    ["utilities", "Коммунальные услуги", 1500, 3000],
    ["food", "Обед в кафе", 100, 200],
    ["food", "Продукты на месяц", 4000, 7000],
    ["cafe", "Кофе", 60, 120],
    ["food", "Бизнес-ланч", 150, 280],
    ["transport", "Месячный проездной", 200, 400],
    ["transport", "Такси 5 км", 80, 150],
    ["transport", "Бензин 1 л", 22, 26],
    ["utilities", "Интернет 100 Мбит/с", 500, 900],
    ["utilities", "Мобильная связь", 200, 500],
    ["health", "Фитнес-клуб/мес", 500, 1200],
    ["entertainment", "Кино", 80, 130],
    ["entertainment", "Ресторан на двоих", 600, 1500],
    ["entertainment", "Сеноте (вход)", 200, 500],
    ["entertainment", "Руины Тулума (билет)", 80, 100],
    ["food", "Такос (уличные, 3 шт)", 50, 100],
    ["rent", "Аренда комнаты", 7000, 13000],
  ],
  santiago: [
    ["rent", "Аренда 1-комн. в центре", 600000, 900000],
    ["rent", "Аренда 1-комн. вне центра", 450000, 650000],
    ["rent", "Аренда 2-комн. в центре", 900000, 1400000],
    ["utilities", "Коммунальные услуги", 60000, 100000],
    ["food", "Обед в кафе", 5000, 9000],
    ["food", "Продукты на месяц", 150000, 250000],
    ["cafe", "Кофе", 1500, 3000],
    ["food", "Бизнес-ланч", 6000, 12000],
    ["transport", "Месячный проездной", 40000, 45000],
    ["transport", "Такси 5 км", 5000, 9000],
    ["transport", "Бензин 1 л", 1100, 1300],
    ["utilities", "Интернет 100 Мбит/с", 20000, 35000],
    ["utilities", "Мобильная связь", 10000, 25000],
    ["health", "Фитнес-клуб/мес", 25000, 60000],
    ["entertainment", "Кино", 4000, 7000],
    ["entertainment", "Ресторан на двоих", 30000, 80000],
    ["entertainment", "Горнолыжный курорт (день)", 50000, 100000],
    ["entertainment", "Тур в Вальпараисо", 15000, 40000],
    ["food", "Чилийское вино (бутылка)", 5000, 15000],
    ["rent", "Аренда комнаты", 250000, 400000],
  ],
  nairobi: [
    ["rent", "Аренда 1-комн. в центре", 50000, 80000],
    ["rent", "Аренда 1-комн. вне центра", 30000, 50000],
    ["rent", "Аренда 2-комн. в центре", 80000, 130000],
    ["utilities", "Коммунальные услуги", 5000, 10000],
    ["food", "Обед в кафе", 500, 1000],
    ["food", "Продукты на месяц", 15000, 25000],
    ["cafe", "Кофе", 200, 400],
    ["food", "Бизнес-ланч", 700, 1500],
    ["transport", "Месячный проездной", 3000, 5000],
    ["transport", "Такси 5 км", 600, 1200],
    ["transport", "Бензин 1 л", 180, 210],
    ["utilities", "Интернет 100 Мбит/с", 3000, 5000],
    ["utilities", "Мобильная связь", 1000, 2500],
    ["health", "Фитнес-клуб/мес", 5000, 12000],
    ["entertainment", "Кино", 800, 1200],
    ["entertainment", "Ресторан на двоих", 3000, 8000],
    ["entertainment", "Национальный парк Найроби (вход)", 5000, 6000],
    ["entertainment", "Сафари (1 день)", 20000, 60000],
    ["food", "Угали с мясом (уличная еда)", 300, 600],
    ["rent", "Аренда комнаты", 15000, 28000],
  ],
  casablanca: [
    ["rent", "Аренда 1-комн. в центре", 5000, 8000],
    ["rent", "Аренда 1-комн. вне центра", 3000, 5500],
    ["rent", "Аренда 2-комн. в центре", 8000, 14000],
    ["utilities", "Коммунальные услуги", 400, 800],
    ["food", "Обед в кафе", 50, 100],
    ["food", "Продукты на месяц", 1500, 2500],
    ["cafe", "Кофе", 15, 30],
    ["food", "Бизнес-ланч", 70, 150],
    ["transport", "Месячный проездной", 200, 300],
    ["transport", "Такси 5 км", 30, 60],
    ["transport", "Бензин 1 л", 14, 16],
    ["utilities", "Интернет 100 Мбит/с", 200, 400],
    ["utilities", "Мобильная связь", 80, 200],
    ["health", "Фитнес-клуб/мес", 300, 700],
    ["entertainment", "Кино", 50, 80],
    ["entertainment", "Ресторан на двоих", 300, 700],
    ["entertainment", "Мечеть Хасана II (тур)", 120, 200],
    ["entertainment", "Тур в Марракеш (автобус)", 100, 200],
    ["food", "Таджин (блюдо в ресторане)", 80, 150],
    ["rent", "Аренда комнаты", 1500, 3000],
  ],
  funchal: [
    ["rent", "Аренда 1-комн. в центре", 900, 1400],
    ["rent", "Аренда 1-комн. вне центра", 650, 1000],
    ["rent", "Аренда 2-комн. в центре", 1400, 2200],
    ["utilities", "Коммунальные услуги", 80, 150],
    ["food", "Обед в кафе", 10, 18],
    ["food", "Продукты на месяц", 300, 450],
    ["cafe", "Кофе", 1, 2],
    ["food", "Бизнес-ланч", 12, 20],
    ["transport", "Месячный проездной", 35, 50],
    ["transport", "Такси 5 км", 8, 15],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 25, 40],
    ["utilities", "Мобильная связь", 10, 20],
    ["health", "Фитнес-клуб/мес", 30, 60],
    ["entertainment", "Кино", 8, 12],
    ["entertainment", "Ресторан на двоих", 50, 100],
    ["entertainment", "Канатная дорога (Фуншал–Монте)", 12, 12],
    ["entertainment", "Дайвинг (урок)", 50, 100],
    ["cafe", "Вино Мадейра (бокал)", 4, 10],
    ["rent", "Аренда комнаты", 400, 700],
  ],
};

// ─── Основная функция ───────────────────────────────────────────────────────────
async function run() {
  console.log(`Seed 20 городов стартует... (${new Date().toLocaleString("ru")})\n`);
  let added = 0;
  let skipped = 0;
  let totalPrices = 0;
  let totalPhotos = 0;

  for (const c of CITIES) {
    // Проверяем наличие
    const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
    if (existing) {
      // Город уже есть — проверяем и вставляем цены если их нет
      const { count } = await sb.from("prices").select("*", { count: "exact", head: true }).eq("city_id", existing.id);
      if (count === 0) {
        const priceRows = (PRICES[c.slug] || []).map(([cat, item, min, max]) => ({
          city_id: existing.id, category: cat, item_name_ru: item, price_min: min, price_max: max, is_premium: false,
        }));
        if (priceRows.length > 0) {
          const { error: pErr } = await sb.from("prices").insert(priceRows);
          if (pErr) { console.error(`  ОШИБКА цен (existing): ${pErr.message}`); }
          else { console.log(`  цены добавлены для существующего: ${c.slug} (${priceRows.length})`); totalPrices += priceRows.length; }
        }
      } else {
        console.log(`  skip (exists, prices: ${count}): ${c.slug}`);
      }
      skipped++;
      continue;
    }

    console.log(`\n[${added + 1}] ${c.name_ru} (${c.slug})`);

    // Unsplash API — поиск фото
    let photoData = null;
    try {
      photoData = await fetchUnsplash(c.unsplash_query);
      console.log(`  unsplash: ${photoData ? photoData.photo_id : "не найдено"}`);
    } catch (e) {
      console.warn(`  unsplash err: ${e.message}`);
    }

    // Пауза между Unsplash-запросами (50 req/hour limit)
    await sleep(1500);

    // Скачать и залить в R2
    let finalUrl = null;
    if (photoData?.raw_url) {
      try {
        finalUrl = await downloadAndUpload(photoData.raw_url, c.slug);
        if (finalUrl) {
          console.log(`  R2: ${finalUrl}`);
          totalPhotos++;
        } else {
          console.warn(`  R2 upload failed, сохраняем raw URL`);
          finalUrl = photoData.raw_url;
        }
      } catch (e) {
        console.warn(`  R2 err: ${e.message}, сохраняем raw URL`);
        finalUrl = photoData?.raw_url ?? null;
      }
    }

    // SEO поля
    const seo_title = `Стоимость жизни в ${c.name_ru} ${YEAR}: виза, цены, отзывы | Relocost`;
    const seo_description = `Сколько стоит жизнь в ${c.name_ru} в месяц — аренда, еда, транспорт. Реальный бюджет для россиян в ${YEAR} году.`;

    // Вставка города
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
      seo_title,
      seo_description,
      intro_text: c.intro_text,
      lat: c.lat,
      lng: c.lng,
      unsplash_photo_id: photoData?.photo_id ?? "",
      unsplash_url: finalUrl ?? null,
      unsplash_author_name: photoData?.author_name ?? null,
      unsplash_author_url: photoData?.author_url ?? null,
    };

    const { data: inserted, error: cityErr } = await sb
      .from("cities")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();

    if (cityErr) {
      console.error(`  ОШИБКА города: ${cityErr.message}`);
      continue;
    }
    const cityId = inserted.id;
    console.log(`  city_id: ${cityId}`);

    // Цены: DELETE + INSERT для чистоты
    await sb.from("prices").delete().eq("city_id", cityId);

    const priceRows = (PRICES[c.slug] || []).map(([cat, item, min, max]) => ({
      city_id: cityId,
      category: cat,
      item_name_ru: item,
      price_min: min,
      price_max: max,
      is_premium: false,
    }));

    if (priceRows.length > 0) {
      const { error: pErr } = await sb.from("prices").insert(priceRows);
      if (pErr) {
        console.error(`  ОШИБКА цен: ${pErr.message}`);
      } else {
        console.log(`  цены: ${priceRows.length} записей`);
        totalPrices += priceRows.length;
      }
    } else {
      console.warn(`  нет данных цен для ${c.slug}`);
    }

    added++;
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Готово!`);
  console.log(`  Городов добавлено: ${added}`);
  console.log(`  Пропущено (уже есть): ${skipped}`);
  console.log(`  Записей цен вставлено: ${totalPrices}`);
  console.log(`  Фото залито в R2: ${totalPhotos}`);
  console.log("=".repeat(50));
}

run().catch((e) => {
  console.error("\nКРИТИЧЕСКАЯ ОШИБКА:", e.message);
  process.exit(1);
});

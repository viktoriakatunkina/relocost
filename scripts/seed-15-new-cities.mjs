// Seed 15 новых городов: Йоханнесбург, Богота, Лима, Монтевидео, Гонконг,
// Сидней, Мельбурн, Дублин, Брюссель, Лион, Женева, Дюссельдорф, Кёльн,
// Рейкьявик, Аделаида.
// Запуск: node scripts/seed-15-new-cities.mjs
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
  // Африка
  {
    name_ru: "Йоханнесбург", name_en: "Johannesburg", slug: "johannesburg",
    country_ru: "ЮАР", country_en: "South Africa", country_slug: "south-africa", flag_emoji: "🇿🇦",
    population: "6.0 млн", climate: "+16°C ср.", language: "Английский/Зулу/Африкаанс", currency: "Южноафриканский рэнд, ZAR",
    flight_from_moscow: "11 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Крупнейший город ЮАР и финансовый центр всей Африки. Огромные возможности в финансах, горнодобывающей промышленности и IT. Рэнд слабый — для тех, кто получает в валюте, жизнь стоит дешево. Требует внимания к личной безопасности.",
    lat: -26.2041, lng: 28.0473, unsplash_query: "johannesburg south africa skyline",
  },
  // Южная Америка
  {
    name_ru: "Богота", name_en: "Bogota", slug: "bogota",
    country_ru: "Колумбия", country_en: "Colombia", country_slug: "colombia", flag_emoji: "🇨🇴",
    population: "8.0 млн", climate: "+14°C ср.", language: "Испанский", currency: "Колумбийское песо, COP",
    flight_from_moscow: "16 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица Колумбии на высоте 2600 метров над уровнем моря — вечная весна без жары и холода. Быстро развивающийся стартап-хаб Латинской Америки. Безвизовый въезд для россиян до 90 дней. Стоимость жизни в 3-4 раза ниже европейской.",
    lat: 4.7110, lng: -74.0721, unsplash_query: "bogota colombia city skyline",
  },
  {
    name_ru: "Лима", name_en: "Lima", slug: "lima",
    country_ru: "Перу", country_en: "Peru", country_slug: "peru", flag_emoji: "🇵🇪",
    population: "10.9 млн", climate: "+18°C ср.", language: "Испанский", currency: "Перуанский соль, PEN",
    flight_from_moscow: "17 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Гастрономическая столица мира по версии World Travel Awards несколько лет подряд. Мирафлорес и Барранко — районы с видами на Тихий океан и развитой экспат-инфраструктурой. Безвизово 183 дня. Дешевле Боготы на 15-20%.",
    lat: -12.0464, lng: -77.0428, unsplash_query: "lima peru miraflores ocean",
  },
  {
    name_ru: "Монтевидео", name_en: "Montevideo", slug: "montevideo",
    country_ru: "Уругвай", country_en: "Uruguay", country_slug: "uruguay", flag_emoji: "🇺🇾",
    population: "1.4 млн", climate: "+17°C ср.", language: "Испанский", currency: "Уругвайское песо, UYU",
    flight_from_moscow: "16 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Самый безопасный и спокойный город Латинской Америки. Уругвай — самая стабильная демократия региона с развитой системой здравоохранения. ВНЖ через инвестиции от 300,000 USD. Небольшой комфортный город с атлантическим побережьем.",
    lat: -34.9011, lng: -56.1645, unsplash_query: "montevideo uruguay old city",
  },
  // Азия
  {
    name_ru: "Гонконг", name_en: "Hong Kong", slug: "hong-kong",
    country_ru: "Гонконг", country_en: "Hong Kong", country_slug: "hong-kong", flag_emoji: "🇭🇰",
    population: "7.5 млн", climate: "+23°C ср.", language: "Кантонский/Английский", currency: "Гонконгский доллар, HKD",
    flight_from_moscow: "10 часов", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Финансовый мегаполис с уникальным сочетанием британской инфраструктуры и китайской энергии. Один из главных финансовых центров Азии: банки, трейдинг, управление активами. Безвизово 14 дней. Дорогая аренда, но низкие налоги (до 15%).",
    lat: 22.3193, lng: 114.1694, unsplash_query: "hong kong skyline night",
  },
  // Австралия
  {
    name_ru: "Сидней", name_en: "Sydney", slug: "sydney",
    country_ru: "Австралия", country_en: "Australia", country_slug: "australia", flag_emoji: "🇦🇺",
    population: "5.2 млн", climate: "+18°C ср.", language: "Английский", currency: "Австралийский доллар, AUD",
    flight_from_moscow: "20 часов", is_foreign: true, difficulty_score: 5, is_popular: true,
    intro_text: "Самый известный город Австралии с культовой оперой, пляжем Бонди и гаванью. Высокий уровень жизни, сильная экономика, мультикультурное общество. Иммиграция через Express Entry или студенческую визу. Стартовый рынок IT в APAC-регионе.",
    lat: -33.8688, lng: 151.2093, unsplash_query: "sydney australia opera house harbour",
  },
  {
    name_ru: "Мельбурн", name_en: "Melbourne", slug: "melbourne",
    country_ru: "Австралия", country_en: "Australia", country_slug: "australia", flag_emoji: "🇦🇺",
    population: "5.1 млн", climate: "+15°C ср.", language: "Английский", currency: "Австралийский доллар, AUD",
    flight_from_moscow: "20 часов", is_foreign: true, difficulty_score: 5, is_popular: false,
    intro_text: "Культурная столица Австралии, стабильно занимающая топ-5 лучших для жизни городов мира. Знаменита уличным искусством, кофейной культурой и спортом. Немного дешевле Сиднея. Сильная технологическая и медицинская индустрия.",
    lat: -37.8136, lng: 144.9631, unsplash_query: "melbourne australia city skyline",
  },
  // Ирландия
  {
    name_ru: "Дублин", name_en: "Dublin", slug: "dublin",
    country_ru: "Ирландия", country_en: "Ireland", country_slug: "ireland", flag_emoji: "🇮🇪",
    population: "1.4 млн", climate: "+10°C ср.", language: "Английский/Ирландский", currency: "Евро, EUR",
    flight_from_moscow: "5 часов", is_foreign: true, difficulty_score: 4, is_popular: true,
    intro_text: "Европейская штаб-квартира Google, Facebook, Apple, LinkedIn и большинства крупных Tech-компаний. Единственная англоязычная страна ЕС. Дружелюбная иммиграционная политика для IT-специалистов. Дождливый климат, но высочайшие зарплаты в Европе.",
    lat: 53.3498, lng: -6.2603, unsplash_query: "dublin ireland trinity college",
  },
  // Бельгия
  {
    name_ru: "Брюссель", name_en: "Brussels", slug: "brussels",
    country_ru: "Бельгия", country_en: "Belgium", country_slug: "belgium", flag_emoji: "🇧🇪",
    population: "1.2 млн", climate: "+11°C ср.", language: "Французский/Нидерландский", currency: "Евро, EUR",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица ЕС и НАТО — центр европейской политики. Высокая концентрация международных организаций и NGO создает огромный рынок труда для профессионалов. Удобное расположение (час до Парижа, 2 часа до Амстердама). Отличная кухня и пиво.",
    lat: 50.8503, lng: 4.3517, unsplash_query: "brussels belgium grand place",
  },
  // Франция
  {
    name_ru: "Лион", name_en: "Lyon", slug: "lyon",
    country_ru: "Франция", country_en: "France", country_slug: "france", flag_emoji: "🇫🇷",
    population: "520 тыс", climate: "+13°C ср.", language: "Французский", currency: "Евро, EUR",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Гастрономическая столица Франции и второй крупнейший экономический центр страны. Значительно дешевле Парижа при сопоставимом уровне жизни. Биофармацевтика, IT-сектор, историческая архитектура ЮНЕСКО. Отличная точка входа во Францию.",
    lat: 45.7640, lng: 4.8357, unsplash_query: "lyon france old town vieux",
  },
  // Швейцария
  {
    name_ru: "Женева", name_en: "Geneva", slug: "geneva",
    country_ru: "Швейцария", country_en: "Switzerland", country_slug: "switzerland", flag_emoji: "🇨🇭",
    population: "200 тыс", climate: "+12°C ср.", language: "Французский", currency: "Швейцарский франк, CHF",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 5, is_popular: false,
    intro_text: "Международная дипломатическая столица: ООН, ВОЗ, МККК, WTO — штаб-квартиры мировых организаций. Один из самых дорогих городов планеты, но и зарплаты здесь самые высокие в мире. Озеро, Альпы, Монблан в 90 минутах езды.",
    lat: 46.2044, lng: 6.1432, unsplash_query: "geneva switzerland lake mont blanc",
  },
  // Германия
  {
    name_ru: "Дюссельдорф", name_en: "Dusseldorf", slug: "dusseldorf",
    country_ru: "Германия", country_en: "Germany", country_slug: "germany", flag_emoji: "🇩🇪",
    population: "640 тыс", climate: "+11°C ср.", language: "Немецкий", currency: "Евро, EUR",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица моды, рекламы и дизайна в Германии. Крупная японская диаспора (35 тыс человек) и развитая международная бизнес-среда. Дешевле Мюнхена и Берлина. Рядом — Кёльн, Эссен, Дортмунд, образуя крупнейшую агломерацию страны.",
    lat: 51.2217, lng: 6.7762, unsplash_query: "dusseldorf germany rhine old town",
  },
  {
    name_ru: "Кёльн", name_en: "Cologne", slug: "cologne",
    country_ru: "Германия", country_en: "Germany", country_slug: "germany", flag_emoji: "🇩🇪",
    population: "1.08 млн", climate: "+11°C ср.", language: "Немецкий", currency: "Евро, EUR",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Четвертый по величине город Германии с культовым готическим собором. Студенческий, творческий, открытый — один из самых либеральных немецких городов. Медиа, IT, туристический бизнес. Дешевле Берлина при том же уровне жизни и инфраструктуры.",
    lat: 50.9333, lng: 6.9500, unsplash_query: "cologne germany cathedral rhine",
  },
  // Исландия
  {
    name_ru: "Рейкьявик", name_en: "Reykjavik", slug: "reykjavik",
    country_ru: "Исландия", country_en: "Iceland", country_slug: "iceland", flag_emoji: "🇮🇸",
    population: "130 тыс", climate: "+5°C ср.", language: "Исландский/Английский", currency: "Исландская крона, ISK",
    flight_from_moscow: "7 часов", is_foreign: true, difficulty_score: 4, is_popular: false,
    intro_text: "Самый маленький и самый северный из всех столичных городов Европы. Северное сияние, гейзеры, чистая энергия. Исландия — лидер по гендерному равенству и счастью населения. Высокие зарплаты, дорогая жизнь, но рыбная отрасль и туризм дают стабильность.",
    lat: 64.1265, lng: -21.8174, unsplash_query: "reykjavik iceland northern lights",
  },
  // Австралия (вторая)
  {
    name_ru: "Аделаида", name_en: "Adelaide", slug: "adelaide",
    country_ru: "Австралия", country_en: "Australia", country_slug: "australia", flag_emoji: "🇦🇺",
    population: "1.4 млн", climate: "+17°C ср.", language: "Английский", currency: "Австралийский доллар, AUD",
    flight_from_moscow: "19 часов", is_foreign: true, difficulty_score: 4, is_popular: false,
    intro_text: "Самый «доступный» крупный город Австралии. На 30% дешевле Сиднея при высоком качестве жизни. Специальная региональная иммиграционная программа (SA State Nomination) облегчает получение ПМЖ. Известна винодельческим регионом Барросса, фестивалями и едой.",
    lat: -34.9285, lng: 138.6007, unsplash_query: "adelaide australia city botanic",
  },
];

// ─── Цены по городам ────────────────────────────────────────────────────────────
// Категории: rent, food, transport, utilities, cafe, health, entertainment
const PRICES = {
  johannesburg: [
    ["rent", "Аренда 1-комн. в центре", 14000, 22000],
    ["rent", "Аренда 1-комн. вне центра", 8000, 14000],
    ["rent", "Аренда 2-комн. в центре", 20000, 35000],
    ["utilities", "Коммунальные услуги", 2000, 4000],
    ["food", "Обед в кафе", 200, 400],
    ["food", "Продукты на месяц", 5000, 9000],
    ["cafe", "Кофе", 50, 100],
    ["food", "Бизнес-ланч", 200, 500],
    ["transport", "Месячный проездной", 800, 1200],
    ["transport", "Такси 5 км (Bolt/Uber)", 80, 150],
    ["transport", "Бензин 1 л", 22, 26],
    ["utilities", "Интернет 100 Мбит/с", 600, 1200],
    ["utilities", "Мобильная связь", 300, 700],
    ["health", "Фитнес-клуб/мес", 600, 1500],
    ["entertainment", "Кино", 120, 180],
    ["entertainment", "Ресторан на двоих", 600, 1500],
    ["entertainment", "Национальный заповедник (сафари, день)", 2000, 8000],
    ["entertainment", "Golf (18 лунок)", 300, 700],
    ["cafe", "Пиво местное (Castle)", 30, 60],
    ["rent", "Аренда комнаты", 4000, 8000],
  ],
  bogota: [
    ["rent", "Аренда 1-комн. в центре", 2000000, 3500000],
    ["rent", "Аренда 1-комн. вне центра", 1200000, 2200000],
    ["rent", "Аренда 2-комн. в центре", 3000000, 5500000],
    ["utilities", "Коммунальные услуги", 150000, 300000],
    ["food", "Обед в кафе", 15000, 30000],
    ["food", "Продукты на месяц", 400000, 700000],
    ["cafe", "Кофе", 5000, 10000],
    ["food", "Бизнес-ланч", 15000, 30000],
    ["transport", "Месячный проездной (TransMilenio)", 100000, 130000],
    ["transport", "Такси 5 км", 12000, 22000],
    ["transport", "Бензин 1 л", 11000, 13000],
    ["utilities", "Интернет 100 Мбит/с", 80000, 150000],
    ["utilities", "Мобильная связь", 30000, 70000],
    ["health", "Фитнес-клуб/мес", 80000, 200000],
    ["entertainment", "Кино", 15000, 25000],
    ["entertainment", "Ресторан на двоих", 80000, 200000],
    ["entertainment", "Музей Золота (вход)", 4000, 4000],
    ["entertainment", "Тур в Картахену (автобус)", 80000, 150000],
    ["food", "Арепа (уличная еда)", 3000, 6000],
    ["rent", "Аренда комнаты", 600000, 1200000],
  ],
  lima: [
    ["rent", "Аренда 1-комн. в центре", 2500, 4000],
    ["rent", "Аренда 1-комн. вне центра", 1500, 2500],
    ["rent", "Аренда 2-комн. в центре", 3500, 6000],
    ["utilities", "Коммунальные услуги", 200, 400],
    ["food", "Обед в кафе", 20, 45],
    ["food", "Продукты на месяц", 600, 1000],
    ["cafe", "Кофе", 8, 15],
    ["food", "Бизнес-ланч", 25, 50],
    ["transport", "Месячный проездной", 80, 100],
    ["transport", "Такси 5 км (InDriver/Cabify)", 10, 20],
    ["transport", "Бензин 1 л", 15, 18],
    ["utilities", "Интернет 100 Мбит/с", 100, 180],
    ["utilities", "Мобильная связь", 50, 120],
    ["health", "Фитнес-клуб/мес", 100, 250],
    ["entertainment", "Кино", 20, 35],
    ["entertainment", "Ресторан на двоих (перуанская кухня)", 100, 300],
    ["entertainment", "Музей Ларко (вход)", 45, 45],
    ["entertainment", "Тур в Мачу-Пикчу (билет)", 250, 350],
    ["food", "Севиче в ресторане", 40, 80],
    ["rent", "Аренда комнаты", 800, 1500],
  ],
  montevideo: [
    ["rent", "Аренда 1-комн. в центре", 25000, 40000],
    ["rent", "Аренда 1-комн. вне центра", 18000, 28000],
    ["rent", "Аренда 2-комн. в центре", 38000, 65000],
    ["utilities", "Коммунальные услуги", 3000, 6000],
    ["food", "Обед в кафе", 300, 600],
    ["food", "Продукты на месяц", 8000, 14000],
    ["cafe", "Кофе", 80, 150],
    ["food", "Бизнес-ланч", 350, 700],
    ["transport", "Месячный проездной", 1500, 2000],
    ["transport", "Такси 5 км", 250, 450],
    ["transport", "Бензин 1 л", 75, 85],
    ["utilities", "Интернет 100 Мбит/с", 1000, 2000],
    ["utilities", "Мобильная связь", 600, 1200],
    ["health", "Фитнес-клуб/мес", 1500, 3000],
    ["entertainment", "Кино", 250, 400],
    ["entertainment", "Ресторан на двоих (асадо)", 1500, 4000],
    ["entertainment", "Пляж Пunta del Este (поездка)", 400, 800],
    ["entertainment", "Музей Торрес Гарсиа (вход)", 200, 350],
    ["food", "Чивито (нац. блюдо)", 250, 500],
    ["rent", "Аренда комнаты", 8000, 15000],
  ],
  "hong-kong": [
    ["rent", "Аренда студии в центре", 18000, 28000],
    ["rent", "Аренда 1-комн. вне центра (NT)", 12000, 18000],
    ["rent", "Аренда 2-комн. в центре", 28000, 48000],
    ["utilities", "Коммунальные услуги", 500, 1000],
    ["food", "Обед в кафе", 60, 120],
    ["food", "Продукты на месяц", 2500, 4500],
    ["cafe", "Кофе (чайная)", 20, 50],
    ["food", "Бизнес-ланч (dim sum)", 80, 180],
    ["transport", "Месячный проездной MTR", 400, 600],
    ["transport", "Такси 5 км", 70, 120],
    ["transport", "Бензин 1 л", 25, 30],
    ["utilities", "Интернет 1 Гбит/с", 200, 350],
    ["utilities", "Мобильная связь", 100, 250],
    ["health", "Фитнес-клуб/мес", 500, 1500],
    ["entertainment", "Кино", 120, 180],
    ["entertainment", "Ресторан на двоих", 400, 1200],
    ["entertainment", "Трамвай на Пик Виктории", 50, 80],
    ["entertainment", "Диснейленд Гонконг (день)", 650, 800],
    ["cafe", "Чай с молоком (Milk Tea)", 15, 30],
    ["rent", "Аренда комнаты", 6000, 10000],
  ],
  sydney: [
    ["rent", "Аренда 1-комн. в центре", 2800, 4000],
    ["rent", "Аренда 1-комн. вне центра", 2000, 3000],
    ["rent", "Аренда 2-комн. в центре", 4000, 6000],
    ["utilities", "Коммунальные услуги", 150, 280],
    ["food", "Обед в кафе", 18, 30],
    ["food", "Продукты на месяц", 500, 800],
    ["cafe", "Кофе", 4, 7],
    ["food", "Бизнес-ланч", 20, 35],
    ["transport", "Месячный проездной (Opal)", 180, 220],
    ["transport", "Такси 5 км", 15, 25],
    ["transport", "Бензин 1 л", 2, 2],
    ["utilities", "Интернет 100 Мбит/с", 60, 100],
    ["utilities", "Мобильная связь", 30, 70],
    ["health", "Фитнес-клуб/мес", 60, 120],
    ["entertainment", "Кино", 20, 27],
    ["entertainment", "Ресторан на двоих", 100, 220],
    ["entertainment", "Opera House (экскурсия)", 30, 40],
    ["entertainment", "Пляж Бонди (бесплатно)", 0, 0],
    ["cafe", "Флэт уайт (кофе)", 5, 8],
    ["rent", "Аренда комнаты", 1000, 1700],
  ],
  melbourne: [
    ["rent", "Аренда 1-комн. в центре", 2400, 3500],
    ["rent", "Аренда 1-комн. вне центра", 1700, 2500],
    ["rent", "Аренда 2-комн. в центре", 3500, 5200],
    ["utilities", "Коммунальные услуги", 150, 280],
    ["food", "Обед в кафе", 16, 28],
    ["food", "Продукты на месяц", 450, 750],
    ["cafe", "Кофе", 4, 7],
    ["food", "Бизнес-ланч", 18, 32],
    ["transport", "Месячный проездной (Myki)", 160, 200],
    ["transport", "Такси 5 км", 14, 24],
    ["transport", "Бензин 1 л", 2, 2],
    ["utilities", "Интернет 100 Мбит/с", 60, 100],
    ["utilities", "Мобильная связь", 30, 70],
    ["health", "Фитнес-клуб/мес", 55, 110],
    ["entertainment", "Кино", 18, 25],
    ["entertainment", "Ресторан на двоих", 90, 200],
    ["entertainment", "Национальная галерея Виктории (вход)", 0, 25],
    ["entertainment", "Большой теннис Australian Open (билет)", 40, 200],
    ["food", "Поке-боул (тренд)", 15, 22],
    ["rent", "Аренда комнаты", 900, 1500],
  ],
  dublin: [
    ["rent", "Аренда 1-комн. в центре", 2200, 3200],
    ["rent", "Аренда 1-комн. вне центра", 1600, 2400],
    ["rent", "Аренда 2-комн. в центре", 3200, 5000],
    ["utilities", "Коммунальные услуги", 150, 280],
    ["food", "Обед в кафе", 14, 22],
    ["food", "Продукты на месяц", 400, 650],
    ["cafe", "Кофе", 3, 6],
    ["food", "Бизнес-ланч", 16, 28],
    ["transport", "Месячный проездной Luas/Bus", 110, 140],
    ["transport", "Такси 5 км", 14, 22],
    ["transport", "Бензин 1 л", 2, 2],
    ["utilities", "Интернет 100 Мбит/с", 35, 65],
    ["utilities", "Мобильная связь", 15, 35],
    ["health", "Фитнес-клуб/мес", 55, 110],
    ["entertainment", "Кино", 13, 18],
    ["entertainment", "Ресторан на двоих", 80, 180],
    ["entertainment", "Тур Guinness Storehouse", 25, 30],
    ["entertainment", "Замок Дублина (вход)", 12, 15],
    ["cafe", "Пинта Guinness в пабе", 7, 10],
    ["rent", "Аренда комнаты", 1000, 1800],
  ],
  brussels: [
    ["rent", "Аренда 1-комн. в центре", 1200, 1800],
    ["rent", "Аренда 1-комн. вне центра", 900, 1400],
    ["rent", "Аренда 2-комн. в центре", 1800, 2800],
    ["utilities", "Коммунальные услуги", 150, 250],
    ["food", "Обед в кафе", 12, 20],
    ["food", "Продукты на месяц", 350, 550],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 14, 24],
    ["transport", "Месячный проездной STIB/MIVB", 55, 65],
    ["transport", "Такси 5 км", 15, 25],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 35, 55],
    ["utilities", "Мобильная связь", 15, 35],
    ["health", "Фитнес-клуб/мес", 40, 85],
    ["entertainment", "Кино", 11, 16],
    ["entertainment", "Ресторан на двоих", 70, 160],
    ["entertainment", "Атомиум (вход)", 16, 18],
    ["entertainment", "Евросоюз (бесплатная экскурсия)", 0, 0],
    ["cafe", "Бельгийское пиво (бокал)", 4, 8],
    ["rent", "Аренда комнаты", 550, 950],
  ],
  lyon: [
    ["rent", "Аренда 1-комн. в центре", 900, 1400],
    ["rent", "Аренда 1-комн. вне центра", 650, 1000],
    ["rent", "Аренда 2-комн. в центре", 1400, 2200],
    ["utilities", "Коммунальные услуги", 100, 200],
    ["food", "Обед в кафе (бушон)", 15, 25],
    ["food", "Продукты на месяц", 300, 500],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 14, 22],
    ["transport", "Месячный проездной TCL", 70, 80],
    ["transport", "Такси 5 км", 12, 20],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 25, 45],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 35, 75],
    ["entertainment", "Кино", 9, 14],
    ["entertainment", "Ресторан на двоих", 60, 140],
    ["entertainment", "Музей изящных искусств (вход)", 8, 12],
    ["entertainment", "Фестиваль огней (световое шоу)", 0, 0],
    ["food", "Кенель (нац. блюдо)", 15, 25],
    ["rent", "Аренда комнаты", 450, 750],
  ],
  geneva: [
    ["rent", "Аренда 1-комн. в центре", 2500, 3800],
    ["rent", "Аренда 1-комн. вне центра", 1800, 2700],
    ["rent", "Аренда 2-комн. в центре", 3800, 5800],
    ["utilities", "Коммунальные услуги", 200, 400],
    ["food", "Обед в кафе", 22, 40],
    ["food", "Продукты на месяц", 700, 1100],
    ["cafe", "Кофе", 4, 7],
    ["food", "Бизнес-ланч", 28, 48],
    ["transport", "Месячный проездной TPG", 70, 100],
    ["transport", "Такси 5 км", 22, 40],
    ["transport", "Бензин 1 л", 2, 2],
    ["utilities", "Интернет 100 Мбит/с", 50, 80],
    ["utilities", "Мобильная связь", 25, 60],
    ["health", "Фитнес-клуб/мес", 90, 180],
    ["entertainment", "Кино", 18, 25],
    ["entertainment", "Ресторан на двоих", 120, 250],
    ["entertainment", "Женевский музей искусства (вход)", 15, 20],
    ["entertainment", "Поездка в Шамони (Монблан)", 30, 60],
    ["cafe", "Сыр фондю (порция)", 25, 40],
    ["rent", "Аренда комнаты", 1200, 2000],
  ],
  dusseldorf: [
    ["rent", "Аренда 1-комн. в центре", 1300, 1900],
    ["rent", "Аренда 1-комн. вне центра", 950, 1400],
    ["rent", "Аренда 2-комн. в центре", 1900, 2900],
    ["utilities", "Коммунальные услуги", 140, 240],
    ["food", "Обед в кафе", 10, 18],
    ["food", "Продукты на месяц", 280, 430],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 12, 20],
    ["transport", "Месячный проездной DVG/RHB", 80, 100],
    ["transport", "Такси 5 км", 12, 20],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 30, 50],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 40, 80],
    ["entertainment", "Кино", 12, 17],
    ["entertainment", "Ресторан на двоих", 60, 130],
    ["entertainment", "Медиен Харбор (прогулка)", 0, 0],
    ["entertainment", "K21 музей (вход)", 14, 20],
    ["cafe", "Альтбир (местное пиво)", 2, 4],
    ["rent", "Аренда комнаты", 600, 1000],
  ],
  cologne: [
    ["rent", "Аренда 1-комн. в центре", 1200, 1800],
    ["rent", "Аренда 1-комн. вне центра", 850, 1300],
    ["rent", "Аренда 2-комн. в центре", 1800, 2700],
    ["utilities", "Коммунальные услуги", 130, 230],
    ["food", "Обед в кафе", 10, 17],
    ["food", "Продукты на месяц", 270, 420],
    ["cafe", "Кофе", 2, 4],
    ["food", "Бизнес-ланч", 11, 19],
    ["transport", "Месячный проездной KVB", 75, 95],
    ["transport", "Такси 5 км", 11, 19],
    ["transport", "Бензин 1 л", 1, 2],
    ["utilities", "Интернет 100 Мбит/с", 28, 48],
    ["utilities", "Мобильная связь", 10, 25],
    ["health", "Фитнес-клуб/мес", 35, 75],
    ["entertainment", "Кино", 11, 16],
    ["entertainment", "Ресторан на двоих", 55, 120],
    ["entertainment", "Кёльнский собор (подъем на башню)", 6, 6],
    ["entertainment", "Музей шоколада (Lindt)", 14, 18],
    ["cafe", "Кёльш (местное пиво)", 2, 4],
    ["rent", "Аренда комнаты", 550, 900],
  ],
  reykjavik: [
    ["rent", "Аренда 1-комн. в центре", 220000, 320000],
    ["rent", "Аренда 1-комн. вне центра", 170000, 250000],
    ["rent", "Аренда 2-комн. в центре", 320000, 480000],
    ["utilities", "Коммунальные услуги", 15000, 25000],
    ["food", "Обед в кафе", 2500, 4500],
    ["food", "Продукты на месяц", 80000, 130000],
    ["cafe", "Кофе", 600, 1100],
    ["food", "Бизнес-ланч", 3000, 5500],
    ["transport", "Месячный проездной Streto", 10000, 12000],
    ["transport", "Такси 5 км", 3000, 5500],
    ["transport", "Бензин 1 л", 300, 350],
    ["utilities", "Интернет 1 Гбит/с", 5000, 9000],
    ["utilities", "Мобильная связь", 3000, 7000],
    ["health", "Фитнес-клуб/мес", 8000, 16000],
    ["entertainment", "Кино", 2000, 3000],
    ["entertainment", "Ресторан на двоих", 14000, 35000],
    ["entertainment", "Северное сияние тур", 12000, 25000],
    ["entertainment", "Геотермальная купальня (Sky Lagoon)", 9000, 14000],
    ["food", "Скир (исландский йогурт)", 200, 400],
    ["rent", "Аренда комнаты", 80000, 140000],
  ],
  adelaide: [
    ["rent", "Аренда 1-комн. в центре", 1700, 2500],
    ["rent", "Аренда 1-комн. вне центра", 1200, 1900],
    ["rent", "Аренда 2-комн. в центре", 2400, 3800],
    ["utilities", "Коммунальные услуги", 150, 280],
    ["food", "Обед в кафе", 15, 25],
    ["food", "Продукты на месяц", 420, 700],
    ["cafe", "Кофе", 4, 6],
    ["food", "Бизнес-ланч", 17, 30],
    ["transport", "Месячный проездной Metrocard", 120, 160],
    ["transport", "Такси 5 км", 14, 22],
    ["transport", "Бензин 1 л", 2, 2],
    ["utilities", "Интернет 100 Мбит/с", 55, 90],
    ["utilities", "Мобильная связь", 30, 65],
    ["health", "Фитнес-клуб/мес", 50, 100],
    ["entertainment", "Кино", 18, 24],
    ["entertainment", "Ресторан на двоих", 80, 180],
    ["entertainment", "Пляж Гленелг (автобус бесплатно)", 0, 4],
    ["entertainment", "Регион Барросса (винный тур, день)", 80, 200],
    ["food", "Барбекю с кенгуру (ресторан)", 28, 45],
    ["rent", "Аренда комнаты", 800, 1400],
  ],
};

// ─── Основная функция ───────────────────────────────────────────────────────────
async function run() {
  console.log(`Seed 15 новых городов стартует... (${new Date().toLocaleString("ru")})\n`);
  let added = 0;
  let skipped = 0;
  let totalPrices = 0;
  let totalPhotos = 0;

  for (const c of CITIES) {
    // Проверяем наличие
    const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
    if (existing) {
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

    // Unsplash API
    let photoData = null;
    try {
      photoData = await fetchUnsplash(c.unsplash_query);
      console.log(`  unsplash: ${photoData ? photoData.photo_id : "не найдено"}`);
    } catch (e) {
      console.warn(`  unsplash err: ${e.message}`);
    }

    // Пауза между запросами (50 req/hour Unsplash limit)
    await sleep(2000);

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

    const seo_title = `Стоимость жизни в ${c.name_ru} ${YEAR}: цены, виза, жилье | Relocost`;
    const seo_description = `Сколько стоит жизнь в ${c.name_ru}? Аренда, еда, транспорт — реальный бюджет на месяц для релоканта в ${YEAR} году.`;

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

    // Цены
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

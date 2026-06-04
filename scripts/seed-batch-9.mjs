// Seed девятой партии: Доха, Себу, Сплит, Салоники, Актау.
// Запуск: node scripts/seed-batch-9.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SUPA_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const CITIES = [
  {
    name_ru: "Доха", name_en: "Doha", slug: "doha",
    country_ru: "Катар", country_en: "Qatar", country_slug: "qatar", flag_emoji: "🇶🇦",
    population: "1.2 млн", climate: "+27°C ср.", language: "Арабский, английский", currency: "Риал, QAR",
    flight_from_moscow: "5 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица Катара на берегу Персидского залива: безвиз на 30 дней, нулевой подоходный налог, высокая безопасность и ультрасовременная инфраструктура. Дорогая аренда и очень жаркое лето, алкоголь ограничен.",
    lat: 25.2854, lng: 51.5310, unsplash_query: "doha qatar skyline",
  },
  {
    name_ru: "Себу", name_en: "Cebu", slug: "cebu",
    country_ru: "Филиппины", country_en: "Philippines", country_slug: "philippines", flag_emoji: "🇵🇭",
    population: "1 млн", climate: "+28°C ср.", language: "Английский, себуано, тагальский", currency: "Песо, PHP",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Островной город Филиппин: безвиз на 30 дней, английский как второй государственный и доступные цены. Тропики круглый год, дайвинг и пляжи рядом; минусы — трафик, тайфуны и островная логистика.",
    lat: 10.3157, lng: 123.8854, unsplash_query: "cebu philippines city",
  },
  {
    name_ru: "Сплит", name_en: "Split", slug: "split",
    country_ru: "Хорватия", country_en: "Croatia", country_slug: "croatia", flag_emoji: "🇭🇷",
    population: "180 тыс", climate: "+17°C ср.", language: "Хорватский, английский", currency: "Евро, EUR",
    flight_from_moscow: "5 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Главный город Далмации с дворцом Диоклетиана: мягкий средиземноморский климат, чистое Адриатическое море и острова рядом. Для россиян нужна шенгенская виза, летом многолюдно и дорого.",
    lat: 43.5081, lng: 16.4402, unsplash_query: "split croatia old town",
  },
  {
    name_ru: "Салоники", name_en: "Thessaloniki", slug: "thessaloniki",
    country_ru: "Греция", country_en: "Greece", country_slug: "greece", flag_emoji: "🇬🇷",
    population: "320 тыс", climate: "+16°C ср.", language: "Греческий, английский", currency: "Евро, EUR",
    flight_from_moscow: "4 часа с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Второй город Греции на берегу залива: насыщенная история, студенческая атмосфера и отличная кухня. Дешевле Афин; для россиян нужна шенгенская виза, зимой бывает прохладно и ветрено.",
    lat: 40.6401, lng: 22.9444, unsplash_query: "thessaloniki greece waterfront",
  },
  {
    name_ru: "Актау", name_en: "Aktau", slug: "aktau",
    country_ru: "Казахстан", country_en: "Kazakhstan", country_slug: "kazakhstan", flag_emoji: "🇰🇿",
    population: "230 тыс", climate: "+14°C ср.", language: "Казахский, русский", currency: "Тенге, KZT",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 1, is_popular: false,
    intro_text: "Город на берегу Каспия: безвиз для россиян, русский язык в быту и выход к морю посреди степи. Молодой город без привычных названий улиц (микрорайоны), сухой климат и сильные ветра.",
    lat: 43.6410, lng: 51.1701, unsplash_query: "aktau kazakhstan caspian sea",
  },
];

const PRICES = {
  doha: [
    ["rent","Комната",40000,75000,false],["rent","1-комн. квартира в центре",130000,220000,false],
    ["rent","1-комн. квартира на окраине",80000,140000,false],["rent","2-комн. квартира в центре",200000,340000,false],
    ["food","Обед в кафе",1200,2200,false],["food","Ужин на двоих в ресторане",6500,12000,false],
    ["food","Капучино",450,750,false],["food","Продукты на месяц на 1 человека",30000,48000,false],
    ["transport","Месячный проездной",4000,6000,false],["transport","Такси 3 км",600,1000,false],
    ["transport","Бензин (1 л)",45,60,false],["utilities","ЖКХ за 1-комн. квартиру",9000,18000,false],
    ["utilities","Домашний интернет",4000,6000,false],["utilities","Мобильная связь (месяц)",2200,4500,false],
    ["cafe","Стейк в ресторане среднего класса",5500,10000,true],["cafe","Коктейль в баре",1600,3000,true],
    ["health","Визит к частному врачу",6500,13000,true],["health","Абонемент в фитнес-клуб (мес)",9000,17000,true],
    ["entertainment","Билет в кино",1200,1900,true],["entertainment","Бокал вина или коктейль в баре",1300,2600,true],
  ],
  cebu: [
    ["rent","Комната",14000,26000,false],["rent","1-комн. квартира в центре",30000,55000,false],
    ["rent","1-комн. квартира на окраине",20000,35000,false],["rent","2-комн. квартира в центре",45000,80000,false],
    ["food","Обед в кафе",300,700,false],["food","Ужин на двоих в ресторане",1800,3800,false],
    ["food","Капучино",200,380,false],["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной",700,1400,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",90,120,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1300,2200,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",2000,4500,true],["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",350,650,true],["entertainment","Бокал вина или коктейль в баре",700,1300,true],
  ],
  split: [
    ["rent","Комната",25000,45000,false],["rent","1-комн. квартира в центре",55000,90000,false],
    ["rent","1-комн. квартира на окраине",38000,62000,false],["rent","2-комн. квартира в центре",75000,120000,false],
    ["food","Обед в кафе",900,1700,false],["food","Ужин на двоих в ресторане",3800,7000,false],
    ["food","Капучино",300,500,false],["food","Продукты на месяц на 1 человека",19000,29000,false],
    ["transport","Месячный проездной",1200,2000,false],["transport","Такси 3 км",600,1100,false],
    ["transport","Бензин (1 л)",140,170,false],["utilities","ЖКХ за 1-комн. квартиру",5000,11000,false],
    ["utilities","Домашний интернет",1800,2800,false],["utilities","Мобильная связь (месяц)",1000,1900,false],
    ["cafe","Стейк в ресторане среднего класса",2800,5200,true],["cafe","Коктейль в баре",800,1500,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",600,1000,true],["entertainment","Бокал вина или коктейль в баре",700,1400,true],
  ],
  thessaloniki: [
    ["rent","Комната",22000,42000,false],["rent","1-комн. квартира в центре",45000,80000,false],
    ["rent","1-комн. квартира на окраине",32000,55000,false],["rent","2-комн. квартира в центре",65000,105000,false],
    ["food","Обед в кафе",800,1500,false],["food","Ужин на двоих в ресторане",3300,6500,false],
    ["food","Капучино",350,550,false],["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Месячный проездной",1000,1800,false],["transport","Такси 3 км",550,1000,false],
    ["transport","Бензин (1 л)",150,180,false],["utilities","ЖКХ за 1-комн. квартиру",5000,11000,false],
    ["utilities","Домашний интернет",1800,2800,false],["utilities","Мобильная связь (месяц)",1000,1900,false],
    ["cafe","Стейк в ресторане среднего класса",2700,5000,true],["cafe","Коктейль в баре",800,1500,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",600,1000,true],["entertainment","Бокал вина или коктейль в баре",600,1300,true],
  ],
  aktau: [
    ["rent","Комната",14000,26000,false],["rent","1-комн. квартира в центре",30000,50000,false],
    ["rent","1-комн. квартира на окраине",22000,38000,false],["rent","2-комн. квартира в центре",45000,75000,false],
    ["food","Обед в кафе",500,1000,false],["food","Ужин на двоих в ресторане",2200,4500,false],
    ["food","Капучино",250,450,false],["food","Продукты на месяц на 1 человека",16000,25000,false],
    ["transport","Месячный проездной",400,800,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",50,70,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1000,1800,false],["utilities","Мобильная связь (месяц)",400,900,false],
    ["cafe","Стейк в ресторане среднего класса",2000,4000,true],["cafe","Коктейль в баре",600,1200,true],
    ["health","Визит к частному врачу",2500,5000,true],["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",400,700,true],["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
};

function seoFor(c) {
  const prepMap = {
    doha: "в Дохе", cebu: "на Себу", split: "в Сплите",
    thessaloniki: "в Салониках", aktau: "в Актау",
  };
  const phrase = prepMap[c.slug] ?? `в ${c.name_ru}`;
  return {
    seo_title: `Стоимость жизни ${phrase} 2026: виза, цены, отзывы | Relocost`,
    seo_description: `Сколько стоит жизнь ${phrase} в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.`,
  };
}

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return { photo_id: pick.id, base_url: pick.urls.raw, author_name: pick.user.name, author_url: pick.user.links.html };
}

async function run() {
  for (const c of CITIES) {
    const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
    if (existing) { console.log(`skip (exists): ${c.slug}`); continue; }
    let photo = null;
    try { photo = await fetchUnsplash(c.unsplash_query); } catch (e) { console.warn(`unsplash failed for ${c.slug}: ${e.message}`); }
    const seo = seoFor(c);
    const row = {
      name_ru: c.name_ru, name_en: c.name_en, slug: c.slug,
      country_ru: c.country_ru, country_en: c.country_en, country_slug: c.country_slug,
      flag_emoji: c.flag_emoji, population: c.population, climate: c.climate,
      language: c.language, currency: c.currency, flight_from_moscow: c.flight_from_moscow,
      is_foreign: c.is_foreign, difficulty_score: c.difficulty_score, is_popular: c.is_popular,
      seo_title: seo.seo_title, seo_description: seo.seo_description, intro_text: c.intro_text,
      lat: c.lat, lng: c.lng,
      unsplash_photo_id: photo?.photo_id ?? null, unsplash_url: photo?.base_url ?? null,
      unsplash_author_name: photo?.author_name ?? null, unsplash_author_url: photo?.author_url ?? null,
    };
    const { data: inserted, error } = await sb.from("cities").insert(row).select("id").single();
    if (error) throw new Error(`insert ${c.slug}: ${error.message}`);
    const cityId = inserted.id;
    const prices = (PRICES[c.slug] || []).map(([cat, item, min, max, prem]) => ({
      city_id: cityId, category: cat, item_name_ru: item, price_min: min, price_max: max, is_premium: prem,
    }));
    if (prices.length) {
      const { error: pErr } = await sb.from("prices").insert(prices);
      if (pErr) throw new Error(`prices ${c.slug}: ${pErr.message}`);
    }
    console.log(`+ ${c.slug}: city + ${prices.length} prices${photo ? " + photo" : ""}`);
  }
  console.log("done.");
}

run().catch((e) => { console.error(e); process.exit(1); });

// Seed шестой партии: Паттайя, Пенанг, Абу-Даби, Бухара.
// Запуск: node scripts/seed-batch-6.mjs
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
    name_ru: "Паттайя", name_en: "Pattaya", slug: "pattaya",
    country_ru: "Таиланд", country_en: "Thailand", country_slug: "thailand", flag_emoji: "🇹🇭",
    population: "320 тыс", climate: "+28°C ср.", language: "Тайский, русский, английский", currency: "Бат, THB",
    flight_from_moscow: "11 часов", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Паттайе 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Паттайе в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Курорт на берегу Сиамского залива: безвиз на 60 дней, теплое море круглый год и большое русскоязычное комьюнити. Дешевле Пхукета и близко к Бангкоку, но шумно и туристично.",
    lat: 12.9236, lng: 100.8825, unsplash_query: "pattaya thailand beach",
  },
  {
    name_ru: "Пенанг", name_en: "Penang", slug: "penang",
    country_ru: "Малайзия", country_en: "Malaysia", country_slug: "malaysia", flag_emoji: "🇲🇾",
    population: "750 тыс", climate: "+28°C ср.", language: "Малайский, английский, китайский", currency: "Ринггит, MYR",
    flight_from_moscow: "12 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни в Пенанге 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Пенанге в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Островной штат Малайзии с Джорджтауном под защитой ЮНЕСКО: английский в быту, легендарная уличная еда и доступные цены. Безвиз 30 дней, дальше — DE Rantau или MM2H.",
    lat: 5.4141, lng: 100.3288, unsplash_query: "penang george town malaysia",
  },
  {
    name_ru: "Абу-Даби", name_en: "Abu Dhabi", slug: "abu-dhabi",
    country_ru: "ОАЭ", country_en: "UAE", country_slug: "uae", flag_emoji: "🇦🇪",
    population: "1.5 млн", climate: "+28°C ср.", language: "Арабский, английский", currency: "Дирхам, AED",
    flight_from_moscow: "5.5 часа", is_foreign: true, difficulty_score: 3, is_popular: true,
    seo_title: "Стоимость жизни в Абу-Даби 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Абу-Даби в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Столица ОАЭ: безвиз на 90 дней, нулевой подоходный налог, высокая безопасность и современная инфраструктура. Спокойнее и чуть дешевле Дубая, но жилье и быт все равно дорогие.",
    lat: 24.4539, lng: 54.3773, unsplash_query: "abu dhabi uae skyline",
  },
  {
    name_ru: "Бухара", name_en: "Bukhara", slug: "bukhara",
    country_ru: "Узбекистан", country_en: "Uzbekistan", country_slug: "uzbekistan", flag_emoji: "🇺🇿",
    population: "280 тыс", climate: "+15°C ср.", language: "Узбекский, таджикский, русский", currency: "Сум, UZS",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 1, is_popular: false,
    seo_title: "Стоимость жизни в Бухаре 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Бухаре в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Древний город Шелкового пути с безвизом на 60 дней и одними из самых низких цен. Русский язык в быту и теплый климат, но провинциальный темп и скромная инфраструктура.",
    lat: 39.7747, lng: 64.4286, unsplash_query: "bukhara uzbekistan old city",
  },
];

const PRICES = {
  pattaya: [
    ["rent","Комната",14000,24000,false],
    ["rent","1-комн. квартира в центре",40000,70000,false],
    ["rent","1-комн. квартира на окраине",25000,45000,false],
    ["rent","2-комн. квартира в центре",60000,100000,false],
    ["food","Обед в кафе",350,800,false],
    ["food","Ужин на двоих в ресторане",2200,4500,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",17000,26000,false],
    ["transport","Месячный проездной",1500,2500,false],
    ["transport","Такси 3 км",400,800,false],
    ["transport","Бензин (1 л)",90,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4000,7500,false],
    ["utilities","Домашний интернет",1300,2000,false],
    ["utilities","Мобильная связь (месяц)",700,1300,false],
    ["cafe","Стейк в ресторане среднего класса",2300,4200,true],
    ["cafe","Коктейль в баре",650,1200,true],
    ["health","Визит к частному врачу",3000,6000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",450,750,true],
    ["entertainment","Бокал вина или коктейль в баре",550,1000,true],
  ],
  penang: [
    ["rent","Комната",16000,28000,false],
    ["rent","1-комн. квартира в центре",35000,60000,false],
    ["rent","1-комн. квартира на окраине",22000,38000,false],
    ["rent","2-комн. квартира в центре",50000,85000,false],
    ["food","Обед в кафе",350,750,false],
    ["food","Ужин на двоих в ресторане",2000,4000,false],
    ["food","Капучино",250,400,false],
    ["food","Продукты на месяц на 1 человека",17000,26000,false],
    ["transport","Месячный проездной",1500,2500,false],
    ["transport","Такси 3 км",300,600,false],
    ["transport","Бензин (1 л)",55,75,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3500,6500,false],
    ["utilities","Домашний интернет",1500,2500,false],
    ["utilities","Мобильная связь (месяц)",600,1200,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4500,true],
    ["cafe","Коктейль в баре",700,1300,true],
    ["health","Визит к частному врачу",2500,5000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3000,5500,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  "abu-dhabi": [
    ["rent","Комната",45000,80000,false],
    ["rent","1-комн. квартира в центре",150000,240000,false],
    ["rent","1-комн. квартира на окраине",90000,150000,false],
    ["rent","2-комн. квартира в центре",230000,380000,false],
    ["food","Обед в кафе",1300,2300,false],
    ["food","Ужин на двоих в ресторане",7000,13000,false],
    ["food","Капучино",500,800,false],
    ["food","Продукты на месяц на 1 человека",32000,50000,false],
    ["transport","Месячный проездной",5000,7000,false],
    ["transport","Такси 3 км",700,1100,false],
    ["transport","Бензин (1 л)",65,85,false],
    ["utilities","ЖКХ за 1-комн. квартиру",10000,20000,false],
    ["utilities","Домашний интернет",4000,6000,false],
    ["utilities","Мобильная связь (месяц)",2500,5000,false],
    ["cafe","Стейк в ресторане среднего класса",6000,11000,true],
    ["cafe","Коктейль в баре",1700,3200,true],
    ["health","Визит к частному врачу",7000,14000,true],
    ["health","Абонемент в фитнес-клуб (мес)",10000,18000,true],
    ["entertainment","Билет в кино",1400,2000,true],
    ["entertainment","Бокал вина или коктейль в баре",1400,2800,true],
  ],
  bukhara: [
    ["rent","Комната",8000,15000,false],
    ["rent","1-комн. квартира в центре",22000,40000,false],
    ["rent","1-комн. квартира на окраине",13000,23000,false],
    ["rent","2-комн. квартира в центре",35000,58000,false],
    ["food","Обед в кафе",250,600,false],
    ["food","Ужин на двоих в ресторане",1600,3200,false],
    ["food","Капучино",150,300,false],
    ["food","Продукты на месяц на 1 человека",10000,16000,false],
    ["transport","Месячный проездной",400,800,false],
    ["transport","Такси 3 км",200,400,false],
    ["transport","Бензин (1 л)",70,90,false],
    ["utilities","ЖКХ за 1-комн. квартиру",1800,3800,false],
    ["utilities","Домашний интернет",800,1500,false],
    ["utilities","Мобильная связь (месяц)",350,700,false],
    ["cafe","Стейк в ресторане среднего класса",1400,2600,true],
    ["cafe","Коктейль в баре",400,800,true],
    ["health","Визит к частному врачу",1200,2800,true],
    ["health","Абонемент в фитнес-клуб (мес)",1800,4000,true],
    ["entertainment","Билет в кино",250,500,true],
    ["entertainment","Бокал вина или коктейль в баре",400,800,true],
  ],
};

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
  return {
    photo_id: pick.id,
    base_url: pick.urls.raw,
    author_name: pick.user.name,
    author_url: pick.user.links.html,
  };
}

async function run() {
  for (const c of CITIES) {
    const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
    if (existing) {
      console.log(`skip (exists): ${c.slug}`);
      continue;
    }
    let photo = null;
    try { photo = await fetchUnsplash(c.unsplash_query); } catch (e) { console.warn(`unsplash failed for ${c.slug}: ${e.message}`); }

    const row = {
      name_ru: c.name_ru, name_en: c.name_en, slug: c.slug,
      country_ru: c.country_ru, country_en: c.country_en, country_slug: c.country_slug,
      flag_emoji: c.flag_emoji, population: c.population, climate: c.climate,
      language: c.language, currency: c.currency, flight_from_moscow: c.flight_from_moscow,
      is_foreign: c.is_foreign, difficulty_score: c.difficulty_score, is_popular: c.is_popular,
      seo_title: c.seo_title, seo_description: c.seo_description, intro_text: c.intro_text,
      lat: c.lat, lng: c.lng,
      unsplash_photo_id: photo?.photo_id ?? null,
      unsplash_url: photo?.base_url ?? null,
      unsplash_author_name: photo?.author_name ?? null,
      unsplash_author_url: photo?.author_url ?? null,
    };
    const { data: inserted, error } = await sb.from("cities").insert(row).select("id").single();
    if (error) throw new Error(`insert ${c.slug}: ${error.message}`);
    const cityId = inserted.id;

    const prices = (PRICES[c.slug] || []).map(([cat, item, min, max, prem]) => ({
      city_id: cityId, category: cat, item_name_ru: item,
      price_min: min, price_max: max, is_premium: prem,
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

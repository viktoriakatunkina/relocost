// Seed пятой партии: Астана, Измир, Порту, Малага, Самарканд.
// Запуск: node scripts/seed-batch-5.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

const CITIES = [
  {
    name_ru: "Астана", name_en: "Astana", slug: "astana",
    country_ru: "Казахстан", country_en: "Kazakhstan", country_slug: "kazakhstan", flag_emoji: "🇰🇿",
    population: "1.4 млн", climate: "+4°C ср.", language: "Казахский, русский", currency: "Тенге, KZT",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 1, is_popular: true,
    seo_title: "Стоимость жизни в Астане 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Астане в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Безвизовый въезд на 90 дней, русский язык в быту и минимальная бюрократия для россиян. Современная столица с растущей IT-сценой и новым жильем — но с суровой степной зимой.",
    lat: 51.1605, lng: 71.4704, unsplash_query: "astana kazakhstan city",
  },
  {
    name_ru: "Измир", name_en: "Izmir", slug: "izmir",
    country_ru: "Турция", country_en: "Turkey", country_slug: "turkey", flag_emoji: "🇹🇷",
    population: "4.4 млн", climate: "+18°C ср.", language: "Турецкий, английский", currency: "Турецкая лира, TRY",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Измире 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Измире в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Третий по величине город Турции на Эгейском море: безвизовый въезд на 90 дней, мягкий климат и более спокойный ритм, чем в Стамбуле. Хорош для удаленной работы у моря, но под ВНЖ часть районов закрыта.",
    lat: 38.4237, lng: 27.1428, unsplash_query: "izmir turkey waterfront",
  },
  {
    name_ru: "Порту", name_en: "Porto", slug: "porto",
    country_ru: "Португалия", country_en: "Portugal", country_slug: "portugal", flag_emoji: "🇵🇹",
    population: "230 тыс", climate: "+15°C ср.", language: "Португальский, английский", currency: "Евро, EUR",
    flight_from_moscow: "5–8 ч с пересадкой", is_foreign: true, difficulty_score: 4, is_popular: false,
    seo_title: "Стоимость жизни в Порту 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Порту в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Атлантическая альтернатива Лиссабону — дешевле примерно на 15%, мягкий климат и историческая среда. Переезд идет через визы D7/D8 и требует подтвержденного дохода и терпения к бюрократии AIMA.",
    lat: 41.1579, lng: -8.6291, unsplash_query: "porto portugal douro",
  },
  {
    name_ru: "Малага", name_en: "Malaga", slug: "malaga",
    country_ru: "Испания", country_en: "Spain", country_slug: "spain", flag_emoji: "🇪🇸",
    population: "580 тыс", climate: "+19°C ср.", language: "Испанский, английский", currency: "Евро, EUR",
    flight_from_moscow: "5–8 ч с пересадкой", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Малаге 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Малаге в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Столица Коста-дель-Соль: около 300 солнечных дней, мягкая зима и репутация одного из самых комфортных городов Испании для семей. Переезд — через визу цифрового кочевника или ВНЖ, нужен стабильный доход.",
    lat: 36.7213, lng: -4.4214, unsplash_query: "malaga spain coast",
  },
  {
    name_ru: "Самарканд", name_en: "Samarkand", slug: "samarkand",
    country_ru: "Узбекистан", country_en: "Uzbekistan", country_slug: "uzbekistan", flag_emoji: "🇺🇿",
    population: "560 тыс", climate: "+15°C ср.", language: "Узбекский, таджикский, русский", currency: "Сум, UZS",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 1, is_popular: false,
    seo_title: "Стоимость жизни в Самарканде 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Самарканде в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Древний город Шелкового пути с безвизом на 60 дней, очень низкими ценами и русским языком в быту. Спокойный вариант для бюджетного переезда, хотя IT-инфраструктура скромнее ташкентской.",
    lat: 39.627, lng: 66.975, unsplash_query: "samarkand registan uzbekistan",
  },
];

const PRICES = {
  astana: [
    ["rent","Комната",22000,38000,false],
    ["rent","1-комн. квартира в центре",50000,85000,false],
    ["rent","1-комн. квартира на окраине",32000,52000,false],
    ["rent","2-комн. квартира в центре",75000,120000,false],
    ["food","Обед в кафе",600,1100,false],
    ["food","Ужин на двоих в ресторане",3000,6000,false],
    ["food","Капучино",300,450,false],
    ["food","Продукты на месяц на 1 человека",20000,30000,false],
    ["transport","Месячный проездной",1300,2000,false],
    ["transport","Такси 3 км",350,600,false],
    ["transport","Бензин (1 л)",55,70,false],
    ["utilities","ЖКХ за 1-комн. квартиру",5000,9000,false],
    ["utilities","Домашний интернет",1300,2200,false],
    ["utilities","Мобильная связь (месяц)",700,1300,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4200,true],
    ["cafe","Коктейль в баре",600,1100,true],
    ["health","Визит к частному врачу",3500,6500,true],
    ["health","Абонемент в фитнес-клуб (мес)",4000,7500,true],
    ["entertainment","Билет в кино",500,850,true],
    ["entertainment","Бокал вина или коктейль в баре",500,1000,true],
  ],
  izmir: [
    ["rent","Комната",16000,28000,false],
    ["rent","1-комн. квартира в центре",50000,85000,false],
    ["rent","1-комн. квартира на окраине",32000,52000,false],
    ["rent","2-комн. квартира в центре",75000,120000,false],
    ["food","Обед в кафе",600,1200,false],
    ["food","Ужин на двоих в ресторане",3500,6500,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",18000,27000,false],
    ["transport","Месячный проездной",1000,1600,false],
    ["transport","Такси 3 км",300,600,false],
    ["transport","Бензин (1 л)",120,150,false],
    ["utilities","ЖКХ за 1-комн. квартиру",5000,8500,false],
    ["utilities","Домашний интернет",1400,2400,false],
    ["utilities","Мобильная связь (месяц)",700,1400,false],
    ["cafe","Стейк в ресторане среднего класса",2600,4300,true],
    ["cafe","Коктейль в баре",650,1200,true],
    ["health","Визит к частному врачу",3000,5500,true],
    ["health","Абонемент в фитнес-клуб (мес)",4000,7000,true],
    ["entertainment","Билет в кино",500,800,true],
    ["entertainment","Бокал вина или коктейль в баре",500,900,true],
  ],
  porto: [
    ["rent","Комната",30000,48000,false],
    ["rent","1-комн. квартира в центре",85000,135000,false],
    ["rent","1-комн. квартира на окраине",50000,80000,false],
    ["rent","2-комн. квартира в центре",110000,180000,false],
    ["food","Обед в кафе",700,1300,false],
    ["food","Ужин на двоих в ресторане",4000,8000,false],
    ["food","Капучино",200,400,false],
    ["food","Продукты на месяц на 1 человека",22000,34000,false],
    ["transport","Месячный проездной",3500,4500,false],
    ["transport","Такси 3 км",450,800,false],
    ["transport","Бензин (1 л)",150,180,false],
    ["utilities","ЖКХ за 1-комн. квартиру",6500,11000,false],
    ["utilities","Домашний интернет",2200,3500,false],
    ["utilities","Мобильная связь (месяц)",1300,2200,false],
    ["cafe","Стейк в ресторане среднего класса",3500,6500,true],
    ["cafe","Коктейль в баре",750,1300,true],
    ["health","Визит к частному врачу",4500,8000,true],
    ["health","Абонемент в фитнес-клуб (мес)",4500,8500,true],
    ["entertainment","Билет в кино",550,900,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1200,true],
  ],
  malaga: [
    ["rent","Комната",32000,48000,false],
    ["rent","1-комн. квартира в центре",80000,120000,false],
    ["rent","1-комн. квартира на окраине",55000,82000,false],
    ["rent","2-комн. квартира в центре",110000,165000,false],
    ["food","Обед в кафе",1000,1800,false],
    ["food","Ужин на двоих в ресторане",5000,8500,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",28000,40000,false],
    ["transport","Месячный проездной",3000,4500,false],
    ["transport","Такси 3 км",550,900,false],
    ["transport","Бензин (1 л)",150,180,false],
    ["utilities","ЖКХ за 1-комн. квартиру",8000,13000,false],
    ["utilities","Домашний интернет",2000,3000,false],
    ["utilities","Мобильная связь (месяц)",1200,2000,false],
    ["cafe","Стейк в ресторане среднего класса",3800,6000,true],
    ["cafe","Коктейль в баре",800,1400,true],
    ["health","Визит к частному врачу",5500,9000,true],
    ["health","Абонемент в фитнес-клуб (мес)",4500,7500,true],
    ["entertainment","Билет в кино",700,1000,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  samarkand: [
    ["rent","Комната",9000,16000,false],
    ["rent","1-комн. квартира в центре",25000,45000,false],
    ["rent","1-комн. квартира на окраине",15000,26000,false],
    ["rent","2-комн. квартира в центре",40000,65000,false],
    ["food","Обед в кафе",300,650,false],
    ["food","Ужин на двоих в ресторане",1800,3500,false],
    ["food","Капучино",150,300,false],
    ["food","Продукты на месяц на 1 человека",11000,18000,false],
    ["transport","Месячный проездной",500,900,false],
    ["transport","Такси 3 км",200,400,false],
    ["transport","Бензин (1 л)",70,90,false],
    ["utilities","ЖКХ за 1-комн. квартиру",2000,4000,false],
    ["utilities","Домашний интернет",800,1500,false],
    ["utilities","Мобильная связь (месяц)",350,700,false],
    ["cafe","Стейк в ресторане среднего класса",1500,2800,true],
    ["cafe","Коктейль в баре",400,800,true],
    ["health","Визит к частному врачу",1200,3000,true],
    ["health","Абонемент в фитнес-клуб (мес)",2000,4500,true],
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

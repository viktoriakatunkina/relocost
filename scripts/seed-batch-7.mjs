// Seed седьмой партии: Баку, Самуи, Бодрум.
// Запуск: node scripts/seed-batch-7.mjs
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
    name_ru: "Баку", name_en: "Baku", slug: "baku",
    country_ru: "Азербайджан", country_en: "Azerbaijan", country_slug: "azerbaijan", flag_emoji: "🇦🇿",
    population: "2.3 млн", climate: "+15°C ср.", language: "Азербайджанский, русский", currency: "Манат, AZN",
    flight_from_moscow: "3 часа", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни в Баку 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Баку в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Столица Азербайджана на берегу Каспия: безвиз на 90 дней, прямые рейсы из Москвы и широко распространенный русский язык. Современный центр с приморским бульваром, мягкая зима, но ветрено и аренда выше, чем в среднем по региону.",
    lat: 40.4093, lng: 49.8671, unsplash_query: "baku azerbaijan flame towers",
  },
  {
    name_ru: "Самуи", name_en: "Ko Samui", slug: "samui",
    country_ru: "Таиланд", country_en: "Thailand", country_slug: "thailand", flag_emoji: "🇹🇭",
    population: "70 тыс", climate: "+28°C ср.", language: "Тайский, английский", currency: "Бат, THB",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни на Самуи 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь на Самуи в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Тропический остров в Сиамском заливе: безвиз на 60 дней, пляжи и пальмы круглый год. Спокойнее и зеленее Пхукета, удобен для жизни по DTV-визе, но все привозное чуть дороже материка, а медицина и логистика — островные.",
    lat: 9.5120, lng: 100.0136, unsplash_query: "koh samui thailand beach",
  },
  {
    name_ru: "Бодрум", name_en: "Bodrum", slug: "bodrum",
    country_ru: "Турция", country_en: "Turkey", country_slug: "turkey", flag_emoji: "🇹🇷",
    population: "180 тыс", climate: "+19°C ср.", language: "Турецкий, английский", currency: "Лира, TRY",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни в Бодруме 2026: виза, цены, отзывы | Relocost",
    seo_description: "Сколько стоит жизнь в Бодруме в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.",
    intro_text: "Курорт на Эгейском побережье Турции: безвиз, мягкий средиземноморский климат и яхтенная атмосфера. Дороже и статуснее Антальи с Аланией, летом многолюдно, а зимой курортная жизнь заметно затихает.",
    lat: 37.0344, lng: 27.4305, unsplash_query: "bodrum turkey marina",
  },
];

const PRICES = {
  baku: [
    ["rent","Комната",18000,30000,false],
    ["rent","1-комн. квартира в центре",40000,65000,false],
    ["rent","1-комн. квартира на окраине",28000,45000,false],
    ["rent","2-комн. квартира в центре",60000,95000,false],
    ["food","Обед в кафе",600,1200,false],
    ["food","Ужин на двоих в ресторане",2500,5000,false],
    ["food","Капучино",250,450,false],
    ["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Месячный проездной",600,1100,false],
    ["transport","Такси 3 км",300,600,false],
    ["transport","Бензин (1 л)",70,95,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4000,8000,false],
    ["utilities","Домашний интернет",1000,1800,false],
    ["utilities","Мобильная связь (месяц)",400,900,false],
    ["cafe","Стейк в ресторане среднего класса",2000,4000,true],
    ["cafe","Коктейль в баре",700,1300,true],
    ["health","Визит к частному врачу",2500,5000,true],
    ["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  samui: [
    ["rent","Комната",16000,28000,false],
    ["rent","1-комн. квартира в центре",38000,65000,false],
    ["rent","1-комн. квартира на окраине",24000,42000,false],
    ["rent","2-комн. квартира в центре",55000,95000,false],
    ["food","Обед в кафе",350,850,false],
    ["food","Ужин на двоих в ресторане",2200,4500,false],
    ["food","Капучино",200,380,false],
    ["food","Продукты на месяц на 1 человека",17000,27000,false],
    ["transport","Месячный проездной",1500,2500,false],
    ["transport","Такси 3 км",400,900,false],
    ["transport","Бензин (1 л)",90,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4000,8000,false],
    ["utilities","Домашний интернет",1300,2000,false],
    ["utilities","Мобильная связь (месяц)",700,1300,false],
    ["cafe","Стейк в ресторане среднего класса",2400,4400,true],
    ["cafe","Коктейль в баре",650,1200,true],
    ["health","Визит к частному врачу",3000,6000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",450,750,true],
    ["entertainment","Бокал вина или коктейль в баре",550,1000,true],
  ],
  bodrum: [
    ["rent","Комната",22000,38000,false],
    ["rent","1-комн. квартира в центре",45000,80000,false],
    ["rent","1-комн. квартира на окраине",30000,55000,false],
    ["rent","2-комн. квартира в центре",70000,120000,false],
    ["food","Обед в кафе",600,1300,false],
    ["food","Ужин на двоих в ресторане",3000,6000,false],
    ["food","Капучино",250,450,false],
    ["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Месячный проездной",800,1500,false],
    ["transport","Такси 3 км",400,800,false],
    ["transport","Бензин (1 л)",90,120,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4000,9000,false],
    ["utilities","Домашний интернет",900,1600,false],
    ["utilities","Мобильная связь (месяц)",600,1200,false],
    ["cafe","Стейк в ресторане среднего класса",2500,5000,true],
    ["cafe","Коктейль в баре",800,1600,true],
    ["health","Визит к частному врачу",3000,6000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Бокал вина или коктейль в баре",700,1400,true],
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

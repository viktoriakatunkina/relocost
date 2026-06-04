// Seed десятой партии: Маскат, Манама, Пномпень, Санья, Сеул,
// Шарджа, Мадрид, Джакарта, Фукуок, Краби.
// Запуск: node scripts/seed-batch-10.mjs
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
    name_ru: "Маскат", name_en: "Muscat", slug: "muscat",
    country_ru: "Оман", country_en: "Oman", country_slug: "oman", flag_emoji: "🇴🇲",
    population: "1.5 млн", climate: "+28°C ср.", language: "Арабский, английский", currency: "Риал, OMR",
    flight_from_moscow: "6 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица Омана между горами и Аравийским морем: спокойный и безопасный город с нулевым подоходным налогом и сохраненным арабским колоритом. Для россиян нужна электронная виза; очень жаркое лето.",
    lat: 23.5880, lng: 58.3829, unsplash_query: "muscat oman mosque",
  },
  {
    name_ru: "Манама", name_en: "Manama", slug: "manama",
    country_ru: "Бахрейн", country_en: "Bahrain", country_slug: "bahrain", flag_emoji: "🇧🇭",
    population: "700 тыс агломерация", climate: "+27°C ср.", language: "Арабский, английский", currency: "Динар, BHD",
    flight_from_moscow: "5.5 часа с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица островного Бахрейна в Персидском заливе: нулевой подоходный налог, либеральнее соседей и компактная жизнь. Для россиян — виза по прибытии или eVisa; жаркое влажное лето.",
    lat: 26.2235, lng: 50.5876, unsplash_query: "manama bahrain skyline",
  },
  {
    name_ru: "Пномпень", name_en: "Phnom Penh", slug: "phnom-penh",
    country_ru: "Камбоджа", country_en: "Cambodia", country_slug: "cambodia", flag_emoji: "🇰🇭",
    population: "2.1 млн", climate: "+28°C ср.", language: "Кхмерский, английский", currency: "Риель, KHR (и доллары США)",
    flight_from_moscow: "12 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Столица Камбоджи на слиянии рек: дешевая жизнь, простая виза по прибытии и широкое хождение долларов США. Растущее комьюнити экспатов; минусы — жара, хаотичный трафик и базовая инфраструктура.",
    lat: 11.5564, lng: 104.9282, unsplash_query: "phnom penh cambodia city",
  },
  {
    name_ru: "Санья", name_en: "Sanya", slug: "sanya",
    country_ru: "Китай", country_en: "China", country_slug: "china", flag_emoji: "🇨🇳",
    population: "1 млн", climate: "+26°C ср.", language: "Китайский, английский", currency: "Юань, CNY",
    flight_from_moscow: "12 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Тропический курорт на острове Хайнань: для россиян действует безвизовый въезд на Хайнань до 30 дней, теплое море круглый год и развитая курортная инфраструктура. Минусы — языковой барьер и ограничения китайского интернета.",
    lat: 18.2528, lng: 109.5119, unsplash_query: "sanya hainan china beach",
  },
  {
    name_ru: "Сеул", name_en: "Seoul", slug: "seoul",
    country_ru: "Южная Корея", country_en: "South Korea", country_slug: "south-korea", flag_emoji: "🇰🇷",
    population: "9.5 млн", climate: "+13°C ср.", language: "Корейский, английский", currency: "Вона, KRW",
    flight_from_moscow: "9 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица Южной Кореи: для россиян безвиз до 60 дней (нужна авторизация K-ETA), сверхбыстрый интернет, безопасность и удобный транспорт. Минусы — высокая аренда, языковой барьер и интенсивный ритм.",
    lat: 37.5665, lng: 126.9780, unsplash_query: "seoul south korea city",
  },
  {
    name_ru: "Шарджа", name_en: "Sharjah", slug: "sharjah",
    country_ru: "ОАЭ", country_en: "UAE", country_slug: "uae", flag_emoji: "🇦🇪",
    population: "1.8 млн", climate: "+28°C ср.", language: "Арабский, английский", currency: "Дирхам, AED",
    flight_from_moscow: "5.5 часа", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Третий по величине эмират ОАЭ рядом с Дубаем: безвиз на 90 дней, нулевой подоходный налог и заметно более доступная аренда. «Сухой» эмират — алкоголь под запретом, и до Дубая бывают пробки.",
    lat: 25.3463, lng: 55.4209, unsplash_query: "sharjah uae city",
  },
  {
    name_ru: "Мадрид", name_en: "Madrid", slug: "madrid",
    country_ru: "Испания", country_en: "Spain", country_slug: "spain", flag_emoji: "🇪🇸",
    population: "3.3 млн", climate: "+15°C ср.", language: "Испанский, английский", currency: "Евро, EUR",
    flight_from_moscow: "5.5 часа с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица Испании в центре страны: насыщенная культурная жизнь, отличная гастрономия и развитая инфраструктура. Для россиян нужна виза (подойдет номад-виза); дороже побережья, жаркое лето и прохладная для юга зима.",
    lat: 40.4168, lng: -3.7038, unsplash_query: "madrid spain city",
  },
  {
    name_ru: "Джакарта", name_en: "Jakarta", slug: "jakarta",
    country_ru: "Индонезия", country_en: "Indonesia", country_slug: "indonesia", flag_emoji: "🇮🇩",
    population: "11 млн", climate: "+28°C ср.", language: "Индонезийский, английский", currency: "Рупия, IDR",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Столица Индонезии и деловой центр страны: виза по прибытии на 30 дней, низкие цены и круглогодичные тропики. Минусы — знаменитые пробки, влажность и качество воздуха мегаполиса.",
    lat: -6.2088, lng: 106.8456, unsplash_query: "jakarta indonesia city",
  },
  {
    name_ru: "Фукуок", name_en: "Phu Quoc", slug: "phu-quoc",
    country_ru: "Вьетнам", country_en: "Vietnam", country_slug: "vietnam", flag_emoji: "🇻🇳",
    population: "180 тыс", climate: "+27°C ср.", language: "Вьетнамский, английский", currency: "Донг, VND",
    flight_from_moscow: "12 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Тропический остров на юге Вьетнама: для въезда действует визовое освобождение до 30 дней, белые пляжи и теплое море круглый год. Спокойнее материка, но все привозное чуть дороже, а медицина островная.",
    lat: 10.2270, lng: 103.9640, unsplash_query: "phu quoc vietnam beach",
  },
  {
    name_ru: "Краби", name_en: "Krabi", slug: "krabi",
    country_ru: "Таиланд", country_en: "Thailand", country_slug: "thailand", flag_emoji: "🇹🇭",
    population: "60 тыс", climate: "+28°C ср.", language: "Тайский, английский", currency: "Бат, THB",
    flight_from_moscow: "12 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Провинция на юге Таиланда со скалами-карстами и бирюзовым Андаманским морем: безвиз на 60 дней, спокойнее Пхукета и природа вокруг. Минусы — сезон дождей и нужен байк для передвижения.",
    lat: 8.0863, lng: 98.9063, unsplash_query: "krabi thailand beach cliffs",
  },
];

const PRICES = {
  muscat: [
    ["rent","Комната",30000,55000,false],["rent","1-комн. квартира в центре",80000,140000,false],
    ["rent","1-комн. квартира на окраине",55000,95000,false],["rent","2-комн. квартира в центре",120000,200000,false],
    ["food","Обед в кафе",800,1600,false],["food","Ужин на двоих в ресторане",4500,9000,false],
    ["food","Капучино",350,600,false],["food","Продукты на месяц на 1 человека",25000,40000,false],
    ["transport","Месячный проездной",3000,5000,false],["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",35,50,false],["utilities","ЖКХ за 1-комн. квартиру",6000,13000,false],
    ["utilities","Домашний интернет",3000,5000,false],["utilities","Мобильная связь (месяц)",1500,3000,false],
    ["cafe","Стейк в ресторане среднего класса",4000,8000,true],["cafe","Коктейль в баре",1300,2600,true],
    ["health","Визит к частному врачу",5000,10000,true],["health","Абонемент в фитнес-клуб (мес)",6000,12000,true],
    ["entertainment","Билет в кино",900,1500,true],["entertainment","Бокал вина или коктейль в баре",1200,2400,true],
  ],
  manama: [
    ["rent","Комната",30000,55000,false],["rent","1-комн. квартира в центре",75000,130000,false],
    ["rent","1-комн. квартира на окраине",50000,90000,false],["rent","2-комн. квартира в центре",110000,190000,false],
    ["food","Обед в кафе",800,1500,false],["food","Ужин на двоих в ресторане",4500,8500,false],
    ["food","Капучино",350,600,false],["food","Продукты на месяц на 1 человека",25000,40000,false],
    ["transport","Месячный проездной",2500,4500,false],["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",35,50,false],["utilities","ЖКХ за 1-комн. квартиру",6000,13000,false],
    ["utilities","Домашний интернет",3000,5000,false],["utilities","Мобильная связь (месяц)",1500,3000,false],
    ["cafe","Стейк в ресторане среднего класса",4000,7500,true],["cafe","Коктейль в баре",1300,2600,true],
    ["health","Визит к частному врачу",5000,10000,true],["health","Абонемент в фитнес-клуб (мес)",6000,11000,true],
    ["entertainment","Билет в кино",800,1400,true],["entertainment","Бокал вина или коктейль в баре",1200,2400,true],
  ],
  "phnom-penh": [
    ["rent","Комната",12000,24000,false],["rent","1-комн. квартира в центре",28000,50000,false],
    ["rent","1-комн. квартира на окраине",18000,32000,false],["rent","2-комн. квартира в центре",42000,75000,false],
    ["food","Обед в кафе",300,700,false],["food","Ужин на двоих в ресторане",1700,3500,false],
    ["food","Капучино",200,380,false],["food","Продукты на месяц на 1 человека",13000,21000,false],
    ["transport","Месячный проездной",700,1400,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",90,120,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1200,2000,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",2000,4500,true],["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",350,650,true],["entertainment","Бокал вина или коктейль в баре",700,1300,true],
  ],
  sanya: [
    ["rent","Комната",22000,40000,false],["rent","1-комн. квартира в центре",45000,80000,false],
    ["rent","1-комн. квартира на окраине",30000,55000,false],["rent","2-комн. квартира в центре",65000,110000,false],
    ["food","Обед в кафе",600,1200,false],["food","Ужин на двоих в ресторане",2800,5500,false],
    ["food","Капучино",350,600,false],["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Месячный проездной",800,1500,false],["transport","Такси 3 км",350,700,false],
    ["transport","Бензин (1 л)",80,110,false],["utilities","ЖКХ за 1-комн. квартиру",4000,9000,false],
    ["utilities","Домашний интернет",1500,2500,false],["utilities","Мобильная связь (месяц)",800,1600,false],
    ["cafe","Стейк в ресторане среднего класса",2800,5500,true],["cafe","Коктейль в баре",800,1600,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3500,7000,true],
    ["entertainment","Билет в кино",600,1100,true],["entertainment","Бокал вина или коктейль в баре",900,1800,true],
  ],
  seoul: [
    ["rent","Комната",35000,60000,false],["rent","1-комн. квартира в центре",70000,120000,false],
    ["rent","1-комн. квартира на окраине",50000,85000,false],["rent","2-комн. квартира в центре",100000,170000,false],
    ["food","Обед в кафе",800,1600,false],["food","Ужин на двоих в ресторане",3500,7000,false],
    ["food","Капучино",400,650,false],["food","Продукты на месяц на 1 человека",25000,38000,false],
    ["transport","Месячный проездной",1500,2500,false],["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",110,140,false],["utilities","ЖКХ за 1-комн. квартиру",6000,12000,false],
    ["utilities","Домашний интернет",1800,2800,false],["utilities","Мобильная связь (месяц)",1500,2800,false],
    ["cafe","Стейк в ресторане среднего класса",3500,7000,true],["cafe","Коктейль в баре",1000,2000,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",4000,8000,true],
    ["entertainment","Билет в кино",900,1400,true],["entertainment","Бокал вина или коктейль в баре",900,1800,true],
  ],
  sharjah: [
    ["rent","Комната",35000,60000,false],["rent","1-комн. квартира в центре",90000,150000,false],
    ["rent","1-комн. квартира на окраине",60000,100000,false],["rent","2-комн. квартира в центре",130000,220000,false],
    ["food","Обед в кафе",1000,1900,false],["food","Ужин на двоих в ресторане",5500,10000,false],
    ["food","Капучино",400,650,false],["food","Продукты на месяц на 1 человека",28000,44000,false],
    ["transport","Месячный проездной",4000,6000,false],["transport","Такси 3 км",600,1000,false],
    ["transport","Бензин (1 л)",65,85,false],["utilities","ЖКХ за 1-комн. квартиру",8000,16000,false],
    ["utilities","Домашний интернет",4000,6000,false],["utilities","Мобильная связь (месяц)",2200,4500,false],
    ["cafe","Стейк в ресторане среднего класса",5000,9000,true],["cafe","Коктейль в баре",1500,2800,true],
    ["health","Визит к частному врачу",6000,12000,true],["health","Абонемент в фитнес-клуб (мес)",8000,15000,true],
    ["entertainment","Билет в кино",1200,1900,true],["entertainment","Бокал вина или коктейль в баре",1500,2800,true],
  ],
  madrid: [
    ["rent","Комната",32000,55000,false],["rent","1-комн. квартира в центре",70000,115000,false],
    ["rent","1-комн. квартира на окраине",50000,80000,false],["rent","2-комн. квартира в центре",95000,150000,false],
    ["food","Обед в кафе",1000,1900,false],["food","Ужин на двоих в ресторане",4200,7500,false],
    ["food","Капучино",300,500,false],["food","Продукты на месяц на 1 человека",20000,30000,false],
    ["transport","Месячный проездной",1300,2200,false],["transport","Такси 3 км",600,1100,false],
    ["transport","Бензин (1 л)",150,180,false],["utilities","ЖКХ за 1-комн. квартиру",6000,12000,false],
    ["utilities","Домашний интернет",1800,2800,false],["utilities","Мобильная связь (месяц)",1000,1900,false],
    ["cafe","Стейк в ресторане среднего класса",3000,5500,true],["cafe","Коктейль в баре",900,1700,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",700,1100,true],["entertainment","Бокал вина или коктейль в баре",700,1400,true],
  ],
  jakarta: [
    ["rent","Комната",16000,30000,false],["rent","1-комн. квартира в центре",35000,65000,false],
    ["rent","1-комн. квартира на окраине",24000,42000,false],["rent","2-комн. квартира в центре",50000,90000,false],
    ["food","Обед в кафе",350,800,false],["food","Ужин на двоих в ресторане",2000,4000,false],
    ["food","Капучино",250,450,false],["food","Продукты на месяц на 1 человека",15000,24000,false],
    ["transport","Месячный проездной",700,1400,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",80,110,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1300,2200,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",2000,4000,true],["cafe","Коктейль в баре",600,1200,true],
    ["health","Визит к частному врачу",2500,5000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",400,700,true],["entertainment","Бокал вина или коктейль в баре",800,1600,true],
  ],
  "phu-quoc": [
    ["rent","Комната",16000,28000,false],["rent","1-комн. квартира в центре",32000,58000,false],
    ["rent","1-комн. квартира на окраине",22000,38000,false],["rent","2-комн. квартира в центре",48000,85000,false],
    ["food","Обед в кафе",300,700,false],["food","Ужин на двоих в ресторане",1800,3800,false],
    ["food","Капучино",200,400,false],["food","Продукты на месяц на 1 человека",15000,23000,false],
    ["transport","Месячный проездной",700,1300,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",90,120,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1300,2100,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1900,3700,true],["cafe","Коктейль в баре",550,1100,true],
    ["health","Визит к частному врачу",2200,4800,true],["health","Абонемент в фитнес-клуб (мес)",2700,5500,true],
    ["entertainment","Билет в кино",350,650,true],["entertainment","Бокал вина или коктейль в баре",700,1300,true],
  ],
  krabi: [
    ["rent","Комната",15000,26000,false],["rent","1-комн. квартира в центре",32000,58000,false],
    ["rent","1-комн. квартира на окраине",22000,40000,false],["rent","2-комн. квартира в центре",50000,90000,false],
    ["food","Обед в кафе",350,800,false],["food","Ужин на двоих в ресторане",2000,4200,false],
    ["food","Капучино",200,380,false],["food","Продукты на месяц на 1 человека",16000,25000,false],
    ["transport","Месячный проездной",1500,2500,false],["transport","Такси 3 км",400,800,false],
    ["transport","Бензин (1 л)",90,115,false],["utilities","ЖКХ за 1-комн. квартиру",4000,8000,false],
    ["utilities","Домашний интернет",1300,2000,false],["utilities","Мобильная связь (месяц)",700,1300,false],
    ["cafe","Стейк в ресторане среднего класса",2300,4400,true],["cafe","Коктейль в баре",650,1200,true],
    ["health","Визит к частному врачу",3000,6000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",450,750,true],["entertainment","Бокал вина или коктейль в баре",550,1000,true],
  ],
};

function seoFor(c) {
  const prepMap = {
    muscat: "в Маскате", manama: "в Манаме", "phnom-penh": "в Пномпене", sanya: "в Санье",
    seoul: "в Сеуле", sharjah: "в Шардже", madrid: "в Мадриде", jakarta: "в Джакарте",
    "phu-quoc": "на Фукуоке", krabi: "в Краби",
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

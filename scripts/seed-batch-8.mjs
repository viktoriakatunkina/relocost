// Seed восьмой партии: Тирана, Кишинев, Душанбе, Коломбо, Ханой,
// Ларнака, Ираклион, Аликанте, Фетхие, Тиват.
// Запуск: node scripts/seed-batch-8.mjs
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
    name_ru: "Тирана", name_en: "Tirana", slug: "tirana",
    country_ru: "Албания", country_en: "Albania", country_slug: "albania", flag_emoji: "🇦🇱",
    population: "600 тыс", climate: "+16°C ср.", language: "Албанский, английский, итальянский", currency: "Лек, ALL",
    flight_from_moscow: "5 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Столица Албании у подножия гор: для россиян действует безвизовый въезд в туристический сезон, цены одни из самых низких в Европе, рядом адриатическое и ионическое побережье. Минусы — хаотичный трафик и пока скромная инфраструктура для экспатов.",
    lat: 41.3275, lng: 19.8187, unsplash_query: "tirana albania city",
  },
  {
    name_ru: "Кишинев", name_en: "Chisinau", slug: "chisinau",
    country_ru: "Молдова", country_en: "Moldova", country_slug: "moldova", flag_emoji: "🇲🇩",
    population: "530 тыс", climate: "+10°C ср.", language: "Румынский, русский", currency: "Лей, MDL",
    flight_from_moscow: "2.5 часа", is_foreign: true, difficulty_score: 1, is_popular: false,
    intro_text: "Столица Молдовы с безвизом на 90 дней, широко распространенным русским языком и низкими ценами. Тихий зеленый город, рядом винодельни; минусы — небольшой рынок труда и ограниченная международная инфраструктура.",
    lat: 47.0105, lng: 28.8638, unsplash_query: "chisinau moldova city",
  },
  {
    name_ru: "Душанбе", name_en: "Dushanbe", slug: "dushanbe",
    country_ru: "Таджикистан", country_en: "Tajikistan", country_slug: "tajikistan", flag_emoji: "🇹🇯",
    population: "1 млн", climate: "+15°C ср.", language: "Таджикский, русский", currency: "Сомони, TJS",
    flight_from_moscow: "4.5 часа", is_foreign: true, difficulty_score: 1, is_popular: false,
    intro_text: "Столица Таджикистана в горной долине: безвиз для россиян, русский язык в быту и очень низкие цены. Теплый климат и доброжелательность, но провинциальная инфраструктура и ограниченный выбор сервисов.",
    lat: 38.5598, lng: 68.7870, unsplash_query: "dushanbe tajikistan city",
  },
  {
    name_ru: "Коломбо", name_en: "Colombo", slug: "colombo",
    country_ru: "Шри-Ланка", country_en: "Sri Lanka", country_slug: "sri-lanka", flag_emoji: "🇱🇰",
    population: "650 тыс", climate: "+28°C ср.", language: "Сингальский, тамильский, английский", currency: "Рупия, LKR",
    flight_from_moscow: "9 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Крупнейший город Шри-Ланки на берегу океана: электронная виза ETA на 30 дней, английский в обиходе и очень доступные цены. Тропики круглый год и чайные плантации рядом, но шумный трафик и сезон муссонов.",
    lat: 6.9271, lng: 79.8612, unsplash_query: "colombo sri lanka city",
  },
  {
    name_ru: "Ханой", name_en: "Hanoi", slug: "hanoi",
    country_ru: "Вьетнам", country_en: "Vietnam", country_slug: "vietnam", flag_emoji: "🇻🇳",
    population: "8 млн", climate: "+24°C ср.", language: "Вьетнамский, английский", currency: "Донг, VND",
    flight_from_moscow: "10 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Столица Вьетнама с тысячелетней историей: безвиз на 45 дней, очень низкие цены и насыщенная уличная жизнь. Прохладнее юга зимой; минусы — плотный трафик, шум и качество воздуха.",
    lat: 21.0278, lng: 105.8342, unsplash_query: "hanoi vietnam old quarter",
  },
  {
    name_ru: "Ларнака", name_en: "Larnaca", slug: "larnaca",
    country_ru: "Кипр", country_en: "Cyprus", country_slug: "cyprus", flag_emoji: "🇨🇾",
    population: "85 тыс", climate: "+20°C ср.", language: "Греческий, английский, русский", currency: "Евро, EUR",
    flight_from_moscow: "4.5 часа с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Прибрежный город Кипра с международным аэропортом: теплое море, английский и русский в обиходе, дешевле Лимассола. Для россиян нужна виза; летом жарко и многолюдно у пляжей.",
    lat: 34.9182, lng: 33.6201, unsplash_query: "larnaca cyprus beach",
  },
  {
    name_ru: "Ираклион", name_en: "Heraklion", slug: "heraklion",
    country_ru: "Греция", country_en: "Greece", country_slug: "greece", flag_emoji: "🇬🇷",
    population: "180 тыс", climate: "+19°C ср.", language: "Греческий, английский", currency: "Евро, EUR",
    flight_from_moscow: "4.5 часа с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Столица Крита на берегу моря: мягкий средиземноморский климат, дворец Кносс и долгий пляжный сезон. Для россиян нужна шенгенская виза, а зимой остров заметно пустеет.",
    lat: 35.3387, lng: 25.1442, unsplash_query: "heraklion crete greece",
  },
  {
    name_ru: "Аликанте", name_en: "Alicante", slug: "alicante",
    country_ru: "Испания", country_en: "Spain", country_slug: "spain", flag_emoji: "🇪🇸",
    population: "340 тыс", climate: "+19°C ср.", language: "Испанский, английский", currency: "Евро, EUR",
    flight_from_moscow: "5 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Город на Коста-Бланке с пляжами и набережной: мягкий климат, большое русскоязычное комьюнити и развитая инфраструктура. Для россиян нужна виза (подойдет номад-виза или D7), летом многолюдно.",
    lat: 38.3452, lng: -0.4810, unsplash_query: "alicante spain beach",
  },
  {
    name_ru: "Фетхие", name_en: "Fethiye", slug: "fethiye",
    country_ru: "Турция", country_en: "Turkey", country_slug: "turkey", flag_emoji: "🇹🇷",
    population: "165 тыс", climate: "+19°C ср.", language: "Турецкий, английский, русский", currency: "Лира, TRY",
    flight_from_moscow: "4.5 часа с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Курорт на бирюзовом побережье Турции: безвиз, мягкий средиземноморский климат, знаменитый Олюдениз и яхтенные бухты. Дешевле Бодрума и спокойнее; зимой курортная жизнь затихает.",
    lat: 36.6213, lng: 29.1164, unsplash_query: "fethiye turkey oludeniz",
  },
  {
    name_ru: "Тиват", name_en: "Tivat", slug: "tivat",
    country_ru: "Черногория", country_en: "Montenegro", country_slug: "montenegro", flag_emoji: "🇲🇪",
    population: "15 тыс", climate: "+16°C ср.", language: "Черногорский, сербский, русский", currency: "Евро, EUR",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 2, is_popular: false,
    intro_text: "Город в Которском заливе с мариной Porto Montenegro: яхты, горы у моря и спокойный премиальный курорт. Для россиян безвиз на 30 дней; жизнь сезонная и дороже соседней Будвы.",
    lat: 42.4347, lng: 18.6963, unsplash_query: "tivat montenegro porto",
  },
];

const PRICES = {
  tirana: [
    ["rent","Комната",18000,30000,false],["rent","1-комн. квартира в центре",35000,55000,false],
    ["rent","1-комн. квартира на окраине",22000,38000,false],["rent","2-комн. квартира в центре",50000,80000,false],
    ["food","Обед в кафе",500,1000,false],["food","Ужин на двоих в ресторане",2000,4000,false],
    ["food","Капучино",200,350,false],["food","Продукты на месяц на 1 человека",16000,25000,false],
    ["transport","Месячный проездной",1000,1800,false],["transport","Такси 3 км",300,600,false],
    ["transport","Бензин (1 л)",130,160,false],["utilities","ЖКХ за 1-комн. квартиру",4000,8000,false],
    ["utilities","Домашний интернет",1000,1800,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],["cafe","Коктейль в баре",600,1100,true],
    ["health","Визит к частному врачу",2500,5000,true],["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",400,700,true],["entertainment","Бокал вина или коктейль в баре",500,1000,true],
  ],
  chisinau: [
    ["rent","Комната",12000,22000,false],["rent","1-комн. квартира в центре",25000,40000,false],
    ["rent","1-комн. квартира на окраине",16000,28000,false],["rent","2-комн. квартира в центре",35000,60000,false],
    ["food","Обед в кафе",350,700,false],["food","Ужин на двоих в ресторане",1500,3000,false],
    ["food","Капучино",150,300,false],["food","Продукты на месяц на 1 человека",13000,20000,false],
    ["transport","Месячный проездной",500,900,false],["transport","Такси 3 км",200,400,false],
    ["transport","Бензин (1 л)",110,140,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",600,1200,false],["utilities","Мобильная связь (месяц)",300,700,false],
    ["cafe","Стейк в ресторане среднего класса",1400,2800,true],["cafe","Коктейль в баре",400,800,true],
    ["health","Визит к частному врачу",1500,3500,true],["health","Абонемент в фитнес-клуб (мес)",1800,4000,true],
    ["entertainment","Билет в кино",300,550,true],["entertainment","Бокал вина или коктейль в баре",400,800,true],
  ],
  dushanbe: [
    ["rent","Комната",8000,16000,false],["rent","1-комн. квартира в центре",22000,38000,false],
    ["rent","1-комн. квартира на окраине",14000,24000,false],["rent","2-комн. квартира в центре",35000,55000,false],
    ["food","Обед в кафе",250,600,false],["food","Ужин на двоих в ресторане",1500,3000,false],
    ["food","Капучино",150,300,false],["food","Продукты на месяц на 1 человека",11000,17000,false],
    ["transport","Месячный проездной",400,800,false],["transport","Такси 3 км",200,400,false],
    ["transport","Бензин (1 л)",80,110,false],["utilities","ЖКХ за 1-комн. квартиру",2000,4500,false],
    ["utilities","Домашний интернет",800,1500,false],["utilities","Мобильная связь (месяц)",350,700,false],
    ["cafe","Стейк в ресторане среднего класса",1300,2600,true],["cafe","Коктейль в баре",400,800,true],
    ["health","Визит к частному врачу",1200,2800,true],["health","Абонемент в фитнес-клуб (мес)",1800,3800,true],
    ["entertainment","Билет в кино",250,500,true],["entertainment","Бокал вина или коктейль в баре",400,800,true],
  ],
  colombo: [
    ["rent","Комната",14000,26000,false],["rent","1-комн. квартира в центре",30000,55000,false],
    ["rent","1-комн. квартира на окраине",20000,35000,false],["rent","2-комн. квартира в центре",45000,80000,false],
    ["food","Обед в кафе",300,700,false],["food","Ужин на двоих в ресторане",1800,3800,false],
    ["food","Капучино",200,380,false],["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной",800,1500,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",90,120,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1200,2000,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",2000,4500,true],["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",350,650,true],["entertainment","Бокал вина или коктейль в баре",600,1200,true],
  ],
  hanoi: [
    ["rent","Комната",14000,26000,false],["rent","1-комн. квартира в центре",30000,55000,false],
    ["rent","1-комн. квартира на окраине",20000,35000,false],["rent","2-комн. квартира в центре",45000,80000,false],
    ["food","Обед в кафе",250,600,false],["food","Ужин на двоих в ресторане",1600,3500,false],
    ["food","Капучино",200,380,false],["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной",600,1200,false],["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",90,120,false],["utilities","ЖКХ за 1-комн. квартиру",3000,7000,false],
    ["utilities","Домашний интернет",1200,2000,false],["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",2000,4500,true],["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",350,650,true],["entertainment","Бокал вина или коктейль в баре",600,1200,true],
  ],
  larnaca: [
    ["rent","Комната",30000,50000,false],["rent","1-комн. квартира в центре",60000,95000,false],
    ["rent","1-комн. квартира на окраине",40000,65000,false],["rent","2-комн. квартира в центре",80000,130000,false],
    ["food","Обед в кафе",900,1800,false],["food","Ужин на двоих в ресторане",4000,7500,false],
    ["food","Капучино",350,550,false],["food","Продукты на месяц на 1 человека",20000,30000,false],
    ["transport","Месячный проездной",1500,2500,false],["transport","Такси 3 км",700,1200,false],
    ["transport","Бензин (1 л)",130,160,false],["utilities","ЖКХ за 1-комн. квартиру",6000,12000,false],
    ["utilities","Домашний интернет",2000,3000,false],["utilities","Мобильная связь (месяц)",1200,2200,false],
    ["cafe","Стейк в ресторане среднего класса",3000,5500,true],["cafe","Коктейль в баре",900,1700,true],
    ["health","Визит к частному врачу",4000,8000,true],["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",700,1100,true],["entertainment","Бокал вина или коктейль в баре",800,1500,true],
  ],
  heraklion: [
    ["rent","Комната",25000,45000,false],["rent","1-комн. квартира в центре",50000,85000,false],
    ["rent","1-комн. квартира на окраине",35000,60000,false],["rent","2-комн. квартира в центре",70000,115000,false],
    ["food","Обед в кафе",800,1600,false],["food","Ужин на двоих в ресторане",3500,7000,false],
    ["food","Капучино",350,550,false],["food","Продукты на месяц на 1 человека",19000,29000,false],
    ["transport","Месячный проездной",1200,2000,false],["transport","Такси 3 км",600,1100,false],
    ["transport","Бензин (1 л)",150,180,false],["utilities","ЖКХ за 1-комн. квартиру",5000,11000,false],
    ["utilities","Домашний интернет",1800,2800,false],["utilities","Мобильная связь (месяц)",1000,2000,false],
    ["cafe","Стейк в ресторане среднего класса",2800,5200,true],["cafe","Коктейль в баре",800,1500,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",600,1000,true],["entertainment","Бокал вина или коктейль в баре",700,1400,true],
  ],
  alicante: [
    ["rent","Комната",28000,48000,false],["rent","1-комн. квартира в центре",55000,90000,false],
    ["rent","1-комн. квартира на окраине",38000,62000,false],["rent","2-комн. квартира в центре",75000,120000,false],
    ["food","Обед в кафе",900,1700,false],["food","Ужин на двоих в ресторане",3800,7000,false],
    ["food","Капучино",300,500,false],["food","Продукты на месяц на 1 человека",19000,29000,false],
    ["transport","Месячный проездной",1300,2200,false],["transport","Такси 3 км",600,1100,false],
    ["transport","Бензин (1 л)",150,180,false],["utilities","ЖКХ за 1-комн. квартиру",6000,12000,false],
    ["utilities","Домашний интернет",1800,2800,false],["utilities","Мобильная связь (месяц)",1000,1900,false],
    ["cafe","Стейк в ресторане среднего класса",2800,5200,true],["cafe","Коктейль в баре",800,1500,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",700,1100,true],["entertainment","Бокал вина или коктейль в баре",700,1300,true],
  ],
  fethiye: [
    ["rent","Комната",18000,32000,false],["rent","1-комн. квартира в центре",38000,65000,false],
    ["rent","1-комн. квартира на окраине",26000,45000,false],["rent","2-комн. квартира в центре",55000,95000,false],
    ["food","Обед в кафе",550,1200,false],["food","Ужин на двоих в ресторане",2500,5000,false],
    ["food","Капучино",250,450,false],["food","Продукты на месяц на 1 человека",17000,27000,false],
    ["transport","Месячный проездной",700,1300,false],["transport","Такси 3 км",350,700,false],
    ["transport","Бензин (1 л)",90,120,false],["utilities","ЖКХ за 1-комн. квартиру",4000,8000,false],
    ["utilities","Домашний интернет",900,1600,false],["utilities","Мобильная связь (месяц)",600,1200,false],
    ["cafe","Стейк в ресторане среднего класса",2300,4500,true],["cafe","Коктейль в баре",700,1400,true],
    ["health","Визит к частному врачу",2800,5500,true],["health","Абонемент в фитнес-клуб (мес)",2800,5500,true],
    ["entertainment","Билет в кино",400,700,true],["entertainment","Бокал вина или коктейль в баре",650,1300,true],
  ],
  tivat: [
    ["rent","Комната",25000,42000,false],["rent","1-комн. квартира в центре",50000,85000,false],
    ["rent","1-комн. квартира на окраине",35000,58000,false],["rent","2-комн. квартира в центре",70000,115000,false],
    ["food","Обед в кафе",800,1600,false],["food","Ужин на двоих в ресторане",3500,6500,false],
    ["food","Капучино",300,500,false],["food","Продукты на месяц на 1 человека",19000,29000,false],
    ["transport","Месячный проездной",1000,1800,false],["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",130,160,false],["utilities","ЖКХ за 1-комн. квартиру",5000,10000,false],
    ["utilities","Домашний интернет",1500,2500,false],["utilities","Мобильная связь (месяц)",1000,1900,false],
    ["cafe","Стейк в ресторане среднего класса",2800,5200,true],["cafe","Коктейль в баре",800,1500,true],
    ["health","Визит к частному врачу",3500,7000,true],["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",600,1000,true],["entertainment","Бокал вина или коктейль в баре",600,1200,true],
  ],
};

function seoFor(c) {
  const prepMap = {
    tirana: "в Тиране", chisinau: "в Кишиневе", dushanbe: "в Душанбе", colombo: "в Коломбо",
    hanoi: "в Ханое", larnaca: "в Ларнаке", heraklion: "в Ираклионе", alicante: "в Аликанте",
    fethiye: "в Фетхие", tivat: "в Тивате",
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

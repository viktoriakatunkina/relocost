// Seed четвертой партии городов (5 зарубежных направлений).
// Запуск: node scripts/seed-batch-4.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SB_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const CITIES = [
  {
    name_ru: "Тель-Авив", name_en: "Tel Aviv", slug: "tel-aviv",
    country_ru: "Израиль", country_en: "Israel", country_slug: "israel", flag_emoji: "🇮🇱",
    population: "470 тыс", climate: "+20°C ср.", language: "Иврит, английский, русский", currency: "Шекель, ILS",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 3, is_popular: true,
    seo_title: "Стоимость жизни в Тель-Авиве в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Тель-Авиве? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Деловая столица Израиля с самой развитой IT-индустрией Ближнего Востока и большим русскоязычным сообществом. Для евреев — путь через репатриацию, для остальных — через рабочую визу и стартапы.",
    lat: 32.0853, lng: 34.7818,
  },
  {
    name_ru: "Барселона", name_en: "Barcelona", slug: "barcelona",
    country_ru: "Испания", country_en: "Spain", country_slug: "spain", flag_emoji: "🇪🇸",
    population: "1.6 млн", climate: "+17°C ср.", language: "Испанский, каталанский, английский", currency: "Евро, EUR",
    flight_from_moscow: "5 часов", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Барселоне в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Барселоне? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Космополитичная столица Каталонии с морем, IT-сценой и развитой инфраструктурой для номадов. Дороже Валенсии, но дает больше возможностей по работе и культурной жизни.",
    lat: 41.3851, lng: 2.1734,
  },
  {
    name_ru: "Хошимин", name_en: "Ho Chi Minh City", slug: "ho-chi-minh",
    country_ru: "Вьетнам", country_en: "Vietnam", country_slug: "vietnam", flag_emoji: "🇻🇳",
    population: "9 млн", climate: "+28°C ср.", language: "Вьетнамский, английский", currency: "Донг, VND",
    flight_from_moscow: "11 часов", is_foreign: true, difficulty_score: 3, is_popular: true,
    seo_title: "Стоимость жизни в Хошимине в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Хошимине? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Экономический центр Вьетнама и крупнейший мегаполис страны: международные офисы, активная стартап-сцена и доступный уровень жизни. Подходит для тех, кто хочет работать в Азии без курортного формата.",
    lat: 10.7769, lng: 106.7009,
  },
  {
    name_ru: "Прага", name_en: "Prague", slug: "prague",
    country_ru: "Чехия", country_en: "Czech Republic", country_slug: "czech-republic", flag_emoji: "🇨🇿",
    population: "1.3 млн", climate: "+10°C ср.", language: "Чешский, английский, русский", currency: "Крона, CZK",
    flight_from_moscow: "3 часа", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Праге в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Праге? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Образовательная и IT-столица Центральной Европы с большой постсоветской диаспорой. С 2022 виза для россиян ограничена, но через работу или образование путь сохраняется.",
    lat: 50.0755, lng: 14.4378,
  },
  {
    name_ru: "Гоа", name_en: "Goa", slug: "goa",
    country_ru: "Индия", country_en: "India", country_slug: "india", flag_emoji: "🇮🇳",
    population: "1.5 млн", climate: "+27°C ср.", language: "Конкани, хинди, английский", currency: "Рупия, INR",
    flight_from_moscow: "9 часов", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни на Гоа в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить на Гоа? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Главная индийская точка зимовки для русскоязычных номадов: длинные пляжи, дешевое жилье и развитая инфраструктура для удаленной работы. Простая электронная виза и круглогодичный купальный сезон.",
    lat: 15.2993, lng: 74.1240,
  },
];

const PRICES = {
  "tel-aviv": [
    ["rent","Комната",50000,80000,false],
    ["rent","1-комн. квартира в центре",120000,180000,false],
    ["rent","1-комн. квартира на окраине",85000,130000,false],
    ["rent","2-комн. квартира в центре",170000,260000,false],
    ["food","Обед в кафе",1500,2800,false],
    ["food","Ужин на двоих в ресторане",8000,14000,false],
    ["food","Капучино",400,650,false],
    ["food","Продукты на месяц на 1 человека",45000,65000,false],
    ["transport","Месячный проездной",5000,6500,false],
    ["transport","Такси 3 км",900,1500,false],
    ["transport","Бензин (1 л)",180,210,false],
    ["utilities","ЖКХ за 1-комн. квартиру",12000,20000,false],
    ["utilities","Домашний интернет",2800,4500,false],
    ["utilities","Мобильная связь (месяц)",1800,3000,false],
    ["cafe","Стейк в ресторане среднего класса",6500,11000,true],
    ["cafe","Коктейль в баре",1300,2200,true],
    ["health","Визит к частному врачу",8000,14000,true],
    ["health","Абонемент в фитнес-клуб (мес)",8500,15000,true],
    ["entertainment","Билет в кино",1100,1500,true],
    ["entertainment","Бокал вина или коктейль в баре",1200,1900,true],
  ],
  barcelona: [
    ["rent","Комната",35000,55000,false],
    ["rent","1-комн. квартира в центре",95000,160000,false],
    ["rent","1-комн. квартира на окраине",65000,100000,false],
    ["rent","2-комн. квартира в центре",130000,220000,false],
    ["food","Обед в кафе",1200,2200,false],
    ["food","Ужин на двоих в ресторане",6500,11000,false],
    ["food","Капучино",220,400,false],
    ["food","Продукты на месяц на 1 человека",32000,45000,false],
    ["transport","Месячный проездной",4500,5500,false],
    ["transport","Такси 3 км",700,1100,false],
    ["transport","Бензин (1 л)",150,180,false],
    ["utilities","ЖКХ за 1-комн. квартиру",10000,16000,false],
    ["utilities","Домашний интернет",2200,3200,false],
    ["utilities","Мобильная связь (месяц)",1400,2200,false],
    ["cafe","Стейк в ресторане среднего класса",4500,7000,true],
    ["cafe","Коктейль в баре",1000,1700,true],
    ["health","Визит к частному врачу",6500,10000,true],
    ["health","Абонемент в фитнес-клуб (мес)",5000,8500,true],
    ["entertainment","Билет в кино",800,1200,true],
    ["entertainment","Бокал вина или коктейль в баре",700,1300,true],
  ],
  "ho-chi-minh": [
    ["rent","Комната",12000,20000,false],
    ["rent","1-комн. квартира в центре",30000,55000,false],
    ["rent","1-комн. квартира на окраине",18000,32000,false],
    ["rent","2-комн. квартира в центре",50000,85000,false],
    ["food","Обед в кафе",350,800,false],
    ["food","Ужин на двоих в ресторане",2200,4500,false],
    ["food","Капучино",250,400,false],
    ["food","Продукты на месяц на 1 человека",16000,25000,false],
    ["transport","Месячный проездной",1800,2500,false],
    ["transport","Такси 3 км",300,600,false],
    ["transport","Бензин (1 л)",90,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4000,7500,false],
    ["utilities","Домашний интернет",1100,1900,false],
    ["utilities","Мобильная связь (месяц)",600,1200,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4500,true],
    ["cafe","Коктейль в баре",600,1300,true],
    ["health","Визит к частному врачу",3000,5500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  prague: [
    ["rent","Комната",28000,45000,false],
    ["rent","1-комн. квартира в центре",70000,110000,false],
    ["rent","1-комн. квартира на окраине",48000,75000,false],
    ["rent","2-комн. квартира в центре",95000,150000,false],
    ["food","Обед в кафе",900,1700,false],
    ["food","Ужин на двоих в ресторане",4500,8000,false],
    ["food","Капучино",250,400,false],
    ["food","Продукты на месяц на 1 человека",28000,40000,false],
    ["transport","Месячный проездной",1800,2300,false],
    ["transport","Такси 3 км",550,950,false],
    ["transport","Бензин (1 л)",150,180,false],
    ["utilities","ЖКХ за 1-комн. квартиру",8500,14000,false],
    ["utilities","Домашний интернет",1800,2800,false],
    ["utilities","Мобильная связь (месяц)",1200,2000,false],
    ["cafe","Стейк в ресторане среднего класса",3500,5500,true],
    ["cafe","Коктейль в баре",750,1400,true],
    ["health","Визит к частному врачу",5000,8500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",700,1000,true],
    ["entertainment","Бокал вина или коктейль в баре",500,1000,true],
  ],
  goa: [
    ["rent","Комната",9000,15000,false],
    ["rent","1-комн. квартира в центре",22000,40000,false],
    ["rent","1-комн. квартира на окраине",14000,25000,false],
    ["rent","2-комн. квартира в центре",35000,60000,false],
    ["food","Обед в кафе",300,700,false],
    ["food","Ужин на двоих в ресторане",1800,4000,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",13000,20000,false],
    ["transport","Месячный проездной",1200,2000,false],
    ["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",95,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3000,5500,false],
    ["utilities","Домашний интернет",900,1500,false],
    ["utilities","Мобильная связь (месяц)",400,900,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],
    ["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",2000,4500,true],
    ["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",350,700,true],
    ["entertainment","Бокал вина или коктейль в баре",500,1000,true],
  ],
};

for (const c of CITIES) {
  const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
  if (existing) { console.log(`skip (exists): ${c.slug}`); continue; }
  const row = {
    name_ru: c.name_ru, name_en: c.name_en, slug: c.slug,
    country_ru: c.country_ru, country_en: c.country_en, country_slug: c.country_slug,
    flag_emoji: c.flag_emoji, population: c.population, climate: c.climate,
    language: c.language, currency: c.currency, flight_from_moscow: c.flight_from_moscow,
    is_foreign: c.is_foreign, difficulty_score: c.difficulty_score, is_popular: c.is_popular,
    seo_title: c.seo_title, seo_description: c.seo_description, intro_text: c.intro_text,
    lat: c.lat, lng: c.lng,
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
  console.log(`+ ${c.slug}: city + ${prices.length} prices`);
}
console.log("done.");

// Seed второй партии городов (10 зарубежных направлений).
// Запуск: node scripts/seed-batch-2.mjs
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
    name_ru: "Бишкек", name_en: "Bishkek", slug: "bishkek",
    country_ru: "Кыргызстан", country_en: "Kyrgyzstan", country_slug: "kyrgyzstan", flag_emoji: "🇰🇬",
    population: "1.05 млн", climate: "+11°C ср.", language: "Киргизский, русский", currency: "Сом, KGS",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 1, is_popular: true,
    seo_title: "Стоимость жизни в Бишкеке в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Бишкеке? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Безвизовый въезд на 30 дней с возможностью продления, цены ниже грузинских, русский язык всюду в быту. Подходит для тех, кому важна минимальная бюрократия и быстрый старт.",
    lat: 42.8746, lng: 74.5698, unsplash_query: "bishkek kyrgyzstan",
  },
  {
    name_ru: "Ташкент", name_en: "Tashkent", slug: "tashkent",
    country_ru: "Узбекистан", country_en: "Uzbekistan", country_slug: "uzbekistan", flag_emoji: "🇺🇿",
    population: "2.7 млн", climate: "+15°C ср.", language: "Узбекский, русский", currency: "Сум, UZS",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 1, is_popular: true,
    seo_title: "Стоимость жизни в Ташкенте в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Ташкенте? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Безвизовый въезд для россиян на 60 дней, низкие цены на жилье и еду, развитая русскоязычная среда и быстро растущая IT-сцена. Хороший выбор для семейного переезда.",
    lat: 41.2995, lng: 69.2401, unsplash_query: "tashkent uzbekistan",
  },
  {
    name_ru: "Минск", name_en: "Minsk", slug: "minsk",
    country_ru: "Беларусь", country_en: "Belarus", country_slug: "belarus", flag_emoji: "🇧🇾",
    population: "2 млн", climate: "+7°C ср.", language: "Белорусский, русский", currency: "Белорусский рубль, BYN",
    flight_from_moscow: "1.5 часа", is_foreign: true, difficulty_score: 1, is_popular: true,
    seo_title: "Стоимость жизни в Минске в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Минске? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Безвизовый режим, единое экономическое пространство с Россией, русский — государственный язык. Чистый, безопасный город с хорошей инфраструктурой и доступным жильем.",
    lat: 53.9006, lng: 27.5590, unsplash_query: "minsk belarus",
  },
  {
    name_ru: "Подгорица", name_en: "Podgorica", slug: "podgorica",
    country_ru: "Черногория", country_en: "Montenegro", country_slug: "montenegro", flag_emoji: "🇲🇪",
    population: "190 тыс", climate: "+15°C ср.", language: "Черногорский, сербский", currency: "Евро, EUR",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Подгорице в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Подгорице? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Безвизовый въезд на 30 дней с возможностью продления, доступный путь к ВНЖ через бизнес или недвижимость. Тихая столица для тех, кто хочет жить в ЕС-перспективной стране.",
    lat: 42.4304, lng: 19.2594, unsplash_query: "podgorica montenegro",
  },
  {
    name_ru: "Батуми", name_en: "Batumi", slug: "batumi",
    country_ru: "Грузия", country_en: "Georgia", country_slug: "georgia", flag_emoji: "🇬🇪",
    population: "170 тыс", climate: "+15°C ср.", language: "Грузинский, русский", currency: "Лари, GEL",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 1, is_popular: true,
    seo_title: "Стоимость жизни в Батуми в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Батуми? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Черноморский курорт с безвизом на 365 дней, низкими ценами и большим русскоязычным комьюнити фрилансеров. Подходит для удаленной работы у моря с теплой зимой.",
    lat: 41.6168, lng: 41.6367, unsplash_query: "batumi black sea georgia",
  },
  {
    name_ru: "Анталья", name_en: "Antalya", slug: "antalya",
    country_ru: "Турция", country_en: "Turkey", country_slug: "turkey", flag_emoji: "🇹🇷",
    population: "1.4 млн", climate: "+19°C ср.", language: "Турецкий, русский, английский", currency: "Турецкая лира, TRY",
    flight_from_moscow: "3.5 часа", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Анталье в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Анталье? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Безвизовый въезд на 90 дней, теплая зима, развитая русскоязычная инфраструктура и доступная медицина. Любимый город семей с детьми и тех, кто переезжает к морю.",
    lat: 36.8969, lng: 30.7133, unsplash_query: "antalya turkey",
  },
  {
    name_ru: "Пхукет", name_en: "Phuket", slug: "phuket",
    country_ru: "Таиланд", country_en: "Thailand", country_slug: "thailand", flag_emoji: "🇹🇭",
    population: "420 тыс", climate: "+28°C ср.", language: "Тайский, английский", currency: "Бат, THB",
    flight_from_moscow: "11 часов", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни на Пхукете в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить на Пхукете? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Тропический остров с большим русскоязычным комьюнити фрилансеров, безвизовый въезд на 60 дней. Океан, теплый климат круглый год, развитая инфраструктура для удаленной работы.",
    lat: 7.8804, lng: 98.3923, unsplash_query: "phuket thailand beach",
  },
  {
    name_ru: "Чиангмай", name_en: "Chiang Mai", slug: "chiang-mai",
    country_ru: "Таиланд", country_en: "Thailand", country_slug: "thailand", flag_emoji: "🇹🇭",
    population: "200 тыс", climate: "+25°C ср.", language: "Тайский, английский", currency: "Бат, THB",
    flight_from_moscow: "13 часов", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Чиангмае в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Чиангмае? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Мировая столица диджитал-номадов: низкие цены, мягкий горный климат, десятки коворкингов и активное международное сообщество. Идеален для тех, кто работает удаленно и ценит спокойствие.",
    lat: 18.7883, lng: 98.9853, unsplash_query: "chiang mai thailand",
  },
  {
    name_ru: "Кутаиси", name_en: "Kutaisi", slug: "kutaisi",
    country_ru: "Грузия", country_en: "Georgia", country_slug: "georgia", flag_emoji: "🇬🇪",
    population: "150 тыс", climate: "+13°C ср.", language: "Грузинский, русский", currency: "Лари, GEL",
    flight_from_moscow: "5 часов", is_foreign: true, difficulty_score: 1, is_popular: true,
    seo_title: "Стоимость жизни в Кутаиси в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Кутаиси? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Тихая альтернатива Тбилиси: те же 365 дней безвиза, цены еще ниже, рядом горы и каньоны. Хаб лоукостеров Wizz Air делает город удобной базой для путешествий по Европе.",
    lat: 42.2679, lng: 42.6946, unsplash_query: "kutaisi georgia",
  },
  {
    name_ru: "Будва", name_en: "Budva", slug: "budva",
    country_ru: "Черногория", country_en: "Montenegro", country_slug: "montenegro", flag_emoji: "🇲🇪",
    population: "19 тыс", climate: "+17°C ср.", language: "Черногорский, сербский", currency: "Евро, EUR",
    flight_from_moscow: "5 часов", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Будве в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Будве? Аренда, еда, транспорт — считаем реальный бюджет. Калькулятор, цены, отзывы переехавших.",
    intro_text: "Курортный город на Адриатике с безвизом на 30 дней и большим русскоязычным сообществом релокантов. Подходит для жизни у моря с понятным переходом к ВНЖ через недвижимость.",
    lat: 42.2864, lng: 18.8400, unsplash_query: "budva montenegro sea",
  },
];

const PRICES = {
  bishkek: [
    ["rent","Комната",10000,18000,false],
    ["rent","1-комн. квартира в центре",30000,50000,false],
    ["rent","1-комн. квартира на окраине",18000,30000,false],
    ["rent","2-комн. квартира в центре",45000,70000,false],
    ["food","Обед в кафе",400,800,false],
    ["food","Ужин на двоих в ресторане",2000,4000,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной",800,1200,false],
    ["transport","Такси 3 км",200,400,false],
    ["transport","Бензин (1 л)",60,80,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3000,5000,false],
    ["utilities","Домашний интернет",800,1500,false],
    ["utilities","Мобильная связь (месяц)",400,800,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3000,true],
    ["cafe","Коктейль в баре",500,900,true],
    ["health","Визит к частному врачу",1500,3000,true],
    ["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",300,600,true],
    ["entertainment","Бокал вина или коктейль в баре",400,700,true],
  ],
  tashkent: [
    ["rent","Комната",12000,20000,false],
    ["rent","1-комн. квартира в центре",35000,60000,false],
    ["rent","1-комн. квартира на окраине",20000,35000,false],
    ["rent","2-комн. квартира в центре",55000,85000,false],
    ["food","Обед в кафе",400,800,false],
    ["food","Ужин на двоих в ресторане",2500,4500,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной",700,1100,false],
    ["transport","Такси 3 км",250,450,false],
    ["transport","Бензин (1 л)",75,95,false],
    ["utilities","ЖКХ за 1-комн. квартиру",2500,4500,false],
    ["utilities","Домашний интернет",900,1600,false],
    ["utilities","Мобильная связь (месяц)",400,800,false],
    ["cafe","Стейк в ресторане среднего класса",2000,3500,true],
    ["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",1500,3500,true],
    ["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",300,600,true],
    ["entertainment","Бокал вина или коктейль в баре",400,800,true],
  ],
  minsk: [
    ["rent","Комната",15000,25000,false],
    ["rent","1-комн. квартира в центре",40000,65000,false],
    ["rent","1-комн. квартира на окраине",25000,40000,false],
    ["rent","2-комн. квартира в центре",60000,95000,false],
    ["food","Обед в кафе",500,1000,false],
    ["food","Ужин на двоих в ресторане",3000,5500,false],
    ["food","Капучино",250,400,false],
    ["food","Продукты на месяц на 1 человека",16000,26000,false],
    ["transport","Месячный проездной",1200,1700,false],
    ["transport","Такси 3 км",300,500,false],
    ["transport","Бензин (1 л)",85,110,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3500,6000,false],
    ["utilities","Домашний интернет",1100,1900,false],
    ["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4000,true],
    ["cafe","Коктейль в баре",600,1100,true],
    ["health","Визит к частному врачу",2500,4500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6000,true],
    ["entertainment","Билет в кино",500,800,true],
    ["entertainment","Бокал вина или коктейль в баре",500,900,true],
  ],
  podgorica: [
    ["rent","Комната",20000,32000,false],
    ["rent","1-комн. квартира в центре",45000,70000,false],
    ["rent","1-комн. квартира на окраине",30000,45000,false],
    ["rent","2-комн. квартира в центре",65000,100000,false],
    ["food","Обед в кафе",700,1300,false],
    ["food","Ужин на двоих в ресторане",4000,7000,false],
    ["food","Капучино",180,300,false],
    ["food","Продукты на месяц на 1 человека",22000,32000,false],
    ["transport","Месячный проездной",2500,3500,false],
    ["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",130,160,false],
    ["utilities","ЖКХ за 1-комн. квартиру",6000,10000,false],
    ["utilities","Домашний интернет",1500,2500,false],
    ["utilities","Мобильная связь (месяц)",900,1600,false],
    ["cafe","Стейк в ресторане среднего класса",3000,5000,true],
    ["cafe","Коктейль в баре",700,1200,true],
    ["health","Визит к частному врачу",3500,6000,true],
    ["health","Абонемент в фитнес-клуб (мес)",4000,7000,true],
    ["entertainment","Билет в кино",500,800,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1000,true],
  ],
  batumi: [
    ["rent","Комната",15000,25000,false],
    ["rent","1-комн. квартира в центре",40000,65000,false],
    ["rent","1-комн. квартира на окраине",25000,40000,false],
    ["rent","2-комн. квартира в центре",60000,95000,false],
    ["food","Обед в кафе",600,1100,false],
    ["food","Ужин на двоих в ресторане",3000,5500,false],
    ["food","Капучино",250,400,false],
    ["food","Продукты на месяц на 1 человека",16000,26000,false],
    ["transport","Месячный проездной",1500,2000,false],
    ["transport","Такси 3 км",350,600,false],
    ["transport","Бензин (1 л)",90,110,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4500,7500,false],
    ["utilities","Домашний интернет",1400,2300,false],
    ["utilities","Мобильная связь (месяц)",700,1400,false],
    ["cafe","Стейк в ресторане среднего класса",2300,3800,true],
    ["cafe","Коктейль в баре",600,1000,true],
    ["health","Визит к частному врачу",2500,4500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6000,true],
    ["entertainment","Билет в кино",500,800,true],
    ["entertainment","Бокал вина или коктейль в баре",400,800,true],
  ],
  antalya: [
    ["rent","Комната",18000,30000,false],
    ["rent","1-комн. квартира в центре",55000,90000,false],
    ["rent","1-комн. квартира на окраине",35000,55000,false],
    ["rent","2-комн. квартира в центре",80000,130000,false],
    ["food","Обед в кафе",600,1200,false],
    ["food","Ужин на двоих в ресторане",3500,6500,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Месячный проездной",1200,1800,false],
    ["transport","Такси 3 км",350,650,false],
    ["transport","Бензин (1 л)",120,150,false],
    ["utilities","ЖКХ за 1-комн. квартиру",5500,9000,false],
    ["utilities","Домашний интернет",1500,2500,false],
    ["utilities","Мобильная связь (месяц)",800,1500,false],
    ["cafe","Стейк в ресторане среднего класса",2800,4500,true],
    ["cafe","Коктейль в баре",700,1300,true],
    ["health","Визит к частному врачу",3000,5500,true],
    ["health","Абонемент в фитнес-клуб (мес)",4000,7000,true],
    ["entertainment","Билет в кино",500,800,true],
    ["entertainment","Бокал вина или коктейль в баре",500,900,true],
  ],
  phuket: [
    ["rent","Комната",18000,30000,false],
    ["rent","1-комн. квартира в центре",45000,80000,false],
    ["rent","1-комн. квартира на окраине",30000,50000,false],
    ["rent","2-комн. квартира в центре",70000,120000,false],
    ["food","Обед в кафе",400,900,false],
    ["food","Ужин на двоих в ресторане",2500,5000,false],
    ["food","Капучино",250,400,false],
    ["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Месячный проездной",2000,3000,false],
    ["transport","Такси 3 км",400,800,false],
    ["transport","Бензин (1 л)",90,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4500,8000,false],
    ["utilities","Домашний интернет",1300,2200,false],
    ["utilities","Мобильная связь (месяц)",700,1400,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4500,true],
    ["cafe","Коктейль в баре",700,1300,true],
    ["health","Визит к частному врачу",3500,6500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",500,800,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  "chiang-mai": [
    ["rent","Комната",10000,18000,false],
    ["rent","1-комн. квартира в центре",25000,45000,false],
    ["rent","1-комн. квартира на окраине",15000,28000,false],
    ["rent","2-комн. квартира в центре",40000,65000,false],
    ["food","Обед в кафе",300,700,false],
    ["food","Ужин на двоих в ресторане",2000,4000,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",15000,24000,false],
    ["transport","Месячный проездной",1500,2500,false],
    ["transport","Такси 3 км",300,600,false],
    ["transport","Бензин (1 л)",90,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3500,6500,false],
    ["utilities","Домашний интернет",1100,1900,false],
    ["utilities","Мобильная связь (месяц)",600,1200,false],
    ["cafe","Стейк в ресторане среднего класса",2000,3800,true],
    ["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",2500,5000,true],
    ["health","Абонемент в фитнес-клуб (мес)",2500,5000,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Бокал вина или коктейль в баре",500,900,true],
  ],
  kutaisi: [
    ["rent","Комната",10000,17000,false],
    ["rent","1-комн. квартира в центре",25000,40000,false],
    ["rent","1-комн. квартира на окраине",18000,28000,false],
    ["rent","2-комн. квартира в центре",40000,60000,false],
    ["food","Обед в кафе",500,900,false],
    ["food","Ужин на двоих в ресторане",2500,4500,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной",1200,1700,false],
    ["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",90,110,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3500,6000,false],
    ["utilities","Домашний интернет",1300,2000,false],
    ["utilities","Мобильная связь (месяц)",700,1300,false],
    ["cafe","Стейк в ресторане среднего класса",2000,3500,true],
    ["cafe","Коктейль в баре",500,900,true],
    ["health","Визит к частному врачу",2000,4000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3000,5500,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Бокал вина или коктейль в баре",400,700,true],
  ],
  budva: [
    ["rent","Комната",22000,38000,false],
    ["rent","1-комн. квартира в центре",55000,90000,false],
    ["rent","1-комн. квартира на окраине",38000,60000,false],
    ["rent","2-комн. квартира в центре",80000,130000,false],
    ["food","Обед в кафе",800,1500,false],
    ["food","Ужин на двоих в ресторане",4500,8000,false],
    ["food","Капучино",200,350,false],
    ["food","Продукты на месяц на 1 человека",24000,35000,false],
    ["transport","Месячный проездной",2500,3500,false],
    ["transport","Такси 3 км",550,950,false],
    ["transport","Бензин (1 л)",130,160,false],
    ["utilities","ЖКХ за 1-комн. квартиру",6500,11000,false],
    ["utilities","Домашний интернет",1500,2500,false],
    ["utilities","Мобильная связь (месяц)",900,1700,false],
    ["cafe","Стейк в ресторане среднего класса",3500,5500,true],
    ["cafe","Коктейль в баре",800,1400,true],
    ["health","Визит к частному врачу",4000,6500,true],
    ["health","Абонемент в фитнес-клуб (мес)",4500,7500,true],
    ["entertainment","Билет в кино",550,850,true],
    ["entertainment","Бокал вина или коктейль в баре",700,1200,true],
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

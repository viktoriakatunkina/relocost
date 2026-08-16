// Seed тринадцатой партии: 10 горячих направлений 2026 года.
// Белград, Лиссабон, Будапешт, Загреб, Сингапур, Токио, Аланья, Херцег-Нови, Мерида, Кейптаун.
// Запуск: node scripts/seed-batch-13.mjs
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
    name_ru: "Белград", name_en: "Belgrade", slug: "belgrade",
    country_ru: "Сербия", country_en: "Serbia", country_slug: "serbia", flag_emoji: "🇷🇸",
    population: "1.7 млн", climate: "+12°C ср.", language: "Сербский, английский", currency: "Динар, RSD",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Белграде в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Белграде? Аренда от 45 000 ₽, еда, транспорт — реальный бюджет на месяц. Безвиз, ВНЖ через ИП, цены 2026.",
    intro_text: "Самый популярный безвизовый европейский город для россиян: безвиз на 30 дней с продлением, близкий сербский язык с кириллицей, доступный ВНЖ через ИП-paušal. Кандидат в ЕС, прямые рейсы Air Serbia из РФ, Visa/Mastercard работают.",
    lat: 44.8176, lng: 20.4569, unsplash_query: "belgrade serbia fortress",
  },
  {
    name_ru: "Лиссабон", name_en: "Lisbon", slug: "lisbon",
    country_ru: "Португалия", country_en: "Portugal", country_slug: "portugal", flag_emoji: "🇵🇹",
    population: "550 тыс", climate: "+17°C ср.", language: "Португальский, английский", currency: "Евро, EUR",
    flight_from_moscow: "10 часов с пересадкой", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Лиссабоне в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Лиссабоне? Аренда, еда, транспорт. D8 Digital Nomad Visa, цены 2026, бюджет на месяц для россиян.",
    intro_text: "Столица Португалии и лидер среди номад-направлений Европы: виза D8 для диджитал-номадов, мягкий климат почти без зимы, океан в 30 минутах. Для россиян требуется виза, но при доходе от 3 480 € в месяц путь к ВНЖ хорошо описан.",
    lat: 38.7169, lng: -9.1395, unsplash_query: "lisbon portugal tram city",
  },
  {
    name_ru: "Будапешт", name_en: "Budapest", slug: "budapest",
    country_ru: "Венгрия", country_en: "Hungary", country_slug: "hungary", flag_emoji: "🇭🇺",
    population: "1.75 млн", climate: "+11°C ср.", language: "Венгерский, английский", currency: "Форинт, HUF",
    flight_from_moscow: "5.5 часа с пересадкой", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Будапеште в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Будапеште? Аренда, еда, транспорт. ЕС, Шенген, Golden Visa, цены 2026 для россиян.",
    intro_text: "Столица Венгрии в ЕС и Шенгене: один из самых доступных городов Евросоюза, программа Golden Visa через инвестиции от 500 000 €. Виза D нужна, но Будапешт дает европейский паспорт в перспективе при разумных ценах — аренда ниже Праги и Варшавы.",
    lat: 47.4979, lng: 19.0402, unsplash_query: "budapest hungary parliament danube",
  },
  {
    name_ru: "Загреб", name_en: "Zagreb", slug: "zagreb",
    country_ru: "Хорватия", country_en: "Croatia", country_slug: "croatia", flag_emoji: "🇭🇷",
    population: "800 тыс", climate: "+13°C ср.", language: "Хорватский, английский", currency: "Евро, EUR",
    flight_from_moscow: "7 часов с пересадкой", is_foreign: true, difficulty_score: 4, is_popular: false,
    seo_title: "Стоимость жизни в Загребе в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Загребе? Аренда, еда, транспорт. ЕС, Шенген, хорватский ВНЖ, цены 2026 для россиян.",
    intro_text: "Столица Хорватии в ЕС и Шенгене: IT-хаб Балкан, море Адриатики в 1.5 часа езды, цены ниже западноевропейских. ВНЖ для россиян возможен через работу или бизнес; виза D нужна. Хорватский близок сербскому.",
    lat: 45.8150, lng: 15.9819, unsplash_query: "zagreb croatia city old town",
  },
  {
    name_ru: "Сингапур", name_en: "Singapore", slug: "singapore",
    country_ru: "Сингапур", country_en: "Singapore", country_slug: "singapore", flag_emoji: "🇸🇬",
    population: "6 млн", climate: "+27°C ср.", language: "Английский, мандаринский", currency: "Сингапурский доллар, SGD",
    flight_from_moscow: "12 часов с пересадкой", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Сингапуре в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Сингапуре? Аренда, еда, транспорт. Визы для IT-специалистов, EntrePass, цены 2026 для россиян.",
    intro_text: "Главный азиатский хаб для IT-специалистов и финтеха: официальный английский язык, EP (Employment Pass) при зарплате от 5 000 SGD, безопасность мирового уровня. Высокая стоимость аренды компенсируется высокими зарплатами в tech-секторе.",
    lat: 1.3521, lng: 103.8198, unsplash_query: "singapore skyline marina bay",
  },
  {
    name_ru: "Токио", name_en: "Tokyo", slug: "tokyo",
    country_ru: "Япония", country_en: "Japan", country_slug: "japan", flag_emoji: "🇯🇵",
    population: "13.96 млн", climate: "+15°C ср.", language: "Японский, английский (хаб)", currency: "Иена, JPY",
    flight_from_moscow: "9 часов", is_foreign: true, difficulty_score: 4, is_popular: true,
    seo_title: "Стоимость жизни в Токио в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Токио? Аренда, еда, транспорт. Виза Highly Skilled Professional, цены 2026 для россиян.",
    intro_text: "Крупнейший мегаполис мира с растущим интересом россиян в 2026 году: Highly Skilled Professional visa (HSP) открыта, прямые рейсы из Владивостока, уровень безопасности и качество жизни — одни из лучших на планете. Японский обязателен для быта, но в IT среде достаточно английского.",
    lat: 35.6762, lng: 139.6503, unsplash_query: "tokyo japan city skyline",
  },
  {
    name_ru: "Аланья", name_en: "Alanya", slug: "alanya",
    country_ru: "Турция", country_en: "Turkey", country_slug: "turkey", flag_emoji: "🇹🇷",
    population: "300 тыс", climate: "+20°C ср.", language: "Турецкий, русский, английский", currency: "Турецкая лира, TRY",
    flight_from_moscow: "4 часа", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Аланье в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Аланье? Аренда от 35 000 ₽, море круглый год, цены 2026. Дешевле Антальи, русскоязычная среда.",
    intro_text: "Курортный город на Турецкой Ривьере дешевле и тише Антальи: безвиз 90 дней из 180, море тепло с апреля по ноябрь, большая русскоязычная диаспора. Вид на жительство через недвижимость от 200 000 $. Популярен у семей с детьми и пенсионеров.",
    lat: 36.5440, lng: 31.9993, unsplash_query: "alanya turkey castle sea",
  },
  {
    name_ru: "Херцег-Нови", name_en: "Herceg Novi", slug: "herceg-novi",
    country_ru: "Черногория", country_en: "Montenegro", country_slug: "montenegro", flag_emoji: "🇲🇪",
    population: "33 тыс", climate: "+16°C ср.", language: "Черногорский, сербский, русский", currency: "Евро, EUR",
    flight_from_moscow: "5 часов", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни в Херцег-Нови в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Херцег-Нови? Аренда, еда, транспорт. Черногория, море, тишина, цены 2026 для россиян.",
    intro_text: "Маленький живописный город у Которского залива с безвизом на 30 дней и большим процентом русскоязычных жителей. Тише и дешевле Будвы, рядом граница с Хорватией. ВНЖ через недвижимость — один из самых простых путей в стране.",
    lat: 42.4522, lng: 18.5375, unsplash_query: "herceg novi montenegro bay",
  },
  {
    name_ru: "Мерида", name_en: "Merida", slug: "merida",
    country_ru: "Мексика", country_en: "Mexico", country_slug: "mexico", flag_emoji: "🇲🇽",
    population: "970 тыс", climate: "+27°C ср.", language: "Испанский, английский", currency: "Песо, MXN",
    flight_from_moscow: "17 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Мериде в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Мериде (Мексика)? Аренда, еда, транспорт. Безвиз 180 дней, дешевые тропики, номад-хаб, цены 2026.",
    intro_text: "Белый город Юкатана — тихая альтернатива Мехико и Плайя-дель-Кармен: безвиз для россиян на 180 дней, низкие цены для региона, растущее номад-сообщество. Руины майя под боком, Карибское море в 90 минутах. Испанский нужен для комфортной жизни.",
    lat: 20.9674, lng: -89.5926, unsplash_query: "merida mexico colonial city",
  },
  {
    name_ru: "Кейптаун", name_en: "Cape Town", slug: "cape-town",
    country_ru: "ЮАР", country_en: "South Africa", country_slug: "south-africa", flag_emoji: "🇿🇦",
    population: "4.6 млн", climate: "+17°C ср.", language: "Английский, африкаанс", currency: "Ранд, ZAR",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Кейптауне в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Кейптауне? Аренда, еда, транспорт. Море, горы, английский язык, цены 2026 для россиян.",
    intro_text: "Самый красивый город ЮАР у подножия Столовой горы: английский язык, безвиз на 90 дней, цены в рандах делают стоимость жизни очень доступной для тех, кто получает доход в USD/EUR. Отличный климат средиземноморского типа, вино и серфинг.",
    lat: -33.9249, lng: 18.4241, unsplash_query: "cape town south africa table mountain",
  },
];

const PRICES = {
  belgrade: [
    ["rent","Комната",20000,35000,false],
    ["rent","1-комн. квартира в центре",45000,75000,false],
    ["rent","1-комн. квартира на окраине",30000,50000,false],
    ["rent","2-комн. квартира в центре",70000,110000,false],
    ["food","Обед в кафе",600,1100,false],
    ["food","Ужин на двоих в ресторане",3500,6500,false],
    ["food","Капучино",150,280,false],
    ["food","Продукты на месяц на 1 человека",18000,27000,false],
    ["transport","Месячный проездной",1500,2200,false],
    ["transport","Такси 3 км",350,650,false],
    ["transport","Бензин (1 л)",120,145,false],
    ["utilities","ЖКХ за 1-комн. квартиру",5000,8500,false],
    ["utilities","Домашний интернет",1200,2000,false],
    ["utilities","Мобильная связь (месяц)",700,1300,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4500,true],
    ["cafe","Коктейль в баре",600,1100,true],
    ["health","Визит к частному врачу",2500,5000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3000,6000,true],
    ["entertainment","Билет в кино",450,750,true],
    ["entertainment","Бокал вина или коктейль в баре",450,850,true],
  ],
  lisbon: [
    ["rent","Комната",55000,85000,false],
    ["rent","1-комн. квартира в центре",120000,190000,false],
    ["rent","1-комн. квартира на окраине",80000,130000,false],
    ["rent","2-комн. квартира в центре",170000,260000,false],
    ["food","Обед в кафе",900,1600,false],
    ["food","Ужин на двоих в ресторане",5000,9000,false],
    ["food","Капучино",100,180,false],
    ["food","Продукты на месяц на 1 человека",22000,34000,false],
    ["transport","Месячный проездной",3200,4200,false],
    ["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",160,195,false],
    ["utilities","ЖКХ за 1-комн. квартиру",7000,12000,false],
    ["utilities","Домашний интернет",2000,3500,false],
    ["utilities","Мобильная связь (месяц)",1000,1800,false],
    ["cafe","Стейк в ресторане среднего класса",4000,7000,true],
    ["cafe","Коктейль в баре",800,1500,true],
    ["health","Визит к частному врачу",5000,9000,true],
    ["health","Абонемент в фитнес-клуб (мес)",5000,8500,true],
    ["entertainment","Билет в кино",800,1200,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  budapest: [
    ["rent","Комната",35000,55000,false],
    ["rent","1-комн. квартира в центре",65000,105000,false],
    ["rent","1-комн. квартира на окраине",45000,70000,false],
    ["rent","2-комн. квартира в центре",100000,155000,false],
    ["food","Обед в кафе",700,1300,false],
    ["food","Ужин на двоих в ресторане",4000,7500,false],
    ["food","Капучино",300,500,false],
    ["food","Продукты на месяц на 1 человека",20000,30000,false],
    ["transport","Месячный проездной",2800,3500,false],
    ["transport","Такси 3 км",450,800,false],
    ["transport","Бензин (1 л)",165,200,false],
    ["utilities","ЖКХ за 1-комн. квартиру",7000,12000,false],
    ["utilities","Домашний интернет",1800,3000,false],
    ["utilities","Мобильная связь (месяц)",900,1600,false],
    ["cafe","Стейк в ресторане среднего класса",3500,6000,true],
    ["cafe","Коктейль в баре",700,1300,true],
    ["health","Визит к частному врачу",4000,7500,true],
    ["health","Абонемент в фитнес-клуб (мес)",4500,7500,true],
    ["entertainment","Билет в кино",700,1100,true],
    ["entertainment","Бокал вина или коктейль в баре",600,1100,true],
  ],
  zagreb: [
    ["rent","Комната",38000,60000,false],
    ["rent","1-комн. квартира в центре",75000,120000,false],
    ["rent","1-комн. квартира на окраине",50000,80000,false],
    ["rent","2-комн. квартира в центре",110000,170000,false],
    ["food","Обед в кафе",700,1300,false],
    ["food","Ужин на двоих в ресторане",4500,8000,false],
    ["food","Капучино",180,320,false],
    ["food","Продукты на месяц на 1 человека",22000,33000,false],
    ["transport","Месячный проездной",2500,3500,false],
    ["transport","Такси 3 км",500,900,false],
    ["transport","Бензин (1 л)",155,185,false],
    ["utilities","ЖКХ за 1-комн. квартиру",7000,12000,false],
    ["utilities","Домашний интернет",1800,3000,false],
    ["utilities","Мобильная связь (месяц)",900,1600,false],
    ["cafe","Стейк в ресторане среднего класса",3500,6000,true],
    ["cafe","Коктейль в баре",700,1300,true],
    ["health","Визит к частному врачу",4000,7000,true],
    ["health","Абонемент в фитнес-клуб (мес)",4000,7000,true],
    ["entertainment","Билет в кино",700,1100,true],
    ["entertainment","Бокал вина или коктейль в баре",550,1000,true],
  ],
  singapore: [
    ["rent","Комната",100000,160000,false],
    ["rent","1-комн. квартира в центре",280000,420000,false],
    ["rent","1-комн. квартира на окраине",180000,280000,false],
    ["rent","2-комн. квартира в центре",420000,650000,false],
    ["food","Обед в кафе (хокер-центр)",300,600,false],
    ["food","Ужин на двоих в ресторане",4000,8000,false],
    ["food","Капучино",450,750,false],
    ["food","Продукты на месяц на 1 человека",28000,45000,false],
    ["transport","Месячный проездной (MRT+автобус)",4000,5500,false],
    ["transport","Такси 3 км",700,1200,false],
    ["transport","Бензин (1 л)",160,200,false],
    ["utilities","ЖКХ за 1-комн. квартиру",7000,13000,false],
    ["utilities","Домашний интернет",2500,4000,false],
    ["utilities","Мобильная связь (месяц)",1500,2500,false],
    ["cafe","Стейк в ресторане среднего класса",6000,11000,true],
    ["cafe","Коктейль в баре",1200,2200,true],
    ["health","Визит к частному врачу",7000,14000,true],
    ["health","Абонемент в фитнес-клуб (мес)",8000,15000,true],
    ["entertainment","Билет в кино",900,1400,true],
    ["entertainment","Бокал вина или коктейль в баре",1000,2000,true],
  ],
  tokyo: [
    ["rent","Комната (share house)",45000,75000,false],
    ["rent","1-комн. квартира в центре",120000,200000,false],
    ["rent","1-комн. квартира на окраине",70000,120000,false],
    ["rent","2-комн. квартира в центре",180000,290000,false],
    ["food","Обед в кафе (рамен/бенто)",600,1000,false],
    ["food","Ужин на двоих в ресторане",4000,8000,false],
    ["food","Капучино",350,550,false],
    ["food","Продукты на месяц на 1 человека",25000,38000,false],
    ["transport","Месячный проездной (метро+JR)",9000,13000,false],
    ["transport","Такси 3 км",1200,2000,false],
    ["transport","Бензин (1 л)",130,165,false],
    ["utilities","ЖКХ за 1-комн. квартиру",6000,11000,false],
    ["utilities","Домашний интернет",2000,3500,false],
    ["utilities","Мобильная связь (месяц)",1800,3000,false],
    ["cafe","Стейк в ресторане среднего класса",5000,9000,true],
    ["cafe","Коктейль в баре",900,1800,true],
    ["health","Визит к частному врачу (со страховкой)",500,1500,true],
    ["health","Абонемент в фитнес-клуб (мес)",7000,12000,true],
    ["entertainment","Билет в кино",1000,1500,true],
    ["entertainment","Бокал пива в баре",500,900,true],
  ],
  alanya: [
    ["rent","Комната",15000,25000,false],
    ["rent","1-комн. квартира в центре",40000,65000,false],
    ["rent","1-комн. квартира на окраине",28000,45000,false],
    ["rent","2-комн. квартира в центре",60000,95000,false],
    ["food","Обед в кафе",500,1000,false],
    ["food","Ужин на двоих в ресторане",3000,5500,false],
    ["food","Капучино",180,320,false],
    ["food","Продукты на месяц на 1 человека",16000,25000,false],
    ["transport","Месячный проездной",1000,1500,false],
    ["transport","Такси 3 км",300,550,false],
    ["transport","Бензин (1 л)",115,145,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4500,7500,false],
    ["utilities","Домашний интернет",1400,2300,false],
    ["utilities","Мобильная связь (месяц)",700,1400,false],
    ["cafe","Стейк в ресторане среднего класса",2500,4000,true],
    ["cafe","Коктейль в баре",600,1200,true],
    ["health","Визит к частному врачу",2500,5000,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",450,750,true],
    ["entertainment","Бокал вина или коктейль в баре",450,850,true],
  ],
  "herceg-novi": [
    ["rent","Комната",18000,30000,false],
    ["rent","1-комн. квартира в центре",38000,62000,false],
    ["rent","1-комн. квартира на окраине",25000,40000,false],
    ["rent","2-комн. квартира в центре",58000,90000,false],
    ["food","Обед в кафе",600,1100,false],
    ["food","Ужин на двоих в ресторане",3500,6500,false],
    ["food","Капучино",170,300,false],
    ["food","Продукты на месяц на 1 человека",20000,30000,false],
    ["transport","Месячный проездной",1800,2800,false],
    ["transport","Такси 3 км",450,800,false],
    ["transport","Бензин (1 л)",130,160,false],
    ["utilities","ЖКХ за 1-комн. квартиру",5500,9000,false],
    ["utilities","Домашний интернет",1400,2300,false],
    ["utilities","Мобильная связь (месяц)",800,1500,false],
    ["cafe","Стейк в ресторане среднего класса",3000,5000,true],
    ["cafe","Коктейль в баре",650,1200,true],
    ["health","Визит к частному врачу",3000,5500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,6500,true],
    ["entertainment","Билет в кино",450,750,true],
    ["entertainment","Бокал вина или коктейль в баре",550,1000,true],
  ],
  merida: [
    ["rent","Комната",12000,20000,false],
    ["rent","1-комн. квартира в центре",28000,48000,false],
    ["rent","1-комн. квартира на окраине",18000,32000,false],
    ["rent","2-комн. квартира в центре",45000,72000,false],
    ["food","Обед в кафе",350,700,false],
    ["food","Ужин на двоих в ресторане",2000,4000,false],
    ["food","Капучино",200,380,false],
    ["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной (автобус)",700,1100,false],
    ["transport","Такси 3 км",250,500,false],
    ["transport","Бензин (1 л)",100,130,false],
    ["utilities","ЖКХ за 1-комн. квартиру (кондиционер!)3500",3500,7000,false],
    ["utilities","Домашний интернет",1200,2000,false],
    ["utilities","Мобильная связь (месяц)",500,1000,false],
    ["cafe","Стейк в ресторане среднего класса",1800,3500,true],
    ["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",1500,3000,true],
    ["health","Абонемент в фитнес-клуб (мес)",2000,4500,true],
    ["entertainment","Билет в кино",350,600,true],
    ["entertainment","Бокал вина или коктейль в баре",350,700,true],
  ],
  "cape-town": [
    ["rent","Комната",25000,42000,false],
    ["rent","1-комн. квартира в центре",55000,90000,false],
    ["rent","1-комн. квартира на окраине",35000,58000,false],
    ["rent","2-комн. квартира в центре",85000,140000,false],
    ["food","Обед в кафе",600,1100,false],
    ["food","Ужин на двоих в ресторане",3500,7000,false],
    ["food","Капучино",300,500,false],
    ["food","Продукты на месяц на 1 человека",18000,28000,false],
    ["transport","Такси 3 км (Uber/Bolt)",350,700,false],
    ["transport","Общественный транспорт (разовый)",100,200,false],
    ["transport","Бензин (1 л)",90,115,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4500,8000,false],
    ["utilities","Домашний интернет",2000,3500,false],
    ["utilities","Мобильная связь (месяц)",800,1500,false],
    ["cafe","Стейк в ресторане среднего класса",3000,5500,true],
    ["cafe","Бокал местного вина в ресторане",450,900,true],
    ["health","Визит к частному врачу",3500,6500,true],
    ["health","Абонемент в фитнес-клуб (мес)",3500,7000,true],
    ["entertainment","Билет в кино",600,1000,true],
    ["entertainment","Бокал вина или коктейль в баре",500,900,true],
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

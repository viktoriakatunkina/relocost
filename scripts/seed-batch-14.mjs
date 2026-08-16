// Seed четырнадцатой партии: 5 городов Индонезии + 5 городов Индии.
// Индонезия: Убуд, Семиньяк, Ломбок (Матарам), Медан, Джокьякарта.
// Индия: Мумбаи, Бангалор, Дели, Ченнаи, Пондичерри.
// Запуск: node scripts/seed-batch-14.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

const CITIES = [
  // ─── Индонезия ────────────────────────────────────────────────────────────
  {
    name_ru: "Убуд", name_en: "Ubud", slug: "ubud",
    country_ru: "Индонезия", country_en: "Indonesia", country_slug: "indonesia", flag_emoji: "🇮🇩",
    population: "75 тыс", climate: "+26°C ср.", language: "Балийский, индонезийский, английский", currency: "Рупия, IDR",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Убуде в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Убуде (Бали)? Аренда от 18 000 ₽, йога, рисовые террасы, цены 2026. Реальный бюджет диджитал-номада.",
    intro_text: "Культурное сердце Бали среди рисовых террас и джунглей: духовная атмосфера, множество йога-ретритов, хорошие кафе и коворкинги. Тише и зеленее пляжного Семиньяка, популярен у лонг-стейщиков и фрилансеров.",
    lat: -8.5069, lng: 115.2625, unsplash_query: "ubud bali indonesia rice terraces",
  },
  {
    name_ru: "Семиньяк", name_en: "Seminyak", slug: "seminyak",
    country_ru: "Индонезия", country_en: "Indonesia", country_slug: "indonesia", flag_emoji: "🇮🇩",
    population: "30 тыс", climate: "+28°C ср.", language: "Балийский, индонезийский, английский", currency: "Рупия, IDR",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: true,
    seo_title: "Стоимость жизни в Семиньяке в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Семиньяке (Бали)? Аренда, пляж, рестораны, цены 2026. Самый модный район Бали для экспатов.",
    intro_text: "Фешенебельный пляжный район Бали: бутик-отели, рестораны высокого уровня, шоппинг и закаты над Индийским океаном. Самый дорогой и гламурный район острова, популярен у предпринимателей и фрилансеров с хорошим доходом.",
    lat: -8.6916, lng: 115.1614, unsplash_query: "seminyak bali beach sunset",
  },
  {
    name_ru: "Ломбок", name_en: "Lombok", slug: "lombok",
    country_ru: "Индонезия", country_en: "Indonesia", country_slug: "indonesia", flag_emoji: "🇮🇩",
    population: "3.7 млн (остров)", climate: "+28°C ср.", language: "Sasak, индонезийский, английский", currency: "Рупия, IDR",
    flight_from_moscow: "14 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни на Ломбоке в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить на Ломбоке (Индонезия)? Аренда, пляжи, цены 2026. Спокойная альтернатива Бали.",
    intro_text: "Тихий остров к востоку от Бали: нетронутые пляжи Сенггиги и Куты, вулкан Ринджани, значительно меньше туристов. Цены ниже, чем на Бали, интернет развивается. Подходит для тех, кто хочет природы и спокойствия.",
    lat: -8.6500, lng: 116.3240, unsplash_query: "lombok indonesia beach ocean",
  },
  {
    name_ru: "Медан", name_en: "Medan", slug: "medan",
    country_ru: "Индонезия", country_en: "Indonesia", country_slug: "indonesia", flag_emoji: "🇮🇩",
    population: "2.5 млн", climate: "+27°C ср.", language: "Индонезийский, Batak, английский", currency: "Рупия, IDR",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Медане в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Медане (Индонезия, Суматра)? Аренда от 12 000 ₽, цены 2026. Самый доступный крупный город Индонезии.",
    intro_text: "Третий город Индонезии на Суматре у озера Тоба: значительно дешевле Бали и Джакарты, гастрономическая столица страны (кофе Aceh, rendang). Подходит для тех, кому нужны低цены и не важен туристический комфорт.",
    lat: 3.5952, lng: 98.6722, unsplash_query: "medan indonesia city sumatra",
  },
  {
    name_ru: "Джокьякарта", name_en: "Yogyakarta", slug: "yogyakarta",
    country_ru: "Индонезия", country_en: "Indonesia", country_slug: "indonesia", flag_emoji: "🇮🇩",
    population: "420 тыс", climate: "+27°C ср.", language: "Яванский, индонезийский, английский", currency: "Рупия, IDR",
    flight_from_moscow: "13 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни в Джокьякарте в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Джокьякарте? Аренда от 10 000 ₽, Боробудур рядом, цены 2026. Студенческий город Явы.",
    intro_text: "Культурная столица Явы у вулкана Мерапи: студенческий город с богатой культурой, дешевой едой и доступным жильем. Рядом Боробудур и Прамбанан. Популярен среди диджитал-номадов, ищущих тихую и дешевую базу.",
    lat: -7.7956, lng: 110.3695, unsplash_query: "yogyakarta java indonesia borobudur",
  },

  // ─── Индия ────────────────────────────────────────────────────────────────
  {
    name_ru: "Мумбаи", name_en: "Mumbai", slug: "mumbai",
    country_ru: "Индия", country_en: "India", country_slug: "india", flag_emoji: "🇮🇳",
    population: "20 млн", climate: "+27°C ср.", language: "Хинди, маратхи, английский", currency: "Рупия, INR",
    flight_from_moscow: "6.5 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Мумбаи в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Мумбаи? Аренда, еда, транспорт. Финансовый центр Индии, цены 2026 для россиян.",
    intro_text: "Финансовая столица Индии: Болливуд, Морской проспект, Колаба и крупнейший IT/финтех-кластер страны. Виза для россиян — e-Visa онлайн (простая процедура). Самый дорогой город Индии, но при этом — с лучшими карьерными возможностями.",
    lat: 19.0760, lng: 72.8777, unsplash_query: "mumbai india skyline gateway",
  },
  {
    name_ru: "Бангалор", name_en: "Bangalore", slug: "bangalore",
    country_ru: "Индия", country_en: "India", country_slug: "india", flag_emoji: "🇮🇳",
    population: "12 млн", climate: "+24°C ср.", language: "Каннада, английский, хинди", currency: "Рупия, INR",
    flight_from_moscow: "7 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Бангалоре в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Бангалоре? Аренда, еда, IT-карьера. Кремниевая долина Индии, цены 2026 для россиян.",
    intro_text: "«Индийская Кремниевая долина»: Infosys, Wipro, Flipkart, сотни стартапов. Самый приятный климат среди крупных городов Индии (+24°C круглый год), развитая IT-инфраструктура и большое комьюнити иностранных специалистов. Английский на отличном уровне.",
    lat: 12.9716, lng: 77.5946, unsplash_query: "bangalore india city modern",
  },
  {
    name_ru: "Дели", name_en: "Delhi", slug: "delhi",
    country_ru: "Индия", country_en: "India", country_slug: "india", flag_emoji: "🇮🇳",
    population: "32 млн", climate: "+25°C ср.", language: "Хинди, урду, английский", currency: "Рупия, INR",
    flight_from_moscow: "6 часов", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Дели в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Дели? Аренда, еда, транспорт. Столица Индии, цены 2026 для россиян.",
    intro_text: "Столица Индии и крупнейший мегаполис страны: Тадж-Махал в 3 часах, история Моголов и Британской Индии, лучшая гастрономическая сцена страны. Прямые рейсы из Москвы (Аэрофлот, Air India). Качество воздуха — главный минус зимой.",
    lat: 28.6139, lng: 77.2090, unsplash_query: "new delhi india red fort city",
  },
  {
    name_ru: "Ченнаи", name_en: "Chennai", slug: "chennai",
    country_ru: "Индия", country_en: "India", country_slug: "india", flag_emoji: "🇮🇳",
    population: "7.1 млн", climate: "+29°C ср.", language: "Тамильский, английский", currency: "Рупия, INR",
    flight_from_moscow: "8 часов с пересадкой", is_foreign: true, difficulty_score: 3, is_popular: false,
    seo_title: "Стоимость жизни в Ченнаи в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Ченнаи? Аренда, еда, транспорт. IT-хаб Южной Индии, цены 2026 для россиян.",
    intro_text: "IT-хаб Южной Индии на Коромандельском берегу: автомобильная и IT-промышленность, доступные цены для крупного города, длинная береговая линия. Английский отличный, климат жаркий и влажный, но зимой комфортно.",
    lat: 13.0827, lng: 80.2707, unsplash_query: "chennai india beach marina",
  },
  {
    name_ru: "Пондичерри", name_en: "Pondicherry", slug: "pondicherry",
    country_ru: "Индия", country_en: "India", country_slug: "india", flag_emoji: "🇮🇳",
    population: "650 тыс", climate: "+29°C ср.", language: "Тамильский, французский, английский", currency: "Рупия, INR",
    flight_from_moscow: "9 часов с пересадкой", is_foreign: true, difficulty_score: 2, is_popular: false,
    seo_title: "Стоимость жизни в Пондичерри в 2026 году — калькулятор бюджета | Relocost",
    seo_description: "Сколько стоит жить в Пондичерри? Аренда, еда, транспорт. Маленький французский город у океана в Индии, цены 2026.",
    intro_text: "Бывший французский анклав у Бенгальского залива: колониальная архитектура, ашрам Шри Ауробиндо, дешевая жизнь и спокойный ритм. Самый нетипичный и атмосферный город Индии — популярен среди практикующих йогу и ищущих духовного опыта.",
    lat: 11.9416, lng: 79.8083, unsplash_query: "pondicherry india french quarter beach",
  },
];

const PRICES = {
  ubud: [
    ["rent","Комната",12000,20000,false],
    ["rent","Вилла/студия с садом",20000,45000,false],
    ["rent","1-комн. квартира/студия",18000,35000,false],
    ["rent","2-комн. вилла",35000,70000,false],
    ["food","Обед в варунге (local cafe)",200,500,false],
    ["food","Ужин на двоих в ресторане",1500,3500,false],
    ["food","Смузи или аса чай",300,600,false],
    ["food","Продукты на месяц на 1 человека",12000,20000,false],
    ["transport","Мотоскутер (аренда в месяц)",5000,9000,false],
    ["transport","Такси Grab 3 км",250,500,false],
    ["transport","Бензин (1 л)",70,90,false],
    ["utilities","ЖКХ + кондиционер (студия)",2500,5500,false],
    ["utilities","Домашний интернет",1200,2500,false],
    ["utilities","Мобильная связь (месяц)",500,1200,false],
    ["cafe","Ужин в хорошем ресторане",1500,3500,true],
    ["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к частному врачу",1500,3500,true],
    ["health","Абонемент в йога-студию (мес)",5000,12000,true],
    ["entertainment","Вход на ретрит/фестиваль",2000,8000,true],
    ["entertainment","Экскурсия по рисовым полям",1000,2500,true],
  ],
  seminyak: [
    ["rent","Комната",20000,35000,false],
    ["rent","Вилла с бассейном (студия)",40000,80000,false],
    ["rent","1-комн. квартира/студия",30000,60000,false],
    ["rent","2-комн. вилла с бассейном",70000,130000,false],
    ["food","Обед в кафе",500,1200,false],
    ["food","Ужин на двоих в ресторане",3000,6000,false],
    ["food","Смузи-боул",400,800,false],
    ["food","Продукты на месяц на 1 человека",16000,26000,false],
    ["transport","Мотоскутер (аренда в месяц)",6000,11000,false],
    ["transport","Такси Grab 3 км",300,600,false],
    ["transport","Бензин (1 л)",70,90,false],
    ["utilities","ЖКХ (вилла с бассейном)",5000,10000,false],
    ["utilities","Домашний интернет",1500,3000,false],
    ["utilities","Мобильная связь (месяц)",600,1300,false],
    ["cafe","Ужин в топ-ресторане Семиньяка",4000,8000,true],
    ["cafe","Коктейль на пляжном клубе",800,1800,true],
    ["health","Визит к частному врачу",2000,4500,true],
    ["health","Спа-процедуры (час)",1000,3000,true],
    ["entertainment","Закат в beach club",1000,3000,true],
    ["entertainment","Серф-урок",2000,4000,true],
  ],
  lombok: [
    ["rent","Комната",9000,16000,false],
    ["rent","Вилла/студия у пляжа",16000,35000,false],
    ["rent","1-комн. квартира",13000,28000,false],
    ["rent","2-комн. вилла",28000,55000,false],
    ["food","Обед в warung",150,400,false],
    ["food","Ужин на двоих в кафе",900,2200,false],
    ["food","Свежий кокос",100,200,false],
    ["food","Продукты на месяц на 1 человека",10000,17000,false],
    ["transport","Мотоскутер (аренда в месяц)",4000,7500,false],
    ["transport","Такси 3 км",200,450,false],
    ["transport","Бензин (1 л)",65,85,false],
    ["utilities","ЖКХ (студия)",2000,4500,false],
    ["utilities","Домашний интернет",1000,2200,false],
    ["utilities","Мобильная связь (месяц)",450,1000,false],
    ["cafe","Ужин в ресторане для туристов",1200,3000,true],
    ["cafe","Коктейль в баре",500,1000,true],
    ["health","Визит к врачу (мед. центр)",1200,3000,true],
    ["health","Масаж (час)",500,1500,true],
    ["entertainment","Снорклинг-тур на острова Gili",2000,5000,true],
    ["entertainment","Треккинг на вулкан Ринджани (2 дня)",8000,20000,true],
  ],
  medan: [
    ["rent","Комната",8000,14000,false],
    ["rent","1-комн. квартира в центре",15000,28000,false],
    ["rent","1-комн. квартира на окраине",10000,18000,false],
    ["rent","2-комн. квартира в центре",25000,42000,false],
    ["food","Обед в warung/kedai",150,350,false],
    ["food","Ужин на двоих в ресторане",800,2000,false],
    ["food","Кофе (местный качественный Aceh)",100,250,false],
    ["food","Продукты на месяц на 1 человека",9000,15000,false],
    ["transport","Месячный проездной (автобус)",800,1300,false],
    ["transport","Такси Grab 3 км",180,380,false],
    ["transport","Бензин (1 л)",65,85,false],
    ["utilities","ЖКХ за 1-комн. квартиру",2000,4500,false],
    ["utilities","Домашний интернет",900,1800,false],
    ["utilities","Мобильная связь (месяц)",400,900,false],
    ["cafe","Ужин в хорошем ресторане",1000,2500,true],
    ["cafe","Коктейль в баре",400,900,true],
    ["health","Визит к частному врачу",1000,2500,true],
    ["health","Абонемент в фитнес (мес)",1500,4000,true],
    ["entertainment","Билет в кино",400,700,true],
    ["entertainment","Экскурсия к озеру Тоба",3000,8000,true],
  ],
  yogyakarta: [
    ["rent","Комната",7000,13000,false],
    ["rent","1-комн. квартира в центре",14000,26000,false],
    ["rent","1-комн. квартира на окраине",9000,17000,false],
    ["rent","2-комн. квартира в центре",22000,40000,false],
    ["food","Обед в warung",120,300,false],
    ["food","Ужин на двоих в кафе",700,1800,false],
    ["food","Капучино",200,400,false],
    ["food","Продукты на месяц на 1 человека",9000,15000,false],
    ["transport","Angkot (маршрутка, месяц)",600,1100,false],
    ["transport","Такси Grab 3 км",180,380,false],
    ["transport","Мотоскутер (аренда в месяц)",3500,6500,false],
    ["utilities","ЖКХ за 1-комн. квартиру",2000,4000,false],
    ["utilities","Домашний интернет",900,1800,false],
    ["utilities","Мобильная связь (месяц)",400,900,false],
    ["cafe","Ужин в ресторане",900,2200,true],
    ["cafe","Коктейль/пиво в баре",500,1200,true],
    ["health","Визит к частному врачу",1000,2500,true],
    ["health","Абонемент в фитнес (мес)",1500,4000,true],
    ["entertainment","Билет в кино",350,650,true],
    ["entertainment","Билет в Боробудур (иностр.)",2000,3500,true],
  ],

  // ─── Индия ────────────────────────────────────────────────────────────────
  mumbai: [
    ["rent","Комната",18000,32000,false],
    ["rent","1-комн. квартира в центре",55000,100000,false],
    ["rent","1-комн. квартира на окраине",30000,55000,false],
    ["rent","2-комн. квартира в центре",90000,160000,false],
    ["food","Обед в кафе/dabbawala",300,700,false],
    ["food","Ужин на двоих в ресторане",2500,6000,false],
    ["food","Масала-чай",50,150,false],
    ["food","Продукты на месяц на 1 человека",14000,22000,false],
    ["transport","Месячный проездной (metro+local train)",1500,2200,false],
    ["transport","Такси Ola/Uber 3 км",300,600,false],
    ["transport","Бензин (1 л)",75,95,false],
    ["utilities","ЖКХ за 1-комн. квартиру",5000,9000,false],
    ["utilities","Домашний интернет",800,1600,false],
    ["utilities","Мобильная связь (месяц)",300,700,false],
    ["cafe","Ужин в ресторане Fine Dining",4000,9000,true],
    ["cafe","Коктейль в баре",800,1800,true],
    ["health","Визит к частному врачу",2500,5000,true],
    ["health","Абонемент в фитнес (мес)",4000,8000,true],
    ["entertainment","Билет в кино",700,1200,true],
    ["entertainment","Бокал вина в баре",700,1500,true],
  ],
  bangalore: [
    ["rent","Комната",15000,26000,false],
    ["rent","1-комн. квартира в центре (1BHK)",40000,75000,false],
    ["rent","1-комн. квартира на окраине (1BHK)",22000,42000,false],
    ["rent","2-комн. квартира в центре (2BHK)",65000,120000,false],
    ["food","Обед в кафе/mess",250,600,false],
    ["food","Ужин на двоих в ресторане",2000,5000,false],
    ["food","Кофе (filter coffee)",80,200,false],
    ["food","Продукты на месяц на 1 человека",13000,20000,false],
    ["transport","Месячный проездной (metro)",1200,1800,false],
    ["transport","Такси Ola/Uber 3 км",280,550,false],
    ["transport","Бензин (1 л)",78,98,false],
    ["utilities","ЖКХ за 1-комн. квартиру (кондиционер)",4000,8000,false],
    ["utilities","Домашний интернет",700,1400,false],
    ["utilities","Мобильная связь (месяц)",300,700,false],
    ["cafe","Ужин в ресторане",3000,7000,true],
    ["cafe","Крафтовое пиво в баре",600,1400,true],
    ["health","Визит к частному врачу",2000,4500,true],
    ["health","Абонемент в фитнес (мес)",3500,7500,true],
    ["entertainment","Билет в кино",600,1100,true],
    ["entertainment","Коктейль в баре",700,1500,true],
  ],
  delhi: [
    ["rent","Комната",13000,23000,false],
    ["rent","1-комн. квартира в центре",42000,80000,false],
    ["rent","1-комн. квартира на окраине",22000,40000,false],
    ["rent","2-комн. квартира в центре",70000,130000,false],
    ["food","Обед в кафе/dhabha",250,600,false],
    ["food","Ужин на двоих в ресторане",2000,5500,false],
    ["food","Масала-чай",50,150,false],
    ["food","Продукты на месяц на 1 человека",13000,21000,false],
    ["transport","Месячный проездной (Delhi Metro)",1100,1700,false],
    ["transport","Такси Ola/Uber 3 км",280,550,false],
    ["transport","Бензин (1 л)",76,96,false],
    ["utilities","ЖКХ за 1-комн. квартиру",4000,8500,false],
    ["utilities","Домашний интернет",700,1400,false],
    ["utilities","Мобильная связь (месяц)",300,700,false],
    ["cafe","Ужин в ресторане",3000,7500,true],
    ["cafe","Коктейль в баре",700,1600,true],
    ["health","Визит к частному врачу",2000,4500,true],
    ["health","Абонемент в фитнес (мес)",3500,7000,true],
    ["entertainment","Билет в кино (PVR, INOX)",700,1300,true],
    ["entertainment","Коктейль в баре",700,1500,true],
  ],
  chennai: [
    ["rent","Комната",12000,20000,false],
    ["rent","1-комн. квартира в центре",35000,65000,false],
    ["rent","1-комн. квартира на окраине",20000,38000,false],
    ["rent","2-комн. квартира в центре",58000,105000,false],
    ["food","Обед в кафе (meals)",200,500,false],
    ["food","Ужин на двоих в ресторане",1800,4500,false],
    ["food","Фильтрованный кофе",60,150,false],
    ["food","Продукты на месяц на 1 человека",12000,20000,false],
    ["transport","Месячный проездной (metro+bus)",1000,1600,false],
    ["transport","Такси Ola/Uber 3 км",250,500,false],
    ["transport","Бензин (1 л)",77,97,false],
    ["utilities","ЖКХ за 1-комн. квартиру",3500,7000,false],
    ["utilities","Домашний интернет",700,1400,false],
    ["utilities","Мобильная связь (месяц)",300,700,false],
    ["cafe","Ужин в ресторане",2500,6000,true],
    ["cafe","Коктейль в баре",600,1400,true],
    ["health","Визит к частному врачу",1800,4000,true],
    ["health","Абонемент в фитнес (мес)",3000,6500,true],
    ["entertainment","Билет в кино",600,1100,true],
    ["entertainment","Коктейль в баре",600,1300,true],
  ],
  pondicherry: [
    ["rent","Комната",8000,15000,false],
    ["rent","1-комн. квартира/студия",18000,35000,false],
    ["rent","Комната в колониальном доме",12000,22000,false],
    ["rent","2-комн. квартира",30000,55000,false],
    ["food","Обед в кафе",250,600,false],
    ["food","Ужин на двоих (французский ресторан)",1500,4000,false],
    ["food","Кофе французский",150,300,false],
    ["food","Продукты на месяц на 1 человека",10000,17000,false],
    ["transport","Мотоскутер (аренда в месяц)",4500,8000,false],
    ["transport","Такси/авторикша 3 км",150,350,false],
    ["transport","Бензин (1 л)",77,97,false],
    ["utilities","ЖКХ (студия)",2500,5000,false],
    ["utilities","Домашний интернет",700,1400,false],
    ["utilities","Мобильная связь (месяц)",300,700,false],
    ["cafe","Ужин в ресторане",1500,3500,true],
    ["cafe","Бокал вина в кафе",500,1200,true],
    ["health","Визит к частному врачу",1500,3500,true],
    ["health","Йога-ретрит (неделя)",8000,20000,true],
    ["entertainment","Посещение ашрама",0,500,true],
    ["entertainment","Велопрогулка по французскому кварталу",500,1500,true],
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

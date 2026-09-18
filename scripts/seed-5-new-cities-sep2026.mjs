// Восемнадцатая волна: 5 СОВСЕМ НОВЫХ городов, которых не было в каталоге
// (в отличие от предыдущих волн — это не обогащение существующих записей,
// а первое появление городов в БД). Выбор обоснован реальным спросом
// у русскоязычных релокантов и отсутствием дублирования уже покрытых ниш:
//   - shanghai, shenzhen — Китай отсутствовал в каталоге целиком (174 города
//     без единого китайского), хотя торгово-закупочная релокация в Китай —
//     устоявшееся направление с 2022 года (Шэньчжэнь — Хуацянбэй/электроника,
//     Шанхай — финансы/международная торговля);
//   - novi-sad — второй по значимости IT-хаб Сербии после Белграда (который
//     уже есть в каталоге), реальная бюджетная альтернатива столице для той
//     же волны релокации;
//   - san-francisco — топ-направление для IT-специалистов (Bay Area/Кремниевая
//     долина), в каталоге есть NY/LA/Miami, но не было SF;
//   - kyrenia — Северный Кипр, отдельная от уже покрытого признанного Кипра
//     (Лимассол/Ларнака/Пафос/Никосия) юрисдикция с собственным визовым
//     режимом и бумом релокации/недвижимости среди русскоязычных 2023-2025.
//
// Цены — 20 стандартных позиций (см. seed-prices-priority-cities.mjs) в
// рублях, пересчитано из местной валюты по ориентировочному курсу ЦБ РФ на
// сентябрь 2026: 1 CNY ≈ 12.7 ₽ · 1 RSD ≈ 0.85 ₽ · 1 USD ≈ 85 ₽ ·
// 1 TRY ≈ 1.8 ₽ (курсы согласованы с уже использованными в lib/city-routes.ts).
//
// Запуск: node scripts/seed-5-new-cities-sep2026.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const H = os.homedir();
const dot = (n) => fs.readFileSync(path.join(H, ".relocost", n), "utf8").trim();
const sb = createClient(dot("supabase_url"), dot("supabase_service_role_key"), {
  auth: { persistSession: false },
});

const YEAR = 2026;

const CITIES = [
  {
    name_ru: "Шанхай", name_en: "Shanghai", slug: "shanghai",
    country_ru: "Китай", country_en: "China", country_slug: "china", flag_emoji: "🇨🇳",
    population: "24.9 млн", climate: "+17°C ср.", language: "Китайский (путунхуа), английский ограниченно",
    currency: "Юань, CNY", flight_from_moscow: "9,5 часов",
    is_foreign: true, difficulty_score: 4, is_popular: false,
    intro_text: "Финансовая и деловая столица Китая: банки, международная торговля, люкс-ритейл и один из самых загруженных портов мира. Растущее русскоязычное деловое сообщество на фоне торговых связей России и Китая. Виза и ВНЖ требуют официального трудоустройства у китайского работодателя, языковой барьер серьезный.",
    lat: 31.2304, lng: 121.4737,
  },
  {
    name_ru: "Шэньчжэнь", name_en: "Shenzhen", slug: "shenzhen",
    country_ru: "Китай", country_en: "China", country_slug: "china", flag_emoji: "🇨🇳",
    population: "17.6 млн", climate: "+23°C ср.", language: "Китайский (путунхуа), английский ограниченно",
    currency: "Юань, CNY", flight_from_moscow: "11 часов с пересадкой",
    is_foreign: true, difficulty_score: 4, is_popular: false,
    intro_text: "Мировой центр производства электроники: рынок Хуацянбэй и штаб-квартиры Tencent, Huawei, DJI, BYD. Устоявшееся русскоязычное сообщество закупщиков и предпринимателей, работающих на рынок СНГ. Молодой, зеленый и современный по меркам Китая город в 30–60 минутах от границы с Гонконгом.",
    lat: 22.5431, lng: 114.0579,
  },
  {
    name_ru: "Нови-Сад", name_en: "Novi Sad", slug: "novi-sad",
    country_ru: "Сербия", country_en: "Serbia", country_slug: "serbia", flag_emoji: "🇷🇸",
    population: "370 тыс", climate: "+11°C ср.", language: "Сербский (кириллица)",
    currency: "Динар, RSD", flight_from_moscow: "4 часа (через Белград)",
    is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Второй по значимости IT-хаб Сербии после Белграда — Научно-технологический парк, офисы NCR, Endava, Vega IT и сильный технический университет. На 15–25% дешевле Белграда при похожем уровне зарплат в IT. Компактный пешеходный центр и родина фестиваля EXIT в крепости Петроварадин.",
    lat: 45.2671, lng: 19.8335,
  },
  {
    name_ru: "Сан-Франциско", name_en: "San Francisco", slug: "san-francisco",
    country_ru: "США", country_en: "USA", country_slug: "usa", flag_emoji: "🇺🇸",
    population: "0.81 млн", climate: "+14°C ср.", language: "Английский",
    currency: "Доллар США, USD", flight_from_moscow: "16–18 часов с пересадкой",
    is_foreign: true, difficulty_score: 5, is_popular: true,
    intro_text: "Эпицентр мировой технологической индустрии и залива Bay Area — штаб-квартиры Salesforce, Uber, Airbnb, OpenAI и десятков AI-стартапов, Кремниевая долина в 40–60 минутах на юг. Самые высокие зарплаты в IT в мире, но и одна из самых дорогих аренд планеты. Легальная работа требует рабочей визы (H-1B, L-1, O-1) — для россиян процесс усложнился после 2022 года.",
    lat: 37.7749, lng: -122.4194,
  },
  {
    name_ru: "Кирения", name_en: "Kyrenia", slug: "kyrenia",
    country_ru: "Северный Кипр", country_en: "Northern Cyprus", country_slug: "northern-cyprus", flag_emoji: "🇨🇾",
    population: "33 тыс", climate: "+19°C ср.", language: "Турецкий, английский",
    currency: "Турецкая лира, TRY", flight_from_moscow: "5–6 часов с пересадкой в Турции",
    is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Курортный город Северного Кипра — территории, признанной только Турцией, с собственным визовым режимом и рынком недвижимости, ориентированным на иностранных покупателей. Заметно дешевле южного (признанного) Кипра при похожей береговой линии и мягком средиземноморском климате. Банкинг и международные переводы усложнены из-за непризнанного статуса.",
    lat: 35.3414, lng: 33.3152,
  },
];

// 20 стандартных позиций (порядок как в seed-prices-priority-cities.mjs)
const ITEMS = [
  ["rent",          "Комната",                          false],
  ["rent",          "1-комн. квартира в центре",        false],
  ["rent",          "1-комн. квартира на окраине",      false],
  ["rent",          "2-комн. квартира в центре",        false],
  ["rent",          "3-комн. квартира в центре",        false],
  ["food",          "Обед в кафе",                      false],
  ["food",          "Ужин на двоих в ресторане",        false],
  ["food",          "Капучино",                         false],
  ["food",          "Продукты на месяц на 1 человека",  false],
  ["food",          "Бутылка воды (1.5 л)",             false],
  ["transport",     "Месячный проездной",               false],
  ["transport",     "Разовый билет на транспорт",       false],
  ["transport",     "Такси 3 км",                       false],
  ["utilities",     "ЖКХ за 1-комн. квартиру",         false],
  ["utilities",     "Домашний интернет",                false],
  ["utilities",     "Мобильная связь (месяц)",          false],
  ["health",        "Визит к частному врачу",           true],
  ["health",        "Абонемент в фитнес-клуб (мес)",   true],
  ["entertainment", "Билет в кино",                     false],
  ["entertainment", "Коворкинг (день)",                 true],
];

// Цены в РУБЛЯХ (уже пересчитаны из местной валюты, см. комментарий выше)
const PRICES = {
  shanghai: [
    [31800, 57200], [88900, 165100], [50800, 88900], [139700, 241300], [203200, 355600],
    [508, 1016], [3175, 6350], [356, 508], [25400, 40640], [38, 76],
    [1905, 2794], [38, 102], [190, 318],
    [5080, 8890], [1270, 1905], [635, 1524],
    [6350, 15240], [3810, 7620],
    [762, 1143], [1270, 2540],
  ],
  shenzhen: [
    [27940, 50800], [76200, 139700], [44450, 76200], [127000, 215900], [177800, 304800],
    [445, 889], [2794, 5715], [318, 445], [22860, 38100], [38, 64],
    [1905, 2540], [25, 89], [165, 254],
    [4445, 7620], [1143, 1778], [635, 1270],
    [5080, 12700], [3175, 6350],
    [635, 1016], [1016, 2286],
  ],
  "novi-sad": [
    [18700, 34000], [42500, 72250], [29750, 51000], [63750, 106250], [85000, 144500],
    [680, 1275], [2720, 5525], [170, 340], [25500, 46750], [60, 110],
    [2125, 2975], [76, 110], [255, 510],
    [5950, 12750], [1530, 3230], [765, 1870],
    [3400, 10200], [2975, 7650],
    [425, 850], [1020, 2380],
  ],
  "san-francisco": [
    [102000, 187000], [238000, 357000], [187000, 272000], [357000, 527000], [510000, 765000],
    [1530, 2550], [8500, 17000], [467, 637], [42500, 63750], [212, 340],
    [6885, 9180], [212, 297], [1020, 1700],
    [8500, 15300], [5100, 7650], [3400, 6800],
    [12750, 29750], [5100, 11050],
    [1275, 1700], [2550, 5100],
  ],
  kyrenia: [
    [18000, 32400], [45000, 86400], [28800, 54000], [68400, 126000], [99000, 180000],
    [360, 810], [2340, 5760], [162, 324], [16200, 28800], [9, 22],
    [1620, 2340], [45, 81], [234, 468],
    [3960, 9000], [990, 2340], [576, 1350],
    [3060, 9000], [3060, 8100],
    [576, 1170], [900, 2700],
  ],
};

async function run() {
  console.log(`Seed 5 новых городов (18-я волна) стартует... (${new Date().toLocaleString("ru")})\n`);
  let addedCities = 0, addedPrices = 0;

  for (const c of CITIES) {
    const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
    if (existing) {
      console.log(`  SKIP (уже есть в cities): ${c.slug}`);
      continue;
    }

    const seo_title = `Стоимость жизни в ${c.name_ru} в ${YEAR} году — калькулятор | Relocost`;
    const seo_description = `Сколько стоит жить в ${c.name_ru}? Аренда, еда, транспорт — реальный бюджет на месяц. Калькулятор, цены, визы, отзывы.`;

    const row = {
      name_ru: c.name_ru, name_en: c.name_en, slug: c.slug,
      country_ru: c.country_ru, country_en: c.country_en, country_slug: c.country_slug,
      flag_emoji: c.flag_emoji, population: c.population, climate: c.climate,
      language: c.language, currency: c.currency, flight_from_moscow: c.flight_from_moscow,
      is_foreign: c.is_foreign, difficulty_score: c.difficulty_score, is_popular: c.is_popular,
      seo_title, seo_description, intro_text: c.intro_text, lat: c.lat, lng: c.lng,
    };

    const { data: inserted, error: cityErr } = await sb
      .from("cities").insert(row).select("id").single();
    if (cityErr) { console.error(`  ОШИБКА города ${c.slug}: ${cityErr.message}`); continue; }

    const cityId = inserted.id;
    console.log(`[+] ${c.name_ru} (${c.slug}) -> ${cityId}`);
    addedCities++;

    const priceRows = ITEMS.map(([category, item_name_ru, is_premium], i) => {
      const [price_min, price_max] = PRICES[c.slug][i];
      return { city_id: cityId, category, item_name_ru, price_min, price_max, is_premium };
    });

    const { error: pErr } = await sb.from("prices").insert(priceRows);
    if (pErr) { console.error(`  ОШИБКА цен ${c.slug}: ${pErr.message}`); }
    else { console.log(`  цены: ${priceRows.length} записей`); addedPrices += priceRows.length; }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Городов добавлено: ${addedCities}/5`);
  console.log(`Записей цен добавлено: ${addedPrices}`);
  console.log("=".repeat(50));
}

run().catch((e) => {
  console.error("КРИТИЧЕСКАЯ ОШИБКА:", e.message);
  process.exit(1);
});

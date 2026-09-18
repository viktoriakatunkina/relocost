// Девятнадцатая волна: 5 СОВСЕМ НОВЫХ городов, которых нет в каталоге (179
// городов на момент запуска, первая волна — Шанхай/Шэньчжэнь/Нови-Сад/
// Сан-Франциско/Кирения — уже задеплоена). Как и в 18-й волне, это первое
// появление городов в БД, не обогащение существующих записей. Выбор:
//   - ras-al-khaimah — растущая бюджетная альтернатива Дубаю в ОАЭ: тот же
//     безвиз/нулевой налог, но аренда на 30-40% дешевле, свободная зона
//     RAKEZ/RAK ICC — один из самых доступных путей к резидентской визе
//     в ОАЭ, бум недвижимости на острове Аль-Марджан 2023-2025;
//   - kotor — Черногория уже представлена Будвой/Тиватом/Херцег-Нови/
//     Подгорицей, но не главной исторической бухтой ЮНЕСКО — Котор был
//     одним из самых обсуждаемых "визовых" направлений у россиян в 2022-2023
//     (ВНЖ через недвижимость), отдельная ниша от курортной Будвы;
//   - busan — второй по величине город Южной Кореи (в каталоге только
//     Сеул): дешевле столицы, приморский, растущий IT/game dev кластер
//     Centum City, паромное сообщение с Фукуокой;
//   - fukuoka — Япония представлена только Токио/Осакой; Фукуока —
//     официальный "стартап-город" с упрощенной Fukuoka Startup Visa,
//     реальная точка входа для предпринимателей-иностранцев, которой нет
//     ни в одном другом японском городе каталога;
//   - palma-de-mallorca — Испания хорошо покрыта (Барселона/Мадрид/
//     Аликанте/Валенсия/Малага/Севилья/Тенерифе), но остров Майорка —
//     отдельный премиальный рынок недвижимости, десятилетиями популярный
//     у состоятельных русскоязычных покупателей, не дублирует бюджетные
//     материковые/канарские направления.
//
// Ни один из 5 городов не имеет спорного политического статуса (в отличие
// от Кирении/Северного Кипра в 18-й волне) — флаги совпадают с уже
// использованными флагами тех же стран (UAE/Черногория/Ю.Корея/Япония/
// Испания), риска визуальной путаницы с другой юрисдикцией нет.
//
// Цены — 20 стандартных позиций (см. seed-prices-priority-cities.mjs) в
// рублях, пересчитано из местной валюты по ориентировочному курсу ЦБ РФ на
// сентябрь 2026 (согласовано с lib/currency.ts и предыдущими волнами):
// 1 AED ≈ 23.6 ₽ · 1 EUR ≈ 97.3 ₽ · 1000 KRW ≈ 64 ₽ · 1 JPY ≈ 0.56 ₽.
//
// Запуск: node scripts/seed-5-new-cities-wave2-sep2026.mjs
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
    name_ru: "Рас-эль-Хайма", name_en: "Ras Al Khaimah", slug: "ras-al-khaimah",
    country_ru: "ОАЭ", country_en: "UAE", country_slug: "uae", flag_emoji: "🇦🇪",
    population: "345 тыс", climate: "+27°C ср.", language: "Арабский, английский",
    currency: "Дирхам, AED", flight_from_moscow: "5 часов (есть прямые рейсы)",
    is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Северный эмират ОАЭ с курортным островом Аль-Марджан, горами Джебель-Джайс и одним из самых доступных путей к резидентской визе через недвижимость или свободную зону RAKEZ. Заметно дешевле Дубая при похожем климате и нулевом подоходном налоге, но с меньшим рынком труда и англоязычной средой — час на машине до дубайского аэропорта и сервисов компенсирует локальную тишину.",
    lat: 25.7895, lng: 55.9432,
  },
  {
    name_ru: "Котор", name_en: "Kotor", slug: "kotor",
    country_ru: "Черногория", country_en: "Montenegro", country_slug: "montenegro", flag_emoji: "🇲🇪",
    population: "13 тыс", climate: "+17°C ср.", language: "Черногорский, сербский",
    currency: "Евро, EUR", flight_from_moscow: "4 часа (через Белград, ближайший аэропорт — Тиват)",
    is_foreign: true, difficulty_score: 2, is_popular: true,
    intro_text: "Историческая бухта Черногории, объект ЮНЕСКО с венецианской крепостью прямо у самой южной фьордоподобной бухты Европы. Тот же простой путь к ВНЖ через недвижимость, что и в Будве с Тиватом, при меньшей туристической плотности летом и более выраженной сезонности зимой. Слабый локальный рынок труда компенсируется удаленкой и близостью к аэропорту Тивата.",
    lat: 42.4247, lng: 18.7712,
  },
  {
    name_ru: "Пусан", name_en: "Busan", slug: "busan",
    country_ru: "Южная Корея", country_en: "South Korea", country_slug: "south-korea", flag_emoji: "🇰🇷",
    population: "3.3 млн", climate: "+15°C ср.", language: "Корейский, английский",
    currency: "Вона, KRW", flight_from_moscow: "10 часов с пересадкой (через Сеул/Стамбул)",
    is_foreign: true, difficulty_score: 3, is_popular: false,
    intro_text: "Второй по величине город Южной Кореи и крупнейший порт страны — приморский мегаполис с пляжами в черте города, растущим IT/game dev кластером Centum City и Пусанским кинофестивалем. Заметно дешевле Сеула по аренде при похожем безвизовом режиме (K-ETA), но с меньшим рынком труда для некорееговорящих специалистов и совсем небольшим русскоязычным сообществом.",
    lat: 35.1796, lng: 129.0756,
  },
  {
    name_ru: "Фукуока", name_en: "Fukuoka", slug: "fukuoka",
    country_ru: "Япония", country_en: "Japan", country_slug: "japan", flag_emoji: "🇯🇵",
    population: "1.65 млн", climate: "+17°C ср.", language: "Японский",
    currency: "Иена, JPY", flight_from_moscow: "10 часов с пересадкой (через Сеул/Стамбул)",
    is_foreign: true, difficulty_score: 4, is_popular: false,
    intro_text: "Компактный и официально признанный «стартап-город» Японии на острове Кюсю — с упрощенной Fukuoka Startup Visa, паромным сообщением с Пусаном и заметно более низкими ценами, чем в Токио или Осаке. Языковой барьер и узкий рынок труда для некорееговорящих и неяпоноговорящих специалистов остаются серьезным вызовом, а русскоязычное сообщество почти отсутствует.",
    lat: 33.5904, lng: 130.4017,
  },
  {
    name_ru: "Пальма-де-Майорка", name_en: "Palma de Mallorca", slug: "palma-de-mallorca",
    country_ru: "Испания", country_en: "Spain", country_slug: "spain", flag_emoji: "🇪🇸",
    population: "416 тыс", climate: "+18°C ср.", language: "Испанский, каталанский, английский",
    currency: "Евро, EUR", flight_from_moscow: "6 часов (нет прямых, через Стамбул/Белград)",
    is_foreign: true, difficulty_score: 3, is_popular: true,
    intro_text: "Столица Балеарских островов и один из самых узнаваемых премиальных рынков недвижимости Европы — готический собор Ла-Сеу, горы Серра-де-Трамунтана и устоявшееся сообщество состоятельных релокантов. Испанская национальная виза требует подтвержденного дохода и нескольких месяцев ожидания, а цены на жилье — один из самых высоких показателей в Испании.",
    lat: 39.5696, lng: 2.6502,
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
  "ras-al-khaimah": [
    [35000, 59000], [83000, 142000], [59000, 94000], [130000, 212000], [189000, 307000],
    [830, 1420], [3540, 7080], [350, 520], [21200, 35400], [35, 71],
    [7080, 8260], [71, 118], [350, 590],
    [9440, 16500], [5900, 8260], [2360, 4720],
    [4720, 9440], [4720, 9440],
    [830, 1180], [1890, 3540],
  ],
  kotor: [
    [24300, 38900], [48600, 87600], [34000, 58400], [68100, 116800], [97300, 165400],
    [780, 1360], [3400, 5840], [175, 272], [24300, 37000], [58, 97],
    [2920, 3890], [146, 195], [487, 778],
    [5840, 10700], [1946, 2920], [1168, 1946],
    [2920, 5840], [2920, 4865],
    [487, 681], [973, 1460],
  ],
  busan: [
    [22400, 35200], [44800, 76800], [32000, 51200], [70400, 115200], [102400, 166400],
    [512, 832], [2560, 4480], [288, 384], [22400, 32000], [64, 102],
    [3840, 4480], [90, 102], [320, 448],
    [7680, 12800], [1600, 2240], [2240, 3520],
    [1920, 3840], [3840, 6400],
    [768, 960], [960, 1600],
  ],
  fukuoka: [
    [22400, 33600], [42000, 61600], [30800, 44800], [61600, 95200], [89600, 140000],
    [448, 672], [2240, 3920], [252, 336], [19600, 28000], [56, 84],
    [4480, 5600], [118, 146], [560, 728],
    [6720, 10080], [2240, 3080], [1680, 2800],
    [1680, 3360], [3920, 6160],
    [1064, 1120], [1120, 1960],
  ],
  "palma-de-mallorca": [
    [48600, 73000], [97300, 146000], [73000, 107000], [136200, 214000], [194600, 311400],
    [1265, 1750], [4865, 8760], [243, 341], [29200, 43800], [78, 117],
    [3890, 4380], [195, 243], [778, 1168],
    [9730, 15570], [3400, 4380], [1460, 2430],
    [5840, 9730], [3890, 5840],
    [778, 973], [1460, 2430],
  ],
};

async function run() {
  console.log(`Seed 5 новых городов (19-я волна) стартует... (${new Date().toLocaleString("ru")})\n`);
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

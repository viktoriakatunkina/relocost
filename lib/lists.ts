import { getCitiesWithBudget } from "./city-budget";
import { climateTemp, COASTAL } from "./city-signals";
import type { CityWithBudget } from "./types";

// SEO-подборки городов («Города до 50 000 ₽», «Куда уехать на зимовку» и т.п.).
// Каждая — индексируемый лендинг /list/[slug] с уникальным текстом, списком
// городов из реальных данных (бюджет/сложность/климат) и ItemList-разметкой.
// Закрывают высокочастотные информационные интенты и раздают вес страницам городов.

export type Tip = {
  icon: string;
  title: string;
  text: string;
};

export type ListDef = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  // Slugs городов для статичного fallback когда DB недоступна (Supabase 402 egress).
  fallbackSlugs: string[];
  // Советы-подсказки — отображаются между заголовком и сеткой городов.
  tips: Tip[];
  // Отбор и сортировка городов из общего списка с бюджетом.
  select: (cities: CityWithBudget[]) => CityWithBudget[];
};

const hasBudget = (c: CityWithBudget) => c.monthly_from > 0;
const byBudget = (a: CityWithBudget, b: CityWithBudget) =>
  a.monthly_from - b.monthly_from;

export const LISTS: ListDef[] = [
  {
    slug: "samye-deshevye",
    eyebrow: "Рейтинг",
    title: "Самые доступные города для жизни в 2026 году",
    intro:
      "Города с самым низким бюджетом на месяц: аренда однокомнатной на окраине, продукты, проездной и коммуналка с интернетом и связью. Суммы ориентировочные, по курсу начала 2026 года — отсортированы от самых дешевых.",
    seoTitle: "Самые дешевые города для жизни в 2026 — рейтинг по бюджету | Relocost",
    seoDescription:
      "Рейтинг самых доступных городов для переезда: реальный бюджет на месяц — аренда, еда, транспорт и ЖКХ. Где жить дешевле всего в 2026 году.",
    fallbackSlugs: [
      "bishkek", "tashkent", "dushanbe", "chisinau", "tbilisi", "batumi",
      "kutaisi", "yerevan", "almaty", "samarkand", "bukhara", "podgorica",
      "tirana", "skopje",
    ],
    tips: [
      {
        icon: "💡",
        title: "Что включено в бюджет",
        text: "Аренда 1-ком на окраине + базовые продукты + проездной + ЖКХ, интернет и мобильная связь.",
      },
      {
        icon: "⚠️",
        title: "Скрытые расходы",
        text: "Прибавьте 15–20% на страховку, телефон, кафе и развлечения — в сумму они не входят.",
      },
      {
        icon: "🏦",
        title: "Банк и карты",
        text: "Запасной счет в иностранном банке обязателен — российские карты работают не везде.",
      },
      {
        icon: "🔄",
        title: "Актуальность",
        text: "Цены пересматриваем ежеквартально по открытым источникам и отзывам переехавших.",
      },
    ],
    select: (cities) => cities.filter(hasBudget).sort(byBudget).slice(0, 30),
  },
  {
    slug: "do-50000-rubley",
    eyebrow: "Подборка",
    title: "Города, где можно жить на 50 000 ₽ в месяц",
    intro:
      "Направления, где базовый бюджет на одного человека укладывается примерно в 50 000 ₽ в месяц: аренда на окраине, продукты, транспорт и коммуналка. Ориентировочно, по курсу начала 2026 года.",
    seoTitle: "Куда переехать на 50 000 ₽ в месяц — города по бюджету 2026 | Relocost",
    seoDescription:
      "Города, где реально жить на 50 000 рублей в месяц: аренда, еда, транспорт и ЖКХ. Подборка доступных направлений для переезда в 2026 году.",
    fallbackSlugs: [
      "tbilisi", "batumi", "kutaisi", "yerevan", "bishkek", "tashkent",
      "antalya", "bodrum", "fethiye", "chiang-mai", "pattaya", "phu-quoc",
    ],
    tips: [
      {
        icon: "💡",
        title: "Реальный бюджет",
        text: "50 000 ₽ — базовый минимум. Комфортный уровень с кафе и досугом — 65–80 тыс. ₽.",
      },
      {
        icon: "🏠",
        title: "Аренда",
        text: "В бюджете учтена квартира на окраине. Центр или новостройка обойдутся на 20–40% дороже.",
      },
      {
        icon: "💱",
        title: "Курс рубля",
        text: "Бюджеты рассчитаны по курсу начала 2026 года. Колебания курса меняют стоимость жизни.",
      },
      {
        icon: "🔍",
        title: "Как найти жилье",
        text: "Telegram-группы эмигрантов и Facebook Marketplace дают цены ниже туристических агрегаторов.",
      },
    ],
    select: (cities) =>
      cities.filter((c) => hasBudget(c) && c.monthly_from <= 50000).sort(byBudget),
  },
  {
    slug: "prostoy-pereezd",
    eyebrow: "Подборка",
    title: "Куда проще всего переехать россиянину",
    intro:
      "Зарубежные направления с самой низкой сложностью переезда: простой въезд, понятная легализация, рабочие банки и русскоязычная среда. Отсортированы от самых простых, затем по бюджету.",
    seoTitle: "Куда проще всего переехать из России в 2026 — простые страны | Relocost",
    seoDescription:
      "Города с самым простым переездом для россиян: безвиз или легкая виза, банки, ВНЖ и русскоязычное сообщество. Подборка на 2026 год.",
    fallbackSlugs: [
      "tbilisi", "batumi", "yerevan", "almaty", "bishkek", "tashkent",
      "podgorica", "tivat", "budva", "minsk", "baku", "chisinau",
      "kutaisi", "dushanbe",
    ],
    tips: [
      {
        icon: "📋",
        title: "Документы",
        text: "Загранпаспорт + нотариальные копии — минимальный набор. Для ВНЖ часто нужен апостиль на диплом.",
      },
      {
        icon: "🏦",
        title: "Банк с первого дня",
        text: "Грузия, Армения, Казахстан — счет открывают россиянам без дополнительных документов.",
      },
      {
        icon: "🗣️",
        title: "Русскоязычная среда",
        text: "В Тбилиси, Ереване и Алматы большие русскоязычные сообщества — легче адаптироваться.",
      },
      {
        icon: "⏱️",
        title: "Сроки ВНЖ",
        text: "Самые быстрые ВНЖ — Грузия (1 год без документов), Черногория (через аренду), Армения (через регистрацию).",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => c.is_foreign && (c.difficulty_score ?? 5) <= 2)
        .sort(
          (a, b) =>
            (a.difficulty_score ?? 5) - (b.difficulty_score ?? 5) ||
            byBudget(a, b),
        )
        .slice(0, 30),
  },
  {
    slug: "dlya-zimovki",
    eyebrow: "Подборка",
    title: "Куда уехать на зимовку: теплые и недорогие города",
    intro:
      "Направления с теплой зимой (средняя температура от +22°C) и невысоким бюджетом — для тех, кто хочет переждать холода у моря или в тропиках. Отсортированы по стоимости жизни.",
    seoTitle: "Куда уехать на зимовку в 2026 — теплые недорогие города | Relocost",
    seoDescription:
      "Лучшие направления для зимовки: тепло круглый год и доступные цены. Подборка теплых городов для долгой зимовки россиян в 2026 году.",
    fallbackSlugs: [
      "phuket", "bali", "bangkok", "dubai", "antalya", "goa",
      "nha-trang", "samui", "pattaya", "colombo", "da-nang",
      "hurghada", "sharm-el-sheikh", "sanya",
    ],
    tips: [
      {
        icon: "🌡️",
        title: "Климат",
        text: "Ищите среднюю температуру от +22°C в январе — иначе «теплая зимовка» обманет.",
      },
      {
        icon: "💵",
        title: "Сезонность",
        text: "На пике сезона аренда выше на 30–50%. Бронируйте заранее или выбирайте несезон.",
      },
      {
        icon: "🦟",
        title: "Здоровье",
        text: "В тропиках нужна страховка с эвакуацией — от 8 000 ₽/мес на человека.",
      },
      {
        icon: "🏖️",
        title: "Море и интернет",
        text: "Море + хороший интернет — не всегда вместе. Проверяйте скорость до бронирования жилья.",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => {
          const t = climateTemp(c);
          return c.is_foreign && t !== null && t >= 22;
        })
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "dlya-udalenki",
    eyebrow: "Подборка",
    title: "Лучшие города для удаленной работы в 2026 году",
    intro:
      "Направления, удобные для удаленщиков: несложный переезд, доступный быт и комфортный климат. Подобраны по сочетанию низкой сложности переезда и адекватного бюджета.",
    seoTitle: "Лучшие города для удаленной работы 2026 — для релокантов | Relocost",
    seoDescription:
      "Где удобно жить и работать удаленно: простой переезд, недорогой быт, интернет и сообщество. Подборка городов для цифровых кочевников в 2026.",
    fallbackSlugs: [
      "tbilisi", "batumi", "chiang-mai", "bali", "phuket", "bangkok",
      "antalya", "prague", "kutaisi", "almaty", "da-nang", "budva",
      "tivat", "podgorica",
    ],
    tips: [
      {
        icon: "🌐",
        title: "Интернет",
        text: "Минимум 25 Мбит/с для комфортной работы — проверяйте speedtest отзывы до аренды.",
      },
      {
        icon: "💰",
        title: "Бюджет",
        text: "Типичный удаленщик тратит 60–120 тыс. ₽/мес на жизнь за рубежом с нормальным жильем.",
      },
      {
        icon: "🏠",
        title: "Жилье",
        text: "Telegram-группы и Facebook Marketplace — дешевле туристических агрегаторов на 20–40%.",
      },
      {
        icon: "✈️",
        title: "Виза",
        text: "Цифровая виза или ВНЖ самозанятого — уточните условия до выезда, требования меняются.",
      },
    ],
    select: (cities) =>
      cities
        .filter(
          (c) => c.is_foreign && (c.difficulty_score ?? 5) <= 3 && hasBudget(c),
        )
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "u-morya",
    eyebrow: "Подборка",
    title: "Города у моря для переезда и жизни",
    intro:
      "Приморские направления — от Адриатики и Средиземноморья до Юго-Восточной Азии и Залива. Отсортированы по стоимости жизни, чтобы было проще выбрать море по бюджету.",
    seoTitle: "Города у моря для переезда в 2026 — жизнь у океана по бюджету | Relocost",
    seoDescription:
      "Лучшие приморские города для переезда: жизнь у моря с реальными ценами на аренду и быт. Подборка направлений у воды на 2026 год.",
    fallbackSlugs: [
      "antalya", "phuket", "bali", "dubrovnik", "split", "budva",
      "batumi", "barcelona", "alicante", "malaga", "da-nang", "goa",
      "larnaca", "limassol",
    ],
    tips: [
      {
        icon: "🏊",
        title: "Сезон",
        text: "Уточните сезон дождей: в Таиланде лучшее время ноябрь–апрель, в Испании — май–октябрь.",
      },
      {
        icon: "🌊",
        title: "Тип моря",
        text: "Средиземное, Карибское, Тихий или Индийский океан — волны и качество воды отличаются.",
      },
      {
        icon: "🐟",
        title: "Стоимость",
        text: "Приморские города дороже inland на 20–40% при тех же удобствах — закладывайте запас.",
      },
      {
        icon: "🚤",
        title: "Транспорт",
        text: "На островах (Пхукет, Самуи, Бали) без скутера или такси неудобно — авто не всегда нужно.",
      },
    ],
    select: (cities) =>
      cities.filter((c) => COASTAL.has(c.slug)).sort(byBudget),
  },
  {
    slug: "do-80000-rubley",
    eyebrow: "Подборка",
    title: "Куда переехать с бюджетом до 80 000 рублей в месяц",
    intro:
      "Города, где реально жить на 80 000 рублей в месяц: Азия, Кавказ и Балканы предлагают комфортный уровень жизни за меньшие деньги, чем большинство российских мегаполисов. Отсортированы от дешевых к дорогим.",
    seoTitle: "Куда переехать с бюджетом 80 000 рублей — города для жизни | Relocost",
    seoDescription:
      "Города, где можно жить на 80 000 рублей в месяц: реальные бюджеты, аренда и еда. Сравните стоимость жизни и выберите направление для переезда.",
    fallbackSlugs: [
      "tashkent", "bishkek", "dushanbe", "chisinau", "tbilisi", "batumi",
      "kutaisi", "yerevan", "almaty", "samarkand", "podgorica", "tirana",
      "skopje", "minsk", "belgrade", "chiangmai", "da-nang", "nha-trang",
    ],
    tips: [
      {
        icon: "💡",
        title: "Что входит в 80 000 ₽",
        text: "Аренда однушки, продукты, транспорт, кафе и небольшой запас — в большинстве городов этого хватает с запасом.",
      },
      {
        icon: "🏦",
        title: "Курс валюты",
        text: "При нестабильном курсе выгоднее страны, где расходы в рублях — Беларусь, Казахстан, Армения.",
      },
      {
        icon: "🏠",
        title: "Экономия на жилье",
        text: "В Тбилиси, Ереване и Алматы однушка стоит 20–35 тыс. ₽/мес — это основной рычаг экономии.",
      },
      {
        icon: "🛒",
        title: "Рынки vs маркеты",
        text: "Местные рынки дешевле супермаркетов на 40–60% — особенно в Средней Азии и Закавказье.",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => c.is_foreign && hasBudget(c) && c.monthly_from <= 80000)
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "dlya-ayti",
    eyebrow: "Подборка",
    title: "Лучшие города для айтишников: переезд без боли",
    intro:
      "Города с простым переездом, развитой инфраструктурой и разумным бюджетом — именно такие выбирают IT-специалисты после 2022 года. Коворкинги, стабильный интернет и сообщество найдете в каждом.",
    seoTitle: "Куда переехать айтишнику из России: топ городов 2026 | Relocost",
    seoDescription:
      "Лучшие города для IT-специалистов из России: простой переезд, хороший интернет, коворкинги и русскоязычное сообщество. Реальные бюджеты 2026.",
    fallbackSlugs: [
      "tbilisi", "yerevan", "belgrade", "almaty", "chiang-mai", "phuket",
      "bali", "tivat", "budva", "prague", "limassol", "budapest",
      "warsaw", "riga", "vilnius",
    ],
    tips: [
      {
        icon: "🌐",
        title: "Интернет",
        text: "Минимум 50 Мбит/с для видеозвонков и VPN — проверяйте Speedtest отзывы до аренды.",
      },
      {
        icon: "🏢",
        title: "Коворкинг",
        text: "Средняя цена в Тбилиси, Ереване — 150–300 $/мес. Пхукет и Бали дороже, но инфраструктура лучше.",
      },
      {
        icon: "💳",
        title: "Банк и карты",
        text: "Открыть счет легче всего в Грузии и Армении — 1–2 дня без лишних документов.",
      },
      {
        icon: "🛂",
        title: "Налоги",
        text: "Грузия — 1% для ИП на обороте до $500к, Сербия — 9% НДФЛ, Армения — 20% НДФЛ.",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => c.is_foreign && (c.difficulty_score ?? 5) <= 3 && hasBudget(c))
        .sort((a, b) => (a.difficulty_score ?? 5) - (b.difficulty_score ?? 5) || byBudget(a, b))
        .slice(0, 30),
  },
  {
    slug: "s-detmi",
    eyebrow: "Подборка",
    title: "Куда переехать с детьми из России",
    intro:
      "Направления, где хорошая инфраструктура для семей: международные и русскоязычные школы, детские больницы, безопасные районы и активные сообщества родителей. Приоритет — безопасность и доступная медицина.",
    seoTitle: "Куда переехать с детьми из России — лучшие города 2026 | Relocost",
    seoDescription:
      "Лучшие города для переезда с детьми: школы, медицина, безопасность и стоимость жизни. Реальный бюджет семьи за рубежом в 2026 году.",
    fallbackSlugs: [
      "tbilisi", "yerevan", "limassol", "belgrade", "almaty",
      "tivat", "budva", "podgorica", "prague", "dubai",
      "phuket", "bali", "antalya", "budapest", "warsaw",
    ],
    tips: [
      {
        icon: "🏫",
        title: "Школы",
        text: "Русскоязычные школы есть в Тбилиси, Ереване, Белграде, Лимасоле, Дубае и Алматы. В Таиланде — международные с полным пансионом.",
      },
      {
        icon: "🏥",
        title: "Медицина",
        text: "Педиатрия лучше всего развита в Израиле, ОАЭ и Кипре. В Армении и Грузии — базовая, но доступная.",
      },
      {
        icon: "💰",
        title: "Бюджет семьи",
        text: "На семью 2+1 в Тбилиси нужно 120–180 тыс. ₽/мес, в Лимасоле — 250–400 тыс. ₽/мес.",
      },
      {
        icon: "🤝",
        title: "Сообщество",
        text: "Большие сообщества родителей-экспатов в Telegram — найдите группу своего города до переезда.",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => c.is_foreign && hasBudget(c))
        .sort(byBudget)
        .slice(0, 25),
  },
  {
    slug: "bezvizovye",
    eyebrow: "Подборка",
    title: "Безвизовые страны для россиян: куда можно переехать прямо сейчас",
    intro:
      "Страны, куда россияне могут въехать без визы или по прилету. Один шаг — купить билет и лететь. Отлично подходят для первого этапа: осмотреться, открыть счет, найти жилье.",
    seoTitle: "Безвизовые страны для россиян 2026 — переезд без визы | Relocost",
    seoDescription:
      "Полный список безвизовых стран для россиян в 2026 году с реальными ценами на жизнь. Куда можно уехать без визы и сколько это стоит.",
    fallbackSlugs: [
      "tbilisi", "batumi", "yerevan", "almaty", "bishkek", "tashkent",
      "dushanbe", "minsk", "baku", "podgorica", "belgrade", "bangkok",
      "phuket", "pattaya", "da-nang", "dubai", "istanbul",
    ],
    tips: [
      {
        icon: "⏱️",
        title: "Срок пребывания",
        text: "Без визы: Грузия — 365 дней, Армения — 180 дней, Казахстан — 90 дней, Таиланд — 60 дней.",
      },
      {
        icon: "🔄",
        title: "Виза-ран",
        text: "В Таиланде и Вьетнаме популярен «визаран» — выезд-въезд для продления. Не злоупотребляйте: могут отказать.",
      },
      {
        icon: "📋",
        title: "Легализация",
        text: "Безвиз — только начало. Для долгосрочного проживания нужен ВНЖ или статус резидента.",
      },
      {
        icon: "✈️",
        title: "Прямые рейсы",
        text: "Из Москвы летят прямые рейсы в Тбилиси, Ереван, Баку, Стамбул, Дубай, Бангкок, Ташкент.",
      },
    ],
    select: (cities) => {
      const VISA_FREE: Set<string> = new Set([
        "georgia", "armenia", "kazakhstan", "kyrgyzstan", "uzbekistan",
        "tajikistan", "azerbaijan", "moldova", "belarus",
        "serbia", "montenegro", "turkey", "thailand", "vietnam",
        "indonesia", "malaysia", "uae", "morocco",
      ]);
      return cities
        .filter((c) => c.is_foreign && VISA_FREE.has(c.country_slug))
        .sort(byBudget)
        .slice(0, 30);
    },
  },
  {
    slug: "teplye-strany",
    eyebrow: "Подборка",
    title: "Теплые страны для переезда из России",
    intro:
      "Направления с теплым климатом круглый год — Азия, Средиземноморье, Ближний Восток. Тепло, море или горы, низкая стоимость жизни — лучший ответ на суровую российскую зиму.",
    seoTitle: "Теплые страны для переезда из России — жить в тепле | Relocost",
    seoDescription:
      "Лучшие теплые страны для переезда из России: реальные цены, климат, визы. Где тепло круглый год и можно жить комфортно.",
    fallbackSlugs: [
      "phuket", "bali", "bangkok", "dubai", "antalya", "alanya",
      "goa", "nha-trang", "pattaya", "tbilisi", "batumi",
      "limassol", "hurghada", "sanya", "colombo",
    ],
    tips: [
      {
        icon: "🌡️",
        title: "Климат",
        text: "Южная Азия — жарко круглый год. Средиземноморье — мягкая зима +10–15°C. Кавказ — летом жарко, зима прохладная.",
      },
      {
        icon: "🦟",
        title: "Тропики",
        text: "В Азии нужна страховка с тропическими болезнями и прививки: тиф, гепатит А, бешенство.",
      },
      {
        icon: "💧",
        title: "Сезон дождей",
        text: "Таиланд: май–октябрь — дожди. Гоа: июнь–сентябрь — муссон. Бали: октябрь–март — дожди.",
      },
      {
        icon: "💸",
        title: "Цены по сезону",
        text: "В пик-сезон (ноябрь–апрель в Азии) жилье дорожает на 30–50%. Бронируйте заранее.",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => {
          const t = climateTemp(c);
          return c.is_foreign && t !== null && t >= 20;
        })
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "evropa",
    eyebrow: "Подборка",
    title: "Переезд в Европу: города, доступные россиянам в 2026 году",
    intro:
      "Европейские направления, куда россияне могут переехать: Балканы без ЕС — проще, страны ЕС — требуют визы, но возможности шире. Реальные бюджеты и пути легализации для каждого города.",
    seoTitle: "Переезд в Европу для россиян 2026 — доступные города | Relocost",
    seoDescription:
      "Европейские города для переезда из России: цены, визы, ВНЖ. Балканы, Прибалтика, Кипр, Португалия, Испания — реальные бюджеты 2026.",
    fallbackSlugs: [
      "belgrade", "podgorica", "tivat", "budva", "kotor", "tirana",
      "skopje", "limassol", "prague", "riga", "vilnius", "warsaw",
      "lisbon", "porto", "barcelona", "madrid",
    ],
    tips: [
      {
        icon: "🗺️",
        title: "Балканы без ЕС",
        text: "Сербия, Черногория — безвизовые 30 дней, простой ВНЖ. Лучший старт для тех, кто хочет в Европу.",
      },
      {
        icon: "🇪🇺",
        title: "Страны ЕС",
        text: "Кипр, Португалия, Испания, Чехия — нужна виза D, но после ВНЖ открывается весь Шенген.",
      },
      {
        icon: "📋",
        title: "ВНЖ в Европе",
        text: "Самые доступные пути: digital nomad visa (Португалия, Испания), пассивный доход, работа по контракту.",
      },
      {
        icon: "💰",
        title: "Стоимость",
        text: "Балканы — €500–1000/мес на одного. Западная Европа — €1500–3000/мес. Разница в 3 раза.",
      },
    ],
    select: (cities) => {
      const EUROPE: Set<string> = new Set([
        "serbia", "montenegro", "albania", "north-macedonia",
        "cyprus", "portugal", "spain", "greece", "italy",
        "croatia", "czech-republic", "poland", "latvia", "lithuania",
        "hungary", "romania", "bulgaria", "moldova",
      ]);
      return cities
        .filter((c) => c.is_foreign && EUROPE.has(c.country_slug))
        .sort(byBudget)
        .slice(0, 30);
    },
  },
  {
    slug: "razvedka-pered-pereezdom",
    eyebrow: "Подборка",
    title: "Города, куда стоит съездить на разведку перед переездом",
    intro:
      "Направления, куда логично слетать на 3–7 дней перед полным переездом — проверить район, интернет, банк и «свое ли» это место. Отбор — по популярности среди переехавших и несложной логистике из России. Отсортированы по примерному бюджету короткой поездки.",
    seoTitle: "Куда съездить на разведку перед переездом в 2026 — города | Relocost",
    seoDescription:
      "Подборка городов для ознакомительной поездки перед переездом: логистика из России, что проверить на месте, примерный бюджет разведки на 3–7 дней.",
    fallbackSlugs: [
      "tbilisi", "batumi", "kutaisi", "yerevan", "almaty", "bishkek",
      "tashkent", "baku", "antalya", "istanbul", "belgrade", "podgorica",
      "budva", "tivat", "limassol", "larnaca", "dubai", "bali",
      "phuket", "bangkok", "chiang-mai", "dushanbe",
    ],
    tips: [
      {
        icon: "🗓️",
        title: "Сколько дней",
        text: "Минимум 3 дня для соседних направлений (Кавказ, Средняя Азия), 5–7 дней — если лететь далеко (Азия, Залив).",
      },
      {
        icon: "🏘️",
        title: "Живите не в отеле",
        text: "Снимите квартиру на Airbnb или Booking в спальном районе, а не в туристическом центре — иначе увидите не тот город, где будете жить.",
      },
      {
        icon: "🏦",
        title: "Возьмите документы",
        text: "На разведке уже можно открыть счет в местном банке — берите загранпаспорт и, если есть, ИНН и подтверждение дохода.",
      },
      {
        icon: "📋",
        title: "Прогоните чек-лист",
        text: "Интернет, аптека рядом, дорога до условной «работы», рынок и супермаркет — то, что не видно на фото из объявлений об аренде.",
      },
    ],
    select: (cities) => {
      const RECON: Set<string> = new Set([
        "tbilisi", "batumi", "kutaisi", "yerevan", "almaty", "bishkek",
        "tashkent", "baku", "antalya", "istanbul", "belgrade", "podgorica",
        "budva", "tivat", "limassol", "larnaca", "dubai", "bali",
        "phuket", "bangkok", "chiang-mai", "dushanbe",
      ]);
      return cities.filter((c) => RECON.has(c.slug)).sort(byBudget);
    },
  },
  {
    slug: "dlya-pensionerov",
    eyebrow: "Подборка",
    title: "Куда переехать пенсионеру из России: теплые и недорогие города",
    intro:
      "Направления с теплым климатом, доступной медициной, простым переездом и невысокими ценами — именно это важно при выборе города для пенсии за рубежом. Без языкового барьера и стресса.",
    seoTitle: "Куда переехать пенсионеру из России 2026 — теплые страны | Relocost",
    seoDescription:
      "Лучшие города для переезда пенсионерам: тепло, доступная медицина, простой переезд и невысокие цены. Реальные бюджеты 2026 года.",
    fallbackSlugs: [
      "batumi", "kutaisi", "yerevan", "tbilisi", "almaty",
      "tashkent", "antalya", "alanya", "mersin", "pattaya",
      "podgorica", "budva", "hurghada",
    ],
    tips: [
      {
        icon: "🏥",
        title: "Медицина",
        text: "Турция, Грузия и Израиль — лучшее соотношение качества и цены медицины для пенсионеров.",
      },
      {
        icon: "🌞",
        title: "Климат",
        text: "Анталья и Аланья — +10°C зимой. Паттайя — +30°C круглый год. Батуми — +5°C зимой, но черноморский воздух.",
      },
      {
        icon: "💬",
        title: "Языковой барьер",
        text: "Минимальный — в Беларуси, Казахстане, Армении, Грузии. В Таиланде говорят по-русски в туристических районах.",
      },
      {
        icon: "✈️",
        title: "Перелет",
        text: "Прямые рейсы из Москвы и Питера сохраняются в Анталью, Ереван, Тбилиси, Баку, Дубай, Бангкок.",
      },
    ],
    select: (cities) =>
      cities
        .filter((c) => {
          const t = climateTemp(c);
          return (
            c.is_foreign &&
            hasBudget(c) &&
            c.monthly_from <= 100000 &&
            (t === null || t >= 15)
          );
        })
        .sort(byBudget)
        .slice(0, 25),
  },
];

const BY_SLUG = new Map(LISTS.map((l) => [l.slug, l]));

export function getListDef(slug: string): ListDef | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getAllListSlugs(): string[] {
  return LISTS.map((l) => l.slug);
}

// Справочник захардкоженных данных городов для fallback.
// Только поля, нужные CityCard: id, slug, name_ru, name_en, country_*, flag_emoji.
type FallbackCityData = {
  name_ru: string;
  name_en: string;
  country_ru: string;
  country_en: string;
  country_slug: string;
  flag_emoji: string;
};

const FALLBACK_CITY_DATA: Record<string, FallbackCityData> = {
  tbilisi:        { name_ru: "Тбилиси",         name_en: "Tbilisi",         country_ru: "Грузия",             country_en: "Georgia",          country_slug: "georgia",        flag_emoji: "🇬🇪" },
  batumi:         { name_ru: "Батуми",           name_en: "Batumi",          country_ru: "Грузия",             country_en: "Georgia",          country_slug: "georgia",        flag_emoji: "🇬🇪" },
  kutaisi:        { name_ru: "Кутаиси",          name_en: "Kutaisi",         country_ru: "Грузия",             country_en: "Georgia",          country_slug: "georgia",        flag_emoji: "🇬🇪" },
  yerevan:        { name_ru: "Ереван",           name_en: "Yerevan",         country_ru: "Армения",            country_en: "Armenia",          country_slug: "armenia",        flag_emoji: "🇦🇲" },
  almaty:         { name_ru: "Алматы",           name_en: "Almaty",          country_ru: "Казахстан",          country_en: "Kazakhstan",       country_slug: "kazakhstan",     flag_emoji: "🇰🇿" },
  bishkek:        { name_ru: "Бишкек",           name_en: "Bishkek",         country_ru: "Киргизия",           country_en: "Kyrgyzstan",       country_slug: "kyrgyzstan",     flag_emoji: "🇰🇬" },
  tashkent:       { name_ru: "Ташкент",          name_en: "Tashkent",        country_ru: "Узбекистан",         country_en: "Uzbekistan",       country_slug: "uzbekistan",     flag_emoji: "🇺🇿" },
  dushanbe:       { name_ru: "Душанбе",          name_en: "Dushanbe",        country_ru: "Таджикистан",        country_en: "Tajikistan",       country_slug: "tajikistan",     flag_emoji: "🇹🇯" },
  chisinau:       { name_ru: "Кишинев",          name_en: "Chisinau",        country_ru: "Молдова",            country_en: "Moldova",          country_slug: "moldova",        flag_emoji: "🇲🇩" },
  podgorica:      { name_ru: "Подгорица",        name_en: "Podgorica",       country_ru: "Черногория",         country_en: "Montenegro",       country_slug: "montenegro",     flag_emoji: "🇲🇪" },
  tirana:         { name_ru: "Тирана",           name_en: "Tirana",          country_ru: "Албания",            country_en: "Albania",          country_slug: "albania",        flag_emoji: "🇦🇱" },
  skopje:         { name_ru: "Скопье",           name_en: "Skopje",          country_ru: "Северная Македония", country_en: "North Macedonia",  country_slug: "north-macedonia", flag_emoji: "🇲🇰" },
  minsk:          { name_ru: "Минск",            name_en: "Minsk",           country_ru: "Беларусь",           country_en: "Belarus",          country_slug: "belarus",        flag_emoji: "🇧🇾" },
  baku:           { name_ru: "Баку",             name_en: "Baku",            country_ru: "Азербайджан",        country_en: "Azerbaijan",       country_slug: "azerbaijan",     flag_emoji: "🇦🇿" },
  samarkand:      { name_ru: "Самарканд",        name_en: "Samarkand",       country_ru: "Узбекистан",         country_en: "Uzbekistan",       country_slug: "uzbekistan",     flag_emoji: "🇺🇿" },
  bukhara:        { name_ru: "Бухара",           name_en: "Bukhara",         country_ru: "Узбекистан",         country_en: "Uzbekistan",       country_slug: "uzbekistan",     flag_emoji: "🇺🇿" },
  phuket:         { name_ru: "Пхукет",           name_en: "Phuket",          country_ru: "Таиланд",            country_en: "Thailand",         country_slug: "thailand",       flag_emoji: "🇹🇭" },
  bali:           { name_ru: "Бали",             name_en: "Bali",            country_ru: "Индонезия",          country_en: "Indonesia",        country_slug: "indonesia",      flag_emoji: "🇮🇩" },
  bangkok:        { name_ru: "Бангкок",          name_en: "Bangkok",         country_ru: "Таиланд",            country_en: "Thailand",         country_slug: "thailand",       flag_emoji: "🇹🇭" },
  dubai:          { name_ru: "Дубай",            name_en: "Dubai",           country_ru: "ОАЭ",                country_en: "UAE",              country_slug: "uae",            flag_emoji: "🇦🇪" },
  antalya:        { name_ru: "Анталья",          name_en: "Antalya",         country_ru: "Турция",             country_en: "Turkey",           country_slug: "turkey",         flag_emoji: "🇹🇷" },
  goa:            { name_ru: "Гоа",              name_en: "Goa",             country_ru: "Индия",              country_en: "India",            country_slug: "india",          flag_emoji: "🇮🇳" },
  "nha-trang":    { name_ru: "Нячанг",           name_en: "Nha Trang",       country_ru: "Вьетнам",            country_en: "Vietnam",          country_slug: "vietnam",        flag_emoji: "🇻🇳" },
  samui:          { name_ru: "Самуи",            name_en: "Koh Samui",       country_ru: "Таиланд",            country_en: "Thailand",         country_slug: "thailand",       flag_emoji: "🇹🇭" },
  pattaya:        { name_ru: "Паттайя",          name_en: "Pattaya",         country_ru: "Таиланд",            country_en: "Thailand",         country_slug: "thailand",       flag_emoji: "🇹🇭" },
  colombo:        { name_ru: "Коломбо",          name_en: "Colombo",         country_ru: "Шри-Ланка",          country_en: "Sri Lanka",        country_slug: "sri-lanka",      flag_emoji: "🇱🇰" },
  "da-nang":      { name_ru: "Дананг",           name_en: "Da Nang",         country_ru: "Вьетнам",            country_en: "Vietnam",          country_slug: "vietnam",        flag_emoji: "🇻🇳" },
  hurghada:       { name_ru: "Хургада",          name_en: "Hurghada",        country_ru: "Египет",             country_en: "Egypt",            country_slug: "egypt",          flag_emoji: "🇪🇬" },
  "sharm-el-sheikh": { name_ru: "Шарм-эль-Шейх", name_en: "Sharm el-Sheikh", country_ru: "Египет",            country_en: "Egypt",            country_slug: "egypt",          flag_emoji: "🇪🇬" },
  sanya:          { name_ru: "Санья",            name_en: "Sanya",           country_ru: "Китай",              country_en: "China",            country_slug: "china",          flag_emoji: "🇨🇳" },
  "chiang-mai":   { name_ru: "Чиангмай",         name_en: "Chiang Mai",      country_ru: "Таиланд",            country_en: "Thailand",         country_slug: "thailand",       flag_emoji: "🇹🇭" },
  "phu-quoc":     { name_ru: "Фукуок",           name_en: "Phu Quoc",        country_ru: "Вьетнам",            country_en: "Vietnam",          country_slug: "vietnam",        flag_emoji: "🇻🇳" },
  prague:         { name_ru: "Прага",            name_en: "Prague",          country_ru: "Чехия",              country_en: "Czech Republic",   country_slug: "czech",          flag_emoji: "🇨🇿" },
  bodrum:         { name_ru: "Бодрум",           name_en: "Bodrum",          country_ru: "Турция",             country_en: "Turkey",           country_slug: "turkey",         flag_emoji: "🇹🇷" },
  fethiye:        { name_ru: "Фетхие",           name_en: "Fethiye",         country_ru: "Турция",             country_en: "Turkey",           country_slug: "turkey",         flag_emoji: "🇹🇷" },
  tivat:          { name_ru: "Тиват",            name_en: "Tivat",           country_ru: "Черногория",         country_en: "Montenegro",       country_slug: "montenegro",     flag_emoji: "🇲🇪" },
  budva:          { name_ru: "Будва",            name_en: "Budva",           country_ru: "Черногория",         country_en: "Montenegro",       country_slug: "montenegro",     flag_emoji: "🇲🇪" },
  dubrovnik:      { name_ru: "Дубровник",        name_en: "Dubrovnik",       country_ru: "Хорватия",           country_en: "Croatia",          country_slug: "croatia",        flag_emoji: "🇭🇷" },
  split:          { name_ru: "Сплит",            name_en: "Split",           country_ru: "Хорватия",           country_en: "Croatia",          country_slug: "croatia",        flag_emoji: "🇭🇷" },
  barcelona:      { name_ru: "Барселона",        name_en: "Barcelona",       country_ru: "Испания",            country_en: "Spain",            country_slug: "spain",          flag_emoji: "🇪🇸" },
  alicante:       { name_ru: "Аликанте",         name_en: "Alicante",        country_ru: "Испания",            country_en: "Spain",            country_slug: "spain",          flag_emoji: "🇪🇸" },
  malaga:         { name_ru: "Малага",           name_en: "Malaga",          country_ru: "Испания",            country_en: "Spain",            country_slug: "spain",          flag_emoji: "🇪🇸" },
  larnaca:        { name_ru: "Ларнака",          name_en: "Larnaca",         country_ru: "Кипр",               country_en: "Cyprus",           country_slug: "cyprus",         flag_emoji: "🇨🇾" },
  limassol:       { name_ru: "Лимасол",          name_en: "Limassol",        country_ru: "Кипр",               country_en: "Cyprus",           country_slug: "cyprus",         flag_emoji: "🇨🇾" },
};

// Создает минимальные объекты CityWithBudget из захардкоженного справочника.
// Используется когда Supabase недоступна (egress 402) и getCitiesWithBudget()
// вернула пустой массив. image_url/unsplash_url = null — R2-фото подхватывает по slug.
function buildFallbackCities(slugs: string[]): CityWithBudget[] {
  return slugs
    .filter((slug) => slug in FALLBACK_CITY_DATA)
    .map((slug) => {
      const d = FALLBACK_CITY_DATA[slug];
      return {
        id: slug,
        slug,
        name_ru: d.name_ru,
        name_en: d.name_en,
        country_ru: d.country_ru,
        country_en: d.country_en,
        country_slug: d.country_slug,
        flag_emoji: d.flag_emoji,
        image_url: null,
        unsplash_url: null,
        unsplash_photo_id: null,
        unsplash_author_name: null,
        unsplash_author_url: null,
        population: null,
        climate: null,
        language: null,
        currency: null,
        flight_from_moscow: null,
        is_foreign: true,
        difficulty_score: 2,
        is_popular: false,
        seo_title: null,
        seo_description: null,
        intro_text: null,
        lat: null,
        lng: null,
        gallery: null,
        min_rent: 0,
        monthly_from: 0,
      } satisfies CityWithBudget;
    });
}

// Данные подборки: определение + отобранные города с бюджетом.
// Если DB вернула пустой массив (Supabase 402 egress exceeded) — используем
// статичный fallback, чтобы страница никогда не показывала «Пока нет городов».
export async function getListData(
  slug: string,
): Promise<{ def: ListDef; cities: CityWithBudget[] } | null> {
  const def = getListDef(slug);
  if (!def) return null;
  const all = await getCitiesWithBudget();
  const cities = def.select(all);
  if (!cities.length && def.fallbackSlugs.length) {
    return { def, cities: buildFallbackCities(def.fallbackSlugs) };
  }
  return { def, cities };
}

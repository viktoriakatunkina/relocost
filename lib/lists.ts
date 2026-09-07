import { getCitiesWithBudget } from "./city-budget";
import { climateTemp, COASTAL } from "./city-signals";
import { CITY_CONTENT } from "./cities-content";
import { getCityQuality } from "./city-quality";
import type { CityWithBudget } from "./types";

// SEO-подборки городов («Города до 50 000 ₽», «Куда уехать на зимовку» и т.п.).
// Каждая — индексируемый лендинг /list/[slug] с уникальным текстом, списком
// городов из реальных данных (бюджет/сложность/климат) и ItemList-разметкой.
// Закрывают высокочастотные информационные интенты и раздают вес страницам городов.
//
// ВАЖНО (аудит 07.09.2026). Раньше почти каждая подборка заканчивалась одним и
// тем же `.filter(is_foreign).sort(byBudget).slice(0, 30)` — и пять пар выдавали
// 88–100% одинаковых городов: samye-deshevye ≡ do-80000-rubley,
// prostoy-pereezd ≡ dlya-ayti, s-detmi ≈ dlya-pensionerov,
// dlya-zimovki ≈ teplye-strany, samye-deshevye ≈ dlya-udalenki. Для поиска это
// дубли-каннибалы. Теперь у каждой подборки СВОЯ ось отбора:
//   цена-рейтинг      — samye-deshevye (топ-30 самых дешёвых, вкл. Россию)
//   цена-диапазон     — do-50000-rubley (≤50к) и do-80000-rubley (50–80к)
//   сложность переезда— prostoy-pereezd
//   IT-инфраструктура — dlya-ayti (коворкинги/IT-сектор, сорт. по IT-баллу)
//   удалёнка+бюджет   — dlya-udalenki (есть рабочая инфраструктура, ≤100к)
//   климат+виза       — dlya-zimovki (тропики + безвиз/виза по прилёту)
//   климат-рейтинг    — teplye-strany (все тёплые, сорт. по температуре)
//   безопасность      — s-detmi (safety/медицина из city-quality)
//   комфорт+медицина  — dlya-pensionerov
//   география         — u-morya, evropa, bezvizovye, razvedka-pered-pereezdom
// Порог пересечения после правки — ниже 50% на всех парах (проверено скриптом).

export type Tip = {
  icon: string;
  title: string;
  text: string;
};

export type ListDef = {
  slug: string;
  eyebrow: string;
  title: string;
  // Короткая подпись для перелинковки («другие подборки», футер).
  shortTitle: string;
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

// ── Сигналы отбора ──────────────────────────────────────────────────────────

// «IT-балл» города по редакционным данным cities-content.ts: коворкинг в
// «лучших местах», IT в списке отраслей и заполненный блок «работа и удалёнка»
// (там же интернет и налоги). Плюс поправка на бытовую инфраструктуру и
// наличие русскоязычного сообщества из difficulty_breakdown (меньше = лучше).
function itScore(c: CityWithBudget): number {
  const k = CITY_CONTENT[c.slug];
  if (!k) return 0;
  const coworking = k.best_places?.some((p) => p.type === "coworking") ? 2 : 0;
  const itSector = k.work?.sectors?.some((s) => /IT|Айти|разработ/i.test(s)) ? 2 : 0;
  const workBlock = k.work ? 1 : 0;
  const db = k.difficulty_breakdown;
  const bonus = db ? (5 - db.infrastructure + (5 - db.community)) / 4 : 0;
  return coworking + itSector + workBlock + bonus;
}

// Город «готов к удалённой работе»: есть коворкинг, описан блок работы/интернета
// или одновременно сильная бытовая инфраструктура и своё сообщество.
function isRemoteReady(c: CityWithBudget): boolean {
  const k = CITY_CONTENT[c.slug];
  if (!k) return false;
  if (k.best_places?.some((p) => p.type === "coworking")) return true;
  if (k.work) return true;
  const db = k.difficulty_breakdown;
  return !!db && db.infrastructure <= 2 && db.community <= 2;
}

// Страны, куда россиянину не нужна заранее оформленная виза: безвиз, виза по
// прилёту или электронная виза. Критерий именно для зимовки — уехать на
// 2–6 месяцев без консульства.
const WINTERING_VISA_FREE: Set<string> = new Set([
  "thailand", "vietnam", "indonesia", "malaysia", "philippines", "cambodia",
  "india", "sri-lanka", "uae", "turkey", "egypt", "morocco", "georgia",
  "montenegro", "serbia",
]);

export const LISTS: ListDef[] = [
  {
    slug: "samye-deshevye",
    eyebrow: "Рейтинг",
    title: "Самые доступные города для жизни в 2026 году",
    shortTitle: "Самые дешевые города",
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
    shortTitle: "Жизнь на 50 000 ₽",
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
    shortTitle: "Простой переезд",
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
    shortTitle: "Куда уехать на зимовку",
    intro:
      "Направления, куда можно уехать на всю зиму без консульской визы: средняя температура от +22°C, безвиз или виза по прилету и электронная виза. Отсортированы от самых дешевых — на зимовку обычно едут именно за сочетанием «тепло и недорого». Полный список теплых мест, включая те, куда нужна виза заранее, — в подборке «Теплые страны».",
    seoTitle: "Куда уехать на зимовку в 2026 — теплые недорогие города | Relocost",
    seoDescription:
      "Куда уехать на зимовку в 2026: тропики от +22°C с безвизом или визой по прилету. Реальный бюджет на месяц и цены на аренду в каждом городе.",
    fallbackSlugs: [
      "phuket", "bali", "bangkok", "goa", "nha-trang", "samui",
      "pattaya", "colombo", "da-nang", "hurghada", "sharm-el-sheikh",
      "chiang-mai", "phu-quoc", "penang",
    ],
    tips: [
      {
        icon: "🌡️",
        title: "Климат",
        text: "Ищите среднюю температуру от +22°C в январе — иначе «теплая зимовка» обманет.",
      },
      {
        icon: "🛂",
        title: "Виза",
        text: "В подборке только страны с безвизом, визой по прилету или электронной визой — консульство до вылета не нужно.",
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
    ],
    // Ось подборки — «тропики + въезд без консульства», а не просто тепло:
    // иначе она совпадала с teplye-strany на 88%.
    select: (cities) =>
      cities
        .filter((c) => {
          const t = climateTemp(c);
          return (
            c.is_foreign &&
            WINTERING_VISA_FREE.has(c.country_slug) &&
            t !== null &&
            t >= 22
          );
        })
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "dlya-udalenki",
    eyebrow: "Подборка",
    title: "Лучшие города для удаленной работы в 2026 году",
    shortTitle: "Для удаленной работы",
    intro:
      "Города, где у удаленщика уже есть все для работы: коворкинги, устойчивый интернет и сложившееся сообщество экспатов — и при этом бюджет до 100 000 ₽ в месяц. Отсортированы от самых доступных. Если интересует не быт, а рынок труда и налоги, смотрите отдельную подборку для айтишников.",
    seoTitle: "Лучшие города для удаленной работы 2026 — для релокантов | Relocost",
    seoDescription:
      "Города для удаленной работы: коворкинги, стабильный интернет, сообщество и бюджет до 100 000 ₽ в месяц. Подборка для цифровых кочевников 2026.",
    fallbackSlugs: [
      "tbilisi", "batumi", "chiang-mai", "bali", "phuket", "bangkok",
      "antalya", "izmir", "kutaisi", "tashkent", "da-nang", "goa",
      "bishkek", "fethiye",
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
    // Ось подборки — рабочая инфраструктура (коворкинги, интернет, сообщество)
    // плюс потолок бюджета. Раньше здесь стоял фильтр «сложность ≤3 + бюджет»,
    // из-за чего подборка на 94% повторяла «самые дешевые города».
    select: (cities) =>
      cities
        .filter(
          (c) =>
            c.is_foreign &&
            hasBudget(c) &&
            c.monthly_from <= 100000 &&
            isRemoteReady(c),
        )
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "u-morya",
    eyebrow: "Подборка",
    title: "Города у моря для переезда и жизни",
    shortTitle: "Города у моря",
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
    shortTitle: "Бюджет до 80 000 ₽",
    intro:
      "Средний ценовой сегмент: города с бюджетом от 50 000 до 80 000 ₽ в месяц на одного человека. Это уже не режим строгой экономии — здесь есть европейские столицы, курорты и крупные азиатские города. Все, что дешевле 50 000 ₽, вынесено в отдельную подборку — так удобнее выбирать по своему потолку.",
    seoTitle: "Куда переехать с бюджетом 80 000 рублей — города для жизни | Relocost",
    seoDescription:
      "Города с бюджетом 50–80 тысяч рублей в месяц: аренда, продукты, транспорт и ЖКХ. Куда переехать, если на жизнь есть до 80 000 ₽ в месяц.",
    fallbackSlugs: [
      "tbilisi", "bali", "kuala-lumpur", "belgrade", "sofia", "istanbul",
      "almaty", "tivat", "budva", "riga", "vilnius", "alicante",
      "colombo", "tirana", "wroclaw", "nicosia", "heraklion", "amman",
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
    // Диапазон 50–80к, а не «все до 80к»: со старым фильтром подборка на 100%
    // повторяла «самые дешевые города». Вместе с /list/do-50000-rubley это
    // теперь лестница бюджетов без пересечений.
    select: (cities) =>
      cities
        .filter(
          (c) =>
            hasBudget(c) && c.monthly_from > 50000 && c.monthly_from <= 80000,
        )
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "dlya-ayti",
    eyebrow: "Подборка",
    title: "Лучшие города для айтишников: переезд без боли",
    shortTitle: "Для айтишников",
    intro:
      "Города, где есть своя IT-среда: коворкинги, компании и стартапы в списке ключевых отраслей, понятные налоговые режимы для фрилансера и сложившееся русскоязычное сообщество. Отсортированы по силе IT-инфраструктуры, а не по цене — поэтому рядом стоят и дешевый Тбилиси, и дорогой Тель-Авив.",
    seoTitle: "Куда переехать айтишнику из России: топ городов 2026 | Relocost",
    seoDescription:
      "Лучшие города для IT-специалистов из России: коворкинги, IT-компании, налоги для фрилансера и русскоязычное сообщество. Реальные бюджеты 2026.",
    fallbackSlugs: [
      "tbilisi", "yerevan", "belgrade", "almaty", "chiang-mai", "phuket",
      "bali", "limassol", "dubai", "prague", "lisbon", "budapest",
      "barcelona", "tel-aviv", "kuala-lumpur",
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
    // Ось подборки — IT-балл города (коворкинги, IT в отраслях, описанный блок
    // работы и интернета). Прежний фильтр «сложность ≤3 + бюджет» совпадал с
    // /list/prostoy-pereezd на 100%.
    select: (cities) =>
      cities
        .filter((c) => c.is_foreign && hasBudget(c) && itScore(c) >= 2)
        .sort((a, b) => itScore(b) - itScore(a) || byBudget(a, b))
        .slice(0, 30),
  },
  {
    slug: "s-detmi",
    eyebrow: "Подборка",
    title: "Куда переехать с детьми из России",
    shortTitle: "Переезд с детьми",
    intro:
      "С детьми первым делом смотрят не на цену, а на безопасность и медицину — по ним и отсортирована подборка. В нее попали города с высокой оценкой безопасности и доступным здравоохранением при бюджете до 150 000 ₽ в месяц на человека.",
    seoTitle: "Куда переехать с детьми из России — лучшие города 2026 | Relocost",
    seoDescription:
      "Куда переехать с детьми: города с высокой безопасностью и доступной медициной. Школы, здравоохранение и реальный бюджет семьи в 2026 году.",
    fallbackSlugs: [
      "vienna", "tokyo", "doha", "ljubljana", "muscat",
      "sharjah", "paphos", "abu-dhabi", "larnaca", "penang",
      "gdansk", "alicante", "vilnius", "wroclaw", "porto",
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
    // Ось подборки — безопасность и медицина из lib/city-quality (Numbeo Crime
    // и Health Care Index). Прежний фильтр «зарубежный + есть бюджет» давал
    // просто список самых дешевых городов и совпадал с подборкой для
    // пенсионеров на 92%.
    select: (cities) =>
      cities
        .filter((c) => {
          const q = getCityQuality(c.slug);
          return (
            c.is_foreign &&
            hasBudget(c) &&
            c.monthly_from <= 150000 &&
            !!q &&
            q.safety >= 4 &&
            q.medicine >= 3
          );
        })
        .sort((a, b) => {
          const qa = getCityQuality(a.slug)!;
          const qb = getCityQuality(b.slug)!;
          return (
            qb.safety * 2 + qb.medicine - (qa.safety * 2 + qa.medicine) ||
            byBudget(a, b)
          );
        })
        .slice(0, 25),
  },
  {
    slug: "bezvizovye",
    eyebrow: "Подборка",
    title: "Безвизовые страны для россиян: куда можно переехать прямо сейчас",
    shortTitle: "Безвизовые страны",
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
    shortTitle: "Теплые страны",
    intro:
      "Полный список городов со среднегодовой температурой от +18°C — Азия, Средиземноморье, Ближний Восток, Латинская Америка. Отсортированы от самых жарких к умеренно теплым, чтобы было видно всю шкалу: от +29°C круглый год до мягкой средиземноморской зимы. Здесь — про постоянную жизнь; если нужно уехать только на зиму и без визы заранее, смотрите подборку про зимовку.",
    seoTitle: "Теплые страны для переезда из России — жить в тепле | Relocost",
    seoDescription:
      "Теплые страны и города для переезда из России: среднегодовая температура от +18°C, реальные цены на жизнь и аренду. Полный список 2026 года.",
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
    // Ось подборки — температура, а не цена, и без обрезки до 30 городов:
    // это справочник «все теплое». С прежним «t≥20 + сортировка по бюджету +
    // топ-30» подборка на 88% повторяла зимовку.
    select: (cities) =>
      cities
        .filter((c) => {
          const t = climateTemp(c);
          return c.is_foreign && t !== null && t >= 18;
        })
        .sort(
          (a, b) =>
            (climateTemp(b) ?? 0) - (climateTemp(a) ?? 0) || byBudget(a, b),
        ),
  },
  {
    slug: "evropa",
    eyebrow: "Подборка",
    title: "Переезд в Европу: города, доступные россиянам в 2026 году",
    shortTitle: "Переезд в Европу",
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
    shortTitle: "Разведка перед переездом",
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
    shortTitle: "Для пенсионеров",
    intro:
      "Для пенсии важнее всего мягкий климат и работающая медицина, а уже потом цена — по этим трем критериям и собрана подборка: высокая оценка комфортности климата, доступное здравоохранение, спокойная обстановка и бюджет до 100 000 ₽ в месяц. Отсортированы от самых дешевых.",
    seoTitle: "Куда переехать пенсионеру из России 2026 — теплые страны | Relocost",
    seoDescription:
      "Куда переехать пенсионеру: мягкий климат, доступная медицина и бюджет до 100 000 ₽ в месяц. Реальные цены на аренду, еду и лечение в 2026 году.",
    fallbackSlugs: [
      "fethiye", "alanya", "izmir", "bodrum", "antalya",
      "phuket", "bali", "pattaya", "alicante", "istanbul",
      "porto", "podgorica", "malaga", "seville", "funchal",
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
    // Ось подборки — комфортность климата и медицина из lib/city-quality плюс
    // низкий языковой барьер. Прежний фильтр «тепло + до 100к» на 92% совпадал
    // с подборкой для переезда с детьми.
    select: (cities) =>
      cities
        .filter((c) => {
          const q = getCityQuality(c.slug);
          const t = climateTemp(c);
          const db = CITY_CONTENT[c.slug]?.difficulty_breakdown;
          return (
            c.is_foreign &&
            hasBudget(c) &&
            c.monthly_from <= 100000 &&
            !!q &&
            q.climate_comfort >= 4 &&
            q.medicine >= 3 &&
            q.safety >= 3 &&
            (t === null || t >= 15) &&
            (!db || db.language <= 3)
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

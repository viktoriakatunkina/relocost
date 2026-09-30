// Стартовые (разовые) расходы на переезд — в отличие от MonthlyBudget/
// Calculator (регулярные расходы на месяц жизни), это то, что нужно заплатить
// ОДИН раз перед/сразу после переезда: перелёт, депозит+первый месяц аренды,
// виза, обустройство на месте.
//
// Принцип честности (см. память сессии 2026-09-29): в базе НЕТ реальных цен
// на авиабилеты — это НЕ агрегатор перелётов и никогда им не станет. Вместо
// того чтобы выдумывать точную цифру на город, считаем по тарифным ЗОНАМ
// (группы стран со похожей доступностью и стоимостью перелёта из России),
// с явными диапазонами и пометкой "ориентировочно". Диапазоны собраны
// вручную по открытым данным агрегаторов (Авиасейлс, Т-Банк Путешествия,
// OneTwoTrip) на сентябрь 2026 — эконом-класс, одна сторона, без выбора
// конкретных дат. Раз в несколько месяцев стоит сверить вручную.
//
// Зонирование учитывает не только географию, но и реальную доступность
// прямых рейсов из РФ (после 2022 года нет прямых рейсов в страны ЕС/UK —
// только транзит через Стамбул/Дубай/Ереван/Белград, что для похожей
// дальности дороже прямого перелёта в "дружественную" юрисдикцию).

export type FlightTier =
  | "domestic" // Россия — внутренний перелёт
  | "cis" // страны СНГ — прямые рейсы, недорого
  | "direct_near" // Турция/Балканы/Ближний Восток/Сев. Африка — обычно прямой рейс
  | "asia" // Юго-Вост./Вост./Юж. Азия — обычно с пересадкой
  | "europe" // ЕС/Шенген/Великобритания — без прямых рейсов из РФ, транзит
  | "americas" // США/Канада/Латинская Америка — дальний перелёт с пересадкой
  | "africa_far" // Африка южнее Сахары — обычно с пересадкой
  | "oceania"; // Австралия — самый дальний перелёт

export type FlightRange = { min: number; max: number; note: string };

export const FLIGHT_RANGES: Record<FlightTier, FlightRange> = {
  domestic: { min: 4000, max: 15000, note: "Внутренний рейс по России" },
  cis: { min: 8000, max: 20000, note: "Обычно прямой рейс" },
  direct_near: { min: 15000, max: 35000, note: "Обычно прямой рейс" },
  asia: { min: 25000, max: 55000, note: "Обычно с одной пересадкой" },
  europe: {
    min: 30000,
    max: 60000,
    note: "Прямых рейсов из РФ нет — через Стамбул/Дубай/Ереван",
  },
  americas: { min: 45000, max: 100000, note: "Дальний перелёт с пересадкой" },
  africa_far: { min: 40000, max: 75000, note: "Обычно с пересадкой" },
  oceania: { min: 60000, max: 120000, note: "Самый дальний перелёт, несколько пересадок" },
};

// country_slug -> тарифная зона. Покрывает все страны, представленные в
// каталоге городов (проверено скриптом на дату добавления — см. git blame).
// Неизвестная страна (добавили город, забыли внести сюда) падает в "europe"
// как консервативный средний вариант — не самый дешёвый и не самый дорогой.
export const COUNTRY_FLIGHT_TIER: Record<string, FlightTier> = {
  russia: "domestic",

  armenia: "cis",
  azerbaijan: "cis",
  belarus: "cis",
  georgia: "cis",
  kazakhstan: "cis",
  kyrgyzstan: "cis",
  moldova: "cis",
  tajikistan: "cis",
  uzbekistan: "cis",

  turkey: "direct_near",
  uae: "direct_near",
  qatar: "direct_near",
  bahrain: "direct_near",
  oman: "direct_near",
  jordan: "direct_near",
  israel: "direct_near",
  egypt: "direct_near",
  tunisia: "direct_near",
  morocco: "direct_near",
  serbia: "direct_near",
  montenegro: "direct_near",
  cyprus: "direct_near",
  "northern-cyprus": "direct_near",
  india: "direct_near",

  china: "asia",
  "hong-kong": "asia",
  taiwan: "asia",
  "south-korea": "asia",
  japan: "asia",
  thailand: "asia",
  vietnam: "asia",
  indonesia: "asia",
  malaysia: "asia",
  singapore: "asia",
  philippines: "asia",
  cambodia: "asia",
  "sri-lanka": "asia",
  nepal: "asia",

  albania: "europe",
  austria: "europe",
  belgium: "europe",
  bulgaria: "europe",
  croatia: "europe",
  "czech-republic": "europe",
  denmark: "europe",
  estonia: "europe",
  finland: "europe",
  france: "europe",
  germany: "europe",
  greece: "europe",
  hungary: "europe",
  iceland: "europe",
  ireland: "europe",
  italy: "europe",
  latvia: "europe",
  lithuania: "europe",
  malta: "europe",
  netherlands: "europe",
  "north-macedonia": "europe",
  poland: "europe",
  portugal: "europe",
  romania: "europe",
  slovakia: "europe",
  slovenia: "europe",
  spain: "europe",
  sweden: "europe",
  switzerland: "europe",
  "united-kingdom": "europe",

  argentina: "americas",
  brazil: "americas",
  canada: "americas",
  chile: "americas",
  colombia: "americas",
  mexico: "americas",
  peru: "americas",
  uruguay: "americas",
  usa: "americas",

  kenya: "africa_far",
  "south-africa": "africa_far",

  australia: "oceania",
};

export function getFlightRange(countrySlug: string | null | undefined): FlightRange {
  const tier = COUNTRY_FLIGHT_TIER[countrySlug ?? ""] ?? "europe";
  return FLIGHT_RANGES[tier];
}

// Виза/оформление на старте. Грубая бинарная оценка: если въезд безвизовый —
// на старте платить не за что (0 ₽, загранпаспорт не считаем — он нужен для
// любой поездки). Если нужна виза — типичная стоимость туристической/
// электронной визы, которую оформляет абсолютное большинство переезжающих в
// первые недели (не рабочая виза/ВНЖ — та дороже и сильно разнится по
// стране, её расходы за рамками этой оценки, см. блок "Виза и въезд" на
// странице страны).
export type VisaCostRange = { min: number; max: number; note: string };

export function getVisaCostEstimate(visaFree: boolean): VisaCostRange {
  if (visaFree) {
    return { min: 0, max: 0, note: "Виза не нужна" };
  }
  return {
    min: 3000,
    max: 15000,
    note: "Туристическая/электронная виза — без учёта ВНЖ и рабочей визы",
  };
}

// Обустройство в первые дни: перевес багажа/доставка личных вещей, SIM-карта,
// такси/трансфер, непредвиденные расходы первой недели. Не завязано на цены
// конкретного города (слишком разнородная статья, чтобы её точно считать) —
// единая ориентировочная вилка.
export const SETTLING_IN_RANGE = {
  min: 10000,
  max: 25000,
  note: "Багаж, SIM-карта, такси/трансфер, непредвиденные расходы первой недели",
};

export type StartupCostBreakdown = {
  flight: FlightRange;
  deposit: { min: number; max: number; note: string } | null;
  visa: VisaCostRange;
  settlingIn: typeof SETTLING_IN_RANGE;
  totalMin: number;
  totalMax: number;
};

// depositSource — мин/макс цена аренды (обычно "1-комн. на окраине" — та же
// строка, что использует Calculator.tsx для сценария "эконом"), из которой
// считаем депозит + первый месяц (стандартная практика почти везде — 2×).
export function calcStartupCosts(params: {
  countrySlug: string | null | undefined;
  visaFree: boolean;
  depositSource: { min: number; max: number } | null;
}): StartupCostBreakdown {
  const flight = getFlightRange(params.countrySlug);
  const visa = getVisaCostEstimate(params.visaFree);
  const deposit = params.depositSource
    ? {
        min: params.depositSource.min * 2,
        max: params.depositSource.max * 2,
        note: "Депозит + первый месяц аренды (2×)",
      }
    : null;

  const totalMin = flight.min + visa.min + (deposit?.min ?? 0) + SETTLING_IN_RANGE.min;
  const totalMax = flight.max + visa.max + (deposit?.max ?? 0) + SETTLING_IN_RANGE.max;

  return { flight, deposit, visa, settlingIn: SETTLING_IN_RANGE, totalMin, totalMax };
}

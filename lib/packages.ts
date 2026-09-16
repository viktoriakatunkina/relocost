// ---------------------------------------------------------------------------
// Чистые данные и хелперы по freemium-пакетам — БЕЗ "use client".
//
// Зачем отдельный файл: lib/unlocked.ts помечен "use client" (там React-хуки
// useUnlocked/useCountryUnlocked и localStorage). Next.js RSC при импорте
// ЛЮБОГО экспорта из "use client"-модуля в серверный компонент подменяет его
// клиентской ссылкой — для плоских данных (объект цен CITY_PACKAGES и т.п.)
// это ломает обращение к полям на сервере. Серверные компоненты (страницы
// блога, SEO-карточки без интерактивности) импортируют цены/лейблы отсюда;
// lib/unlocked.ts реэкспортирует то же самое для клиентских компонентов,
// чтобы их импорты не пришлось менять.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Пакеты для страниц ГОРОДОВ
// ---------------------------------------------------------------------------

export type CityPackageType = "places" | "budget" | "bundle";

export const CITY_PACKAGES: Record<
  CityPackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  places: { label: "Лучшие места для посещения", short: "Места", price: 149, emoji: "📍" },
  budget: { label: "Полный список расходов с ценами", short: "Расходы", price: 199, emoji: "📊" },
  bundle: { label: "Полный список + лучшие места", short: "Комбо", price: 249, emoji: "🎁" },
};

export const CITY_PACKAGE_DESCRIPTIONS: Record<CityPackageType, string> = {
  places: "Лучшие места для посещения в этом городе: кафе, рестораны, районы, рынки и коворкинги.",
  budget: "Полный список статей расходов с реальными ценами по всем категориям.",
  bundle: "Полный список статей расходов + лучшие места — все в одном платеже.",
};

// ---------------------------------------------------------------------------
// Пакеты для страниц СТРАН
// ---------------------------------------------------------------------------

export type CountryPackageType = "country_cities" | "country_overview";

export const COUNTRY_PACKAGES: Record<
  CountryPackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  country_cities: { label: "Города страны по критериям", short: "Города", price: 199, emoji: "🏙" },
  country_overview: { label: "Все о стране и особенности", short: "Обзор", price: 149, emoji: "🌍" },
};

export const COUNTRY_PACKAGE_DESCRIPTIONS: Record<CountryPackageType, string> = {
  country_cities: "Список лучших городов по нескольким критериям с основными факторами переезда.",
  country_overview: "Все самое важное о стране: особенности жизни, лучшие места, практические советы.",
};

// ---------------------------------------------------------------------------
// Единый тип для обратной совместимости с PaymentModal / API
// ---------------------------------------------------------------------------

export type PackageType = CityPackageType | CountryPackageType;

/** @deprecated Используй CITY_PACKAGES или COUNTRY_PACKAGES */
export const PACKAGES: Record<
  PackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  ...CITY_PACKAGES,
  ...COUNTRY_PACKAGES,
};

/** @deprecated Используй CITY_PACKAGE_DESCRIPTIONS или COUNTRY_PACKAGE_DESCRIPTIONS */
export const PACKAGE_DESCRIPTIONS: Record<PackageType, string> = {
  ...CITY_PACKAGE_DESCRIPTIONS,
  ...COUNTRY_PACKAGE_DESCRIPTIONS,
};

// ---------------------------------------------------------------------------
// Таблица сравнения пакетов (для StickyBar «Показать все пакеты» и /tariffs)
// ---------------------------------------------------------------------------
//
// Значения сверены с реальной логикой разблокировки в коде, а не выдуманы:
//  - "places" открывает BestPlaces (components/city/BestPlaces.tsx, isUnlocked
//    unlocked "places") и маршруты сверх первого бесплатного (TripBoard.tsx,
//    та же проверка isUnlocked(unlocked, "places")).
//  - "budget" открывает точный итог MonthlyBudget и полный прайс PricesTable
//    (40+ позиций по категориям).
//  - "bundle" = оба набора сразу (isUnlocked считает bundle разблокировкой
//    любого другого пакета — см. функцию isUnlocked выше).
export type ComparisonFeature = {
  label: string;
  places: boolean;
  budget: boolean;
  bundle: boolean;
};

export const CITY_COMPARISON_FEATURES: ComparisonFeature[] = [
  { label: "Лучшие места города — кафе, рынки, коворкинги, районы", places: true, budget: false, bundle: true },
  { label: "Полный прайс — 40+ позиций расходов по всем категориям", places: false, budget: true, bundle: true },
  { label: "Точный бюджет на месяц с разбивкой по категориям", places: false, budget: true, bundle: true },
  { label: "Маршруты на день с таймингом и ценами (сверх первого бесплатного)", places: true, budget: false, bundle: true },
];

export const CITY_VALID: CityPackageType[] = ["places", "budget", "bundle"];
export const COUNTRY_VALID: CountryPackageType[] = ["country_cities", "country_overview"];
export const ALL_VALID: PackageType[] = [...CITY_VALID, ...COUNTRY_VALID];

// ---------------------------------------------------------------------------
// Хелперы — ГОРОДА (чистые функции, без React/localStorage)
// ---------------------------------------------------------------------------

export function availablePackages(isForeign: boolean): CityPackageType[] {
  void isForeign; // guide-пакет убран, все три продукта одинаковы для любого города
  // "guide" убран из новой модели — все три продукта одинаковы для любого города.
  return ["places", "budget", "bundle"];
}

export function isUnlocked(unlocked: CityPackageType[], pkg: CityPackageType): boolean {
  if (unlocked.includes("bundle")) return true;
  return unlocked.includes(pkg);
}

export function lockedRemaining(
  unlocked: CityPackageType[],
  isForeign: boolean,
): CityPackageType[] {
  void isForeign;
  if (unlocked.includes("bundle")) return [];
  const all = availablePackages(isForeign).filter((p) => p !== "bundle");
  return all.filter((p) => !unlocked.includes(p));
}

// ---------------------------------------------------------------------------
// Хелперы — СТРАНЫ (чистые функции, без React/localStorage)
// ---------------------------------------------------------------------------

export function isCountryUnlocked(
  unlocked: CountryPackageType[],
  pkg: CountryPackageType,
): boolean {
  return unlocked.includes(pkg);
}

export function lockedCountryRemaining(unlocked: CountryPackageType[]): CountryPackageType[] {
  return COUNTRY_VALID.filter((p) => !unlocked.includes(p));
}

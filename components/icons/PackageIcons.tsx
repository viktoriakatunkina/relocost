// ---------------------------------------------------------------------------
// Line-иконки для 5 платных пакетов (places / budget / bundle /
// country_overview / country_cities) — замена OS-эмодзи (📍📊🎁🌍🏙), которые
// рендерились по-разному на разных платформах и в момент решения платить
// выглядели как "самодельный telegram-бот" (аудит иконографии, 2026-10-29).
//
// Тот же язык, что уже используется для вопросов квиза в
// components/quiz/QuizClient.tsx: 24×24 viewBox, stroke="currentColor",
// strokeWidth 1.6, скруглённые концы/стыки, без заливки. Глобус (country_
// overview) и геометрия пина (places) переиспользуют уже существующие в
// проекте SVG-паттерны — тот же globe, что у вопроса "destination" в квизе,
// и тот же pin, что в components/checklist/ChecklistClient.tsx
// (STEP_ICON_SVGS.pin) — вместо третьего независимого варианта.
//
// lib/packages.ts оставляет поле `emoji` в CITY_PACKAGES/COUNTRY_PACKAGES
// для обратной совместимости типов (его больше нигде не рендерят) — этот
// файл единственное место, где package → иконка.
// ---------------------------------------------------------------------------

import type { PackageType } from "@/lib/packages";

type IconProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

// places — такой же пин, как в ChecklistClient.tsx (STEP_ICON_SVGS.pin).
function IconPin({ width = 24, height = 24, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// budget — растущие столбики расходов.
function IconBars({ width = 24, height = 24, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="3.5" y1="20" x2="20.5" y2="20" />
      <rect x="5.5" y="13" width="3.4" height="7" />
      <rect x="10.3" y="8.5" width="3.4" height="11.5" />
      <rect x="15.1" y="4.5" width="3.4" height="15.5" />
    </svg>
  );
}

// bundle — подарок (места + расходы в одной коробке).
function IconGift({ width = 24, height = 24, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="9" width="18" height="4" rx="1" />
      <rect x="4.5" y="13" width="15" height="8" rx="1" />
      <line x1="12" y1="9" x2="12" y2="21" />
      <path d="M12 9c-1.1-3.1-3.5-4.3-5-3.4-1.4.8-1.2 2.9.4 3.4" />
      <path d="M12 9c1.1-3.1 3.5-4.3 5-3.4 1.4.8 1.2 2.9-.4 3.4" />
    </svg>
  );
}

// country_overview — тот же глобус, что у вопроса "destination" в квизе.
function IconGlobe({ width = 24, height = 24, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// country_cities — силуэт нескольких городов (список по стране).
function IconSkyline({ width = 24, height = 24, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="2.5" y1="21" x2="21.5" y2="21" />
      <rect x="4.5" y="10" width="5" height="11" />
      <rect x="11" y="6" width="5" height="15" />
      <rect x="17.5" y="13.5" width="3.5" height="7.5" />
      <line x1="12.3" y1="10" x2="14.2" y2="10" />
      <line x1="12.3" y1="13.5" x2="14.2" y2="13.5" />
    </svg>
  );
}

const PACKAGE_ICON: Record<PackageType, (props: IconProps) => React.ReactElement> = {
  places: IconPin,
  budget: IconBars,
  bundle: IconGift,
  country_overview: IconGlobe,
  country_cities: IconSkyline,
};

/** Иконка пакета — замена `meta.emoji` везде, где показывается пакет:
 *  StickyBar/CountryStickyBar, PaymentModal/CountryPaymentModal,
 *  PackageComparisonTable, тизеры paywall (LockedSection/LockedCities/
 *  LockedCountryFacts/PricesTable/MonthlyBudget/Calculator), CTA сравнения
 *  городов/стран и BlogReportCTA.
 *
 *  `size` — сторона квадратной иконки в px (по умолчанию 20 — средний
 *  размер среди точек вызова, подбирается на месте под контекст — рядом с
 *  text-xs нужно меньше, в заголовке paywall-карточки больше).
 *  `className` — цвет (иконка берёт currentColor) и доп. Tailwind-утилиты.
 *
 *  inline-block + отрицательный vertical-align — без этого <svg> внутри
 *  строки текста подвешивается выше базовой линии (стандартное поведение
 *  инлайновых SVG), а тут она должна сидеть на одной линии с соседним
 *  текстом/ценой, как сидел эмодзи. */
export function PackageIcon({
  pkg,
  size = 20,
  className = "",
}: {
  pkg: PackageType;
  size?: number;
  className?: string;
}) {
  const Icon = PACKAGE_ICON[pkg];
  return (
    <Icon
      width={size}
      height={size}
      className={`inline-block shrink-0 align-[-0.2em] ${className}`.trim()}
    />
  );
}

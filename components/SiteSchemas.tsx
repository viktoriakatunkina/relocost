import { CITY_PACKAGES, COUNTRY_PACKAGES } from "@/lib/packages";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

// lib/packages.ts (в отличие от lib/unlocked.ts) НЕ помечен "use client" —
// это чистые данные без React/localStorage, поэтому его безопасно
// импортировать сюда, в серверный компонент, без риска затянуть клиентскую
// границу. Цены пакетов больше не дублируются литералами.
const ALL_PACKAGE_PRICES = [
  CITY_PACKAGES.places.price,
  CITY_PACKAGES.budget.price,
  CITY_PACKAGES.bundle.price,
  COUNTRY_PACKAGES.country_cities.price,
  COUNTRY_PACKAGES.country_overview.price,
];
const MAX_PACKAGE_PRICE = Math.max(...ALL_PACKAGE_PRICES);

export function SiteSchemas() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Relocost",
    alternateName: "Relocost — калькулятор стоимости жизни",
    url: SITE_URL,
    description:
      "Калькулятор стоимости жизни, реальные цены, визы и гайды для тех, кто планирует переезд.",
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Relocost",
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon`,
    description:
      "Сервис расчета стоимости жизни для людей, планирующих переезд внутри России или за рубеж.",
    sameAs: [],
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Relocost — калькулятор стоимости жизни",
    url: SITE_URL,
    applicationCategory: "TravelApplication",
    operatingSystem: "Any (веб-браузер)",
    description:
      "Калькулятор стоимости жизни для переезда: расчет месячного бюджета по городу (аренда, еда, транспорт, коммунальные платежи, кафе, здоровье, развлечения) на основе реальных цен, сравнение городов, подбор направления по бюджету и приоритетам.",
    featureList: [
      "Расчет месячного бюджета по городу с разбивкой по категориям расходов",
      "Сравнение стоимости жизни между двумя городами",
      "Тест подбора города переезда по бюджету и приоритетам",
      "Визовая и практическая информация по городам",
      "Лучшие места и районы по городу",
    ],
    // Базовый расчет бюджета бесплатный, детальные блоки — разовая покупка
    // от CITY_PACKAGES.places.price ₽ (см. lib/packages.ts). Не указываем
    // aggregateRating — реальных агрегированных отзывов о самом сервисе
    // (не о городах) на сайте нет, выдумывать рейтинг нельзя.
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: "0",
      highPrice: String(MAX_PACKAGE_PRICE),
      offerCount: "4",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
    </>
  );
}

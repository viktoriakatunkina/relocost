const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

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

  // Цены пакетов продублированы литералами (а не импортированы из
  // lib/unlocked.ts) намеренно: этот файл — серверный компонент, а
  // lib/unlocked.ts помечен "use client" (там же useState/useEffect для
  // localStorage) — импорт значений оттуда в серверный компонент рискует
  // затянуть клиентскую границу туда, где она не нужна. При изменении цен
  // пакетов в lib/unlocked.ts (CITY_PACKAGES) не забудь обновить и здесь.
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
    // от 19 ₽ (см. lib/unlocked.ts CITY_PACKAGES). Не указываем
    // aggregateRating — реальных агрегированных отзывов о самом сервисе
    // (не о городах) на сайте нет, выдумывать рейтинг нельзя.
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: "0",
      highPrice: "59",
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

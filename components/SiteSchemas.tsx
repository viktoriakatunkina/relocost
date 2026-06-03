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
    </>
  );
}

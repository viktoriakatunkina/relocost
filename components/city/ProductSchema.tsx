import type { City } from "@/lib/types";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

const PACKAGES = [
  { id: "places", name: "Лучшие места", price: 79 },
  { id: "guide", name: "Гайд по жизни", price: 149 },
  { id: "budget", name: "Точный бюджет", price: 199 },
  { id: "bundle", name: "Все вместе", price: 299 },
] as const;

// ItemList с Offers по каждому пакету для конкретного города.
// Дает Google понимание, что страница продает 4 цифровых продукта.
export function ProductSchema({ city }: { city: City }) {
  const products = (city.is_foreign
    ? PACKAGES
    : PACKAGES.filter((p) => p.id !== "guide")
  ).map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: `${p.name} — ${city.name_ru}`,
      description: `Премиум-раздел гайда о переезде в ${city.name_ru}.`,
      brand: { "@type": "Brand", name: "Relocost" },
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "RUB",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/city/${city.slug}`,
      },
    },
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Цифровые гайды о переезде в ${city.name_ru}`,
    itemListElement: products,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

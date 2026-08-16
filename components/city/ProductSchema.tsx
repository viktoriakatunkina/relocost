import type { City } from "@/lib/types";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

const PACKAGES = [
  { id: "places", name: "Лучшие места", price: 19 },
  { id: "budget", name: "Все расходы", price: 49 },
  { id: "bundle", name: "Расходы + Места", price: 59 },
] as const;

// ItemList с Offers по каждому пакету для конкретного города.
// Дает Google понимание, что страница продает 3 цифровых продукта.
export function ProductSchema({ city }: { city: City }) {
  const products = PACKAGES.map((p, i) => ({
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

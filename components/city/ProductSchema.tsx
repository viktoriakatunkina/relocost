import type { City } from "@/lib/types";
import { CITY_PACKAGES } from "@/lib/packages";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

// 2026-09-22 (SEO-аудит): цены раньше были захардкожены (19/49/59) и разошлись
// с реальными ценами пакетов из lib/packages.ts (149/199/249). Теперь берем
// цены и подписи оттуда же, откуда их берет весь остальной UI — единый
// источник правды, разойтись больше не сможет.
const PACKAGE_IDS = ["places", "budget", "bundle"] as const;

// ItemList с Offers по каждому пакету для конкретного города.
// Дает Google понимание, что страница продает 3 цифровых продукта.
export function ProductSchema({ city }: { city: City }) {
  const products = PACKAGE_IDS.map((id, i) => {
    const pkg = CITY_PACKAGES[id];
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${pkg.short} — ${city.name_ru}`,
        description: `Премиум-раздел гайда о переезде в ${city.name_ru}.`,
        brand: { "@type": "Brand", name: "Relocost" },
        offers: {
          "@type": "Offer",
          price: pkg.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/city/${city.slug}`,
        },
      },
    };
  });

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

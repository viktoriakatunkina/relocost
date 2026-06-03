import type { City } from "@/lib/types";
import { unsplashSrc } from "@/lib/unsplash";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

export function CitySchema({ city }: { city: City }) {
  const image = unsplashSrc(city.unsplash_url, { w: 1200, q: 80 });

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Place", "City"],
    name: city.name_ru,
    alternateName: city.name_en,
    url: `${SITE_URL}/city/${city.slug}`,
    description: city.intro_text ?? city.seo_description ?? undefined,
    image: image ?? undefined,
    geo:
      city.lat !== null && city.lng !== null
        ? {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          }
        : undefined,
    containedInPlace: {
      "@type": "Country",
      name: city.country_ru,
      alternateName: city.country_en,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

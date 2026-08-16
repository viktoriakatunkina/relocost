import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { getPricesByCity } from "@/lib/prices";
import { getAnchorPrices } from "@/lib/anchor-prices";
import type { City } from "@/lib/types";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName, countryName } from "@/lib/i18n-content";
import { localizeCity } from "@/lib/content-i18n";
import { AnchorPrices } from "@/components/city/AnchorPrices";
import { PricesTable } from "@/components/city/PricesTable";
import { CrossLinks } from "@/components/CrossLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { data: city } = await supabase
    .from("cities")
    .select("name_ru")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) return {};
  return {
    title: `Цены в ${city.name_ru} 2026 — молоко, хлеб, бензин, кофе, аренда | Relocost`,
    description: `Сколько стоят продукты, аренда, транспорт и услуги в ${city.name_ru} в 2026 году. Цены на молоко, хлеб, кофе, бензин, билет в кино и ЖКХ — актуальные данные.`,
    alternates: buildAlternates(`/city/${params.slug}/prices`, params.locale),
    openGraph: {
      title: `Цены в ${city.name_ru} 2026`,
      description: `Продукты, аренда, транспорт и услуги в ${city.name_ru} — актуальные цены 2026 года.`,
      type: "website",
    },
  };
}

export default async function CityPricesPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);

  const { data: city } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) notFound();

  const c = await localizeCity(city as City, params.locale);
  const name = cityName(c, params.locale);
  const country = countryName(c, params.locale);

  const prices = await getPricesByCity(c.id);
  const anchorItems = getAnchorPrices(prices);

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: country, href: `/country/${c.country_slug}` },
          { name, href: `/city/${c.slug}` },
          { name: "Цены" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-2">
        <span className="eyebrow">База цен 2026</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-4">
          Цены в {name} 2026
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          Продукты, аренда, транспорт и услуги — актуальные данные. Диапазон
          «минимум–максимум» отражает разброс по районам и сезонам.
        </p>
      </section>

      <AnchorPrices items={anchorItems} />

      <PricesTable prices={prices} />

      <CrossLinks
        links={[
          { href: `/city/${c.slug}`, label: `${name} — всё о городе` },
          { href: `/city/${c.slug}/budget`, label: `Бюджет семьи в ${name}` },
          { href: `/country/${c.country_slug}`, label: `Жизнь в ${c.country_ru}` },
          ...(c.slug !== "moscow"
            ? [{ href: `/compare/${c.slug}-vs-moscow`, label: `${name} или Москва` }]
            : []),
          { href: "/rating", label: "Рейтинг городов" },
        ]}
      />

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { supabase, fetchWithHardTimeout, unwrapOrThrow } from "@/lib/supabase";
import { getPricesByCity } from "@/lib/prices";
import { getAnchorPrices } from "@/lib/anchor-prices";
import type { City } from "@/lib/types";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName, countryName } from "@/lib/i18n-content";
import { localizeCity } from "@/lib/content-i18n";
import { AnchorPrices } from "@/components/city/AnchorPrices";
import { PricesTable } from "@/components/city/PricesTable";
import { StickyBar } from "@/components/freemium/StickyBar";
import { getGlobalPurchaseCount } from "@/lib/purchase-counts";
import { CrossLinks } from "@/components/CrossLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  // 2026-10-28: аварийный флаг, см. тот же комментарий в city/[slug]/page.tsx.
  if (process.env.EMERGENCY_SKIP_SSG === "1") return [];
  try {
    const res = await fetchWithHardTimeout(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/cities?select=slug&limit=500`,
      {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      }
    );
    if (!res.ok) return [];
    const rows: { slug: string }[] = await res.json();
    return rows.flatMap((r) => [
      { locale: "ru", slug: r.slug },
      { locale: "en", slug: r.slug },
      { locale: "uz", slug: r.slug },
    ]);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const city = await unwrapOrThrow(
    supabase.from("cities").select("name_ru").eq("slug", params.slug).maybeSingle(),
    `city/[slug]/prices generateMetadata(${params.slug})`,
  );
  if (!city) return {};
  return {
    title: `Цены в ${city.name_ru} 2026 — молоко, хлеб, бензин, кофе, аренда | Relocost`,
    description: `Сколько стоят продукты, аренда, транспорт и услуги в ${city.name_ru} в 2026 году. Цены на молоко, хлеб, кофе, бензин, билет в кино и ЖКХ — актуальные данные.`,
    // 2026-10-28 (SEO-аудит, находка №3): canonical на родительскую
    // /city/{slug} вместо себя — та же логика, что в budget/page.tsx рядом
    // (см. комментарий там). Платный/бесплатный объём контента не меняем.
    alternates: buildAlternates(`/city/${params.slug}`, params.locale),
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

  const city = await unwrapOrThrow(
    supabase.from("cities").select("*").eq("slug", params.slug).maybeSingle(),
    `city/[slug]/prices getCity(${params.slug})`,
  );
  if (!city) notFound();

  const c = await localizeCity(city as City, params.locale);
  const name = cityName(c, params.locale);
  const country = countryName(c, params.locale);

  const [prices, purchaseCount] = await Promise.all([
    getPricesByCity(c.id),
    getGlobalPurchaseCount(),
  ]);
  const anchorItems = getAnchorPrices(prices);

  return (
    <main className="pb-36 md:pb-24">
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

      <PricesTable prices={prices} slug={c.slug} />

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

      <StickyBar
        slug={c.slug}
        isForeign={!!c.is_foreign}
        purchaseCount={purchaseCount}
        countrySlug={c.country_slug}
        countryName={c.country_ru}
      />
    </main>
  );
}

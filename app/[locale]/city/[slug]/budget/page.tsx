import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { getPricesByCity } from "@/lib/prices";
import {
  getMoscowBaseline,
  cityVsMoscow,
  moscowSecondPerson,
} from "@/lib/moscow-baseline";
import { cityIn } from "@/lib/city-prepositional";
import { getAnchorPrices } from "@/lib/anchor-prices";
import type { City } from "@/lib/types";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName, countryName } from "@/lib/i18n-content";
import { localizeCity } from "@/lib/content-i18n";
import { AnchorPrices } from "@/components/city/AnchorPrices";
import { MonthlyBudget } from "@/components/city/MonthlyBudget";
import { Calculator } from "@/components/city/Calculator";
import { CostVsMoscow } from "@/components/city/CostVsMoscow";
import { SecondPersonSummary } from "@/components/city/SecondPersonSummary";
import { EarnEquivalent } from "@/components/city/EarnEquivalent";
import { CrossLinks } from "@/components/CrossLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;
// Страницы бюджета рендерятся по первому запросу и кешируются ISR.
export const dynamicParams = true;

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
    title: `Бюджет семьи в ${city.name_ru} 2026 — сколько нужно денег | Relocost`,
    description: `Расходы на жизнь в ${city.name_ru} 2026: продукты, аренда, транспорт, ЖКХ. Бюджет для одного, пары и семьи с детьми. Реальные цены и сравнение с Москвой.`,
    alternates: buildAlternates(`/city/${params.slug}/budget`, params.locale),
    openGraph: {
      title: `Бюджет в ${city.name_ru} 2026`,
      description: `Сколько нужно денег на жизнь в ${city.name_ru}: еда, аренда, транспорт, ЖКХ — для одного, пары и семьи.`,
      type: "website",
    },
  };
}

export default async function CityBudgetPage({
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

  const [prices, moscowBaseline] = await Promise.all([
    getPricesByCity(c.id),
    getMoscowBaseline(),
  ]);

  const anchorItems = getAnchorPrices(prices);
  const moscowComparison =
    c.slug === "moscow" ? null : cityVsMoscow(prices, moscowBaseline);
  const moscowSecondPersonText = moscowSecondPerson(
    moscowComparison,
    cityIn(c.slug, c.name_ru),
  );

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: country, href: `/country/${c.country_slug}` },
          { name, href: `/city/${c.slug}` },
          { name: "Бюджет на жизнь" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-2">
        <span className="eyebrow">Расходы и бюджет</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-4">
          Бюджет для жизни в {name} 2026
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          Сколько нужно денег одному, паре и семье с детьми — реальные расходы
          на еду, аренду, транспорт и ЖКХ.
        </p>
      </section>

      <AnchorPrices items={anchorItems} />

      <MonthlyBudget prices={prices} cityName={name} slug={c.slug} />

      <Calculator slug={c.slug} prices={prices} cityName={name} />

      {moscowComparison && (
        <>
          <CostVsMoscow cityName={name} comparison={moscowComparison} />
          {moscowSecondPersonText && (
            <section className="max-w-4xl mx-auto px-6 pt-6">
              <SecondPersonSummary
                eyebrow="Что это значит для Вас"
                text={moscowSecondPersonText}
              />
            </section>
          )}
          <EarnEquivalent
            cityName={name}
            avgDiff={moscowComparison.avgDiff}
          />
        </>
      )}

      <CrossLinks
        links={[
          { href: `/city/${c.slug}`, label: `${name} — всё о городе` },
          { href: `/city/${c.slug}/prices`, label: `Все цены в ${name}` },
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

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { supabase, fetchWithHardTimeout } from "@/lib/supabase";
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
import { BudgetFAQ, buildBudgetFaqItems } from "@/components/city/BudgetFAQ";
import { MonthlyBudget } from "@/components/city/MonthlyBudget";
import { Calculator } from "@/components/city/Calculator";
import { CostVsMoscow } from "@/components/city/CostVsMoscow";
import { SecondPersonSummary } from "@/components/city/SecondPersonSummary";
import { EarnEquivalent } from "@/components/city/EarnEquivalent";
import { CrossLinks } from "@/components/CrossLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/freemium/StickyBar";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
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
  const cityPrepositional = cityIn(c.slug, c.name_ru);
  const moscowSecondPersonText = moscowSecondPerson(
    moscowComparison,
    cityPrepositional,
  );

  // FAQ строится из тех же чисел, что уже показаны на странице (бюджет по
  // категориям, состав семьи, сравнение с Москвой) — см. BudgetFAQ.
  // Только для ru: тексты вопросов русские, а на /en и /uz отдавать
  // русскоязычную FAQPage-разметку смысла нет.
  const faqItems =
    params.locale === "ru"
      ? buildBudgetFaqItems({
          cityIn: cityPrepositional,
          prices,
          avgDiff: moscowComparison?.avgDiff ?? null,
        })
      : [];

  return (
    <main className="pb-36 md:pb-24">
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
            slug={c.slug}
            cityName={name}
            avgDiff={moscowComparison.avgDiff}
          />
        </>
      )}

      <BudgetFAQ items={faqItems} />

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

      {/* Закреплённая панель покупки. 2026-09-09: на этой подстранице её не
          было вообще, хотя оба блока выше (MonthlyBudget и Calculator) стоят
          под тем же paywall'ом «Расходы» 49 ₽, а трафик у /budget заметный —
          151 посетитель за 30 дней (16% от трафика городских страниц).
          На /city/[slug]/prices такая панель уже стоит. */}
      <StickyBar slug={c.slug} isForeign={!!c.is_foreign} />
    </main>
  );
}

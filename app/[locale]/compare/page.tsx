import { getTranslations, setRequestLocale } from "next-intl/server";
import { parsePair, topComparePairs } from "@/lib/compare";
import { countryComparePairSlugs } from "@/lib/compare-countries";
import { getAllCitiesForSearch } from "@/lib/cities";
import { getAllCountriesForSearch } from "@/lib/countries";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { CrossLinks } from "@/components/CrossLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export const revalidate = 86400;

// Хаб-страница для всех готовых /compare/<a>-vs-<b>: раньше точки входа не
// было вообще (curl /compare → 404, страница существовала только как
// динамический [pair]) — ни в навигации, ни со списком пар. Независимо нашли
// эту дыру SEO/UI/продукт/growth-специалисты в ночном аудите 2026-10-28/29.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "Сравнение городов и стран для переезда 2026 | Relocost",
    description:
      "Готовые сравнения городов и стран по стоимости жизни, аренде, продуктам и сложности переезда — или выберите два города сами и сравните бюджет на 2026 год.",
    alternates: buildAlternates("/compare", params.locale),
    openGraph: {
      title: "Сравнение городов и стран для переезда",
      description:
        "Где дешевле жить и проще переехать — сравнение по реальным ценам.",
      type: "website",
    },
  };
}

export default async function CompareHubPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");

  // Тот же источник пар, что у sitemap.ts (app/sitemap.ts): topComparePairs()
  // для городов (66 канонических пар среди TOP_COMPARE_SLUGS, lib/compare.ts)
  // + countryComparePairSlugs() для стран (23 пары, lib/compare-countries.ts).
  // В сумме 89 — ровно то же число, на которое независимо вышли все четыре
  // специалиста в аудите.
  const [cityPairSlugs, allCities, allCountries] = await Promise.all([
    topComparePairs(),
    getAllCitiesForSearch(),
    getAllCountriesForSearch(),
  ]);
  const countryPairSlugs = countryComparePairSlugs();

  const cityMap = new Map(allCities.map((c) => [c.slug, c]));
  const countryMap = new Map(allCountries.map((c) => [c.slug, c]));

  const cityPairs = cityPairSlugs
    .map((pair) => {
      const parsed = parsePair(pair);
      if (!parsed) return null;
      const a = cityMap.get(parsed[0]);
      const b = cityMap.get(parsed[1]);
      if (!a || !b) return null;
      return {
        pair,
        label: `${a.flag_emoji ?? ""} ${a.name_ru} или ${b.flag_emoji ?? ""} ${b.name_ru}`.trim(),
      };
    })
    .filter((x): x is { pair: string; label: string } => Boolean(x))
    .sort((x, y) => x.label.localeCompare(y.label, "ru"));

  const countryPairs = countryPairSlugs
    .map((pair) => {
      const parsed = parsePair(pair);
      if (!parsed) return null;
      const a = countryMap.get(parsed[0]);
      const b = countryMap.get(parsed[1]);
      if (!a || !b) return null;
      return {
        pair,
        label: `${a.flag_emoji ?? ""} ${a.name_ru} или ${b.flag_emoji ?? ""} ${b.name_ru}`.trim(),
      };
    })
    .filter((x): x is { pair: string; label: string } => Boolean(x))
    .sort((x, y) => x.label.localeCompare(y.label, "ru"));

  const pickerCities = allCities.map((c) => ({
    slug: c.slug,
    name_ru: c.name_ru,
    country_ru: c.country_ru,
  }));

  const total = cityPairs.length + countryPairs.length;

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: tc("compare") }]}
      />

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10">
        <span className="eyebrow">Сравнение</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-5 max-w-3xl">
          Где дешевле жить — сравните два города
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          {total} готовых сравнений по аренде, продуктам, транспорту, ЖКХ и
          сложности переезда — или выберите свою пару городов ниже.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-14">
        <ComparePicker cities={pickerCities} />
      </section>

      {cityPairs.length > 0 && (
        <CrossLinks
          title="Сравнения городов"
          links={cityPairs.map((p) => ({
            href: `/compare/${p.pair}`,
            label: p.label,
          }))}
        />
      )}

      {countryPairs.length > 0 && (
        <CrossLinks
          title="Сравнения стран"
          links={countryPairs.map((p) => ({
            href: `/compare/${p.pair}`,
            label: p.label,
          }))}
        />
      )}

      <CrossLinks
        title="Смотрите также"
        links={[
          { href: "/rating", label: "Рейтинг городов по стоимости жизни" },
          { href: "/countries", label: "Все страны" },
          { href: "/search", label: "Подобрать город" },
        ]}
      />

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}

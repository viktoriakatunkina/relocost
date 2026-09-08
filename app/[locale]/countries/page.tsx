import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCountriesAggregated } from "@/lib/countries";
import { CountryCard } from "@/components/country/CountryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { getSiteStats } from "@/lib/site-stats";
import { Link } from "@/i18n/navigation";
import { COUNTRY_COMPARE_PAIRS } from "@/lib/compare-countries";
import { COUNTRY_NAMES_RU } from "@/lib/countries-content";

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  const { countryCount } = await getSiteStats();
  return {
    title: "Страны для переезда в 2026 году — гайды и цены | Relocost",
    description: `${countryCount} стран для релокации из России: Грузия, Армения, Турция, Кипр, Сербия, Таиланд и другие. Цены жизни, визы, города и реальные отзывы переехавших.`,
    alternates: buildAlternates("/countries", params.locale),
    openGraph: {
      title: "Страны для переезда в 2026 году — гайды и цены",
      description: `${countryCount} стран для релокации из России: цены, визы, города и отзывы переехавших.`,
      type: "website" as const,
    },
  };
}

export default async function CountriesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const countries = await getAllCountriesAggregated();
  const foreign = countries.filter((c) => c.is_foreign);
  const domestic = countries.filter((c) => !c.is_foreign);
  const totalCities = countries.reduce((acc, c) => acc + c.city_count, 0);
  // Города по РФ — не «1» (число стран в блоке «Внутри России», там всегда
  // будет 1 запись — Россия), а сумма городов внутри нее. Раньше чип показывал
  // domestic.length («1 по России»), что противоречило карточке «Россия —
  // 7 городов» чуть ниже на той же странице.
  const domesticCities = domestic.reduce((acc, c) => acc + c.city_count, 0);

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs items={[{ name: tc("home"), href: "/" }, { name: tn("countries") }]} />

      <section className="relative px-6 pt-12 pb-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 20% 10%, rgba(216,148,120,0.18), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(106,120,77,0.25), transparent 55%)",
          }}
        />
        <div className="max-w-6xl mx-auto">
          <span className="eyebrow">Каталог направлений</span>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mt-6 mb-4 text-balance tracking-tight">
            Страны для переезда <span className="text-copper italic">в 2026</span>
          </h1>
          <p className="text-brandy/85 text-lg md:text-xl max-w-2xl text-pretty mb-10">
            Реальные цены жизни, визы для россиян и опыт переехавших — {totalCities} городов в {foreign.length} странах для релокации.
          </p>
          <div className="flex flex-wrap gap-3">
            <Stat value={totalCities} label="городов всего" />
            <Stat value={foreign.length} label="стран за рубежом" />
            <Stat value={domesticCities} label="городов по России" />
          </div>
        </div>
      </section>

      {foreign.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-cream">
              За рубежом
            </h2>
          </div>
          {/* Сетка на всех размерах экрана: 2 колонки на мобильном вместо
              бесконечного горизонтального скролла через 79 карточек подряд —
              так видно сразу несколько стран, и дальше можно просто
              проскроллить вниз, а не «до бесконечности» вбок. */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 items-stretch">
            {foreign.map((c, i) => (
              <Reveal key={c.slug} delay={i * 40} className="h-full">
                <CountryCard country={c} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {domestic.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-cream">
              Внутри России
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 items-stretch">
            {domestic.map((c, i) => (
              <Reveal key={c.slug} delay={i * 40} className="h-full">
                <CountryCard country={c} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Популярные сравнения стран — точка входа для краулера и для запросов
          вида «X или Y», которые Яндекс.Suggest отдает на уровне стран.
          Страницы /compare/<a>-vs-<b> новые, и кроме sitemap внутренних
          ссылок на них раньше не было. */}
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
          Где дешевле жить: сравнения стран
        </h2>
        <p className="text-brandy/70 mb-8 max-w-3xl">
          Стоимость жизни, аренда, виза и сложность переезда — двумя колонками,
          по реальным ценам городов из базы.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {COUNTRY_COMPARE_PAIRS.map(([x, y]) => {
            const [first, second] = [x, y].sort();
            return (
              <Link
                key={`${first}-${second}`}
                href={`/compare/${first}-vs-${second}`}
                className="inline-flex items-center px-4 py-2.5 rounded-pill bg-surface border hairline text-brandy/85 text-sm hover:text-copper hover:border-copper/40 transition"
              >
                {COUNTRY_NAMES_RU[x] ?? x} или {COUNTRY_NAMES_RU[y] ?? y}
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-pill bg-surface border hairline">
      <span className="font-serif text-2xl text-cream tabular-nums">{value}</span>
      <span className="text-brandy/65 text-xs uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
}

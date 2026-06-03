import { notFound } from "next/navigation";
import {
  COUNTRY_CONTENT,
  COUNTRY_NAMES_RU,
} from "@/lib/countries-content";
import {
  getAllCountrySlugs,
  getCitiesInCountry,
  getCountryMeta,
} from "@/lib/countries";
import { CountryHero } from "@/components/country/CountryHero";
import { CountryFAQ } from "@/components/country/CountryFAQ";
import { CityCard } from "@/components/CityCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getAllCountrySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const name = COUNTRY_NAMES_RU[params.slug];
  if (!name) return {};
  return {
    title: `Переезд в ${name} в 2026 году — города, цены, виза | Relocost`,
    description: `Сколько стоит переехать в ${name}? Цены, города, визы для россиян, опыт переехавших. Калькулятор бюджета по каждому городу.`,
    alternates: { canonical: `/country/${params.slug}` },
    openGraph: {
      title: `Переезд в ${name} в 2026 году — города, цены, виза`,
      description: `Сколько стоит переехать в ${name}? Цены, города, визы для россиян.`,
      type: "website",
      url: `/country/${params.slug}`,
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [meta, cities, content] = await Promise.all([
    getCountryMeta(params.slug),
    getCitiesInCountry(params.slug),
    Promise.resolve(COUNTRY_CONTENT[params.slug] ?? null),
  ]);
  if (!meta) notFound();

  const countryName = COUNTRY_NAMES_RU[params.slug] ?? meta.country_ru;
  const gradient =
    content?.hero_gradient ?? "from-kombu-green/60 via-pine-tree to-pine-tree";

  return (
    <main className="pb-24">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: countryName },
        ]}
      />
      <CountryHero
        countryRu={countryName}
        flagEmoji={meta.flag_emoji}
        citiesCount={cities.length}
        gradient={gradient}
      />

      {content && (
        <section className="max-w-4xl mx-auto px-6 pt-16">
          <p className="text-brandy/90 text-lg md:text-xl leading-relaxed">
            {content.intro}
          </p>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 pt-16">
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
          Города {countryName === "Россия" ? "России" : countryName}
        </h2>
        {cities.length === 0 ? (
          <p className="text-brandy/70">Города пока не добавлены.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {cities.map((c, i) => (
              <CityCard key={c.id} city={c} index={i} />
            ))}
          </div>
        )}
      </section>

      {content && (
        <section className="max-w-6xl mx-auto px-6 pt-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
            О стране
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <Fact title="Климат" text={content.climate} />
            <Fact title="Менталитет" text={content.mentality} />
            <Fact title="Язык" text={content.language_note} />
            <Fact
              title="Виза для россиян"
              text={content.visa_note}
              accent
            />
          </div>
        </section>
      )}

      {content && (
        <section className="max-w-6xl mx-auto px-6 pt-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
            Общая сложность переезда
          </h2>
          <p className="text-brandy/70 mb-6">
            Усреднённая оценка по всем городам страны — от 1 (легко) до 5
            (трудно).
          </p>
          <div className="flex items-center gap-3 max-w-md">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`h-3 flex-1 rounded-full ${
                  n <= content.difficulty_overall
                    ? content.difficulty_overall <= 2
                      ? "bg-emerald-400/80"
                      : content.difficulty_overall === 3
                      ? "bg-amber-400/80"
                      : "bg-pale-copper"
                    : "bg-kombu-green/60"
                }`}
              />
            ))}
            <span className="text-cream tabular-nums ml-3 whitespace-nowrap">
              {content.difficulty_overall}/5
            </span>
          </div>
        </section>
      )}

      {content && <CountryFAQ countryName={countryName} content={content} />}

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}

function Fact({
  title,
  text,
  accent,
}: {
  title: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-6 md:p-7 rounded-2xl border ${
        accent
          ? "bg-pale-copper/15 border-pale-copper/40"
          : "bg-kombu-green/40 border-dingley/30"
      }`}
    >
      <h3 className="font-serif text-xl text-cream mb-3">{title}</h3>
      <p className="text-brandy/90 leading-relaxed">{text}</p>
    </div>
  );
}

import { getAllCountriesAggregated } from "@/lib/countries";
import { CountryCard } from "@/components/country/CountryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const revalidate = 86400;

export const metadata = {
  title: "Страны для переезда в 2026 году — гайды и цены | Relocost",
  description:
    "25 стран для релокации из России: Грузия, Армения, Турция, Кипр, Сербия, Таиланд и другие. Цены жизни, визы, города и реальные отзывы переехавших.",
  alternates: { canonical: "/countries" },
  openGraph: {
    title: "Страны для переезда в 2026 году — гайды и цены",
    description:
      "25 стран для релокации из России: цены, визы, города и отзывы переехавших.",
    type: "website" as const,
    url: "/countries",
  },
};

export default async function CountriesPage() {
  const countries = await getAllCountriesAggregated();
  const foreign = countries.filter((c) => c.is_foreign);
  const domestic = countries.filter((c) => !c.is_foreign);
  const totalCities = countries.reduce((acc, c) => acc + c.city_count, 0);

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ name: "Главная", href: "/" }, { name: "Страны" }]} />

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
            {countries.length} стран и {totalCities} городов: реальные цены жизни, виза для россиян и опыт переехавших.
          </p>
          <div className="flex flex-wrap gap-3">
            <Stat value={countries.length} label="стран" />
            <Stat value={totalCities} label="городов" />
            <Stat value={foreign.length} label="зарубежных" />
            <Stat value={domestic.length} label="по России" />
          </div>
        </div>
      </section>

      {foreign.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-cream">
              За рубежом
            </h2>
            <span className="chip">{foreign.length} стран</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {foreign.map((c, i) => (
              <Reveal key={c.slug} delay={i * 40}>
                <CountryCard country={c} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {domestic.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-cream">
              Внутри России
            </h2>
            <span className="chip">{domestic.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {domestic.map((c, i) => (
              <Reveal key={c.slug} delay={i * 40}>
                <CountryCard country={c} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

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

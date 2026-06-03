import Image from "next/image";
import Link from "next/link";
import { getAllCitiesForSearch, getPopularCities } from "@/lib/cities";
import { getPublishedPosts } from "@/lib/blog";
import { getAllCountriesAggregated } from "@/lib/countries";
import { CityCard } from "@/components/CityCard";
import { CountryCard } from "@/components/country/CountryCard";
import { SearchBar } from "@/components/SearchBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { BlogPreview } from "@/components/BlogPreview";
import { Reveal } from "@/components/Reveal";
import { SiteSchemas } from "@/components/SiteSchemas";
import { Footer } from "@/components/Footer";
import { typo } from "@/lib/typography";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Relocost — калькулятор стоимости жизни для переезжающих",
    description:
      "Считаем реальный бюджет на жизнь в любом городе. Цены, отзывы и гайды по 10+ направлениям.",
    type: "website" as const,
    url: "/",
  },
};

export const revalidate = 86400;

export default async function HomePage() {
  const [popular, searchItems, posts, allCountries] = await Promise.all([
    getPopularCities(6),
    getAllCitiesForSearch(),
    getPublishedPosts(3),
    getAllCountriesAggregated(),
  ]);
  const countriesPreview = allCountries.slice(0, 8);

  return (
    <>
      <SiteSchemas />
      <section className="relative isolate min-h-[92vh] flex flex-col justify-center px-6 py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover -z-20 opacity-55"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(26,33,5,0.65) 0%, rgba(26,33,5,0.85) 55%, rgba(26,33,5,0.98) 100%), radial-gradient(ellipse at 15% 20%, rgba(216,148,120,0.25) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(106,120,77,0.4) 0%, transparent 55%)",
          }}
          aria-hidden
        />

        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-8 fade-up" style={{ animationDelay: "0ms" }}>
            <span className="h-px w-12 bg-copper" />
            <p className="text-copper font-medium tracking-[0.18em] uppercase text-xs">
              Калькулятор переезда · 2026
            </p>
          </div>
          <h1
            className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] text-cream leading-[1.02] mb-8 fade-up text-balance text-shadow-hero"
            style={{ animationDelay: "120ms", letterSpacing: "-0.02em" }}
          >
            Сколько стоит <span className="text-copper italic">пере&shy;ехать</span>
            <br className="hidden md:block" /> в другой город или страну?
          </h1>
          <p
            className="text-cream/95 text-lg md:text-2xl max-w-2xl mb-12 fade-up text-pretty leading-relaxed text-shadow-body"
            style={{ animationDelay: "240ms" }}
          >
            {typo(`Аренда, еда, транспорт, виза — собираем честный месячный бюджет по ${searchItems.length} городам России и зарубежья.`)}
          </p>

          <div className="fade-up max-w-2xl" style={{ animationDelay: "360ms" }}>
            <SearchBar items={searchItems} />
          </div>

          <div className="mt-16 grid grid-cols-3 max-w-2xl gap-6 fade-up" style={{ animationDelay: "480ms" }}>
            <HeroStat value={String(searchItems.length)} label="городов" />
            <HeroStat value={String(searchItems.length * 20)} label="цен в базе" />
            <HeroStat value={String(allCountries.length)} label="стран" />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brandy/75 text-xs flex flex-col items-center gap-2 fade-in text-shadow-body" style={{ animationDelay: "800ms" }}>
          <span className="uppercase tracking-[0.18em]">Листайте</span>
          <span className="w-px h-8 bg-copper/70" />
        </div>
      </section>

      <section id="popular" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12 gap-6">
              <div>
                <span className="eyebrow">Куда переезжают</span>
                <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 text-balance">
                  Популярные направления
                </h2>
                <p className="text-brandy/75 text-lg mt-4 max-w-xl text-pretty">
                  {typo("Города с большим русскоязычным комьюнити, понятной визой и доступной арендой.")}
                </p>
              </div>
              <span className="hidden md:inline-flex chip chip-accent shrink-0">
                {popular.length} городов
              </span>
            </div>
          </Reveal>

          {popular.length === 0 ? (
            <p className="text-brandy/70">
              Города пока не заполнены — загляни позже.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((city, i) => (
                <Reveal key={city.id} delay={i * 60}>
                  <CityCard city={city} index={i} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border hairline text-cream/90 hover:text-cream hover:border-copper transition"
            >
              Все {searchItems.length} направлений
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <section id="countries" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12 gap-6">
              <div>
                <span className="eyebrow">По странам</span>
                <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 text-balance">
                  Каталог стран
                </h2>
                <p className="text-brandy/75 text-lg mt-4 max-w-xl text-pretty">
                  {typo("Выберите направление: для каждой страны — список городов, цены, визовые шаги и общая сложность переезда.")}
                </p>
              </div>
              <span className="hidden md:inline-flex chip chip-accent shrink-0">
                {allCountries.length} стран
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {countriesPreview.map((c, i) => (
              <Reveal key={c.slug} delay={i * 40}>
                <CountryCard country={c} />
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/countries"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border hairline text-cream/90 hover:text-cream hover:border-copper transition"
            >
              Все {allCountries.length} стран
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <BlogPreview posts={posts} />
      </Reveal>
      <Reveal>
        <CTABanner />
      </Reveal>
      <Footer />
    </>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-copper/40 pl-4">
      <div className="font-serif text-3xl md:text-4xl text-cream leading-none">{value}</div>
      <div className="text-brandy/65 text-xs uppercase tracking-[0.15em] mt-2">{label}</div>
    </div>
  );
}

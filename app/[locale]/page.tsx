import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCitiesForSearch, getPopularCities } from "@/lib/cities";
import { getPublishedPosts } from "@/lib/blog";
import {
  getAllCountriesAggregated,
  getAllCountriesForSearch,
} from "@/lib/countries";
import type { SearchItem } from "@/components/SearchBar";
import { CityCard } from "@/components/CityCard";
import { CountryCard } from "@/components/country/CountryCard";
import { SearchBar } from "@/components/SearchBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { BlogPreview } from "@/components/BlogPreview";
import { Reveal } from "@/components/Reveal";
import { SiteSchemas } from "@/components/SiteSchemas";
import { Footer } from "@/components/Footer";
import { HeroMist, WarmOrbs } from "@/components/decor/Atmosphere";
import { buildAlternates } from "@/lib/i18n-seo";
import { routing, type Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  // openGraph не переопределяем здесь — наследуем из layout (там per-locale
  // og:locale ru_RU / en_US / uz_UZ). Задаём только canonical/hreflang.
  return {
    alternates: buildAlternates("/", params.locale),
  };
}

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [popular, cities, posts, allCountries, searchCountries] =
    await Promise.all([
      getPopularCities(6),
      getAllCitiesForSearch(),
      getPublishedPosts(3),
      getAllCountriesAggregated(),
      getAllCountriesForSearch(),
    ]);
  const countriesPreview = allCountries.slice(0, 8);

  const cityCount = cities.length;
  const searchItems: SearchItem[] = [
    ...searchCountries.map((c) => ({
      type: "country" as const,
      href: `/country/${c.slug}`,
      name_ru: c.name_ru,
      country_ru: "",
      name_en: c.name_en,
      flag_emoji: c.flag_emoji,
    })),
    ...cities.map((c) => ({
      type: "city" as const,
      href: `/city/${c.slug}`,
      name_ru: c.name_ru,
      country_ru: c.country_ru,
      name_en: "",
      flag_emoji: c.flag_emoji,
    })),
  ];

  return (
    <>
      <SiteSchemas />
      <section className="relative isolate min-h-[92vh] flex flex-col justify-center px-6 py-12 overflow-hidden">
        <Image
          src="https://ftkyoneazoqlkrpisdef.supabase.co/storage/v1/object/public/photos/u/20948fab5b417674.jpg"
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

        <HeroMist />

        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-8 fade-up" style={{ animationDelay: "0ms" }}>
            <span className="h-px w-12 bg-copper" />
            <p className="text-copper font-medium tracking-[0.18em] uppercase text-xs">
              {t("eyebrow")}
            </p>
          </div>
          <h1
            className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] text-cream leading-[1.02] mb-8 fade-up text-balance text-shadow-hero"
            style={{ animationDelay: "120ms", letterSpacing: "-0.02em" }}
          >
            {t("heroTitlePre")}
            <span className="text-copper italic">{t("heroTitleAccent")}</span>
            {t("heroTitlePost")}
          </h1>
          <p
            className="text-cream/95 text-lg md:text-2xl max-w-2xl mb-12 fade-up text-pretty leading-relaxed text-shadow-body font-medium"
            style={{ animationDelay: "240ms" }}
          >
            {t("heroSubtitle", { count: cityCount })}
          </p>

          <div className="fade-up max-w-2xl relative z-30" style={{ animationDelay: "360ms" }}>
            <SearchBar items={searchItems} />
          </div>

          <div className="mt-16 grid grid-cols-3 max-w-2xl gap-6 fade-up relative z-10" style={{ animationDelay: "480ms" }}>
            <HeroStat value={String(cityCount)} label={t("statCities")} accent="#E89B6E" />
            <HeroStat value={String(allCountries.length)} label={t("statCountries")} accent="#E0A93E" />
            <HeroStat value="7" label={t("statCategories")} accent="#7FA8B8" />
          </div>
        </div>
      </section>

      <section id="popular" className="relative isolate overflow-hidden py-12 px-6">
        <WarmOrbs className="-z-10" />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-6 gap-6">
              <div>
                <span className="eyebrow">{t("popularEyebrow")}</span>
                <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 text-balance">
                  {t("popularTitle")}
                </h2>
                <p className="text-brandy/80 text-lg mt-4 max-w-xl text-pretty font-medium">
                  {t("popularSubtitle")}
                </p>
              </div>
            </div>
          </Reveal>

          {popular.length === 0 ? (
            <p className="text-brandy/70">{t("popularEmpty")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((city, i) => (
                <Reveal key={city.id} delay={i * 60}>
                  <CityCard city={city} index={i} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border hairline text-cream/90 hover:text-cream hover:border-copper transition"
            >
              {tc("allCities", { count: cityCount })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <section id="countries" className="relative isolate overflow-hidden py-12 px-6">
        <WarmOrbs className="-z-10" />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-6 gap-6">
              <div>
                <span className="eyebrow">{t("countriesEyebrow")}</span>
                <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 text-balance">
                  {t("countriesTitle")}
                </h2>
                <p className="text-brandy/80 text-lg mt-4 max-w-xl text-pretty font-medium">
                  {t("countriesSubtitle")}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {countriesPreview.map((c, i) => (
              <Reveal key={c.slug} delay={i * 40}>
                <CountryCard country={c} />
              </Reveal>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/countries"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border hairline text-cream/90 hover:text-cream hover:border-copper transition"
            >
              {tc("allCountries", { count: allCountries.length })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <HowItWorks cityCount={cityCount} />
      </Reveal>
      <Reveal>
        <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
          <div className="relative overflow-hidden rounded-3xl border border-copper/30 bg-copper/10 p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <span className="eyebrow">Не знаете, с чего начать</span>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mt-4 mb-3">
                Пройдите тест «Куда мне переехать?»
              </h2>
              <p className="text-brandy/80 text-lg max-w-xl text-pretty">
                6 вопросов о бюджете, климате и приоритетах — и персональная
                подборка городов из нашей базы за минуту.
              </p>
            </div>
            <Link
              href="/quiz"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-semibold text-lg hover:bg-brandy transition"
            >
              Пройти тест
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <BlogPreview posts={posts} />
      </Reveal>
      <Reveal>
        <CTABanner cityCount={cityCount} countryCount={allCountries.length} />
      </Reveal>
      <Footer />
    </>
  );
}

function HeroStat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border px-4 py-5 text-center backdrop-blur-sm"
      style={{ background: `${accent}1A`, borderColor: `${accent}55` }}
    >
      <div
        className="font-serif text-3xl md:text-5xl leading-none tabular-nums lining-nums"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="text-cream/75 text-[0.7rem] uppercase tracking-[0.18em] mt-2.5 font-medium leading-tight">
        {label}
      </div>
    </div>
  );
}

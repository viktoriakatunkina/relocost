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
import { MobileCarousel } from "@/components/MobileCarousel";
import { SearchBar } from "@/components/SearchBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { BlogPreview } from "@/components/BlogPreview";
import { CrowdPriceFeed } from "@/components/CrowdPriceFeed";
import { getCrowdPricesCount } from "@/lib/crowd-prices";
import { Reveal } from "@/components/Reveal";
import { SiteSchemas } from "@/components/SiteSchemas";
import { Footer } from "@/components/Footer";
import { HeroMist, WarmOrbs } from "@/components/decor/Atmosphere";
import { buildAlternates } from "@/lib/i18n-seo";
import { type Locale } from "@/i18n/routing";

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
  return [];
}

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [popular, cities, posts, allCountries, searchCountries, crowdCount] =
    await Promise.all([
      getPopularCities(6),
      getAllCitiesForSearch(),
      getPublishedPosts(3),
      getAllCountriesAggregated(),
      getAllCountriesForSearch(),
      getCrowdPricesCount(),
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
          src="https://ftkyoneazoqlkrpisdef.supabase.co/storage/v1/object/public/photos/home/hero-v2.jpg"
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

          {/* Быстрый доступ к популярным городам прямо под поиском */}
          <div className="fade-up mt-4 flex flex-wrap gap-2 max-w-2xl relative z-20" style={{ animationDelay: "420ms" }}>
            <span className="text-brandy/50 text-xs self-center pr-1">Популярно:</span>
            {[
              { slug: "tbilisi", name: "Тбилиси 🇬🇪" },
              { slug: "belgrade", name: "Белград 🇷🇸" },
              { slug: "dubai", name: "Дубай 🇦🇪" },
              { slug: "bali", name: "Бали 🇮🇩" },
              { slug: "yerevan", name: "Ереван 🇦🇲" },
              { slug: "limassol", name: "Лимасол 🇨🇾" },
              { slug: "almaty", name: "Алматы 🇰🇿" },
              { slug: "tashkent", name: "Ташкент 🇺🇿" },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                className="px-3 py-1.5 rounded-pill bg-surface/70 border border-cream/15 text-cream/85 text-sm hover:bg-copper/15 hover:border-copper/40 hover:text-cream backdrop-blur-sm transition"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Явная CTA-кнопка для тех, кто не хочет набирать в поиске */}
          <div className="fade-up mt-7 flex items-center gap-4 flex-wrap relative z-10" style={{ animationDelay: "460ms" }}>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-semibold text-base hover:bg-pale-copper transition shadow-glow"
            >
              Подобрать город по своим критериям
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-5 py-4 rounded-pill border border-cream/20 text-cream/80 text-sm hover:text-cream hover:border-copper/40 backdrop-blur-sm transition"
            >
              Пройти тест «Куда переехать?»
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 max-w-2xl gap-3 sm:gap-5 fade-up relative z-10" style={{ animationDelay: "480ms" }}>
            <HeroStat value={String(cityCount)} label={t("statCities")} />
            <HeroStat value={String(allCountries.length)} label={t("statCountries")} />
            <HeroStat value="7" label={t("statCategories")} />
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
                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-cream mt-6 text-balance text-pretty">
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
            <>
              {/* Горизонтальная карусель на мобильном */}
              <div className="md:hidden">
                <MobileCarousel>
                  {popular.map((city, i) => (
                    <CityCard key={city.id} city={city} index={i} />
                  ))}
                </MobileCarousel>
              </div>
              {/* Сетка на планшете и десктопе */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {popular.map((city, i) => (
                  <Reveal key={city.id} delay={i * 60}>
                    <CityCard city={city} index={i} />
                  </Reveal>
                ))}
              </div>
            </>
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

      {/* Freemium-объяснение: что бесплатно, что платно */}
      <section className="py-10 md:py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8">
              <span className="eyebrow">Доступ к данным</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream mt-5 text-balance">
                Как работает Relocost
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-surface border hairline p-5 md:p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-xl text-cream">Бесплатно</h3>
                <p className="text-brandy/80 text-sm leading-relaxed">
                  Цены на жилье, еду и транспорт в 100+ городах — без регистрации.
                </p>
              </div>
              <div className="rounded-2xl bg-surface border hairline p-5 md:p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-copper/15 border border-copper/30 flex items-center justify-center text-copper text-lg">
                  🔓
                </div>
                <h3 className="font-serif text-xl text-cream">От 19 ₽</h3>
                <p className="text-brandy/80 text-sm leading-relaxed">
                  Лучшие места, рейтинг городов, полный список расходов.
                </p>
              </div>
              <div className="rounded-2xl bg-surface border hairline p-5 md:p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-copper/15 border border-copper/30 flex items-center justify-center text-copper text-lg">
                  📊
                </div>
                <h3 className="font-serif text-xl text-cream">49 ₽</h3>
                <p className="text-brandy/80 text-sm leading-relaxed">
                  Полный список статей расходов с реальными ценами.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="countries" className="relative isolate overflow-hidden py-12 px-6">
        <WarmOrbs className="-z-10" />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-6 gap-6">
              <div>
                <span className="eyebrow">{t("countriesEyebrow")}</span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-cream mt-6 text-balance text-pretty">
                  {t("countriesTitle")}
                </h2>
                <p className="text-brandy/80 text-lg mt-4 max-w-xl text-pretty font-medium">
                  {t("countriesSubtitle")}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Горизонтальная карусель на мобильном */}
          <div className="md:hidden">
            <MobileCarousel>
              {countriesPreview.map((c) => (
                <CountryCard key={c.slug} country={c} />
              ))}
            </MobileCarousel>
          </div>
          {/* Сетка на планшете и десктопе */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <div className="relative overflow-hidden rounded-3xl border-2 border-copper/55 p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 shadow-[0_0_80px_rgba(232,155,110,0.14)]" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(232,155,110,0.22) 0%, rgba(232,155,110,0.06) 50%, transparent 70%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)" }}>
            <div className="flex-1">
              <span className="eyebrow">Не знаете, с чего начать</span>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mt-4 mb-3 text-balance">
                Пройдите тест «Куда&nbsp;мне&nbsp;переехать?»
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
      {crowdCount > 0 && (
        <Reveal>
          <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
            <span className="eyebrow">От читателей</span>
            <div className="flex items-end justify-between mt-6 mb-4 gap-4 flex-wrap">
              <h2 className="font-serif text-3xl md:text-5xl text-cream">
                Свежие цены от читателей
              </h2>
              <p className="text-brandy/65 text-sm">
                {crowdCount}{" "}
                {crowdCount === 1
                  ? "оценка"
                  : crowdCount < 5
                    ? "оценки"
                    : "оценок"}{" "}
                от сообщества — реальные цены от таких же переехавших
              </p>
            </div>
            <CrowdPriceFeed limit={6} />
            <div className="mt-6">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border hairline text-cream/80 hover:text-cream hover:border-copper/40 transition text-sm"
              >
                Поделиться своей ценой
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </section>
        </Reveal>
      )}
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

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-2 sm:px-4 py-5 sm:py-7 text-center backdrop-blur-sm"
      style={{
        background: "rgba(232,155,110,0.09)",
        border: "1px solid rgba(232,155,110,0.32)",
        boxShadow: "0 0 28px rgba(232,155,110,0.1), inset 0 1px 0 rgba(232,155,110,0.15)",
      }}
    >
      <div
        className="font-serif text-3xl sm:text-4xl md:text-6xl leading-none tabular-nums lining-nums"
        style={{ color: "#E89B6E" }}
      >
        {value}
      </div>
      <div className="text-cream/70 text-[0.6rem] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-2 sm:mt-3 font-semibold leading-tight">
        {label}
      </div>
    </div>
  );
}

import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCitiesForSearch, getPopularCities } from "@/lib/cities";
import { getPublishedPosts } from "@/lib/blog";
import {
  getAllCountriesAggregated,
  getAllCountriesForSearch,
} from "@/lib/countries";
import { getListsPreview } from "@/lib/lists";
import { getSiteStats } from "@/lib/site-stats";
import { cityPhotoSrc, isR2Src, isUnsplashSrc } from "@/lib/photo";
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

// Подписи карточек блока «Подборки» на главной берём из уже переведённых
// footer.list* ключей (messages/{locale}.json) — те же названия, что в
// подвале сайта, чтобы не плодить второй набор переводов на одни и те же
// 6 подборок (правка 8, 2026-09-29).
const LIST_LABEL_KEY: Record<string, string> = {
  "samye-deshevye": "listCheapest",
  "do-50000-rubley": "listBudget",
  "dlya-zimovki": "listWinter",
  "dlya-udalenki": "listRemote",
  "u-morya": "listSeaside",
  "s-detmi": "listKids",
};

// Имена городов для чипов "Популярно" на главной. Список фиксированный (8
// направлений), поэтому переводы держим прямо здесь, а не тянем из БД —
// 2026-09-03: раньше были захардкожены только по-русски, из-за чего первый
// экран /en и /uz показывал русские названия городов рядом с переведённым
// заголовком (см. аудит бounce /en /uz).
const HERO_CITY_NAMES: Record<string, Record<Locale, string>> = {
  tbilisi: { ru: "Тбилиси 🇬🇪", en: "Tbilisi 🇬🇪", uz: "Tbilisi 🇬🇪" },
  yerevan: { ru: "Ереван 🇦🇲", en: "Yerevan 🇦🇲", uz: "Yerevan 🇦🇲" },
  istanbul: { ru: "Стамбул 🇹🇷", en: "Istanbul 🇹🇷", uz: "Istanbul 🇹🇷" },
  dubai: { ru: "Дубай 🇦🇪", en: "Dubai 🇦🇪", uz: "Dubay 🇦🇪" },
  belgrade: { ru: "Белград 🇷🇸", en: "Belgrade 🇷🇸", uz: "Belgrad 🇷🇸" },
};

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

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  const [popular, cities, posts, allCountries, searchCountries, crowdCount, listsPreview, siteStats] =
    await Promise.all([
      getPopularCities(6),
      getAllCitiesForSearch(),
      getPublishedPosts(3),
      getAllCountriesAggregated(),
      getAllCountriesForSearch(),
      getCrowdPricesCount(),
      getListsPreview(),
      getSiteStats(),
    ]);
  const countriesPreview = allCountries.slice(0, 8);

  // 2026-10-29 (#hero-photo-swap): фон hero-секции раньше был Лондон
  // (hero-v3.jpg) — страны Великобритания нет в каталоге и для российской
  // аудитории UK почти не фигурирует как направление релокации, при этом
  // сразу под фото — пилюли с реальными направлениями (Тбилиси и т.д.),
  // визуально споря с фоном. Берём то же фото, что уже легитимно рендерится
  // на /city/tbilisi (CityHero.tsx) — тот же источник/лицензия, без нового
  // неподтверждённого asset'а. Тбилиси — первый в FEATURED_CITY_SLUGS и по
  // собственному исследованию проекта (см. lib/cities.ts) самый массовый и
  // устойчивый хаб релокации. Фолбэк на старый локальный файл, если по
  // какой-то причине город не нашёлся в выборке popular.
  const heroCity = popular.find((c) => c.slug === "tbilisi") ?? popular[0];
  const heroPhoto =
    (heroCity &&
      cityPhotoSrc(heroCity.slug, heroCity.image_url, heroCity.unsplash_url, {
        w: 1600,
        q: 80,
      })) ||
    "/images/hero-v3.jpg";

  // Счётчики городов/стран на главной — из getSiteStats(), единого
  // источника чисел для всего сайта (lib/site-stats.ts), а НЕ из
  // cities.length/allCountries.length. 2026-09-29: живая проверка (AI-агент
  // прошёлся по сайту персоной "не знаю куда ехать") поймала расхождение
  // цифр между страницами (219 на главной, 213 на /countries, 175 на
  // /search) — разные страницы считали числа каждая по-своему и ISR-кеш
  // каждой страницы обновлялся в свой момент за день активного добавления
  // городов. getSiteStats() уже существовал именно для этого, просто
  // главная его не использовала — теперь использует.
  const cityCount = siteStats.cityCount;
  const countryCount = siteStats.countryCount;
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
      {/* На мобильном высота ужата (min-h убран, py уменьшен) — раньше
          92vh + все отступы вместе выталкивали CTA "Подобрать город" и
          статистику за пределы первого экрана на реальном iPhone (Виктория
          прислала скриншот 2026-08-25: кнопка обрезана снизу). */}
      {/* 2026-09-27: overflow-hidden раньше висел на всей секции (включая
          выпадающий список поиска) — на невысоких десктопных окнах
          (широкий, но невысокий viewport, например ~550-650px высоты)
          подсказки при вводе города обрезались нижней границей секции и
          визуально «пропадали». Фон/дымка теперь клипаются собственной
          обёрткой ниже, а не всей секцией — HeroMist уже и так сам себя
          клипает (см. components/decor/Atmosphere.tsx). */}
      <main id="main-content" tabIndex={-1}>
      <section className="relative isolate md:min-h-[92vh] flex flex-col justify-center px-6 py-8 md:py-12">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={heroPhoto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover -z-20 opacity-55"
            unoptimized={isR2Src(heroPhoto) || isUnsplashSrc(heroPhoto)}
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(26,33,5,0.65) 0%, rgba(26,33,5,0.85) 55%, rgba(26,33,5,0.98) 100%), radial-gradient(ellipse at 15% 20%, rgba(216,148,120,0.25) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(106,120,77,0.4) 0%, transparent 55%)",
            }}
          />
        </div>

        <HeroMist />

        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4 md:mb-8 fade-up" style={{ animationDelay: "0ms" }}>
            <span className="h-px w-12 bg-copper" />
            <p className="text-copper font-medium tracking-[0.18em] uppercase text-xs">
              {t("eyebrow")}
            </p>
          </div>
          {/* 2026-09-27: на десктопе исходный clamp(…,7vw,6.5rem) давал
              ~100px и занимал почти всю ширину hero-контейнера (3 строки).
              На md+ уменьшаем кап и сужаем ширину — заголовок компактнее,
              мобильный размер (base clamp) не трогаем. */}
          <h1
            className="font-serif text-[clamp(2.25rem,7vw,6.5rem)] md:text-[clamp(2.75rem,4.5vw,4.5rem)] md:max-w-3xl text-cream leading-[1.05] md:leading-[1.05] mb-4 md:mb-8 fade-up text-balance text-shadow-hero"
            style={{ animationDelay: "120ms", letterSpacing: "-0.02em" }}
          >
            {t("heroTitlePre")}
            <span className="text-copper italic">{t("heroTitleAccent")}</span>
            {t("heroTitlePost")}
          </h1>
          <p
            className="text-cream/95 text-base md:text-2xl max-w-2xl mb-6 md:mb-12 fade-up text-pretty leading-relaxed text-shadow-body font-medium"
            style={{ animationDelay: "240ms" }}
          >
            {t("heroSubtitle", { count: cityCount })}
          </p>

          <div className="fade-up max-w-2xl relative z-30" style={{ animationDelay: "360ms" }}>
            <SearchBar items={searchItems} />
          </div>

          {/* Быстрый доступ к популярным городам прямо под поиском.
              2026-09-29: сокращено с 8 до 5 (правка 2 из презентации),
              список синхронизирован с FEATURED_CITY_SLUGS (lib/cities.ts) —
              тот же курируемый топ-5, что и в блоке "Популярные направления".
              2026-09-03: имена локализованы (были захардкожены по-русски
              даже на /en и /uz — первый экран сайта смешивал языки). */}
          <div className="fade-up mt-3 md:mt-4 flex flex-wrap gap-2 max-w-2xl relative z-20" style={{ animationDelay: "420ms" }}>
            <span className="text-brandy/50 text-xs self-center pr-1">{t("popularQuickLabel")}</span>
            {[
              { slug: "tbilisi", name: HERO_CITY_NAMES.tbilisi[params.locale] },
              { slug: "yerevan", name: HERO_CITY_NAMES.yerevan[params.locale] },
              { slug: "istanbul", name: HERO_CITY_NAMES.istanbul[params.locale] },
              { slug: "dubai", name: HERO_CITY_NAMES.dubai[params.locale] },
              { slug: "belgrade", name: HERO_CITY_NAMES.belgrade[params.locale] },
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
          <div className="fade-up mt-4 md:mt-7 flex items-center gap-4 flex-wrap relative z-10" style={{ animationDelay: "460ms" }}>
            <Link
              href="/match"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-semibold text-base hover:bg-pale-copper transition shadow-glow"
            >
              {t("matchCta")}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>

          {/* Статистика (городов/стран/категорий) — скрыта на мобильном:
              наименее критичный блок, съедала ~110px и уводила CTA выше
              за пределы первого экрана на телефоне. */}
          <div className="hidden md:grid mt-10 grid-cols-3 max-w-2xl gap-3 sm:gap-5 fade-up relative z-10" style={{ animationDelay: "480ms" }}>
            <HeroStat value={String(cityCount)} label={t("statCities")} />
            <HeroStat value={String(countryCount)} label={t("statCountries")} />
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
              {tc("allCountries", { count: countryCount })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {listsPreview.length > 0 && (
        <section className="relative isolate overflow-hidden py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <span className="eyebrow">{t("listsEyebrow")}</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-cream mt-6 text-balance text-pretty">
                {t("listsTitle")}
              </h2>
              <p className="text-brandy/80 text-lg mt-4 max-w-xl text-pretty font-medium">
                {t("listsSubtitle")}
              </p>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-8">
              {listsPreview.map((l, i) => (
                <Reveal key={l.slug} delay={i * 50}>
                  <Link
                    href={`/list/${l.slug}`}
                    className="group relative flex h-32 sm:h-40 md:h-44 flex-col justify-end overflow-hidden rounded-2xl border hairline bg-surface transition hover:-translate-y-1 hover:border-copper/40 hover:shadow-card"
                  >
                    {l.photo ? (
                      <Image
                        src={l.photo}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                        unoptimized={isR2Src(l.photo) || isUnsplashSrc(l.photo)}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-kombu-green via-kombu-green to-pine-tree"
                        aria-hidden
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/60 to-transparent" />
                    <span className="relative z-10 px-3 sm:px-4 pb-3 sm:pb-4 text-cream font-serif text-sm sm:text-lg leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:text-copper transition">
                      {LIST_LABEL_KEY[l.slug] ? tf(LIST_LABEL_KEY[l.slug]) : l.shortTitle}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Reveal>
        <HowItWorks cityCount={cityCount} />
      </Reveal>
      <Reveal>
        {/* 2026-09-27: раньше pt-20 на десктопе + собственный py-14
            у блока "3 шага" выше создавали ~136px пустоты между секциями —
            сократили до pt-8 на десктопе (мобильный отступ не трогаем).
            Фон блока раньше плавно затухал ровно в цвет фона страницы
            (#1A2105 в правом нижнем углу градиента), из-за чего блок
            "растворялся" — теперь база теплее (медный/оливковый диагональный
            градиент без точного совпадения с фоном страницы) и медные
            блики/рамка/свечение заметно интенсивнее. */}
        <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-8">
          <div className="relative overflow-hidden rounded-3xl border-2 border-copper p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 shadow-[0_0_90px_rgba(232,155,110,0.28)]" style={{ background: "radial-gradient(ellipse at 20% 25%, rgba(232,155,110,0.38) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(216,148,120,0.3) 0%, transparent 60%), linear-gradient(135deg, #4A3320 0%, #33431F 55%, #232D10 100%)" }}>
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
        <CTABanner cityCount={cityCount} countryCount={countryCount} />
      </Reveal>
      </main>
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

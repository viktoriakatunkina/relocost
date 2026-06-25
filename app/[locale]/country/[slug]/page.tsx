import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  COUNTRY_CONTENT,
  COUNTRY_NAMES_GENITIVE,
  COUNTRY_NAMES_RU,
} from "@/lib/countries-content";
import {
  getAllCountrySlugs,
  getCitiesInCountry,
  getCountryMeta,
} from "@/lib/countries";
import { CountryHero } from "@/components/country/CountryHero";
import { CountryFAQ } from "@/components/country/CountryFAQ";
import { ProsCons } from "@/components/city/ProsCons";
import { CountryArticles } from "@/components/country/CountryArticles";
import { getPostsForCountry } from "@/lib/blog";
import { CityCard } from "@/components/CityCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { defaultLocale, routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { localizeCountryContent } from "@/lib/content-i18n";
import { countryName as localizedCountryName } from "@/lib/i18n-content";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getAllCountrySlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  if (!COUNTRY_NAMES_RU[params.slug]) return {};
  const t = await getTranslations({
    locale: params.locale,
    namespace: "country",
  });
  const meta = await getCountryMeta(params.slug);
  const name = meta
    ? localizedCountryName(meta, params.locale)
    : COUNTRY_NAMES_RU[params.slug];
  return {
    title: t("metaTitle", { country: name }),
    description: t("metaDescription", { country: name }),
    alternates: buildAlternates(`/country/${params.slug}`, params.locale),
    openGraph: {
      title: t("ogTitle", { country: name }),
      description: t("ogDescription", { country: name }),
      type: "website",
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const [tc, t] = await Promise.all([
    getTranslations("common"),
    getTranslations("country"),
  ]);

  const [meta, cities, rawContent] = await Promise.all([
    getCountryMeta(params.slug),
    getCitiesInCountry(params.slug),
    Promise.resolve(COUNTRY_CONTENT[params.slug] ?? null),
  ]);
  if (!meta) notFound();

  // Статьи блога о стране/её городах — перелинковка страна → блог.
  const countryPosts = await getPostsForCountry(
    params.slug,
    cities.map((c) => c.id),
  );

  // Локализуем текстовые поля страны (intro, климат, менталитет, язык, виза).
  // Для ru возвращается исходный объект. hero_gradient/difficulty не текст —
  // не переводятся.
  const content = await localizeCountryContent(
    rawContent,
    params.slug,
    params.locale,
  );

  // Локализованное имя страны (Фаза 1): en → country_en, ru/uz → country_ru.
  const countryName = localizedCountryName(meta, params.locale);
  // Для русского заголовка «Города ...» нужен родительный падеж; для en/uz
  // склонения нет — берём локализованное имя в именительном.
  const countryNameInCities =
    params.locale === defaultLocale
      ? COUNTRY_NAMES_GENITIVE[params.slug] ?? countryName
      : countryName;
  const gradient =
    content?.hero_gradient ?? "from-kombu-green/60 via-pine-tree to-pine-tree";

  return (
    <main className="pb-24">
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: countryName },
        ]}
      />
      <CountryHero
        countryRu={countryName}
        flagEmoji={meta.flag_emoji}
        gradient={gradient}
        backHomeLabel={t("backHome")}
        eyebrowLabel={t("eyebrow")}
        citiesCountLabel={t("citiesInCatalog", { count: cities.length })}
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
          {t("citiesIn", { country: countryNameInCities })}
        </h2>
        {cities.length === 0 ? (
          <p className="text-brandy/70">{t("citiesEmpty")}</p>
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
            {t("aboutTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <Fact title={t("factClimate")} text={content.climate} />
            <Fact title={t("factMentality")} text={content.mentality} />
            <Fact title={t("factLanguage")} text={content.language_note} />
            <Fact title={t("factVisa")} text={content.visa_note} accent />
            {content.residency_note && (
              <Fact title={t("factResidency")} text={content.residency_note} />
            )}
            {content.taxes_note && (
              <Fact title={t("factTaxes")} text={content.taxes_note} />
            )}
            {content.best_time && (
              <Fact title={t("factBestTime")} text={content.best_time} />
            )}
          </div>
        </section>
      )}

      {content?.pros?.length && content?.cons?.length ? (
        <ProsCons
          pros={content.pros}
          cons={content.cons}
          eyebrow={t("prosConsEyebrow")}
          title={t("prosConsTitle")}
          prosTitle={t("prosColTitle")}
          consTitle={t("consColTitle")}
        />
      ) : null}

      {content && (
        <section className="max-w-6xl mx-auto px-6 pt-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
            {t("difficultyTitle")}
          </h2>
          <p className="text-brandy/70 mb-6">{t("difficultySubtitle")}</p>
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
                      : "bg-copper"
                    : "bg-surface-elevated"
                }`}
              />
            ))}
            <span className="text-cream tabular-nums ml-3 whitespace-nowrap">
              {content.difficulty_overall}/5
            </span>
          </div>
        </section>
      )}

      {content && (
        <CountryFAQ
          content={content}
          eyebrow={t("faqEyebrow")}
          title={t("faqTitle", { country: countryName })}
          questions={{
            visa: t("faqVisa", { country: countryName }),
            climate: t("faqClimate", { country: countryName }),
            language: t("faqLanguage", { country: countryName }),
            mentality: t("faqMentality", { country: countryName }),
          }}
        />
      )}

      <CountryArticles
        posts={countryPosts}
        title={t("articlesTitle", { country: countryName })}
      />

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
          ? "bg-copper/15 border-copper/40"
          : "bg-surface hairline"
      }`}
    >
      <h3 className="font-serif text-xl text-cream mb-3">{title}</h3>
      <p className="text-brandy/90 leading-relaxed">{text}</p>
    </div>
  );
}

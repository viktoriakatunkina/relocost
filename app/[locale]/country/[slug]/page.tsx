import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { fetchWithHardTimeout } from "@/lib/supabase";
import {
  COUNTRY_CONTENT,
  COUNTRY_NAMES_GENITIVE,
  COUNTRY_NAMES_RU,
} from "@/lib/countries-content";
import {
  getCitiesInCountry,
  getCountryMeta,
} from "@/lib/countries";
import { CountryHero } from "@/components/country/CountryHero";
import { CountryCostOfLiving } from "@/components/country/CountryCostOfLiving";
import { countryComparePartners } from "@/lib/compare-countries";
import { COUNTRY_NAMES_RU as COUNTRY_RU_FALLBACK } from "@/lib/countries-content";
import { getCountryCost } from "@/lib/country-cost";
import {
  countryCostFaq,
  countryCostHook,
  countryCostSummary,
} from "@/lib/country-cost-text";
import { CountryVerdict } from "@/components/country/CountryVerdict";
import { CountryFAQ, buildCountryFaqItems } from "@/components/country/CountryFAQ";
import {
  CountryDynamicFAQ,
  buildCountryDynamicFaqItems,
} from "@/components/country/CountryDynamicFAQ";
import { FaqSchema } from "@/components/FaqSchema";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { ProsCons } from "@/components/city/ProsCons";
import { buildCountryVerdictBlock } from "@/lib/city-verdict-block";
import { getCityQuality } from "@/lib/city-quality";
import { CountryArticles } from "@/components/country/CountryArticles";
import { getPostsForCountry } from "@/lib/blog";
import { CityCard } from "@/components/CityCard";
import { LockedCities } from "@/components/country/LockedCities";
import { LockedCountryFacts } from "@/components/country/LockedCountryFacts";
import { CountryStickyBar } from "@/components/freemium/CountryStickyBar";
import { CrossLinks } from "@/components/CrossLinks";
import { CountryLegal } from "@/components/country/CountryLegal";
import { TrueSizeMap } from "@/components/country/TrueSizeMap";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { defaultLocale, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { localizeCountryContent } from "@/lib/content-i18n";
import { countryName as localizedCountryName } from "@/lib/i18n-content";
import {
  countryIn,
  countryTo,
  countryOf,
  countryAccusative,
} from "@/lib/country-prepositional";

export const revalidate = 86400;
export const dynamicParams = true;

// Список стран берем из реальных данных (cities.country_slug), а не из
// статического словаря COUNTRY_NAMES_RU — тот содержит только 46 записей
// (нужен для локализованных названий/fallback), а стран с городами в БД
// фактически ~80 (то же самое множество, что app/sitemap.ts строит из
// cities). Раньше расхождение (46 vs 80) означало, что 34 страны не
// предгенерировались и рендерились через ISR-фолбэк на VPS.
export async function generateStaticParams() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];
    const res = await fetchWithHardTimeout(
      `${url}/rest/v1/cities?select=country_slug&limit=1000`,
      { apikey: key, Authorization: `Bearer ${key}` }
    );
    if (!res.ok) return [];
    const rows: { country_slug: string | null }[] = await res.json();
    const slugs = Array.from(
      new Set(rows.map((r) => r.country_slug).filter((s): s is string => !!s)),
    );
    return slugs.flatMap((slug) => [
      { locale: "ru", slug },
      { locale: "en", slug },
      { locale: "uz", slug },
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
  const t = await getTranslations({
    locale: params.locale,
    namespace: "country",
  });
  const meta = await getCountryMeta(params.slug);
  // Раньше здесь стояло `if (!COUNTRY_NAMES_RU[slug]) return {}` — а в этом
  // справочнике всего 46 стран из 80 в каталоге. В результате 34 страницы
  // стран (Франция, Германия, Италия, США, Польша, Япония, Канада…) отдавали
  // не свой title/description, а общий фолбэк лейаута «Relocost —
  // калькулятор стоимости жизни…»: ноль уникальных мета на весь кластер
  // (проверено на проде 2026-09-07). Имя страны есть в БД для всех 80, его и
  // берем; справочник остается вторым фолбэком.
  const name = meta
    ? localizedCountryName(meta, params.locale)
    : COUNTRY_NAMES_RU[params.slug];
  if (!name) return {};
  // Русские шаблоны ждут винительный падеж ВМЕСТЕ с предлогом («Переезд
  // {country}» + «в Грузию»/«на Кипр»), потому что предлог тоже зависит от
  // страны. До 2026-09-07 подставлялось имя в именительном — на всех 80
  // страницах стран в title стояло «Переезд в Грузия». Для en/uz склонений
  // нет, у них свои шаблоны с собственными предлогами.
  const nameTo = params.locale === defaultLocale ? countryTo(params.slug, name) : name;
  return {
    title: t("metaTitle", { country: nameTo }),
    description: t("metaDescription", { country: nameTo }),
    alternates: buildAlternates(`/country/${params.slug}`, params.locale),
    openGraph: {
      title: t("ogTitle", { country: nameTo }),
      description: t("ogDescription", { country: nameTo }),
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
  const [tc, t, tVerdict] = await Promise.all([
    getTranslations("common"),
    getTranslations("country"),
    getTranslations("countryVerdict"),
  ]);

  const [meta, cities, rawContent, cost] = await Promise.all([
    getCountryMeta(params.slug),
    getCitiesInCountry(params.slug),
    Promise.resolve(COUNTRY_CONTENT[params.slug] ?? null),
    // Агрегат стоимости жизни по стране — под главный запрос кластера
    // «стоимость жизни в <стране> 2026». Считается из тех же цен, что и
    // бюджеты городов, поэтому цифры страны и городов не расходятся.
    getCountryCost(params.slug),
  ]);
  if (!meta) notFound();

  // Статьи блога о стране/ее городах — перелинковка страна → блог.
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
  // склонения нет — берем локализованное имя в именительном.
  // Родительный падеж берем из полной таблицы падежей (80 стран), а
  // COUNTRY_NAMES_GENITIVE оставляем вторым фолбэком: в нем только 46 записей,
  // и для остальных 34 стран заголовок выходил «Города Германия».
  const countryNameInCities =
    params.locale === defaultLocale
      ? countryOf(params.slug, COUNTRY_NAMES_GENITIVE[params.slug] ?? countryName)
      : countryName;
  // Падежи для FAQ (они же уезжают в schema.org FAQPage — там кривой падеж
  // виден и в выдаче): «Какой климат в Грузии?» — предложный, «вопросы про
  // Грузию» — винительный без предлога, «переезд в Грузию» — с предлогом.
  const isRu = params.locale === defaultLocale;
  const countryWhere = isRu ? countryIn(params.slug, countryName) : countryName;
  const countryWhereTo = isRu ? countryTo(params.slug, countryName) : countryName;
  const countryAcc = isRu ? countryAccusative(params.slug, countryName) : countryName;
  // Пары сравнения стран, куда входит текущая страна. Названия оппонентов
  // берем из справочника COUNTRY_NAMES_RU, а недостающие — из падежной
  // таблицы (она покрывает все 80 слагов каталога).
  const comparePartners = countryComparePartners(params.slug).map((p) => ({
    pair: p.pair,
    otherName: COUNTRY_RU_FALLBACK[p.other] ?? countryOf(p.other, p.other),
  }));
  const gradient =
    content?.hero_gradient ?? "from-kombu-green/60 via-pine-tree to-pine-tree";

  // Агрегируем quality-данные городов страны для блока вердикта.
  const qualityList = cities.map((c) => getCityQuality(c.slug)).filter(Boolean);
  const avgQuality = (key: keyof NonNullable<ReturnType<typeof getCityQuality>>) => {
    const vals = qualityList.map((q) => q![key]) as number[];
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };
  const BUDGET_CHEAP = 60_000;
  const hasCheapCities = cities.some((c) => (c.min_rent ?? 0) > 0 && (c.min_rent ?? 0) < BUDGET_CHEAP);

  const countryVerdictBlock = buildCountryVerdictBlock(
    {
      countrySlug:        params.slug,
      countryName,
      isForeignCountry:   meta.is_foreign,
      difficulty_overall: content?.difficulty_overall ?? 3,
      hasCheapCities,
      avgSafety:          avgQuality("safety"),
      avgClimate:         avgQuality("climate_comfort"),
      avgMedicine:        avgQuality("medicine"),
      cityCount:          cities.length,
    },
    {
      eyebrow:             tVerdict("eyebrow"),
      title:               tVerdict("title"),
      prosVisuFree:        tVerdict("prosVisuFree"),
      prosPopular:         tVerdict("prosPopular"),
      prosMildClimate:     tVerdict("prosMildClimate"),
      prosHighSafety:      tVerdict("prosHighSafety"),
      prosGoodMedicine:    tVerdict("prosGoodMedicine"),
      prosCheapCities:     tVerdict("prosCheapCities"),
      consVisaNeeded:      tVerdict("consVisaNeeded"),
      consHighDifficulty:  tVerdict("consHighDifficulty"),
      consLanguageBarrier: tVerdict("consLanguageBarrier"),
      consHarshClimate:    tVerdict("consHarshClimate"),
      consLittleData:      tVerdict("consLittleData"),
      audienceFreelancers: tVerdict("audienceFreelancers"),
      audienceFamilies:    tVerdict("audienceFamilies"),
      audiencePensioners:  tVerdict("audiencePensioners"),
      audienceBudget:      tVerdict("audienceBudget"),
      audienceNomads:      tVerdict("audienceNomads"),
      phraseTemplate:      tVerdict("phraseTemplate"),
      advantageEasy:       tVerdict("advantageEasy"),
      advantagePopular:    tVerdict("advantagePopular"),
      advantageSafe:       tVerdict("advantageSafe"),
      advantageClimate:    tVerdict("advantageClimate"),
    },
  );

  // Вопросы обеих FAQ-секций страницы. Показываем их в двух разных блоках
  // (ручной FAQ по стране + автоFAQ по городам), но schema.org FAQPage
  // отдаем ОДНУ на всю страницу — иначе Google учитывает только первую
  // разметку, а вопросы второй секции для выдачи пропадают.
  const faqItems = content
    ? buildCountryFaqItems(content, {
        visa: t("faqVisa", { country: countryWhereTo }),
        climate: t("faqClimate", { country: countryWhere }),
        language: t("faqLanguage", { country: countryWhere }),
        mentality: t("faqMentality", { country: countryWhere }),
      })
    : [];
  // FAQ по деньгам — из чисел агрегата. Идут первыми в schema.org FAQPage:
  // это самые частотные вопросы кластера («сколько стоит жить в», «хватит ли
  // N рублей»), и в разметке они должны стоять раньше визовых.
  const costFaqItems =
    cost && isRu ? countryCostFaq(cost, params.slug, countryName) : [];
  const dynFaqItems = buildCountryDynamicFaqItems(params.slug, countryName, cities, {
    dynFaqQ1: t("dynFaqQ1"),
    dynFaqA1: t("dynFaqA1"),
    dynFaqQ2: t("dynFaqQ2"),
    dynFaqA2: t("dynFaqA2"),
    dynFaqQ3: t("dynFaqQ3"),
    dynFaqA3: t("dynFaqA3"),
    dynFaqQ4: t("dynFaqQ4"),
    dynFaqA4: t("dynFaqA4"),
    dynFaqQ5: t("dynFaqQ5"),
    dynFaqA5: t("dynFaqA5"),
  });

  return (
    <main className="pb-12 md:pb-24">
      <FaqSchema items={[...costFaqItems, ...faqItems, ...dynFaqItems]} />
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-1">
        <DataSourceBadge
          updatedLabel={t("dataUpdated")}
          sourceLabel={t("dataSource")}
        />
      </div>

      {(content || cost) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 md:pt-16">
          {/* Хук с главной цифрой — прямой ответ на «сколько стоит жить в X».
              Стоит ПЕРЕД описательным интро: до этого лид страницы говорил про
              климат и менталитет, а не про деньги, ради которых сюда приходят. */}
          {cost && isRu && (
            <p className="text-cream text-lg md:text-xl leading-relaxed font-medium mb-4">
              {countryCostHook(cost, params.slug, countryName)}
            </p>
          )}
          {content && (
            <p className="text-brandy/90 text-lg md:text-xl leading-relaxed">
              {content.intro}
            </p>
          )}
        </section>
      )}

      {cost && (
        <CountryCostOfLiving
          cost={cost}
          summary={isRu ? countryCostSummary(cost, params.slug, countryName) : []}
          labels={{
            title: t("costTitle", { country: countryWhere }),
            subtitle: t("costSubtitle"),
            colBudget: t("costColBudget"),
            colEconomy: t("costColEconomy"),
            colComfort: t("costColComfort"),
            rowSolo: t("costRowSolo"),
            rowCouple: t("costRowCouple"),
            rowFamily: t("costRowFamily"),
            categoriesTitle: t("costCategoriesTitle"),
            colCategory: t("costColCategory"),
            colMedian: t("costColMedian"),
            colCities: t("costColCities"),
            byCityTitle: t("costByCityTitle", { country: countryNameInCities }),
            colCity: t("costColCity"),
            colRent: t("costColRent"),
            colMonthly: t("costColMonthly"),
            methodTitle: t("costMethodTitle"),
            method: t("costMethod"),
            costNoteTitle: t("costNoteTitle"),
          }}
          costNote={isRu ? content?.cost_note : undefined}
        />
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 overflow-hidden md:overflow-visible">
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
          {t("citiesIn", { country: countryNameInCities })}
        </h2>
        {cities.length === 0 ? (
          <p className="text-brandy/70">{t("citiesEmpty")}</p>
        ) : cities.length <= 3 ? (
          <>
            {/* Если городов не больше 3 — показываем все бесплатно */}
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-none pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6 md:hidden">
              {cities.map((c, i) => (
                <div key={c.id} className="shrink-0 w-[78vw] max-w-[320px] snap-start">
                  <CityCard city={c} index={i} />
                </div>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cities.map((c, i) => (
                <CityCard key={c.id} city={c} index={i} />
              ))}
            </div>
          </>
        ) : (
          <LockedCities slug={params.slug} cities={cities} />
        )}
      </section>

      {content && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
            {t("aboutTitle")}
          </h2>
          {/* Первые 2 факта — бесплатно, остальные — за paywall country_overview */}
          {(() => {
            const optionals = [
              content.residency_note ? { key: "residency", title: t("factResidency"), text: content.residency_note } : null,
              content.taxes_note     ? { key: "taxes",     title: t("factTaxes"),     text: content.taxes_note }     : null,
              content.best_time      ? { key: "bestTime",  title: t("factBestTime"),  text: content.best_time }      : null,
            ].filter(Boolean) as { key: string; title: string; text: string }[];
            const lastIsOrphan = optionals.length % 2 !== 0;
            const allFacts = [
              { key: "climate",   title: t("factClimate"),   text: content.climate,       accent: false, wide: false },
              { key: "mentality", title: t("factMentality"), text: content.mentality,     accent: false, wide: false },
              { key: "language",  title: t("factLanguage"),  text: content.language_note, accent: false, wide: false },
              { key: "visa",      title: t("factVisa"),      text: content.visa_note,     accent: true,  wide: false },
              ...optionals.map((o, i) => ({
                key: o.key,
                title: o.title,
                text: o.text,
                accent: false,
                wide: lastIsOrphan && i === optionals.length - 1,
              })),
            ];
            return <LockedCountryFacts slug={params.slug} facts={allFacts} />;
          })()}
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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
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

      {countryVerdictBlock.hasEnoughData && (
        <CountryVerdict
          block={countryVerdictBlock}
          t={{
            eyebrow:       tVerdict("eyebrow"),
            title:         tVerdict("title"),
            prosTitle:     tVerdict("prosTitle"),
            consTitle:     tVerdict("consTitle"),
            audienceTitle: tVerdict("audienceTitle"),
          }}
        />
      )}

      <TrueSizeMap
        countrySlug={params.slug}
        countryName={countryName}
        locale={params.locale}
        titleRu={t("trueSizeTitle")}
        titleEn={t("trueSizeTitle")}
      />

      <CountryFAQ
        items={[...costFaqItems, ...faqItems]}
        eyebrow={t("faqEyebrow")}
        title={t("faqTitle", { country: countryAcc })}
      />

      {content && (
        <CountryLegal
          countryName={countryName}
          visa={content.visa_note}
          residency={content.residency_note}
          taxes={content.taxes_note}
        />
      )}

      <CountryDynamicFAQ
        items={dynFaqItems}
        eyebrow={t("dynFaqEyebrow")}
        title={t("dynFaqTitle", { country: countryWhereTo })}
      />

      <CountryArticles
        posts={countryPosts}
        title={t("articlesTitle", { country: countryName })}
      />

      <CrossLinks
        links={[
          // Сравнения СТРАН с участием этой страны — единственный внутренний
          // путь к /compare/<a>-vs-<b> на уровне стран (спрос «X или Y»
          // подтвержден Яндекс.Suggest, см. lib/compare-countries).
          ...comparePartners.map((p) => ({
            href: `/compare/${p.pair}`,
            label: `${countryName} или ${p.otherName}`,
          })),
          { href: "/rating", label: "Рейтинг городов по стоимости" },
          { href: "/countries", label: "Все страны" },
          { href: "/search", label: "Подобрать город" },
          ...(cities.length >= 2
            ? [
                {
                  href: `/compare/${cities[0].slug}-vs-${cities[1].slug}`,
                  label: `${cities[0].name_ru} или ${cities[1].name_ru}`,
                },
              ]
            : []),
        ]}
      />

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>

      {/* Paywall-панель: показывается, пока есть незакрытые продукты страны */}
      {cities.length > 3 && <CountryStickyBar slug={params.slug} />}
    </main>
  );
}


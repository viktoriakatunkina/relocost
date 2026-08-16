import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { getPricesByCity, getSimilarCities } from "@/lib/prices";
import {
  getMoscowBaseline,
  cityVsMoscow,
  moscowCostIndex,
  moscowSecondPerson,
} from "@/lib/moscow-baseline";
import { cityIn } from "@/lib/city-prepositional";
import { getPostsForCity } from "@/lib/blog";
import { CITY_CONTENT } from "@/lib/cities-content";
import { CITY_EXTRA } from "@/lib/cities-content-extra";
import type { City } from "@/lib/types";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName, countryName } from "@/lib/i18n-content";
import {
  localizeCity,
  localizeCityContent,
  localizeCitySeo,
} from "@/lib/content-i18n";
import { CityHero } from "@/components/city/CityHero";
import { CityVerdict } from "@/components/city/CityVerdict";
import { QuickFacts } from "@/components/city/QuickFacts";
import { CitySummary } from "@/components/city/CitySummary";
import { CityAbout } from "@/components/city/CityAbout";
import { MonthlyBudget } from "@/components/city/MonthlyBudget";
import { CostVsMoscow } from "@/components/city/CostVsMoscow";
import { SecondPersonSummary } from "@/components/city/SecondPersonSummary";
import { EarnEquivalent } from "@/components/city/EarnEquivalent";
import { LivingScore } from "@/components/city/LivingScore";
import { LivingScoreCard } from "@/components/city/LivingScoreCard";
import { QualityOfLife } from "@/components/city/QualityOfLife";
import { getCityQuality } from "@/lib/city-quality";
import { buildCityVerdictBlock } from "@/lib/city-verdict-block";
import { computeLifeScore } from "@/lib/livingScore";
import { monthlyBudgetFrom } from "@/lib/city-budget";
import { CityDistricts } from "@/components/city/CityDistricts";
import { CityWork } from "@/components/city/CityWork";
import { PhotoGallery } from "@/components/city/PhotoGallery";
import { PricesTable } from "@/components/city/PricesTable";
import { Calculator } from "@/components/city/Calculator";
import { DifficultyBars } from "@/components/city/DifficultyBars";
import { BestPlaces } from "@/components/city/BestPlaces";
import { VisaSteps } from "@/components/city/VisaSteps";
import { Reviews } from "@/components/city/Reviews";
import { CityReviews } from "@/components/city/CityReviews";
import {
  CityDynamicFAQ,
  buildCityFaqItems,
} from "@/components/city/CityDynamicFAQ";
import { CityPartners } from "@/components/city/CityPartners";
import { CityAnchorNav } from "@/components/city/CityAnchorNav";
import { CityFavoritesCount } from "@/components/city/CityFavoritesCount";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { SimilarCities } from "@/components/city/SimilarCities";
import { CityArticles } from "@/components/city/CityArticles";
import { CompareSuggestions } from "@/components/city/CompareSuggestions";
import { BadgeEmbed } from "@/components/city/BadgeEmbed";
import { CrossLinks } from "@/components/CrossLinks";
import { AnchorPrices } from "@/components/city/AnchorPrices";
import { getAnchorPrices } from "@/lib/anchor-prices";
import { CrowdPriceFeed } from "@/components/CrowdPriceFeed";
import { CrowdPriceForm } from "@/components/CrowdPriceForm";
import { getCityCrowdPrices, getCityCrowdCount } from "@/lib/crowd-prices";
import { StickyBar } from "@/components/freemium/StickyBar";
import { VerifyOnReturn } from "@/components/freemium/VerifyOnReturn";
import { Reveal } from "@/components/Reveal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CitySchema } from "@/components/city/CitySchema";
import { ProductSchema } from "@/components/city/ProductSchema";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;
// Неизвестные slug рендерятся по первому запросу и кешируются ISR.
export const dynamicParams = true;

// Топ-40 городов предгенерируются при сборке (без Supabase-вызова).
// Остальные — ISR при первом запросе (dynamicParams=true).
const PRERENDER_CITY_SLUGS = [
  "tbilisi", "belgrade", "dubai", "bali", "yerevan", "limassol", "almaty",
  "tashkent", "istanbul", "bangkok", "lisbon", "berlin", "prague", "budapest",
  "warsaw", "amsterdam", "barcelona", "milan", "paris", "vienna",
  "riga", "tallinn", "vilnius", "krakow", "athens", "sofia", "bucharest",
  "zagreb", "bratislava", "kyiv", "astana", "bishkek", "dushanbe", "baku",
  "ankara", "cairo", "nairobi", "cape-town", "delhi", "ho-chi-minh-city",
];

export function generateStaticParams() {
  return PRERENDER_CITY_SLUGS.map((slug) => ({ locale: "ru", slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { data: city } = await supabase
    .from("cities")
    .select("id, name_ru, seo_title, seo_description, difficulty_score")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) return {};
  // Локализуем seo_title/description (en/uz берут перевод, иначе ru-фолбэк).
  const seo = await localizeCitySeo(
    { seo_title: city.seo_title, seo_description: city.seo_description },
    params.slug,
    params.locale,
  );

  // Добавляем в description балл индекса качества жизни (если есть данные).
  let descriptionWithScore = seo.seo_description ?? undefined;
  try {
    const quality = getCityQuality(params.slug);
    const { data: priceRows } = await supabase
      .from("prices")
      .select("item_name_ru, price_min, category")
      .eq("city_id", city.id)
      .in("category", ["rent", "food", "transport", "utilities"]);
    const rows = (priceRows ?? []) as { item_name_ru: string; price_min: number }[];
    const { min_rent, monthly_from } = monthlyBudgetFrom(rows);
    const dummy = {
      difficulty_score: (city as { difficulty_score: number | null }).difficulty_score,
      min_rent,
      monthly_from,
    } as Parameters<typeof computeLifeScore>[0];
    const result = computeLifeScore(
      dummy,
      quality,
      (priceRows ?? []) as Parameters<typeof computeLifeScore>[2],
    );
    if (result.availableCount >= 2 && descriptionWithScore) {
      const suffix = params.locale === "en"
        ? ` Quality of life index: ${result.total}/100 (${result.grade}).`
        : ` Индекс качества жизни: ${result.total}/100 (${result.grade}).`;
      descriptionWithScore = descriptionWithScore + suffix;
    }
  } catch {
    // generateMetadata не должен валиться из-за дополнительного запроса
  }

  return {
    title: seo.seo_title,
    description: descriptionWithScore,
    alternates: buildAlternates(`/city/${params.slug}`, params.locale),
    openGraph: {
      // Профиль города — это не статья. Богатые данные (Place/TouristDestination,
      // гео, цены) отдаём через JSON-LD в <CitySchema>/<ProductSchema>.
      title: seo.seo_title ?? undefined,
      description: descriptionWithScore,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.seo_title ?? undefined,
      description: descriptionWithScore,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tCity = await getTranslations("city");
  const tScore = await getTranslations("livingScore");
  const tVerdict = await getTranslations("cityVerdict");

  const { data: city } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) notFound();
  // Локализуем текстовые DB-поля города (intro_text, climate, language, …).
  // Для ru возвращается исходный объект без изменений.
  const c = await localizeCity(city as City, params.locale);
  const name = cityName(c, params.locale);
  const country = countryName(c, params.locale);

  // Локализуем контент города (плюсы/минусы, места, виза, FAQ, отзывы) —
  // компоненты получают уже переведённый CityContent, их код не меняется.
  // Базовый контент + расширенные блоки флагманов (районы/работа/описание).
  const baseContent = CITY_CONTENT[c.slug]
    ? { ...CITY_CONTENT[c.slug], ...CITY_EXTRA[c.slug] }
    : undefined;
  const content = await localizeCityContent(baseContent, c.slug, params.locale);
  const [prices, similar, articles, moscowBaseline, crowdPrices, crowdCount] =
    await Promise.all([
      getPricesByCity(c.id),
      getSimilarCities(c, 4),
      getPostsForCity(c.id, c.country_slug, 3),
      getMoscowBaseline(),
      getCityCrowdPrices(c.slug, 3),
      getCityCrowdCount(c.slug),
    ]);
  const anchorItems = getAnchorPrices(prices);
  // Сравнение с Москвой показываем всем городам, кроме самой Москвы.
  const moscowComparison =
    c.slug === "moscow" ? null : cityVsMoscow(prices, moscowBaseline);
  // Числовой индекс цен (Москва = 100) для заметного бейджа в шапке города.
  // Сама Москва — ровно 100; города без сравнения — без индекса (null).
  const cityCostIndex =
    c.slug === "moscow"
      ? 100
      : moscowComparison
        ? moscowCostIndex(moscowComparison.avgDiff)
        : null;
  // Фраза «от 2-го лица» по сравнению с Москвой (собирается на сервере).
  const moscowSecondPersonText = moscowSecondPerson(
    moscowComparison,
    cityIn(c.slug, c.name_ru),
  );

  // Месячный бюджет «от» из цен страницы — для оценки «для переезда» (LivingScore).
  const { min_rent, monthly_from } = monthlyBudgetFrom(
    Object.values(prices).flat(),
  );
  const cityForScore = { ...c, min_rent, monthly_from };

  // Индекс качества жизни (новый блок LivingScoreCard).
  const cityQuality = getCityQuality(c.slug);
  const allPricesList = Object.values(prices).flat();
  const lifeScoreResult = computeLifeScore(cityForScore, cityQuality, allPricesList);
  // Блок «Плюсы, минусы, для кого» — собирается из числовых данных города.
  const verdictBlock = buildCityVerdictBlock(c as City, {
    eyebrow:              tVerdict("eyebrow"),
    title:                tVerdict("title"),
    prosCheapHousing:     tVerdict("prosCheapHousing"),
    prosCheapLife:        tVerdict("prosCheapLife"),
    prosVisuFree:         tVerdict("prosVisuFree"),
    prosMildClimate:      tVerdict("prosMildClimate"),
    prosHighSafety:       tVerdict("prosHighSafety"),
    prosGoodMedicine:     tVerdict("prosGoodMedicine"),
    prosHighQualityLife:  tVerdict("prosHighQualityLife"),
    prosGoodTransport:    tVerdict("prosGoodTransport"),
    prosCleanEcology:     tVerdict("prosCleanEcology"),
    consExpensiveHousing: tVerdict("consExpensiveHousing"),
    consExpensiveLife:    tVerdict("consExpensiveLife"),
    consVisaNeeded:       tVerdict("consVisaNeeded"),
    consLanguageBarrier:  tVerdict("consLanguageBarrier"),
    consHarshClimate:     tVerdict("consHarshClimate"),
    consLowSafety:        tVerdict("consLowSafety"),
    consPoorEcology:      tVerdict("consPoorEcology"),
    consPoorMedicine:     tVerdict("consPoorMedicine"),
    consLittleData:       tVerdict("consLittleData"),
    audienceFreelancers:  tVerdict("audienceFreelancers"),
    audienceFamilies:     tVerdict("audienceFamilies"),
    audiencePensioners:   tVerdict("audiencePensioners"),
    audienceStudents:     tVerdict("audienceStudents"),
    audienceBudget:       tVerdict("audienceBudget"),
    audienceNomads:       tVerdict("audienceNomads"),
    audienceSafety:       tVerdict("audienceSafety"),
    phraseTemplate:       tVerdict("phraseTemplate"),
    advantageCheap:       tVerdict("advantageCheap"),
    advantageSafe:        tVerdict("advantageSafe"),
    advantageClimate:     tVerdict("advantageClimate"),
    advantageQuality:     tVerdict("advantageQuality"),
    advantageEasy:        tVerdict("advantageEasy"),
  }, name, { min_rent, monthly_from, quality: cityQuality });

  // Локализованные строки для LivingScoreCard — собираем на сервере, передаём пропсом.
  const livingScoreT = {
    eyebrow: tScore("eyebrow"),
    title: tScore("title"),
    subtitle: tScore("subtitle"),
    totalLabel: tScore("totalLabel"),
    availableCategories: tScore("availableCategories"),
    noData: tScore("noData"),
    footer: tScore("footer"),
    ratingLink: tScore("ratingLink"),
    categories: {
      housing: tScore("categories.housing"),
      cost: tScore("categories.cost"),
      safety: tScore("categories.safety"),
      life: tScore("categories.life"),
      transport: tScore("categories.transport"),
      climate: tScore("categories.climate"),
    },
    grades: {
      gradeA: tScore("grades.gradeA"),
      gradeB: tScore("grades.gradeB"),
      gradeC: tScore("grades.gradeC"),
      gradeD: tScore("grades.gradeD"),
      gradeF: tScore("grades.gradeF"),
    },
  };

  return (
    <main className="pb-12 md:pb-24">
      <CitySchema city={c} />
      <ProductSchema city={c} />
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: country, href: `/country/${c.country_slug}` },
          { name },
        ]}
      />
      <CityHero city={c} />

      <div className="max-w-6xl mx-auto px-6 pt-3 pb-1">
        <DataSourceBadge
          updatedLabel={tCity("dataUpdated")}
          sourceLabel={tCity("dataSource")}
        />
      </div>

      <QuickFacts city={c} costIndex={cityCostIndex} />
      <CityFavoritesCount />
      <CityAnchorNav isForeign={c.is_foreign} />

      {lifeScoreResult.availableCount > 0 && (
        <Reveal>
          <LivingScoreCard
            result={lifeScoreResult}
            cityName={name}
            t={livingScoreT}
          />
        </Reveal>
      )}

      {verdictBlock.hasEnoughData && (
        <Reveal>
          <CityVerdict
            block={verdictBlock}
            t={{
              eyebrow:       tVerdict("eyebrow"),
              title:         tVerdict("title"),
              prosTitle:     tVerdict("prosTitle"),
              consTitle:     tVerdict("consTitle"),
              audienceTitle: tVerdict("audienceTitle"),
            }}
          />
        </Reveal>
      )}

      <AnchorPrices items={anchorItems} />

      <Reveal>
        <CitySummary city={c} content={content} />
      </Reveal>

      {content?.intro_long && (
        <Reveal>
          <CityAbout cityName={name} text={content.intro_long} />
        </Reveal>
      )}

      <PhotoGallery
        cityName={name}
        gallery={c.gallery}
        unsplashUrl={c.image_url ?? c.unsplash_url}
        authorName={c.unsplash_author_name}
        authorUrl={c.unsplash_author_url}
      />

      {/* Бесплатная визуальная выжимка бюджета — не оборачиваем в Reveal,
          чтобы цифры были в SSR-HTML (видны без JS, важно для SEO). */}
      <MonthlyBudget prices={prices} cityName={name} slug={c.slug} />

      <Reveal>
        <Calculator slug={c.slug} prices={prices} cityName={name} />
      </Reveal>

      <Reveal>
        <PricesTable prices={prices} />
      </Reveal>

      <Reveal>
        <QualityOfLife cityName={name} data={getCityQuality(c.slug)} />
      </Reveal>

      {moscowComparison && (
        <>
          <CostVsMoscow cityName={name} comparison={moscowComparison} />
          {moscowSecondPersonText && (
            <section className="max-w-4xl mx-auto px-6 pt-6">
              <SecondPersonSummary
                eyebrow="Что это значит для Вас"
                text={moscowSecondPersonText}
              />
            </section>
          )}
          <Reveal>
            <EarnEquivalent cityName={name} avgDiff={moscowComparison.avgDiff} />
          </Reveal>
        </>
      )}

      {content && (
        <Reveal>
          <DifficultyBars breakdown={content.difficulty_breakdown} />
        </Reveal>
      )}

      <Reveal>
        <LivingScore
          city={cityForScore}
          cityName={name}
          breakdown={content?.difficulty_breakdown}
        />
      </Reveal>

      {content?.work && (
        <Reveal>
          <CityWork cityName={name} work={content.work} />
        </Reveal>
      )}

      {content && (
        <Reveal>
          <BestPlaces slug={c.slug} places={content.best_places} />
        </Reveal>
      )}

      {content?.districts && (
        <Reveal>
          <CityDistricts districts={content.districts} />
        </Reveal>
      )}

      {content && (
        <Reveal>
          <VisaSteps
            slug={c.slug}
            isForeign={c.is_foreign}
            steps={content.visa_steps}
          />
        </Reveal>
      )}

      {c.is_foreign && (
        <Reveal>
          <CityPartners />
        </Reveal>
      )}

      {content && (
        <Reveal>
          <Reviews
            slug={c.slug}
            isForeign={c.is_foreign}
            reviews={content.reviews}
          />
        </Reveal>
      )}

      <Reveal>
        <CityReviews city={c.slug} />
      </Reveal>

      <Reveal>
        <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
          <span className="eyebrow">Сообщество</span>
          <div className="flex items-end justify-between mt-6 mb-6 gap-4 flex-wrap">
            <h2 className="font-serif text-3xl md:text-5xl text-cream">
              Оцените цены в {name}
            </h2>
            <p className="text-brandy/65 text-sm">
              {crowdCount > 0
                ? `${crowdCount} ${crowdCount === 1 ? "оценка" : crowdCount < 5 ? "оценки" : "оценок"} от сообщества`
                : "Будьте первым — добавьте актуальную цену"}
            </p>
          </div>
          {crowdPrices.length > 0 && (
            <div className="mb-6">
              <CrowdPriceFeed citySlug={c.slug} initialPrices={crowdPrices} />
            </div>
          )}
          <CrowdPriceForm citySlug={c.slug} />
        </section>
      </Reveal>

      <Reveal>
        <CityDynamicFAQ
          items={buildCityFaqItems(name, c.is_foreign, prices, monthly_from, {
            faqQ1: tCity("faqQ1"),
            faqA1: tCity("faqA1"),
            faqQ2: tCity("faqQ2"),
            faqA2: tCity("faqA2"),
            faqQ3: tCity("faqQ3"),
            faqA3Cheap: tCity("faqA3Cheap"),
            faqA3Avg: tCity("faqA3Avg"),
            faqA3Exp: tCity("faqA3Exp"),
            faqQ4: tCity("faqQ4"),
            faqA4: tCity("faqA4"),
            faqQ5: tCity("faqQ5"),
            faqA5Foreign: tCity("faqA5Foreign"),
            faqA5Russia: tCity("faqA5Russia"),
          })}
          eyebrow={tCity("faqEyebrow")}
          title={tCity("faqTitle").replace("{city}", name)}
        />
      </Reveal>

      <Reveal>
        <CityArticles posts={articles} cityName={name} />
      </Reveal>

      <CrossLinks
        links={[
          { href: `/city/${c.slug}/budget`, label: `Бюджет семьи в ${c.name_ru}` },
          { href: `/city/${c.slug}/prices`, label: `Цены в ${c.name_ru} 2026` },
          { href: `/country/${c.country_slug}`, label: `Жизнь в ${c.country_ru}` },
          ...(c.slug !== "moscow"
            ? [
                {
                  href: `/compare/${c.slug}-vs-moscow`,
                  label: `${c.name_ru} или Москва`,
                },
              ]
            : []),
          { href: "/rating", label: "Рейтинг городов по стоимости" },
          { href: "/countries", label: "Все страны" },
          { href: "/search", label: "Подобрать город" },
        ]}
      />
      <Reveal>
        <SimilarCities cities={similar} isForeign={c.is_foreign} />
      </Reveal>

      <Reveal>
        <CompareSuggestions current={c} candidates={similar} />
      </Reveal>

      <Reveal>
        <BadgeEmbed slug={c.slug} cityName={name} />
      </Reveal>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>

      <StickyBar slug={c.slug} isForeign={c.is_foreign} />
      <VerifyOnReturn slug={c.slug} />
    </main>
  );
}

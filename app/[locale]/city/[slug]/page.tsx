import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { getPricesByCity, getSimilarCities } from "@/lib/prices";
import { getMoscowBaseline, cityVsMoscow } from "@/lib/moscow-baseline";
import { getPostsForCity } from "@/lib/blog";
import { CITY_CONTENT } from "@/lib/cities-content";
import { CITY_EXTRA } from "@/lib/cities-content-extra";
import type { City } from "@/lib/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName, countryName } from "@/lib/i18n-content";
import {
  localizeCity,
  localizeCityContent,
  localizeCitySeo,
} from "@/lib/content-i18n";
import { CityHero } from "@/components/city/CityHero";
import { QuickFacts } from "@/components/city/QuickFacts";
import { CitySummary } from "@/components/city/CitySummary";
import { CityAbout } from "@/components/city/CityAbout";
import { MonthlyBudget } from "@/components/city/MonthlyBudget";
import { CostVsMoscow } from "@/components/city/CostVsMoscow";
import { EarnEquivalent } from "@/components/city/EarnEquivalent";
import { LivingScore } from "@/components/city/LivingScore";
import { monthlyBudgetFrom } from "@/lib/city-budget";
import { CityDistricts } from "@/components/city/CityDistricts";
import { CityWork } from "@/components/city/CityWork";
import { PhotoGallery } from "@/components/city/PhotoGallery";
import { ProsCons } from "@/components/city/ProsCons";
import { PricesTable } from "@/components/city/PricesTable";
import { Calculator } from "@/components/city/Calculator";
import { DifficultyBars } from "@/components/city/DifficultyBars";
import { BestPlaces } from "@/components/city/BestPlaces";
import { VisaSteps } from "@/components/city/VisaSteps";
import { Reviews } from "@/components/city/Reviews";
import { CityFAQ } from "@/components/city/CityFAQ";
import { SimilarCities } from "@/components/city/SimilarCities";
import { CityArticles } from "@/components/city/CityArticles";
import { CompareSuggestions } from "@/components/city/CompareSuggestions";
import { StickyBar } from "@/components/freemium/StickyBar";
import { VerifyOnReturn } from "@/components/freemium/VerifyOnReturn";
import { Reveal } from "@/components/Reveal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CitySchema } from "@/components/city/CitySchema";
import { ProductSchema } from "@/components/city/ProductSchema";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export async function generateStaticParams() {
  const { data } = await supabase.from("cities").select("slug");
  const slugs = (data ?? []).map((c) => c.slug as string);
  // Прегенерим каждый город во всех локалях (ru/en/uz). Контент пока ru-фолбэк.
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { data: city } = await supabase
    .from("cities")
    .select("name_ru, seo_title, seo_description")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) return {};
  // Локализуем seo_title/description (en/uz берут перевод, иначе ru-фолбэк).
  const seo = await localizeCitySeo(
    { seo_title: city.seo_title, seo_description: city.seo_description },
    params.slug,
    params.locale,
  );
  return {
    title: seo.seo_title,
    description: seo.seo_description,
    alternates: buildAlternates(`/city/${params.slug}`, params.locale),
    openGraph: {
      // Профиль города — это не статья. Богатые данные (Place/TouristDestination,
      // гео, цены) отдаём через JSON-LD в <CitySchema>/<ProductSchema>.
      title: seo.seo_title ?? undefined,
      description: seo.seo_description ?? undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.seo_title ?? undefined,
      description: seo.seo_description ?? undefined,
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
  const [prices, similar, articles, moscowBaseline] = await Promise.all([
    getPricesByCity(c.id),
    getSimilarCities(c, 4),
    getPostsForCity(c.id, c.country_slug, 3),
    getMoscowBaseline(),
  ]);
  // Сравнение с Москвой показываем всем городам, кроме самой Москвы.
  const moscowComparison =
    c.slug === "moscow" ? null : cityVsMoscow(prices, moscowBaseline);

  // Месячный бюджет «от» из цен страницы — для оценки «для переезда» (LivingScore).
  const { min_rent, monthly_from } = monthlyBudgetFrom(
    Object.values(prices).flat(),
  );
  const cityForScore = { ...c, min_rent, monthly_from };

  return (
    <main className="pb-24">
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

      <QuickFacts city={c} />

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
      <MonthlyBudget prices={prices} cityName={name} />

      <Reveal>
        <Calculator slug={c.slug} prices={prices} cityName={name} />
      </Reveal>

      {content && (
        <Reveal>
          <ProsCons pros={content.pros} cons={content.cons} />
        </Reveal>
      )}

      <Reveal>
        <PricesTable prices={prices} />
      </Reveal>

      {moscowComparison && (
        <>
          <CostVsMoscow cityName={name} comparison={moscowComparison} />
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

      {content && (
        <Reveal>
          <Reviews
            slug={c.slug}
            isForeign={c.is_foreign}
            reviews={content.reviews}
          />
        </Reveal>
      )}

      {content && (
        <Reveal>
          <CityFAQ faq={content.faq} />
        </Reveal>
      )}

      <Reveal>
        <CityArticles posts={articles} cityName={name} />
      </Reveal>

      <Reveal>
        <SimilarCities cities={similar} isForeign={c.is_foreign} />
      </Reveal>

      <Reveal>
        <CompareSuggestions current={c} candidates={similar} />
      </Reveal>

      <div className="pt-24">
        <Footer />
      </div>

      <StickyBar slug={c.slug} isForeign={c.is_foreign} />
      <VerifyOnReturn slug={c.slug} />
    </main>
  );
}

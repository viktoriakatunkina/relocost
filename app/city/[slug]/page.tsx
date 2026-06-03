import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPricesByCity, getSimilarCities } from "@/lib/prices";
import { CITY_CONTENT } from "@/lib/cities-content";
import type { City } from "@/lib/types";
import { CityHero } from "@/components/city/CityHero";
import { QuickFacts } from "@/components/city/QuickFacts";
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
import { StickyBar } from "@/components/freemium/StickyBar";
import { UnlockFromUrl } from "@/components/freemium/UnlockFromUrl";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export async function generateStaticParams() {
  const { data } = await supabase.from("cities").select("slug");
  return (data ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: city } = await supabase
    .from("cities")
    .select("name_ru, seo_title, seo_description")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) return {};
  return {
    title: city.seo_title,
    description: city.seo_description,
  };
}

export default async function CityPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: city } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) notFound();
  const c = city as City;

  const content = CITY_CONTENT[c.slug];
  const [prices, similar] = await Promise.all([
    getPricesByCity(c.id),
    getSimilarCities(c.id, c.is_foreign, 4),
  ]);

  return (
    <main className="pb-24">
      <CityHero city={c} />

      <QuickFacts city={c} />

      <PhotoGallery
        cityName={c.name_ru}
        unsplashUrl={c.unsplash_url}
        authorName={c.unsplash_author_name}
        authorUrl={c.unsplash_author_url}
      />

      {c.intro_text && (
        <section className="max-w-4xl mx-auto px-6 pt-16">
          <p className="text-brandy/90 text-lg md:text-xl leading-relaxed">
            {c.intro_text}
          </p>
        </section>
      )}

      <Calculator slug={c.slug} prices={prices} cityName={c.name_ru} />

      {content && <ProsCons pros={content.pros} cons={content.cons} />}

      <PricesTable prices={prices} />

      {content && <DifficultyBars breakdown={content.difficulty_breakdown} />}

      {content && (
        <BestPlaces slug={c.slug} places={content.best_places} />
      )}

      {content && (
        <VisaSteps
          slug={c.slug}
          isForeign={c.is_foreign}
          steps={content.visa_steps}
        />
      )}

      {content && (
        <Reviews
          slug={c.slug}
          isForeign={c.is_foreign}
          reviews={content.reviews}
        />
      )}

      {content && <CityFAQ faq={content.faq} />}

      <SimilarCities cities={similar} isForeign={c.is_foreign} />

      <div className="pt-24">
        <Footer />
      </div>

      <StickyBar slug={c.slug} isForeign={c.is_foreign} />
      <Suspense fallback={null}>
        <UnlockFromUrl slug={c.slug} />
      </Suspense>
    </main>
  );
}

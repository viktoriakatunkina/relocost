import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { City } from "@/lib/types";

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

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-brandy/70 hover:text-pale-copper text-sm mb-8 inline-block"
        >
          ← Назад
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl">{c.flag_emoji}</span>
          <div>
            <p className="text-pale-copper uppercase text-sm tracking-wider">
              {c.country_ru}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-cream">
              {c.name_ru}
            </h1>
          </div>
        </div>

        {c.intro_text && (
          <p className="text-brandy/90 text-lg leading-relaxed mb-12 max-w-3xl">
            {c.intro_text}
          </p>
        )}

        <div className="rounded-2xl bg-kombu-green/40 border border-dingley/30 p-8 text-center">
          <p className="text-brandy/70">
            Полная страница города в разработке — калькулятор, фотогалерея,
            виза, отзывы и FAQ появятся на следующем этапе.
          </p>
        </div>
      </div>
    </main>
  );
}

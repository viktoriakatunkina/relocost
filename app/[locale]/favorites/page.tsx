import { setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import type { City, CityWithMinRent } from "@/lib/types";
import { FavoritesClient } from "@/components/FavoritesClient";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Сохраненные города — Relocost",
  description: "Города, которые Вы добавили в избранное для сравнения и подробного изучения.",
  robots: { index: false, follow: false },
};

async function getAllCities(): Promise<{ cities: CityWithMinRent[]; dbError: boolean }> {
  const { data: cities, error: citiesError } = await supabase
    .from("cities")
    .select("*")
    .order("name_ru");
  if (citiesError) return { cities: [], dbError: true };
  if (!cities?.length) return { cities: [], dbError: false };
  const ids = cities.map((c) => c.id);
  const { data: rents } = await supabase
    .from("prices")
    .select("city_id, price_min")
    .in("city_id", ids)
    .eq("category", "rent")
    .eq("item_name_ru", "1-комн. квартира на окраине");
  const minByCity = new Map<string, number>();
  for (const r of rents ?? []) minByCity.set(r.city_id, r.price_min);
  return {
    cities: (cities as City[]).map((c) => ({
      ...c,
      min_rent: minByCity.get(c.id) ?? 0,
    })),
    dbError: false,
  };
}

export default async function FavoritesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const { cities: all, dbError } = await getAllCities();
  return (
    <main className="pb-12 md:pb-24">
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
        <p className="text-copper uppercase text-sm tracking-wider mb-4">
          Избранное
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          Сохраненные города
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">
          Города, которые Вы отметили сердечком — собраны в одном месте для
          сравнения и быстрого доступа.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-pill border hairline bg-surface/60 px-4 py-2 text-sm text-brandy/70">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Список хранится в этом браузере. На другом устройстве он не появится —
          сохраните ссылки на города или вернитесь сюда с того же устройства.
        </p>
      </section>
      <FavoritesClient cities={all} dbError={dbError} />
      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}

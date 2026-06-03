import { supabase } from "@/lib/supabase";
import type { City, CityWithMinRent } from "@/lib/types";
import { FavoritesClient } from "@/components/FavoritesClient";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export const metadata = {
  title: "Сохраненные города — Relocost",
  description: "Города, которые Вы добавили в избранное для сравнения и подробного изучения.",
  robots: { index: false, follow: false },
};

async function getAllCities(): Promise<CityWithMinRent[]> {
  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .order("name_ru");
  if (!cities?.length) return [];
  const ids = cities.map((c) => c.id);
  const { data: rents } = await supabase
    .from("prices")
    .select("city_id, price_min")
    .in("city_id", ids)
    .eq("category", "rent")
    .eq("item_name_ru", "1-комн. квартира на окраине");
  const minByCity = new Map<string, number>();
  for (const r of rents ?? []) minByCity.set(r.city_id, r.price_min);
  return (cities as City[]).map((c) => ({
    ...c,
    min_rent: minByCity.get(c.id) ?? 0,
  }));
}

export default async function FavoritesPage() {
  const all = await getAllCities();
  return (
    <main className="pb-24">
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
      </section>
      <FavoritesClient cities={all} />
      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}

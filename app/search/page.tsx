import { supabase } from "@/lib/supabase";
import type { City, CityWithMinRent } from "@/lib/types";
import { SearchClient } from "@/components/search/SearchClient";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export const metadata = {
  title: "Поиск города для переезда — Россия и зарубежом | Relocost",
  description:
    "Найди город по бюджету, климату и визе для россиян. 10+ направлений с реальными ценами и сложностью переезда.",
  // Страница с интерактивными фильтрами — не индексируем, чтобы Google не плодил
  // thin-content варианты с параметрами URL.
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

async function getAllCitiesWithRent(): Promise<CityWithMinRent[]> {
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

export default async function SearchPage() {
  const cities = await getAllCitiesWithRent();

  return (
    <main className="pb-24">
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
        <p className="text-pale-copper uppercase text-sm tracking-wider mb-4">
          Поиск
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          Какой город подойдёт именно тебе?
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">
          Подбери направление по бюджету, климату и визовому режиму. Все цифры —
          из реальных цен на жильё и продукты.
        </p>
      </section>

      <SearchClient cities={cities} />

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}

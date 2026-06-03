import { supabase } from "@/lib/supabase";
import type { City, CityWithBudget } from "@/lib/types";
import { SearchClient } from "@/components/search/SearchClient";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export const metadata = {
  title: "Поиск города для переезда — Россия и зарубежом | Relocost",
  description:
    "Найдите город по бюджету, климату и визе для россиян. 10+ направлений с реальными ценами и сложностью переезда.",
  // Страница с интерактивными фильтрами — не индексируем, чтобы Google не плодил
  // thin-content варианты с параметрами URL.
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

async function getAllCitiesWithBudget(): Promise<CityWithBudget[]> {
  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .order("name_ru");
  if (!cities?.length) return [];
  const ids = cities.map((c) => c.id);

  // Тянем позиции, нужные для экономичного месячного бюджета «от».
  const { data: prices } = await supabase
    .from("prices")
    .select("city_id, category, item_name_ru, price_min")
    .in("city_id", ids)
    .in("category", ["rent", "food", "transport", "utilities"]);

  // Группируем по городу.
  type Row = { item_name_ru: string; price_min: number };
  const byCity = new Map<string, Row[]>();
  for (const p of prices ?? []) {
    const arr = byCity.get(p.city_id) ?? [];
    arr.push({ item_name_ru: p.item_name_ru, price_min: p.price_min });
    byCity.set(p.city_id, arr);
  }

  const find = (rows: Row[], needle: string) =>
    rows.find((r) => r.item_name_ru.includes(needle))?.price_min ?? 0;

  return (cities as City[]).map((c) => {
    const rows = byCity.get(c.id) ?? [];
    const rent = find(rows, "окраине");
    const food = find(rows, "Продукты");
    const transport = find(rows, "проездной");
    const utilities =
      find(rows, "ЖКХ") + find(rows, "Домашний") + find(rows, "Мобильная");
    const monthly_from = rent + food + transport + utilities;
    return { ...c, min_rent: rent, monthly_from };
  });
}

export default async function SearchPage() {
  const cities = await getAllCitiesWithBudget();

  return (
    <main className="pb-24">
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
        <p className="text-copper uppercase text-sm tracking-wider mb-4">
          Поиск
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          Какой город подойдет именно Вам?
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">
          Подберите направление по бюджету, климату и визовому режиму. Все цифры
          — из реальных цен на жилье и продукты.
        </p>
      </section>

      <SearchClient cities={cities} />

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}

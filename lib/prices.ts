import { supabase } from "./supabase";
import type { Price, PriceCategory, City, CityWithMinRent } from "./types";

export const CATEGORY_LABELS: Record<PriceCategory, string> = {
  rent: "Аренда",
  food: "Еда и продукты",
  transport: "Транспорт",
  utilities: "ЖКХ и связь",
  cafe: "Кафе и рестораны",
  health: "Медицина и фитнес",
  entertainment: "Развлечения",
};

export const CATEGORY_ORDER: PriceCategory[] = [
  "rent",
  "food",
  "transport",
  "utilities",
  "cafe",
  "health",
  "entertainment",
];

export async function getPricesByCity(
  cityId: string,
): Promise<Record<PriceCategory, Price[]>> {
  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .eq("city_id", cityId);
  if (error) throw error;
  const grouped = Object.fromEntries(
    CATEGORY_ORDER.map((c) => [c, [] as Price[]]),
  ) as Record<PriceCategory, Price[]>;
  for (const p of (data ?? []) as Price[]) {
    grouped[p.category].push(p);
  }
  return grouped;
}

export async function getSimilarCities(
  currentCityId: string,
  isForeign: boolean,
  limit = 4,
): Promise<CityWithMinRent[]> {
  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .eq("is_foreign", isForeign)
    .neq("id", currentCityId)
    .order("name_ru")
    .limit(limit);
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

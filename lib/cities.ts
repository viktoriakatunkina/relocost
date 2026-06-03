import { supabase } from "./supabase";
import type { City, CityWithMinRent } from "./types";

export async function getPopularCities(
  limit = 6,
): Promise<CityWithMinRent[]> {
  const { data: cities, error } = await supabase
    .from("cities")
    .select("*")
    .eq("is_popular", true)
    .order("name_ru")
    .limit(limit);

  if (error) throw error;
  if (!cities?.length) return [];

  const ids = cities.map((c) => c.id);
  const { data: rents } = await supabase
    .from("prices")
    .select("city_id, price_min")
    .in("city_id", ids)
    .eq("category", "rent")
    .eq("item_name_ru", "1-комн. квартира на окраине");

  const minByCity = new Map<string, number>();
  for (const r of rents ?? []) {
    minByCity.set(r.city_id, r.price_min);
  }

  return (cities as City[]).map((c) => ({
    ...c,
    min_rent: minByCity.get(c.id) ?? 0,
  }));
}

export async function getAllCitiesForSearch(): Promise<
  Pick<City, "slug" | "name_ru" | "country_ru" | "flag_emoji">[]
> {
  const { data, error } = await supabase
    .from("cities")
    .select("slug, name_ru, country_ru, flag_emoji")
    .order("name_ru");
  if (error) throw error;
  return data ?? [];
}

export function formatRub(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

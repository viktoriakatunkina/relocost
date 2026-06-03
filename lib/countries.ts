import { supabase } from "./supabase";
import type { City, CityWithMinRent } from "./types";

export async function getCitiesInCountry(
  countrySlug: string,
): Promise<CityWithMinRent[]> {
  const { data: cities, error } = await supabase
    .from("cities")
    .select("*")
    .eq("country_slug", countrySlug)
    .order("name_ru");
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
  for (const r of rents ?? []) minByCity.set(r.city_id, r.price_min);
  return (cities as City[]).map((c) => ({
    ...c,
    min_rent: minByCity.get(c.id) ?? 0,
  }));
}

export async function getAllCountrySlugs(): Promise<string[]> {
  const { data } = await supabase.from("cities").select("country_slug");
  const set = new Set<string>();
  for (const row of data ?? []) {
    if (row.country_slug) set.add(row.country_slug);
  }
  return Array.from(set);
}

export async function getCountryMeta(
  countrySlug: string,
): Promise<{ country_ru: string; country_en: string; flag_emoji: string | null; is_foreign: boolean } | null> {
  const { data } = await supabase
    .from("cities")
    .select("country_ru, country_en, flag_emoji, is_foreign")
    .eq("country_slug", countrySlug)
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

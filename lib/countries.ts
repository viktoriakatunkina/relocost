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

export type CountryAggregate = {
  slug: string;
  country_ru: string;
  country_en: string;
  flag_emoji: string | null;
  is_foreign: boolean;
  city_count: number;
  cities_preview: string[];
  min_rent: number;
  avg_difficulty: number;
};

export async function getAllCountriesAggregated(): Promise<CountryAggregate[]> {
  const { data: cities, error } = await supabase
    .from("cities")
    .select("id, name_ru, country_slug, country_ru, country_en, flag_emoji, is_foreign, difficulty_score")
    .order("name_ru");
  if (error) throw error;
  if (!cities?.length) return [];

  const cityIds = cities.map((c) => c.id);
  const { data: rents } = await supabase
    .from("prices")
    .select("city_id, price_min")
    .in("city_id", cityIds)
    .eq("category", "rent")
    .eq("item_name_ru", "1-комн. квартира на окраине");
  const rentByCity = new Map<string, number>();
  for (const r of rents ?? []) rentByCity.set(r.city_id, r.price_min);

  const map = new Map<string, CountryAggregate & { _diff_sum: number }>();
  for (const c of cities) {
    if (!c.country_slug) continue;
    const rent = rentByCity.get(c.id) ?? 0;
    const ex = map.get(c.country_slug);
    if (!ex) {
      map.set(c.country_slug, {
        slug: c.country_slug,
        country_ru: c.country_ru,
        country_en: c.country_en,
        flag_emoji: c.flag_emoji,
        is_foreign: c.is_foreign,
        city_count: 1,
        cities_preview: [c.name_ru],
        min_rent: rent || Number.POSITIVE_INFINITY,
        avg_difficulty: 0,
        _diff_sum: c.difficulty_score ?? 0,
      });
    } else {
      ex.city_count += 1;
      if (ex.cities_preview.length < 3) ex.cities_preview.push(c.name_ru);
      if (rent && rent < ex.min_rent) ex.min_rent = rent;
      ex._diff_sum += c.difficulty_score ?? 0;
    }
  }

  const out: CountryAggregate[] = Array.from(map.values()).map((c) => ({
    slug: c.slug,
    country_ru: c.country_ru,
    country_en: c.country_en,
    flag_emoji: c.flag_emoji,
    is_foreign: c.is_foreign,
    city_count: c.city_count,
    cities_preview: c.cities_preview,
    min_rent: Number.isFinite(c.min_rent) ? c.min_rent : 0,
    avg_difficulty: c.city_count > 0 ? Math.round(c._diff_sum / c.city_count) : 0,
  }));

  return out.sort((a, b) => {
    if (a.is_foreign !== b.is_foreign) return a.is_foreign ? -1 : 1;
    return b.city_count - a.city_count || a.country_ru.localeCompare(b.country_ru, "ru");
  });
}

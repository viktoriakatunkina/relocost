import { supabase } from "./supabase";
import type { City, CityWithMinRent } from "./types";

// Ручной список популярных направлений для блока «Популярные направления»
// на главной. Отобран вручную (топ-интенты русскоязычных релокантов), порядок
// слагов = порядок вывода в сетке 3×2. Все слаги проверены — присутствуют в БД.
// TODO: позже заменить на автоматический выбор по реальным просмотрам страниц
// городов из Яндекс.Метрики.
export const FEATURED_CITY_SLUGS = [
  "tbilisi",
  "yerevan",
  "istanbul",
  "dubai",
  "belgrade",
  "almaty",
] as const;

// Дотягивает min_rent (аренда 1-комн. на окраине) для набора городов.
async function attachMinRent(cities: City[]): Promise<CityWithMinRent[]> {
  if (!cities.length) return [];
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

  return cities.map((c) => ({
    ...c,
    min_rent: minByCity.get(c.id) ?? 0,
  }));
}

// Города для блока «Популярные направления».
// Берёт города по ручному списку FEATURED_CITY_SLUGS и возвращает их строго
// В ПОРЯДКЕ массива (не алфавитно), пропуская отсутствующие в БД.
// Fallback: если по списку ничего не нашлось — отдаёт первые `limit`
// популярных городов по алфавиту (как раньше), чтобы блок не пустовал.
export async function getPopularCities(
  limit = 6,
): Promise<CityWithMinRent[]> {
  const { data: featured, error } = await supabase
    .from("cities")
    .select("*")
    .in("slug", FEATURED_CITY_SLUGS as unknown as string[]);

  if (error) throw error;

  if (featured?.length) {
    // Восстанавливаем порядок из FEATURED_CITY_SLUGS (PostgREST возвращает
    // строки в произвольном порядке), пропускаем не найденные слаги.
    const bySlug = new Map((featured as City[]).map((c) => [c.slug, c]));
    const ordered = FEATURED_CITY_SLUGS.map((s) => bySlug.get(s)).filter(
      (c): c is City => Boolean(c),
    ).slice(0, limit);
    if (ordered.length) return attachMinRent(ordered);
  }

  // Fallback — первые `limit` популярных по алфавиту.
  const { data: fallback, error: fbError } = await supabase
    .from("cities")
    .select("*")
    .eq("is_popular", true)
    .order("name_ru")
    .limit(limit);

  if (fbError) throw fbError;
  return attachMinRent((fallback as City[]) ?? []);
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

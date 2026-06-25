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

// Похожие направления подбираем по РЕЛЕВАНТНОСТИ, а не по алфавиту:
// 1) сильный приоритет — та же страна (после Тбилиси показываем Батуми/Кутаиси);
// 2) близкая сложность переезда; 3) близкий уровень аренды.
// Раньше брали первые N по алфавиту (Абу-Даби, Актау, Алания…) — нерелевантно.
export async function getSimilarCities(
  current: Pick<City, "id" | "is_foreign" | "country_slug" | "difficulty_score">,
  limit = 4,
): Promise<CityWithMinRent[]> {
  const { data: pool } = await supabase
    .from("cities")
    .select("*")
    .eq("is_foreign", current.is_foreign)
    .neq("id", current.id);
  if (!pool?.length) return [];

  const ids = [current.id, ...pool.map((c) => c.id)];
  const { data: rents } = await supabase
    .from("prices")
    .select("city_id, price_min")
    .in("city_id", ids)
    .eq("category", "rent")
    .eq("item_name_ru", "1-комн. квартира на окраине");
  const rentBy = new Map<string, number>();
  for (const r of rents ?? []) rentBy.set(r.city_id, r.price_min);

  const curRent = rentBy.get(current.id) ?? 0;
  const curDiff = current.difficulty_score ?? 3;

  const scored = (pool as City[]).map((c) => {
    const rent = rentBy.get(c.id) ?? 0;
    const sameCountry = c.country_slug === current.country_slug ? 1 : 0;
    const diffDist = Math.abs((c.difficulty_score ?? 3) - curDiff);
    const rentDist =
      curRent > 0 && rent > 0
        ? Math.abs(rent - curRent) / Math.max(curRent, rent)
        : 1;
    // Меньше score = релевантнее. Та же страна перевешивает всё остальное.
    const score = -sameCountry * 10 + diffDist + rentDist * 2;
    return { city: { ...c, min_rent: rent } as CityWithMinRent, score };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((s) => s.city);
}

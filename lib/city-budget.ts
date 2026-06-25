import { supabase } from "./supabase";
import type { City, CityWithBudget } from "./types";

// Все города с экономичным месячным бюджетом «от» (аренда на окраине + продукты
// + проездной + ЖКХ/интернет/мобильная). Используется поиском и подборками /list.
//
// ВАЖНО: база prices (rent/food/transport/utilities) ~34 позиции × 99 городов =
// ~3400 строк, а supabase-js select молча отдаёт максимум 1000. Поэтому цены
// тянем С ПАГИНАЦИЕЙ — иначе у ~70 городов бюджет посчитается как 0 и они
// провалятся в сортировке по цене. (см. reference-supabase-select-1000-limit)
export async function getCitiesWithBudget(): Promise<CityWithBudget[]> {
  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .order("name_ru");
  if (!cities?.length) return [];
  const ids = cities.map((c) => c.id);

  type Row = { city_id: string; item_name_ru: string; price_min: number };
  let prices: Row[] = [];
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await supabase
      .from("prices")
      .select("city_id, item_name_ru, price_min")
      .in("city_id", ids)
      .in("category", ["rent", "food", "transport", "utilities"])
      .range(from, from + 999);
    if (!data?.length) break;
    prices = prices.concat(data as Row[]);
    if (data.length < 1000) break;
    from += 1000;
  }

  const byCity = new Map<string, { item_name_ru: string; price_min: number }[]>();
  for (const p of prices) {
    const arr = byCity.get(p.city_id) ?? [];
    arr.push({ item_name_ru: p.item_name_ru, price_min: p.price_min });
    byCity.set(p.city_id, arr);
  }
  const find = (
    rows: { item_name_ru: string; price_min: number }[],
    needle: string,
  ) => rows.find((r) => r.item_name_ru.includes(needle))?.price_min ?? 0;

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

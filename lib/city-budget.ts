import { supabase } from "./supabase";
import type { City, CityWithBudget } from "./types";

// Все города с экономичным месячным бюджетом «от» (аренда на окраине + продукты
// + проездной + ЖКХ/интернет/мобильная). Используется поиском и подборками /list,
// а также страницами /quiz, /rating, sitemap.
//
// Build-time мемоизация: при сборке десятки страниц (search/quiz/rating/lists/
// sitemap) подряд зовут эту функцию, и одно­поточный воркер (cpus:1) каждый раз
// заново бьёт 3-4 запросами в Supabase — это и грузит БД до 57014-таймаутов.
// Кешируем результат на процесс воркера ТОЛЬКО в фазе сборки. В рантайме
// (next start, ISR revalidate) НЕ кешируем — иначе данные застыли бы до
// перезапуска сервера и суточная ревалидация перестала бы обновлять цены.
const IS_BUILD =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.LOWMEM_BUILD === "1";
let _buildCache: Promise<CityWithBudget[]> | null = null;

export function getCitiesWithBudget(): Promise<CityWithBudget[]> {
  if (IS_BUILD) {
    if (!_buildCache) _buildCache = fetchCitiesWithBudget();
    return _buildCache;
  }
  return fetchCitiesWithBudget();
}

// ВАЖНО: база prices (rent/food/transport/utilities) ~34 позиции × 99 городов =
// ~3400 строк, а supabase-js select молча отдаёт максимум 1000. Поэтому цены
// тянем С ПАГИНАЦИЕЙ — иначе у ~70 городов бюджет посчитается как 0 и они
// провалятся в сортировке по цене. (см. reference-supabase-select-1000-limit)
async function fetchCitiesWithBudget(): Promise<CityWithBudget[]> {
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

  return (cities as City[]).map((c) => {
    const { min_rent, monthly_from } = monthlyBudgetFrom(byCity.get(c.id) ?? []);
    return { ...c, min_rent, monthly_from };
  });
}

// Экономичный месячный бюджет «от» по строкам цен города (аренда на окраине +
// продукты + проездной + ЖКХ/интернет/мобильная). Вынесено, чтобы тот же расчёт
// использовать на странице города (для оценки/рейтинга), не дублируя логику.
export function monthlyBudgetFrom(
  rows: { item_name_ru: string; price_min: number }[],
): { min_rent: number; monthly_from: number } {
  const find = (needle: string) =>
    rows.find((r) => r.item_name_ru.includes(needle))?.price_min ?? 0;
  const rent = find("окраине");
  const food = find("Продукты");
  const transport = find("проездной");
  const utilities =
    find("ЖКХ") + find("Домашний") + find("Мобильная");
  return { min_rent: rent, monthly_from: rent + food + transport + utilities };
}

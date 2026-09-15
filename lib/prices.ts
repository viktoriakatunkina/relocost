import { supabase } from "./supabase";
import { CITY_ROUTES } from "./city-routes";
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
    // Лёгкий буст городам с полным контентом (маршруты+12 мест+расширенная
    // аренда — см. CITY_ROUTES): по факту реальных покупок 5 из 6 оплат
    // пришлись именно на такие страницы (2026-09-11) — это не гипотеза,
    // а подтверждённый рычаг конверсии. Буст — тай-брейкер среди похожих
    // по стране/сложности/аренде, а не замена этой логике.
    //
    // 2026-09-15, техSEO-аудит: буст в 2 балла (при 118/174 городов из
    // CITY_ROUTES) на практике перевешивал не только сравнение «свой/чужой
    // город», а и сравнение ВНУТРИ своей страны — обогащённый сосед по
    // стране систематически забивал топ-4 у всех остальных городов той же
    // страны, и необогащённые города (напр. izmir/madrid/pondicherry при
    // обогащённых istanbul/barcelona/goa) не попадали НИ В ЧЬИ подборки —
    // 50/174 городов не получали ни одной входящей ссылки из блока
    // «Похожие направления». Проверено симуляцией по всем 174×174 парам:
    // вес страны (было 10) сам по себе почти не влиял на число «городов-
    // сирот» — весь эффект давал именно буст. Снизили буст 2 → 0.3 (по
    // симуляции: 24 → 13 сирот, все 4 полностью безлинковых города из
    // аудита получают входящие ссылки) и заодно смягчили вес страны
    // 10 → 6 (той же симуляцией подтверждено: для обычных городов подборка
    // не меняется — своя страна всё ещё почти всегда перевешивает; шанс
    // получить соседа из другой страны появляется только когда внутристра-
    // новых кандидатов с сопоставимой сложностью/арендой мало).
    const enrichedBonus = CITY_ROUTES[c.slug] ? 0.3 : 0;
    // Меньше score = релевантнее. Своя страна почти всегда перевешивает
    // остальное, но не абсолютно — см. комментарий у enrichedBonus выше.
    const score = -sameCountry * 6 + diffDist + rentDist * 2 - enrichedBonus;
    return { city: { ...c, min_rent: rent } as CityWithMinRent, score };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((s) => s.city);
}

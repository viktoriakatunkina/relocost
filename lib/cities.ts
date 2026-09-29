import { supabase } from "./supabase";
import type { City, CityWithMinRent } from "./types";
import { currencySymbol } from "./currency";

// Ручной список популярных направлений для блока «Популярные направления»
// на главной. Порядок слагов = порядок вывода в блоке. Все слаги проверены —
// присутствуют в БД.
// TODO: позже заменить на автоматический выбор по реальным просмотрам страниц
// городов из Яндекс.Метрики.
//
// 2026-09-27: список сверен через WebSearch (диаспоры/статистика ВНЖ по
// городам, 2022-2026). Пять городов оставлены как самые массовые и
// устойчивые хабы релокации: Тбилиси, Ереван, Стамбул, Дубай, Белград —
// в каждом либо крупнейшая русскоязычная диаспора в своей стране (Белград:
// 80-150 тыс. россиян, ~83% из них именно в Белграде), либо статус главного
// делового/туристического хаба (Дубай: ~50 тыс. русскоговорящих; Стамбул —
// крупнейший рынок недвижимости для россиян в Турции).
// Алматы убран из блока (был 6-м при лимите 5, фактически не показывался):
// по данным check-point.kz и finprom.kz, отток русского населения из
// Казахстана ускорился, а волна релокантов после мобилизации 2022 схлопнулась
// с ~400 тыс. до 50-80 тыс. — заметно меньше и без явного восстановления,
// в отличие от остальных 5 городов. Казахстан как страна остаётся в топ-8
// FEATURED_COUNTRY_SLUGS (lib/countries.ts) — там сигнал устойчивее.
export const FEATURED_CITY_SLUGS = [
  "tbilisi",
  "yerevan",
  "istanbul",
  "dubai",
  "belgrade",
  "batumi",
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

  if (error) return [];

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

  if (fbError) return [];
  return attachMinRent((fallback as City[]) ?? []);
}

export async function getAllCitiesForSearch(): Promise<
  Pick<City, "slug" | "name_ru" | "country_ru" | "flag_emoji">[]
> {
  const { data, error } = await supabase
    .from("cities")
    .select("slug, name_ru, country_ru, flag_emoji")
    .order("name_ru");
  if (error) return [];
  return data ?? [];
}

// Лёгкий список городов для сопоставления заголовка статьи блога с городом/
// страной (lib/blog-city-match.ts) — рантайм-фолбэк CTA для статей без
// city_id/country_slug. Используется только когда у статьи оба поля пустые.
export async function getCitiesForTitleMatch(): Promise<
  Pick<City, "id" | "slug" | "name_ru" | "country_ru" | "country_slug" | "flag_emoji">[]
> {
  const { data, error } = await supabase
    .from("cities")
    .select("id, slug, name_ru, country_ru, country_slug, flag_emoji");
  if (error) return [];
  return data ?? [];
}

export function formatRub(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

/**
 * Форматирует минимальную аренду в карточке города с учетом местной валюты.
 * Российские города: «35 000 ₽», иностранные: «₾ 650», «฿ 13 000» и т.д.
 * Цены иностранных городов в БД хранятся в местной валюте, поэтому нельзя
 * добавлять «₽» без проверки.
 */
export function formatMinRent(
  value: number,
  currency: string | null | undefined,
): string {
  const sym = currency ? currencySymbol(currency) : null;
  const n = new Intl.NumberFormat("ru-RU").format(value);
  if (!sym || sym === "₽") return `${n} ₽`;
  return `${sym} ${n}`;
}

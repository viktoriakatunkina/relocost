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
  if (error) return [];
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

export type CountrySearchItem = {
  slug: string;
  name_ru: string;
  name_en: string;
  flag_emoji: string | null;
};

export async function getAllCountriesForSearch(): Promise<CountrySearchItem[]> {
  const { data, error } = await supabase
    .from("cities")
    .select("country_slug, country_ru, country_en, flag_emoji")
    .order("country_ru");
  if (error) return [];
  const map = new Map<string, CountrySearchItem>();
  for (const row of data ?? []) {
    if (!row.country_slug || map.has(row.country_slug)) continue;
    map.set(row.country_slug, {
      slug: row.country_slug,
      name_ru: row.country_ru,
      name_en: row.country_en,
      flag_emoji: row.flag_emoji,
    });
  }
  return Array.from(map.values());
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

// Ручной приоритетный порядок стран для каталога /countries — самые
// популярные у русскоязычных релокантов направления выводятся первыми
// (внутри своих групп «за рубежом» / «по России»), остальные — после них
// по числу городов и алфавиту. Слаги сверены с БД (country_slug в cities).
// TODO: позже заменить на автоматический порядок по реальным просмотрам
// страниц стран/городов из Яндекс.Метрики.
export const FEATURED_COUNTRY_SLUGS = [
  "georgia",
  "armenia",
  "turkey",
  "serbia",
  "kazakhstan",
  "uae",
  "thailand",
  "montenegro",
  "uzbekistan",
  "indonesia",
  "cyprus",
  "vietnam",
] as const;

// Индекс приоритета: чем меньше число, тем выше в списке. Страны вне списка
// получают большое число и сортируются дальше по числу городов/алфавиту.
const FEATURED_RANK = new Map<string, number>(
  FEATURED_COUNTRY_SLUGS.map((slug, i) => [slug, i]),
);

export type CountryAggregate = {
  slug: string;
  country_ru: string;
  country_en: string;
  flag_emoji: string | null;
  is_foreign: boolean;
  city_count: number;
  cities_preview: string[];
  min_rent: number;
  // Валюта города с самой дешевой арендой — для корректного отображения цены.
  // null для российских городов (показывается ₽).
  min_rent_currency: string | null;
  avg_difficulty: number;
  // Базовый URL фото репрезентативного города страны (столица/популярный
  // город или первый по алфавиту). Используется как фон карточки страны.
  // null — если ни у одного города страны нет фото (тогда карточка
  // показывает градиент-плейсхолдер).
  photo_url: string | null;
  // Slug города, чьё фото используется как обложка страны (для R2-пути).
  photo_city_slug: string | null;
};

export async function getAllCountriesAggregated(): Promise<CountryAggregate[]> {
  const { data: cities, error } = await supabase
    .from("cities")
    .select(
      "id, slug, name_ru, country_slug, country_ru, country_en, flag_emoji, is_foreign, is_popular, difficulty_score, unsplash_url, currency",
    )
    .order("name_ru");
  if (error) return [];
  if (!cities?.length) return [];

  const cityIds = cities.map((c) => c.id);
  // «Аренда от» по стране = минимальная аренда 1-комн. на окраине среди её
  // городов. Считается динамически из реальных цен в БД (тот же ценовой
  // элемент, что в карточках/страницах городов — единый ориентир по сайту).
  const { data: rents } = await supabase
    .from("prices")
    .select("city_id, price_min")
    .in("city_id", cityIds)
    .eq("category", "rent")
    .eq("item_name_ru", "1-комн. квартира на окраине");
  const rentByCity = new Map<string, number>();
  for (const r of rents ?? []) rentByCity.set(r.city_id, r.price_min);

  type Acc = CountryAggregate & { _diff_sum: number; _photo_popular: boolean; _photo_city_slug: string | null };
  const map = new Map<string, Acc>();
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
        min_rent_currency: rent ? (c.currency ?? null) : null,
        avg_difficulty: 0,
        photo_url: c.unsplash_url ?? null,
        photo_city_slug: c.slug ?? null,
        _diff_sum: c.difficulty_score ?? 0,
        _photo_popular: Boolean(c.is_popular && c.unsplash_url),
        _photo_city_slug: c.slug ?? null,
      });
    } else {
      // city_count считается динамически — растёт при каждом городе страны.
      ex.city_count += 1;
      if (ex.cities_preview.length < 3) ex.cities_preview.push(c.name_ru);
      if (rent && rent < ex.min_rent) {
        ex.min_rent = rent;
        ex.min_rent_currency = c.currency ?? null;
      }
      ex._diff_sum += c.difficulty_score ?? 0;
      // Репрезентативное фото: предпочитаем популярный город (is_popular).
      // Города идут в порядке name_ru, поэтому без популярного берётся
      // первый по алфавиту (уже записан при создании записи страны).
      if (!ex._photo_popular && c.is_popular && c.unsplash_url) {
        ex.photo_url = c.unsplash_url;
        ex._photo_city_slug = c.slug ?? null;
        ex._photo_popular = true;
      } else if (!ex.photo_url && c.unsplash_url) {
        ex.photo_url = c.unsplash_url;
        ex._photo_city_slug = c.slug ?? null;
      }
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
    min_rent_currency: Number.isFinite(c.min_rent) ? c.min_rent_currency : null,
    // Агрегатная сложность страны = среднее difficulty_score её городов,
    // округлённое до целого; затем сводится к 3 уровням в getDifficulty.
    avg_difficulty: c.city_count > 0 ? Math.round(c._diff_sum / c.city_count) : 0,
    photo_url: c.photo_url,
    photo_city_slug: c._photo_city_slug ?? null,
  }));

  return out.sort((a, b) => {
    // Сначала группа: зарубежные выше (страница их всё равно делит на секции,
    // но порядок остаётся осмысленным и в общем массиве).
    if (a.is_foreign !== b.is_foreign) return a.is_foreign ? -1 : 1;
    // Внутри группы — ручной приоритет популярных направлений.
    const ra = FEATURED_RANK.get(a.slug) ?? Number.POSITIVE_INFINITY;
    const rb = FEATURED_RANK.get(b.slug) ?? Number.POSITIVE_INFINITY;
    if (ra !== rb) return ra - rb;
    // Остальные — по числу городов, затем по алфавиту.
    return b.city_count - a.city_count || a.country_ru.localeCompare(b.country_ru, "ru");
  });
}

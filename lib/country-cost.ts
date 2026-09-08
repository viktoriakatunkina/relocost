import { supabase } from "./supabase";
import { COUPLE, FAMILY, householdMultipliers } from "./household";
import type { City } from "./types";

// Агрегированная стоимость жизни ПО СТРАНЕ — под запрос «стоимость жизни в
// <стране> 2026» / «сколько стоит жить в <стране>».
//
// Зачем отдельный модуль: до этого страница /country/[slug] вообще не отвечала
// на главный запрос кластера — показывала климат, менталитет, язык, визу и
// карточки городов, но ни одной цифры бюджета. При этом Яндекс.Suggest на
// «стоимость жизни в» и «сколько стоит жить в» отдает СТРАНЫ (Вьетнам,
// Беларусь, Сербия, Таиланд, Грузия, Испания, Австралия, Армения), а не города,
// и в выдаче на этом уровне стоит gogov.ru с /cost-of-living/<страна>.
//
// Методика (важно для доверия и для текста «как мы считаем» на странице):
//   • считаем не «среднее по стране вообще», а МЕДИАНУ ПО КАТЕГОРИЯМ среди
//     городов страны, которые есть в базе. Медиана устойчива к перекосу от
//     одного дорогого мегаполиса (Стамбул в Турции, Джакарта в Индонезии);
//   • сумма медиан по 4 базовым категориям = «экономный месяц на одного»,
//     тот же набор позиций, что считает monthlyBudgetFrom для городов, —
//     чтобы цифры страны и городов на сайте не противоречили друг другу;
//   • категории агрегируются НЕЗАВИСИМО: если у города нет позиции «проездной»
//     или «ЖКХ», он не занижает медиану по этой категории (раньше такой город
//     давал ноль в сумме и портил диапазон по стране);
//   • диапазон «от и до» по стране строится только по городам с ПОЛНЫМ набором
//     позиций — иначе «самый дешевый город» оказывался городом с дырой в данных.
//
// Все цены в prices хранятся в рублях (см. fix партии 2026-07-13, которая
// записала часть городов в местной валюте — донги/евро/драмы — и ломала как
// страницы городов, так и любую агрегацию).

export type CountryCostCity = {
  slug: string;
  name_ru: string;
  rent: number;
  rentCenter: number;
  food: number;
  transport: number;
  utilities: number;
  /** Экономный месяц на одного: аренда + продукты + проездной + ЖКХ/связь. */
  monthly: number;
  /** Есть все 4 категории — можно использовать в диапазоне «от … до …». */
  complete: boolean;
};

export type CountryCostLine = {
  key: "rent" | "food" | "transport" | "utilities";
  label: string;
  /** Медиана по городам страны, ₽/мес. */
  value: number;
  /** Сколько городов страны дали данные по этой категории. */
  cities: number;
};

export type CountryCost = {
  countrySlug: string;
  /** Городов страны в базе (после схлопывания дублей по названию). */
  cityCount: number;
  /** Городов, по которым есть полный набор позиций. */
  completeCount: number;
  lines: CountryCostLine[];
  /** Экономный месяц на одного — сумма медиан. */
  monthlySolo: number;
  /** Тот же бюджет на пару и на семью с ребенком (множители lib/household). */
  monthlyCouple: number;
  monthlyFamily: number;
  /** «Комфортный» месяц на одного: аренда в центре + верхняя граница расходов. */
  monthlyComfort: number;
  cheapest: CountryCostCity | null;
  priciest: CountryCostCity | null;
  /** Все города страны с ценами, по возрастанию месячного бюджета. */
  cities: CountryCostCity[];
  /** Медианная аренда 1-комн. в центре — для блока «аренда». */
  rentCenter: number;
};

const LABELS: Record<CountryCostLine["key"], string> = {
  rent: "Аренда 1-комн. на окраине",
  food: "Продукты на месяц",
  transport: "Проездной на транспорт",
  utilities: "ЖКХ, интернет и связь",
};

function median(values: number[]): number {
  const v = values.filter((x) => x > 0).sort((a, b) => a - b);
  if (v.length === 0) return 0;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2);
}

type PriceRow = { city_id: string; item_name_ru: string; price_min: number; price_max: number };

function pick(rows: PriceRow[], needle: string, field: "price_min" | "price_max" = "price_min"): number {
  return rows.find((r) => r.item_name_ru.includes(needle))?.[field] ?? 0;
}

/**
 * Считает агрегат по уже загруженным городам и их ценам — чистая функция,
 * чтобы ее можно было переиспользовать в сравнении стран без лишних запросов.
 */
export function buildCountryCost(
  countrySlug: string,
  cities: Pick<City, "id" | "slug" | "name_ru">[],
  rowsByCity: Map<string, PriceRow[]>,
): CountryCost | null {
  // Схлопываем дубли города по названию (в базе, например, есть и `chiang-mai`,
  // и `chiangmai` — один и тот же Чиангмай двумя записями). Оставляем ту, где
  // больше строк цен, иначе город дважды влиял бы на медиану страны.
  const byName = new Map<string, Pick<City, "id" | "slug" | "name_ru">>();
  for (const c of cities) {
    const ex = byName.get(c.name_ru);
    if (!ex || (rowsByCity.get(c.id)?.length ?? 0) > (rowsByCity.get(ex.id)?.length ?? 0)) {
      byName.set(c.name_ru, c);
    }
  }

  const list: CountryCostCity[] = [];
  for (const c of Array.from(byName.values())) {
    const rows = rowsByCity.get(c.id) ?? [];
    if (rows.length === 0) continue;
    const rent = pick(rows, "окраине");
    const rentCenter = pick(rows, "1-комн. квартира в центре");
    const food = pick(rows, "Продукты");
    const transport = pick(rows, "проездной");
    const utilities = pick(rows, "ЖКХ") + pick(rows, "Домашний") + pick(rows, "Мобильная");
    if (rent <= 0 && food <= 0) continue;
    const complete = rent > 0 && food > 0 && transport > 0 && utilities > 0;
    list.push({
      slug: c.slug,
      name_ru: c.name_ru,
      rent,
      rentCenter,
      food,
      transport,
      utilities,
      monthly: rent + food + transport + utilities,
      complete,
    });
  }
  if (list.length === 0) return null;

  const lines: CountryCostLine[] = (["rent", "food", "transport", "utilities"] as const).map((key) => {
    const vals = list.map((c) => c[key]).filter((v) => v > 0);
    return { key, label: LABELS[key], value: median(vals), cities: vals.length };
  });

  const monthlySolo = lines.reduce((acc, l) => acc + l.value, 0);
  const rentLine = lines.find((l) => l.key === "rent")!.value;
  const foodLine = lines.find((l) => l.key === "food")!.value;
  const transportLine = lines.find((l) => l.key === "transport")!.value;
  const utilLine = lines.find((l) => l.key === "utilities")!.value;

  const withHousehold = (h: Parameters<typeof householdMultipliers>[0]) => {
    const m = householdMultipliers(h);
    return Math.round(
      rentLine * m.rent + foodLine * m.food + transportLine * m.transport + utilLine * m.utilities,
    );
  };

  // «Комфортный» месяц: жилье в центре вместо окраины + 40% сверху на еду,
  // транспорт и услуги (такси вместо проездного, кафе, более дорогой район).
  // Если цены центра в базе нет — берем аренду окраины с коэффициентом 1,5
  // (средняя премия центра по базе, та же оценка используется в lib/household).
  const centerMedian = median(list.map((c) => c.rentCenter));
  const rentCenterValue = centerMedian > 0 ? centerMedian : Math.round(rentLine * 1.5);
  const monthlyComfort = Math.round(rentCenterValue + (foodLine + transportLine + utilLine) * 1.4);

  const complete = list.filter((c) => c.complete).sort((a, b) => a.monthly - b.monthly);
  const sorted = [...list].sort((a, b) => a.monthly - b.monthly);

  return {
    countrySlug,
    cityCount: list.length,
    completeCount: complete.length,
    lines,
    monthlySolo,
    monthlyCouple: withHousehold(COUPLE),
    monthlyFamily: withHousehold(FAMILY),
    monthlyComfort,
    cheapest: complete[0] ?? null,
    priciest: complete.length > 1 ? complete[complete.length - 1] : null,
    cities: sorted,
    rentCenter: rentCenterValue,
  };
}

/** Загружает города страны с ценами и возвращает агрегат стоимости жизни. */
export async function getCountryCost(countrySlug: string): Promise<CountryCost | null> {
  const { data: cities } = await supabase
    .from("cities")
    .select("id, slug, name_ru")
    .eq("country_slug", countrySlug);
  if (!cities?.length) return null;
  const rowsByCity = await loadPriceRows(cities.map((c) => c.id));
  return buildCountryCost(countrySlug, cities as City[], rowsByCity);
}

/**
 * Цены по списку городов с пагинацией. supabase-js молча режет select на 1000
 * строк, а у 175 городов только базовых категорий ~4,5 тыс. строк — без
 * пагинации у большинства городов бюджет посчитался бы нулем.
 */
export async function loadPriceRows(cityIds: string[]): Promise<Map<string, PriceRow[]>> {
  const out = new Map<string, PriceRow[]>();
  if (cityIds.length === 0) return out;
  let from = 0;
  for (;;) {
    const { data } = await supabase
      .from("prices")
      .select("city_id, item_name_ru, price_min, price_max")
      .in("city_id", cityIds)
      .in("category", ["rent", "food", "transport", "utilities"])
      .range(from, from + 999);
    if (!data?.length) break;
    for (const r of data as PriceRow[]) {
      const arr = out.get(r.city_id) ?? [];
      arr.push(r);
      out.set(r.city_id, arr);
    }
    if (data.length < 1000) break;
    from += 1000;
  }
  return out;
}

/** Загружает агрегаты сразу по двум странам — для /compare/<страна>-vs-<страна>. */
export async function getCountryCostPair(
  slugA: string,
  slugB: string,
): Promise<{ a: CountryCost | null; b: CountryCost | null }> {
  const { data: cities } = await supabase
    .from("cities")
    .select("id, slug, name_ru, country_slug")
    .in("country_slug", [slugA, slugB]);
  if (!cities?.length) return { a: null, b: null };
  const rowsByCity = await loadPriceRows(cities.map((c) => c.id));
  const of = (slug: string) =>
    buildCountryCost(
      slug,
      cities.filter((c) => c.country_slug === slug) as City[],
      rowsByCity,
    );
  return { a: of(slugA), b: of(slugB) };
}

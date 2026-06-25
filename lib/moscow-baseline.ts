import { supabase } from "./supabase";
import type { Price, PriceCategory } from "./types";

// Сравнение цен города с Москвой — бьет в интент «насколько X дешевле Москвы».
// Базовые цены Москвы тянем один раз и кэшируем на уровне модуля: при SSG
// прегенерации сотен городов это экономит сотни запросов (один промис на сборку).

export type CompareItemKey = "rent" | "food" | "lunch" | "transit" | "coffee";

type CompareSpec = {
  key: CompareItemKey;
  label: string;
  match: (name: string) => boolean;
};

// Узнаваемые повседневные позиции — чтобы сравнение было «человеческим».
const COMPARE_SPECS: CompareSpec[] = [
  { key: "rent", label: "Аренда 1-комн. (окраина)", match: (n) => n.includes("окраине") },
  { key: "food", label: "Продукты на месяц", match: (n) => n.includes("Продукты") },
  { key: "lunch", label: "Обед в кафе", match: (n) => n.includes("Обед в кафе") },
  { key: "transit", label: "Проездной на месяц", match: (n) => n.includes("проездной") },
  { key: "coffee", label: "Капучино", match: (n) => n.includes("Капучино") },
];

export type MoscowBaseline = Record<CompareItemKey, number>;

let cache: Promise<MoscowBaseline | null> | null = null;

function specPrice(rows: Price[], spec: CompareSpec): number {
  return rows.find((r) => spec.match(r.item_name_ru))?.price_min ?? 0;
}

async function load(): Promise<MoscowBaseline | null> {
  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "moscow")
    .maybeSingle();
  if (!city) return null;

  const { data: rows } = await supabase
    .from("prices")
    .select("item_name_ru, price_min, category")
    .eq("city_id", city.id)
    .in("category", ["rent", "food", "transport"]);
  if (!rows?.length) return null;

  const out = {} as MoscowBaseline;
  for (const spec of COMPARE_SPECS) {
    out[spec.key] = specPrice(rows as Price[], spec);
  }
  return out;
}

export function getMoscowBaseline(): Promise<MoscowBaseline | null> {
  if (!cache) cache = load();
  return cache;
}

export type MoscowCompareRow = {
  key: CompareItemKey;
  label: string;
  city: number;
  moscow: number;
  // Разница относительно Москвы: < 0 = дешевле, > 0 = дороже.
  diff: number;
};

export type MoscowComparison = {
  rows: MoscowCompareRow[];
  // Средняя разница по позициям (для заголовка/SEO-текста), < 0 = в среднем дешевле.
  avgDiff: number;
};

// Строит сравнение из цен города (уже загруженных на странице) и базы Москвы.
// Возвращает null, если совпало меньше 3 позиций — иначе сравнение неинформативно.
export function cityVsMoscow(
  prices: Record<PriceCategory, Price[]>,
  baseline: MoscowBaseline | null,
): MoscowComparison | null {
  if (!baseline) return null;
  const all: Price[] = [
    ...(prices.rent ?? []),
    ...(prices.food ?? []),
    ...(prices.transport ?? []),
  ];

  const rows: MoscowCompareRow[] = [];
  for (const spec of COMPARE_SPECS) {
    const city = specPrice(all, spec);
    const moscow = baseline[spec.key];
    if (city > 0 && moscow > 0) {
      rows.push({
        key: spec.key,
        label: spec.label,
        city,
        moscow,
        diff: (city - moscow) / moscow,
      });
    }
  }

  if (rows.length < 3) return null;
  const avgDiff = rows.reduce((a, r) => a + r.diff, 0) / rows.length;
  return { rows, avgDiff };
}

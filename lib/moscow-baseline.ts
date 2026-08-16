import { supabase } from "./supabase";
import type { Price, PriceCategory } from "./types";
import {
  vsMoscowPhrase,
  type SecondPersonItem,
  type SpendKey,
} from "./second-person";

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

// Маппинг повседневных позиций сравнения с Москвой на ключи фраз 2-го лица.
const MOSCOW_TO_SPEND: Record<CompareItemKey, SpendKey> = {
  rent: "rent",
  food: "food",
  lunch: "lunch",
  transit: "transit",
  coffee: "coffee",
};

// «Формулировки от 2-го лица» для страницы города: «По сравнению с Москвой
// в Тбилиси Вы будете платить за аренду на 40% меньше, …». diff в rows — уже
// доля относительно Москвы (< 0 дешевле), переводим в проценты со знаком.
// cityIn — предложный падеж «в Тбилиси» / «на Бали». "" если нет сравнения.
export function moscowSecondPerson(
  comparison: MoscowComparison | null,
  cityInPhrase: string,
): string {
  if (!comparison) return "";
  const items: SecondPersonItem[] = comparison.rows.map((r) => ({
    key: MOSCOW_TO_SPEND[r.key],
    diffPct: r.diff * 100,
  }));
  if (items.length === 0) return "";
  return vsMoscowPhrase({
    cityIn: cityInPhrase,
    items,
    overallDiffPct: comparison.avgDiff * 100,
  });
}

// Числовой индекс стоимости жизни: Москва = 100. Город дешевле → меньше 100,
// дороже → больше 100. Узнаваемый якорь в духе Expatistan (Прага=100) и
// Numbeo (Нью-Йорк=100), но локальный — Москва понятнее рублевой аудитории.
// Считается из avgDiff (средняя относит. разница повседневных трат к Москве):
// напр. avgDiff -0.42 → индекс 58. Для самой Москвы avgDiff=0 → ровно 100.
export function moscowCostIndex(avgDiff: number): number {
  return Math.round((1 + avgDiff) * 100);
}

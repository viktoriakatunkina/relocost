import { supabase } from "./supabase";
import { getPricesByCity } from "./prices";
import type { City, Price, PriceCategory } from "./types";

export type CompareCategory =
  | "rent"
  | "food"
  | "transport"
  | "utilities"
  | "difficulty";

export type CompareLine = {
  key: CompareCategory;
  label: string;
  a: number;
  b: number;
  unit: "rub" | "score";
  // лучше = меньше для rent/food/transport/utilities/difficulty
  winner: "a" | "b" | "tie";
};

export type CompareResult = {
  a: City;
  b: City;
  lines: CompareLine[];
  scoreA: number;
  scoreB: number;
};

export function parsePair(s: string): [string, string] | null {
  const m = s.match(/^([a-z][a-z-]*)-vs-([a-z][a-z-]*)$/);
  if (!m) return null;
  if (m[1] === m[2]) return null;
  return [m[1], m[2]];
}

export function pairSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

function findPrice(
  prices: Record<PriceCategory, Price[]>,
  category: PriceCategory,
  match: (p: Price) => boolean,
): Price | undefined {
  return (prices[category] ?? []).find(match);
}

function representativeRub(
  prices: Record<PriceCategory, Price[]>,
  key: CompareCategory,
): number {
  if (key === "rent") {
    const p = findPrice(prices, "rent", (x) =>
      x.item_name_ru.includes("1-комн. квартира на окраине"),
    );
    return p ? Math.round((p.price_min + p.price_max) / 2) : 0;
  }
  if (key === "food") {
    const p = findPrice(prices, "food", (x) =>
      x.item_name_ru.includes("Продукты"),
    );
    return p ? Math.round((p.price_min + p.price_max) / 2) : 0;
  }
  if (key === "transport") {
    const pass = findPrice(prices, "transport", (x) =>
      x.item_name_ru.includes("проездной"),
    );
    return pass ? Math.round((pass.price_min + pass.price_max) / 2) : 0;
  }
  if (key === "utilities") {
    const ghk = findPrice(prices, "utilities", (x) =>
      x.item_name_ru.startsWith("ЖКХ"),
    );
    const net = findPrice(prices, "utilities", (x) =>
      x.item_name_ru.includes("Домашний"),
    );
    const mob = findPrice(prices, "utilities", (x) =>
      x.item_name_ru.includes("Мобильная"),
    );
    return [ghk, net, mob].reduce(
      (acc, p) =>
        acc + (p ? Math.round((p.price_min + p.price_max) / 2) : 0),
      0,
    );
  }
  return 0;
}

const LABELS: Record<CompareCategory, string> = {
  rent: "Аренда (1-комн. на окраине)",
  food: "Продукты на месяц",
  transport: "Проездной",
  utilities: "ЖКХ + интернет + мобильная",
  difficulty: "Сложность переезда",
};

function winner(a: number, b: number): "a" | "b" | "tie" {
  if (a === 0 && b === 0) return "tie";
  if (a === b) return "tie";
  return a < b ? "a" : "b";
}

export async function loadCompare(
  slugA: string,
  slugB: string,
): Promise<CompareResult | null> {
  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .in("slug", [slugA, slugB]);
  if (!cities || cities.length !== 2) return null;
  const a = (cities as City[]).find((c) => c.slug === slugA);
  const b = (cities as City[]).find((c) => c.slug === slugB);
  if (!a || !b) return null;

  const [pricesA, pricesB] = await Promise.all([
    getPricesByCity(a.id),
    getPricesByCity(b.id),
  ]);

  const lines: CompareLine[] = [];
  for (const k of ["rent", "food", "transport", "utilities"] as const) {
    const av = representativeRub(pricesA, k);
    const bv = representativeRub(pricesB, k);
    lines.push({
      key: k,
      label: LABELS[k],
      a: av,
      b: bv,
      unit: "rub",
      winner: winner(av, bv),
    });
  }
  lines.push({
    key: "difficulty",
    label: LABELS.difficulty,
    a: a.difficulty_score ?? 0,
    b: b.difficulty_score ?? 0,
    unit: "score",
    winner: winner(a.difficulty_score ?? 0, b.difficulty_score ?? 0),
  });

  const scoreA = lines.filter((l) => l.winner === "a").length;
  const scoreB = lines.filter((l) => l.winner === "b").length;

  return { a, b, lines, scoreA, scoreB };
}

export async function allCompareParams(): Promise<{ pair: string }[]> {
  const { data } = await supabase.from("cities").select("slug");
  const slugs = (data ?? []).map((c) => c.slug as string);
  const out: { pair: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = 0; j < slugs.length; j++) {
      if (i === j) continue;
      out.push({ pair: pairSlug(slugs[i], slugs[j]) });
    }
  }
  return out;
}

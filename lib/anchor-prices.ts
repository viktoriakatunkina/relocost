import type { Price, PriceCategory } from "./types";

export interface AnchorItem {
  key: string;
  label: string;
  sublabel: string;
  price: number | null;
}

const ANCHORS: Array<{
  key: string;
  label: string;
  sublabel: string;
  category: PriceCategory;
  namePart: string;
}> = [
  { key: "coffee",  label: "Кофе",    sublabel: "капучино",   category: "food",          namePart: "Капучино" },
  { key: "milk",    label: "Молоко",   sublabel: "1 л",        category: "food",          namePart: "Молоко" },
  { key: "bread",   label: "Хлеб",    sublabel: "0.5 кг",     category: "food",          namePart: "Хлеб" },
  { key: "petrol",  label: "Бензин",   sublabel: "1 л",        category: "transport",     namePart: "Бензин" },
  { key: "cinema",  label: "Кино",    sublabel: "1 билет",    category: "entertainment", namePart: "Билет в кино" },
  { key: "transit", label: "Проезд",  sublabel: "разовый",    category: "transport",     namePart: "Разовый билет" },
];

export function getAnchorPrices(
  prices: Record<PriceCategory, Price[]>,
): AnchorItem[] {
  return ANCHORS.map(({ key, label, sublabel, category, namePart }) => {
    const found = prices[category]?.find((p) =>
      p.item_name_ru.includes(namePart),
    );
    const price = found
      ? Math.round((found.price_min + found.price_max) / 20) * 10
      : null;
    return { key, label, sublabel, price };
  });
}

export function fmtAnchorPrice(v: number): string {
  if (v >= 1000) {
    const k = v / 1000;
    return `~${k % 1 === 0 ? k : k.toFixed(1)} тыс. ₽`;
  }
  return `~${v} ₽`;
}

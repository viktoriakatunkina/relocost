import type { Price, PriceCategory } from "./types";

// Разбор экономичного месячного бюджета по 4 базовым категориям — из тех же
// позиций prices, что считает getCitiesWithBudget (аренда на окраине, продукты,
// проездной, ЖКХ+интернет+мобильная). Используется визуальным блоком
// «Сколько нужно на месяц» на странице города. Чистая функция, без запросов.

export type BudgetSlice = {
  key: "rent" | "food" | "transport" | "utilities";
  label: string;
  icon: string;
  amount: number;
  // Доля в общем бюджете, 0..1 (для ширины бара).
  pct: number;
};

export type BudgetBreakdown = {
  total: number;
  slices: BudgetSlice[];
};

function pickMin(rows: Price[], needle: string): number {
  return rows.find((r) => r.item_name_ru.includes(needle))?.price_min ?? 0;
}

// Возвращает null, если данных недостаточно (нет аренды или продуктов) —
// тогда блок просто не рендерится, без «пустого» бюджета.
export function budgetBreakdown(
  prices: Record<PriceCategory, Price[]>,
): BudgetBreakdown | null {
  const rentRows = prices.rent ?? [];
  const foodRows = prices.food ?? [];
  const transportRows = prices.transport ?? [];
  const utilRows = prices.utilities ?? [];

  const rent = pickMin(rentRows, "окраине");
  const food = pickMin(foodRows, "Продукты");
  const transport = pickMin(transportRows, "проездной");
  const utilities =
    pickMin(utilRows, "ЖКХ") +
    pickMin(utilRows, "Домашний") +
    pickMin(utilRows, "Мобильная");

  if (rent <= 0 || food <= 0) return null;

  const raw: Array<Omit<BudgetSlice, "pct">> = [
    { key: "rent", label: "Аренда (окраина)", icon: "🏠", amount: rent },
    { key: "food", label: "Продукты", icon: "🛒", amount: food },
    { key: "transport", label: "Транспорт", icon: "🚌", amount: transport },
    { key: "utilities", label: "ЖКХ, интернет, связь", icon: "💡", amount: utilities },
  ];

  const total = raw.reduce((a, s) => a + s.amount, 0);
  const slices: BudgetSlice[] = raw.map((s) => ({
    ...s,
    pct: total > 0 ? s.amount / total : 0,
  }));

  return { total, slices };
}

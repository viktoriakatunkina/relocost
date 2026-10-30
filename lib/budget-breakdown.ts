import type { Price, PriceCategory } from "./types";
import {
  householdMultipliers,
  type Household,
} from "./household";

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

// Точное совпадение по имени — тот же якорь, что использует getSimilarCities()
// в lib/prices.ts (rent) и ANCHOR_KEY в scripts/expand-prices.mjs.
function pickExact(rows: Price[], name: string): number {
  return rows.find((r) => r.item_name_ru === name)?.price_min ?? 0;
}

// Fallback по подстроке — детерминирован: сортируем совпадения по id перед
// выбором первого, иначе Postgres/PostgREST не гарантирует порядок строк
// между запросами (корень бага — см. диагностику у rent-вызова ниже).
function pickFallback(rows: Price[], needle: string): number {
  const matches = rows.filter((r) => r.item_name_ru.includes(needle));
  if (matches.length === 0) return 0;
  matches.sort((a, b) => a.id.localeCompare(b.id));
  return matches[0].price_min;
}

// exact-match-first, fallback на подстроку (сортированную) — только если
// точного совпадения нет.
function pickMin(rows: Price[], exactName: string, fallbackNeedle: string): number {
  const exact = pickExact(rows, exactName);
  return exact > 0 ? exact : pickFallback(rows, fallbackNeedle);
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

  // ── Диагностика 2026-10-30 (живые данные Supabase, не предположение) ──────
  // Проверены все 6 pickMin-подстрок по полным (пагинированным — ответ
  // Supabase обрезается на 1000 строк, prices.rent одних 4657) данным:
  //   rent/"окраине"     — РЕАЛЬНО неоднозначно: у 7 из 251 города («Москва»,
  //     «Санкт-Петербург», «Калининград», «Екатеринбург», «Актау», «Бухара»,
  //     «Улан-Батор») по две позиции аренды содержат «окраине» (напр. у
  //     Москвы — «1-комн. квартира на окраине» И «Студия на окраине
  //     (Некрасовка/Южное Бутово, бюджетный формат)»). Тот же баг, что был
  //     в lib/moscow-baseline.ts. Все 7 городов при этом имеют точную
  //     позицию «1-комн. квартира на окраине» — exact-match-first снимает
  //     неоднозначность полностью, без изменения суммы для остальных 244.
  //   food/"Продукты", transport/"проездной", utilities/"ЖКХ"/"Домашний"/
  //     "Мобильная" — НЕ неоднозначны: 0 городов с двойным совпадением по
  //     каждой из пяти подстрок. exact-match здесь не требуется для
  //     корректности, но добавлен тот же детерминированный pickFallback
  //     (сортировка по id) вместо нестабильного .find() — на случай, если
  //     неоднозначность появится при будущем расширении данных.
  const rent = pickMin(rentRows, "1-комн. квартира на окраине", "окраине");
  const food = pickFallback(foodRows, "Продукты");
  const transport = pickFallback(transportRows, "проездной");
  const utilities =
    pickFallback(utilRows, "ЖКХ") +
    pickFallback(utilRows, "Домашний") +
    pickFallback(utilRows, "Мобильная");

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

// Пересчитывает уже посчитанный бюджет «на одного» под состав домохозяйства
// через householdMultipliers — не дублирует выбор позиций из prices, работает
// поверх готового BudgetBreakdown. Доли (pct) пересчитываются под новые суммы,
// чтобы бары корректно перерисовались. Чистая функция, без запросов.
export function applyHousehold(
  base: BudgetBreakdown,
  household: Household,
): BudgetBreakdown {
  const m = householdMultipliers(household);
  const scaled = base.slices.map((s) => ({
    ...s,
    amount: Math.round(s.amount * m[s.key]),
  }));
  const total = scaled.reduce((a, s) => a + s.amount, 0);
  const slices: BudgetSlice[] = scaled.map((s) => ({
    ...s,
    pct: total > 0 ? s.amount / total : 0,
  }));
  return { total, slices };
}

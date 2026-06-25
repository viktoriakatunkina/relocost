import type { CityWithBudget } from "./types";
import { climateTemp } from "./city-signals";

// Рейтинг «для переезда» (вдохновлено Nomad List, но БЕЗ выдумывания данных).
// Считаем композитный балл ТОЛЬКО из реальных сигналов:
//   • Доступность — из monthly_from (дешевле = выше), есть у всех с ценами;
//   • Климат — из climateTemp (комфорт-кривая вокруг ~23°C);
//   • Простота переезда — из difficulty_score (1–5, инверсия);
//   • Инфраструктура, Русскоязычная среда — из difficulty_breakdown (1–5, где
//     БОЛЬШЕ = хуже → инвертируем), есть только у ~84 городов.
// Безопасность / интернет / медицину НЕ включаем — таких данных нет, и
// выдумывать цифры нельзя. Фрейминг строго «оценка для переезда».

export type Breakdown = {
  visa: number;
  language: number;
  prices: number;
  infrastructure: number;
  community: number;
};

export type AxisKey = "cost" | "climate" | "move" | "infra" | "community";

export type Axis = {
  key: AxisKey;
  label: string;
  value: number; // 0–10
  available: boolean;
  weight: number;
};

export type LivingScore = {
  total: number; // 0–10, среднее по ДОСТУПНЫМ осям
  axes: Axis[];
  coverage: "full" | "partial"; // full = есть difficulty_breakdown
};

export const AXIS_LABELS: Record<AxisKey, string> = {
  cost: "Доступность",
  climate: "Климат",
  move: "Простота переезда",
  infra: "Инфраструктура",
  community: "Русскоязычная среда",
};

const clamp10 = (v: number) => Math.max(0, Math.min(10, v));

// Дешевле → выше. Балл 10 при <=25к, 0 при >=180к.
function costScore(budget: number): number {
  const LO = 25_000;
  const HI = 180_000;
  return clamp10(((HI - budget) / (HI - LO)) * 10);
}

// Комфорт климата: пик ~23°C, спад на 1 балл за каждые ~2,2°C отклонения.
function climateScore(temp: number): number {
  return clamp10(10 - Math.abs(temp - 23) / 2.2);
}

// difficulty_score 1..5 (меньше = проще). 1 → 10, 5 → 0.
function moveScore(diff: number): number {
  return clamp10(((5 - diff) / 4) * 10);
}

// breakdown-ось 1..5 (больше = хуже). 1 → 10, 5 → 0.
function invScore(v: number): number {
  return clamp10(((5 - v) / 4) * 10);
}

export function computeLivingScore(
  city: CityWithBudget,
  breakdown?: Breakdown | null,
): LivingScore {
  const axes: Axis[] = [];

  const budget = city.monthly_from;
  axes.push({
    key: "cost",
    label: AXIS_LABELS.cost,
    value: budget > 0 ? costScore(budget) : 0,
    available: budget > 0,
    weight: 0.3,
  });

  const temp = climateTemp(city);
  axes.push({
    key: "climate",
    label: AXIS_LABELS.climate,
    value: temp !== null ? climateScore(temp) : 0,
    available: temp !== null,
    weight: 0.2,
  });

  const diff = city.difficulty_score;
  axes.push({
    key: "move",
    label: AXIS_LABELS.move,
    value: diff != null ? moveScore(diff) : 0,
    available: diff != null,
    weight: 0.25,
  });

  axes.push({
    key: "infra",
    label: AXIS_LABELS.infra,
    value: breakdown ? invScore(breakdown.infrastructure) : 0,
    available: !!breakdown,
    weight: 0.15,
  });

  axes.push({
    key: "community",
    label: AXIS_LABELS.community,
    value: breakdown ? invScore(breakdown.community) : 0,
    available: !!breakdown,
    weight: 0.1,
  });

  // Средневзвешенное только доступных осей (отсутствующая исключается, не зануляется).
  const avail = axes.filter((a) => a.available);
  const wSum = avail.reduce((s, a) => s + a.weight, 0);
  const total =
    wSum > 0 ? avail.reduce((s, a) => s + a.value * a.weight, 0) / wSum : 0;

  return {
    total: Math.round(total * 10) / 10,
    axes,
    coverage: breakdown ? "full" : "partial",
  };
}

// Индекс качества жизни — аналог AreaVibes/Niche.
// Итоговый балл 0–100 складывается из 6 категорий с весами.
// Рассчитывается ТОЛЬКО из данных, которые у нас реально есть:
//   • Доступность жилья — из min_rent цен страницы
//   • Стоимость жизни  — из monthly_from цен страницы
//   • Безопасность     — из city-quality.ts (safety)
//   • Качество жизни   — из city-quality.ts (ecology + medicine / 2)
//   • Транспорт        — из цен страницы (стоимость проездного, руб)
//   • Климат           — из city-quality.ts (climate_comfort)
// Категория без данных исключается из расчёта (не занижает итог).

import type { CityWithBudget } from "./types";
import type { QualityData } from "./city-quality";
import type { Price } from "./types";

export type ScoreGrade = "A" | "B" | "C" | "D" | "F";

export type ScoreCategory = {
  key: string;
  /** i18n-ключ в секции livingScore (без префикса) */
  labelKey: string;
  icon: string;
  score: number;        // 0–100
  grade: ScoreGrade;
  available: boolean;
  weight: number;       // доля в итоговом балле (сумма всех весов = 1.0)
};

export type LivingScoreResult = {
  total: number;         // 0–100
  grade: ScoreGrade;
  labelKey: string;     // i18n-ключ подписи под баллом
  categories: ScoreCategory[];
  availableCount: number;
};

// ─── Вспомогательные функции ───────────────────────────────────────────────

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Линейная шкала: lo → 100, hi → 0. */
function linearScore(value: number, lo: number, hi: number): number {
  if (value <= lo) return 100;
  if (value >= hi) return 0;
  return clamp(((hi - value) / (hi - lo)) * 100);
}

/** quality-ось 1..5 → 0..100 */
function qualityScore(v: 1 | 2 | 3 | 4 | 5): number {
  return ((v - 1) / 4) * 100;
}

function gradeFromScore(score: number): ScoreGrade {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

function gradeLabelKey(g: ScoreGrade): string {
  return `grade${g}`;   // livingScore.gradeA / gradeB / gradeC / gradeD / gradeF
}

// ─── Расчёт транспортного балла из цен страницы ────────────────────────────

export function transportScoreFromPrices(prices: Price[]): number | null {
  const ticket = prices.find(
    (p) => p.category === "transport" && p.item_name_ru.toLowerCase().includes("проездной"),
  );
  if (!ticket) return null;
  // Проездной в рублях: ≤1500 = 100, ≥8000 = 0
  return linearScore(ticket.price_min, 1500, 8000);
}

// ─── Главная функция ───────────────────────────────────────────────────────

export function computeLifeScore(
  city: CityWithBudget,
  quality: QualityData | null,
  allPrices: Price[],
): LivingScoreResult {
  const cats: Omit<ScoreCategory, "grade">[] = [];

  // 1. Доступность жилья (25%) — аренда 1-кк на окраине
  const rentScore = city.min_rent > 0
    ? linearScore(city.min_rent, 20_000, 100_000)
    : null;
  cats.push({
    key: "housing",
    labelKey: "housing",
    icon: "🏠",
    score: rentScore ?? 0,
    available: rentScore !== null,
    weight: 0.25,
  });

  // 2. Стоимость жизни (25%) — суммарный ежемесячный бюджет
  const budgetScore = city.monthly_from > 0
    ? linearScore(city.monthly_from, 40_000, 200_000)
    : null;
  cats.push({
    key: "cost",
    labelKey: "cost",
    icon: "💰",
    score: budgetScore ?? 0,
    available: budgetScore !== null,
    weight: 0.25,
  });

  // 3. Безопасность (15%) — из city-quality
  const safeScore = quality ? qualityScore(quality.safety) : null;
  cats.push({
    key: "safety",
    labelKey: "safety",
    icon: "🛡️",
    score: safeScore ?? 60,
    available: quality !== null,
    weight: 0.15,
  });

  // 4. Качество жизни (15%) — среднее из ecology + medicine (если есть)
  const lifeScore = quality
    ? (qualityScore(quality.ecology) + qualityScore(quality.medicine)) / 2
    : null;
  cats.push({
    key: "life",
    labelKey: "life",
    icon: "🌿",
    score: lifeScore ?? 60,
    available: quality !== null,
    weight: 0.15,
  });

  // 5. Транспорт (10%) — стоимость проездного
  const transScore = transportScoreFromPrices(allPrices);
  cats.push({
    key: "transport",
    labelKey: "transport",
    icon: "🚌",
    score: transScore ?? 0,
    available: transScore !== null,
    weight: 0.1,
  });

  // 6. Климат (10%) — climate_comfort из city-quality
  const climateScoreVal = quality ? qualityScore(quality.climate_comfort) : null;
  cats.push({
    key: "climate",
    labelKey: "climate",
    icon: "🌤️",
    score: climateScoreVal ?? 60,
    available: quality !== null,
    weight: 0.1,
  });

  // Финальный балл: среднее взвешенное ТОЛЬКО из доступных категорий.
  const available = cats.filter((c) => c.available);
  const wSum = available.reduce((s, c) => s + c.weight, 0);
  const rawTotal = wSum > 0
    ? available.reduce((s, c) => s + c.score * c.weight, 0) / wSum
    : 0;
  const total = Math.round(clamp(rawTotal));

  const grade = gradeFromScore(total);

  const categories: ScoreCategory[] = cats.map((c) => ({
    ...c,
    score: Math.round(clamp(c.score)),
    grade: gradeFromScore(c.score),
  }));

  return {
    total,
    grade,
    labelKey: gradeLabelKey(grade),
    categories,
    availableCount: available.length,
  };
}

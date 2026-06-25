// Единый хелпер сложности переезда. Сводит хранимый в БД числовой
// difficulty_score (целое 1–4, см. cities.difficulty_score) ровно к трём
// уровням, единообразно для карточек и страниц городов.
//
// Маппинг диапазонов:
//   score 1        → Легко  (зелёная точка)
//   score 2–3      → Средне (жёлтая точка)
//   score 4 и выше → Сложно (красная точка)
//
// Если score отсутствует (null) — возвращаем null, плашку не показываем.

export type DifficultyLevel = {
  label: "Легко" | "Средне" | "Сложно";
  color: "green" | "yellow" | "red";
  // Tailwind-класс цвета точки из палитры проекта.
  dotClass: string;
};

export function getDifficulty(
  city: { difficulty_score: number | null } | null | undefined
): DifficultyLevel | null {
  const score = city?.difficulty_score;
  if (score == null) return null;

  if (score <= 1) {
    return { label: "Легко", color: "green", dotClass: "bg-emerald-400" };
  }
  if (score <= 3) {
    return { label: "Средне", color: "yellow", dotClass: "bg-amber-400" };
  }
  return { label: "Сложно", color: "red", dotClass: "bg-red-500" };
}

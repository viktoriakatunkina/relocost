// Общие константы/хелперы для Яндекс.Метрики. Единственный источник
// COUNTER_ID — components/YandexMetrika.tsx его переиспользует.
export const METRIKA_COUNTER_ID = 109622218;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

/**
 * Отправляет цель в Яндекс.Метрику: ym(COUNTER_ID, 'reachGoal', goal).
 * Безопасно вызывать где угодно на клиенте — если счётчик ещё не
 * загрузился (или NODE_ENV !== production), window.ym просто undefined.
 */
export function reachGoal(goal: string): void {
  if (typeof window === "undefined") return;
  window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal);
}

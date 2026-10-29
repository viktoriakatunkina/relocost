// Общие константы/хелперы для Яндекс.Метрики. Единственный источник
// COUNTER_ID — components/YandexMetrika.tsx его переиспользует.
export const METRIKA_COUNTER_ID = 109622218;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

/**
 * Отправляет цель в Яндекс.Метрику: ym(COUNTER_ID, 'reachGoal', goal, params).
 * Безопасно вызывать где угодно на клиенте — если счётчик ещё не
 * загрузился (или NODE_ENV !== production), window.ym просто undefined.
 *
 * `params` — необязательные параметры визита (краткий код причины ошибки
 * и т.п.) — НЕ для PII (email, payment_id и т.д. сюда не класть).
 */
export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (params) {
    window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal, params);
  } else {
    window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal);
  }
}

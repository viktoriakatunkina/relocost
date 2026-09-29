// 2026-09-30 (аудит монетизации): "N человек купили за 30 дней" при
// небольших абсолютных числах читается как антиреклама ("почему так мало
// покупают?"), а не как соцдоказательство — особенно на этапе роста продаж.
// Раньше показывали только при count > 0 именно по этой причине ("0 покупок"
// не показывали никогда). Заменили на нейтральные trust-сигналы, которые не
// зависят от объёма продаж: не врут при любом количестве оплат. Название и
// сигнатура компонента (count) оставлены как есть — 6+ мест вызова по
// сайту (StickyBar, LockedSection, MonthlyBudget) не трогаем, значение
// count больше не используется.
export function PurchaseCount({ count }: { count: number }) {
  void count;
  return (
    <p className="mt-3 text-xs text-brandy/60 flex items-center justify-center gap-1.5 flex-wrap">
      <span className="inline-flex items-center gap-1">
        <span aria-hidden>✓</span>Разовая оплата
      </span>
      <span aria-hidden className="text-brandy/30">·</span>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden>✓</span>Доступ навсегда
      </span>
      <span aria-hidden className="text-brandy/30">·</span>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden>✓</span>Безопасная оплата через ЮKassa
      </span>
    </p>
  );
}

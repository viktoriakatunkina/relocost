function humanWord(n: number): string {
  const n100 = n % 100;
  const n10 = n % 10;
  if (n100 >= 11 && n100 <= 14) return "человек";
  if (n10 >= 2 && n10 <= 4) return "человека";
  return "человек";
}

// Честное соцдоказательство у paywall.
//
// 2026-09-21 (предпринимательский аудит): count — это сайт-вайд число оплат
// за 30 дней по ВСЕМ городам сразу (см. lib/purchase-counts.ts,
// getGlobalPurchaseCount) — одна и та же цифра рендерится на каждом городе.
// Раньше подпись звучала как "уже купили ЭТОТ отчет", что читалось как
// per-city соцдоказательство, хотя таким не было — вводило в заблуждение.
// Текст ниже сайт-вайд по смыслу, без намека на конкретный город/отчет.
// Рендерим только при count > 0: "0 покупок" не показываем никогда, это
// выглядело бы как антиреклама.
export function PurchaseCount({ count }: { count: number }) {
  if (!count || count < 1) return null;
  return (
    <p className="mt-3 text-xs text-brandy/60 flex items-center justify-center gap-1.5">
      <span aria-hidden>✓</span>
      {count} {humanWord(count)} {count === 1 ? "купил" : "купили"} отчеты на
      Relocost за последние 30 дней
    </p>
  );
}

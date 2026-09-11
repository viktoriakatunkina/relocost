function humanWord(n: number): string {
  const n100 = n % 100;
  const n10 = n % 10;
  if (n100 >= 11 && n100 <= 14) return "человек";
  if (n10 >= 2 && n10 <= 4) return "человека";
  return "человек";
}

// Честное соцдоказательство у paywall — реальное число оплативших этот
// пакет по конкретному городу. Рендерим только при count > 0: "0 покупок"
// не показываем никогда, это выглядело бы как антиреклама.
export function PurchaseCount({ count }: { count: number }) {
  if (!count || count < 1) return null;
  return (
    <p className="mt-3 text-xs text-brandy/60 flex items-center justify-center gap-1.5">
      <span aria-hidden>✓</span>
      {count} {humanWord(count)} уже {count === 1 ? "купил" : "купили"} этот
      отчёт
    </p>
  );
}

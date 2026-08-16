import type { CompareLine } from "@/lib/compare";
import type { City } from "@/lib/types";
import { formatRub } from "@/lib/cities";

export function CompareTable({
  a,
  b,
  lines,
}: {
  a: City;
  b: City;
  lines: CompareLine[];
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Победитель по категориям
      </h2>
      <div className="rounded-2xl bg-surface border hairline overflow-hidden">
        <div className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(5rem,auto)] md:grid-cols-[1.5fr_1fr_1fr] gap-2 md:gap-4 px-5 py-3 border-b hairline text-brandy/60 text-xs uppercase tracking-wider">
          <span>Категория</span>
          <span className="text-right truncate">{a.name_ru}</span>
          <span className="text-right truncate">{b.name_ru}</span>
        </div>
        {lines.map((l) => (
          <Row key={l.key} line={l} />
        ))}
      </div>
    </section>
  );
}

function Row({ line }: { line: CompareLine }) {
  const aWin = line.winner === "a";
  const bWin = line.winner === "b";
  const fmt = (n: number) =>
    line.unit === "rub" ? formatRub(n) : `${n}/5`;

  // Разница «бок о бок»: насколько проигравшая (большая) сторона дороже/выше —
  // в процентах, а при двукратном и большем разрыве — кратностью (×N), как у
  // Numbeo/Expatistan. Считается из уже готовых чисел строки.
  const diffBadge = (() => {
    if (line.winner === "tie" || line.a <= 0 || line.b <= 0) return null;
    const ratio = Math.max(line.a, line.b) / Math.min(line.a, line.b);
    return ratio >= 2
      ? `×${ratio.toFixed(1)}`
      : `+${Math.round((ratio - 1) * 100)}%`;
  })();

  const winBadge = (
    <span className="hidden md:inline ml-2 text-xs uppercase text-copper/80">
      лучше
    </span>
  );
  const loseBadge = diffBadge && (
    <span className="ml-2 text-xs tabular-nums text-brandy/50">
      {diffBadge}
    </span>
  );

  return (
    <div className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(5rem,auto)] md:grid-cols-[1.5fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4 border-b border-dingley/20 last:border-0 items-center">
      <span className="text-brandy/90 text-sm md:text-base">{line.label}</span>
      <span
        className={`text-right tabular-nums ${
          aWin ? "text-copper font-semibold" : "text-cream"
        }`}
      >
        {fmt(line.a)}
        {aWin ? winBadge : bWin ? loseBadge : null}
      </span>
      <span
        className={`text-right tabular-nums ${
          bWin ? "text-copper font-semibold" : "text-cream"
        }`}
      >
        {fmt(line.b)}
        {bWin ? winBadge : aWin ? loseBadge : null}
      </span>
    </div>
  );
}

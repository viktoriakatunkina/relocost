import type { CityWithBudget } from "@/lib/types";
import { computeLivingScore, type Breakdown } from "@/lib/rating";
import { Link } from "@/i18n/navigation";

// Блок «Оценка для переезда» на странице города: общий балл + бары по осям.
// Честный фрейминг — это оценка ДЛЯ ПЕРЕЕЗДА по доступным данным (стоимость,
// климат, простота переезда, инфраструктура, русскоязычная среда), а НЕ
// «качество жизни вообще». Оси без данных показываем серым «нет данных».

// Буквенный грейд A+…F с цветовым кодированием (зеленый = хорошо → красный =
// плохо), как у AreaVibes/Niche. На вход — балл оси 0–10. Полные классы Tailwind
// строками (не собираем из кусков) — чтобы JIT включил их в сборку.
function gradeFor(v: number): {
  letter: string;
  bar: string;
  text: string;
  bg: string;
  border: string;
} {
  if (v >= 9)
    return { letter: "A+", bar: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/15", border: "border-emerald-400/30" };
  if (v >= 8)
    return { letter: "A", bar: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/15", border: "border-emerald-400/30" };
  if (v >= 7)
    return { letter: "B", bar: "bg-lime-400", text: "text-lime-300", bg: "bg-lime-400/15", border: "border-lime-400/30" };
  if (v >= 6)
    return { letter: "C", bar: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/15", border: "border-amber-400/30" };
  if (v >= 5)
    return { letter: "D", bar: "bg-orange-400", text: "text-orange-300", bg: "bg-orange-400/15", border: "border-orange-400/30" };
  if (v >= 3.5)
    return { letter: "E", bar: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" };
  return { letter: "F", bar: "bg-red-500", text: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" };
}

export function LivingScore({
  city,
  cityName,
  breakdown,
}: {
  city: CityWithBudget;
  cityName: string;
  breakdown?: Breakdown | null;
}) {
  const { total, axes, coverage } = computeLivingScore(city, breakdown);
  const overall = gradeFor(total);

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Оценка для переезда</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Насколько {cityName} подходит для переезда
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        Сводная оценка по параметрам, которые мы можем измерить по нашим данным.
        Это ориентир для сравнения городов, а не абсолютный «уровень жизни».
      </p>

      <div className="rounded-3xl bg-surface border hairline p-6 md:p-9">
        <div className="flex items-center gap-5 mb-8 pb-7 border-b hairline">
          <div
            className={`shrink-0 w-20 h-20 rounded-2xl ${overall.bg} border ${overall.border} flex flex-col items-center justify-center`}
          >
            <span
              className={`font-serif text-3xl ${overall.text} tabular-nums leading-none`}
            >
              {Math.round(total * 10)}
            </span>
            <span className="text-[10px] text-brandy/55 mt-1">
              из 100 · {overall.letter}
            </span>
          </div>
          <div>
            <div className="text-cream font-medium">Общий балл для переезда</div>
            <div className="text-brandy/65 text-sm mt-1">
              {coverage === "full"
                ? "По 5 параметрам"
                : "По 3 параметрам — для этого города заполнены не все данные"}
            </div>
          </div>
        </div>

        <ul className="space-y-5">
          {axes.map((a) => {
            const g = a.available ? gradeFor(a.value) : null;
            return (
              <li key={a.key}>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-cream/90">{a.label}</span>
                  {g ? (
                    <span
                      className={`text-sm font-semibold tabular-nums ${g.text}`}
                    >
                      {g.letter} · {Math.round(a.value * 10)}
                    </span>
                  ) : (
                    <span className="text-xs text-brandy/40">нет данных</span>
                  )}
                </div>
                <div className="h-2.5 rounded-full bg-cream/8 overflow-hidden">
                  {g && (
                    <div
                      className={`h-full ${g.bar} rounded-full`}
                      style={{ width: `${a.value * 10}%` }}
                      aria-hidden
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 pt-6 border-t hairline text-xs text-brandy/55 text-pretty">
          Оценка считается по стоимости жизни, климату, простоте переезда и (где
          есть данные) инфраструктуре и русскоязычной среде.{" "}
          <Link href="/rating" className="text-copper hover:underline">
            Рейтинг всех городов →
          </Link>
        </p>
      </div>
    </section>
  );
}

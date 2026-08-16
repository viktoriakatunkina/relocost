import { typo } from "@/lib/typography";

// Блок «Формулировки от 2-го лица» — best-practice MyLifeElsewhere: человеческая
// выжимка сравнения от лица читателя на «Вы» («Вы будете платить за продукты на
// 15% меньше …»). Эмоциональнее обезличенного индекса.
//
// Текст собирается на сервере утилитой lib/second-person.ts из уже посчитанных
// дельт — здесь только отрисовка. Серверный компонент: нет state, попадает
// в SSR-HTML (важно для SEO и для пользователей без JS). eyebrow задается
// извне, чтобы переиспользовать блок и на /compare, и на странице города.
export function SecondPersonSummary({
  eyebrow,
  text,
}: {
  eyebrow: string;
  text: string;
}) {
  if (!text) return null;
  return (
    <div className="rounded-3xl bg-surface-elevated border border-copper/20 p-6 md:p-8">
      <div className="mb-4">
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <p className="text-cream text-lg md:text-xl leading-relaxed text-pretty">
        {typo(text)}
      </p>
    </div>
  );
}

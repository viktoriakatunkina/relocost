// FAQ страницы /city/[slug]/budget — вопросы собираются из уже посчитанных
// на странице чисел (budgetBreakdown + множители состава семьи + сравнение с
// Москвой). Никаких «средних по больнице»: каждая цифра в ответе есть на самой
// странице выше. Разметка FAQPage отдаётся один раз через <FaqSchema>.
//
// Зачем: у 175 страниц бюджета была только BreadcrumbList-разметка, при том
// что они целятся ровно в вопросные запросы («сколько денег нужно для переезда
// в …», «сколько нужно на жизнь семье в …»).

import type { Price, PriceCategory } from "@/lib/types";
import type { FaqItem } from "@/components/FaqSchema";
import { FaqSchema } from "@/components/FaqSchema";
import { budgetBreakdown, applyHousehold } from "@/lib/budget-breakdown";
import { COUPLE, FAMILY } from "@/lib/household";
import { typo } from "@/lib/typography";

function num(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

function fmt(n: number) {
  return `${num(n)} ₽`;
}

// Диапазон с одним знаком валюты: «28 000–56 000 ₽», а не «28 000 ₽–56 000 ₽».
function range(a: number, b: number) {
  return `${num(a)}–${num(b)} ₽`;
}

function findPrice(
  prices: Record<PriceCategory, Price[]>,
  category: PriceCategory,
  needle: string,
): Price | null {
  return (prices[category] ?? []).find((p) => p.item_name_ru.includes(needle)) ?? null;
}

export function buildBudgetFaqItems({
  cityIn,
  prices,
  avgDiff,
}: {
  // Название города в предложном падеже — «в Тбилиси», «на Бали».
  cityIn: string;
  prices: Record<PriceCategory, Price[]>;
  // Средняя разница повседневных трат с Москвой (−0.42 = дешевле на 42%).
  avgDiff: number | null;
}): FaqItem[] {
  const base = budgetBreakdown(prices);
  if (!base) return [];

  const solo = base.total;
  const couple = applyHousehold(base, COUPLE).total;
  const family = applyHousehold(base, FAMILY).total;
  const slice = (key: string) => base.slices.find((s) => s.key === key)?.amount ?? 0;
  const rent = slice("rent");

  const items: FaqItem[] = [];

  items.push({
    q: `Сколько денег нужно для переезда ${cityIn}?`,
    a:
      `Экономный бюджет одного человека ${cityIn} — от ${fmt(solo)} в месяц: ` +
      `аренда однокомнатной на окраине ${fmt(rent)}, продукты ${fmt(slice("food"))}, ` +
      `транспорт ${fmt(slice("transport"))}, коммунальные с интернетом и связью ` +
      `${fmt(slice("utilities"))}. На первый месяц добавьте депозит за квартиру — ` +
      `обычно это одна-две месячные аренды, то есть еще ${range(rent, rent * 2)}.`,
  });

  const round = Math.ceil(solo / 10000) * 10000;
  items.push({
    q: `Хватит ли ${fmt(round)} в месяц на жизнь ${cityIn}?`,
    a:
      `На базовые расходы — да: минимум ${cityIn} выходит ${fmt(solo)} в месяц. ` +
      `Свободными останутся ${fmt(round - solo)} — этого хватит на кафе, связь и ` +
      `небольшие поездки, но не на аренду в центре и не на регулярные перелеты. ` +
      `Комфортный уровень с запасом 20% — примерно ${fmt(solo * 1.2)} в месяц.`,
  });

  items.push({
    q: `Сколько нужно на жизнь ${cityIn} паре и семье с ребенком?`,
    a:
      `Пара без детей тратит от ${fmt(couple)} в месяц: жилье то же, ` +
      `а продукты и транспорт удваиваются. Семье с одним ребенком нужно ` +
      `от ${fmt(family)} — здесь уже заложена квартира побольше и расходы на ` +
      `ребенка. Расчет идет от базового бюджета на одного (${fmt(solo)}) ` +
      `с множителями по категориям — их можно поменять в калькуляторе выше.`,
  });

  const rentCenter = findPrice(prices, "rent", "центре");
  const rentRow = findPrice(prices, "rent", "окраине");
  if (rentRow) {
    const centerText = rentCenter
      ? ` В центре — ${range(rentCenter.price_min, rentCenter.price_max)}.`
      : "";
    items.push({
      // Формулировка намеренно отличается от вопроса «Сколько стоит аренда
      // квартиры в {city}?» на самой странице города — чтобы две наши страницы
      // не конкурировали за один и тот же запрос.
      q: `Сколько стоит снять квартиру ${cityIn} на месяц?`,
      a:
        `Однокомнатная квартира на окраине ${cityIn} — ` +
        `${range(rentRow.price_min, rentRow.price_max)} в месяц.${centerText} ` +
        `Разброс внутри диапазона зависит от района, сезона и состояния жилья; ` +
        `цены длительной аренды у местных агентов обычно ниже, чем на сайтах ` +
        `посуточного бронирования.`,
    });
  }

  if (avgDiff !== null) {
    const pct = Math.round(Math.abs(avgDiff) * 100);
    const cheaper = avgDiff < 0;
    items.push({
      q: `${cityIn.replace(/^в /, "В ").replace(/^на /, "На ")} дешевле, чем в Москве?`,
      a: cheaper
        ? `Да: повседневные расходы — аренда, продукты, обед, транспорт и кофе — ` +
          `${cityIn} в среднем на ${pct}% ниже московских. Базовый месячный бюджет ` +
          `одного человека — ${fmt(solo)} против московского уровня. Разбивку по ` +
          `каждой позиции смотрите в блоке сравнения с Москвой выше.`
        : `Нет: повседневные расходы ${cityIn} в среднем на ${pct}% выше московских. ` +
          `Базовый месячный бюджет одного человека — ${fmt(solo)}. Разбивку по ` +
          `каждой позиции смотрите в блоке сравнения с Москвой выше.`,
    });
  }

  return items;
}

export function BudgetFAQ({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;

  return (
    <section id="faq" className="scroll-mt-[120px] max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <FaqSchema items={items} />
      <span className="eyebrow">Частые вопросы</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10 text-balance">
        Сколько денег нужно на самом деле
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-3xl bg-surface border hairline overflow-hidden open:border-copper/30 open:bg-surface-elevated transition"
          >
            <summary className="cursor-pointer flex items-start justify-between gap-4 px-6 py-5 list-none min-h-[60px]">
              <span className="text-cream font-medium text-base md:text-lg text-pretty">
                {typo(item.q)}
              </span>
              <span
                className="text-copper text-2xl leading-none transition-transform group-open:rotate-45 shrink-0"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="px-6 pb-6 text-brandy/90 leading-relaxed text-pretty">
              {typo(item.a)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

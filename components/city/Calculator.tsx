"use client";

import { useMemo, useState } from "react";
import type { Price, PriceCategory } from "@/lib/types";
import { formatRub } from "@/lib/cities";
import { PACKAGES, isUnlocked, useUnlocked } from "@/lib/unlocked";
import { PaymentModal } from "@/components/freemium/PaymentModal";

type Lifestyle = "econom" | "standard" | "comfort";

const LIFESTYLE_OPTIONS: Array<{
  id: Lifestyle;
  label: string;
  hint: string;
}> = [
  {
    id: "econom",
    label: "Эконом",
    hint: "Окраина, готовим дома, общественный транспорт.",
  },
  {
    id: "standard",
    label: "Стандарт",
    hint: "Окраина или ближе к центру, иногда кафе и такси.",
  },
  {
    id: "comfort",
    label: "Комфорт",
    hint: "Квартира в центре, кафе пару раз в неделю, такси регулярно.",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  rent: "Аренда",
  food: "Еда и продукты",
  transport: "Транспорт",
  utilities: "ЖКХ и связь",
};

function pick<T>(arr: T[], match: (x: T) => boolean): T | undefined {
  return arr.find(match);
}

function lineMinMax(
  prices: Record<PriceCategory, Price[]>,
  lifestyle: Lifestyle,
) {
  const rent = prices.rent ?? [];
  const food = prices.food ?? [];
  const transport = prices.transport ?? [];
  const utilities = prices.utilities ?? [];

  const okraina = pick(rent, (p) => p.item_name_ru.includes("окраине"));
  const centerOne = pick(rent, (p) =>
    p.item_name_ru.includes("1-комн. квартира в центре"),
  );
  const room = pick(rent, (p) => p.item_name_ru === "Комната");

  const groceries = pick(food, (p) => p.item_name_ru.includes("Продукты"));
  const lunch = pick(food, (p) => p.item_name_ru.includes("Обед в кафе"));
  const dinner = pick(food, (p) =>
    p.item_name_ru.includes("Ужин на двоих"),
  );
  const coffee = pick(food, (p) => p.item_name_ru === "Капучино");

  const monthlyPass = pick(transport, (p) =>
    p.item_name_ru.includes("проездной"),
  );
  const taxi = pick(transport, (p) => p.item_name_ru.includes("Такси"));

  const ghk = pick(utilities, (p) => p.item_name_ru.startsWith("ЖКХ"));
  const internet = pick(utilities, (p) => p.item_name_ru.includes("Домашний"));
  const mobile = pick(utilities, (p) => p.item_name_ru.includes("Мобильная"));

  const sum = (arr: Array<Price | undefined>, take: "min" | "max") =>
    arr.reduce(
      (acc, p) => acc + (p ? (take === "min" ? p.price_min : p.price_max) : 0),
      0,
    );

  let lines: { category: string; label: string; min: number; max: number }[] = [];

  if (lifestyle === "econom") {
    const rentMin = room?.price_min ?? okraina?.price_min ?? 0;
    const rentMax = okraina?.price_min ?? rentMin;
    lines = [
      { category: "rent", label: CATEGORY_LABELS.rent, min: rentMin, max: rentMax },
      {
        category: "food",
        label: CATEGORY_LABELS.food,
        min: groceries?.price_min ?? 0,
        max: groceries?.price_max ?? 0,
      },
      {
        category: "transport",
        label: CATEGORY_LABELS.transport,
        min: monthlyPass?.price_min ?? 0,
        max: monthlyPass?.price_max ?? 0,
      },
      {
        category: "utilities",
        label: CATEGORY_LABELS.utilities,
        min: sum([ghk, internet, mobile], "min"),
        max: sum([ghk, internet, mobile], "max"),
      },
    ];
  } else if (lifestyle === "standard") {
    lines = [
      {
        category: "rent",
        label: CATEGORY_LABELS.rent,
        min: okraina?.price_min ?? 0,
        max: okraina?.price_max ?? 0,
      },
      {
        category: "food",
        label: CATEGORY_LABELS.food + " + 4 обеда в кафе",
        min: (groceries?.price_min ?? 0) + 4 * (lunch?.price_min ?? 0),
        max: (groceries?.price_max ?? 0) + 4 * (lunch?.price_max ?? 0),
      },
      {
        category: "transport",
        label: CATEGORY_LABELS.transport + " + 6 поездок такси",
        min: (monthlyPass?.price_min ?? 0) + 6 * (taxi?.price_min ?? 0),
        max: (monthlyPass?.price_max ?? 0) + 6 * (taxi?.price_max ?? 0),
      },
      {
        category: "utilities",
        label: CATEGORY_LABELS.utilities,
        min: sum([ghk, internet, mobile], "min"),
        max: sum([ghk, internet, mobile], "max"),
      },
    ];
  } else {
    lines = [
      {
        category: "rent",
        label: CATEGORY_LABELS.rent + " в центре",
        min: centerOne?.price_min ?? okraina?.price_max ?? 0,
        max: centerOne?.price_max ?? 0,
      },
      {
        category: "food",
        label: CATEGORY_LABELS.food + " + 8 обедов и 4 ужина",
        min:
          (groceries?.price_min ?? 0) +
          8 * (lunch?.price_min ?? 0) +
          4 * (dinner?.price_min ?? 0) +
          8 * (coffee?.price_min ?? 0),
        max:
          (groceries?.price_max ?? 0) +
          8 * (lunch?.price_max ?? 0) +
          4 * (dinner?.price_max ?? 0) +
          8 * (coffee?.price_max ?? 0),
      },
      {
        category: "transport",
        label: CATEGORY_LABELS.transport + " + 20 такси",
        min: (monthlyPass?.price_min ?? 0) + 20 * (taxi?.price_min ?? 0),
        max: (monthlyPass?.price_max ?? 0) + 20 * (taxi?.price_max ?? 0),
      },
      {
        category: "utilities",
        label: CATEGORY_LABELS.utilities,
        min: sum([ghk, internet, mobile], "max"),
        max: Math.round(sum([ghk, internet, mobile], "max") * 1.2),
      },
    ];
  }

  const totalMin = lines.reduce((a, l) => a + l.min, 0);
  const totalMax = lines.reduce((a, l) => a + l.max, 0);
  return { lines, totalMin, totalMax };
}

export function Calculator({
  slug,
  prices,
  cityName,
}: {
  slug: string;
  prices: Record<PriceCategory, Price[]>;
  cityName: string;
}) {
  const [lifestyle, setLifestyle] = useState<Lifestyle>("standard");
  const result = useMemo(
    () => lineMinMax(prices, lifestyle),
    [prices, lifestyle],
  );
  const unlocked = useUnlocked(slug);
  const opened = isUnlocked(unlocked, "budget");
  const [payOpen, setPayOpen] = useState(false);
  const budget = PACKAGES.budget;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
        Калькулятор бюджета
      </h2>
      <p className="text-brandy/70 mb-8">
        Сколько будет стоить месяц жизни в {cityName} — выбери образ жизни.
      </p>

      <div className="grid md:grid-cols-3 gap-3 mb-8">
        {LIFESTYLE_OPTIONS.map((opt) => {
          const active = lifestyle === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLifestyle(opt.id)}
              className={`text-left p-5 rounded-2xl border transition ${
                active
                  ? "bg-pale-copper/20 border-pale-copper"
                  : "bg-kombu-green/40 border-dingley/30 hover:border-dingley/70"
              }`}
            >
              <div
                className={`font-serif text-2xl mb-1 ${
                  active ? "text-pale-copper" : "text-cream"
                }`}
              >
                {opt.label}
              </div>
              <p className="text-brandy/70 text-sm leading-snug">{opt.hint}</p>
            </button>
          );
        })}
      </div>

      <div className="relative rounded-2xl bg-kombu-green/40 border border-dingley/30 p-6 md:p-8 overflow-hidden">
        <div
          style={!opened ? { filter: "blur(6px)" } : undefined}
          className={!opened ? "pointer-events-none select-none" : ""}
          aria-hidden={!opened}
        >
          <ul className="space-y-3 mb-6">
            {result.lines.map((l) => (
              <li
                key={l.category}
                className="flex items-center justify-between gap-3 border-b border-dingley/20 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-brandy/90">{l.label}</span>
                <span className="text-cream tabular-nums whitespace-nowrap">
                  {formatRub(l.min)} – {formatRub(l.max)}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-dingley/40 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-brandy/70 text-sm uppercase tracking-wider mb-1">
                Итого за месяц
              </p>
              <p className="font-serif text-4xl md:text-5xl text-cream tabular-nums">
                {formatRub(result.totalMin)} – {formatRub(result.totalMax)}
              </p>
            </div>
            <p className="text-brandy/60 text-sm md:text-right md:max-w-xs">
              Точный бюджет с медициной, развлечениями и сравнением — в пакете «Точный бюджет».
            </p>
          </div>
        </div>

        {!opened && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-pine-tree/85 backdrop-blur-md border border-dingley/40 rounded-2xl p-6 md:p-7 text-center shadow-2xl">
              <div className="text-3xl mb-2" aria-hidden>
                {budget.emoji}
              </div>
              <h3 className="font-serif text-xl text-cream mb-2">
                Точные цифры — в пакете {budget.label}
              </h3>
              <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
                Разблюренный итог, разбивка по 7 категориям и сравнение с другим
                городом.
              </p>
              <button
                type="button"
                onClick={() => setPayOpen(true)}
                className="inline-block px-6 py-3 rounded-pill bg-pale-copper text-pine-tree font-semibold transition hover:bg-brandy"
              >
                Открыть за {budget.price} ₽
              </button>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        slug={slug}
        pkg={payOpen ? "budget" : null}
        onClose={() => setPayOpen(false)}
      />
    </section>
  );
}

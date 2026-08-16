"use client";

import { useState, useTransition, useRef } from "react";
import { submitCrowdPrice } from "@/app/actions/crowd-price";

const CATEGORIES = [
  { key: "food", emoji: "🍜", label: "Еда" },
  { key: "rent", emoji: "🏠", label: "Жилье" },
  { key: "transport", emoji: "🚌", label: "Транспорт" },
  { key: "leisure", emoji: "🎭", label: "Досуг" },
  { key: "health", emoji: "💊", label: "Здоровье" },
  { key: "other", emoji: "📌", label: "Другое" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const PLACEHOLDERS: Record<CategoryKey, string> = {
  food: "Бизнес-ланч, кофе, продукты...",
  rent: "Аренда 1-комн., коворкинг...",
  transport: "Проездной, такси 5 км...",
  leisure: "Кино, фитнес/мес...",
  health: "Прием врача, лекарства...",
  other: "Что угодно...",
};

export function CrowdPriceForm({ citySlug }: { citySlug: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CategoryKey>("food");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("city_slug", citySlug);
    fd.set("category", category);

    startTransition(async () => {
      const result = await submitCrowdPrice(fd);
      if (result.ok) {
        setStatus("ok");
        formRef.current?.reset();
        setTimeout(() => {
          setStatus("idle");
          setOpen(false);
        }, 3000);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Ошибка");
      }
    });
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border hairline text-cream/80 hover:text-cream hover:border-copper/40 transition text-sm font-medium"
        >
          <span className="text-copper">+</span>
          Поделиться ценой
        </button>
      ) : (
        <div className="rounded-3xl bg-surface border hairline p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-2xl text-cream">Добавить цену</h3>
            <button
              onClick={() => { setOpen(false); setStatus("idle"); }}
              className="text-brandy/50 hover:text-brandy transition p-1"
              aria-label="Закрыть"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {status === "ok" ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-dingley/20 border border-dingley/30 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-dingley">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-cream font-medium">Спасибо! Цена добавлена.</p>
              <p className="text-brandy/60 text-sm">Вы помогаете другим планировать переезд.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <p className="text-brandy/60 text-xs uppercase tracking-[0.12em] mb-3">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={[
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-pill border text-sm transition",
                        category === cat.key
                          ? "border-copper/60 bg-copper/10 text-cream"
                          : "border-cream/10 text-brandy/70 hover:border-cream/20 hover:text-cream",
                      ].join(" ")}
                    >
                      <span aria-hidden>{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="cp-item" className="block text-brandy/60 text-xs uppercase tracking-[0.12em] mb-2">
                  Что именно
                </label>
                <input
                  id="cp-item"
                  name="item_name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder={PLACEHOLDERS[category]}
                  className="w-full bg-pine-tree border border-cream/12 rounded-2xl px-4 py-3 text-cream placeholder:text-brandy/35 text-sm focus:outline-none focus:border-copper/40 transition"
                />
              </div>

              <div>
                <label htmlFor="cp-amount" className="block text-brandy/60 text-xs uppercase tracking-[0.12em] mb-2">
                  Сумма в рублях
                </label>
                <div className="relative">
                  <input
                    id="cp-amount"
                    name="amount_rub"
                    type="number"
                    required
                    min={1}
                    max={999999}
                    placeholder="0"
                    className="w-full bg-pine-tree border border-cream/12 rounded-2xl px-4 py-3 pr-10 text-cream placeholder:text-brandy/35 text-sm focus:outline-none focus:border-copper/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brandy/45 text-sm pointer-events-none">
                    ₽
                  </span>
                </div>
              </div>

              {status === "error" && (
                <p className="text-pale-copper text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Отправляем..." : "Отправить цену"}
              </button>

              <p className="text-brandy/40 text-xs text-center">
                Данные проходят модерацию и публикуются анонимно
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

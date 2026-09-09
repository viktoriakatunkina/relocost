"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// Метаданные языков для переключателя. Самоназвание + флаг + короткий код.
const LANG_META: Record<Locale, { native: string; short: string; flag: string }> = {
  ru: { native: "Русский", short: "RU", flag: "🇷🇺" },
  en: { native: "English", short: "EN", flag: "🇬🇧" },
  uz: { native: "Oʻzbekcha", short: "UZ", flag: "🇺🇿" },
};

// Срезает префикс локали, если он остался в пути.
//
// Нужно для непереведённых разделов (блог): middleware отдаёт по адресу
// /en/blog/x русскую страницу через rewrite, поэтому next-intl считает
// текущую локаль ru и usePathname() НЕ срезает «/en» (у ru префикса нет) —
// возвращает «/en/blog/x» целиком. Без этой зачистки переключатель языка
// собрал бы «/en/en/blog/x» и увёл бы пользователя в 404.
//
// Для обычных страниц функция ничего не меняет: usePathname уже отдаёт путь
// без префикса, а собственных разделов с двухбуквенным именем (/en, /uz, /ru)
// на сайте нет.
function stripLocalePrefix(path: string): string {
  const m = path.match(/^\/([^/]+)(\/.*)?$/);
  if (m && (routing.locales as readonly string[]).includes(m[1])) {
    return m[2] || "/";
  }
  return path;
}

/**
 * Переключатель языка в шапке. Реально меняет локаль: меняет URL на /, /en, /uz
 * (для дефолтной ru — без префикса), сохраняя текущий путь. Перевод интерфейса
 * подхватывается next-intl автоматически; контент пока ru-фолбэк (Фаза 1).
 */
export function LanguageSwitcher() {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("lang");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = LANG_META[current] ?? LANG_META.ru;

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function pick(code: Locale) {
    setOpen(false);
    if (code === current) return;
    // pathname здесь — без префикса локали (usePathname из i18n/navigation),
    // поэтому router.replace с опцией locale корректно переключит язык,
    // сохранив текущий маршрут.
    startTransition(() => {
      router.replace(stripLocalePrefix(pathname), { locale: code });
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-pill text-brandy/85 hover:text-cream hover:bg-cream/5 transition text-sm disabled:opacity-60"
      >
        <span className="text-base leading-none">{meta.flag}</span>
        <span className="font-medium tracking-wide">{meta.short}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 rounded-2xl border hairline bg-[#1A2105] shadow-xl overflow-hidden z-50"
        >
          {routing.locales.map((code) => {
            const m = LANG_META[code];
            const active = code === current;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(code)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition ${
                  active
                    ? "bg-copper/15 text-cream"
                    : "text-brandy/85 hover:text-cream hover:bg-cream/5"
                }`}
              >
                <span className="text-base leading-none">{m.flag}</span>
                <span className="flex-1">{m.native}</span>
                {active && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

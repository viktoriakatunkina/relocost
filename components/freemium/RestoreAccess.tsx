"use client";

import { useEffect, useState } from "react";
import {
  addManyUnlocked,
  savePurchaseEmail,
  type PackageType,
} from "@/lib/unlocked";

/**
 * «Уже оплатили? Открыть доступ» — восстановление доступа по email.
 * Нужно, когда покупка есть в БД (purchases.status='paid'), но на устройстве
 * нет локального следа разблокировки: оплата с другого устройства, очистка
 * браузера, потеря sessionStorage при возврате через СБП и т.п.
 */
export function RestoreAccess({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "empty" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/payment/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email: email.trim() }),
        cache: "no-store",
      });
      const data = await res.json();
      const pkgs: PackageType[] = Array.isArray(data?.packages) ? data.packages : [];
      if (pkgs.length) {
        addManyUnlocked(slug, pkgs);
        savePurchaseEmail(email.trim());
        setState("ok");
        setTimeout(() => setOpen(false), 1400);
      } else {
        setState("empty");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setState("idle");
          setOpen(true);
        }}
        className="shrink-0 text-brandy/60 hover:text-cream text-xs whitespace-nowrap underline decoration-dotted underline-offset-4 transition"
      >
        Уже оплатили?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-pine-tree/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-surface-elevated border border-cream/15 p-6 md:p-8 shadow-2xl"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-serif text-2xl text-cream">Открыть доступ</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-brandy/60 hover:text-cream text-2xl leading-none"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
              Введите email, который указывали при оплате — откроем все
              купленные материалы по этому городу на этом устройстве.
            </p>

            {state === "ok" ? (
              <p className="text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3 text-sm">
                Доступ открыт ✓
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-pill bg-pine-tree/60 border border-cream/10 text-cream placeholder-brandy/40 focus:border-copper focus:outline-none"
                  autoFocus
                />
                {state === "empty" && (
                  <p className="text-pale-copper text-sm bg-pale-copper/10 border border-pale-copper/20 rounded-xl px-4 py-2.5">
                    По этому email оплат для этого города не найдено. Проверьте
                    адрес или напишите нам — поможем.
                  </p>
                )}
                {state === "error" && (
                  <p className="text-pale-copper text-sm bg-pale-copper/10 border border-pale-copper/20 rounded-xl px-4 py-2.5">
                    Не получилось проверить. Попробуйте ещё раз.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full px-6 py-3.5 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy disabled:opacity-60"
                >
                  {state === "loading" ? "Проверяем…" : "Открыть доступ"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

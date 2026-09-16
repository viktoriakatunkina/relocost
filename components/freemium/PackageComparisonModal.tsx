"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PackageComparisonTable } from "./PackageComparisonTable";
import type { CityPackageType } from "@/lib/packages";

// Модалка «Сравнить пакеты» — отдельная точка входа из StickyBar (и потенциально
// с других мест), портал в document.body по тому же паттерну, что и
// PaymentModal.tsx (см. комментарий там про Reveal/transform-обёртки и
// z-index — тот же самый риск актуален для любой fixed-модалки на странице
// города, так что решение переиспользуется, а не изобретается заново).
export function PackageComparisonModal({
  open,
  onClose,
  onBuy,
}: {
  open: boolean;
  onClose: () => void;
  onBuy: (pkg: CityPackageType) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-pine-tree/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-full flex flex-col rounded-t-3xl sm:rounded-2xl bg-surface-elevated border-cream/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-5 pb-3 md:px-8 md:pt-7">
          <div>
            <div className="text-copper uppercase text-xs tracking-wider mb-1.5">
              Сравнение пакетов
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-cream leading-tight">
              Чем пакеты отличаются
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brandy/60 hover:text-cream text-3xl leading-none -mt-1 p-1"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 md:px-8 pb-6">
          <PackageComparisonTable onBuy={(pkg) => { onBuy(pkg); onClose(); }} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

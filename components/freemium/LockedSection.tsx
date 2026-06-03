"use client";

import { useState } from "react";
import { PACKAGES, type PackageType } from "@/lib/unlocked";
import { PaymentModal } from "./PaymentModal";

export function LockedSection({
  slug,
  pkg,
  hint,
  children,
}: {
  slug: string;
  pkg: PackageType;
  hint?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const meta = PACKAGES[pkg];

  return (
    <>
      <div className="relative">
        <div
          aria-hidden
          style={{ filter: "blur(6px)" }}
          className="pointer-events-none select-none"
        >
          {children}
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-surface-elevated/95 backdrop-blur-md border border-copper/25 rounded-3xl p-6 md:p-7 text-center shadow-2xl">
            <div className="text-3xl mb-3" aria-hidden>
              {meta.emoji}
            </div>
            <h3 className="font-serif text-xl text-cream mb-2">
              {meta.label}
            </h3>
            {hint && (
              <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
                {hint}
              </p>
            )}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-block px-6 py-3 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy"
            >
              Открыть за {meta.price} ₽
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        slug={slug}
        pkg={open ? pkg : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

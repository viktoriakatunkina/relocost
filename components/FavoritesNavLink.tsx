"use client";

import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/lib/favorites";

export function FavoritesNavLink({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  const favorites = useFavorites();
  const count = favorites.length;

  return (
    <Link href="/favorites" className={className}>
      <span className="inline-flex items-center gap-1.5">
        {label}
        {count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-stone-300 text-stone-800 text-[0.7rem] font-semibold tabular-nums leading-none">
            {count}
          </span>
        )}
      </span>
    </Link>
  );
}

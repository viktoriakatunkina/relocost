"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addUnlocked, type PackageType } from "@/lib/unlocked";

const VALID: PackageType[] = ["places", "guide", "budget", "bundle"];

export function UnlockFromUrl({ slug }: { slug: string }) {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const raw = params.get("unlocked");
    if (!raw) return;
    const items = raw.split(",").filter((x): x is PackageType =>
      VALID.includes(x as PackageType),
    );
    if (items.length === 0) return;
    for (const pkg of items) addUnlocked(slug, pkg);
    // Чистим URL от ?unlocked=, чтобы при F5 не было повторного срабатывания
    const sp = new URLSearchParams(params);
    sp.delete("unlocked");
    const qs = sp.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [params, router, slug]);

  return null;
}

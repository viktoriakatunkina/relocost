import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

// Абсолютный URL страницы для конкретной локали с учётом as-needed-префикса:
//   ru → {site}/path
//   en → {site}/en/path
//   uz → {site}/uz/path
// path всегда начинается со «/» (например "/" или "/city/tbilisi").
export function localizedUrl(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return `${SITE_URL}${clean || "/"}`;
  return `${SITE_URL}/${locale}${clean}`;
}

// alternates для metadata: canonical текущей локали + hreflang на все локали
// и x-default (на дефолтную локаль). Передаём «локале-независимый» путь —
// тот же для всех языков (контент один, языковые версии различаются префиксом).
export function buildAlternates(
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localizedUrl(path, l);
  }
  // x-default указывает на дефолтную (русскую) версию без префикса.
  languages["x-default"] = localizedUrl(path, routing.defaultLocale);

  return {
    canonical: localizedUrl(path, locale),
    languages,
  };
}

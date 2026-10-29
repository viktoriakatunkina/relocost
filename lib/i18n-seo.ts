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

// alternates для metadata: canonical текущей локали + hreflang на локали, где
// перевод РЕАЛЬНО существует, и x-default (на дефолтную локаль). Передаём
// «локале-независимый» путь — тот же для всех языков (языковые версии
// различаются только префиксом).
//
// 2026-09-09. Раньше hreflang безусловно перечислял все три локали, хотя
// контент на /en и /uz для большинства страниц — тот же русский текст
// (у блога — вообще 0 переведённых статей из ~4258). Для поисковика это
// ложный сигнал: он получает заявку «вот английская версия», идёт по ней и
// находит дубль русской страницы. Теперь вызывающий код обязан честно
// сказать, для каких локалей перевод есть (`translatedLocales`).
//
// Правила:
//   • дефолтная локаль (ru) в hreflang и x-default есть всегда — она источник;
//   • en/uz попадают в hreflang, только если перечислены в translatedLocales;
//   • если текущая локаль в список НЕ входит (страница отдаётся как русский
//     фолбэк), canonical указывает на ru-версию, а не на саму себя — это
//     говорит поисковику «это не отдельная страница, индексируй русскую».
export function buildAlternates(
  path: string,
  locale: Locale,
  options?: { translatedLocales?: readonly Locale[] },
): NonNullable<Metadata["alternates"]> {
  const translated = options?.translatedLocales;
  const isTranslated = (l: Locale) =>
    l === routing.defaultLocale || !translated || translated.includes(l);

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    if (isTranslated(l)) languages[l] = localizedUrl(path, l);
  }
  // x-default указывает на дефолтную (русскую) версию без префикса.
  languages["x-default"] = localizedUrl(path, routing.defaultLocale);

  return {
    canonical: localizedUrl(
      path,
      isTranslated(locale) ? locale : routing.defaultLocale,
    ),
    languages,
  };
}

// Хелпер для разделов, где перевода нет ни на одном языке (сейчас это весь
// блог). Всегда: canonical на русскую версию, hreflang только ru + x-default.
export function buildRuOnlyAlternates(
  path: string,
): NonNullable<Metadata["alternates"]> {
  return buildAlternates(path, routing.defaultLocale, {
    translatedLocales: [routing.defaultLocale],
  });
}

// robots для страниц, которые существуют на всех локалях по URL, но реально
// переведены только на части из них (города/страны — тот же набор
// `translatedLocales`, что уже отдаёт translatedLocalesFor() для sitemap.ts
// и buildAlternates() выше).
//
// 2026-10-29. До этого страницы вроде /uz/city/moscow отдавали 200 с тем же
// русским текстом, canonical честно уводил на /city/moscow, но meta robots
// наследовался от корневого layout (index:true, follow:true) безусловно —
// сайтмап такие URL не включает (translatedLocalesFor их отфильтровывает),
// но сам URL живой, и краулер, пришедший по ссылке (не по сайтмапу), может
// утащить дубль в индекс. Явный noindex — страховка сверх canonical, который
// краулеры иногда игнорируют.
export function buildRobotsForTranslation(
  locale: Locale,
  translatedLocales: readonly Locale[],
): NonNullable<Metadata["robots"]> {
  const isTranslated =
    locale === routing.defaultLocale || translatedLocales.includes(locale);
  return isTranslated
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : { index: false, follow: true, googleBot: { index: false, follow: true } };
}

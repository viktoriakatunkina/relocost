import type { Locale } from "@/i18n/routing";

// Хелперы выбора названий из БД под локаль (Фаза 1: только названия).
//
// Контентные тексты (описания, FAQ, отзывы, гайды) пока хранятся только на
// русском и переводятся в Фазе 3 — для них везде используется русский фолбэк.
// А вот короткие имена городов/стран у нас уже есть в name_en/country_en:
//   en → name_en, если заполнено, иначе name_ru (фолбэк).
//   uz → пока ru-фолбэк (узбекских названий в БД нет).
//   ru → name_ru.

export function cityName(
  city: { name_ru: string; name_en?: string | null },
  locale: Locale,
): string {
  if (locale === "en" && city.name_en && city.name_en.trim()) {
    return city.name_en;
  }
  return city.name_ru;
}

export function countryName(
  entity: { country_ru: string; country_en?: string | null },
  locale: Locale,
): string {
  if (locale === "en" && entity.country_en && entity.country_en.trim()) {
    return entity.country_en;
  }
  return entity.country_ru;
}

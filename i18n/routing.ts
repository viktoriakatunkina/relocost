import { defineRouting } from "next-intl/routing";

// Локали сайта. Фаза 1 мультиязычности (фундамент):
//   ru — основной язык, контент в БД пока только на русском (фолбэк).
//   en — английский, переведён интерфейс; контент — ru-фолбэк (кроме name_en).
//   uz — узбекский, переведён интерфейс; контент — ru-фолбэк.
//
// localePrefix: "as-needed" — у дефолтной локали (ru) НЕТ префикса в URL,
// поэтому уже проиндексированные русские страницы (/, /city/..., /blog/...)
// остаются по тем же адресам и SEO не ломается. У en/uz — префикс (/en, /uz).
export const locales = ["ru", "en", "uz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // localeDetection отключаем: не хотим, чтобы Accept-Language молча
  // редиректил русскоязычного пользователя на /en. Язык выбирается явно
  // через переключатель в шапке. Дефолт для всех — ru без префикса.
  localeDetection: false,
});

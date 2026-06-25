import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Конфиг запроса для next-intl (App Router). Грузит словарь интерфейса для
// активной локали. Контент из БД здесь НЕ участвует — он остаётся с фолбэком
// на русские поля (переводы контента — отдельная фаза).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

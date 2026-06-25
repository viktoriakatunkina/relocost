import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Локале-осознанные обёртки навигации. Используем их ВМЕСТО next/link и
// next/navigation в общих компонентах: ссылки автоматически получают префикс
// текущей локали (/en, /uz), а для ru остаются без префикса (as-needed).
// Для ru-локали HTML ссылок байт-в-байт совпадает с прежним — SEO не меняется.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

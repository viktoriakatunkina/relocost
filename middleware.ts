import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl middleware: определяет локаль и переписывает запрос на
// app/[locale]/... . Для ru (as-needed) — без префикса.
export default createMiddleware(routing);

export const config = {
  // Пропускаем через middleware всё, КРОМЕ:
  //  - /api/*            (платежи, вебхуки ЮKassa — не локализуются)
  //  - /_next/*          (внутренние ассеты Next)
  //  - /_vercel/*
  //  - служебных SEO/метаданных-роутов в корне (sitemap, robots, manifest,
  //    opengraph-image, apple-icon — НЕ локализуются, иначе middleware
  //    перепишет их в /ru/... и они станут 404)
  //  - любых путей с точкой (статика: .jpg, .svg, .ico, .png, .txt ...)
  matcher: [
    "/((?!api|_next|_vercel|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image|apple-icon|.*\\..*).*)",
  ],
};

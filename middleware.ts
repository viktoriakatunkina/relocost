import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// next-intl middleware: определяет локаль и переписывает запрос на
// app/[locale]/... . Для ru (as-needed) — без префикса.
const intlMiddleware = createMiddleware(routing);

// ───────────────────────────────────────────────────────────────────────────
// Непереведённые разделы: отдаём русскую версию по en/uz-адресу.
//
// Проблема (подтверждена записями Вебвизора 09.09.2026): на /en/blog/* и
// /uz/blog/* шапка, футер и хлебные крошки переводились через next-intl, а
// САМ ТЕКСТ СТАТЬИ оставался стопроцентно русским — переведено 0 статей из
// ~4258. Пользователь видел английское меню над русской статьёй, что выглядит
// как баг, а поисковик получал ложный сигнал «это английская версия».
//
// Решение: для таких разделов middleware внутренним rewrite отдаёт русскую
// страницу (locale = ru) прямо по адресу /en/... . URL в браузере НЕ меняется,
// ответ остаётся 200 — уже накопленный органический трафик на /en и /uz
// (сотни визитов в месяц) никуда не девается, редиректов нет. Меняется только
// то, что интерфейс вокруг русского текста тоже становится русским: язык
// страницы перестаёт быть разнобоем.
//
// Побочный SEO-эффект (в плюс): раз params.locale = ru, страница сама собой
// отдаёт canonical на русскую версию — см. lib/i18n-seo.ts.
//
// Когда блог реально переведут — достаточно убрать /blog из этого списка.
const UNTRANSLATED_SECTION = /^\/(?:en|uz)(\/blog(?:\/.*)?)$/;

export default function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(UNTRANSLATED_SECTION);
  if (match) {
    const url = request.nextUrl.clone();
    // /en/blog/slug → /ru/blog/slug: ровно тот внутренний путь, в который
    // next-intl сам переписывает бесперфиксный /blog/slug при as-needed.
    url.pathname = `/${routing.defaultLocale}${match[1]}`;
    return NextResponse.rewrite(url);
  }
  return intlMiddleware(request);
}

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

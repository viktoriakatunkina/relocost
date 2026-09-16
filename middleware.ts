import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import blogRedirectsConfig from "./config/blog-redirects.json";

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

// ───────────────────────────────────────────────────────────────────────────
// Редиректы дублей блога (перенесено из next.config.mjs redirects(), см. git
// blame): 760 пар "проигравший slug" -> "выживший slug"
// (config/blog-redirects.json, ключ "redirects"). При 760 записях × 2
// варианта пути (ru без префикса + /:locale(en|uz)/) next.config.mjs
// redirects() генерировал ~1520 маршрутов, и Next.js на билде предупреждал
// "total number of custom routes exceeds 1000, this can reduce performance"
// — redirects() матчит их последовательным перебором. Здесь тот же результат
// даёт один O(1)-лукап по Map. Карта строится один раз при старте модуля
// (import выполняется один раз на процесс), не на каждый запрос.
//
// Путь для ru (без префикса) матчится ПЕРЕД тем как next-intl-middleware
// (intlMiddleware ниже) успевает что-то переписать — здесь мы ещё видим
// оригинальный /blog/:slug. Для en/uz путь уже содержит префикс локали.
// Статический import JSON (не readFileSync): middleware по умолчанию
// выполняется в Edge Runtime, где нет доступа к node:fs — JSON вместо этого
// вкомпилируется в бандл на этапе сборки (resolveJsonModule в tsconfig).
const blogRedirectsMap: Map<string, string> = new Map(
  Object.entries(
    blogRedirectsConfig.redirects as Record<string, string>,
  ),
);

const BLOG_SLUG_PATH = /^(?:\/(en|uz))?\/blog\/([^/]+)\/?$/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Дубли блога — проверяем РАНЬШЕ ветки UNTRANSLATED_SECTION ниже: та тоже
  // матчит /en/blog/* и /uz/blog/* (rewrite на ru-версию ТОГО ЖЕ slug'а), но
  // для проигравшего slug'а нам нужен именно редирект на канонический slug,
  // а не rewrite на русский текст неправильного адреса.
  const blogMatch = pathname.match(BLOG_SLUG_PATH);
  if (blogMatch) {
    const [, locale, rawSlug] = blogMatch;
    // pathname у NextURL хранит сегменты percent-encoded как есть (не
    // декодирует их сам) — несколько слагов в blog-redirects.json содержат
    // не-ASCII (кириллические омоглифы, см. _comment_omoglyph_slugs_fix_2026),
    // поэтому декодируем перед лукапом в Map.
    let slug = rawSlug;
    try {
      slug = decodeURIComponent(rawSlug);
    } catch {
      // Битая percent-encoding последовательность — используем как есть,
      // лукап по Map просто не найдёт совпадения.
    }
    const canonical = blogRedirectsMap.get(slug);
    if (canonical) {
      const url = request.nextUrl.clone();
      url.pathname = locale ? `/${locale}/blog/${canonical}` : `/blog/${canonical}`;
      return NextResponse.redirect(url, 308);
    }
  }

  const match = pathname.match(UNTRANSLATED_SECTION);
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

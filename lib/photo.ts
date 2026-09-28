// Единая точка выбора URL картинки для <Image>.
//
// Контекст: images.unsplash.com недоступен с российского VPS. Фото хранятся
// в Supabase Storage (bucket photos). При превышении egress-лимита Storage
// недоступен — тогда R2 (Cloudflare) берёт на себя отдачу по slug-пути.
//
// photoSrc(local, unsplashBase, opts):
//   • если есть local/unsplashBase — Storage-URL → toR2Url или Unsplash фолбэк
//
// cityPhotoSrc(slug, local, unsplashBase, opts):
//   • при наличии R2_BASE И хотя бы одном из (local, unsplashBase) — отдаёт
//     ${R2_BASE}/city/${slug}.jpg (файл точно мигрирован в R2)
//   • если оба null — фолбэк на photoSrc (городу не загружено фото → null)
//   • иначе (нет R2_BASE) — фолбэк на photoSrc

import { unsplashSrc } from "./unsplash";

const STORAGE_HOST = ".supabase.co/storage/";
const STORAGE_PUBLIC_PREFIX = "/object/public/photos/";

// Базовый URL Cloudflare R2 (задаётся через NEXT_PUBLIC_R2_URL).
// Пример: https://pub-abc123.r2.dev
const R2_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_R2_URL) || null;

export function isLocalStorageUrl(u: string | null | undefined): boolean {
  return !!u && u.includes(STORAGE_HOST);
}

// Storage-URL → R2-URL.
// В R2 мигрированы: city/{slug}.jpg, home/hero.jpg.
// u/xxx.jpg (галереи городов) и прочие пути — только в Supabase Storage.
function toR2Url(storageUrl: string): string {
  if (!R2_BASE) return storageUrl;
  const idx = storageUrl.indexOf(STORAGE_PUBLIC_PREFIX);
  if (idx === -1) return storageUrl;
  const filePath = storageUrl.slice(idx + STORAGE_PUBLIC_PREFIX.length);
  // Конвертируем пути, которые мигрированы в R2: только city/ и home/.
  // Галерейные фото (u/) хранятся в Supabase Storage — R2 их не содержит,
  // поэтому u/ намеренно исключён из перенаправления.
  if (
    !filePath.startsWith("city/") &&
    !filePath.startsWith("home/")
  ) {
    return storageUrl;
  }
  return `${R2_BASE}/${filePath}`;
}

export function photoSrc(
  local: string | null | undefined,
  unsplashBase: string | null | undefined,
  opts: { w?: number; h?: number; q?: number } = {},
): string | null {
  if (local) {
    return isLocalStorageUrl(local) ? toR2Url(local) : local;
  }
  if (unsplashBase && isLocalStorageUrl(unsplashBase)) {
    return toR2Url(unsplashBase);
  }
  return unsplashSrc(unsplashBase ?? null, opts);
}

// Для карточек и страниц городов: приоритет — R2 slug-URL.
// Скрипт migrate-to-r2.mjs загружает фото как city/{slug}.jpg
//
// Важно: R2-URL возвращаем только когда у города есть хотя бы один
// источник фото (image_url или unsplash_url). Иначе R2-файл, скорее всего,
// не существует → next/image покажет битую картинку вместо градиента.
// Даже с R2_BASE для городов без фото возвращаем null → CityCard покажет
// градиентный фоллбэк. Дополнительно CityCardImage обрабатывает onError
// на случай если R2-файл существует в базе, но не загружен в хранилище.
export function cityPhotoSrc(
  slug: string,
  local: string | null | undefined,
  unsplashBase: string | null | undefined,
  opts: { w?: number; h?: number; q?: number } = {},
): string | null {
  if (R2_BASE && (local || unsplashBase)) return `${R2_BASE}/city/${slug}.jpg`;
  return photoSrc(local, unsplashBase, opts);
}

// R2 (Cloudflare) не резолвится/не скачивается с приемлемой скоростью с
// прод-VPS (2026-09-28: прямой curl с сервера — ~3 КБ/с, 82 КБ из 551 КБ за
// 25 сек и обрыв по таймауту; при этом с браузеров пользователей R2 обычно
// быстрый — это проблема именно исходящей сети ЭТОГО VPS до R2, не самого
// R2). next/image со встроенным оптимизатором качает ОРИГИНАЛ через sharp на
// сервере перед отдачей — то есть каждый /_next/image?url=...r2.dev/... это
// попытка VPS самому скачать файл с R2. При зависающих скачиваниях эти
// незавершённые fetch'и (буферы + сокеты) копятся в памяти next-server и не
// освобождаются вовремя (nginx отдаёт клиенту 504 по proxy_read_timeout, но
// backend-процесс не всегда прерывает исходный fetch) — так процесс улетает
// с ~90 МБ до 800+ МБ за 15-20 минут и кладёт весь VPS (shared с ztmobile,
// foodlore, lunarika). Подробности в /opt/relocost — memory-leak расследование.
//
// Фикс: для R2-URL отдаём картинку БЕЗ серверной оптимизации Next — сразу
// оригинальный R2 URL, его скачивает браузер пользователя напрямую с edge
// Cloudflare, минуя наш VPS целиком. Egress по-прежнему уходит через R2 (не
// Supabase Storage), т.е. смысл миграции на R2 сохраняется — просто без
// прогона через sharp на этом сервере. Photo Storage-URL (Supabase) по
// прежнему идут через штатный оптимизатор Next — тот хост с VPS доступен
// нормально.
//
// isR2Src(src) передаётся в <Image unoptimized={...}> (НЕ через кастомный
// loader — билд 2026-09-28 падал с "Functions cannot be passed directly to
// Client Components": часть мест, где рисуется фото (CityHero, BlogCard,
// blog/[slug]/page), — серверные компоненты, а next/image <Image> сам
// является Client Component, и функция-loader не сериализуется через RSC-
// границу. unoptimized — обычный boolean, сериализуется без проблем и даёт
// тот же результат: next/image рендерит src как есть, без /_next/image).
export function isR2Src(src: string | null | undefined): boolean {
  return !!src && !!R2_BASE && src.startsWith(R2_BASE);
}

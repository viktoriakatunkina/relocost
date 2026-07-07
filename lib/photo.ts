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
//   • при наличии R2_BASE всегда отдаёт ${R2_BASE}/city/${slug}.jpg
//   • иначе фолбэк на photoSrc

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
export function cityPhotoSrc(
  slug: string,
  local: string | null | undefined,
  unsplashBase: string | null | undefined,
  opts: { w?: number; h?: number; q?: number } = {},
): string | null {
  if (R2_BASE) return `${R2_BASE}/city/${slug}.jpg`;
  return photoSrc(local, unsplashBase, opts);
}

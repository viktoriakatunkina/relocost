// Единая точка выбора URL картинки для <Image>.
//
// Контекст: images.unsplash.com недоступен с российского VPS. Все фото
// перенесены в публичный Supabase Storage (bucket photos). В БД появились
// локальные колонки (cities.image_url, blog_posts.cover_image_url) и
// gallery[].u переписан на storage-URL.
//
// photoSrc(local, unsplashBase, opts):
//   • если есть local (storage-URL) — отдаём его как есть (это уже готовый
//     JPEG ~1600px, ресайз-параметры Unsplash к нему не применимы);
//   • иначе фолбэк на Unsplash base-URL с размерными параметрами (как раньше).
//     Фолбэк работает там, где Unsplash доступен (этот Mac, dev), и не ломает
//     прод до заполнения local-колонок.

import { unsplashSrc } from "./unsplash";

const STORAGE_HOST = ".supabase.co/storage/";

export function isLocalStorageUrl(u: string | null | undefined): boolean {
  return !!u && u.includes(STORAGE_HOST);
}

export function photoSrc(
  local: string | null | undefined,
  unsplashBase: string | null | undefined,
  opts: { w?: number; h?: number; q?: number } = {},
): string | null {
  if (local) return local; // storage-URL — без ресайз-параметров
  return unsplashSrc(unsplashBase ?? null, opts);
}

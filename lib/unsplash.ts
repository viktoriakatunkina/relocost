// Утилиты для работы с фото из Unsplash, сохранёнными в БД.
// В таблице cities хранятся: unsplash_url (base URL без размерных параметров),
// unsplash_author_name, unsplash_author_url. URL дополняем размерными параметрами на лету.

export function unsplashSrc(
  baseUrl: string | null,
  opts: { w?: number; h?: number; q?: number } = {},
): string | null {
  if (!baseUrl) return null;
  const url = new URL(baseUrl);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  if (opts.w) url.searchParams.set("w", String(opts.w));
  if (opts.h) url.searchParams.set("h", String(opts.h));
  url.searchParams.set("q", String(opts.q ?? 75));
  return url.toString();
}

export function unsplashAuthorUrlWithUtm(rawUrl: string | null): string | null {
  if (!rawUrl) return null;
  const url = new URL(rawUrl);
  url.searchParams.set("utm_source", "relocost");
  url.searchParams.set("utm_medium", "referral");
  return url.toString();
}

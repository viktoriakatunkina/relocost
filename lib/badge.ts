// Общий хелпер для сборки HTML-сниппета встраиваемого бейджа
// (/api/badge/[slug]) — используется на странице города (BadgeEmbed.tsx)
// и на посадочной странице для блогеров (/embed). Логику самого бейджа
// (SVG, индекс "Москва = 100") не трогаем — она в app/api/badge/[slug]/route.ts
// и lib/moscow-baseline.ts.

const BADGE_SITE_URL = "https://relocost.ru";

export function badgeImageSrc(slug: string): string {
  return `${BADGE_SITE_URL}/api/badge/${slug}`;
}

export function badgePageUrl(slug: string): string {
  return `${BADGE_SITE_URL}/city/${slug}`;
}

// HTML-сниппет «как есть» — тот же формат, что в components/city/BadgeEmbed.tsx.
export function buildBadgeSnippet(slug: string, cityName: string): string {
  const badgeSrc = badgeImageSrc(slug);
  const pageUrl = badgePageUrl(slug);
  const alt = `Стоимость жизни в ${cityName} — Relocost`;
  return `<a href="${pageUrl}" target="_blank" rel="noopener">\n  <img src="${badgeSrc}" alt="${alt}" width="360" height="90" style="border:0">\n</a>`;
}

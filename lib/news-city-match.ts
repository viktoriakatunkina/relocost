// Сопоставление новости (заголовок + тизер) с городом/страной из каталога —
// используется, чтобы вести CTA в карточке/статье новости не на общий
// /tariffs, а на конкретный /city/[slug]/budget или /country/[slug], когда в
// тексте новости явно упоминается город/страна из нашего каталога.
//
// Переиспользует ТОТ ЖЕ алгоритм, что уже проверен на заголовках блога
// (lib/blog-city-match.ts) — не дублируем regex/эвристику здесь, только
// готовим входной текст (заголовок + тизер вместо одного заголовка,
// у новостей заголовки короче и город чаще упоминается в тизере).
import { matchCitiesInTitle, matchCountryInTitle, type CityMatchLite } from "./blog-city-match";

// 2026-09-22 (SEO-аудит): раньше при совпадении СТРАНЫ без конкретного города
// (например «депортации из США» — упомянута страна, не город) код брал
// cities.find(c => c.country_slug === country.slug) — т.е. произвольный ПЕРВЫЙ
// город этой страны в порядке ответа Supabase (для США это оказывался
// Сан-Франциско, к новости никак не привязанный). Теперь два разных исхода
// различаются явно: "city" — веди на конкретный город, "country" — веди на
// страницу страны (честнее, чем гадать город). generateStaticParams в
// /country/[slug] строит список стран из cities.country_slug (см. app/[locale]
// /country/[slug]/page.tsx), так что country.slug оттуда гарантированно valid.
export type NewsCTATarget =
  | { kind: "city"; slug: string; name_ru: string }
  | { kind: "country"; slug: string; name_ru: string };

export function matchCityForNews(
  title: string,
  summary: string,
  cities: CityMatchLite[],
): NewsCTATarget | null {
  const text = `${title} ${summary}`;
  const cityHits = matchCitiesInTitle(text, cities);
  if (cityHits.length) {
    const c = cityHits[0];
    return { kind: "city", slug: c.slug, name_ru: c.name_ru };
  }

  const country = matchCountryInTitle(text, cities);
  if (country) {
    return { kind: "country", slug: country.slug, name_ru: country.name_ru };
  }
  return null;
}

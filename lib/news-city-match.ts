// Сопоставление новости (заголовок + тизер) с городом/страной из каталога —
// используется, чтобы вести CTA в карточке/статье новости не на общий
// /tariffs, а на конкретный /city/[slug]/budget, когда в тексте новости
// явно упоминается город или страна из нашего каталога.
//
// Переиспользует ТОТ ЖЕ алгоритм, что уже проверен на заголовках блога
// (lib/blog-city-match.ts) — не дублируем regex/эвристику здесь, только
// готовим входной текст (заголовок + тизер вместо одного заголовка,
// у новостей заголовки короче и город чаще упоминается в тизере).
import { matchCitiesInTitle, matchCountryInTitle, type CityMatchLite } from "./blog-city-match";

export type NewsCTACity = Pick<CityMatchLite, "slug" | "name_ru">;

export function matchCityForNews(
  title: string,
  summary: string,
  cities: CityMatchLite[],
): NewsCTACity | null {
  const text = `${title} ${summary}`;
  const cityHits = matchCitiesInTitle(text, cities);
  if (cityHits.length) return cityHits[0];

  const country = matchCountryInTitle(text, cities);
  if (country) {
    const first = cities.find((c) => c.country_slug === country.slug);
    if (first) return first;
  }
  return null;
}

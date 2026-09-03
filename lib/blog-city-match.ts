// Сопоставление статьи блога с городом/страной по заголовку, когда city_id и
// country_slug у статьи не заполнены. Используется как рантайм-фолбэк в
// app/[locale]/blog/[slug]/page.tsx — только для статей, у которых ОБА поля
// пустые (для статей с city_id/country_slug эта логика не нужна, у них уже
// полноценная привязка).
//
// Тот же алгоритм продублирован на чистом JS в
// scripts/backfill-blog-city-country.mjs (см. коммит аудита воронки блог →
// монетизируемые страницы, 2026-09) — тем скриптом разово проставлен
// city_id/country_slug статьям, где заголовок называл РОВНО один город/страну
// уверенно (see CONFIDENT_POS_MAX ниже). Здесь тот же алгоритм работает на
// лету как подстраховка для статей-сравнений нескольких городов («Тбилиси vs
// Ереван» — бэкафилл такие намеренно пропускает как неоднозначные) и для
// новых статей, которые появятся после бэкафилла.
//
// Заголовки этого блога часто содержат «хук»-факты в кавычках-ёлочках и
// перечисление доп. фактов через ";" после основного подлежащего, например:
//   «Куба Матансас DN 2026: $200-400/мес; «АФИНЫ КУБЫ» (и «Город мостов»...)»
// Наивное сопоставление находило бы тут «Афины» (Греция) — совершенно не по
// теме статьи про кубинский Матансас. Поэтому перед поиском: (1) вырезаем
// текст в кавычках-ёлочках «...» (это почти всегда прозвища/хук-факты, не
// подлежащее), (2) обрезаем всё после первого ";" (там тоже обычно идут
// хук-факты, не тема статьи). Единичное совпадение, найденное ПОСЛЕ этой
// очистки, но всё ещё далеко от начала (позиция ⩾ CONFIDENT_POS_MAX) тоже
// отбрасывается как маловероятно являющееся подлежащим статьи.

export type CityMatchLite = {
  id: string;
  slug: string;
  name_ru: string;
  country_ru: string;
  country_slug: string;
  flag_emoji: string | null;
};

// Совпадение дальше этой позиции в очищенном заголовке (после вырезания
// «...»-вставок и обрезки по первому ";") считается ненадёжным, если оно
// единственное — с высокой вероятностью это случайное упоминание в хвосте
// заголовка (факт/сравнение), а не тема статьи. См. примеры в шапке файла.
const CONFIDENT_POS_MAX = 60;

function normalize(s: string): string {
  return s.toLowerCase().replace(/ё/g, "е");
}

function prepTitle(title: string): string {
  const withoutQuotes = title.replace(/«[^»]*»/g, " ");
  return normalize(withoutQuotes.split(";")[0]);
}

function wordBoundaryRegex(name: string): RegExp {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![а-яa-z0-9])${escaped}(?![а-яa-z0-9])`, "i");
}

function rawCityMatches(
  t: string,
  cities: CityMatchLite[],
): { city: CityMatchLite; index: number }[] {
  const found: { city: CityMatchLite; index: number }[] = [];
  for (const c of cities) {
    const name = normalize(c.name_ru);
    if (name.length < 3) continue;
    const m = t.match(wordBoundaryRegex(name));
    if (m && m.index !== undefined) found.push({ city: c, index: m.index });
  }
  found.sort((a, b) => a.index - b.index || b.city.name_ru.length - a.city.name_ru.length);
  const seen = new Set<string>();
  const result: { city: CityMatchLite; index: number }[] = [];
  for (const f of found) {
    if (seen.has(f.city.id)) continue;
    seen.add(f.city.id);
    result.push(f);
  }
  return result;
}

/**
 * Города, упомянутые в заголовке статьи, в порядке появления, без дублей.
 * Если найдено НЕСКОЛЬКО городов — возвращает все (статья-сравнение, все
 * упоминания считаем осмысленными). Если найден РОВНО один, но далеко от
 * начала очищенного заголовка (см. CONFIDENT_POS_MAX) — считаем это случайным
 * упоминанием и возвращаем пустой массив (пусть вызывающий код попробует
 * matchCountryInTitle или общий фолбэк).
 */
export function matchCitiesInTitle(
  title: string,
  cities: CityMatchLite[],
): CityMatchLite[] {
  const hits = rawCityMatches(prepTitle(title), cities);
  if (hits.length === 1 && hits[0].index >= CONFIDENT_POS_MAX) return [];
  return hits.map((h) => h.city);
}

/**
 * Страна, упомянутая в заголовке — только если найдена РОВНО одна и достаточно
 * близко к началу очищенного заголовка (см. CONFIDENT_POS_MAX), иначе null.
 * Вызывать только когда matchCitiesInTitle вернул пустой массив.
 */
export function matchCountryInTitle(
  title: string,
  cities: CityMatchLite[],
): { slug: string; name_ru: string } | null {
  const t = prepTitle(title);
  const byCountry = new Map<string, string>();
  for (const c of cities) byCountry.set(c.country_slug, c.country_ru);
  const found: { slug: string; name: string; index: number }[] = [];
  byCountry.forEach((name, slug) => {
    const m = t.match(wordBoundaryRegex(normalize(name)));
    if (m && m.index !== undefined) found.push({ slug, name, index: m.index });
  });
  if (found.length !== 1) return null;
  if (found[0].index >= CONFIDENT_POS_MAX) return null;
  return { slug: found[0].slug, name_ru: found[0].name };
}

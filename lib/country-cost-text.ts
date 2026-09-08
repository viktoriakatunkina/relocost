import { formatRub } from "./cities";
import { countryIn, countryOf } from "./country-prepositional";
import type { CountryCost } from "./country-cost";

// Текст и FAQ блока «Сколько стоит жить в <стране>» — генерируются ИЗ ЧИСЕЛ
// агрегата, без ручного контента, как это уже сделано для сравнения городов
// (lib/compare.ts → compareSummary/compareFaq). Русский — язык трафика этого
// кластера, поэтому прозу не локализуем (тот же подход, что на /compare).

// Форма совпадает с FaqItem (components/FaqSchema) — эти вопросы уезжают
// и в видимый блок FAQ, и в schema.org FAQPage без переупаковки.
export type CountryFaqItem = { q: string; a: string };

const YEAR = 2026;

/** Абзацы под таблицей быстрых цифр. */
export function countryCostSummary(
  cost: CountryCost,
  slug: string,
  nameRu: string,
): string[] {
  const where = countryIn(slug, nameRu);
  const of = countryOf(slug, nameRu);
  const out: string[] = [];

  const rent = cost.lines.find((l) => l.key === "rent")!.value;
  const food = cost.lines.find((l) => l.key === "food")!.value;
  const utilities = cost.lines.find((l) => l.key === "utilities")!.value;

  out.push(
    `Экономный месяц на одного человека ${where} обходится примерно в ${formatRub(cost.monthlySolo)}: ` +
      `${formatRub(rent)} за однокомнатную квартиру на окраине, ${formatRub(food)} на продукты и ` +
      `${formatRub(utilities)} на ЖКХ, интернет и мобильную связь. ` +
      `Комфортный вариант — квартира в центре и расходы без жесткой экономии — выходит около ${formatRub(cost.monthlyComfort)} в месяц. ` +
      `Пара тратит от ${formatRub(cost.monthlyCouple)}, семья с одним ребенком — от ${formatRub(cost.monthlyFamily)}.`,
  );

  if (cost.cheapest && cost.priciest && cost.cheapest.slug !== cost.priciest.slug) {
    const ratio = cost.priciest.monthly / cost.cheapest.monthly;
    const spread =
      ratio >= 2
        ? `в ${ratio.toFixed(1)} раза`
        : `на ${Math.round((ratio - 1) * 100)}%`;
    out.push(
      `Разброс по городам ${of} большой: дешевле всего выходит ${cost.cheapest.name_ru} — ${formatRub(cost.cheapest.monthly)} в месяц, ` +
        `дороже всего ${cost.priciest.name_ru} — ${formatRub(cost.priciest.monthly)}, то есть ${spread} дороже. ` +
        `Основную разницу делает аренда: ${formatRub(cost.cheapest.rent)} против ${formatRub(cost.priciest.rent)} за ту же однокомнатную квартиру на окраине. ` +
        `Поэтому «средняя стоимость жизни по стране» — плохой ориентир: считайте бюджет под конкретный город.`,
    );
  }

  return out;
}

/** 5 вопросов FAQ для schema.org FAQPage — ответы собраны из чисел агрегата. */
export function countryCostFaq(
  cost: CountryCost,
  slug: string,
  nameRu: string,
): CountryFaqItem[] {
  const where = countryIn(slug, nameRu);
  const of = countryOf(slug, nameRu);
  const rent = cost.lines.find((l) => l.key === "rent")!.value;
  const food = cost.lines.find((l) => l.key === "food")!.value;
  const transport = cost.lines.find((l) => l.key === "transport")!.value;
  const utilities = cost.lines.find((l) => l.key === "utilities")!.value;

  const items: CountryFaqItem[] = [
    {
      q: `Сколько стоит жить ${where} в ${YEAR} году?`,
      a:
        `Экономный месяц на одного человека ${where} — примерно ${formatRub(cost.monthlySolo)} по данным Relocost на ${YEAR} год. ` +
        `Сюда входят аренда однокомнатной квартиры на окраине (${formatRub(rent)}), продукты (${formatRub(food)}), ` +
        `проездной (${formatRub(transport)}) и ЖКХ со связью (${formatRub(utilities)}). ` +
        `Комфортный уровень с жильем в центре — около ${formatRub(cost.monthlyComfort)} в месяц.`,
    },
    {
      q: `Сколько нужно денег в месяц на семью ${where}?`,
      a:
        `Паре без детей ${where} нужно от ${formatRub(cost.monthlyCouple)} в месяц, семье из двух взрослых и ребенка — от ${formatRub(cost.monthlyFamily)}. ` +
        `Расчет идет от базового бюджета на одного: жилье для семьи берется на 40% дороже (нужна квартира побольше), еда и транспорт масштабируются по числу человек.`,
    },
    {
      q: `Сколько стоит аренда квартиры ${where}?`,
      a:
        `Медианная аренда однокомнатной квартиры на окраине ${where} — ${formatRub(rent)} в месяц, в центре — около ${formatRub(cost.rentCenter)}. ` +
        (cost.cheapest && cost.priciest && cost.cheapest.slug !== cost.priciest.slug
          ? `Дешевле всего снять жилье в городе ${cost.cheapest.name_ru} (${formatRub(cost.cheapest.rent)}), дороже всего — в ${cost.priciest.name_ru} (${formatRub(cost.priciest.rent)}).`
          : `Цены считаются по реальным объявлениям и обновляются раз в сутки.`),
    },
  ];

  if (cost.cheapest) {
    items.push({
      q: `В каком городе ${of} жить дешевле всего?`,
      a:
        `По данным Relocost самый доступный город ${of} — ${cost.cheapest.name_ru}: экономный месяц на одного обходится в ${formatRub(cost.cheapest.monthly)}. ` +
        `Это аренда ${formatRub(cost.cheapest.rent)}, продукты ${formatRub(cost.cheapest.food)} и ${formatRub(cost.cheapest.utilities)} на коммунальные услуги и связь.`,
    });
  }

  items.push({
    q: `Хватит ли 100 000 ₽ в месяц, чтобы жить ${where}?`,
    a:
      cost.monthlySolo <= 60_000
        ? `Да, с запасом. Экономный месяц на одного ${where} — ${formatRub(cost.monthlySolo)}, комфортный — ${formatRub(cost.monthlyComfort)}. ` +
          `На 100 000 ₽ ${where} можно жить одному без жесткой экономии или вдвоем в базовом режиме (паре нужно от ${formatRub(cost.monthlyCouple)}).`
        : cost.monthlySolo <= 100_000
          ? `Да, но без большого запаса. Экономный месяц на одного ${where} — ${formatRub(cost.monthlySolo)}, комфортный — уже ${formatRub(cost.monthlyComfort)}. ` +
            `Вдвоем 100 000 ₽ не хватит: паре нужно от ${formatRub(cost.monthlyCouple)}.`
          : `Нет, этого мало даже одному. Экономный месяц ${where} — ${formatRub(cost.monthlySolo)}, а комфортный уровень начинается от ${formatRub(cost.monthlyComfort)}. ` +
            `Планируйте бюджет от ${formatRub(Math.ceil(cost.monthlySolo / 10_000) * 10_000)} в месяц на человека.`,
  });

  return items;
}

/**
 * Короткий хук с главной цифрой — для лида страницы страны сразу под H1.
 * Именно эта строка отвечает на запрос «сколько стоит жить в <стране>» и
 * претендует на быстрый ответ в Яндексе.
 */
export function countryCostHook(
  cost: CountryCost,
  slug: string,
  nameRu: string,
): string {
  const where = countryIn(slug, nameRu);
  return `Жизнь ${where} в ${YEAR} году: от ${formatRub(cost.monthlySolo)} в месяц на одного человека, ${formatRub(cost.monthlyComfort)} — комфортный уровень, от ${formatRub(cost.monthlyFamily)} — семья с ребенком.`;
}

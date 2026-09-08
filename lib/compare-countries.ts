import { supabase } from "./supabase";
import { formatRub } from "./cities";
import { buildCountryCost, loadPriceRows, type CountryCost } from "./country-cost";
import { COUNTRY_CONTENT, type CountryContent } from "./countries-content";
import { countryIn, countryOf } from "./country-prepositional";
import type { City } from "./types";

// Сравнение СТРАН на /compare/<a>-vs-<b>.
//
// Зачем: /compare — самый эффективный тип страницы сайта по визитам на URL
// (1,64 против 0,49 у блога), но все 66 сравнений были «город vs город», а
// спрос в Яндекс.Suggest сидит и на уровне стран: «грузия или армения где
// лучше жить», «где дешевле жить в тайланде или во вьетнаме», «где дешевле
// жить в россии или белоруссии», «сербия или черногория что лучше для
// переезда», «казахстан или узбекистан», «испания или португалия где лучше
// жить». Сравнений стран на сайте не было ни одного.
//
// Данные берем из тех же источников, что и страница страны: агрегат цен
// (lib/country-cost) + справочник COUNTRY_CONTENT (виза, язык, климат,
// налоги, сложность). Ничего не выдумываем: все, что показано, уже есть в
// базе или в версионируемом справочнике.

export type CountryCompareSide = {
  slug: string;
  name_ru: string;
  flag_emoji: string | null;
  cityCount: number;
  cost: CountryCost;
  content: CountryContent | null;
  /** Сложность переезда 1-5: из справочника, иначе среднее по городам. */
  difficulty: number;
};

export type CountryCompareLine = {
  key: "rent" | "food" | "transport" | "utilities" | "monthly" | "difficulty";
  label: string;
  a: number;
  b: number;
  unit: "rub" | "score";
  winner: "a" | "b" | "tie";
};

export type CountryCompareResult = {
  a: CountryCompareSide;
  b: CountryCompareSide;
  lines: CountryCompareLine[];
  scoreA: number;
  scoreB: number;
};

const LABELS: Record<CountryCompareLine["key"], string> = {
  monthly: "Месяц на одного человека",
  rent: "Аренда 1-комн. на окраине",
  food: "Продукты на месяц",
  transport: "Проездной на транспорт",
  utilities: "ЖКХ, интернет и связь",
  difficulty: "Сложность переезда",
};

function winnerOf(a: number, b: number): "a" | "b" | "tie" {
  if (a <= 0 || b <= 0) return "tie";
  if (a === b) return "tie";
  return a < b ? "a" : "b"; // меньше = лучше во всех наших строках
}

/** Собирает сравнение двух стран. null — если хотя бы у одной нет цен. */
export async function loadCountryCompare(
  slugA: string,
  slugB: string,
): Promise<CountryCompareResult | null> {
  if (slugA === slugB) return null;
  const { data: cities } = await supabase
    .from("cities")
    .select("id, slug, name_ru, country_slug, country_ru, flag_emoji, difficulty_score")
    .in("country_slug", [slugA, slugB]);
  if (!cities?.length) return null;
  const inA = cities.filter((c) => c.country_slug === slugA);
  const inB = cities.filter((c) => c.country_slug === slugB);
  if (inA.length === 0 || inB.length === 0) return null;

  const rowsByCity = await loadPriceRows(cities.map((c) => c.id));
  const costA = buildCountryCost(slugA, inA as City[], rowsByCity);
  const costB = buildCountryCost(slugB, inB as City[], rowsByCity);
  if (!costA || !costB) return null;

  const side = (
    slug: string,
    rows: typeof cities,
    cost: CountryCost,
  ): CountryCompareSide => {
    const content = COUNTRY_CONTENT[slug] ?? null;
    const scores = rows.map((c) => c.difficulty_score ?? 0).filter((v) => v > 0);
    const avg = scores.length ? scores.reduce((x, y) => x + y, 0) / scores.length : 0;
    return {
      slug,
      name_ru: rows[0].country_ru,
      flag_emoji: rows[0].flag_emoji,
      cityCount: cost.cityCount,
      cost,
      content,
      difficulty: content?.difficulty_overall ?? (avg ? Math.round(avg) : 3),
    };
  };

  const a = side(slugA, inA, costA);
  const b = side(slugB, inB, costB);

  const val = (cost: CountryCost, key: CountryCompareLine["key"]) =>
    key === "monthly" ? cost.monthlySolo : cost.lines.find((l) => l.key === key)?.value ?? 0;

  const lines: CountryCompareLine[] = (
    ["monthly", "rent", "food", "transport", "utilities"] as const
  ).map((key) => {
    const av = val(costA, key);
    const bv = val(costB, key);
    return { key, label: LABELS[key], a: av, b: bv, unit: "rub" as const, winner: winnerOf(av, bv) };
  });
  lines.push({
    key: "difficulty",
    label: LABELS.difficulty,
    a: a.difficulty,
    b: b.difficulty,
    unit: "score",
    winner: winnerOf(a.difficulty, b.difficulty),
  });

  // «Месяц на одного» — производная от четырех статей, поэтому в счет не идет,
  // иначе более дешевая страна получала бы два очка за одно и то же.
  const scoring = lines.filter((l) => l.key !== "monthly");
  return {
    a,
    b,
    lines,
    scoreA: scoring.filter((l) => l.winner === "a").length,
    scoreB: scoring.filter((l) => l.winner === "b").length,
  };
}

/** Насколько одна страна дешевле другой — для SEO-хука в title и h1. */
export function countryCompareDelta(
  data: CountryCompareResult,
): { cheaper: "a" | "b"; pct: number } | null {
  const sa = data.a.cost.monthlySolo;
  const sb = data.b.cost.monthlySolo;
  if (sa <= 0 || sb <= 0 || sa === sb) return null;
  const pct = Math.round((1 - Math.min(sa, sb) / Math.max(sa, sb)) * 100);
  if (pct < 1) return null;
  return { cheaper: sa < sb ? "a" : "b", pct };
}

/** Абзацы вывода под таблицей — только из чисел и справочника. */
export function countryCompareSummary(data: CountryCompareResult): string[] {
  const { a, b } = data;
  const out: string[] = [];
  const delta = countryCompareDelta(data);
  const cheap = delta ? (delta.cheaper === "a" ? a : b) : null;
  const dear = cheap ? (cheap === a ? b : a) : null;

  if (cheap && dear && delta) {
    out.push(
      `По базовым расходам ${countryIn(cheap.slug, cheap.name_ru)} жить дешевле, чем ${countryIn(dear.slug, dear.name_ru)}, примерно на ${delta.pct}%: ` +
        `${formatRub(cheap.cost.monthlySolo)} против ${formatRub(dear.cost.monthlySolo)} в месяц на одного человека. ` +
        `Разницу делает в первую очередь аренда — ${formatRub(costLine(cheap.cost, "rent"))} против ${formatRub(costLine(dear.cost, "rent"))} за однокомнатную квартиру на окраине. ` +
        `Семье с ребенком понадобится ${formatRub(cheap.cost.monthlyFamily)} и ${formatRub(dear.cost.monthlyFamily)} соответственно.`,
    );
  } else {
    out.push(
      `По базовым расходам ${countryIn(a.slug, a.name_ru)} и ${countryIn(b.slug, b.name_ru)} сопоставимы — около ${formatRub(a.cost.monthlySolo)} в месяц на одного человека. ` +
        `Выбирать имеет смысл не по деньгам, а по визе, языку и климату.`,
    );
  }

  // Разброс внутри стран: часто важнее, чем разница между странами.
  const spread = (s: CountryCompareSide) =>
    s.cost.cheapest && s.cost.priciest && s.cost.cheapest.slug !== s.cost.priciest.slug
      ? `${countryIn(s.slug, s.name_ru)} — от ${formatRub(s.cost.cheapest.monthly)} в городе ${s.cost.cheapest.name_ru} до ${formatRub(s.cost.priciest.monthly)} в ${s.cost.priciest.name_ru}`
      : null;
  const sa = spread(a);
  const sb = spread(b);
  if (sa && sb) {
    out.push(
      `Внутри каждой страны разброс не меньше, чем между ними: ${sa}; ${sb}. ` +
        `Поэтому сравнивать стоит не «страна против страны», а конкретные города под Ваш сценарий переезда.`,
    );
  }

  const easier =
    data.a.difficulty === data.b.difficulty ? null : data.a.difficulty < data.b.difficulty ? a : b;
  const leader = data.scoreA === data.scoreB ? null : data.scoreA > data.scoreB ? a : b;
  let p = "";
  if (easier) {
    p += `Переехать и легализоваться проще ${countryIn(easier.slug, easier.name_ru)} — оценка сложности ${easier.difficulty} из 5 против ${(easier === a ? b : a).difficulty} у соседа по сравнению. `;
  }
  if (leader) p += `По большинству статей расходов выгоднее ${countryIn(leader.slug, leader.name_ru)}. `;
  if (a.content?.visa_note && b.content?.visa_note) {
    p += `Визовые условия для россиян: ${a.name_ru} — ${lower(a.content.visa_note)} ${b.name_ru} — ${lower(b.content.visa_note)}`;
  }
  if (p) out.push(p.trim());

  return out;
}

/** Медиана по статье расходов — без опоры на порядок элементов в lines. */
export function costLine(cost: CountryCost, key: "rent" | "food" | "transport" | "utilities"): number {
  return cost.lines.find((l) => l.key === key)?.value ?? 0;
}

function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// Форма совпадает с CompareFaqItem (lib/compare) — переиспользуем готовый
// компонент CompareDetails с его FAQPage-разметкой, без второй реализации.
export type CountryCompareFaqItem = { question: string; answer: string };

/** FAQ страницы сравнения стран — под длинный хвост «где дешевле», «где лучше». */
export function countryCompareFaq(data: CountryCompareResult): CountryCompareFaqItem[] {
  const { a, b } = data;
  const delta = countryCompareDelta(data);
  const cheap = delta ? (delta.cheaper === "a" ? a : b) : null;
  const dear = cheap ? (cheap === a ? b : a) : null;
  const easier =
    a.difficulty === b.difficulty ? null : a.difficulty < b.difficulty ? a : b;

  const items: CountryCompareFaqItem[] = [];

  items.push({
    question: `Где дешевле жить — ${countryIn(a.slug, a.name_ru)} или ${countryIn(b.slug, b.name_ru)}?`,
    answer:
      cheap && dear && delta
        ? `Дешевле ${countryIn(cheap.slug, cheap.name_ru)}: экономный месяц на одного человека обходится в ${formatRub(cheap.cost.monthlySolo)} против ${formatRub(dear.cost.monthlySolo)}, то есть примерно на ${delta.pct}% меньше. Расчет на 2026 год по ценам аренды, продуктов, транспорта и коммунальных услуг.`
        : `Расходы сопоставимы: около ${formatRub(a.cost.monthlySolo)} в месяц на одного человека в обеих странах.`,
  });

  items.push({
    question: `Сколько стоит аренда квартиры ${countryIn(a.slug, a.name_ru)} и ${countryIn(b.slug, b.name_ru)}?`,
    answer: `Медианная аренда однокомнатной квартиры на окраине: ${a.name_ru} — ${formatRub(costLine(a.cost, "rent"))} в месяц, ${b.name_ru} — ${formatRub(costLine(b.cost, "rent"))}. В центре — ${formatRub(a.cost.rentCenter)} и ${formatRub(b.cost.rentCenter)} соответственно.`,
  });

  items.push({
    question: `Где проще переехать — ${countryIn(a.slug, a.name_ru)} или ${countryIn(b.slug, b.name_ru)}?`,
    answer: easier
      ? `Проще ${countryIn(easier.slug, easier.name_ru)}: оценка сложности переезда ${easier.difficulty} из 5 против ${(easier === a ? b : a).difficulty}. ${easier.content?.visa_note ?? ""}`.trim()
      : `Обе страны оценены одинаково — ${a.difficulty} из 5 по сложности переезда. Смотрите на визовые условия и язык: ${a.name_ru} — ${lower(a.content?.language_note ?? "данных нет.")} ${b.name_ru} — ${lower(b.content?.language_note ?? "данных нет.")}`,
  });

  items.push({
    question: `Сколько нужно денег на семью ${countryIn(a.slug, a.name_ru)} и ${countryIn(b.slug, b.name_ru)}?`,
    answer: `Семье из двух взрослых и ребенка нужно от ${formatRub(a.cost.monthlyFamily)} в месяц ${countryIn(a.slug, a.name_ru)} и от ${formatRub(b.cost.monthlyFamily)} ${countryIn(b.slug, b.name_ru)}. Паре без детей — ${formatRub(a.cost.monthlyCouple)} и ${formatRub(b.cost.monthlyCouple)} соответственно.`,
  });

  if (a.cost.cheapest && b.cost.cheapest) {
    items.push({
      question: `В каком городе ${countryOf(a.slug, a.name_ru)} и ${countryOf(b.slug, b.name_ru)} дешевле всего?`,
      answer: `Самый доступный город ${countryOf(a.slug, a.name_ru)} — ${a.cost.cheapest.name_ru} (${formatRub(a.cost.cheapest.monthly)} в месяц), ${countryOf(b.slug, b.name_ru)} — ${b.cost.cheapest.name_ru} (${formatRub(b.cost.cheapest.monthly)}).`,
    });
  }

  items.push({
    question: `${a.name_ru} или ${b.name_ru} — что выбрать для переезда в 2026 году?`,
    answer:
      data.scoreA === data.scoreB
        ? `Счет по статьям расходов равный. Если решает бюджет — берите${cheap ? ` ${cheap.name_ru}` : " более дешевый вариант"}; если простота легализации${easier ? ` — ${easier.name_ru}` : ""}.`
        : `По большинству статей выгоднее ${data.scoreA > data.scoreB ? a.name_ru : b.name_ru}. Но деньги — не единственный критерий: сравните визовый режим, язык и климат в таблице выше, а бюджет считайте под конкретный город, а не под страну целиком.`,
  });

  return items;
}

/**
 * Пары стран для прегенерации и sitemap. Список собран по Яндекс.Suggest
 * (проверено 2026-09-08): каждая пара реально подсказывается по запросам вида
 * «X или Y», «где дешевле жить в X или Y», «X или Y где лучше жить».
 * Обе страны каждой пары есть в каталоге с городами и ценами.
 */
export const COUNTRY_COMPARE_PAIRS: [string, string][] = [
  ["georgia", "armenia"],        // грузия или армения где лучше жить
  ["thailand", "vietnam"],       // где дешевле жить в тайланде или во вьетнаме
  ["russia", "belarus"],         // где дешевле жить в россии или белоруссии
  ["serbia", "montenegro"],      // сербия или черногория что лучше для переезда
  ["serbia", "georgia"],         // сербия или грузия
  ["serbia", "armenia"],         // сербия или армения
  ["serbia", "bulgaria"],        // сербия или болгария
  ["montenegro", "croatia"],     // черногория или хорватия где лучше
  ["montenegro", "albania"],     // черногория или албания
  ["montenegro", "bulgaria"],    // черногория или болгария
  ["kazakhstan", "uzbekistan"],  // казахстан или узбекистан
  ["kazakhstan", "belarus"],     // казахстан или беларусь
  ["kazakhstan", "kyrgyzstan"],  // казахстан или кыргызстан
  ["russia", "kazakhstan"],      // казахстан или россия
  ["spain", "portugal"],         // испания или португалия где лучше жить
  ["spain", "italy"],            // испания или италия где лучше жить русским
  ["georgia", "turkey"],         // грузия или турция
  ["turkey", "montenegro"],      // черногория или турция что лучше
  ["vietnam", "turkey"],         // турция или вьетнам
  ["thailand", "turkey"],        // турция или тайланд куда лучше
  ["turkey", "egypt"],           // турция или египет
  ["armenia", "kazakhstan"],     // армения или казахстан
  ["thailand", "indonesia"],     // тайланд или бали/индонезия
];

/** Канонические (алфавитные) слаги пар — для sitemap без дублей-реверсов. */
export function countryComparePairSlugs(): string[] {
  const set = new Set<string>();
  for (const [x, y] of COUNTRY_COMPARE_PAIRS) {
    const [first, second] = [x, y].sort();
    set.add(`${first}-vs-${second}`);
  }
  return Array.from(set);
}

/**
 * Сравнения стран, в которых участвует данная страна, — для перелинковки со
 * страницы /country/<slug>. Без этих ссылок новые страницы сравнений стран
 * доступны краулеру только из sitemap: внутренних путей к ним на сайте нет.
 * Возвращает slug пары и название страны-оппонента (для подписи ссылки).
 */
export function countryComparePartners(slug: string): { pair: string; other: string }[] {
  const out: { pair: string; other: string }[] = [];
  const seen = new Set<string>();
  for (const [x, y] of COUNTRY_COMPARE_PAIRS) {
    if (x !== slug && y !== slug) continue;
    const other = x === slug ? y : x;
    if (seen.has(other)) continue;
    seen.add(other);
    // Ссылаемся на каноническую (алфавитную) ориентацию пары — на нее же
    // указывает canonical в мета, чтобы не плодить дубли для поисковика.
    const [first, second] = [slug, other].sort();
    out.push({ pair: `${first}-vs-${second}`, other });
  }
  return out;
}

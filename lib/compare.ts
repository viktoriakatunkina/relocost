import { supabase } from "./supabase";
import { getPricesByCity } from "./prices";
import { formatRub } from "./cities";
import type { City, Price, PriceCategory } from "./types";
import {
  comparePhrase,
  type SecondPersonItem,
  type SpendKey,
} from "./second-person";

export type CompareCategory =
  | "rent"
  | "food"
  | "transport"
  | "utilities"
  | "difficulty";

export type CompareLine = {
  key: CompareCategory;
  label: string;
  a: number;
  b: number;
  unit: "rub" | "score";
  // лучше = меньше для rent/food/transport/utilities/difficulty
  winner: "a" | "b" | "tie";
};

export type CompareResult = {
  a: City;
  b: City;
  lines: CompareLine[];
  scoreA: number;
  scoreB: number;
};

export function parsePair(s: string): [string, string] | null {
  const m = s.match(/^([a-z][a-z-]*)-vs-([a-z][a-z-]*)$/);
  if (!m) return null;
  if (m[1] === m[2]) return null;
  return [m[1], m[2]];
}

export function pairSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

function findPrice(
  prices: Record<PriceCategory, Price[]>,
  category: PriceCategory,
  match: (p: Price) => boolean,
): Price | undefined {
  return (prices[category] ?? []).find(match);
}

function representativeRub(
  prices: Record<PriceCategory, Price[]>,
  key: CompareCategory,
): number {
  if (key === "rent") {
    const p = findPrice(prices, "rent", (x) =>
      x.item_name_ru.includes("1-комн. квартира на окраине"),
    );
    return p ? Math.round((p.price_min + p.price_max) / 2) : 0;
  }
  if (key === "food") {
    const p = findPrice(prices, "food", (x) =>
      x.item_name_ru.includes("Продукты"),
    );
    return p ? Math.round((p.price_min + p.price_max) / 2) : 0;
  }
  if (key === "transport") {
    const pass = findPrice(prices, "transport", (x) =>
      x.item_name_ru.includes("проездной"),
    );
    return pass ? Math.round((pass.price_min + pass.price_max) / 2) : 0;
  }
  if (key === "utilities") {
    const ghk = findPrice(prices, "utilities", (x) =>
      x.item_name_ru.startsWith("ЖКХ"),
    );
    const net = findPrice(prices, "utilities", (x) =>
      x.item_name_ru.includes("Домашний"),
    );
    const mob = findPrice(prices, "utilities", (x) =>
      x.item_name_ru.includes("Мобильная"),
    );
    return [ghk, net, mob].reduce(
      (acc, p) =>
        acc + (p ? Math.round((p.price_min + p.price_max) / 2) : 0),
      0,
    );
  }
  return 0;
}

const LABELS: Record<CompareCategory, string> = {
  rent: "Аренда (1-комн. на окраине)",
  food: "Продукты на месяц",
  transport: "Проездной",
  utilities: "ЖКХ + интернет + мобильная",
  difficulty: "Сложность переезда",
};

function winner(a: number, b: number): "a" | "b" | "tie" {
  if (a === 0 && b === 0) return "tie";
  if (a === b) return "tie";
  return a < b ? "a" : "b";
}

export async function loadCompare(
  slugA: string,
  slugB: string,
): Promise<CompareResult | null> {
  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .in("slug", [slugA, slugB]);
  if (!cities || cities.length !== 2) return null;
  const a = (cities as City[]).find((c) => c.slug === slugA);
  const b = (cities as City[]).find((c) => c.slug === slugB);
  if (!a || !b) return null;

  const [pricesA, pricesB] = await Promise.all([
    getPricesByCity(a.id),
    getPricesByCity(b.id),
  ]);

  const lines: CompareLine[] = [];
  for (const k of ["rent", "food", "transport", "utilities"] as const) {
    const av = representativeRub(pricesA, k);
    const bv = representativeRub(pricesB, k);
    lines.push({
      key: k,
      label: LABELS[k],
      a: av,
      b: bv,
      unit: "rub",
      winner: winner(av, bv),
    });
  }
  lines.push({
    key: "difficulty",
    label: LABELS.difficulty,
    a: a.difficulty_score ?? 0,
    b: b.difficulty_score ?? 0,
    unit: "score",
    winner: winner(a.difficulty_score ?? 0, b.difficulty_score ?? 0),
  });

  const scoreA = lines.filter((l) => l.winner === "a").length;
  const scoreB = lines.filter((l) => l.winner === "b").length;

  return { a, b, lines, scoreA, scoreB };
}

// ── Текст-вывод и FAQ (генерируются из чисел сравнения, без ручного контента) ──
// Нужны для уникального контента и FAQPage-разметки на compare-страницах.

export type CompareFaqItem = { question: string; answer: string };

// Сумма денежных категорий (аренда + продукты + транспорт + ЖКХ) — «общий бюджет».
function moneySum(data: CompareResult, side: "a" | "b"): number {
  return data.lines
    .filter((l) => l.unit === "rub")
    .reduce((acc, l) => acc + (side === "a" ? l.a : l.b), 0);
}

function nameOf(data: CompareResult, side: "a" | "b"): string {
  return side === "a" ? data.a.name_ru : data.b.name_ru;
}

// Абзацы текста-вывода под таблицей (русский — основной язык трафика).
export function compareSummary(data: CompareResult): string[] {
  const { a, b } = data;
  const rent = data.lines.find((l) => l.key === "rent");
  const diff = data.lines.find((l) => l.key === "difficulty");
  const sumA = moneySum(data, "a");
  const sumB = moneySum(data, "b");
  const cheaper = sumA === sumB ? null : sumA < sumB ? a : b;
  const pricier = cheaper === a ? b : cheaper === b ? a : null;
  const diffPct =
    cheaper && pricier && Math.max(sumA, sumB) > 0
      ? Math.round((Math.abs(sumA - sumB) / Math.max(sumA, sumB)) * 100)
      : 0;

  const out: string[] = [];

  // Абзац 1 — деньги
  if (cheaper && pricier) {
    out.push(
      `По базовым расходам на месяц (аренда, продукты, транспорт и ЖКХ) ${cheaper.name_ru} выходит примерно на ${diffPct}% дешевле, чем ${pricier.name_ru}: ` +
        `${formatRub(Math.min(sumA, sumB))} против ${formatRub(Math.max(sumA, sumB))} в месяц на одного человека (ориентировочно, по курсу начала 2026 года).`,
    );
  } else {
    out.push(
      `По базовым расходам на месяц ${a.name_ru} и ${b.name_ru} сопоставимы — ориентировочно ${formatRub(sumA)} в месяц на одного человека (по курсу начала 2026 года).`,
    );
  }

  // Абзац 2 — категории + сложность + вывод
  const rentWinner =
    rent && rent.winner !== "tie" ? nameOf(data, rent.winner) : null;
  const easier =
    diff && diff.winner !== "tie" ? nameOf(data, diff.winner) : null;
  const leader =
    data.scoreA === data.scoreB
      ? null
      : data.scoreA > data.scoreB
        ? a.name_ru
        : b.name_ru;

  let p2 = "";
  if (rentWinner) p2 += `Аренда заметно доступнее в городе ${rentWinner}. `;
  if (easier) p2 += `Переехать и легализоваться обычно проще в ${easier}. `;
  if (leader) {
    p2 += `В сумме по большинству категорий выгоднее ${leader}. `;
  } else {
    p2 += `По категориям счет примерно равный — выбор зависит от приоритетов. `;
  }
  p2 += cheaper
    ? `Если на первом месте экономия — берите ${cheaper.name_ru}; если важнее простота переезда${easier ? ` — ${easier}` : ""}.`
    : `Ориентируйтесь на то, что для Вас важнее — климат, виза или сообщество.`;
  out.push(p2);

  return out;
}

// Какой город дешевле по сумме базовых расходов и на сколько процентов —
// для SEO-хука в title/h1 (Livingcost/Expatistan-стиль «X на 40% дешевле Y»).
// Возвращает null, если разница незначима (<1%). Имена городов подставляет
// вызывающий код (локализованно), здесь только сторона-победитель и процент.
export function compareDelta(
  data: CompareResult,
): { cheaper: "a" | "b"; pct: number } | null {
  const sumA = moneySum(data, "a");
  const sumB = moneySum(data, "b");
  if (sumA <= 0 || sumB <= 0 || sumA === sumB) return null;
  const hi = Math.max(sumA, sumB);
  const lo = Math.min(sumA, sumB);
  const pct = Math.round((1 - lo / hi) * 100);
  if (pct < 1) return null;
  return { cheaper: sumA < sumB ? "a" : "b", pct };
}

// Маппинг категорий сравнения на ключи фраз 2-го лица. transport здесь — это
// «проездной», поэтому ведём на key "transit" (предлог «за проездной»).
const COMPARE_TO_SPEND: Partial<Record<CompareCategory, SpendKey>> = {
  rent: "rent",
  food: "food",
  transport: "transit",
  utilities: "utilities",
};

// «Формулировки от 2-го лица» для compare-страницы: «Переехав из города A
// в город B, Вы будете платить за аренду на 25% меньше, …». Дельта по каждой
// денежной категории — насколько B относительно A (со стороны переезжающего).
// Overall — по сумме денежных категорий. Возвращает "" если нет данных.
export function compareSecondPerson(data: CompareResult): string {
  const items: SecondPersonItem[] = [];
  for (const line of data.lines) {
    if (line.unit !== "rub") continue;
    const key = COMPARE_TO_SPEND[line.key];
    if (!key) continue;
    if (line.a <= 0 || line.b <= 0) continue;
    // (b - a) / a * 100: > 0 — в B дороже, < 0 — дешевле.
    const diffPct = ((line.b - line.a) / line.a) * 100;
    items.push({ key, diffPct });
  }

  const sumA = moneySum(data, "a");
  const sumB = moneySum(data, "b");
  if (sumA <= 0 || items.length === 0) return "";
  const overallDiffPct = ((sumB - sumA) / sumA) * 100;

  return comparePhrase({
    fromName: data.a.name_ru,
    toName: data.b.name_ru,
    items,
    overallDiffPct,
  });
}

// 4 вопроса FAQ — ответы из чисел (для FAQPage rich snippet).
export function compareFaq(data: CompareResult): CompareFaqItem[] {
  const { a, b } = data;
  const rent = data.lines.find((l) => l.key === "rent");
  const diff = data.lines.find((l) => l.key === "difficulty");
  const sumA = moneySum(data, "a");
  const sumB = moneySum(data, "b");
  const cheaper = sumA === sumB ? null : sumA < sumB ? a.name_ru : b.name_ru;
  const easier =
    diff && diff.winner !== "tie" ? nameOf(data, diff.winner) : null;

  const items: CompareFaqItem[] = [];

  items.push({
    question: `Где жить дешевле — ${a.name_ru} или ${b.name_ru}?`,
    answer: cheaper
      ? `По базовым расходам (аренда, продукты, транспорт, ЖКХ) дешевле ${cheaper}: ориентировочно ${formatRub(Math.min(sumA, sumB))} против ${formatRub(Math.max(sumA, sumB))} в месяц на одного человека по курсу начала 2026 года.`
      : `Расходы в ${a.name_ru} и ${b.name_ru} сопоставимы — ориентировочно ${formatRub(sumA)} в месяц на одного человека.`,
  });

  if (rent) {
    items.push({
      question: `Сколько стоит аренда в городах ${a.name_ru} и ${b.name_ru}?`,
      answer: `Однокомнатная квартира на окраине обходится ориентировочно в ${formatRub(rent.a)} в месяц в городе ${a.name_ru} и ${formatRub(rent.b)} — в ${b.name_ru} (оценка на начало 2026 года).`,
    });
  }

  items.push({
    question: `Где проще переехать — ${a.name_ru} или ${b.name_ru}?`,
    answer: easier
      ? `Переезд и легализация обычно проще в городе ${easier} — там ниже оценка сложности по визе, банкам и адаптации. Подробности — в профилях городов.`
      : `По сложности переезда ${a.name_ru} и ${b.name_ru} близки. Смотрите визовые условия страны и наличие русскоязычного сообщества.`,
  });

  items.push({
    question: `${a.name_ru} или ${b.name_ru} — что выбрать для переезда в 2026 году?`,
    answer:
      data.scoreA === data.scoreB
        ? `Счет по категориям примерно равный. Если важнее бюджет — выбирайте более дешевый вариант${cheaper ? ` (${cheaper})` : ""}; если простота переезда${easier ? ` — ${easier}` : ""}.`
        : `По большинству категорий выгоднее ${data.scoreA > data.scoreB ? a.name_ru : b.name_ru}. Окончательный выбор зависит от приоритетов: бюджет, виза, климат и сообщество.`,
  });

  return items;
}

// Денежные категории сравнения по сторонам (rent/food/transport/utilities) —
// для калькулятора переезда A→B с составом семьи (CompareRelocation). Берем уже
// посчитанные числа из lines, не пересчитываем. difficulty не входит (это score).
export type RelocationSideBudget = {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
};

export function relocationBudgets(data: CompareResult): {
  a: RelocationSideBudget;
  b: RelocationSideBudget;
} {
  const pick = (key: CompareCategory, side: "a" | "b") => {
    const line = data.lines.find((l) => l.key === key);
    if (!line) return 0;
    return side === "a" ? line.a : line.b;
  };
  const build = (side: "a" | "b"): RelocationSideBudget => ({
    rent: pick("rent", side),
    food: pick("food", side),
    transport: pick("transport", side),
    utilities: pick("utilities", side),
  });
  return { a: build("a"), b: build("b") };
}

// Топовые города для прегенерации страниц сравнения. Полная декартова пара
// всех городов (~9700 страниц) раздувала сборку до OOM, поэтому статикой
// собираем только пары между этими городами; остальные догенерятся по запросу
// (ISR, dynamicParams=true). Список — стартовые города из ТЗ + крупные хабы.
export const TOP_COMPARE_SLUGS = [
  "tbilisi",
  "yerevan",
  "belgrade",
  "dubai",
  "bali",
  "bangkok",
  "almaty",
  "krasnodar",
  "sochi",
  "kaliningrad",
  "istanbul",
  "tashkent",
] as const;

// Канонические (a < b) пары топ-городов — для sitemap, без дублей-реверсов.
export async function topComparePairs(): Promise<string[]> {
  const { data } = await supabase.from("cities").select("slug");
  const have = new Set((data ?? []).map((c) => c.slug as string));
  const slugs = TOP_COMPARE_SLUGS.filter((s) => have.has(s)).sort();
  const out: string[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      out.push(`${slugs[i]}-vs-${slugs[j]}`);
    }
  }
  return out;
}

// Параметры для generateStaticParams: обе ориентации (a-vs-b и b-vs-a) топ-пар,
// чтобы прямые ссылки в обе стороны отдавались статикой. Остальные пары —
// on-demand. Канонизация на реверс задаётся через alternates.canonical в meta.
export async function topCompareParams(): Promise<{ pair: string }[]> {
  const { data } = await supabase.from("cities").select("slug");
  const have = new Set((data ?? []).map((c) => c.slug as string));
  const slugs = TOP_COMPARE_SLUGS.filter((s) => have.has(s));
  const out: { pair: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = 0; j < slugs.length; j++) {
      if (i === j) continue;
      out.push({ pair: pairSlug(slugs[i], slugs[j]) });
    }
  }
  return out;
}

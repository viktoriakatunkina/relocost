import { supabase } from "./supabase";
import type { Price, PriceCategory } from "./types";
import {
  vsMoscowPhrase,
  type SecondPersonItem,
  type SpendKey,
} from "./second-person";

// Сравнение цен города с Москвой — бьет в интент «насколько X дешевле Москвы».
// Базовые цены Москвы тянем один раз и кэшируем на уровне модуля: при SSG
// прегенерации сотен городов это экономит сотни запросов (один промис на сборку).

export type CompareItemKey =
  | "rent"
  | "food"
  | "lunch"
  | "transit"
  | "coffee"
  | "utilities"
  | "mobile";

type CompareSpec = {
  key: CompareItemKey;
  label: string;
  // Вес компонента в индексе — доля типичной траты релоканта на старте жизни
  // в городе (не точная статистика, а разумный ориентир: аренда и еда — самые
  // тяжелые статьи, кафе/кофе/связь — заметно легче). Сумма весов по всем
  // спекам = 1. Раньше (до 2026-10-28) все 5 позиций шли с равным весом
  // 1/5 — это преувеличивало вклад капучино и обеда в кафе (вместе 40%
  // индекса) и недооценивало аренду (тоже 20%, хотя по факту это обычно
  // самая крупная статья бюджета релоканта).
  weight: number;
  // Цена компонента из «сырых» строк prices одного города. Сначала точное
  // совпадение по имени (канонический якорь — тот же паттерн, что уже
  // использует getSimilarCities() в lib/prices.ts и ANCHOR_KEY в
  // scripts/expand-prices.mjs), затем мягкий fallback по подстроке — для
  // городов, которые не прошли через expand-prices.mjs и названы вручную
  // иначе. 0, если нет ни одного совпадения.
  price: (rows: Price[]) => number;
};

// Точное совпадение по имени — единственная позиция такого рода на город
// у большинства направлений (см. диагностику 2026-10-28 ниже).
function pickExact(rows: Price[], name: string): number {
  return rows.find((r) => r.item_name_ru === name)?.price_min ?? 0;
}

// Fallback по подстроке — ТОЛЬКО если точного совпадения нет. Детерминирован:
// сортируем совпадения по id перед выбором первого, иначе Postgres/PostgREST
// не гарантирует порядок строк между запросами (это и было корнем бага —
// см. комментарий у rent-спека).
function pickFallback(rows: Price[], needle: string): number {
  const matches = rows.filter((r) => r.item_name_ru.includes(needle));
  if (matches.length === 0) return 0;
  matches.sort((a, b) => a.id.localeCompare(b.id));
  return matches[0].price_min;
}

function pick(rows: Price[], exactName: string, fallbackNeedle: string): number {
  const exact = pickExact(rows, exactName);
  return exact > 0 ? exact : pickFallback(rows, fallbackNeedle);
}

// ── Диагностика 2026-10-28 (не переделывать смысл, только контекст) ──────────
// Баг: rent-спек искал позиции через item_name_ru.includes("окраине") без
// детерминированного порядка строк. У 7 городов (включая Москву — базу для
// ВСЕХ сравнений) в таблице prices две разных позиции аренды содержат слово
// «окраине»: напр. у Москвы — «Студия на окраине (Некрасовка/Южное Бутово,
// бюджетный формат)» И «1-комн. квартира на окраине». Какая из двух попадёт
// в .find() — не детерминировано на уровне Postgres/PostgREST. Фикс: у
// 249 из 251 города есть ОДНА позиция с точным именем «1-комн. квартира на
// окраине» (тот же якорь, что использует getSimilarCities() в lib/prices.ts) —
// матчим по нему первым делом, substring — только запасной вариант для
// Бангалора/Охрида (там якоря нет, но и дублей по подстроке тоже нет).
const COMPARE_SPECS: CompareSpec[] = [
  {
    key: "rent",
    label: "Аренда 1-комн. (окраина)",
    weight: 0.35,
    price: (rows) => pick(rows, "1-комн. квартира на окраине", "окраине"),
  },
  {
    key: "food",
    label: "Продукты на месяц",
    weight: 0.25,
    price: (rows) => pick(rows, "Продукты на месяц на 1 человека", "Продукты"),
  },
  {
    key: "transit",
    label: "Проездной на месяц",
    weight: 0.15,
    price: (rows) => pick(rows, "Месячный проездной", "проездной"),
  },
  // Новые позиции (2026-10-28) — добавлены, т.к. реально заполнены у
  // большинства городов (проверено: ЖКХ ~91% городов, мобильная связь —
  // 100%, см. диагностику), и уменьшают шум среднего на малой выборке.
  {
    key: "utilities",
    label: "ЖКХ (коммуналка)",
    weight: 0.08,
    price: (rows) => pick(rows, "ЖКХ за 1-комн. квартиру", "ЖКХ"),
  },
  {
    key: "mobile",
    label: "Мобильная связь",
    weight: 0.05,
    // Имя не всегда «(месяц)» — подстрока без суффикса покрывает оба
    // варианта и не пересекается ни с чем другим (проверено: 0 городов
    // с двойным совпадением, 251/251 покрытие).
    price: (rows) => pickFallback(rows, "Мобильная связь"),
  },
  {
    key: "lunch",
    label: "Обед в кафе",
    weight: 0.07,
    price: (rows) => pick(rows, "Обед в кафе", "Обед в кафе"),
  },
  {
    key: "coffee",
    label: "Капучино",
    weight: 0.05,
    price: (rows) => pick(rows, "Капучино", "Капучино"),
  },
];

export type MoscowBaseline = Record<CompareItemKey, number>;

let cache: Promise<MoscowBaseline | null> | null = null;

async function load(): Promise<MoscowBaseline | null> {
  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "moscow")
    .maybeSingle();
  if (!city) return null;

  // utilities — ЖКХ; communication — мобильная связь/интернет (категории
  // разъехались по данным, см. диагностику 2026-10-28). order("id") — чтобы
  // при любом fallback-совпадении строки приходили в стабильном порядке
  // (не влияет на корректность с exact-match, но делает поведение
  // предсказуемым и для этого запроса, не только для .find() внутри pick()).
  const { data: rows } = await supabase
    .from("prices")
    .select("id, item_name_ru, price_min, category")
    .eq("city_id", city.id)
    .in("category", ["rent", "food", "transport", "utilities", "communication"])
    .order("id", { ascending: true });
  if (!rows?.length) return null;

  const out = {} as MoscowBaseline;
  for (const spec of COMPARE_SPECS) {
    out[spec.key] = spec.price(rows as Price[]);
  }
  return out;
}

export function getMoscowBaseline(): Promise<MoscowBaseline | null> {
  if (!cache) cache = load();
  return cache;
}

export type MoscowCompareRow = {
  key: CompareItemKey;
  label: string;
  city: number;
  moscow: number;
  // Разница относительно Москвы: < 0 = дешевле, > 0 = дороже.
  diff: number;
};

export type MoscowComparison = {
  rows: MoscowCompareRow[];
  // Средневзвешенная разница по позициям (для заголовка/SEO-текста и индекса),
  // < 0 = в среднем дешевле. Веса — из COMPARE_SPECS, renormalized на сумму
  // весов фактически найденных позиций (если часть недоступна — остальные
  // не «размываются» нулями, а честно делят между собой 100%).
  avgDiff: number;
};

// Строит сравнение из цен города (уже загруженных на странице) и базы Москвы.
// Возвращает null, если совпало меньше 3 позиций — иначе сравнение неинформативно.
export function cityVsMoscow(
  prices: Record<PriceCategory, Price[]>,
  baseline: MoscowBaseline | null,
): MoscowComparison | null {
  if (!baseline) return null;
  const all: Price[] = [
    ...(prices.rent ?? []),
    ...(prices.food ?? []),
    ...(prices.transport ?? []),
    ...(prices.utilities ?? []),
    ...(prices.communication ?? []),
  ];
  // Детерминируем порядок перед матчингом — getPricesByCity() читает prices
  // без order(), так что без этого fallback-подстрока (pickFallback) могла бы
  // снова зависеть от порядка ответа Postgres. exact-match (основной путь)
  // от порядка не зависит в принципе.
  all.sort((a, b) => a.id.localeCompare(b.id));

  const rows: MoscowCompareRow[] = [];
  let weightSum = 0;
  let weightedDiffSum = 0;
  for (const spec of COMPARE_SPECS) {
    const city = spec.price(all);
    const moscow = baseline[spec.key];
    if (city > 0 && moscow > 0) {
      const diff = (city - moscow) / moscow;
      rows.push({ key: spec.key, label: spec.label, city, moscow, diff });
      weightSum += spec.weight;
      weightedDiffSum += spec.weight * diff;
    }
  }

  if (rows.length < 3) return null;
  const avgDiff = weightSum > 0 ? weightedDiffSum / weightSum : 0;
  return { rows, avgDiff };
}

// Маппинг повседневных позиций сравнения с Москвой на ключи фраз 2-го лица.
// utilities и mobile сознательно ведут на один SpendKey ("за коммуналку и
// связь") — это один смысловой блок трат, отдельная фраза про «мобильную
// связь» отдельно от ЖКХ звучала бы избыточно; joinItems() в second-person.ts
// и так дедуплицирует повторы по ключу.
const MOSCOW_TO_SPEND: Record<CompareItemKey, SpendKey> = {
  rent: "rent",
  food: "food",
  lunch: "lunch",
  transit: "transit",
  coffee: "coffee",
  utilities: "utilities",
  mobile: "utilities",
};

// «Формулировки от 2-го лица» для страницы города: «По сравнению с Москвой
// в Тбилиси Вы будете платить за аренду на 40% меньше, …». diff в rows — уже
// доля относительно Москвы (< 0 дешевле), переводим в проценты со знаком.
// cityIn — предложный падеж «в Тбилиси» / «на Бали». "" если нет сравнения.
export function moscowSecondPerson(
  comparison: MoscowComparison | null,
  cityInPhrase: string,
): string {
  if (!comparison) return "";
  const items: SecondPersonItem[] = comparison.rows.map((r) => ({
    key: MOSCOW_TO_SPEND[r.key],
    diffPct: r.diff * 100,
  }));
  if (items.length === 0) return "";
  return vsMoscowPhrase({
    cityIn: cityInPhrase,
    items,
    overallDiffPct: comparison.avgDiff * 100,
  });
}

// Числовой индекс стоимости жизни: Москва = 100. Город дешевле → меньше 100,
// дороже → больше 100. Узнаваемый якорь в духе Expatistan (Прага=100) и
// Numbeo (Нью-Йорк=100), но локальный — Москва понятнее рублевой аудитории.
// Считается из avgDiff (средневзвешенная относит. разница повседневных трат
// к Москве): напр. avgDiff -0.42 → индекс ~58. Для самой Москвы avgDiff=0 →
// ровно 100.
//
// Округление до ближайших 5 (2026-10-28, было — до целого): индекс считается
// по ~7 позициям «от»-цен (вилки, не чеки), так что точность ±1 пункт — это
// иллюзия, которой данные не подкрепляют. Шаг 5 честно сигнализирует «это
// оценка, не котировка» и при этом не обесценивает число — как в индексах
// типа Big Mac Index, которые не претендуют на десятые доли. 100 (Москва)
// на этот шаг ложится без округления, так что явной особой обработки для
// Москвы не нужно.
export function moscowCostIndex(avgDiff: number): number {
  const raw = (1 + avgDiff) * 100;
  return Math.max(5, Math.round(raw / 5) * 5);
}

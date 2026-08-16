// «Формулировки от 2-го лица» — best-practice MyLifeElsewhere: вместо сухого
// «дороже на N%» собираем человеческие фразы от лица читателя на «Вы» —
// «Вы будете платить за продукты на 15% меньше, а за аренду — почти вдвое
// дешевле». Эмоциональнее и вовлекает сильнее обезличенного индекса.
//
// Чистые функции без зависимостей. На вход — готовые дельты (доля или проценты),
// уже посчитанные другими модулями (moscow-baseline, compare). Здесь — только
// превращение чисел в корректный русский текст с правильным согласованием.

// Порог «примерно столько же» — в пределах ±NEUTRAL_PCT% считаем паритетом.
const NEUTRAL_PCT = 3;

// Категории трат с предлогом «за …» в винительном падеже. Ключи совпадают
// с key из moscow-baseline (CompareItemKey) и compare (CompareCategory), плюс
// агрегаты — чтобы оба места переиспользовали один словарь.
export type SpendKey =
  | "rent"
  | "food"
  | "transport"
  | "transit"
  | "utilities"
  | "cafe"
  | "lunch"
  | "coffee"
  | "housing";

// «Вы будете платить за <PREP[key]> …». Винительный падеж после «за».
const PREP: Record<SpendKey, string> = {
  rent: "за аренду",
  housing: "за жилье",
  food: "за продукты",
  transport: "за транспорт",
  transit: "за проездной",
  utilities: "за коммуналку и связь",
  cafe: "за кафе и рестораны",
  lunch: "за обед в кафе",
  coffee: "за чашку кофе",
};

export function spendPrep(key: SpendKey): string {
  return PREP[key];
}

// Направление дельты глазами читателя: дешевле / дороже / столько же.
// pct — модуль процента (>= 0). diff — знак: < 0 дешевле, > 0 дороже.
function direction(diff: number): "cheaper" | "pricier" | "same" {
  const pct = Math.abs(diff);
  if (pct < NEUTRAL_PCT) return "same";
  return diff < 0 ? "cheaper" : "pricier";
}

// Кратность из процента: +100% = вдвое дороже, -50% = вдвое дешевле.
// Возвращает «вдвое/втрое/вчетверо/впятеро» + «почти», если близко к целому.
// null — если кратность не круглая (тогда говорим обычными процентами).
const MULT_WORDS: Record<number, string> = {
  2: "вдвое",
  3: "втрое",
  4: "вчетверо",
  5: "впятеро",
};

type MultPhrase = { word: string; almost: boolean };

function multiplePhrase(diff: number): MultPhrase | null {
  const pct = Math.abs(diff);
  // Кратность относительно базы: дороже — (1 + pct/100), дешевле — 1/(1 - pct/100).
  const ratio =
    diff > 0 ? 1 + pct / 100 : pct >= 100 ? Infinity : 1 / (1 - pct / 100);
  if (!isFinite(ratio)) return null;

  for (const n of [2, 3, 4, 5]) {
    // «почти вдвое» — от 1.80; «вдвое» — 1.93..2.12; иначе пропускаем.
    const lowAlmost = n - 0.2;
    const lowExact = n - 0.07;
    const highExact = n + 0.12;
    if (ratio >= lowAlmost && ratio <= highExact) {
      return { word: MULT_WORDS[n], almost: ratio < lowExact };
    }
  }
  return null;
}

// Округление процента «по-человечески»: убираем дробь, но не теряем мелкие
// дельты (4.6% → 5%, не 0). Минимум 1%, если это не паритет.
function roundPct(diff: number): number {
  return Math.max(1, Math.round(Math.abs(diff)));
}

export type CompareWord = "дешевле" | "дороже";

// Ядро: из дельты делаем хвост фразы — «на 15% дешевле», «почти вдвое дороже»,
// «примерно столько же». diffPct — процент со знаком (-15 = на 15% дешевле).
export function deltaPhrase(diffPct: number): string {
  const dir = direction(diffPct);
  if (dir === "same") return "примерно столько же";

  const word: CompareWord = dir === "cheaper" ? "дешевле" : "дороже";

  // Сначала пробуем «кратность» — она звучит человечнее для крупных разниц.
  const mult = multiplePhrase(diffPct);
  if (mult) {
    return `${mult.almost ? "почти " : ""}${mult.word} ${word}`;
  }

  return `на ${roundPct(diffPct)}% ${word}`;
}

// Строка про одну категорию для перечисления: «за продукты — на 15% меньше».
// Внутри списка используем «меньше/больше» вместо «дешевле/дороже» — короче
// и не повторяет «платить … дешевле» в каждом пункте.
function deltaPhraseShort(diffPct: number): string {
  const dir = direction(diffPct);
  if (dir === "same") return "примерно столько же";

  const word = dir === "cheaper" ? "меньше" : "больше";
  const mult = multiplePhrase(diffPct);
  if (mult) {
    // «почти вдвое дешевле/дороже» — для краткой формы оставляем дешевле/дороже,
    // т.к. «вдвое меньше» допустимо, но «почти вдвое меньше» звучит коряво.
    const w = dir === "cheaper" ? "дешевле" : "дороже";
    return `${mult.almost ? "почти " : ""}${mult.word} ${w}`;
  }
  return `на ${roundPct(diffPct)}% ${word}`;
}

export type SecondPersonItem = {
  key: SpendKey;
  // Процент со знаком: -15 = на 15% дешевле, +20 = на 20% дороже.
  diffPct: number;
};

// Пункт перечисления. Первый пункт примыкает к «…платить за аренду на 15%
// меньше» — без тире. Остальные пункты обособляются тире: «за продукты — на
// 10% больше» — так конструкция читается естественно (как в ТЗ-примере).
export function itemPhrase(item: SecondPersonItem, withDash: boolean): string {
  const sep = withDash ? " — " : " ";
  return `${spendPrep(item.key)}${sep}${deltaPhraseShort(item.diffPct)}`;
}

// Сборка всего перечисления категорий в один связный фрагмент:
// «за аренду на 25% меньше, за продукты — на 10% больше, за транспорт —
// почти вдвое дешевле». Дедупликация ключей, паритетные пункты в конец.
export function joinItems(items: SecondPersonItem[]): string {
  const seen = new Set<SpendKey>();
  const ordered = items.filter((it) => {
    if (seen.has(it.key)) return false;
    seen.add(it.key);
    return true;
  });
  // Сначала пункты с разницей, паритетные — в хвост (они менее интересны).
  const meaningful = ordered.filter((it) => direction(it.diffPct) !== "same");
  const neutral = ordered.filter((it) => direction(it.diffPct) === "same");
  const list = [...meaningful, ...neutral];
  if (list.length === 0) return "";

  // Первый пункт без тире (примыкает к «платить»), остальные — с тире.
  const parts = list.map((it, i) => itemPhrase(it, i > 0));
  if (parts.length === 1) return parts[0];
  const head = parts.slice(0, -1).join(", ");
  const tail = parts[parts.length - 1];
  return `${head}, а ${tail}`;
}

// Итоговая фраза по общему уровню: «В целом жизнь обойдется примерно на 30%
// дешевле». overallPct — процент со знаком по сумме/средней.
export function overallPhrase(overallDiffPct: number): string {
  const dir = direction(overallDiffPct);
  if (dir === "same") {
    return "В целом уровень расходов выйдет примерно таким же";
  }
  const tail = deltaPhrase(overallDiffPct);
  return `В целом жизнь обойдется ${tail}`;
}

// ── Готовые «фабрики» для двух мест встраивания ──────────────────────────────

// Сравнение городов (страница /compare): «Переехав из A в B, Вы будете платить
// за аренду на 25% меньше, …. В целом жизнь обойдется примерно на 30% дешевле».
export function comparePhrase(opts: {
  fromName: string; // город A (откуда)
  toName: string; // город B (куда)
  items: SecondPersonItem[];
  overallDiffPct: number;
}): string {
  const list = joinItems(opts.items);
  const overall = overallPhrase(opts.overallDiffPct);
  const lead = `Переехав из города ${opts.fromName} в город ${opts.toName}, Вы будете платить ${list}.`;
  return list ? `${lead} ${overall}.` : `${overall}.`;
}

// Сравнение с Москвой (страница города): «По сравнению с Москвой в Тбилиси
// Вы будете тратить за жилье примерно на 40% меньше, …».
export function vsMoscowPhrase(opts: {
  cityIn: string; // предложный «в Тбилиси» / «на Бали»
  items: SecondPersonItem[];
  overallDiffPct: number;
}): string {
  const list = joinItems(opts.items);
  const overall = overallPhrase(opts.overallDiffPct);
  const lead = `По сравнению с Москвой ${opts.cityIn} Вы будете платить ${list}.`;
  return list ? `${lead} ${overall}.` : `${overall}.`;
}

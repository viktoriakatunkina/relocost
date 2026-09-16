// Хелпер символов валют. В БД валюта хранится строкой вида «Название, CODE»
// (например «Бат, THB», «Евро, EUR»). Здесь по ISO-коду подбираем символ и
// аккуратно собираем подпись «<символ> <Название>».
//
// Если символа для кода нет — показываем сам код (фолбэк, вёрстку не ломает).

const SYMBOLS: Record<string, string> = {
  THB: "฿", // бат
  BYN: "Br", // белорусский рубль
  KRW: "₩", // вона
  MKD: "ден", // денар
  BHD: "BD", // динар Бахрейна
  JOD: "JD", // динар Иордании
  RSD: "дин", // динар Сербии
  TND: "DT", // динар Туниса
  AED: "د.إ", // дирхам ОАЭ
  MAD: "DH", // дирхам Марокко
  VND: "₫", // донг
  AMD: "֏", // драм
  EUR: "€", // евро
  CZK: "Kč", // крона
  GEL: "₾", // лари
  BGN: "лв", // лев
  MDL: "L", // лей
  ALL: "L", // лек
  TRY: "₺", // лира
  AZN: "₼", // манат
  ARS: "$", // песо Аргентины
  MXN: "$", // песо Мексики
  PHP: "₱", // песо Филиппин
  BRL: "R$", // реал
  OMR: "﷼", // риал Омана
  QAR: "﷼", // риал Катара
  KHR: "៛", // риель
  MYR: "RM", // ринггит
  RUB: "₽", // рубль
  IDR: "Rp", // рупия Индонезии
  INR: "₹", // рупия Индии
  LKR: "₨", // рупия Шри-Ланки
  NPR: "₨", // рупия Непала
  KGS: "с", // сом
  TJS: "ЅМ", // сомони
  UZS: "сўм", // сум
  KZT: "₸", // тенге
  HUF: "Ft", // форинт
  EGP: "£", // фунт Египта
  ILS: "₪", // шекель
  CNY: "¥", // юань
  USD: "$",
};

// Из строки «Бат, THB (и доллары США)» вытащить ISO-код (THB).
function extractCode(currency: string): string | null {
  const m = currency.match(/\b([A-Z]{3})\b/);
  return m ? m[1] : null;
}

// Название валюты без кода и хвоста: «Бат, THB (и доллары США)» → «Бат».
export function currencyName(currency: string): string {
  return currency.split(",")[0].trim();
}

// Символ валюты по строке из БД. Если код неизвестен — вернём сам код, либо
// null, если кода в строке нет вовсе.
export function currencySymbol(currency: string): string | null {
  const code = extractCode(currency);
  if (!code) return null;
  return SYMBOLS[code] ?? code;
}

// Готовая подпись для плашки: «฿ Бат», «€ Евро», «₸ Тенге».
// Если символа нет — просто название.
export function currencyLabel(currency: string | null | undefined): string {
  if (!currency) return "";
  const name = currencyName(currency);
  const symbol = currencySymbol(currency);
  // Чтобы не дублировать, если символ совпал с названием (теоретически).
  return symbol && symbol !== name ? `${symbol} ${name}` : name;
}

// ─── Рублёвый эквивалент для сумм в $/€ внутри свободного текста ───────────
// Часть контента (lib/cities-content.ts: work.salary, districts[].rent)
// хранит суммы в $ и € без рублёвого ориентира, тогда как весь остальной
// сайт — в ₽. Ниже — утилита displaу-уровня: она ничего не меняет в данных,
// только дописывает «(≈ ... ₽)» сразу после найденной суммы в исходном
// тексте. Курс — фиксированный ориентир ЦБ РФ, не биржевой live-курс.

// Ориентир курса ЦБ РФ на 16.09.2026. Курс валют плавает — если данные
// показывают заметное расхождение с актуальным курсом cbr.ru, обновите
// значения здесь (и RUB_RATE_DATE) одним изменением на весь сайт.
export const RUB_RATE_DATE = "16.09.2026";
export const RUB_RATE_USD = 86;
export const RUB_RATE_EUR = 93;

const RATE_BY_SYMBOL: Record<"$" | "€", number> = {
  $: RUB_RATE_USD,
  "€": RUB_RATE_EUR,
};

export const RUB_RATE_FOOTNOTE = `Курс — ориентир ЦБ РФ на ${RUB_RATE_DATE}: 1 $ ≈ ${RUB_RATE_USD} ₽, 1 € ≈ ${RUB_RATE_EUR} ₽. Актуальный курс может отличаться.`;

function parseAmount(raw: string): number {
  return Number(raw.replace(/\s/g, ""));
}

function formatRubApprox(n: number): string {
  // Округляем до тысяч — точность до рубля здесь неуместна (это прикидка).
  const rounded = Math.round(n / 1000) * 1000;
  return new Intl.NumberFormat("ru-RU").format(rounded);
}

const NUM = "\\d[\\d\\s]*\\d|\\d";
// Суффикс: «1 500–2 500 $», «600–1 200 $», «80 $». Символ не должен
// цепляться за букву/цифру следом (чтобы не задеть код валюты вроде AED).
const SUFFIX_RE = new RegExp(`(${NUM})(\\s*[–-]\\s*(${NUM}))?\\s*([$€])(?![\\w])`, "g");
// Префикс: «$2 000–8 000», «$800».
const PREFIX_RE = new RegExp(`([$€])(${NUM})(\\s*[–-]\\s*(${NUM}))?`, "g");
// Если сразу после суммы (в пределах небольшого хвоста вроде «/мес», «нетто»,
// пробелов) уже стоит ручной рублёвый ориентир вида «(~3 500–7 000 ₽)» —
// не дублируем его своей припиской.
const NEARBY_RUB_RE = /^[^()]{0,20}\(~?\s*[\d\s–-]+\s*₽\)/;

function hasNearbyRubHint(text: string, afterIndex: number): boolean {
  return NEARBY_RUB_RE.test(text.slice(afterIndex, afterIndex + 60));
}

function rubRange(n1: string, n2: string | undefined, symbol: "$" | "€"): string {
  const rate = RATE_BY_SYMBOL[symbol];
  const lo = parseAmount(n1);
  const hi = n2 ? parseAmount(n2) : lo;
  const rubLo = formatRubApprox(Math.min(lo, hi) * rate);
  const rubHi = formatRubApprox(Math.max(lo, hi) * rate);
  return rubLo === rubHi ? rubLo : `${rubLo}–${rubHi}`;
}

/**
 * Первая найденная в тексте сумма в $/€, сконвертированная в компактную
 * строку вида «≈ 51 600–90 000 ₽» (без исходной суммы). Для мест, где место
 * ограничено (плашка аренды района) и рядом с оригиналом добавить нечего —
 * рублёвый ориентир выводится отдельной строкой. Возвращает null, если в
 * тексте нет суммы в $/€.
 */
export function firstRubEquivalent(text: string): string | null {
  if (!text) return null;
  const suffix = text.match(new RegExp(`(${NUM})(\\s*[–-]\\s*(${NUM}))?\\s*([$€])(?![\\w])`));
  if (suffix) return `≈ ${rubRange(suffix[1], suffix[3], suffix[4] as "$" | "€")} ₽`;
  const prefix = text.match(new RegExp(`([$€])(${NUM})(\\s*[–-]\\s*(${NUM}))?`));
  if (prefix) return `≈ ${rubRange(prefix[2], prefix[4], prefix[1] as "$" | "€")} ₽`;
  return null;
}

/**
 * Дописывает рублёвый эквивалент сразу после найденных в тексте сумм в $/€.
 * Исходная сумма остаётся как есть — эквивалент добавляется, а не заменяет.
 * Если рядом уже есть ручной рублёвый ориентир в скобках — не дублирует его.
 * Безопасна для текста без валютных сумм (возвращает его без изменений).
 */
export function withRubHint(text: string): string {
  if (!text) return text;
  let result = text.replace(
    SUFFIX_RE,
    (match, n1, _range, n2, symbol, offset: number, full: string) => {
      if (hasNearbyRubHint(full, offset + match.length)) return match;
      const rub = rubRange(n1, n2, symbol as "$" | "€");
      return `${match} (≈ ${rub} ₽)`;
    },
  );
  result = result.replace(
    PREFIX_RE,
    (match, symbol, n1, _range, n2, offset: number, full: string) => {
      if (hasNearbyRubHint(full, offset + match.length)) return match;
      const rub = rubRange(n1, n2, symbol as "$" | "€");
      return `${match} (≈ ${rub} ₽)`;
    },
  );
  return result;
}

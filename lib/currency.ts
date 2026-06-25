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

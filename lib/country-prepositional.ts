// Падежи стран для заголовков и SEO-текстов.
//
// Зачем: шаблоны вида «Переезд в {country}» и «Какой климат в {country}?»
// подставляли ИМЕНИТЕЛЬНЫЙ падеж из справочника названий — на выходе было
// «Переезд в Грузия», «Какой климат в Германия?» на всех 80 страницах стран
// (аудит 2026-09-07). Аналог для городов — lib/city-prepositional.ts.
//
// Полной морфологии здесь сознательно нет: таблица на 80 слагов дешевле и
// предсказуемее любой библиотеки склонений. Формы хранятся БЕЗ предлога,
// предлог подставляют хелперы ниже — «в»/«во»/«на» зависят от страны
// (на Кипре, на Мальте, во Франции), и в разных шаблонах нужны разные
// предлоги («в Грузию», но «про Грузию»).
type CountryCase = {
  /** Предложный: «в Грузии», «на Кипре». */
  prepositional: string;
  /** Винительный: «переезд в Грузию», «на Кипр». */
  accusative: string;
  /** Родительный: «города Грузии», «стоимость жизни Кипра». */
  genitive: string;
  /** Предлог направления/места: «в» (умолчание), «во» или «на». */
  prep?: "во" | "на";
};

const CASES: Record<string, CountryCase> = {
  albania: { prepositional: "Албании", accusative: "Албанию", genitive: "Албании" },
  argentina: { prepositional: "Аргентине", accusative: "Аргентину", genitive: "Аргентины" },
  armenia: { prepositional: "Армении", accusative: "Армению", genitive: "Армении" },
  australia: { prepositional: "Австралии", accusative: "Австралию", genitive: "Австралии" },
  austria: { prepositional: "Австрии", accusative: "Австрию", genitive: "Австрии" },
  azerbaijan: { prepositional: "Азербайджане", accusative: "Азербайджан", genitive: "Азербайджана" },
  bahrain: { prepositional: "Бахрейне", accusative: "Бахрейн", genitive: "Бахрейна" },
  belarus: { prepositional: "Беларуси", accusative: "Беларусь", genitive: "Беларуси" },
  belgium: { prepositional: "Бельгии", accusative: "Бельгию", genitive: "Бельгии" },
  brazil: { prepositional: "Бразилии", accusative: "Бразилию", genitive: "Бразилии" },
  bulgaria: { prepositional: "Болгарии", accusative: "Болгарию", genitive: "Болгарии" },
  cambodia: { prepositional: "Камбодже", accusative: "Камбоджу", genitive: "Камбоджи" },
  canada: { prepositional: "Канаде", accusative: "Канаду", genitive: "Канады" },
  chile: { prepositional: "Чили", accusative: "Чили", genitive: "Чили" },
  china: { prepositional: "Китае", accusative: "Китай", genitive: "Китая" },
  colombia: { prepositional: "Колумбии", accusative: "Колумбию", genitive: "Колумбии" },
  croatia: { prepositional: "Хорватии", accusative: "Хорватию", genitive: "Хорватии" },
  // Острова и островные государства — предлог «на», а не «в».
  cyprus: { prepositional: "Кипре", accusative: "Кипр", genitive: "Кипра", prep: "на" },
  "czech-republic": { prepositional: "Чехии", accusative: "Чехию", genitive: "Чехии" },
  denmark: { prepositional: "Дании", accusative: "Данию", genitive: "Дании" },
  egypt: { prepositional: "Египте", accusative: "Египет", genitive: "Египта" },
  estonia: { prepositional: "Эстонии", accusative: "Эстонию", genitive: "Эстонии" },
  finland: { prepositional: "Финляндии", accusative: "Финляндию", genitive: "Финляндии" },
  france: { prepositional: "Франции", accusative: "Францию", genitive: "Франции", prep: "во" },
  georgia: { prepositional: "Грузии", accusative: "Грузию", genitive: "Грузии" },
  germany: { prepositional: "Германии", accusative: "Германию", genitive: "Германии" },
  greece: { prepositional: "Греции", accusative: "Грецию", genitive: "Греции" },
  "hong-kong": { prepositional: "Гонконге", accusative: "Гонконг", genitive: "Гонконга" },
  hungary: { prepositional: "Венгрии", accusative: "Венгрию", genitive: "Венгрии" },
  iceland: { prepositional: "Исландии", accusative: "Исландию", genitive: "Исландии" },
  india: { prepositional: "Индии", accusative: "Индию", genitive: "Индии" },
  indonesia: { prepositional: "Индонезии", accusative: "Индонезию", genitive: "Индонезии" },
  ireland: { prepositional: "Ирландии", accusative: "Ирландию", genitive: "Ирландии" },
  israel: { prepositional: "Израиле", accusative: "Израиль", genitive: "Израиля" },
  italy: { prepositional: "Италии", accusative: "Италию", genitive: "Италии" },
  japan: { prepositional: "Японии", accusative: "Японию", genitive: "Японии" },
  jordan: { prepositional: "Иордании", accusative: "Иорданию", genitive: "Иордании" },
  kazakhstan: { prepositional: "Казахстане", accusative: "Казахстан", genitive: "Казахстана" },
  kenya: { prepositional: "Кении", accusative: "Кению", genitive: "Кении" },
  kyrgyzstan: { prepositional: "Кыргызстане", accusative: "Кыргызстан", genitive: "Кыргызстана" },
  latvia: { prepositional: "Латвии", accusative: "Латвию", genitive: "Латвии" },
  lithuania: { prepositional: "Литве", accusative: "Литву", genitive: "Литвы" },
  malaysia: { prepositional: "Малайзии", accusative: "Малайзию", genitive: "Малайзии" },
  malta: { prepositional: "Мальте", accusative: "Мальту", genitive: "Мальты", prep: "на" },
  mexico: { prepositional: "Мексике", accusative: "Мексику", genitive: "Мексики" },
  moldova: { prepositional: "Молдове", accusative: "Молдову", genitive: "Молдовы" },
  montenegro: { prepositional: "Черногории", accusative: "Черногорию", genitive: "Черногории" },
  // Несклоняемые.
  morocco: { prepositional: "Марокко", accusative: "Марокко", genitive: "Марокко" },
  nepal: { prepositional: "Непале", accusative: "Непал", genitive: "Непала" },
  netherlands: { prepositional: "Нидерландах", accusative: "Нидерланды", genitive: "Нидерландов" },
  "north-macedonia": {
    prepositional: "Северной Македонии",
    accusative: "Северную Македонию",
    genitive: "Северной Македонии",
  },
  oman: { prepositional: "Омане", accusative: "Оман", genitive: "Омана" },
  peru: { prepositional: "Перу", accusative: "Перу", genitive: "Перу" },
  philippines: {
    prepositional: "Филиппинах",
    accusative: "Филиппины",
    genitive: "Филиппин",
    prep: "на",
  },
  poland: { prepositional: "Польше", accusative: "Польшу", genitive: "Польши" },
  portugal: { prepositional: "Португалии", accusative: "Португалию", genitive: "Португалии" },
  qatar: { prepositional: "Катаре", accusative: "Катар", genitive: "Катара" },
  romania: { prepositional: "Румынии", accusative: "Румынию", genitive: "Румынии" },
  russia: { prepositional: "России", accusative: "Россию", genitive: "России" },
  serbia: { prepositional: "Сербии", accusative: "Сербию", genitive: "Сербии" },
  singapore: { prepositional: "Сингапуре", accusative: "Сингапур", genitive: "Сингапура" },
  slovakia: { prepositional: "Словакии", accusative: "Словакию", genitive: "Словакии" },
  slovenia: { prepositional: "Словении", accusative: "Словению", genitive: "Словении" },
  "south-africa": { prepositional: "ЮАР", accusative: "ЮАР", genitive: "ЮАР" },
  "south-korea": {
    prepositional: "Южной Корее",
    accusative: "Южную Корею",
    genitive: "Южной Кореи",
  },
  spain: { prepositional: "Испании", accusative: "Испанию", genitive: "Испании" },
  "sri-lanka": {
    prepositional: "Шри-Ланке",
    accusative: "Шри-Ланку",
    genitive: "Шри-Ланки",
    prep: "на",
  },
  sweden: { prepositional: "Швеции", accusative: "Швецию", genitive: "Швеции" },
  switzerland: { prepositional: "Швейцарии", accusative: "Швейцарию", genitive: "Швейцарии" },
  taiwan: { prepositional: "Тайване", accusative: "Тайвань", genitive: "Тайваня", prep: "на" },
  tajikistan: { prepositional: "Таджикистане", accusative: "Таджикистан", genitive: "Таджикистана" },
  thailand: { prepositional: "Таиланде", accusative: "Таиланд", genitive: "Таиланда" },
  tunisia: { prepositional: "Тунисе", accusative: "Тунис", genitive: "Туниса" },
  turkey: { prepositional: "Турции", accusative: "Турцию", genitive: "Турции" },
  uae: { prepositional: "ОАЭ", accusative: "ОАЭ", genitive: "ОАЭ" },
  "united-kingdom": {
    prepositional: "Великобритании",
    accusative: "Великобританию",
    genitive: "Великобритании",
  },
  uruguay: { prepositional: "Уругвае", accusative: "Уругвай", genitive: "Уругвая" },
  usa: { prepositional: "США", accusative: "США", genitive: "США" },
  uzbekistan: { prepositional: "Узбекистане", accusative: "Узбекистан", genitive: "Узбекистана" },
  vietnam: { prepositional: "Вьетнаме", accusative: "Вьетнам", genitive: "Вьетнама", prep: "во" },
};

function prepOf(slug: string): string {
  return CASES[slug]?.prep ?? "в";
}

/** «в Грузии», «на Кипре» — где, предложный падеж с предлогом. */
export function countryIn(slug: string, nameRu: string): string {
  const c = CASES[slug];
  return c ? `${prepOf(slug)} ${c.prepositional}` : `в ${nameRu}`;
}

/** «в Грузию», «на Кипр» — куда, винительный падеж с предлогом. */
export function countryTo(slug: string, nameRu: string): string {
  const c = CASES[slug];
  return c ? `${prepOf(slug)} ${c.accusative}` : `в ${nameRu}`;
}

/** «Грузии», «Кипра» — родительный падеж без предлога («города Грузии»). */
export function countryOf(slug: string, nameRu: string): string {
  return CASES[slug]?.genitive ?? nameRu;
}

/** «Грузию», «Кипр» — винительный БЕЗ предлога («вопросы про Грузию»). */
export function countryAccusative(slug: string, nameRu: string): string {
  return CASES[slug]?.accusative ?? nameRu;
}

/** Есть ли слаг в словаре — для тестов покрытия каталога. */
export function hasCountryCases(slug: string): boolean {
  return slug in CASES;
}

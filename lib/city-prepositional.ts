// Предложный падеж города с предлогом («в Тбилиси», «на Бали») для заголовков
// и SEO-текстов. Слаги — острова/территории берут «на», остальные «в».
const PREP: Record<string, string> = {
  tbilisi: "в Тбилиси",
  yerevan: "в Ереване",
  belgrade: "в Белграде",
  dubai: "в Дубае",
  bali: "на Бали",
  bangkok: "в Бангкоке",
  almaty: "в Алматы",
  krasnodar: "в Краснодаре",
  sochi: "в Сочи",
  moscow: "в Москве",
  spb: "в Санкт-Петербурге",
  istanbul: "в Стамбуле",
  alanya: "в Алании",
  limassol: "в Лимассоле",
  budapest: "в Будапеште",
  lisbon: "в Лиссабоне",
  kaliningrad: "в Калининграде",
  bishkek: "в Бишкеке",
  tashkent: "в Ташкенте",
  minsk: "в Минске",
  podgorica: "в Подгорице",
  batumi: "в Батуми",
  antalya: "в Анталье",
  phuket: "на Пхукете",
  kutaisi: "в Кутаиси",
  budva: "в Будве",
  sofia: "в Софии",
  varna: "в Варне",
  athens: "в Афинах",
  valencia: "в Валенсии",
  nicosia: "в Никосии",
  paphos: "в Пафосе",
  dubrovnik: "в Дубровнике",
  barcelona: "в Барселоне",
  prague: "в Праге",
  goa: "на Гоа",
  "chiang-mai": "в Чиангмае",
  "ho-chi-minh": "в Хошимине",
  "nha-trang": "в Нячанге",
  "da-nang": "в Дананге",
  "kuala-lumpur": "в Куала-Лумпуре",
  "tel-aviv": "в Тель-Авиве",
  astana: "в Астане",
  izmir: "в Измире",
  porto: "в Порту",
  malaga: "в Малаге",
  samarkand: "в Самарканде",
  pattaya: "в Паттайе",
  penang: "в Пенанге",
  "abu-dhabi": "в Абу-Даби",
  bukhara: "в Бухаре",
  baku: "в Баку",
  samui: "на Самуи",
  bodrum: "в Бодруме",
  tirana: "в Тиране",
  chisinau: "в Кишиневе",
  dushanbe: "в Душанбе",
  colombo: "в Коломбо",
  hanoi: "в Ханое",
  larnaca: "в Ларнаке",
  heraklion: "в Ираклионе",
  alicante: "в Аликанте",
  fethiye: "в Фетхие",
  tivat: "в Тивате",
  doha: "в Дохе",
  cebu: "на Себу",
  split: "в Сплите",
  thessaloniki: "в Салониках",
  aktau: "в Актау",
  muscat: "в Маскате",
  manama: "в Манаме",
  "phnom-penh": "в Пномпене",
  sanya: "в Санье",
  seoul: "в Сеуле",
  sharjah: "в Шардже",
  madrid: "в Мадриде",
  jakarta: "в Джакарте",
  "phu-quoc": "на Фукуоке",
  krabi: "в Краби",
  hurghada: "в Хургаде",
  "sharm-el-sheikh": "в Шарм-эль-Шейхе",
  cairo: "в Каире",
  marrakesh: "в Марракеше",
  sousse: "в Сусе",
  "mexico-city": "в Мехико",
  "playa-del-carmen": "в Плая-дель-Кармен",
  "buenos-aires": "в Буэнос-Айресе",
  "rio-de-janeiro": "в Рио-де-Жанейро",
  amman: "в Аммане",
  haifa: "в Хайфе",
  manila: "в Маниле",
  kathmandu: "в Катманду",
  "siem-reap": "в Сием-Реапе",
  seville: "в Севилье",
  ankara: "в Анкаре",
  skopje: "в Скопье",
  kazan: "в Казани",
  yekaterinburg: "в Екатеринбурге",
  gyumri: "в Гюмри",
  // Добор до полного покрытия каталога (175 городов), 2026-09-07: раньше
  // словарь закрывал 99 слагов, остальные 76 уходили в фолбэк «в <Название>»
  // — то есть в именительном падеже («в Гамбург», «в Ницца», «в Флоренция»).
  adelaide: "в Аделаиде",
  amsterdam: "в Амстердаме",
  bangalore: "в Бангалоре",
  berlin: "в Берлине",
  bogota: "в Боготе",
  bratislava: "в Братиславе",
  brussels: "в Брюсселе",
  bucharest: "в Бухаресте",
  "cape-town": "в Кейптауне",
  casablanca: "в Касабланке",
  chennai: "в Ченнаи",
  chiangmai: "в Чиангмае",
  cologne: "в Кельне",
  copenhagen: "в Копенгагене",
  delhi: "в Дели",
  dublin: "в Дублине",
  dusseldorf: "в Дюссельдорфе",
  florence: "во Флоренции",
  frankfurt: "во Франкфурте",
  funchal: "в Фуншале",
  gdansk: "в Гданьске",
  geneva: "в Женеве",
  hamburg: "в Гамбурге",
  helsinki: "в Хельсинки",
  "herceg-novi": "в Херцег-Нови",
  "hong-kong": "в Гонконге",
  johannesburg: "в Йоханнесбурге",
  krakow: "в Кракове",
  lima: "в Лиме",
  ljubljana: "в Любляне",
  lombok: "на Ломбоке",
  london: "в Лондоне",
  "los-angeles": "в Лос-Анджелесе",
  lyon: "в Лионе",
  medan: "в Медане",
  medellin: "в Медельине",
  melbourne: "в Мельбурне",
  merida: "в Мериде",
  miami: "в Майами",
  milan: "в Милане",
  montevideo: "в Монтевидео",
  montreal: "в Монреале",
  mumbai: "в Мумбаи",
  munich: "в Мюнхене",
  nairobi: "в Найроби",
  naples: "в Неаполе",
  "new-york": "в Нью-Йорке",
  nice: "в Ницце",
  ohrid: "в Охриде",
  osaka: "в Осаке",
  paris: "в Париже",
  pondicherry: "в Пондичерри",
  reykjavik: "в Рейкьявике",
  riga: "в Риге",
  rome: "в Риме",
  santiago: "в Сантьяго",
  seminyak: "в Семиньяке",
  singapore: "в Сингапуре",
  stockholm: "в Стокгольме",
  sydney: "в Сиднее",
  taipei: "в Тайбэе",
  tallinn: "в Таллине",
  tenerife: "на Тенерифе",
  tokyo: "в Токио",
  toronto: "в Торонто",
  tulum: "в Тулуме",
  ubud: "в Убуде",
  valletta: "в Валлетте",
  vancouver: "в Ванкувере",
  vienna: "в Вене",
  vilnius: "в Вильнюсе",
  warsaw: "в Варшаве",
  wroclaw: "во Вроцлаве",
  yogyakarta: "в Джокьякарте",
  zagreb: "в Загребе",
  zurich: "в Цюрихе",
};

// «в Тбилиси» / «на Бали». Фоллбэк для незаполненных слагов — «в <Название>».
export function cityIn(slug: string, nameRu: string): string {
  return PREP[slug] ?? `в ${nameRu}`;
}

// Винительный падеж («переехать в Тбилиси», «переехать в Краков», «переехать
// в Аланию») — 2026-09-15, техSEO-аудит: CityDynamicFAQ передавал сырое
// (именительное) название и туда, где по смыслу нужен предложный («стоимость
// жизни в X»), и туда, где нужен винительный («переехать в X») — предложный
// объединили с cityIn(), для винительного понадобилась отдельная форма,
// потому что для существительных женского рода на -а/-я эти падежи не
// совпадают («в Кракове», но «в Тирану», не «в Тиране»).
//
// Полной морфологии сознательно нет — тот же принцип, что и в
// lib/country-prepositional.ts: для абсолютного большинства названий (не
// оканчивающихся на -а/-я — мужской/средний род, несклоняемые, множественное
// число) винительный падеж географического названия совпадает с именительным
// («переехать в Тбилиси», «переехать в Лондон», «переехать в Дели»). Отличается
// только женский род на -а/-я: -а → -у, -я → -ю («Москва» → «Москву», «Анталья»
// → «Анталью»). Предлог берём из PREP (у некоторых городов там «на»/«во»,
// одинаковый предлог для обоих падежей — «во Флоренцию», «на Бали»).
//
// Единственное исключение из правила «-а → -у» в каталоге — «Гоа»: как и
// «Самоа», не склоняется («поехать на Гоа», не «на Гою»).
const ACCUSATIVE_EXCEPTIONS: Record<string, string> = {
  Гоа: "Гоа",
};

function toAccusative(nameRu: string): string {
  if (ACCUSATIVE_EXCEPTIONS[nameRu]) return ACCUSATIVE_EXCEPTIONS[nameRu];
  if (nameRu.endsWith("а")) return `${nameRu.slice(0, -1)}у`;
  if (nameRu.endsWith("я")) return `${nameRu.slice(0, -1)}ю`;
  return nameRu;
}

// «в Тбилиси», «на Бали», «в Тирану» — куда, винительный падеж с предлогом.
// Фоллбэк для незаполненных слагов — «в <Название>» (без склонения, как и у
// cityIn — лучше не угадывать род/тип склонения незнакомого названия).
export function cityTo(slug: string, nameRu: string): string {
  const known = PREP[slug];
  if (!known) return `в ${nameRu}`;
  const prep = known.split(" ")[0];
  return `${prep} ${toAccusative(nameRu)}`;
}

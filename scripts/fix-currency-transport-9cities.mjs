// Два независимых бага, обнаруженных при севе строки "1-комн. квартира на
// окраине" для 22 городов (fix-missing-outskirts-rent.mjs, коммит 1019e98).
//
// === БАГ 1 — 4 города считаются в сырой местной валюте, не в рублях ===
// Богота (COP), Найроби (KES), Рейкьявик (ISK), Сантьяго (CLP) — ВСЕ строки
// prices (кроме новой "1-комн. квартира на окраине", добавленной 07.09.2026
// уже корректно в рублях) — тот же класс бага, что чинили для Братиславы/
// Рио/Саньи (fix-bratislava-prices.mjs/fix-rio-prices.mjs/fix-sanya-prices.mjs):
// сырые числа в локальной валюте, выданные как рубли. Из-за этого после
// добавления корректной строки аренды monthly_from стал абсурден (Богота
// 557 500₽ = 27500(rent, RUB) + 400000(food, COP как RUB) + 100000(transport,
// COP как RUB) + 30000(utilities/Мобильная, COP как RUB); Сантьяго 227 000₽ —
// та же арифметика на CLP).
//
// ПРОВЕРКА КЛАССИФИКАЦИИ (WebSearch, 7 сентября 2026): для каждого города
// пересчитаны ВСЕ 20 старых строк (кроме уже исправленной аренды на окраине)
// по курсу и сверены с реальными ценами (Numbeo/полевые данные):
//   - Богота: кофе 5000-10000 COP → 138-276₽ (реал. цена чашки кофе в Боготе
//     ~$1.4-2.8) — совпадает; аренда 1BR в центре 2-3.5М COP → 55-96.5к₽
//     (~$640-1120) — совпадает с Numbeo Bogota.
//   - Найроби: аренда 1BR в центре 50-80к KES → 33.3-53.3к₽ (~$387-620) —
//     совпадает с Numbeo Nairobi; бензин 180-210 KES/л → 120-140₽/л (~$1.4-1.6)
//     — совпадает с реальной ценой бензина в Кении.
//   - Рейкьявик: Sky Lagoon 9000-14000 ISK → 6300-9800₽ (~$74-114) — почти
//     точное совпадение с реальным прайсом Sky Lagoon (от 11490 ISK); кино
//     2000-3000 ISK → 1400-2100₽ (~$16.5-24.5) — совпадает с ценой билета в
//     кино в Исландии (2190-2690 ISK).
//   - Сантьяго: кино 4000-7000 CLP → 370-645₽ (~$4.3-7.5) — совпадает с ценой
//     билета в кино в Чили; бензин 1100-1300 CLP/л → ~$1.2-1.4/л — совпадает
//     с ценой бензина в Чили.
// Во всех 4 городах — 100% старых строк (20 из 20 каждая) оказались в сырой
// местной валюте, ни одна не была уже в рублях.
//
// КУРСЫ (кросс-расчёт через USD, ЦБ РФ USD=86,19₽ на 08.09.2026, курс валюты
// к USD — WebSearch/xe.com/investing.com/tradingeconomics 5-7.09.2026,
// сверено с независимым direct-конвертером там, где он был доступен):
//   COP: 1 USD = 3126,08 COP → 1 COP = 86,19/3126,08 = 0,02757₽ ≈ 0,0276₽
//        (сверено: pluang.com даёт 0,027444₽ — расхождение <1%)
//   KES: 1 USD = 129,40 KES → 1 KES = 86,19/129,40 = 0,6659₽ ≈ 0,666₽
//        (сверено: calc.ru даёт 0,66₽)
//   ISK: 1 ISK = 0,0082496 USD (Wise/pluang, 05.09.2026) → 1 ISK =
//        0,0082496×86,19 = 0,711₽; независимые конвертеры (investing.com,
//        wise.com) дают разброс 0,65-0,71₽ — взято среднее 0,70₽
//   CLP: 1 USD = 933,58 CLP → 1 CLP = 86,19/933,58 = 0,0923₽
//        (сверено: calc.ru даёт 0,092034₽ — почти точное совпадение)
//
// РЕШЕНИЕ: PATCH каждой из 20 старых строк на 4 города (80 строк) — конечные
// значения в рублях зашиты явно (не пересчитываются на лету из текущего
// значения в БД), поэтому повторный запуск скрипта идемпотентен: он просто
// ещё раз проставит те же самые числа, а не сконвертирует уже
// сконвертированное повторно.
//
// ВАЖНО — НЕ трогаем (осознанно, вне рамок этой задачи):
//   1) Наименования категорий utilities у Боготы/Сантьяго/Найроби —
//      "Коммунальные услуги"/"Интернет 100 Мбит/с" НЕ содержат подстроки
//      "ЖКХ"/"Домашний", которые ищет lib/city-budget.ts, поэтому в
//      monthly_from эти две позиции не учитываются вообще (только
//      "Мобильная связь" совпадает). Это тот же класс проблемы, что был
//      найден и исправлен у Братиславы (см. fix-bratislava-prices.mjs) —
//      здесь он НЕ исправляется, это отдельная будущая задача.
//   2) Дублирующиеся по смыслу строки ренты ("Аренда 1-комн. вне центра" vs
//      каноническая "1-комн. квартира на окраине") — тоже осознанно
//      оставлены как есть (см. комментарий в fix-missing-outskirts-rent.mjs),
//      здесь только конвертируется их валюта, дедупликация не выполняется.
//
// === БАГ 2 — 5 городов без строки транспорта "проездной" ===
// Ломбок, Пондичерри, Семиньяк, Убуд, Чианг Май — уже в рублях, но нет ни
// одной строки категории transport со словом "проездной" (только мотоскутер/
// такси Grab/бензин) — lib/city-budget.ts ищет buildget.find("проездной") и
// получает 0, поэтому monthly_from занижен ровно на стоимость общественного
// транспорта.
//
// В этих 5 городах формального единого проездного НЕ существует физически
// (WebSearch, 7 сентября 2026):
//   - Ломбок: бемо (маршрутки) без расписания, "уезжают когда заполнятся",
//     5000-15000 IDR/поездка (wewillnomad.com, lomboq.com).
//   - Пондичерри: своей отдельной месячной карты PRTC на локальные автобусы
//     в открытых источниках не найдено; для сопоставимого по масштабу
//     Ченнаи (MTC) месячный проездной "Gold" стоит 1000₹ — Пондичерри
//     значительно меньше и с гораздо более скромной сетью, взята
//     консервативная оценка ниже ченнайской.
//   - Семиньяк/Убуд (Бали): Trans Sarbagita (единственный настоящий гос.
//     автобус) НЕ обслуживает ни Семиньяк толком, ни тем более Убуд
//     (маршрут заканчивается у Батубулан, en.wikipedia.org/Trans_Sarbagita,
//     thewonderspace.com) — де-факто общественного транспорта в привычном
//     смысле нет, основной транспорт — аренда скутера/Grab (уже отдельные
//     строки). Kura-Kura Bus — туристический шаттл ($7-10/поездка), для
//     ежемесячного использования непригоден по цене.
//   - Чианг Май: RTC City Bus, плоский тариф 50 THB/поездка (báht), никакого
//     официального месячного абонемента не существует (только 1-дневная/
//     3-дневная турkarta, chiangmaitraveller.com, tripadvisor.com).
// Оценка — ОЦЕНОЧНО, скромная сумма за нерегулярное использование того, что
// физически существует (не выдумываем "полноценный проездной" там, где
// системы просто нет), с пометкой прямо в названии строки.
//
// Курсы (кросс-расчёт через USD=86,19₽, 07-08.09.2026):
//   IDR: 1 USD = 17631 IDR → 1 IDR = 86,19/17631 = 0,004888₽
//   INR: 1 USD = 94,45 INR → 1 INR = 86,19/94,45 = 0,9126₽
//   THB: 1 USD = 32,92 THB → 1 THB = 86,19/32,92 = 2,618₽
//
// Запуск теста (Богота + Убуд):  node scripts/fix-currency-transport-9cities.mjs
// Запуск на всех 9 городах:      node scripts/fix-currency-transport-9cities.mjs --all
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

async function fetchWithTimeout(url, opts = {}, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(t);
  }
}

async function withRetry(label, fn, tries = 4, baseDelay = 8000) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      console.error(`${label} attempt ${i + 1}/${tries} failed: ${e.message}`);
      if (i === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, baseDelay));
    }
  }
}

// ============================================================
// БАГ 1 — конвертация валюты (PATCH по id, значения зашиты явно)
// ============================================================

const CURRENCY_FIX = {
  bogota: {
    city_id: "88ddf032-5f20-488a-9d04-eaa8bb05504d",
    rate_note: "COP × 0,0276 ₽ (кросс-курс через USD, 07-08.09.2026)",
    rows: [
      ["d138fbd4-be0b-49ac-9236-8230192bb2b6", "Кофе", 140, 280],
      ["d04c008e-3299-489a-b316-3dd9c2771cd9", "Кино", 420, 690],
      ["363f50b2-d8fb-4b86-b1fc-c691f73b74a5", "Музей Золота (вход)", 110, 110],
      ["c5ffd2f5-865a-4772-b558-404bbd62f656", "Ресторан на двоих", 2200, 5500],
      ["36b66812-151e-465d-ac65-77cfefd0e631", "Тур в Картахену (автобус)", 2200, 4150],
      ["8ce5ed53-9872-402a-820d-a260f722e980", "Арепа (уличная еда)", 80, 165],
      ["ec08f961-3dc0-452e-9356-07e7f2f54f10", "Бизнес-ланч", 415, 830],
      ["e046770d-73ea-4c8d-9df6-9e827baa2121", "Обед в кафе", 415, 830],
      ["747953b5-b4d3-4245-b6ee-98fa90b7055f", "Продукты на месяц", 11000, 19300],
      ["79e0f6c4-193a-4851-9af4-3373f679ca04", "Фитнес-клуб/мес", 2200, 5500],
      ["b5a807df-e6c9-4283-97ad-6519cdb2b227", "Аренда 1-комн. в центре", 55000, 96500],
      ["9d3bd283-7673-494b-912e-0b37e73ae116", "Аренда 1-комн. вне центра", 33000, 60700],
      ["c6c946e7-f22b-4224-a0ea-10dd7894f5b8", "Аренда 2-комн. в центре", 82800, 151800],
      ["470f68f8-3c7b-418b-8b45-3d178b11a587", "Аренда комнаты", 16500, 33100],
      ["8a3fa6e9-be6b-46b4-8842-b670de5157d3", "Бензин 1 л", 300, 360],
      ["41c967c4-1a34-4548-8e31-777036284108", "Месячный проездной (TransMilenio)", 2750, 3600],
      ["e50d196f-7073-4e64-bdca-2a6305afa05d", "Такси 5 км", 330, 610],
      ["5519494f-4a33-457c-aee1-240403db13d4", "Интернет 100 Мбит/с", 2200, 4150],
      ["2aa341a3-c6ef-4a2c-bda4-2260a5c95114", "Коммунальные услуги", 4150, 8300],
      ["d50c8207-c6f8-4cb7-a90b-5ac69e5ce99e", "Мобильная связь", 830, 1930],
    ],
  },
  nairobi: {
    city_id: "68870db0-76eb-4bc6-b2e1-8be5e124bb15",
    rate_note: "KES × 0,666 ₽ (кросс-курс через USD, 07-08.09.2026)",
    rows: [
      ["893bf76d-d394-41a6-9493-5366c3da2594", "Кофе", 130, 265],
      ["f36c2d55-f3e1-4e7e-8c56-4e4f655d613e", "Кино", 530, 800],
      ["c7d8cc30-13ed-4a33-bee8-48f3810e3749", "Нац. парк Найроби (вход)", 3300, 4000],
      ["c71dcf1d-cf67-44bd-9fb5-7dca011226ea", "Ресторан на двоих", 2000, 5300],
      ["124b5694-1731-42d2-b843-d8bf760c2b76", "Сафари (1 день)", 13300, 40000],
      ["ec4f9782-9ce6-4d3c-ba52-035b0019fab5", "Бизнес-ланч", 465, 1000],
      ["9ec08539-fac3-4739-a9dc-be10112f2927", "Обед в кафе", 330, 665],
      ["04e80941-7d0a-43fa-914d-a2b92c00bcc1", "Продукты на месяц", 10000, 16650],
      ["189f0358-c180-4b76-a53c-2c1121a14910", "Угали с мясом (уличная еда)", 200, 400],
      ["98a3a057-d9e3-4069-9ea8-7fdc9eba07d4", "Фитнес-клуб/мес", 3300, 8000],
      ["e1320f61-65ac-4895-9be6-24de1c325131", "Аренда 1-комн. в центре", 33300, 53300],
      ["e5bec0ba-3603-4b56-a0b0-d19129322ef5", "Аренда 1-комн. вне центра", 20000, 33300],
      ["337014e5-28aa-4fc6-b98f-059cabda68ee", "Аренда 2-комн. в центре", 53300, 86600],
      ["557df3de-2eb2-46ae-911a-404c5785170f", "Аренда комнаты", 10000, 18650],
      ["de0f71f9-022c-4fc6-8aba-af2fd90aab2d", "Бензин 1 л", 120, 140],
      ["7579de2d-3764-492c-a49e-87c890b6117b", "Месячный проездной", 2000, 3300],
      ["950fe905-cb07-455c-9a2b-7afaf8848e84", "Такси 5 км", 400, 800],
      ["e8b9c119-cea1-40b4-af2a-7b83eb198929", "Интернет 100 Мбит/с", 2000, 3300],
      ["cf906582-f6f0-4251-bf5c-e9048f3a90d7", "Коммунальные услуги", 3300, 6650],
      ["b0a6db56-1594-4ec4-af22-345d7f455446", "Мобильная связь", 665, 1665],
    ],
  },
  reykjavik: {
    city_id: "8e9d098b-4d28-408f-9d6d-d684f54ad256",
    rate_note: "ISK × 0,70 ₽ (среднее из независимых источников 0,65-0,71 ₽, 07.09.2026)",
    rows: [
      ["16429f71-5859-4f99-be08-10a0a65302e5", "Кофе", 420, 770],
      ["bd3055ba-1e91-4753-b73a-7774607ddece", "Геотермальная купальня (Sky Lagoon)", 6300, 9800],
      ["a21f8917-6714-481f-bc9c-b67cadae896c", "Кино", 1400, 2100],
      ["9b5d12dc-e4b1-4aaa-b8fb-e1f4569dc0d6", "Ресторан на двоих", 9800, 24500],
      ["f44a9386-d090-429a-a9a9-2583dc11b968", "Северное сияние тур", 8400, 17500],
      ["508c1872-8812-4a1d-822f-de73d79cf476", "Бизнес-ланч", 2100, 3850],
      ["94f32bbc-5dd1-44fc-85c8-95673c365aff", "Обед в кафе", 1750, 3150],
      ["bce4823e-1a32-4548-bda0-23072474c95a", "Продукты на месяц", 56000, 91000],
      ["266198b9-212b-476d-939a-a363bdb07725", "Скир (исландский йогурт)", 140, 280],
      ["58737ed3-2ffc-4254-a970-ace9265094ef", "Фитнес-клуб/мес", 5600, 11200],
      ["a1324523-8153-49ae-9c04-6dad914b9f58", "Аренда 1-комн. в центре", 154000, 224000],
      ["0d8b37fa-8d99-4ff7-85ee-741ca3635050", "Аренда 1-комн. вне центра", 119000, 175000],
      ["16804873-3ee3-45fa-84f0-daf052c1425a", "Аренда 2-комн. в центре", 224000, 336000],
      ["560b8e6a-3466-4436-8165-3c68742828b5", "Аренда комнаты", 56000, 98000],
      ["10cea3ac-757f-47cd-9677-719efb723356", "Бензин 1 л", 210, 245],
      ["373d8456-3996-4216-9dbc-3e417c2fa978", "Месячный проездной Streto", 7000, 8400],
      ["ea19af31-5db4-4c54-af18-c015577b3d1e", "Такси 5 км", 2100, 3850],
      ["4ffacecf-f657-4fb1-a561-6ccc5a2d4700", "Интернет 1 Гбит/с", 3500, 6300],
      ["cc9251aa-678e-4666-8365-0438eae44769", "Коммунальные услуги", 10500, 17500],
      ["f61700dc-d5c0-477b-bd0f-c1f81366a106", "Мобильная связь", 2100, 4900],
    ],
  },
  santiago: {
    city_id: "9373f38e-1d72-4740-bd34-ec385e1ae291",
    rate_note: "CLP × 0,0923 ₽ (кросс-курс через USD, 07-08.09.2026)",
    rows: [
      ["eb6cfb08-5bb3-495a-9379-f98e2c01f076", "Кофе", 140, 275],
      ["69f9a42f-edad-4b78-bdf5-c99858208b02", "Горнолыжный курорт (день)", 4600, 9200],
      ["e09458ba-88fb-49ae-803b-9ca643101020", "Кино", 370, 645],
      ["5a95040f-47b4-4883-abd7-09e796030b41", "Ресторан на двоих", 2750, 7400],
      ["da5ea333-d6d8-4ea7-8f7e-e918db5eee03", "Тур в Вальпараисо", 1400, 3700],
      ["a3dd22dc-dd95-481c-8e3a-a58a34ce462b", "Бизнес-ланч", 550, 1100],
      ["6eacadc2-190c-4a01-8f4a-6073e9f60179", "Обед в кафе", 460, 830],
      ["3905baf8-e31c-4125-b99f-423d1d4b5826", "Продукты на месяц", 13800, 23000],
      ["c58f3769-6d95-444c-80c6-cd887da958a6", "Чилийское вино (бутылка)", 460, 1400],
      ["eb4215f4-b74c-4ac1-894a-fe254ca15913", "Фитнес-клуб/мес", 2300, 5500],
      ["7d82d657-1ab9-404a-946b-ff3ce046eb72", "Аренда 1-комн. в центре", 55400, 83000],
      ["c55510e9-cd1c-442a-a2a0-78a71b3b760c", "Аренда 1-комн. вне центра", 41500, 60000],
      ["e97f39d0-ad51-403f-943b-3172914e0061", "Аренда 2-комн. в центре", 83000, 129200],
      ["a9ea834a-8488-4182-bb0e-c8026f491b6c", "Аренда комнаты", 23000, 36900],
      ["52a1bad5-2427-412a-bb4f-a52a10becc03", "Бензин 1 л", 100, 120],
      ["e7e6b6ee-9a15-482c-a680-d3f526e788b7", "Месячный проездной", 3700, 4150],
      ["aa823de2-621e-4594-87a5-64192bea7635", "Такси 5 км", 460, 830],
      ["de2483c6-1c34-4cfb-9168-77369cd6f4a5", "Интернет 100 Мбит/с", 1850, 3230],
      ["7b9ed322-db12-4fe3-adbb-9e84f677121a", "Коммунальные услуги", 5500, 9200],
      ["e05e7156-5287-4808-99b1-a2a4e1df77b1", "Мобильная связь", 920, 2300],
    ],
  },
};

// ============================================================
// БАГ 2 — добавление недостающей строки "Месячный проездной"
// ============================================================

const TRANSPORT_ADD = [
  {
    slug: "lombok",
    city_id: "ea189f0e-c861-4e5d-9304-e09723725601",
    item_name_ru: "Месячный проездной (бемо, нерегулярно)",
    price_min: 500,
    price_max: 1200,
    source: "Оценочно: бемо 5000-15000 IDR/поездка (wewillnomad.com, lomboq.com), без расписания и монтарифа; курс IDR×0,004888₽",
  },
  {
    slug: "pondicherry",
    city_id: "d9fa0cf7-8b6c-485f-97a1-37ad255f5c5c",
    item_name_ru: "Месячный проездной (местный автобус)",
    price_min: 350,
    price_max: 750,
    source: "Оценочно: своей помесячной карты PRTC на локальные автобусы Пондичерри не найдено; консервативная оценка ниже ченнайского MTC Gold (1000₹, mtcbus.tn.gov.in) — сеть Пондичерри значительно скромнее; курс INR×0,9126₽",
  },
  {
    slug: "seminyak",
    city_id: "8818a8b6-afd8-4aa0-b1d4-919f14e632a8",
    item_name_ru: "Месячный проездной (автобус почти не ходит)",
    price_min: 500,
    price_max: 1500,
    source: "Оценочно: Trans Sarbagita Семиньяк толком не обслуживает (en.wikipedia.org/Trans_Sarbagita), Kura-Kura Bus — туристический шаттл $7-10/поездка, для ежедневного использования непригоден по цене; курс IDR×0,004888₽",
  },
  {
    slug: "ubud",
    city_id: "4c96d905-e484-40bd-8ceb-0a2b3bb7776c",
    item_name_ru: "Месячный проездной (автобус почти не ходит)",
    price_min: 400,
    price_max: 1000,
    source: "Оценочно: Trans Sarbagita до Убуда не доходит вообще (маршрут заканчивается у Батубулан, thewonderspace.com), общественного транспорта в привычном смысле нет; курс IDR×0,004888₽",
  },
  {
    slug: "chiangmai",
    city_id: "5eff0359-7969-4a53-945f-f2c60369c2b3",
    item_name_ru: "Месячный проездной (сонгтэо/автобус)",
    price_min: 2600,
    price_max: 5200,
    source: "Оценочно: RTC City Bus плоский тариф 50 THB/поездка, официального месячного абонемента нет (chiangmaitraveller.com, tripadvisor.com) — оценка на основе умеренного нерегулярного использования; курс THB×2,618₽",
  },
];

const TEST_SLUGS_CURRENCY = ["bogota"];
const TEST_SLUGS_TRANSPORT = ["ubud"];

const isAll = process.argv.includes("--all");

async function alreadyHasProezdnoy(cityId) {
  const rows = await withRetry(`CHECK ${cityId}`, () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?city_id=eq.${cityId}&category=eq.transport&item_name_ru=ilike.*проездной*&select=id,item_name_ru`,
      { headers },
    ),
  );
  return Array.isArray(rows) && rows.length > 0 ? rows : null;
}

async function patchRow(id, price_min, price_max) {
  return withRetry(`PATCH ${id}`, () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?id=eq.${id}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ price_min, price_max, updated_at: new Date().toISOString() }),
      },
      20000,
    ),
  );
}

async function insertRow(row) {
  return withRetry(`INSERT ${row.slug}`, () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices`,
      {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({
          city_id: row.city_id,
          category: "transport",
          item_name_ru: row.item_name_ru,
          price_min: row.price_min,
          price_max: row.price_max,
          is_premium: false,
          updated_at: new Date().toISOString(),
        }),
      },
      20000,
    ),
  );
}

async function fetchCurrentBudgetRows(cityId) {
  const rows = await withRetry(`FETCH budget rows ${cityId}`, () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?city_id=eq.${cityId}&category=in.(rent,food,transport,utilities)&select=item_name_ru,price_min`,
      { headers },
    ),
  );
  return rows ?? [];
}

function monthlyBudgetFrom(rows) {
  const find = (needle) => rows.find((r) => r.item_name_ru.includes(needle))?.price_min ?? 0;
  const rent = find("окраине");
  const food = find("Продукты");
  const transport = find("проездной");
  const utilities = find("ЖКХ") + find("Домашний") + find("Мобильная");
  return { rent, food, transport, utilities, monthly_from: rent + food + transport + utilities };
}

async function run() {
  const currencyTargets = isAll ? Object.keys(CURRENCY_FIX) : TEST_SLUGS_CURRENCY;
  const transportTargets = isAll
    ? TRANSPORT_ADD
    : TRANSPORT_ADD.filter((c) => TEST_SLUGS_TRANSPORT.includes(c.slug));

  console.log(
    `\n=== БАГ 1 (валюта): ${isAll ? "ВСЕ 4 города" : "ТЕСТ — " + currencyTargets.join(", ")} ===\n`,
  );

  let ok = 0, fail = 0;
  for (const slug of currencyTargets) {
    const city = CURRENCY_FIX[slug];
    const before = monthlyBudgetFrom(await fetchCurrentBudgetRows(city.city_id));
    console.log(`--- ${slug} (${city.rate_note}) ---`);
    console.log(
      `ДО:  monthly_from=${before.monthly_from} ₽ (rent=${before.rent} food=${before.food} transport=${before.transport} utilities=${before.utilities})`,
    );

    for (const [id, name, min, max] of city.rows) {
      try {
        await patchRow(id, min, max);
        console.log(`  ✓ ${name}: → ${min}-${max} ₽`);
        ok++;
      } catch (e) {
        console.error(`  ✗ ${name} (${id}): ${e.message}`);
        fail++;
      }
      await new Promise((r) => setTimeout(r, 350));
    }

    const after = monthlyBudgetFrom(await fetchCurrentBudgetRows(city.city_id));
    console.log(
      `ПОСЛЕ: monthly_from=${after.monthly_from} ₽ (rent=${after.rent} food=${after.food} transport=${after.transport} utilities=${after.utilities})\n`,
    );
  }

  console.log(
    `\n=== БАГ 2 (нет "проездной"): ${isAll ? "ВСЕ 5 городов" : "ТЕСТ — " + transportTargets.map((c) => c.slug).join(", ")} ===\n`,
  );

  let inserted = 0, skipped = 0;
  for (const row of transportTargets) {
    const before = monthlyBudgetFrom(await fetchCurrentBudgetRows(row.city_id));
    console.log(`--- ${row.slug} ---`);
    console.log(`ДО:  monthly_from=${before.monthly_from} ₽ (transport=${before.transport})`);

    const existing = await alreadyHasProezdnoy(row.city_id);
    if (existing) {
      console.log(`  - уже есть строка "проездной" (${existing.map((r) => r.item_name_ru).join(", ")}), пропуск`);
      skipped++;
      continue;
    }
    try {
      await insertRow(row);
      console.log(`  ✓ INSERT "${row.item_name_ru}": ${row.price_min}-${row.price_max} ₽ — ${row.source}`);
      inserted++;
    } catch (e) {
      console.error(`  ✗ INSERT ${row.slug}: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 350));

    const after = monthlyBudgetFrom(await fetchCurrentBudgetRows(row.city_id));
    console.log(`ПОСЛЕ: monthly_from=${after.monthly_from} ₽ (transport=${after.transport})\n`);
  }

  console.log(
    `\nГотово. PATCH успешно: ${ok}, INSERT успешно: ${inserted}, пропущено (уже было): ${skipped}, проблемных: ${fail}.`,
  );
  if (!isAll) {
    console.log(
      `Это был тестовый прогон (bogota + ubud). Проверь числа выше, затем запусти:\n  node scripts/fix-currency-transport-9cities.mjs --all`,
    );
  }
  if (fail > 0) process.exitCode = 1;
}

run();

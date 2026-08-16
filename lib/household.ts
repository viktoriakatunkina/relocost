// Движок состава домохозяйства — фундамент эпика «Бюджет под состав семьи».
// Best-practice Livingcost/Numbeo: один бюджет «на человека» масштабируется под
// реальный состав (1 человек / пара / семья с ребенком) прозрачными множителями
// по категориям. Чистые функции без запросов — на вход уже посчитанный бюджет,
// на выход множители и пересчитанные суммы.
//
// ВАЖНО про данные: в prices у каждого города есть позиции аренды «1-комн. на
// окраине», «2-комн. в центре» и т.д., но НЕТ «2-комн. на окраине» — то есть
// прямой цены семейного жилья в том же бюджетном сегменте (окраина), что и
// базовая «1-комн. на окраине». Поэтому для семьи мы НЕ берем «2-комн. в центре»
// (она в среднем в 2,2 раза дороже базовой и смешивает «больше комнат» с
// «центром»), а применяем множитель ~1,4 к базовой аренде. Проверка по 109
// городам: «2-комн. в центре» / «1-комн. окраина» ≈ 2,2, а «центр»-премия
// «1-комн. центр» / «1-комн. окраина» ≈ 1,5 → оценка «2-комн. на окраине» ≈
// 2,2 / 1,5 ≈ 1,47. Берем умеренные 1,4. Данных по детсаду/школе в БД нет —
// дети влияют только на жилье, продукты и транспорт (см. отчет/комментарии).

export type Household = {
  // Поддерживаем 1 или 2 взрослых (одиночка / пара) — как у конкурентов.
  adults: 1 | 2;
  // Дети 0..3 (см. clampHousehold). Влияют на еду, транспорт, ЖКХ и жилье.
  children: number;
};

export type HouseholdPresetKey = "solo" | "couple" | "family";

export type HouseholdPreset = {
  key: HouseholdPresetKey;
  label: string;
  // Короткая подпись для подзаголовков/хуков («на одного», «на пару»…).
  short: string;
  household: Household;
};

// Три пресета как у Livingcost: одиночка, пара, семья с ребенком.
export const HOUSEHOLD_PRESETS: HouseholdPreset[] = [
  {
    key: "solo",
    label: "1 человек",
    short: "на одного",
    household: { adults: 1, children: 0 },
  },
  {
    key: "couple",
    label: "Пара",
    short: "на пару",
    household: { adults: 2, children: 0 },
  },
  {
    key: "family",
    label: "Семья с ребенком",
    short: "на семью",
    household: { adults: 2, children: 1 },
  },
];

export const SOLO: Household = { adults: 1, children: 0 };
export const COUPLE: Household = { adults: 2, children: 0 };
export const FAMILY: Household = { adults: 2, children: 1 };

// Сколько детей максимум учитываем (дальше множители почти не меняют картину,
// а данных под крупные семьи у нас нет).
export const MAX_CHILDREN = 3;

// Приводим произвольный ввод к допустимому составу: взрослых 1..2, детей 0..3.
export function clampHousehold(h: Household): Household {
  const adults: 1 | 2 = h.adults >= 2 ? 2 : 1;
  const children = Math.max(0, Math.min(MAX_CHILDREN, Math.round(h.children)));
  return { adults, children };
}

// Подбираем пресет по составу (для подсветки активной кнопки-сегмента).
// null — если состав не совпал ни с одним пресетом (произвольный ползунками).
export function matchPreset(h: Household): HouseholdPresetKey | null {
  const c = clampHousehold(h);
  const found = HOUSEHOLD_PRESETS.find(
    (p) => p.household.adults === c.adults && p.household.children === c.children,
  );
  return found ? found.key : null;
}

export type HouseholdMultipliers = {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
};

// Прозрачная формула множителей по категориям. Коэффициенты — в духе
// Livingcost (ребенок «весит» меньше взрослого, общие расходы делятся):
//
//   food      = adults * 1.0 + children * 0.6
//               взрослый ест «на единицу», ребенок ~0,6 от взрослого.
//   transport = adults * 1.0 + children * 0.3
//               детям часто нужен только разовый/льготный проезд → 0,3.
//   utilities = 1 + (adults - 1) * 0.15 + children * 0.05
//               коммуналка почти фиксированная: второй взрослый +15%,
//               каждый ребенок +5% (вода/электричество).
//   rent      = 1 для одиночки и пары (та же 1-комн. на окраине),
//               1.4 для семьи с детьми (оценка «2-комн. на окраине»,
//               т.к. прямой цены такого жилья в БД нет — см. шапку файла).
//
// Множители всегда относительно базового «бюджета на одного человека».
export function householdMultipliers(input: Household): HouseholdMultipliers {
  const h = clampHousehold(input);
  const { adults, children } = h;

  const food = adults * 1.0 + children * 0.6;
  const transport = adults * 1.0 + children * 0.3;
  const utilities = 1 + (adults - 1) * 0.15 + children * 0.05;
  // Жилье: одиночка/пара живут в той же 1-комн. (множитель 1), семье с детьми
  // нужна квартира побольше → +40% к базовой аренде.
  const rent = children > 0 ? 1.4 : 1;

  return { rent, food, transport, utilities };
}

// Множитель именно для аренды с учетом наличия в данных «2-комн.» позиции.
// Если у города реально есть цена 2-комнатной и она информативнее множителя —
// вызывающий код может предпочесть ее; здесь же — чистый множитель к базовой
// 1-комн. на окраине. Вынесено отдельно, чтобы UI мог объяснить пользователю,
// почему для семьи жилье растет (нужна квартира побольше).
export function rentMultiplier(input: Household): number {
  return householdMultipliers(input).rent;
}

// Человекочитаемое описание состава для подписей: «1 взрослый», «2 взрослых,
// 1 ребенок», «2 взрослых, 2 детей». Согласование числительных с «ребенок».
export function householdLabel(input: Household): string {
  const h = clampHousehold(input);
  const adultsWord = h.adults === 1 ? "1 взрослый" : "2 взрослых";
  if (h.children === 0) return adultsWord;
  return `${adultsWord}, ${h.children} ${childrenWord(h.children)}`;
}

function childrenWord(n: number): string {
  // 1 ребенок, 2 ребенка, 3 ребенка (в наших пределах 1..3 — простая форма).
  if (n === 1) return "ребенок";
  return "ребенка";
}

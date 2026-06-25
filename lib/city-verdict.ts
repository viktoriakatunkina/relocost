// Краткий «вывод» под заголовком «Стоит ли переезжать в X?».
//
// Контекст (правка 17.2): раньше под этим заголовком повторялся ТОТ ЖЕ
// intro_text, что уже показан в hero города → видимый дубль одного абзаца.
// Причина — у города в схеме нет отдельного поля summary/verdict, а CityHero и
// CitySummary оба читали единственное поле intro_text.
//
// Решение без правки данных по 99 городам: собираем уникальный вывод из уже
// проверенных полей (сложность переезда, визовый режим, первый плюс и первый
// минус, валюта/язык). Текст детерминированный, без новых непроверенных фактов
// и без повтора вступления. Полноценный авторский verdict на каждый город —
// отдельная контент-задача (см. отчет), эта функция дает корректную выжимку
// прямо сейчас.

import type { City } from "./types";
import type { CityContent } from "./cities-content";
import { getDifficulty } from "./difficulty";
import { getVisa } from "./visa";

function lowerFirst(s: string): string {
  return s ? s[0].toLowerCase() + s.slice(1) : s;
}

function stripTrailingDot(s: string): string {
  return s.replace(/[.;,\s]+$/, "");
}

/**
 * Уникальный вывод под «Стоит ли переезжать в {phrase}?».
 * phrase — предложный падеж с предлогом («в Тбилиси», «на Бали»).
 * Не повторяет intro_text. Возвращает 1–2 предложения.
 */
export function cityVerdict(
  city: City,
  phrase: string,
  content?: CityContent,
): string {
  const difficulty = getDifficulty(city); // Легко / Средне / Сложно | null
  const visa = getVisa(city);
  const parts: string[] = [];

  // 1) Тип переезда + общая оценка сложности.
  if (city.is_foreign) {
    const visaPhrase =
      visa.status === "visa_free"
        ? "с безвизовым или упрощенным въездом для россиян"
        : "с визой, которую оформляют заранее";
    if (difficulty?.label === "Легко") {
      parts.push(`Переезд ${phrase} — один из самых простых среди зарубежных направлений, ${visaPhrase}`);
    } else if (difficulty?.label === "Сложно") {
      parts.push(`Переезд ${phrase} требует подготовки: это направление средней-высокой сложности, ${visaPhrase}`);
    } else {
      parts.push(`Переезд ${phrase} реален при обычной подготовке, ${visaPhrase}`);
    }
  } else {
    if (difficulty?.label === "Легко") {
      parts.push(`Переезд ${phrase} — внутри России, без визы и легализации, и проходит проще всего`);
    } else {
      parts.push(`Переезд ${phrase} — внутри России, без визы и легализации`);
    }
  }

  // 2) Главный плюс и главный минус — чтобы вывод был сбалансированным.
  const pro = content?.pros?.[0] ? lowerFirst(stripTrailingDot(content.pros[0])) : null;
  const con = content?.cons?.[0] ? lowerFirst(stripTrailingDot(content.cons[0])) : null;
  if (pro && con) {
    parts.push(`Главный плюс — ${pro}; о чем стоит помнить — ${con}`);
  } else if (pro) {
    parts.push(`Главный плюс — ${pro}`);
  } else if (con) {
    parts.push(`О чем стоит помнить — ${con}`);
  }

  // 3) Замыкаем переходом к фактуре ниже (цены/виза/отзывы) — без чисел,
  //    чтобы не зависеть от prices и не врать с конкретикой.
  parts.push("Реальный месячный бюджет, визовые шаги и отзывы переехавших — ниже на странице");

  return parts.map((p) => stripTrailingDot(p)).join(". ") + ".";
}

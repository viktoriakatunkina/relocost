// Автоматический вердикт по городу/стране — блок «Плюсы, минусы, для кого».
//
// Генерируется из числовых данных: цены, quality-оси, сложность переезда,
// визовый режим, is_foreign. НЕ зависит от контентных pros/cons из
// cities-content.ts — работает даже для городов без контента в CITY_CONTENT.
//
// Аудитория-теги: чипы с текстовыми метками (без SVG/emoji-иконок
// в логике — они вставляются в компоненте через статичный маппинг).

import type { QualityData } from "./city-quality";
import { getVisa } from "./visa";
import type { City } from "./types";

// ── Типы ──────────────────────────────────────────────────────────────────────

export type VerdictItem = {
  key: string;
  label: string;
};

export type AudienceTag = {
  key: string;
  label: string;
};

export type CityVerdictBlock = {
  pros: VerdictItem[];
  cons: VerdictItem[];
  audience: AudienceTag[];
  phrase: string;
  /** false если данных слишком мало (< 2 плюсов или < 1 минуса) */
  hasEnoughData: boolean;
};

// ── Вспомогательные константы ─────────────────────────────────────────────────

// Шкалы для аренды и бюджета в рублях (фактически — рублёвые ориентиры 2026).
// Соответствуют порогам в livingScore.ts.
const RENT_CHEAP = 30_000;
const RENT_MID   = 60_000;
const RENT_HIGH  = 80_000;

const BUDGET_VERY_CHEAP = 50_000;
const BUDGET_CHEAP      = 60_000;
const BUDGET_HIGH       = 120_000;

// ── Локализованные строки ─────────────────────────────────────────────────────

// Все строки передаются через i18n-пропсы в компонент — здесь только ключи.
// Ключ соответствует полю в messages/{locale}.json → cityVerdict.*

export type VerdictI18n = {
  eyebrow: string;
  title: string;

  // Плюсы
  prosCheapHousing: string;
  prosCheapLife: string;
  prosVisuFree: string;
  prosMildClimate: string;
  prosHighSafety: string;
  prosGoodMedicine: string;
  prosHighQualityLife: string;
  prosGoodTransport: string;
  prosCleanEcology: string;

  // Минусы
  consExpensiveHousing: string;
  consExpensiveLife: string;
  consVisaNeeded: string;
  consLanguageBarrier: string;
  consHarshClimate: string;
  consLowSafety: string;
  consPoorEcology: string;
  consPoorMedicine: string;
  consLittleData: string;

  // Аудитория
  audienceFreelancers: string;
  audienceFamilies: string;
  audiencePensioners: string;
  audienceStudents: string;
  audienceBudget: string;
  audienceNomads: string;
  audienceSafety: string;

  // Фраза-вердикт (шаблон с {city} и {advantage})
  phraseTemplate: string;
  advantageCheap: string;
  advantageSafe: string;
  advantageClimate: string;
  advantageQuality: string;
  advantageEasy: string;
};

// ── Основная функция для города ───────────────────────────────────────────────

export function buildCityVerdictBlock(
  city: City,
  t: VerdictI18n,
  cityName: string,
  params: {
    min_rent: number;
    monthly_from: number;
    quality: QualityData | null;
  },
): CityVerdictBlock {
  const { min_rent, monthly_from, quality } = params;
  const visa = getVisa(city);

  const pros: VerdictItem[] = [];
  const cons: VerdictItem[] = [];

  // ── Плюсы ─────────────────────────────────────────────────────────────────

  // Доступное жильё
  if (min_rent > 0 && min_rent < RENT_CHEAP) {
    pros.push({ key: "cheap_housing", label: t.prosCheapHousing });
  }

  // Низкая стоимость жизни
  if (monthly_from > 0 && monthly_from < BUDGET_CHEAP) {
    pros.push({ key: "cheap_life", label: t.prosCheapLife });
  }

  // Безвизовый въезд (только для зарубежных городов)
  if (city.is_foreign && visa.status === "visa_free") {
    pros.push({ key: "visa_free", label: t.prosVisuFree });
  }

  // Мягкий климат
  if (quality && quality.climate_comfort >= 4) {
    pros.push({ key: "mild_climate", label: t.prosMildClimate });
  }

  // Высокая безопасность
  if (quality && quality.safety >= 4) {
    pros.push({ key: "high_safety", label: t.prosHighSafety });
  }

  // Хорошая медицина
  if (quality && quality.medicine >= 4) {
    pros.push({ key: "good_medicine", label: t.prosGoodMedicine });
  }

  // Чистая экология
  if (quality && quality.ecology >= 4) {
    pros.push({ key: "clean_ecology", label: t.prosCleanEcology });
  }

  // ── Минусы ────────────────────────────────────────────────────────────────

  // Дорогое жильё
  if (min_rent > RENT_HIGH) {
    cons.push({ key: "expensive_housing", label: t.consExpensiveHousing });
  } else if (min_rent >= RENT_MID) {
    // Средне дорогое — не добавляем как явный минус
  }

  // Дорогая жизнь
  if (monthly_from > BUDGET_HIGH) {
    cons.push({ key: "expensive_life", label: t.consExpensiveLife });
  }

  // Нужна виза
  if (city.is_foreign && visa.status === "visa_required") {
    cons.push({ key: "visa_needed", label: t.consVisaNeeded });
  }

  // Языковой барьер — зарубежный и ПЕРВЫЙ язык в списке не русский/английский
  if (city.is_foreign) {
    const lang = (city.language ?? "").toLowerCase();
    const primaryLang = lang.split(/[,\/;]/)[0].trim();
    const isRuOrEn =
      primaryLang.includes("русск") ||
      primaryLang.includes("russian") ||
      primaryLang.includes("english") ||
      primaryLang.includes("английск");
    if (!isRuOrEn) {
      cons.push({ key: "language_barrier", label: t.consLanguageBarrier });
    }
  }

  // Суровый климат
  if (quality && quality.climate_comfort <= 2) {
    cons.push({ key: "harsh_climate", label: t.consHarshClimate });
  }

  // Низкая безопасность
  if (quality && quality.safety <= 2) {
    cons.push({ key: "low_safety", label: t.consLowSafety });
  }

  // Плохая экология
  if (quality && quality.ecology <= 2) {
    cons.push({ key: "poor_ecology", label: t.consPoorEcology });
  }

  // Ограниченная медицина (для зарубежных городов)
  if (city.is_foreign && quality && quality.medicine <= 3) {
    cons.push({ key: "poor_medicine", label: t.consPoorMedicine });
  }

  // Сложный переезд
  if (city.difficulty_score && city.difficulty_score >= 4) {
    cons.push({ key: "hard_move", label: "Сложный процесс переезда и оформления" });
  }

  // Недостаток данных — fallback
  if (cons.length === 0) {
    cons.push({ key: "little_data", label: t.consLittleData });
  }

  // ── Аудитория ─────────────────────────────────────────────────────────────

  const audience: AudienceTag[] = [];

  // Для экономных — очень дешевый бюджет
  if (monthly_from > 0 && monthly_from < BUDGET_VERY_CHEAP) {
    audience.push({ key: "budget", label: t.audienceBudget });
  }

  // Для фрилансеров и удалёнщиков — зарубеж + безвиз + не слишком дорого
  if (city.is_foreign && visa.status === "visa_free") {
    audience.push({ key: "freelancers", label: t.audienceFreelancers });
  }

  // Для пенсионеров — хороший климат + дешево + безопасно
  if (
    quality &&
    quality.climate_comfort >= 4 &&
    monthly_from > 0 &&
    monthly_from < BUDGET_CHEAP
  ) {
    audience.push({ key: "pensioners", label: t.audiencePensioners });
  }

  // Для семей с детьми — безопасность + хорошая медицина
  if (quality && quality.safety >= 4 && quality.medicine >= 3) {
    audience.push({ key: "families", label: t.audienceFamilies });
  }

  // Для студентов — дешево
  if (monthly_from > 0 && monthly_from < BUDGET_CHEAP) {
    audience.push({ key: "students", label: t.audienceStudents });
  }

  // Для цифровых кочевников — зарубеж + теплый климат
  if (city.is_foreign && quality && quality.climate_comfort >= 4) {
    // Уже добавили freelancers — если его нет, добавим nomads
    if (!audience.find((a) => a.key === "freelancers")) {
      audience.push({ key: "nomads", label: t.audienceNomads });
    }
  }

  // Для тех, кто ценит безопасность
  if (quality && quality.safety >= 5) {
    audience.push({ key: "safety", label: t.audienceSafety });
  }

  // Ограничиваем 4 тегами — чтобы строка не разъезжалась
  const audienceTrimmed = audience.slice(0, 4);

  // ── Фраза-вердикт ─────────────────────────────────────────────────────────

  // Выбираем главное преимущество для фразы
  let advantage = t.advantageEasy;
  if (pros.find((p) => p.key === "cheap_life" || p.key === "cheap_housing")) {
    advantage = t.advantageCheap;
  } else if (pros.find((p) => p.key === "mild_climate")) {
    advantage = t.advantageClimate;
  } else if (pros.find((p) => p.key === "high_safety")) {
    advantage = t.advantageSafe;
  } else if (pros.find((p) => p.key === "good_medicine")) {
    advantage = t.advantageQuality;
  } else if (pros.find((p) => p.key === "visa_free")) {
    advantage = t.advantageEasy;
  }

  const phrase = t.phraseTemplate
    .replace("{city}", cityName)
    .replace("{advantage}", advantage);

  // ── Порог достаточности ───────────────────────────────────────────────────

  const hasEnoughData = pros.length >= 2 && cons.length >= 1;

  return {
    pros: pros.slice(0, 5),
    cons: cons.slice(0, 4),
    audience: audienceTrimmed,
    phrase,
    hasEnoughData,
  };
}

// ── Аналог для страны ─────────────────────────────────────────────────────────

export type CountryVerdictI18n = {
  eyebrow: string;
  title: string;

  // Плюсы
  prosVisuFree: string;
  prosPopular: string;
  prosMildClimate: string;
  prosHighSafety: string;
  prosGoodMedicine: string;
  prosCheapCities: string;

  // Минусы
  consVisaNeeded: string;
  consHighDifficulty: string;
  consLanguageBarrier: string;
  consHarshClimate: string;
  consLittleData: string;

  // Аудитория
  audienceFreelancers: string;
  audienceFamilies: string;
  audiencePensioners: string;
  audienceBudget: string;
  audienceNomads: string;

  // Фраза
  phraseTemplate: string;
  advantageEasy: string;
  advantagePopular: string;
  advantageSafe: string;
  advantageClimate: string;
};

export type CountryVerdictBlock = {
  pros: VerdictItem[];
  cons: VerdictItem[];
  audience: AudienceTag[];
  phrase: string;
  hasEnoughData: boolean;
};

export function buildCountryVerdictBlock(
  params: {
    countrySlug: string;
    countryName: string;
    isForeignCountry: boolean;
    difficulty_overall: number; // 1-5 из COUNTRY_CONTENT
    hasCheapCities: boolean;   // есть ли хоть один город < BUDGET_CHEAP
    avgSafety: number | null;  // 1-5, среднее по городам если есть
    avgClimate: number | null; // 1-5, среднее по городам
    avgMedicine: number | null;
    cityCount: number;
  },
  t: CountryVerdictI18n,
): CountryVerdictBlock {
  const {
    countrySlug,
    countryName,
    isForeignCountry,
    difficulty_overall,
    hasCheapCities,
    avgSafety,
    avgClimate,
    avgMedicine,
    cityCount,
  } = params;

  const visa = getVisa({ country_slug: countrySlug });
  const pros: VerdictItem[] = [];
  const cons: VerdictItem[] = [];

  // ── Плюсы ─────────────────────────────────────────────────────────────────

  if (isForeignCountry && visa.status === "visa_free") {
    pros.push({ key: "visa_free", label: t.prosVisuFree });
  }

  if (cityCount >= 3) {
    pros.push({ key: "popular", label: t.prosPopular });
  }

  if (avgClimate !== null && avgClimate >= 4) {
    pros.push({ key: "mild_climate", label: t.prosMildClimate });
  }

  if (avgSafety !== null && avgSafety >= 4) {
    pros.push({ key: "high_safety", label: t.prosHighSafety });
  }

  if (avgMedicine !== null && avgMedicine >= 4) {
    pros.push({ key: "good_medicine", label: t.prosGoodMedicine });
  }

  if (hasCheapCities) {
    pros.push({ key: "cheap_cities", label: t.prosCheapCities });
  }

  // ── Минусы ────────────────────────────────────────────────────────────────

  if (isForeignCountry && visa.status === "visa_required") {
    cons.push({ key: "visa_needed", label: t.consVisaNeeded });
  }

  if (difficulty_overall >= 4) {
    cons.push({ key: "high_difficulty", label: t.consHighDifficulty });
  }

  if (isForeignCountry) {
    // Языковой барьер — упрощённая проверка по slug (страны с русскоязычным населением)
    const ruLang = ["georgia", "armenia", "serbia", "kazakhstan", "uzbekistan", "kyrgyzstan", "belarus"];
    if (!ruLang.includes(countrySlug)) {
      cons.push({ key: "language_barrier", label: t.consLanguageBarrier });
    }
  }

  if (avgClimate !== null && avgClimate <= 2) {
    cons.push({ key: "harsh_climate", label: t.consHarshClimate });
  }

  if (cons.length === 0) {
    cons.push({ key: "little_data", label: t.consLittleData });
  }

  // ── Аудитория ─────────────────────────────────────────────────────────────

  const audience: AudienceTag[] = [];

  if (isForeignCountry && visa.status === "visa_free") {
    audience.push({ key: "freelancers", label: t.audienceFreelancers });
  }

  if (hasCheapCities) {
    audience.push({ key: "budget", label: t.audienceBudget });
  }

  if (avgClimate !== null && avgClimate >= 4) {
    audience.push({ key: "nomads", label: t.audienceNomads });
  }

  if (avgSafety !== null && avgSafety >= 4 && avgMedicine !== null && avgMedicine >= 3) {
    audience.push({ key: "families", label: t.audienceFamilies });
  }

  if (avgClimate !== null && avgClimate >= 4 && hasCheapCities) {
    audience.push({ key: "pensioners", label: t.audiencePensioners });
  }

  const audienceTrimmed = audience.slice(0, 4);

  // ── Фраза ─────────────────────────────────────────────────────────────────

  let advantage = t.advantageEasy;
  if (pros.find((p) => p.key === "visa_free")) {
    advantage = t.advantageEasy;
  } else if (pros.find((p) => p.key === "mild_climate")) {
    advantage = t.advantageClimate;
  } else if (pros.find((p) => p.key === "high_safety")) {
    advantage = t.advantageSafe;
  } else if (pros.find((p) => p.key === "popular")) {
    advantage = t.advantagePopular;
  }

  const phrase = t.phraseTemplate
    .replace("{country}", countryName)
    .replace("{advantage}", advantage);

  const hasEnoughData = pros.length >= 2 && cons.length >= 1;

  return {
    pros: pros.slice(0, 5),
    cons: cons.slice(0, 4),
    audience: audienceTrimmed,
    phrase,
    hasEnoughData,
  };
}

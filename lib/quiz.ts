import type { CityWithBudget } from "./types";
import { climateTemp, COASTAL } from "./city-signals";
import { getVisa } from "./visa";

// Квиз «Куда мне переехать?» (вдохновлено LookyLoo/Novad/Movemap/CityVibeCheck):
// чистый скоринг города по ответам пользователя поверх НАШИХ данных
// (бюджет, климат, сложность переезда, заграница/РФ, побережье, население,
// русскоязычное сообщество). Никаких новых данных — переиспользуем сигналы
// подборок (lib/city-signals, lists.ts). Изоморфно: считается на клиенте.

export type Destination = "foreign" | "russia" | "any";
export type ClimatePref = "warm" | "temperate" | "any";
export type Priority = "easy" | "sea" | "remote" | "bigcity" | "cheaper";

export type QuizAnswers = {
  destination: Destination;
  budgetMax: number | null; // ₽/мес, null = не важно
  climate: ClimatePref;
  priority: Priority[]; // мультивыбор: массив приоритетов
  needRussian: boolean;
  visaReady: boolean;
};

export type ScoredCity = {
  city: CityWithBudget;
  score: number;
  reasons: string[];
};

// «1.1 млн» / «280 тыс» / «4,4 млн (остров)» → число (или null).
export function parsePopulation(s: string | null): number | null {
  if (!s) return null;
  const m = s.replace(",", ".").match(/([\d.]+)/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  if (/млн/i.test(s)) n *= 1_000_000;
  else if (/тыс/i.test(s)) n *= 1_000;
  return n;
}

const BIG_CITY = 1_000_000;

// Скоринг одного города. communityMap: slug → difficulty_breakdown.community
// (1–5, меньше = сильнее русскоязычное сообщество). Возвращает null, если город
// жёстко не подходит по направлению (заграница/РФ) — такие не показываем.
export function scoreCity(
  city: CityWithBudget,
  answers: QuizAnswers,
  communityMap: Map<string, number>,
): ScoredCity | null {
  // Жёсткий фильтр по направлению.
  if (answers.destination === "foreign" && !city.is_foreign) return null;
  if (answers.destination === "russia" && city.is_foreign) return null;

  let score = 0;
  const reasons: string[] = [];
  const budget = city.monthly_from;
  const diff = city.difficulty_score ?? 3;
  const temp = climateTemp(city);

  // Бюджет.
  if (answers.budgetMax && budget > 0) {
    if (budget <= answers.budgetMax) {
      score += 30;
      reasons.push("В Вашем бюджете");
    } else if (budget <= answers.budgetMax * 1.2) {
      score += 8;
    } else {
      score -= 45;
    }
  }

  // Климат.
  if (answers.climate === "warm" && temp !== null) {
    if (temp >= 22) {
      score += 22;
      reasons.push("Тепло круглый год");
    } else if (temp >= 16) {
      score += 6;
    } else {
      score -= 10;
    }
  } else if (answers.climate === "temperate" && temp !== null) {
    if (temp >= 12 && temp < 24) {
      score += 18;
      reasons.push("Умеренный климат");
    }
  }

  // Приоритеты (мультивыбор). Вес каждого делим на кол-во выбранных,
  // чтобы суммарный потолок оставался ~26 баллов независимо от выбора.
  const priorities = answers.priority.length > 0 ? answers.priority : ["easy" as Priority];
  const weight = 26 / priorities.length;

  for (const p of priorities) {
    switch (p) {
      case "easy":
        score += ((5 - diff) / 4) * weight;
        if (diff <= 2) {
          if (!reasons.includes("Простой переезд")) reasons.push("Простой переезд");
        }
        break;
      case "sea":
        if (COASTAL.has(city.slug)) {
          score += weight;
          if (!reasons.includes("У моря")) reasons.push("У моря");
        }
        break;
      case "remote":
        if (city.is_foreign && diff <= 3 && budget > 0) {
          score += weight;
          if (!reasons.includes("Удобно для удалёнки")) reasons.push("Удобно для удалёнки");
        } else if (diff <= 3) {
          score += weight * 0.38;
        }
        break;
      case "bigcity": {
        const pop = parsePopulation(city.population);
        if (pop && pop >= BIG_CITY) {
          score += weight;
          if (!reasons.includes("Большой город")) reasons.push("Большой город");
        } else if (pop && pop >= 500_000) {
          score += weight * 0.31;
        }
        break;
      }
      case "cheaper":
        // Чем дешевле — тем выше (нормировка появится при ранжировании ниже).
        if (budget > 0) score += weight * cheapFactor(budget);
        if (budget > 0 && budget <= 45_000) {
          if (!reasons.includes("Низкий бюджет")) reasons.push("Низкий бюджет");
        }
        break;
    }
  }

  // Русскоязычная среда.
  if (answers.needRussian) {
    const comm = communityMap.get(city.slug);
    if (comm !== undefined && comm <= 2) {
      score += 20;
      reasons.push("Русскоязычная среда");
    } else if (!city.is_foreign) {
      score += 16;
      reasons.push("Русскоязычная среда");
    }
  }

  // Готовность к визе/ВНЖ.
  if (!answers.visaReady && city.is_foreign) {
    const visa = getVisa(city);
    if (visa.status === "visa_required") {
      score -= 28;
    } else {
      score += 8;
      reasons.push("Безвизовый въезд");
    }
  }

  return { city, score, reasons: reasons.slice(0, 3) };
}

// Дешевле → ближе к 1. Грубая нормировка для приоритета «дешевле».
function cheapFactor(budget: number): number {
  const lo = 30_000;
  const hi = 150_000;
  const t = (hi - budget) / (hi - lo);
  return Math.max(0, Math.min(1, t));
}

export type RankedResult = {
  cities: ScoredCity[];
  // true — нет точных совпадений, показываем лучшее из базы
  isFallback: boolean;
};

// Ранжирование: топ-N городов по ответам. Тай-брейк — дешевле выше.
// Гарантирует минимум MIN_RESULTS результатов: если строгий фильтр даёт меньше,
// добавляем лучшие города без учёта направления (destination).
export function rankCities(
  cities: CityWithBudget[],
  answers: QuizAnswers,
  communityMap: Map<string, number>,
  limit = 8,
): RankedResult {
  const MIN_RESULTS = 3;

  const scored: ScoredCity[] = [];
  for (const c of cities) {
    const r = scoreCity(c, answers, communityMap);
    if (r) scored.push(r);
  }
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      (a.city.monthly_from || Infinity) - (b.city.monthly_from || Infinity),
  );

  if (scored.length >= MIN_RESULTS) {
    return { cities: scored.slice(0, limit), isFallback: false };
  }

  // Fallback: скорим заново, игнорируя ограничение destination, чтобы
  // набрать хотя бы MIN_RESULTS городов.
  const answersRelaxed: QuizAnswers = { ...answers, destination: "any" };
  const fallbackScored: ScoredCity[] = [];
  for (const c of cities) {
    const r = scoreCity(c, answersRelaxed, communityMap);
    if (r) fallbackScored.push(r);
  }
  fallbackScored.sort(
    (a, b) =>
      b.score - a.score ||
      (a.city.monthly_from || Infinity) - (b.city.monthly_from || Infinity),
  );

  // Объединяем: сначала строгие (если были), затем дополняем fallback-ом
  const seen = new Set(scored.map((s) => s.city.slug));
  const extra = fallbackScored.filter((s) => !seen.has(s.city.slug));
  const combined = [...scored, ...extra].slice(0, Math.max(limit, MIN_RESULTS));

  return { cities: combined, isFallback: true };
}

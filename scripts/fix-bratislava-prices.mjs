// Полная пересборка цен — Братислава, двенадцатая ночная партия (26 августа 2026).
//
// БАГ ГЛУБЖЕ, чем в Вроцлаве/Женеве/Бухаресте: у Братиславы было всего 13 строк
// (для сравнения — Вена 20, Прага 49) с ТРЕМЯ наложенными проблемами:
//
// 1) ВАЛЮТА: 12 из 13 строк — сырые цифры в EUR, выданные как рубли
//    ("Кино" 8-12, "Такси 5 км" 6-10, "Аренда 1-комн. в центре" 700-900 —
//    это буквально евро, не рубли). Только "Продукты на месяц" (25000-35000)
//    уже была в рублях.
// 2) НЕКАНОНИЧЕСКИЕ НАЗВАНИЯ: item_name_ru не совпадали ни с одним паттерном,
//    который ищут lib/prices.ts (getSimilarCities), lib/cities.ts, lib/countries.ts
//    (x2), app/[locale]/favorites/page.tsx (точный .eq("item_name_ru",
//    "1-комн. квартира на окраине")) и, критично, components/city/Calculator.tsx
//    (главный калькулятор на странице города) — он ищет "окраине", "1-комн.
//    квартира в центре", ==="Комната", "Продукты", "Обед в кафе", "Ужин на
//    двоих", ==="Капучино", "проездной", "Такси", startsWith("ЖКХ"), "Домашний",
//    "Мобильная". У Братиславы было "Аренда 1-комн. вне центра" (не матчит
//    "окраине"!), "Бюджетный ресторан" (не "Обед в кафе"), "Ресторан на двоих"
//    (не "Ужин на двоих"), не было "Комната"/"Капучино"/"Домашний интернет"/
//    "Мобильная связь" вообще — калькулятор возвращал 0/пусто почти по всем
//    полям. Братислава была структурно "невидима" для калькулятора и для
//    рекомендаций похожих городов по всему сайту.
// 3) НЕПОЛНАЯ КАТЕГОРИЯ: "cafe" отсутствовала целиком (0 строк).
//
// РЕШЕНИЕ: не патчить по одной строке (как Вроцлав), а полностью пересобрать
// набор — DELETE всех 13 старых строк, INSERT 27 новых с каноническими
// названиями (сверено с Веной/Прагой) и рублями.
//
// ИСТОЧНИК ЦЕН: Numbeo Bratislava (авг 2026, WebSearch/WebFetch) — капучино
// 3.11€, обед в недорогом ресторане 10€, ужин на двоих в ресторане среднего
// класса 60€, кино 11€, месячный проездной 40.50€, бензин 1.66€/л, домашний
// интернет 16.67€, мобильная связь 20.17€, аренда 1-комн. в центре 953€ /
// на окраине 713€, фитнес-клуб 49.57€, базовые коммунальные (85м²) 234.90€
// (пересчитано на 1-комн. пропорционально), молоко/хлеб/яйца/курица/вода —
// прямые цифры Numbeo. Комната и частный врач — сверка с RU-источниками
// (t-j.ru, gogov.ru, slovguide.sk: аренда комнаты 300-450€, приём частного
// врача 40-80€ — второе значение почти дословно совпадает со старой
// "испорченной" строкой Братиславы 40-80, что подтверждает: та строка
// действительно была в евро, не в рублях).
//
// Курс ЦБ РФ на 26.08.2026: EUR = 98,5182 ₽.
//
// Запуск: node scripts/fix-bratislava-prices.mjs
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

const CITY_ID = "29c98dd0-ea52-4d34-82cf-c1bcd624ef10"; // bratislava

const NEW_ROWS = [
  // rent
  { category: "rent", item_name_ru: "1-комн. квартира в центре", price_min: 79000, price_max: 113000, is_premium: false },
  { category: "rent", item_name_ru: "1-комн. квартира на окраине", price_min: 57000, price_max: 86000, is_premium: false },
  { category: "rent", item_name_ru: "Комната", price_min: 30000, price_max: 44000, is_premium: false },
  { category: "rent", item_name_ru: "2-комн. квартира в центре", price_min: 113000, price_max: 153000, is_premium: false },
  // food
  { category: "food", item_name_ru: "Капучино", price_min: 250, price_max: 380, is_premium: false },
  { category: "food", item_name_ru: "Обед в кафе", price_min: 800, price_max: 1280, is_premium: false },
  { category: "food", item_name_ru: "Продукты на месяц на 1 человека", price_min: 25000, price_max: 35000, is_premium: false },
  { category: "food", item_name_ru: "Ужин на двоих в ресторане", price_min: 4450, price_max: 7400, is_premium: false },
  { category: "food", item_name_ru: "Молоко (1 л)", price_min: 90, price_max: 120, is_premium: false },
  { category: "food", item_name_ru: "Хлеб (свежий, 0.5 кг)", price_min: 150, price_max: 230, is_premium: false },
  { category: "food", item_name_ru: "Яйца (12 шт)", price_min: 325, price_max: 475, is_premium: false },
  { category: "food", item_name_ru: "Куриное филе (1 кг)", price_min: 640, price_max: 965, is_premium: false },
  { category: "food", item_name_ru: "Бутылка воды (1.5 л)", price_min: 60, price_max: 110, is_premium: false },
  // transport
  { category: "transport", item_name_ru: "Месячный проездной", price_min: 3450, price_max: 4450, is_premium: false },
  { category: "transport", item_name_ru: "Такси 3 км", price_min: 600, price_max: 1000, is_premium: false },
  { category: "transport", item_name_ru: "Бензин (1 л)", price_min: 155, price_max: 175, is_premium: false },
  // utilities
  { category: "utilities", item_name_ru: "Домашний интернет", price_min: 1380, price_max: 1970, is_premium: false },
  { category: "utilities", item_name_ru: "ЖКХ за 1-комн. квартиру", price_min: 9900, price_max: 14800, is_premium: false },
  { category: "utilities", item_name_ru: "Мобильная связь (месяц)", price_min: 1480, price_max: 2460, is_premium: false },
  // cafe
  { category: "cafe", item_name_ru: "Местное пиво (0.5 л, бар)", price_min: 250, price_max: 375, is_premium: true },
  { category: "cafe", item_name_ru: "Импортное пиво (0.33 л, бар)", price_min: 300, price_max: 445, is_premium: true },
  { category: "cafe", item_name_ru: "Коктейль в баре", price_min: 700, price_max: 1300, is_premium: true },
  { category: "cafe", item_name_ru: "Стейк в ресторане среднего класса", price_min: 3200, price_max: 5200, is_premium: true },
  // health
  { category: "health", item_name_ru: "Абонемент в фитнес-клуб (мес)", price_min: 3450, price_max: 6400, is_premium: true },
  { category: "health", item_name_ru: "Визит к частному врачу", price_min: 3950, price_max: 7880, is_premium: true },
  // entertainment
  { category: "entertainment", item_name_ru: "Билет в кино", price_min: 800, price_max: 1280, is_premium: false },
  { category: "entertainment", item_name_ru: "Бокал вина или коктейль в баре", price_min: 500, price_max: 900, is_premium: true },
];

async function run() {
  console.log("=== Пересборка цен: Братислава ===");

  // 1) Удаляем старые 13 строк
  await withRetry("DELETE старых строк", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?city_id=eq.${CITY_ID}`,
      { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } },
      20000
    )
  );
  console.log("✓ Старые строки удалены");

  // 2) Вставляем новые 27 строк
  const now = new Date().toISOString();
  const payload = NEW_ROWS.map((r) => ({ ...r, city_id: CITY_ID, updated_at: now }));

  await withRetry("INSERT новых строк", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices`,
      {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      },
      20000
    )
  );
  console.log(`✓ Вставлено ${payload.length} новых строк`);
}

run().catch((e) => {
  console.error("ОШИБКА:", e.message);
  process.exitCode = 1;
});

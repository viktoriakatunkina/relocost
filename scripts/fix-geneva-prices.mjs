// Точечный фикс "порчи цен" — Женева, одиннадцатая ночная партия (26 августа 2026),
// продолжение цепочки fix-prices-night9-batch.mjs / fix-bucharest-prices.mjs /
// fix-wroclaw-prices.mjs. Более грязный случай, чем Вроцлав — баг размазан
// по 6 из 7 категорий (только "food" частично уже поправлен).
//
// ДИАГНОЗ (разбор всех 20 строк по city_id + updated_at):
// - 4 строки с updated_at=2026-08-17T05:17:xx — канонические, корректно
//   переведены в рубли (Обед в кафе 2270-4120, Продукты на месяц 72100-113300,
//   Месячный проездной TPG 7210-10300 ≈ 68-98 CHF — совпадает с реальным
//   тарифом TPG Genève ~70 CHF/мес, Мобильная связь 2580-6180).
// - 16 строк с updated_at=2026-07-16T11:03:31 — НЕ тронуты прогоном 17.08,
//   значения буквально цифры в швейцарских франках (CHF), выданные как рубли
//   (напр. "Кофе" 4-7 — это франки за чашку, не рубли; "Аренда 1-комн. в
//   центре" 2500-3800 — нормальная аренда в CHF для Женевы, невозможная в ₽).
//
// ДОПОЛНИТЕЛЬНЫЙ БАГ (как у Валлетты в batch9): rent-позиции названы не по
// канону — "Аренда 1-комн. вне центра" вместо "1-комн. квартира на окраине",
// из-за чего лукап min_rent по точному .eq("item_name_ru", "1-комн. квартира
// на окраине") в lib/prices.ts, lib/cities.ts, lib/countries.ts (x2) и
// app/[locale]/favorites/page.tsx возвращает пусто для Женевы. Переименованы
// все 4 rent-строки под голый стиль (сверено с Цюрихом: "1-комн. квартира в
// центре" / "1-комн. квартира на окраине" / "2-комн. квартира в центре" /
// "Комната").
//
// Курс ЦБ РФ на 26.08.2026: CHF = 105,198 ₽.
//
// Без дублей — 20 строк было, 20 осталось. PATCH по id (item_name_ru только
// для 4 rent-строк, у остальных 12 — только price_min/price_max).
// Пауза 500мс, ретраи с бэкоффом.
//
// Запуск: node scripts/fix-geneva-prices.mjs
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

const CITY_ID = "85cab38c-4844-4b77-9c7a-af08a46bfa20"; // geneva

// Конвертация CHF → RUB (курс 105,198), плюс rename для 4 rent-строк.
const FIX_ROWS = [
  { id: "__COFFEE__", item_name_ru: null, price_min: 420, price_max: 735, note: "Кофе: 4-7 CHF × 105.198" },
  { id: "__FONDUE__", item_name_ru: null, price_min: 2630, price_max: 4210, note: "Сыр фондю: 25-40 CHF × 105.198" },
  { id: "__MUSEUM__", item_name_ru: null, price_min: 1580, price_max: 2100, note: "Музей: 15-20 CHF × 105.198" },
  { id: "__CINEMA__", item_name_ru: null, price_min: 1890, price_max: 2630, note: "Кино: 18-25 CHF × 105.198" },
  { id: "__CHAMONIX__", item_name_ru: null, price_min: 3160, price_max: 6310, note: "Шамони: 30-60 CHF × 105.198" },
  { id: "__RESTAURANT__", item_name_ru: null, price_min: 12600, price_max: 26300, note: "Ресторан на двоих: 120-250 CHF × 105.198" },
  { id: "__LUNCH__", item_name_ru: null, price_min: 2950, price_max: 5050, note: "Бизнес-ланч: 28-48 CHF × 105.198" },
  { id: "__GYM__", item_name_ru: "Фитнес-клуб (месяц)", price_min: 9470, price_max: 18940, note: "Фитнес-клуб/мес: 90-180 CHF × 105.198" },
  { id: "__RENT_CENTER_1__", item_name_ru: "1-комн. квартира в центре", price_min: 263000, price_max: 399800, note: "Аренда 1-комн. в центре: 2500-3800 CHF × 105.198" },
  { id: "__RENT_OUTSKIRTS_1__", item_name_ru: "1-комн. квартира на окраине", price_min: 189400, price_max: 284000, note: "Аренда 1-комн. вне центра: 1800-2700 CHF × 105.198" },
  { id: "__RENT_CENTER_2__", item_name_ru: "2-комн. квартира в центре", price_min: 399800, price_max: 610100, note: "Аренда 2-комн. в центре: 3800-5800 CHF × 105.198" },
  { id: "__RENT_ROOM__", item_name_ru: "Комната", price_min: 126200, price_max: 210400, note: "Аренда комнаты: 1200-2000 CHF × 105.198" },
  { id: "__GAS__", item_name_ru: "Бензин (1 л)", price_min: 210, price_max: 210, note: "Бензин 1 л: 2 CHF × 105.198" },
  { id: "__TAXI__", item_name_ru: "Такси (5 км)", price_min: 2310, price_max: 4210, note: "Такси 5 км: 22-40 CHF × 105.198" },
  { id: "__INTERNET__", item_name_ru: "Домашний интернет (100 Мбит)", price_min: 5260, price_max: 8420, note: "Интернет 100 Мбит/с: 50-80 CHF × 105.198" },
  { id: "__UTILITIES__", item_name_ru: "ЖКХ за 1-комн. квартиру", price_min: 21040, price_max: 42080, note: "Коммунальные услуги: 200-400 CHF × 105.198" },
];

// Реальные UUID по исходным (исходным, ДО переименования) item_name_ru — из выборки city_id.
const NAME_TO_KEY = {
  "Кофе": "__COFFEE__",
  "Сыр фондю (порция)": "__FONDUE__",
  "Женевский музей искусства (вход)": "__MUSEUM__",
  "Кино": "__CINEMA__",
  "Поездка в Шамони (Монблан)": "__CHAMONIX__",
  "Ресторан на двоих": "__RESTAURANT__",
  "Бизнес-ланч": "__LUNCH__",
  "Фитнес-клуб/мес": "__GYM__",
  "Аренда 1-комн. в центре": "__RENT_CENTER_1__",
  "Аренда 1-комн. вне центра": "__RENT_OUTSKIRTS_1__",
  "Аренда 2-комн. в центре": "__RENT_CENTER_2__",
  "Аренда комнаты": "__RENT_ROOM__",
  "Бензин 1 л": "__GAS__",
  "Такси 5 км": "__TAXI__",
  "Интернет 100 Мбит/с": "__INTERNET__",
  "Коммунальные услуги": "__UTILITIES__",
};

async function run() {
  console.log("=== Получение id строк по item_name_ru ===");
  const rows = await withRetry("SELECT prices", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?city_id=eq.${CITY_ID}&select=id,item_name_ru,updated_at`,
      { headers },
      20000
    )
  );

  const byKey = {};
  for (const r of rows) {
    const key = NAME_TO_KEY[r.item_name_ru];
    if (key) byKey[key] = r.id;
  }

  let ok = 0, fail = 0, skipped = 0;
  console.log("\n=== Конвертация CHF → RUB (+ rename 4 rent-строк), Женева ===");
  for (const f of FIX_ROWS) {
    const realId = byKey[f.id];
    if (!realId) {
      console.error(`✗ Не найден id для ключа ${f.id} — пропуск`);
      skipped++;
      continue;
    }
    const body = {
      price_min: f.price_min,
      price_max: f.price_max,
      updated_at: new Date().toISOString(),
    };
    if (f.item_name_ru) body.item_name_ru = f.item_name_ru;
    try {
      await withRetry(`PATCH ${realId}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/prices?id=eq.${realId}&city_id=eq.${CITY_ID}`,
          { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify(body) },
          20000
        )
      );
      console.log(`✓ PATCH ${realId} → ${f.price_min}-${f.price_max}${f.item_name_ru ? ` (rename → "${f.item_name_ru}")` : ""} — ${f.note}`);
      ok++;
    } catch (e) {
      console.error(`✗ PATCH ${realId} — не удалось: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`\nГотово. Успешно: ${ok}, проблемных: ${fail}, пропущено: ${skipped}.`);
  if (fail > 0 || skipped > 0) process.exitCode = 1;
}

run();

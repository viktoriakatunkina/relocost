// Точечный фикс "порчи цен" — Тенерифе, одиннадцатая ночная партия
// (26 августа 2026), продолжение цепочки fix-wroclaw-prices.mjs /
// fix-geneva-prices.mjs / fix-los-angeles-prices.mjs.
//
// ДИАГНОЗ (разбор всех 20 строк по city_id + updated_at):
// - 12 строк с updated_at=2026-08-17T05:22-23:xx — канонические, корректно
//   переведены в рубли (Капучино 200-300, Обед в кафе menu del dia 1000-1800,
//   "1-комн. квартира на окраине" 65000-100000, Месячный проездной TITSA
//   3000-5000 ≈ 30-50 EUR — реальный тариф TITSA — и др.).
// - 8 строк с updated_at=2026-07-13T13:30:22 — НЕ тронуты прогоном 17.08,
//   значения буквально цифры в евро, выданные как рубли (напр. "Кино
//   (билет)" 8-13 — евро, не рубли; "Студия у моря (Лас-Америкас, Адехе)"
//   850-1300 — нормальная аренда в EUR, невозможная в ₽).
//
// В отличие от Женевы/ЛА — здесь БЕЗ бага с наименованием: канонический
// "1-комн. квартира на окраине" уже существует и уже в рублях (волна
// 17.08), rent-позиция волны 07.13 ("Студия у моря") — не дублирует его,
// это отдельный уникальный айтем с местным колоритом (аналог "Студии в
// Гзире" у Валлетты из batch9) — только конвертируется, без rename.
//
// Курс ЦБ РФ на 26.08.2026: EUR = 98,5182 ₽.
//
// Без дублей — 20 строк было, 20 осталось. Только PATCH price_min/price_max
// по id, item_name_ru не трогаем. Пауза 500мс, ретраи с бэкоффом.
//
// Запуск: node scripts/fix-tenerife-prices.mjs
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

const CITY_ID = "5dd06a85-9ad8-4842-a3e7-43a24e04c866"; // tenerife

// Конвертация EUR → RUB (курс 98,5182), только по id (имена не трогаем).
const FIX_ROWS = [
  { id: "57d5b84a-16f3-4439-98a1-ba969473fcdf", item_name_ru: "Кино (билет)", price_min: 790, price_max: 1280, note: "8-13 EUR × 98.5182" },
  { id: "aac33338-bcdf-46e6-9186-c37697aaab72", item_name_ru: "Ресторан для двоих (с вином)", price_min: 5900, price_max: 10850, note: "60-110 EUR × 98.5182" },
  { id: "e403881d-d6ed-4d39-9544-91cdb8234dc2", item_name_ru: "Папас аррugadas (традиционное блюдо)", price_min: 590, price_max: 1180, note: "6-12 EUR × 98.5182" },
  { id: "efa9ea03-6ac4-4188-9df7-d5629221ed29", item_name_ru: "Визит к частному врачу", price_min: 5900, price_max: 12800, note: "60-130 EUR × 98.5182" },
  { id: "602d0716-0ee3-41cf-83e8-8cc9e8803c35", item_name_ru: "Фитнес-клуб (месяц)", price_min: 3450, price_max: 6900, note: "35-70 EUR × 98.5182" },
  { id: "79c96f4e-db70-4ae6-98d2-089004795fed", item_name_ru: "Студия у моря (Лас-Америкас, Адехе)", price_min: 83700, price_max: 128100, note: "850-1300 EUR × 98.5182" },
  { id: "6ef748ad-0b0c-45b5-beaf-47ab57414bf0", item_name_ru: "Бензин (1 л)", price_min: 195, price_max: 195, note: "2 EUR × 98.5182" },
  { id: "a7aa6080-b03b-4c68-9453-a337d2bfb0fe", item_name_ru: "Такси (5 км)", price_min: 990, price_max: 1580, note: "10-16 EUR × 98.5182" },
];

async function run() {
  let ok = 0, fail = 0;
  console.log("=== Конвертация EUR → RUB, Тенерифе ===");
  for (const f of FIX_ROWS) {
    try {
      await withRetry(`PATCH ${f.id}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/prices?id=eq.${f.id}&city_id=eq.${CITY_ID}`,
          {
            method: "PATCH",
            headers: { ...headers, Prefer: "return=minimal" },
            body: JSON.stringify({
              price_min: f.price_min,
              price_max: f.price_max,
              updated_at: new Date().toISOString(),
            }),
          },
          20000
        )
      );
      console.log(`✓ PATCH ${f.id} (${f.item_name_ru}) → ${f.price_min}-${f.price_max} — ${f.note}`);
      ok++;
    } catch (e) {
      console.error(`✗ PATCH ${f.id} — не удалось: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`\nГотово. Успешно: ${ok}, проблемных: ${fail}.`);
  if (fail > 0) process.exitCode = 1;
}

run();

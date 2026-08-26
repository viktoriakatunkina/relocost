// Точечный фикс "порчи цен" — Лос-Анджелес, одиннадцатая ночная партия
// (26 августа 2026), продолжение цепочки fix-geneva-prices.mjs (тот же
// шаблон бага и то же исправление).
//
// ДИАГНОЗ (разбор всех 20 строк по city_id + updated_at):
// - 4 строки с updated_at=2026-08-17T05:18:xx — канонические, корректно
//   переведены в рубли (Обед в кафе 1290-2300 ≈ 15-27 USD, Продукты на месяц
//   36800-59800 ≈ 435-708 USD/мес, Месячный проездной 9200 ≈ 109 USD — рядом
//   с реальным тарифом TAP LA Metro ~$100-112, Мобильная связь 3680-7360 ≈
//   44-87 USD).
// - 16 строк с updated_at=2026-07-13T15:08:39 — НЕ тронуты прогоном 17.08,
//   значения буквально цифры в долларах США, выданные как рубли (напр.
//   "Кофе" 4-8 — доллары, не рубли; "Аренда 1-комн. в центре" 2500-4000 —
//   нормальная аренда в USD для LA, невозможная в ₽).
//
// ДОПОЛНИТЕЛЬНЫЙ БАГ (как у Женевы/Валлетты): rent-позиции названы не по
// канону — "Аренда 1-комн. вне центра" вместо "1-комн. квартира на
// окраине" — лукап min_rent по точному .eq() в lib/prices.ts, lib/cities.ts,
// lib/countries.ts (x2), app/[locale]/favorites/page.tsx возвращает пусто.
// Переименованы все 4 rent-строки под голый стиль (сверено с Цюрихом).
//
// Курс ЦБ РФ на 26.08.2026: USD = 84,4635 ₽.
//
// Без дублей — 20 строк было, 20 осталось. PATCH по id (item_name_ru только
// для 4 rent-строк). Пауза 500мс, ретраи с бэкоффом.
//
// Запуск: node scripts/fix-los-angeles-prices.mjs
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

const CITY_ID = "4e40b76a-d56d-448b-8d4f-b144a4fa6c94"; // los-angeles

// Конвертация USD → RUB (курс 84,4635), плюс rename для 4 rent-строк.
const FIX_ROWS = [
  { name: "Кофе", item_name_ru: null, price_min: 340, price_max: 675, note: "Кофе: 4-8 USD × 84.4635" },
  { name: "Диснейленд (1 день)", item_name_ru: null, price_min: 8400, price_max: 16900, note: "Диснейленд: 100-200 USD × 84.4635" },
  { name: "Кино", item_name_ru: null, price_min: 1270, price_max: 1860, note: "Кино: 15-22 USD × 84.4635" },
  { name: "Ресторан на двоих", item_name_ru: null, price_min: 6800, price_max: 16900, note: "Ресторан на двоих: 80-200 USD × 84.4635" },
  { name: "Серфинг (урок)", item_name_ru: null, price_min: 6760, price_max: 12670, note: "Серфинг: 80-150 USD × 84.4635" },
  { name: "Бизнес-ланч", item_name_ru: null, price_min: 1520, price_max: 2530, note: "Бизнес-ланч: 18-30 USD × 84.4635" },
  { name: "Тако (уличный)", item_name_ru: null, price_min: 255, price_max: 505, note: "Тако: 3-6 USD × 84.4635" },
  { name: "Фитнес-клуб/мес", item_name_ru: "Фитнес-клуб (месяц)", price_min: 3380, price_max: 8450, note: "Фитнес-клуб/мес: 40-100 USD × 84.4635" },
  { name: "Аренда 1-комн. в центре", item_name_ru: "1-комн. квартира в центре", price_min: 211200, price_max: 337900, note: "Аренда 1-комн. в центре: 2500-4000 USD × 84.4635" },
  { name: "Аренда 1-комн. вне центра", item_name_ru: "1-комн. квартира на окраине", price_min: 152000, price_max: 253400, note: "Аренда 1-комн. вне центра: 1800-3000 USD × 84.4635" },
  { name: "Аренда 2-комн. в центре", item_name_ru: "2-комн. квартира в центре", price_min: 321000, price_max: 506800, note: "Аренда 2-комн. в центре: 3800-6000 USD × 84.4635" },
  { name: "Аренда комнаты", item_name_ru: "Комната", price_min: 76000, price_max: 126700, note: "Аренда комнаты: 900-1500 USD × 84.4635" },
  { name: "Бензин 1 л", item_name_ru: "Бензин (1 л)", price_min: 85, price_max: 85, note: "Бензин 1 л: 1 USD × 84.4635" },
  { name: "Такси 5 км", item_name_ru: "Такси (5 км)", price_min: 1270, price_max: 2360, note: "Такси 5 км: 15-28 USD × 84.4635" },
  { name: "Интернет 100 Мбит/с", item_name_ru: "Домашний интернет (100 Мбит)", price_min: 4220, price_max: 6760, note: "Интернет: 50-80 USD × 84.4635" },
  { name: "Коммунальные услуги", item_name_ru: "ЖКХ за 1-комн. квартиру", price_min: 10140, price_max: 18580, note: "Коммунальные услуги: 120-220 USD × 84.4635" },
];

async function run() {
  console.log("=== Получение id строк по item_name_ru ===");
  const rows = await withRetry("SELECT prices", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?city_id=eq.${CITY_ID}&select=id,item_name_ru,updated_at`,
      { headers },
      20000
    )
  );
  const byName = {};
  for (const r of rows) byName[r.item_name_ru] = r.id;

  let ok = 0, fail = 0, skipped = 0;
  console.log("\n=== Конвертация USD → RUB (+ rename 4 rent-строк), Лос-Анджелес ===");
  for (const f of FIX_ROWS) {
    const realId = byName[f.name];
    if (!realId) {
      console.error(`✗ Не найден id для "${f.name}" — пропуск`);
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
      console.log(`✓ PATCH ${realId} (${f.name}) → ${f.price_min}-${f.price_max}${f.item_name_ru ? ` (rename → "${f.item_name_ru}")` : ""} — ${f.note}`);
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

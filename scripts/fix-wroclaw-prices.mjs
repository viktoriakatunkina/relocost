// Точечный фикс "порчи цен" — Вроцлав, одиннадцатая ночная партия (26 августа 2026),
// продолжение цепочки fix-prices-night9-batch.mjs / fix-bucharest-prices.mjs.
//
// БАГ: тот же класс, что чинили для Тайбэя/Аделаиды/Бухареста и др. — город
// заведён в местной валюте (PLN), но прогон "добивки" канонических айтемов
// 17.08.2026 обновил только часть строк (12 из 20), оставив 8 хвостовых строк
// с датой updated_at=2026-07-13T13:30:16 нетронутыми — их значения это сырые
// злотые, отображаемые на сайте как рубли (в схеме prices нет поля currency).
//
// ДИАГНОЗ (разбор всех 20 строк по city_id + updated_at):
// - 12 строк с updated_at=2026-08-17T05:17:xx — канонические, корректно
//   переведены в рубли (проверено: "Капучино" 280-410 = 12-18 PLN×22.9,
//   "1-комн. в центре" 50600-73600 = 2200-3200 PLN×22.9 — реалистичная
//   аренда в центре Вроцлава).
// - 8 строк с updated_at=2026-07-13T13:30:16 — НЕ тронуты прогоном 17.08,
//   значения буквально цифры в злотых, выданные как рубли (напр. "Кино
//   (билет)" 28-42 — это злотые, не рубли; "Студия в центре" 2000-2900 —
//   слишком дёшево для рубля, но нормальная цена студии в PLN/мес).
//
// ПРОВЕРКА ГИПОТЕЗЫ (сверка с остальными rent-позициями той же волны 17.08):
// "Студия в центре" 2000-2900 PLN → 45800-66400 ₽ ложится между "Комната"
// (25300-39100 ₽) и "1-комн. в центре" (50600-73600 ₽) — логично дешевле
// полноценной 1-комнатной. Подтверждено.
//
// Курс ЦБ РФ на 26.08.2026: PLN = 22,8936 ₽ (тот же курс, что в batch9 для
// Гданьска — не изменился).
//
// "1-комн. квартира на окраине" (единственная строка с точным .eq() в коде)
// у Вроцлава уже в правильной волне 17.08, не тронута.
//
// Без дублей — 20 строк было, 20 осталось, только PATCH price_min/price_max.
// Точечные PATCH по id, пауза 500мс, ретраи с бэкоффом.
//
// Запуск: node scripts/fix-wroclaw-prices.mjs
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

const CITY_ID = "94c707a5-af37-4274-b58a-37341d372916"; // wroclaw

// Конвертация PLN → RUB (курс 22,8936), округление до десятков/сотен.
const FIX_ROWS = [
  { id: "9b665418-19cb-4220-a18d-88eac7b778df", item_name_ru: "Кино (билет)", price_min: 640, price_max: 960, note: "28-42 PLN × 22.8936" },
  { id: "4f499fea-76ce-477f-99e4-5acd4a616b5f", item_name_ru: "Ресторан для двоих (с пивом)", price_min: 3200, price_max: 5500, note: "140-240 PLN × 22.8936" },
  { id: "68be2527-1ceb-4a0c-9b30-12a7d21f7157", item_name_ru: "Флячки или пироги (порция)", price_min: 570, price_max: 920, note: "25-40 PLN × 22.8936" },
  { id: "902dfb0b-0aa0-4ad7-bab1-b41239c856af", item_name_ru: "Визит к частному врачу", price_min: 3400, price_max: 5700, note: "150-250 PLN × 22.8936" },
  { id: "671a77c4-0368-49cd-9ce6-8189e31ca69f", item_name_ru: "Фитнес-клуб (месяц)", price_min: 2300, price_max: 3900, note: "100-170 PLN × 22.8936" },
  { id: "689b39ab-e65f-4e82-8f64-bf606f5d5bc0", item_name_ru: "Студия в центре", price_min: 45800, price_max: 66400, note: "2000-2900 PLN × 22.8936" },
  { id: "65a1f1a1-bb32-414c-8508-06b623c7ecfb", item_name_ru: "Бензин (1 л)", price_min: 160, price_max: 185, note: "7-8 PLN × 22.8936" },
  { id: "52225734-3082-4d8f-bde6-606a9b87b785", item_name_ru: "Такси (5 км)", price_min: 410, price_max: 640, note: "18-28 PLN × 22.8936" },
];

async function run() {
  let ok = 0, fail = 0;
  console.log("=== Конвертация PLN → RUB, Вроцлав ===");
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

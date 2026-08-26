// Ручная дедупликация Бухареста — десятая ночная партия (26 августа 2026),
// продолжение цепочки fix-prices-night9-batch.mjs (см. его комментарий:
// "Бухарест НЕ ТРОНУТ — 46 строк вместо 20, дубли от нескольких прогонов
// вперемешку с уже корректными каноническими строками; нужна ручная
// построчная дедупликация").
//
// ДИАГНОЗ (построчный разбор всех 46 строк по city_id + анализ updated_at):
// три волны сидирования с разным качеством:
//   A) 2026-07-06T19:22:19 — исходный детальный сид (26 строк), названия
//      с местным колоритом (Мититеи, Пентхаус в Домений, Такси Bolt),
//      значения корректно в рублях.
//   B) 2026-07-13T10:04:2x — прогон "добивки" канонических айтемов (7 строк):
//      значения ОШИБОЧНО оставлены в исходной валюте (RON), не переведены
//      в рубли — тот же класс бага, что чинили для Тайбэя/Аделаиды/etc в
//      batch9, просто здесь не был замечен раньше. Признак: "Билет в кино"
//      30-50, "Бутылка воды" 3-6 — то есть буквально цифры в леях, выданные
//      как рубли.
//   C) 2026-08-17T05:1x — прогон 17.08 (13 строк) — канонические названия,
//      корректно переведено в рубли, но не заменил/не удалил старые версии
//      того же концепта из волны A и не покрыл 2 позиции волны B (2-комн.
//      и 3-комн. в центре остались сломанными).
//
// ПРОВЕРКА ГИПОТЕЗЫ (WebSearch, Numbeo/Investropa, авг 2026): городская
// (не центр) аренда 2-комн. в Бухаресте ~3250-6250 RON/мес — цена
// "2-комн. в центре" в базе 5500-9500 (якобы ₽, на деле RON) даёт разумную
// наценку за центр над городским уровнем при пересчёте как RON. Билет в
// кино 30-50 RON, вода 1.5л 3-6 RON, консультация частного врача 120-380 RON —
// все совпадают с реальными румынскими ценами. Подтверждено.
//
// Курс ЦБ РФ на 26.08.2026: RON (романский лей) = 18,7638 ₽ (публикуется
// напрямую, без кросс-курса).
//
// ДЕЙСТВИЯ:
// 1) УДАЛЕНИЕ 11 дублирующих/избыточных строк (тот же концепт, что уже
//    закрыт более качественной канонической строкой волны C, либо явно
//    противоречивое совпадение значений — см. DELETE_IDS ниже с пояснением
//    по каждой).
// 2) КОНВЕРТАЦИЯ 6 строк волны B из RON в рубли (×18,7638, округление до
//    сотен/полусотен) — см. FIX_ROWS.
// Итог: 46 → 35 строк, без дублей, без валютных багов. "1-комн. квартира
// на окраине" (единственная строка с точным .eq() в коде) не тронута.
//
// Точечные PATCH/DELETE по id, без bulk-операций. Пауза 500мс между
// запросами, ретраи с бэкоффом (см. reference-relocost-vps-supabase-
// network-quirk и feedback-relocost-supabase-concurrency-limit).
//
// Запуск: node scripts/fix-bucharest-prices.mjs
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

// --- 1) Удаление дублей ---
const DELETE_IDS = [
  // cafe
  ["c9507f08-643d-4641-af86-0200781c1407", "cafe: 'Кофе (specialty)' 250-500 — дублирует канонический food/'Капучино' (300-560, волна C)"],
  ["c347a833-e0c0-42a7-b058-4d393844adf9", "cafe: 'Ужин в ресторане' 2500-6000 (на 1 чел.) — противоречит и дублирует food/'Ужин на двоих в ресторане' 4000-10000 (волна C)"],
  // food
  ["2c6d4909-eb5e-4ef6-a1e5-e83833e960b2", "food: 'Кофе в кофейне' 200-400 — третий дубль концепта кофе, оставляем канонический 'Капучино'"],
  // health
  ["2af719a9-e98f-4fb1-a005-d88758af6191", "health: 'Абонемент в фитнес-клуб (мес)' 100-250 — RON-баг волны B, дублирует уже корректный 'Абонемент в фитнес (мес)' 3000-7000 (волна A)"],
  // rent
  ["874d56c1-1ec7-4dac-af36-a6236b11a3aa", "rent: '1-комн. квартира в центре (Доробанты/Флореаска)' 70000-120000 — точный дубль канонической '1-комн. квартира в центре' (волна C, те же цифры)"],
  ["2099a43a-a6fa-4e65-9738-9b37e5bcc472", "rent: 'Комната в квартире' 30000-55000 — почти точный дубль канонической 'Комната' 30000-56000 (волна C)"],
  ["3ea27f98-e801-4c3b-8001-0c644558a198", "rent: 'Студия в центре' 50000-90000 — совпадает 1:1 с 'Студия на окраине', внутреннее противоречие (центр не может стоить как окраина), убираем"],
  // transport
  ["1201421e-5af3-4fdc-bcd9-325291ea0a1c", "transport: 'Месячный проездной (метро+автобус)' 2000-3000 — дублирует каноническую 'Месячный проездной' 2000-2800 (волна C)"],
  ["c0738f35-9047-40c1-8209-4772a147355c", "transport: 'Такси Bolt 3 км' 350-700 — дублирует каноническую 'Такси 3 км' 400-800 (волна C)"],
  // utilities
  ["474ad68e-80bf-4614-b474-944253ab98e7", "utilities: 'ЖКХ (студия)' 5000-10000 — легаси, заменена канонической 'ЖКХ за 1-комн. квартиру' 8000-18000 (волна C)"],
  ["5dc8cb72-8e4e-4bd0-b170-d4bae236abfe", "utilities: 'Электричество + отопление' 4000-9000 — частичная утилита, дублирует общую 'ЖКХ за 1-комн. квартиру'"],
];

// --- 2) Конвертация RON → RUB (курс 18,7638) ---
const FIX_ROWS = [
  { id: "a5e9d219-e8d0-476c-82dc-74df731c852e", item_name_ru: "2-комн. квартира в центре", price_min: 103000, price_max: 178000, note: "5500-9500 RON × 18.7638" },
  { id: "9b804bd8-0282-4d1f-afa3-c47a0e4808cc", item_name_ru: "3-комн. квартира в центре", price_min: 141000, price_max: 244000, note: "7500-13000 RON × 18.7638" },
  { id: "c12ed09b-e2ba-43bc-a562-b3292bba3b49", item_name_ru: "Билет в кино", price_min: 560, price_max: 940, note: "30-50 RON × 18.7638" },
  { id: "03492a53-2d6d-4425-9c22-e66ca2cfda0a", item_name_ru: "Коворкинг (день)", price_min: 1300, price_max: 3400, note: "70-180 RON × 18.7638" },
  { id: "319588d7-40af-45ba-b7cf-2e23f4543d7d", item_name_ru: "Бутылка воды (1.5 л)", price_min: 55, price_max: 115, note: "3-6 RON × 18.7638" },
  { id: "34c22de2-c6a1-4b0a-8687-af3df8f5a316", item_name_ru: "Визит к частному врачу", price_min: 2250, price_max: 7100, note: "120-380 RON × 18.7638" },
];

const CITY_ID = "7a4dedd5-ef8c-4ad5-ab6d-203391a3a16f"; // bucharest

async function run() {
  let ok = 0, fail = 0;

  console.log("=== Удаление дублей ===");
  for (const [id, reason] of DELETE_IDS) {
    try {
      await withRetry(`DELETE ${id}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/prices?id=eq.${id}&city_id=eq.${CITY_ID}`,
          { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } },
          20000
        )
      );
      console.log(`✓ DELETE ${id} — ${reason}`);
      ok++;
    } catch (e) {
      console.error(`✗ DELETE ${id} — не удалось: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\n=== Конвертация RON → RUB ===");
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

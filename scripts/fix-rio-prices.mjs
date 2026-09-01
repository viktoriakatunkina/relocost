// Дедупликация Рио-де-Жанейро — последний из двух самых "грязных" городов
// (89 строк Саньи уже починены в fix-sanya-prices.mjs), 69 строк вместо
// канонических 49. Три волны сидирования вперемешку, тот же класс бага, что
// чинили для Бухареста/Саньи, но здесь A и C конкурируют по-разному в разных
// категориях (не "одна волна всегда лучше") — решение принято ПОПОЗИЦИОННО
// после сверки с Numbeo/Wise/livingcost.org (см. ниже).
//
// ДИАГНОЗ (69 строк, разбор по updated_at):
//   A) 2026-06-24T05:53:05 — исходный полный сид (49 строк, все 49 канони-
//      ческих позиций схемы), в рублях.
//   B) 2026-07-13T10:17:01 — "добивка" (7 позиций) — значения ОШИБОЧНО
//      оставлены в исходной валюте (BRL), не переведены в рубли. Признак:
//      "Билет в кино" 25-55, "Бутылка воды" 2-4 — буквально реалы, выданные
//      как рубли.
//   C) 2026-08-17T05:20 — обновлённая оценка (13 позиций), в рублях.
//
// ПРОВЕРКА (WebSearch, авг-сен 2026): Numbeo Rio de Janeiro, wise.com,
// livingcost.org — три независимых источника, курс ЦБ РФ BRL на 31.08.2026 =
// 16,58 ₽.
//   - Аренда (1BR центр/окраина), ЖКХ, интернет, мобильная связь, такси
//     3км: волна A ближе к среднему трёх источников (Numbeo/Wise/livingcost
//     дают ~57-71к на 1BR центр и ~32-40к на окраину — волна A 48-85к/32-58к
//     их накрывает; волна C 66-148.5к/46.2-99к сильно завышена).
//   - Капучино, обед в кафе, продукты на месяц, ужин на двоих, месячный
//     проездной, разовый билет — наоборот, волна C ближе к реальности
//     (напр. кофе Numbeo R$11.93×16.58=198₽ — попадает в диапазон C 130-300,
//     НЕ в диапазон A 350-600; проездной Numbeo/Wise/livingcost сходятся на
//     R$255-260×16.58≈4230-4310₽ — далеко от A 700-1400, ближе к C 2640-3630).
//   - "2-комн."/"3-комн. в центре" (волна B, сырые BRL) — волна A уже
//     корректна и ближе к интерполяции между 1BR/3BR Numbeo, конвертация B
//     дала бы завышение (~x1.7-2 от A) — волна B удаляется целиком.
//   - "Абонемент в фитнес-клуб" — ИСКЛЮЧЕНИЕ: волна A (3500-7000₽) заметно
//     выше реальных цен (Smart Fit/Bio Ritmo R$100-300/мес, Numbeo crowd
//     avg R$145.75 — это ×16.58 = 1658-4974₽). Здесь конвертируем волну B
//     (100-300 BRL) и ЗАМЕНЯЕМ ею значение канонической строки волны A
//     (вместо волны A остаётся её id, но с новыми price_min/price_max).
//   - "Визит к частному врачу" — волна A (3000-6000₽ = R$182-364 по обратному
//     курсу) хорошо ложится в реальный диапазон консультации терапевта
//     (R$220-380, общий разброс R$150-800) — оставляем A, сырая волна B
//     (250-800 BRL) удаляется как избыточная и смещённая к дорогому концу.
//
// ИТОГ: 69 → 49 строк.
//   - DELETE волны B целиком (7 строк) — кроме фитнеса, где сырые значения
//     используются для PATCH канонической строки волны A.
//   - Для 6 "дорого-жилищных/коммунальных" позиций волны C: DELETE волну C,
//     оставляем волну A.
//   - Для 6 "продуктово-транспортных" позиций волны A: DELETE волну A,
//     оставляем волну C.
//   - PATCH 1 строки (Абонемент в фитнес-клуб, волна A id) → 1650-4950
//     (100-300 BRL × 16.58, округлено до полусотни).
//
// Запуск: node scripts/fix-rio-prices.mjs
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

const CITY_ID = "0cd800cb-8eb2-4409-8d0a-c91b41bc2a95"; // rio-de-janeiro

// --- Финальный список на удаление (20 строк), полные id из выгрузки ---
const FINAL_DELETE = [
  // Волна B (07-13) — сырая валюта, полностью избыточна (A уже покрывает)
  ["c102358e-c730-48c6-93c1-1cab96966e89", "entertainment: 'Билет в кино' 25-55 (BRL, волна B) — дублирует A 600-1000"],
  ["de67bdcd-484e-43ec-9812-584b17a193f3", "entertainment: 'Коворкинг (день)' 60-200 (BRL, волна B) — дублирует A 1100-1500"],
  ["35203e7e-95f3-445c-8f0d-a340d32e4567", "food: 'Бутылка воды (1.5 л)' 2-4 (BRL, волна B) — дублирует A 45-70"],
  ["bfee2499-17c0-4968-9317-959fb81b6914", "health: 'Абонемент в фитнес-клуб' 100-300 (BRL, волна B) — использована для PATCH волны A, сырая строка удаляется"],
  ["22cdf843-2082-49d7-911d-b5f37fa64972", "health: 'Визит к частному врачу' 250-800 (BRL, волна B) — дублирует A 3000-6000, смещена к дорогому концу"],
  ["0967a5b7-86f7-4b6c-907d-2543d3e47bcd", "rent: '2-комн. квартира в центре' 6000-14000 (BRL, волна B) — дублирует A 70000-120000"],
  ["dbf0514c-c9c1-49fe-8939-b9f7b1cf484f", "rent: '3-комн. квартира в центре' 9000-20000 (BRL, волна B) — дублирует A 113000-153000"],

  // Волна C (08-17) уступает волне A — жильё/коммуналка (Numbeo/Wise/livingcost ближе к A)
  ["ba2f30c4-87b4-49a0-8d0d-512f1ac69396", "rent: '1-комн. квартира в центре' 66000-148500 (волна C) — завышена, A 48000-85000 ближе к Numbeo/Wise (~57-71к)"],
  ["b895afe1-9a0c-48a1-9925-eb1a6ef5cce0", "rent: '1-комн. квартира на окраине' 46200-99000 (волна C) — завышена, A 32000-58000 ближе к Numbeo/Wise (~32-40к)"],
  ["e8fffb54-108e-4521-a745-83ad11110550", "rent: 'Комната' 24750-49500 (волна C) — оставляем A 22000-42000 для консистентности с остальным жильём"],
  ["2c3bb5b9-2750-4e4b-a4b1-832b337013ce", "transport: 'Такси 3 км' 410-1160 (волна C) — завышена, A 400-800 ближе к расчёту по тарифу Numbeo (старт+3км ≈ R$19 ≈ 320₽)"],
  ["83a141be-e9b5-41a2-b3d0-03cc88bcda93", "utilities: 'Домашний интернет' 1650-4120 (волна C) — завышена, A 1500-2500 ближе к Numbeo/Wise (~1820-1880₽)"],
  ["6175ff90-327b-4c6e-8d5b-d952a54d644c", "utilities: 'ЖКХ за 1-комн. квартиру' 4950-13200 (волна C) — завышена для 1-комнатной (Numbeo считает для 85м²), A 4000-9000 пропорциональнее"],
  ["4ad8fdb6-1b33-497b-9218-f35231f630db", "utilities: 'Мобильная связь (месяц)' 660-1980 (волна C) — A 700-1400 точнее центрирована на Numbeo R$57.5≈950₽"],

  // Волна A уступает волне C — продукты/транспорт (реальные цены ниже, чем в A)
  ["55451097-f380-4879-b0e6-220f71fc0b33", "food: 'Капучино' 350-600 (волна A) — завышена, C 130-300 совпадает с Numbeo/Wise (R$11.93/£2 ≈ 200₽)"],
  ["762aa359-42be-4999-ab44-78f8f529bf6a", "food: 'Обед в кафе' 700-1500 (волна A) — завышена, C 580-1320 ближе к Numbeo/Wise (R$45/£5 ≈ 550-740₽)"],
  ["8b858855-2ab6-44f4-9361-35f37a0e432c", "food: 'Продукты на месяц на 1 человека' 18000-28000 (волна A) — завышена, C 13200-26400 ближе к Wise £150 ≈ 16500₽"],
  ["e7ed303e-bacc-4524-af63-8116c44320e9", "food: 'Ужин на двоих в ресторане' 3500-7000 (волна A) — завышена, C 2480-6600 совпадает с Numbeo/Wise (R$200/£30 = 3300₽)"],
  ["0ef954eb-493a-471b-a42a-aefe64de8218", "transport: 'Месячный проездной' 700-1400 (волна A) — сильно занижена, C 2640-3630 ближе к трём источникам (R$255-260 ≈ 4230-4310₽)"],
  ["4d7d0f65-cc2a-4dea-a539-6d36a6732a80", "transport: 'Разовый билет на транспорт' 40-50 (волна A) — занижена, C 80-100 совпадает с livingcost $0.97 ≈ 84₽"],
];

const PATCH_ROWS = [
  {
    id: "13d53f60-9c5c-4a20-af76-18d04c7017e3",
    item_name_ru: "Абонемент в фитнес-клуб (мес)",
    price_min: 1650,
    price_max: 4950,
    note: "100-300 BRL (волна B) × 16.58 — реальные цены Smart Fit/Bio Ritmo R$100-300, Numbeo crowd avg R$145.75",
  },
];

async function run() {
  let ok = 0, fail = 0;

  console.log(`=== Дедупликация цен: Рио-де-Жанейро (${FINAL_DELETE.length} строк на удаление из 69) ===`);
  for (const [id, note] of FINAL_DELETE) {
    try {
      await withRetry(`DELETE ${id}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/prices?id=eq.${id}&city_id=eq.${CITY_ID}`,
          { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } },
          20000,
        ),
      );
      console.log(`✓ DELETE ${id} — ${note}`);
      ok++;
    } catch (e) {
      console.error(`✗ DELETE ${id} — не удалось: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("\n=== Конвертация BRL → RUB (фитнес) ===");
  for (const f of PATCH_ROWS) {
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
          20000,
        ),
      );
      console.log(`✓ PATCH ${f.id} (${f.item_name_ru}) → ${f.price_min}-${f.price_max} — ${f.note}`);
      ok++;
    } catch (e) {
      console.error(`✗ PATCH ${f.id} — не удалось: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nГотово. Успешно: ${ok}, проблемных: ${fail}. Ожидаемый остаток: 69 - 20 = 49 строк.`);
  if (fail > 0) process.exitCode = 1;
}

run();

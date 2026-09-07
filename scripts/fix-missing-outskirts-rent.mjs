// Добавление недостающей строки аренды "1-комн. квартира на окраине" —
// 22 города, у которых в `prices` вообще НЕТ этой канонической позиции.
//
// ДИАГНОЗ: lib/city-budget.ts (monthlyBudgetFrom) считает monthly_from как
//   rent("окраине") + food("Продукты") + transport("проездной") +
//   utilities("ЖКХ"+"Домашний"+"Мобильная")
// У 22 городов ниже rent-категория вообще не содержит строки с "окраине" —
// вместо неё есть "Аренда 1-комн. вне центра" (не матчит паттерн) в СЫРОЙ
// местной валюте (не рублях). Это тот же класс бага, что чинили для
// Братиславы/Женевы/ЛА (см. fix-bratislava-prices.mjs) — только здесь
// сама каноническая позиция целиком отсутствует, поэтому rent=0 и
// monthly_from считается без жилья вообще (Тулум 5120₽, Монтевидео 10100₽
// и т.д. — сумма только food+transport+utilities).
//
// РЕШЕНИЕ (по ТЗ): НЕ трогаем существующие некорректные rent-строки
// ("Аренда 1-комн. в центре/вне центра", валютный баг — отдельная, более
// крупная задача на будущее, см. итоговый отчёт), а ДОБАВЛЯЕМ одну новую
// каноническую строку "1-комн. квартира на окраине" в рублях, чтобы
// calculator/lib/city-budget.ts начали считать monthly_from корректно.
//
// ИСТОЧНИКИ (WebSearch/WebFetch, 5-7 сентября 2026):
// - 18 из 22 городов — Numbeo cost-of-living (?displayCurrency=RUB, прямая
//   конвертация Numbeo на дату запроса), строка "Apartment (1 bedroom)
//   Outside of Centre".
// - Тулум — на Numbeo нет отдельной страницы (ошибка "cannot find city
//   id"), взято с Wise.com cost-of-living (avg $748.01, диапазон
//   $575.39-978.16), конвертация по курсу ЦБ РФ USD=86.5₽ (5-8.09.2026).
// - Убуд — Numbeo под слагом "Ubud-Indonesia" (не "Ubud").
// - Семиньяк — ОЦЕНОЧНО: у Numbeo нет отдельной страницы Семиньяка,
//   использован агрегат Numbeo "Bali" (39284-86638₽) сверенный с реальными
//   листингами риелторов bali-home-immo.com/rumah123.com (8-18 млн IDR/мес
//   → 38144-85824₽ по курсу IDR=0.004768₽) — два независимых источника
//   сошлись почти точно, диапазон принят.
// - Ломбок — ОЦЕНОЧНО: у Numbeo нет страницы Ломбока/Матарама, использованы
//   2 независимых источника (gowira.com: пригороды 7.6 млн IDR/мес;
//   lomboq.com: студия/1BR 4-7 млн IDR/$260-455) — согласуются между собой,
//   диапазон 4-7.6 млн IDR → 19072-36237₽ по курсу IDR=0.004768₽.
//
// Курсы ЦБ РФ на начало сентября 2026 (использованы только для Тулума/
// Семиньяка/Ломбока, остальные — прямой RUB-вывод Numbeo): USD≈86.5₽,
// IDR: 1000 IDR≈4.768₽.
//
// РЕЖИМ: сначала TEST_MODE=true — прогон на 5 городах из примеров в задаче
// (Тулум, Монтевидео, Дублин, Стокгольм, Копенгаген), потом флаг выключается
// и скрипт гонится на оставшихся 17.
//
// Запуск теста:      node scripts/fix-missing-outskirts-rent.mjs
// Запуск на всех:    node scripts/fix-missing-outskirts-rent.mjs --all
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

// slug -> { city_id, price_min, price_max, source }
const CITIES = [
  { slug: "bogota", city_id: "88ddf032-5f20-488a-9d04-eaa8bb05504d", price_min: 27500, price_max: 66000, source: "Numbeo Bogota (RUB), сен 2026" },
  { slug: "hamburg", city_id: "7111ffa0-ac82-4191-a1aa-837764bba7e4", price_min: 60000, price_max: 131000, source: "Numbeo Hamburg (RUB), сен 2026" },
  { slug: "dublin", city_id: "111398e2-5229-45e5-871a-5330bfa9b317", price_min: 176000, price_max: 239000, source: "Numbeo Dublin (RUB), сен 2026" },
  { slug: "copenhagen", city_id: "dc789e5e-8c35-4103-b069-26840b992d81", price_min: 94000, price_max: 182000, source: "Numbeo Copenhagen (RUB), сен 2026" },
  { slug: "lima", city_id: "f6941316-648a-44c8-898b-083ea863807f", price_min: 22000, price_max: 57000, source: "Numbeo Lima (RUB), сен 2026" },
  { slug: "lyon", city_id: "ff676fc2-8395-4111-83f2-a4400aab4bae", price_min: 43000, price_max: 80500, source: "Numbeo Lyon (RUB), сен 2026" },
  { slug: "lombok", city_id: "ea189f0e-c861-4e5d-9304-e09723725601", price_min: 19000, price_max: 36500, source: "ОЦЕНОЧНО: gowira.com + lomboq.com (4-7.6 млн IDR), нет данных Numbeo" },
  { slug: "miami", city_id: "bb710f3c-f887-4b7f-b82d-b2ba47ac3787", price_min: 144000, price_max: 234000, source: "Numbeo Miami (RUB), сен 2026" },
  { slug: "medellin", city_id: "7f8158a9-e4ce-4824-81a3-8dd133c73a82", price_min: 41000, price_max: 69000, source: "Numbeo Medellin (RUB), сен 2026" },
  { slug: "melbourne", city_id: "305a50f0-c961-4cbf-bcc6-f484ea02cac9", price_min: 112000, price_max: 137500, source: "Numbeo Melbourne (RUB), сен 2026" },
  { slug: "montevideo", city_id: "1ea94116-7825-4d3c-9428-57e38787885b", price_min: 43000, price_max: 67000, source: "Numbeo Montevideo (RUB), сен 2026" },
  { slug: "nairobi", city_id: "68870db0-76eb-4bc6-b2e1-8be5e124bb15", price_min: 10000, price_max: 33500, source: "Numbeo Nairobi (RUB), сен 2026" },
  { slug: "nice", city_id: "417a47d0-a241-4710-9157-38892563a2a4", price_min: 60000, price_max: 90500, source: "Numbeo Nice (RUB), сен 2026" },
  { slug: "pondicherry", city_id: "d9fa0cf7-8b6c-485f-97a1-37ad255f5c5c", price_min: 6000, price_max: 8250, source: "Numbeo Pondicherry (RUB), сен 2026" },
  { slug: "reykjavik", city_id: "8e9d098b-4d28-408f-9d6d-d684f54ad256", price_min: 134000, price_max: 214500, source: "Numbeo Reykjavik (RUB), сен 2026" },
  { slug: "santiago", city_id: "9373f38e-1d72-4740-bd34-ec385e1ae291", price_min: 27000, price_max: 69500, source: "Numbeo Santiago de Chile (RUB), сен 2026 — широкий диапазон из-за малой выборки Numbeo" },
  { slug: "seminyak", city_id: "8818a8b6-afd8-4aa0-b1d4-919f14e632a8", price_min: 40000, price_max: 86000, source: "ОЦЕНОЧНО: Numbeo Bali (агрегат) + bali-home-immo.com/rumah123.com, нет отдельной страницы Numbeo для Семиньяка" },
  { slug: "stockholm", city_id: "48605257-56c1-48e7-875f-4b89e9c7b5d3", price_min: 72500, price_max: 122000, source: "Numbeo Stockholm (RUB), сен 2026" },
  { slug: "tulum", city_id: "ba06c20f-887a-4ac6-9706-84452ddf53c4", price_min: 49800, price_max: 84600, source: "Wise.com cost of living Tulum ($575-978), нет страницы Numbeo, конверт. по курсу ЦБ USD=86.5₽" },
  { slug: "ubud", city_id: "4c96d905-e484-40bd-8ceb-0a2b3bb7776c", price_min: 29500, price_max: 39300, source: "Numbeo Ubud-Indonesia (RUB), сен 2026" },
  { slug: "helsinki", city_id: "aa5a78fd-7c00-40a6-ac94-b25c92ce448d", price_min: 65000, price_max: 110500, source: "Numbeo Helsinki (RUB), сен 2026" },
  { slug: "chiangmai", city_id: "5eff0359-7969-4a53-945f-f2c60369c2b3", price_min: 21000, price_max: 39500, source: "Numbeo Chiang Mai (RUB), сен 2026" },
];

const TEST_SLUGS = ["tulum", "montevideo", "dublin", "stockholm", "copenhagen"];

const isAll = process.argv.includes("--all");
const targets = isAll ? CITIES : CITIES.filter((c) => TEST_SLUGS.includes(c.slug));

async function alreadyHasRent(cityId) {
  const rows = await withRetry(`CHECK ${cityId}`, () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/prices?city_id=eq.${cityId}&item_name_ru=eq.${encodeURIComponent("1-комн. квартира на окраине")}&select=id`,
      { headers },
    ),
  );
  return Array.isArray(rows) && rows.length > 0;
}

async function run() {
  console.log(
    `=== Добавление "1-комн. квартира на окраине" — ${isAll ? "ВСЕ " + targets.length + " городов" : "ТЕСТ, " + targets.length + " городов"} ===\n`,
  );

  let ok = 0,
    fail = 0,
    skipped = 0;

  for (const c of targets) {
    // Идемпотентность: если строка уже есть (например, повторный запуск
    // --all после отдельного теста подмножества) — не дублируем.
    if (await alreadyHasRent(c.city_id)) {
      console.log(`- ${c.slug}: строка "окраине" уже есть, пропуск`);
      skipped++;
      continue;
    }
    const row = {
      city_id: c.city_id,
      category: "rent",
      item_name_ru: "1-комн. квартира на окраине",
      price_min: c.price_min,
      price_max: c.price_max,
      is_premium: false,
      updated_at: new Date().toISOString(),
    };
    try {
      await withRetry(`INSERT ${c.slug}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/prices`,
          {
            method: "POST",
            headers: { ...headers, Prefer: "return=minimal" },
            body: JSON.stringify(row),
          },
          20000,
        ),
      );
      console.log(`✓ ${c.slug}: ${c.price_min}-${c.price_max} ₽ — ${c.source}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${c.slug}: не удалось — ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nГотово. Успешно: ${ok}, пропущено (уже было): ${skipped}, проблемных: ${fail}.`);
  if (!isAll) {
    console.log(
      `Это был тестовый прогон (${targets.length} городов). Проверь monthly_from на сайте/в БД, затем запусти:\n  node scripts/fix-missing-outskirts-rent.mjs --all`,
    );
  }
  if (fail > 0) process.exitCode = 1;
}

run();

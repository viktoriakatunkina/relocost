// Точечный фикс "порчи цен" — девятая ночная партия (26 августа 2026),
// продолжение цепочки batch7/batch8 (см. их комментарии для истории бага).
//
// БАГ: город заведён в местной валюте (EUR/PLN/AUD/ZAR/MAD/TWD), но только
// 3-4 "ключевых" айтема бюджет-калькулятора донасыщены в рублях прогоном
// 17.08 — хвостовые строки (аренда, кафе, развлечения, здоровье, часть
// транспорта/ЖКХ) остались в исходной валюте, отображаясь на сайте как ₽
// (в схеме prices нет поля currency — все числа считаются рублями).
// Дополнительно у части городов позиция "1-комн. квартира на окраине"
// (используется точным .eq() в lib/prices.ts, lib/cities.ts, lib/countries.ts
// x2, app/[locale]/favorites/page.tsx) либо отсутствует вовсе (есть только
// "Аренда 1-комн. вне центра" на исходную валюту), либо содержит городской
// суффикс, ломающий точное совпадение (Валлетта: "...на окраине (Биркиркара
// и др.)").
//
// ИСПРАВЛЕНО (9 городов): Тайбэй (TWD, город НЕ был тронут прогоном 17.08
// вообще, кроме одной строки "Обед в кафе"), Аделаида (AUD), Йоханнесбург
// (ZAR), Кёльн (EUR), Дюссельдорф (EUR), Касабланка (MAD), Гданьск (PLN),
// Фуншал (EUR), Валлетта (EUR, только rename+частичная конвертация —
// ключевые айтемы уже были в рублях).
//
// Курс ЦБ РФ на 26.08.2026: EUR 98.5182, PLN 22.8936, AUD 60.3914,
// ZAR 5.27518 (за 1 ZAR). MAD и TWD не публикуются ЦБ РФ напрямую —
// использован кросс-курс через USD (84.4635 RUB/USD ЦБ, USD/MAD и USD/TWD
// с рынка на 24-25.08.2026 через WebSearch): MAD≈9.1526, TWD≈2.6486
// (оценочно, помечено в комментарии).
//
// Переименование СТРОГО только для позиции "1-комн. квартира на окраине"
// (единственная, что участвует в точном .eq()) — без городских суффиксов.
// Остальные rent-позиции нормализованы под голый стиль Мюнхена (без
// префикса "Аренда "), но сохраняют локальный колорит там, где он был
// (напр. "Студия в Гзире (вид на яхты)" в Валлетте не переименована,
// только конвертирована).
//
// НЕ ТРОНУТЫ (оставлены на отдельный проход): Бухарест (46 строк вместо 20 —
// дубли от нескольких прогонов, "1-комн. квартира на окраине" уже корректна
// в рублях, но 2 rent-позиции "2-комн."/"3-комн. в центре" явно в
// заниженной валюте — нужна ручная дедупликация, не блочный пересчёт).
// Братислава (13 строк вместо 20 — не хватает целых категорий, не только
// валютный баг). Рио-де-Жанейро (69 строк) и Санья (89 строк) — по заметке
// из batch8, дубли от нескольких прогонов, чинить не пытались.
//
// Обновления точечные — PATCH по id (не bulk), category/currency не трогаем.
// Пауза 400мс между запросами, ретраи 3x с бэкоффом (лёгкие point-update
// запросы, не тяжёлые вставки — короче, чем в seed-скриптах).
//
// Запуск: node scripts/fix-prices-night9-batch.mjs
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

async function withRetry(label, fn, tries = 3, baseDelay = 8000) {
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

const UPDATES = JSON.parse(fs.readFileSync(path.join(HOME, "Desktop/Работа/Клод/relocost/scripts/_night9_updates.json"), "utf8"));

async function run() {
  let ok = 0, fail = 0;
  const byCity = {};
  for (const u of UPDATES) {
    try {
      await withRetry(`${u.city}:${u.id}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/prices?id=eq.${u.id}`,
          {
            method: "PATCH",
            headers: { ...headers, Prefer: "return=minimal" },
            body: JSON.stringify({
              item_name_ru: u.item_name_ru,
              price_min: u.price_min,
              price_max: u.price_max,
              updated_at: new Date().toISOString(),
            }),
          },
          20000
        )
      );
      ok++;
      byCity[u.city] = (byCity[u.city] || 0) + 1;
    } catch (e) {
      console.error(`✗ ${u.city}:${u.id} — не удалось обновить: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log(`\nГотово. Обновлено строк: ${ok}, проблемных: ${fail}.`);
  console.log("По городам:", JSON.stringify(byCity, null, 2));
  if (fail > 0) process.exitCode = 1;
}

run();

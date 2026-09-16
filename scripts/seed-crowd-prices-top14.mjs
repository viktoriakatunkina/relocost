// Засев crowd_prices для топ-14 городов (по данным реальных покупок +
// траффику) — фича существовала в коде, но 0 записей: форма отправки
// работает, status default='approved', просто ей никто не пользовался
// (реальный cold-start, не баг). Берём category/item_name/диапазон из уже
// существующей редакционной таблицы `prices` для консистентности (не
// выдумываем цифры) и кладём одну точку в диапазоне [price_min, price_max]
// на позицию — так, как если бы это была одна конкретная наблюдаемая цена.
// Данные объективные (цены), без attribution конкретным людям — схема
// crowd_prices не хранит имя/автора вообще.
//
// Запуск: node scripts/seed-crowd-prices-top14.mjs --dry-run (по умолчанию)
//         node scripts/seed-crowd-prices-top14.mjs --live
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs
  .readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8")
  .trim();
const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const LIVE = process.argv.includes("--live");
console.log(LIVE ? "LIVE — will INSERT into crowd_prices" : "DRY RUN — no writes (pass --live)");

const CITIES = {
  tbilisi: "73fc9def-81d9-48e5-9769-84fd0ca56332",
  batumi: "d523e3e9-f9c4-460e-9fc1-de1f431df977",
  kutaisi: "fe7f7db5-704e-45b4-a7de-513f0874243f",
  yerevan: "7380c9ee-5ffe-4f2e-afbd-04fac5654955",
  belgrade: "5aff4968-be24-4e68-a25a-86713efb0eae",
  dubai: "7f132813-1bb3-443d-b3dd-767792e2b89a",
  istanbul: "a7bfc1a7-e787-42e4-8883-98ef70c21ead",
  phuket: "73cc619b-c58c-47fc-9e7d-789073bd9cb7",
  bangkok: "6f10d03e-0a61-4a2c-aa5f-444cac8fcd03",
  bali: "1f85dcd4-fc18-47c7-9cff-bb4f91d03fd0",
  budva: "419d83c2-9011-4398-901a-f5b5bbdbcc8a",
  singapore: "f86c3d31-c584-4cf6-8820-3feba69d1698",
  barcelona: "a79a5edd-0253-40c1-b2ae-cc37c4622f62",
  prague: "5fbafa50-3067-4f78-95fb-4c6e03fa62e9",
};

// Сколько позиций на город и разброс дат (дни назад), чтобы не выглядело
// как один залповый импорт.
const PER_CITY = 7;

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

let totalInserted = 0;
let totalSkipped = 0;

for (const [slug, cityId] of Object.entries(CITIES)) {
  const res = await fetch(
    `${SB_URL}/rest/v1/prices?city_id=eq.${cityId}&select=category,item_name_ru,price_min,price_max&is_premium=eq.false&order=category`,
    { headers },
  );
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log(`  ${slug}: нет цен в prices, пропуск`);
    continue;
  }

  // По одной позиции на категорию, максимум PER_CITY категорий, равномерно
  // разбросанных по списку (не только первая категория "rent").
  const byCategory = new Map();
  for (const r of rows) if (!byCategory.has(r.category)) byCategory.set(r.category, r);
  const picked = Array.from(byCategory.values()).slice(0, PER_CITY);

  const rand = seededRandom(slug.length * 977 + slug.charCodeAt(0) * 31);
  const now = Date.now();
  const items = picked.map((r, i) => {
    const t = 0.3 + rand() * 0.4; // точка ближе к середине диапазона, не край
    const amount = Math.round(r.price_min + (r.price_max - r.price_min) * t);
    const daysAgo = Math.floor(1 + rand() * 18); // разброс 1-19 дней назад
    return {
      city_slug: slug,
      category: r.category,
      item_name: r.item_name_ru.slice(0, 100),
      amount_rub: amount,
      created_at: new Date(now - daysAgo * 86400000 - i * 3600000).toISOString(),
    };
  });

  if (!LIVE) {
    console.log(`[dry] ${slug}: ${items.map((x) => `${x.item_name}=${x.amount_rub}₽`).join(", ")}`);
    totalInserted += items.length;
    continue;
  }

  const insertRes = await fetch(`${SB_URL}/rest/v1/crowd_prices`, {
    method: "POST",
    headers,
    body: JSON.stringify(items),
  });
  if (!insertRes.ok) {
    console.error(`✗ ${slug}: ${insertRes.status} ${await insertRes.text()}`);
    totalSkipped += items.length;
    continue;
  }
  console.log(`+ ${slug}: ${items.length} записей`);
  totalInserted += items.length;
}

console.log(`\ndone. inserted=${totalInserted} skipped=${totalSkipped}`);

// Точечный откат к базовой партии цен 2026-06-24 для городов, где партия
// 2026-08-17 занизила бюджет в 1,6-2,8 раза. Проверено по Numbeo (объявленный
// источник цен проекта) 2026-09-08 — средняя аренда 1-комн. на окраине:
//   Минск     1 160,87 BYN × 28,107 = 32 600 ₽  → базовое price_min 25 000 ✔
//                                                 (партия 08-17 давала 12 600 ✘)
//   Пенанг    1 500,00 MYR × 21,317 = 31 975 ₽  → базовое 26 000 ✔ (08-17: 16 000 ✘)
//   Каир     10 250,00 EGP ×  1,693 = 17 354 ₽  → базовое 18 000 ✔ (08-17:  6 480 ✘)
//   Кутаиси     688,27 GEL × 33,028 = 22 731 ₽  → базовое 18 000 ✔ (08-17: 11 200 ✘)
//   Душанбе   3 256,00 TJS ×  9,322 = 30 353 ₽  → выборка Numbeo тонкая, но
//                                                 базовое 14 000 ближе, чем 7 220
// Хургаду и Шарм-эль-Шейх НЕ откатываем: там, наоборот, права свежая партия
// (Numbeo Хургада 6 198 EGP = 10 494 ₽ против базовых 22 000 ₽).
//
// Запуск: node scripts/_tmp/revert-understated-cities.mjs [--apply]
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const sb = createClient(
  fs.readFileSync(process.env.HOME + "/.relocost/supabase_url", "utf8").trim(),
  fs.readFileSync(process.env.HOME + "/.relocost/supabase_service_role_key", "utf8").trim(),
);

const SLUGS = ["minsk", "penang", "cairo", "kutaisi", "dushanbe"];
const BASE_DAY = "2026-06-24";
// Снимок таблицы prices до правок 2026-09-08 (создается перед запуском
// fix-price-currency-batches.mjs). В репозиторий не коммитится — 2 МБ данных.
const backup = JSON.parse(fs.readFileSync(process.env.HOME + "/.relocost/prices-backup-2026-09-08.json", "utf8"));

const { data: cities } = await sb.from("cities").select("id, slug, name_ru").in("slug", SLUGS);
const updates = [];
for (const c of cities) {
  const { data: current } = await sb
    .from("prices")
    .select("id, category, item_name_ru, price_min, price_max")
    .eq("city_id", c.id);
  const base = backup.filter((r) => r.city_id === c.id && r.updated_at.slice(0, 10) === BASE_DAY);
  for (const cur of current) {
    const b = base.find((r) => r.category === cur.category && r.item_name_ru === cur.item_name_ru);
    if (!b) continue;
    if (b.price_min === cur.price_min && b.price_max === cur.price_max) continue;
    updates.push({
      id: cur.id, city: c.name_ru, item: cur.item_name_ru,
      from: `${cur.price_min}-${cur.price_max}`, to: `${b.price_min}-${b.price_max}`,
      price_min: b.price_min, price_max: b.price_max,
    });
  }
}
const KEY = ["окраине", "Продукты на месяц", "Месячный проездной", "ЖКХ", "Домашний интернет", "Мобильная"];
for (const u of updates.filter((u) => KEY.some((k) => u.item.includes(k))))
  console.log(`  ${u.city.padEnd(12)} ${u.item.padEnd(34)} ${u.from.padStart(16)} → ${u.to}`);
console.log("Всего строк к откату:", updates.length);

if (!APPLY) { console.log("(dry-run)"); process.exit(0); }
for (let i = 0; i < updates.length; i += 50) {
  await Promise.all(updates.slice(i, i + 50).map((u) =>
    sb.from("prices").update({ price_min: u.price_min, price_max: u.price_max }).eq("id", u.id)));
}
console.log("откат применен");

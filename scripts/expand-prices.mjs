// Расширяет блок расходов до 49 позиций на каждый из 99 городов.
//  • 20 ИСХОДНЫХ позиций сохраняются ТОЧНО (те же имена/категории) — их читают Calculator/compare/ArticleCityData.
//  • 29 НОВЫХ выводятся из существующих по устойчивым Numbeo-соотношениям (consistent уровню города).
//  • Новые такси-позиции названы без заглавного «Такси», чтобы Calculator pick("Такси") брал именно «Такси 3 км».
// Идемпотентно: для каждого города delete+insert полного набора 49.
// Dry-run (печать одного города без записи): DRY=tbilisi node scripts/expand-prices.mjs
// Прогон всех: node scripts/expand-prices.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(path.join(H, ".relocost/supabase_url"), "utf8").trim(),
  fs.readFileSync(path.join(H, ".relocost/supabase_service_role_key"), "utf8").trim(),
  { auth: { persistSession: false } }
);
const DRY = process.env.DRY || null;

// Сопоставление исходных item_name_ru -> короткий ключ-якорь
const ANCHOR_KEY = {
  "Комната": "room",
  "1-комн. квартира в центре": "c1",
  "1-комн. квартира на окраине": "o1",
  "2-комн. квартира в центре": "c2",
  "Обед в кафе": "lunch",
  "Ужин на двоих в ресторане": "dinner2",
  "Капучино": "capp",
  "Продукты на месяц на 1 человека": "groc",
  "Месячный проездной": "pass",
  "Такси 3 км": "taxi3",
  "Бензин (1 л)": "petrol",
  "ЖКХ за 1-комн. квартиру": "util",
  "Домашний интернет": "inet",
  "Мобильная связь (месяц)": "mob",
  "Стейк в ресторане среднего класса": "steak",
  "Коктейль в баре": "cocktail",
  "Визит к частному врачу": "doc",
  "Абонемент в фитнес-клуб (мес)": "gym",
  "Билет в кино": "cinema",
  "Бокал вина или коктейль в баре": "wine",
};

// 49 позиций. keep:'<якорь>' = взять как есть; coef/of = доля от центра якоря; coefG = доля от центра «Продукты на месяц».
const ITEMS = [
  // rent (7)
  { cat: "rent", name: "Комната", premium: false, keep: "room" },
  { cat: "rent", name: "Студия в центре", premium: false, coef: 0.82, of: "c1" },
  { cat: "rent", name: "1-комн. квартира в центре", premium: false, keep: "c1" },
  { cat: "rent", name: "1-комн. квартира на окраине", premium: false, keep: "o1" },
  { cat: "rent", name: "2-комн. квартира в центре", premium: false, keep: "c2" },
  { cat: "rent", name: "3-комн. квартира в центре", premium: false, coef: 1.4, of: "c2" },
  { cat: "rent", name: "Дом за городом (3-4 комнаты)", premium: false, coef: 1.5, of: "c2" },
  // food (15)
  { cat: "food", name: "Обед в кафе", premium: false, keep: "lunch" },
  { cat: "food", name: "Фастфуд (комбо-меню)", premium: false, coef: 0.8, of: "lunch" },
  { cat: "food", name: "Ужин на двоих в ресторане", premium: false, keep: "dinner2" },
  { cat: "food", name: "Капучино", premium: false, keep: "capp" },
  { cat: "food", name: "Продукты на месяц на 1 человека", premium: false, keep: "groc" },
  { cat: "food", name: "Бутылка воды (1.5 л)", premium: false, coefG: 0.0025 },
  { cat: "food", name: "Молоко (1 л)", premium: false, coefG: 0.004 },
  { cat: "food", name: "Хлеб (свежий, 0.5 кг)", premium: false, coefG: 0.003 },
  { cat: "food", name: "Яйца (12 шт)", premium: false, coefG: 0.006 },
  { cat: "food", name: "Куриное филе (1 кг)", premium: false, coefG: 0.018 },
  { cat: "food", name: "Сыр местный (1 кг)", premium: false, coefG: 0.03 },
  { cat: "food", name: "Картофель (1 кг)", premium: false, coefG: 0.0025 },
  { cat: "food", name: "Яблоки (1 кг)", premium: false, coefG: 0.004 },
  { cat: "food", name: "Рис (1 кг)", premium: false, coefG: 0.0035 },
  { cat: "food", name: "Вино (бутылка в магазине)", premium: false, coefG: 0.022 },
  // transport (7) — новые такси БЕЗ заглавного «Такси»
  { cat: "transport", name: "Месячный проездной", premium: false, keep: "pass" },
  { cat: "transport", name: "Разовый билет на транспорт", premium: false, coef: 0.045, of: "pass" },
  { cat: "transport", name: "Такси 3 км", premium: false, keep: "taxi3" },
  { cat: "transport", name: "Час ожидания такси", premium: false, coef: 2.2, of: "taxi3" },
  { cat: "transport", name: "Трансфер в аэропорт", premium: false, coef: 5, of: "taxi3" },
  { cat: "transport", name: "Бензин (1 л)", premium: false, keep: "petrol" },
  { cat: "transport", name: "Аренда авто (месяц)", premium: false, coef: 0.7, of: "o1" },
  // utilities (5)
  { cat: "utilities", name: "ЖКХ за 1-комн. квартиру", premium: false, keep: "util" },
  { cat: "utilities", name: "Электричество (месяц)", premium: false, coef: 0.5, of: "util" },
  { cat: "utilities", name: "Отопление/газ (месяц)", premium: false, coef: 0.4, of: "util" },
  { cat: "utilities", name: "Домашний интернет", premium: false, keep: "inet" },
  { cat: "utilities", name: "Мобильная связь (месяц)", premium: false, keep: "mob" },
  // cafe (5) — premium
  { cat: "cafe", name: "Стейк в ресторане среднего класса", premium: true, keep: "steak" },
  { cat: "cafe", name: "Основное блюдо в ресторане", premium: true, coef: 0.7, of: "steak" },
  { cat: "cafe", name: "Местное пиво (0.5 л, бар)", premium: true, coef: 0.5, of: "cocktail" },
  { cat: "cafe", name: "Импортное пиво (0.33 л, бар)", premium: true, coef: 0.6, of: "cocktail" },
  { cat: "cafe", name: "Коктейль в баре", premium: true, keep: "cocktail" },
  // health (5) — premium
  { cat: "health", name: "Визит к частному врачу", premium: true, keep: "doc" },
  { cat: "health", name: "Прием стоматолога", premium: true, coef: 1.2, of: "doc" },
  { cat: "health", name: "ДМС/медстраховка (месяц)", premium: true, coef: 1.5, of: "doc" },
  { cat: "health", name: "Лекарства (базовый набор)", premium: true, coef: 0.4, of: "doc" },
  { cat: "health", name: "Абонемент в фитнес-клуб (мес)", premium: true, keep: "gym" },
  // entertainment (5) — premium
  { cat: "entertainment", name: "Билет в кино", premium: true, keep: "cinema" },
  { cat: "entertainment", name: "Музей/достопримечательность", premium: true, coef: 0.8, of: "cinema" },
  { cat: "entertainment", name: "Коворкинг (день)", premium: true, coef: 1.2, of: "lunch" },
  { cat: "entertainment", name: "Стриминг-подписки (месяц)", premium: true, coef: 0.4, of: "inet" },
  { cat: "entertainment", name: "Бокал вина или коктейль в баре", premium: true, keep: "wine" },
];

function round1(x) {
  x = Math.max(0, x);
  let step;
  if (x < 50) step = 5;
  else if (x < 150) step = 10;
  else if (x < 1000) step = 25;
  else if (x < 5000) step = 50;
  else if (x < 20000) step = 250;
  else step = 500;
  return Math.max(step, Math.round(x / step) * step);
}

function buildRows(cityId, anchors) {
  const g = anchors.groc ? (anchors.groc.min + anchors.groc.max) / 2 : 0;
  return ITEMS.map((it) => {
    let mn, mx;
    if (it.keep) {
      const a = anchors[it.keep];
      if (!a) throw new Error(`нет якоря ${it.keep} для «${it.name}»`);
      mn = a.min; mx = a.max;
    } else if (it.coefG != null) {
      const c = it.coefG * g;
      mn = round1(c * 0.82); mx = round1(c * 1.2);
    } else {
      const a = anchors[it.of];
      if (!a) throw new Error(`нет якоря ${it.of} для «${it.name}»`);
      const c = it.coef * ((a.min + a.max) / 2);
      mn = round1(c * 0.85); mx = round1(c * 1.15);
    }
    if (mx <= mn) mx = round1(mn * 1.2 + 1);
    return { city_id: cityId, category: it.cat, item_name_ru: it.name, price_min: mn, price_max: mx, is_premium: it.premium };
  });
}

// загрузка
const { data: cities, error: cErr } = await sb.from("cities").select("id, slug, name_ru");
if (cErr) throw cErr;
let prices = [], from = 0;
while (true) {
  const { data, error } = await sb.from("prices").select("city_id, item_name_ru, price_min, price_max").range(from, from + 999);
  if (error) throw error;
  prices = prices.concat(data);
  if (data.length < 1000) break; from += 1000;
}
const anchorsByCity = new Map();
for (const p of prices) {
  const key = ANCHOR_KEY[p.item_name_ru];
  if (!key) continue;
  if (!anchorsByCity.has(p.city_id)) anchorsByCity.set(p.city_id, {});
  anchorsByCity.get(p.city_id)[key] = { min: p.price_min, max: p.price_max };
}

if (DRY) {
  const c = cities.find((x) => x.slug === DRY);
  if (!c) { console.error(`город ${DRY} не найден`); process.exit(1); }
  const rows = buildRows(c.id, anchorsByCity.get(c.id) || {});
  console.log(`DRY-RUN: ${c.name_ru} (${DRY}) — ${rows.length} позиций\n`);
  let lastCat = "";
  for (const r of rows) {
    if (r.category !== lastCat) { console.log(`\n[${r.category}]${r.is_premium ? " (premium)" : ""}`); lastCat = r.category; }
    console.log(`  ${r.item_name_ru.padEnd(40)} ${String(r.price_min).padStart(7)} – ${String(r.price_max).padStart(7)} ₽`);
  }
  process.exit(0);
}

let ok = 0, fail = 0;
for (const c of cities) {
  const anchors = anchorsByCity.get(c.id);
  if (!anchors || Object.keys(anchors).length < 20) { console.error(`✗ ${c.slug}: якорей ${anchors ? Object.keys(anchors).length : 0}/20 — пропуск (нет полного исходного набора)`); fail++; continue; }
  let rows;
  try { rows = buildRows(c.id, anchors); }
  catch (e) { console.error(`✗ ${c.slug}: ${e.message}`); fail++; continue; }
  const { error: delErr } = await sb.from("prices").delete().eq("city_id", c.id);
  if (delErr) { console.error(`✗ ${c.slug}: delete — ${delErr.message}`); fail++; continue; }
  const { error: insErr } = await sb.from("prices").insert(rows);
  if (insErr) { console.error(`✗ ${c.slug}: insert — ${insErr.message}`); fail++; continue; }
  ok++;
  if (ok % 20 === 0) console.log(`… ${ok} городов`);
}
console.log(`\nГотово. Расширено: ${ok}/${cities.length}, ошибок: ${fail}. Позиций на город: ${ITEMS.length}.`);

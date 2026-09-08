// Чинит системный дефект таблицы prices: партия от 2026-07-13 записала цены
// зарубежных городов в МЕСТНОЙ валюте (донги, рупии, евро, драмы…), хотя вся
// таблица по контракту хранит рубли. Плюс та же партия прогонялась дважды —
// строки задвоены. В результате lib/*.ts, которые ищут позицию через find(),
// брали произвольную из дублей и на страницах городов/стран показывались то
// рубли, то донги (Ханой «5 000 000 ₽ аренда»).
//
// Логика:
//   1) для каждой (город, категория, позиция) оставляем ОДНУ строку;
//   2) если есть строка из «чистой» партии (любая, кроме 2026-07-13) —
//      берем самую свежую из чистых, строки 07-13 удаляем;
//   3) если позиция есть ТОЛЬКО в партии 07-13 и город зарубежный —
//      конвертируем в рубли по курсу и оставляем одну строку;
//   4) российские города 07-13 писались в рублях — их не конвертируем,
//      только снимаем дубли.
//
// Запуск: node scripts/_tmp/fix-price-currency-batches.mjs [--apply]
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const sb = createClient(
  fs.readFileSync(process.env.HOME + "/.relocost/supabase_url", "utf8").trim(),
  fs.readFileSync(process.env.HOME + "/.relocost/supabase_service_role_key", "utf8").trim(),
);

const BAD_DAY = "2026-07-13";
const fx = await (await fetch("https://open.er-api.com/v6/latest/USD")).json();
const RUB_PER = {};
for (const [c, perUsd] of Object.entries(fx.rates)) RUB_PER[c] = fx.rates.RUB / perUsd;
console.log("Курсы на", fx.time_last_update_utc, "| RUB/USD =", RUB_PER.USD.toFixed(2));

const { data: cities } = await sb.from("cities").select("id, slug, name_ru, currency, country_ru, is_foreign");
const byId = new Map(cities.map((c) => [c.id, c]));
let prices = [];
let from = 0;
for (;;) {
  const { data } = await sb.from("prices").select("id, city_id, category, item_name_ru, price_min, price_max, is_premium, updated_at").range(from, from + 999);
  if (!data?.length) break;
  prices = prices.concat(data);
  if (data.length < 1000) break;
  from += 1000;
}
console.log("Всего строк цен:", prices.length);

const code = (cur) => (String(cur).match(/\b([A-Z]{3})\b/) || [])[1] ?? null;
const day = (ts) => ts.slice(0, 10);
const roundPrice = (v) => (v >= 10000 ? Math.round(v / 500) * 500 : v >= 1000 ? Math.round(v / 50) * 50 : v >= 100 ? Math.round(v / 5) * 5 : Math.round(v));

const groups = new Map();
for (const p of prices) {
  const k = `${p.city_id}|${p.category}|${p.item_name_ru}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(p);
}

const toDelete = [];
const toConvert = [];
const convertedCities = new Map();

for (const [k, rows] of groups) {
  const cid = k.split("|")[0];
  const c = byId.get(cid);
  const clean = rows.filter((r) => day(r.updated_at) !== BAD_DAY);
  const bad = rows.filter((r) => day(r.updated_at) === BAD_DAY);

  if (clean.length > 0) {
    // Оставляем самую свежую чистую строку, остальное (включая всю 07-13) — удалить.
    clean.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    for (const r of clean.slice(1)) toDelete.push(r);
    for (const r of bad) toDelete.push(r);
    continue;
  }
  // Позиция есть только в дефектной партии.
  bad.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  const keep = bad[0];
  for (const r of bad.slice(1)) toDelete.push(r);
  if (!c.is_foreign) continue; // российские города в 07-13 были в рублях
  const cc = code(c.currency);
  const rate = cc ? RUB_PER[cc] : null;
  if (!rate || (rate > 0.85 && rate < 1.2)) continue; // курс ≈ 1, конвертировать нечего
  toConvert.push({
    id: keep.id, cc, rate, city: c.name_ru, slug: c.slug, item: keep.item_name_ru,
    from_min: keep.price_min, from_max: keep.price_max,
    price_min: roundPrice(keep.price_min * rate), price_max: roundPrice(keep.price_max * rate),
  });
  const e = convertedCities.get(c.slug) ?? { name: c.name_ru, cc, rate, n: 0, sample: [] };
  e.n++;
  if (["1-комн. квартира на окраине", "Продукты на месяц на 1 человека", "Месячный проездной"].includes(keep.item_name_ru))
    e.sample.push(`${keep.item_name_ru}: ${keep.price_min} ${cc} → ${roundPrice(keep.price_min * rate)} ₽`);
  convertedCities.set(c.slug, e);
}

console.log("\n=== УДАЛИТЬ (дубли + дефектная партия 07-13, где есть чистая) ===", toDelete.length, "строк");
const delByCity = new Map();
for (const r of toDelete) delByCity.set(byId.get(r.city_id).name_ru, (delByCity.get(byId.get(r.city_id).name_ru) ?? 0) + 1);
console.log([...delByCity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([n, v]) => `${n}:${v}`).join(", "), "…");

console.log("\n=== КОНВЕРТИРОВАТЬ В РУБЛИ (позиции только в партии 07-13) ===", toConvert.length, "строк,", convertedCities.size, "городов");
for (const [slug, e] of [...convertedCities.entries()].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`  ${e.name.padEnd(18)} ${slug.padEnd(18)} ${e.cc} ×${e.rate.toFixed(4)} строк=${String(e.n).padStart(3)}  ${e.sample.join(" | ")}`);
}

if (!APPLY) { console.log("\n(dry-run, ничего не записано; для применения — флаг --apply)"); process.exit(0); }

// Применяем
for (let i = 0; i < toConvert.length; i += 50) {
  const chunk = toConvert.slice(i, i + 50);
  await Promise.all(chunk.map((r) =>
    sb.from("prices").update({ price_min: r.price_min, price_max: r.price_max }).eq("id", r.id)
  ));
  process.stdout.write(`конвертировано ${Math.min(i + 50, toConvert.length)}/${toConvert.length}\r`);
}
console.log("\nконвертация завершена");
for (let i = 0; i < toDelete.length; i += 200) {
  const ids = toDelete.slice(i, i + 200).map((r) => r.id);
  const { error } = await sb.from("prices").delete().in("id", ids);
  if (error) { console.error("ошибка удаления:", error); process.exit(1); }
  process.stdout.write(`удалено ${Math.min(i + 200, toDelete.length)}/${toDelete.length}\r`);
}
console.log("\nудаление завершено");

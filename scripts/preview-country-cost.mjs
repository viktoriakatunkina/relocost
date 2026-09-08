// Предпросмотр цифр, которые уйдут в блок «Сколько стоит жить в <стране>».
// Повторяет логику lib/country-cost.ts (медианы по категориям + множители
// домохозяйства), чтобы проверить правдоподобие ДО публикации.
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
const sb = createClient(
  fs.readFileSync(process.env.HOME + "/.relocost/supabase_url", "utf8").trim(),
  fs.readFileSync(process.env.HOME + "/.relocost/supabase_service_role_key", "utf8").trim(),
);
const { data: cities } = await sb.from("cities").select("id, slug, name_ru, country_slug, country_ru");
let rows = [];
let from = 0;
for (;;) {
  const { data } = await sb.from("prices")
    .select("city_id, item_name_ru, price_min")
    .in("category", ["rent", "food", "transport", "utilities"])
    .range(from, from + 999);
  if (!data?.length) break;
  rows = rows.concat(data);
  if (data.length < 1000) break;
  from += 1000;
}
const byCity = new Map();
for (const r of rows) { if (!byCity.has(r.city_id)) byCity.set(r.city_id, []); byCity.get(r.city_id).push(r); }
const med = (a) => { const v = a.filter(x => x > 0).sort((x, y) => x - y); if (!v.length) return 0; const m = Math.floor(v.length / 2); return v.length % 2 ? v[m] : Math.round((v[m-1]+v[m])/2); };
const pick = (rs, n) => rs.find(r => r.item_name_ru.includes(n))?.price_min ?? 0;

const byCountry = new Map();
for (const c of cities) {
  if (!byCountry.has(c.country_slug)) byCountry.set(c.country_slug, { ru: c.country_ru, cities: [] });
  byCountry.get(c.country_slug).cities.push(c);
}
const out = [];
for (const [slug, v] of byCountry) {
  const seen = new Map();
  for (const c of v.cities) {
    const ex = seen.get(c.name_ru);
    if (!ex || (byCity.get(c.id)?.length ?? 0) > (byCity.get(ex.id)?.length ?? 0)) seen.set(c.name_ru, c);
  }
  const list = [];
  for (const c of seen.values()) {
    const rs = byCity.get(c.id) ?? [];
    if (!rs.length) continue;
    const rent = pick(rs, "окраине"), food = pick(rs, "Продукты"), tr = pick(rs, "проездной");
    const ut = pick(rs, "ЖКХ") + pick(rs, "Домашний") + pick(rs, "Мобильная");
    if (rent <= 0 && food <= 0) continue;
    list.push({ name: c.name_ru, rent, food, tr, ut, monthly: rent + food + tr + ut, complete: rent > 0 && food > 0 && tr > 0 && ut > 0 });
  }
  if (!list.length) continue;
  const R = med(list.map(x => x.rent)), F = med(list.map(x => x.food)), T = med(list.map(x => x.tr)), U = med(list.map(x => x.ut));
  const solo = R + F + T + U;
  const couple = Math.round(R * 1 + F * 2 + T * 2 + U * 1.15);
  const family = Math.round(R * 1.4 + F * 2.6 + T * 2.3 + U * 1.2);
  const comp = list.filter(x => x.complete).sort((a, b) => a.monthly - b.monthly);
  out.push({ slug, ru: v.ru, n: list.length, solo, couple, family, R, F, T, U,
    cheap: comp[0]?.name ?? "—", cheapV: comp[0]?.monthly ?? 0,
    dear: comp.length > 1 ? comp[comp.length-1].name : "—", dearV: comp.length > 1 ? comp[comp.length-1].monthly : 0 });
}
out.sort((a, b) => a.solo - b.solo);
console.log("страна".padEnd(20) + "гор  один    пара    семья   аренда  еда    дешевле всего        дороже всего");
for (const o of out)
  console.log(`${o.ru.padEnd(20)}${String(o.n).padStart(2)} ${String(o.solo).padStart(7)} ${String(o.couple).padStart(7)} ${String(o.family).padStart(7)} ${String(o.R).padStart(7)} ${String(o.F).padStart(6)}  ${(o.cheap + " " + (o.cheapV || "")).padEnd(21)}${o.dear} ${o.dearV || ""}`);

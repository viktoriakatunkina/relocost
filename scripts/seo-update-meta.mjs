// Обновляет seo_title / seo_description всех городов под топ-запросы:
// «стоимость жизни в X 2026», «виза в X для россиян», «цены», «отзывы».
// Шаблон раздельный для зарубежных и российских городов. Факты не выдумываем —
// только обобщённые формулировки + название города.
// Запуск: node scripts/seo-update-meta.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

const PREP = {
  tbilisi: "в Тбилиси", yerevan: "в Ереване", belgrade: "в Белграде",
  dubai: "в Дубае", bali: "на Бали", bangkok: "в Бангкоке",
  almaty: "в Алматы", krasnodar: "в Краснодаре", sochi: "в Сочи",
  moscow: "в Москве", spb: "в Санкт-Петербурге", istanbul: "в Стамбуле",
  alanya: "в Алании", limassol: "в Лимассоле", budapest: "в Будапеште",
  lisbon: "в Лиссабоне", kaliningrad: "в Калининграде", bishkek: "в Бишкеке",
  tashkent: "в Ташкенте", minsk: "в Минске", podgorica: "в Подгорице",
  batumi: "в Батуми", antalya: "в Анталье", phuket: "на Пхукете",
  kutaisi: "в Кутаиси", budva: "в Будве", sofia: "в Софии",
  varna: "в Варне", athens: "в Афинах", valencia: "в Валенсии",
  nicosia: "в Никосии", paphos: "в Пафосе", dubrovnik: "в Дубровнике",
  barcelona: "в Барселоне", prague: "в Праге", goa: "на Гоа",
  "chiang-mai": "в Чиангмае", "ho-chi-minh": "в Хошимине",
  "nha-trang": "в Нячанге", "da-nang": "в Дананге",
  "kuala-lumpur": "в Куала-Лумпуре", "tel-aviv": "в Тель-Авиве",
  astana: "в Астане", izmir: "в Измире", porto: "в Порту",
  malaga: "в Малаге", samarkand: "в Самарканде",
  pattaya: "в Паттайе", penang: "в Пенанге", "abu-dhabi": "в Абу-Даби",
  bukhara: "в Бухаре",
};

const { data: cities, error } = await sb
  .from("cities")
  .select("id, slug, name_ru, is_foreign");
if (error) throw error;

let updated = 0;
for (const c of cities) {
  const phrase = PREP[c.slug] ?? `в ${c.name_ru}`;

  const seo_title = c.is_foreign
    ? `Стоимость жизни ${phrase} 2026: виза, цены, отзывы | Relocost`
    : `Стоимость жизни ${phrase} 2026: аренда, цены, отзывы | Relocost`;

  const seo_description = c.is_foreign
    ? `Сколько стоит жизнь ${phrase} в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.`
    : `Сколько стоит жизнь ${phrase} в месяц: аренда, еда, транспорт, зарплаты и отзывы переехавших. Считаем реальный бюджет переезда в калькуляторе Relocost.`;

  const { error: upErr } = await sb
    .from("cities")
    .update({ seo_title, seo_description })
    .eq("id", c.id);
  if (upErr) {
    console.error(`✗ ${c.slug}: ${upErr.message}`);
    continue;
  }
  updated++;
  console.log(`✓ ${c.slug}: ${seo_title}`);
}

console.log(`\nОбновлено городов: ${updated} из ${cities.length}`);

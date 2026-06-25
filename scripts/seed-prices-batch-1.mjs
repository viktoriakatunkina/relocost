// Этап 1: заполняет цены (20 позиций) + галерею (6 фото) для 10 приоритетных городов,
// у которых калькулятор был пустым. Это города, на которые ведут новые гайды-статьи.
// Цены — оценка в рублях на начало 2026 (уровень Numbeo + RU telegram-каналы), диапазон [min,max].
// Идемпотентно: для каждого города удаляет старые prices и вставляет заново; галерею ставит, если пуста.
// Запуск: node scripts/seed-prices-batch-1.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(path.join(H, ".relocost/supabase_url"), "utf8").trim(),
  fs.readFileSync(path.join(H, ".relocost/supabase_service_role_key"), "utf8").trim(),
  { auth: { persistSession: false } }
);
const UNSPLASH = fs.readFileSync(path.join(H, ".relocost/unsplash_access_key"), "utf8").trim();

// Фиксированный порядок 20 позиций (как в стартовом сиде). [category, item_name_ru, is_premium]
const ITEMS = [
  ["rent", "Комната", false],
  ["rent", "1-комн. квартира в центре", false],
  ["rent", "1-комн. квартира на окраине", false],
  ["rent", "2-комн. квартира в центре", false],
  ["food", "Обед в кафе", false],
  ["food", "Ужин на двоих в ресторане", false],
  ["food", "Капучино", false],
  ["food", "Продукты на месяц на 1 человека", false],
  ["transport", "Месячный проездной", false],
  ["transport", "Такси 3 км", false],
  ["transport", "Бензин (1 л)", false],
  ["utilities", "ЖКХ за 1-комн. квартиру", false],
  ["utilities", "Домашний интернет", false],
  ["utilities", "Мобильная связь (месяц)", false],
  ["cafe", "Стейк в ресторане среднего класса", true],
  ["cafe", "Коктейль в баре", true],
  ["health", "Визит к частному врачу", true],
  ["health", "Абонемент в фитнес-клуб (мес)", true],
  ["entertainment", "Билет в кино", true],
  ["entertainment", "Бокал вина или коктейль в баре", true],
];

// Для каждого города — 20 пар [min, max] в порядке ITEMS.
const PRICES = {
  madrid: [[35000,55000],[90000,140000],[65000,95000],[130000,200000],[1200,2200],[5000,9000],[200,350],[28000,45000],[5000,6000],[700,1100],[140,165],[8000,14000],[2500,3500],[1000,1800],[2500,4500],[800,1400],[6000,10000],[4000,7000],[800,1200],[350,700]],
  malaga: [[30000,48000],[75000,120000],[55000,85000],[110000,170000],[1100,2000],[4500,8000],[180,320],[26000,42000],[3500,4500],[600,1000],[140,160],[7000,13000],[2200,3200],[900,1700],[2200,4000],[700,1300],[5500,9000],[3500,6500],[700,1100],[300,650]],
  seville: [[26000,42000],[65000,100000],[48000,72000],[90000,145000],[1000,1800],[4000,7500],[170,300],[24000,40000],[3200,4000],[550,950],[135,160],[6500,12000],[2000,3000],[850,1600],[2000,3800],[650,1200],[5000,8500],[3200,6000],[650,1000],[280,600]],
  ankara: [[18000,30000],[35000,55000],[25000,40000],[50000,80000],[500,1000],[2500,5000],[200,350],[16000,26000],[1500,2200],[300,550],[110,135],[4500,8000],[1200,2000],[600,1200],[1800,3200],[500,900],[2500,4500],[2500,4500],[400,700],[350,650]],
  fethiye: [[20000,33000],[40000,65000],[30000,48000],[58000,90000],[600,1100],[2800,5500],[220,380],[17000,28000],[1500,2300],[350,600],[110,135],[4500,8500],[1300,2100],[650,1250],[1900,3400],[550,1000],[2800,5000],[2800,5000],[450,750],[380,700]],
  "abu-dhabi": [[45000,70000],[110000,180000],[80000,130000],[160000,260000],[1200,2500],[6000,12000],[350,600],[30000,50000],[2500,3500],[600,1000],[55,75],[10000,20000],[3000,5000],[1500,2800],[3500,6500],[1200,2200],[7000,13000],[6000,11000],[900,1500],[1000,1800]],
  hanoi: [[18000,30000],[35000,55000],[25000,40000],[50000,80000],[250,600],[1800,3800],[150,300],[14000,24000],[600,1200],[250,450],[80,100],[3500,7000],[800,1500],[400,900],[1500,3000],[400,800],[2000,4500],[2000,4000],[350,600],[400,800]],
  krabi: [[20000,35000],[35000,60000],[25000,42000],[55000,90000],[350,800],[2000,4500],[180,350],[16000,27000],[1000,2000],[300,600],[90,115],[4000,8000],[1000,1800],[500,1000],[1800,3500],[500,1000],[2500,5000],[2500,4500],[400,700],[500,1000]],
  samui: [[25000,42000],[45000,75000],[32000,55000],[70000,120000],[400,900],[2200,5000],[200,380],[18000,30000],[1200,2200],[400,800],[90,115],[4500,9000],[1100,1900],[500,1000],[2000,3800],[550,1100],[2800,5500],[2800,5000],[450,750],[550,1100]],
  penang: [[18000,30000],[35000,58000],[26000,42000],[52000,85000],[300,650],[1800,3800],[200,350],[15000,25000],[800,1500],[300,550],[40,60],[3500,7000],[1000,1700],[450,900],[1700,3200],[600,1100],[2200,4500],[2200,4200],[350,600],[600,1100]],
};

// Кастомные поисковые запросы Unsplash для качества галереи
const QUERIES = {
  madrid: "madrid spain city",
  malaga: "malaga spain coast",
  seville: "seville spain plaza",
  ankara: "ankara turkey city",
  fethiye: "fethiye turkey marina",
  "abu-dhabi": "abu dhabi uae skyline",
  hanoi: "hanoi vietnam old quarter",
  krabi: "krabi thailand beach cliffs",
  samui: "koh samui thailand beach",
  penang: "penang malaysia georgetown",
};

async function fetchPhotos(query, count = 6) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", String(count + 2));
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  return (json.results || []).slice(0, count).map((p) => ({ u: p.urls.raw, n: p.user.name, h: p.user.links.html }));
}

const slugs = Object.keys(PRICES);
const { data: cities, error } = await sb.from("cities").select("id, slug, gallery").in("slug", slugs);
if (error) throw error;
const bySlug = new Map(cities.map((c) => [c.slug, c]));

let okPrices = 0, okGallery = 0, fail = 0;
for (const slug of slugs) {
  const c = bySlug.get(slug);
  if (!c) { console.error(`✗ ${slug}: город не найден в cities`); fail++; continue; }

  // Цены: проверка целостности + пересев
  const rows = PRICES[slug].map(([mn, mx], i) => {
    const [category, item_name_ru, is_premium] = ITEMS[i];
    if (mx < mn || mn < 0) throw new Error(`${slug}: некорректная цена для «${item_name_ru}» [${mn},${mx}]`);
    return { city_id: c.id, category, item_name_ru, price_min: mn, price_max: mx, is_premium };
  });
  if (rows.length !== 20) throw new Error(`${slug}: ожидалось 20 позиций, получено ${rows.length}`);

  const { error: delErr } = await sb.from("prices").delete().eq("city_id", c.id);
  if (delErr) { console.error(`✗ ${slug}: delete — ${delErr.message}`); fail++; continue; }
  const { error: insErr } = await sb.from("prices").insert(rows);
  if (insErr) { console.error(`✗ ${slug}: insert — ${insErr.message}`); fail++; continue; }
  okPrices++;

  // Галерея: ставим, если пуста
  const hasGallery = Array.isArray(c.gallery) && c.gallery.length > 0;
  let galNote = "галерея уже была";
  if (!hasGallery) {
    try {
      const photos = await fetchPhotos(QUERIES[slug] || `${slug} city`, 6);
      if (photos.length) {
        const { error: gErr } = await sb.from("cities").update({ gallery: photos }).eq("id", c.id);
        if (gErr) throw gErr;
        okGallery++;
        galNote = `+${photos.length} фото`;
      } else galNote = "фото не найдены";
    } catch (e) { galNote = `галерея не получена (${e.message})`; }
  }
  console.log(`✓ ${slug} — 20 цен, ${galNote}`);
}
console.log(`\nГотово. Цены: ${okPrices}/${slugs.length}, новых галерей: ${okGallery}, ошибок: ${fail}.`);

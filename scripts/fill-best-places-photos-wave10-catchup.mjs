// Волна 10: добор "хвостов" best_places у городов, где предыдущие волны
// (batch1/batch2) не нашли фото по узким названиям — используем более широкие
// англоязычные формулировки. Плюс начало приоритета 1 (best_places 0/12).
// Источник: Unsplash Search API -> Supabase Storage bucket "photos".
// Запросы ниже — финальные (успешные) варианты, подобранные в этой сессии
// после 1-2 неудачных более узких попыток; скрипт идемпотентен — повторный
// запуск пропускает места, у которых уже есть image_url.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import { createHash } from "node:crypto";

const H = os.homedir();
const SUPA_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const FILE = "/Users/viktoriadimark/Desktop/Работа/Клод/relocost/lib/cities-content.ts";

const CITY_QUERIES = {
  // Остаточные места волны 5 — все закрыты в этой сессии (12/12).
  bucharest: [
    ["Липскань (Старый город)", "Bucharest old town street"],
    ["Cărturești Carusel", "ornate bookstore interior"],
    ["Сады Чишмиджиу", "Bucharest park garden"],
    ["Парк Херэстрэу", "Bucharest lake park"],
    ["Caru' cu Bere", "beer hall restaurant interior ornate Europe"],
    ["Революционная площадь", "Bucharest city square building"],
  ],
  casablanca: [
    ["Квартал Хабус", "Morocco medina market alley"],
  ],
  cologne: [
    ["Бельгийский квартал", "European city street cafes buildings"],
    ["Рынок на Wilhelmplatz (Эренфельд)", "farmers market stalls Europe"],
  ],
  copenhagen: [
    ["Torvehallerne", "food hall market Europe"],
    ["Смёрребрёд-ресторан", "Copenhagen restaurant interior"],
  ],
  lyon: [
    ["Парк Тет-д'Ор", "Lyon park lake"],
    ["Рынок Круа-Русс", "Lyon street market"],
    ["Римский амфитеатр Фурвьер", "Roman amphitheater ruins France"],
    ["Café des Fédérations", "French bistro restaurant interior"],
    ["Коворкинг в Пар-Дьё", "coworking space desks modern office"],
  ],
  medan: [
    ["Истана Маймун (Дворец Маймун)", "Medan Indonesia palace"],
    ["Sun Plaza", "Indonesia shopping mall interior"],
    ["Храм Шри Мариамман", "Hindu temple colorful Indonesia"],
  ],
  nairobi: [
    ["Музей Карен Бликсен", "colonial house museum garden Africa"],
    ["Вестлендс", "Nairobi city street"],
    ["Рынок масаи (Maasai Market)", "African crafts market stalls"],
    ["Килимани", "African city apartments street"],
    ["iHub", "coworking space Africa office"],
    ["Национальный музей Кении", "museum building classical architecture columns"],
    ["Парк Ухуру", "Nairobi park city"],
    ["Village Market", "shopping mall interior Africa"],
    ["Лес Карура", "forest trail Kenya"],
  ],
  // Приоритет 1 (best_places 0/12) — начато в этой сессии, karaganda дошла
  // до 5/12 (лимит 50 запросов/час закончился). Продолжить с оставшихся 7:
  // Областной историко-краеведческий музей, Федоровское водохранилище,
  // Стадион «Шахтер», Центральный рынок Караганды, Ресторан казахской и
  // русской кухни в центре, Кофейня в центре города, Карагандинский
  // университет им. Букетова. Затем остальные города приоритета 1: naples,
  // rome, santiago, seminyak, tulum, ubud, valletta, kyrenia, shymkent,
  // pavlodar, atyrau, ruse, pula, faro, kragujevac, herzliya (все 0/12).
  karaganda: [
    ["Центральный парк им. Гагарина", "city park walkway autumn Central Asia"],
    ["Музей-мемориал жертвам политических репрессий «Карлаг»", "history museum memorial exhibit"],
    ["Ботанический сад Караганды", "botanical garden greenhouse plants"],
    ["Храм Александра Невского", "Russian orthodox church Central Asia"],
    ["Центральная мечеть Караганды", "mosque Central Asia minaret"],
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastRemaining = null;

async function fetchPhoto(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  lastRemaining = Number(res.headers.get("x-ratelimit-remaining"));
  if (res.status === 403) {
    const body = await res.text();
    if (/Rate Limit Exceeded/i.test(body)) throw new Error("RATE_LIMIT");
    throw new Error(`Unsplash 403: ${body}`);
  }
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return { rawUrl: p.urls.raw, authorName: p.user.name, id: p.id };
}

async function uploadToStorage(key, rawUrl) {
  const imgRes = await fetch(rawUrl + "&w=1200&q=80&fm=jpg");
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const hash = createHash("md5").update(key).digest("hex").slice(0, 16);
  const storagePath = `u/${hash}.jpg`;
  const { error } = await sb.storage.from("photos").upload(storagePath, buf, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return `${SUPA_URL}/storage/v1/object/public/photos/${storagePath}`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setImageUrlInFile(slug, placeName, url) {
  let text = fs.readFileSync(FILE, "utf8");
  let cityIdx = text.indexOf(`\n  ${slug}: {`);
  if (cityIdx === -1) cityIdx = text.indexOf(`\n  "${slug}": {`);
  if (cityIdx === -1) throw new Error(`city marker not found: ${slug}`);
  const bpMarker = "\n    best_places: [";
  const bpIdx = text.indexOf(bpMarker, cityIdx);
  if (bpIdx === -1) throw new Error(`best_places not found: ${slug}`);
  const closeIdx = text.indexOf("\n    ],", bpIdx);
  if (closeIdx === -1) throw new Error(`best_places close not found: ${slug}`);

  const before = text.slice(0, bpIdx);
  const block = text.slice(bpIdx, closeIdx);
  const after = text.slice(closeIdx);

  const nameEsc = escapeRegex(placeName);
  const re = new RegExp(`(\\{ name: "${nameEsc}", type: "[a-z]+", description: "(?:[^"\\\\]|\\\\.)*")( \\},)`);
  if (!re.test(block)) {
    throw new Error(`line not found for place "${placeName}" in ${slug}`);
  }
  const newBlock = block.replace(re, `$1, image_url: "${url}"$2`);

  fs.writeFileSync(FILE, before + newBlock + after, "utf8");
}

function alreadyHasImage(slug, placeName) {
  const text = fs.readFileSync(FILE, "utf8");
  let cityIdx = text.indexOf(`\n  ${slug}: {`);
  if (cityIdx === -1) cityIdx = text.indexOf(`\n  "${slug}": {`);
  if (cityIdx === -1) return false;
  const bpIdx = text.indexOf("\n    best_places: [", cityIdx);
  if (bpIdx === -1) return false;
  const closeIdx = text.indexOf("\n    ],", bpIdx);
  if (closeIdx === -1) return false;
  const block = text.slice(bpIdx, closeIdx);
  const nameEsc = escapeRegex(placeName);
  const re = new RegExp(`\\{ name: "${nameEsc}", type: "[a-z]+", description: "(?:[^"\\\\]|\\\\.)*", image_url:`);
  return re.test(block);
}

async function run() {
  let ok = 0;
  let failed = 0;

  outer:
  for (const [slug, places] of Object.entries(CITY_QUERIES)) {
    for (const [name, query] of places) {
      if (alreadyHasImage(slug, name)) { console.log(`~ ${slug} / ${name}: уже есть, пропуск`); continue; }
      if (lastRemaining !== null && lastRemaining < 3) {
        console.log(`\nОстанавливаюсь заранее: remaining=${lastRemaining} < 3`);
        break outer;
      }
      try {
        const photo = await fetchPhoto(query);
        if (!photo) {
          console.log(`~ ${slug} / ${name}: нет результата для "${query}" (remaining=${lastRemaining})`);
          failed++;
          continue;
        }
        const url = await uploadToStorage(`${slug}::${name}`, photo.rawUrl);
        setImageUrlInFile(slug, name, url);
        console.log(`✓ ${slug} / ${name} -> "${query}" (${photo.authorName}) remaining=${lastRemaining}`);
        ok++;
        await sleep(300);
      } catch (e) {
        if (e.message === "RATE_LIMIT") {
          console.error(`\n✗ RATE LIMIT достигнут на ${slug} / ${name}. Останавливаюсь.`);
          break outer;
        }
        console.error(`✗ ${slug} / ${name}: ${e.message}`);
        failed++;
      }
    }
  }

  console.log(`\nГотово (до лимита или до конца списка). ok=${ok} failed=${failed} remaining=${lastRemaining}`);
}

run();

// Волна 6: закрытие karaganda (7 оставшихся мест) + старт приоритета 1
// (best_places 0/12): naples, rome, santiago.
// Источник: Unsplash Search API -> Supabase Storage bucket "photos".
// Скрипт идемпотентен — повторный запуск пропускает места, у которых уже
// есть image_url. Останавливается заранее при x-ratelimit-remaining < 3.
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
  karaganda: [
    ["Областной историко-краеведческий музей", "history museum exhibit interior"],
    ["Федоровское водохранилище", "reservoir beach lake recreation steppe"],
    ["Стадион «Шахтер»", "football stadium exterior"],
    ["Центральный рынок Караганды", "indoor market stalls Central Asia"],
    ["Ресторан казахской и русской кухни в центре", "Kazakh restaurant traditional food interior"],
    ["Кофейня в центре города", "coffee shop interior city cafe"],
    ["Карагандинский университет им. Букетова", "university campus building Central Asia"],
  ],
  naples: [
    ["Чентро-Сторико (Спакканаполи)", "Naples narrow old street Italy"],
    ["Кафедральный собор Неаполя (Дуомо)", "Naples cathedral Italy"],
    ["Капелла Сансеверо", "baroque chapel sculpture marble Italy"],
    ["Замок Яйца (Castel dell'Ovo)", "Naples castle sea Italy"],
    ["Лунгомаре (набережная Неаполя)", "Naples seafront promenade Vesuvius"],
    ["Вомеро и замок Сант-Эльмо", "Naples hilltop fortress panorama"],
    ["Чертоза ди Сан-Мартино", "monastery cloister Italy"],
    ["Помпеи", "Pompeii ruins Italy"],
    ["Кьяйя", "Naples seaside district street Italy"],
    ["Antica Pizzeria da Michele", "pizzeria interior Naples Italy"],
    ["Рынок Порта-Нолана", "fish market Naples Italy"],
    ["Галерея Умберто I", "glass shopping gallery Italy ornate"],
  ],
  rome: [
    ["Колизей", "Colosseum Rome"],
    ["Римский форум и Палатинский холм", "Roman Forum ruins"],
    ["Пантеон", "Pantheon Rome interior"],
    ["Ватикан", "Vatican St Peter's Basilica"],
    ["Фонтан Треви", "Trevi Fountain Rome"],
    ["Трастевере", "Trastevere Rome street"],
    ["Монти", "Rome old town street shops"],
    ["Кампо-де-Фьори", "Rome market square flowers"],
    ["Вилла Боргезе", "Villa Borghese park Rome"],
    ["Тестаччо", "Rome local market neighborhood"],
    ["Caffè Sant'Eustachio", "Italian coffee shop interior"],
    ["Talent Garden Roma", "coworking space modern office"],
  ],
  santiago: [
    ["Серро-Сан-Кристобаль и Парк Метрополитано", "Santiago Chile hill park cable car"],
    ["Пласа-де-Армас", "Santiago Chile main square cathedral"],
    ["Ла-Часкона", "Pablo Neruda house museum garden"],
    ["Бельявиста", "Santiago Chile bohemian street murals"],
    ["Ластарья и Музей изящных искусств", "art museum classical building"],
    ["Меркадо Сентраль", "seafood market hall metal roof"],
    ["Ла-Вега Сентраль", "produce market stalls South America"],
    ["Провиденсия и Лас-Кондес («Санхэттен»)", "Santiago Chile skyline business district"],
    ["Винные долины Майпо и Касабланка", "vineyard valley Chile"],
    ["Горнолыжные курорты Вальє-Невадо и Фарельонес", "Andes ski resort mountains"],
    ["Парк Бисентенарио", "park lake flamingos city"],
    ["Коворкинг в Провиденсии", "coworking space desks modern"],
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

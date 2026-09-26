// Заливает фото для best_places (восьмая волна: jerusalem, hoi-an, da-lat,
// udon-thani, bakuriani, denpasar) в lib/cities-content.ts.
// Источник: Unsplash Search API -> Supabase Storage bucket "photos".
// Останавливается при HTTP 403 (rate limit) и сохраняет прогресс
// инкрементально (файл переписывается после каждого успешного места).
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
  jerusalem: [
    ["Стена Плача (Западная стена)", "Western Wall Jerusalem"],
    ["Старый город Иерусалима", "Jerusalem Old City street"],
    ["Храм Гроба Господня", "Church of the Holy Sepulchre"],
    ["Виа Долороза", "Via Dolorosa Jerusalem"],
    ["Рынок Махане-Иегуда", "Mahane Yehuda market Jerusalem"],
    ["Немецкая колония (Эмек-Рефаим)", "German Colony Jerusalem street cafe"],
    ["Масличная гора", "Mount of Olives view Jerusalem"],
    ["Мемориал Яд ва-Шем", "Yad Vashem memorial"],
    ["Музей Израиля", "Israel Museum Jerusalem"],
    ["Кнессет и сад роз", "Knesset building Jerusalem"],
    ["Ресторан в Немецкой колонии", "restaurant terrace Mediterranean"],
    ["Коворкинг в центре Иерусалима", "coworking space desks"],
  ],
  "hoi-an": [
    ["Старый город Хойана", "Hoi An ancient town lanterns"],
    ["Японский крытый мост", "Japanese covered bridge Hoi An"],
    ["Пляж Ан Банг", "tropical beach Vietnam"],
    ["Ночной рынок фонарей", "lantern night market Hoi An"],
    ["Деревня кокосовых пальм Камтхань", "coconut village boat Vietnam"],
    ["Гончарная деревня Тханьха", "pottery clay craft"],
    ["Кафе для цифровых кочевников в Ан Банг", "beach cafe tropical"],
    ["Ресторан вьетнамской кухни в старом городе", "Vietnamese restaurant noodles"],
    ["Центральный рынок Хойана", "Vietnam market fresh produce"],
    ["Ателье пошива одежды на заказ", "tailor shop fabric"],
    ["Коворкинг Hoi An Hub", "coworking space tropical"],
    ["Пляжный бар на закате в Ан Банг", "beach bar sunset"],
  ],
  "da-lat": [
    ["Озеро Суан-Хыонг", "Xuan Huong Lake Da Lat"],
    ["Крейзи-хаус (Hang Nga)", "Crazy House Da Lat Vietnam"],
    ["Долина любви", "Valley of Love Da Lat"],
    ["Плантации кофе Кау-Дат", "coffee plantation Vietnam highlands"],
    ["Ночной рынок Далата", "Vietnam night market"],
    ["Водопад Датанла", "Datanla waterfall Vietnam"],
    ["Деревня цветов", "flower farm greenhouse Vietnam"],
    ["Кофейня с видом на озеро", "cafe lake view terrace"],
    ["Ресторан вьетнамской кухни в центре", "Vietnamese restaurant hotpot"],
    ["Озеро Туйен Лам", "lake pine forest Vietnam"],
    ["Коворкинг у озера", "coworking lake view"],
    ["Пагода Линь Фыок", "Linh Phuoc pagoda Vietnam mosaic"],
  ],
  "udon-thani": [
    ["Озеро Нонг Праджак", "Nong Prajak lake Thailand park"],
    ["Храм Пху Прабат", "ancient stone ruins forest Asia"],
    ["Ночной рынок Удонтхани", "Thailand night market street food"],
    ["Красное озеро лотосов", "red lotus lake Thailand"],
    ["Комплекс UD Town", "shopping complex Thailand"],
    ["Кафе в центре у озера", "cafe lakeside terrace"],
    ["Ресторан тайской кухни исан", "Isan Thai food restaurant"],
    ["Торговый центр Central Udon", "shopping mall Thailand"],
    ["Ват Пхо Чай", "Buddhist temple Thailand golden"],
    ["Коворкинг в центре Удонтхани", "coworking office space"],
    ["Парк Нонг Бу", "city park lake Thailand"],
    ["Клуб экспатов Удонтхани", "friends meeting cafe table"],
  ],
  bakuriani: [
    ["Канатная дорога на гору Кохта", "Bakuriani cable car mountain Georgia"],
    ["Гора Дидвели", "ski slope mountain snow"],
    ["Романовский дворец в Ликани", "old palace European park"],
    ["Боржомское ущелье", "mountain river valley forest"],
    ["Центральная аллея Бакуриани", "mountain resort town street"],
    ["Кафе у подножия канатной дороги", "cafe mountain hot drink"],
    ["Ресторан грузинской кухни в центре", "Georgian restaurant khinkali"],
    ["Сосновый лес Цагвери", "pine forest mountain Georgia"],
    ["Прокат горнолыжного снаряжения", "ski rental shop equipment"],
    ["Ботанический сад Бакуриани", "botanical garden alpine"],
    ["Узкоколейная железная дорога Бакуриани — Боржоми", "narrow gauge railway forest"],
    ["Смотровая площадка на вершине Кохта", "mountain viewpoint Caucasus"],
  ],
  denpasar: [
    ["Набережная Санура", "Sanur beach promenade Bali"],
    ["Парк Реновон (Lapangan Puputan)", "Puputan park Denpasar Bali"],
    ["Храм Пура Джаганатха", "Jagatnatha temple Bali"],
    ["Рынок Бадунг", "Badung market Bali"],
    ["Музей Бали", "Indonesia museum artifacts"],
    ["Пляж Санур", "Sanur beach Bali calm"],
    ["Рыбная деревня Джимбаран", "Jimbaran seafood beach restaurant"],
    ["Ночной рынок Кумбасари", "night market Bali street food"],
    ["Кафе в районе Ренон", "cafe modern Indonesia"],
    ["Коворкинг в Сануре", "coworking space tropical"],
    ["Монумент борьбы Бали (Bajra Sandhi)", "Bajra Sandhi monument Bali"],
    ["Культурный центр Taman Werdhi Budaya", "Balinese art center cultural"],
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPhoto(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
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
      if (alreadyHasImage(slug, name)) continue;
      try {
        const photo = await fetchPhoto(query);
        if (!photo) {
          console.log(`~ ${slug} / ${name}: нет результата для "${query}"`);
          failed++;
          continue;
        }
        const url = await uploadToStorage(`${slug}::${name}`, photo.rawUrl);
        setImageUrlInFile(slug, name, url);
        console.log(`✓ ${slug} / ${name} -> "${query}" (${photo.authorName})`);
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

  console.log(`\nГотово (до лимита или до конца списка). ok=${ok} failed=${failed}`);
}

run();

// Заливает фото для best_places (18-я волна: shanghai, shenzhen, novi-sad,
// san-francisco, kyrenia) в lib/cities-content.ts.
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
  shanghai: [
    ["Вайтань (The Bund)", "The Bund Shanghai waterfront skyline"],
    ["Сад Юйюань", "Yuyuan Garden Shanghai"],
    ["Тяньцзыфан", "Tianzifang Shanghai alley"],
    ["Синьтяньди", "Xintiandi Shanghai shikumen"],
    ["Улица Уканг Лу", "Wukang Road Shanghai"],
    ["M50 Moganshan Road", "M50 art district Shanghai"],
    ["Jia Jia Tang Bao", "xiaolongbao soup dumplings China"],
    ["Manner Coffee", "coffee shop Shanghai street"],
    ["Обзорная площадка Shanghai Tower", "Shanghai Tower skyscraper"],
    ["Цибао (старый городок)", "Qibao ancient town Shanghai"],
    ["WeWork Nanjing West Road", "coworking office Shanghai"],
    ["Century Park", "Century Park Shanghai Pudong"],
  ],
  shenzhen: [
    ["OCT Loft", "OCT Loft Shenzhen creative district"],
    ["Window of the World", "Window of the World Shenzhen theme park"],
    ["Парк Шэньчжэньской бухты", "Shenzhen Bay Park waterfront"],
    ["Рынок Хуацянбэй", "Huaqiangbei electronics market Shenzhen"],
    ["Пешеходная улица Дунмэнь", "Dongmen pedestrian street Shenzhen"],
    ["Парк Ляньхуашань", "Lianhuashan Park Shenzhen skyline"],
    ["Обзорная площадка Ping An Finance Centre", "Ping An Finance Centre Shenzhen tower"],
    ["Sea World (Шекоу)", "Shekou Sea World Shenzhen marina"],
    ["WeWork Shenzhen Bay", "coworking office Shenzhen"],
    ["Деревня масляной живописи Дафэнь", "Dafen Oil Painting Village Shenzhen"],
    ["1949 The Hidden City", "industrial restaurant district Shenzhen Nanshan"],
    ["Seesaw Coffee", "specialty coffee shop China"],
  ],
  "novi-sad": [
    ["Петроварадинская крепость", "Petrovaradin Fortress Novi Sad Danube"],
    ["Улица Змай Йовина", "Zmaj Jovina street Novi Sad"],
    ["Площадь Слободы и Ратуша", "Novi Sad Freedom Square City Hall"],
    ["Дунавский парк", "Dunavski park Novi Sad"],
    ["Пляж Штранд", "Strand beach Novi Sad Danube"],
    ["Зелена пиjaца", "green market Novi Sad Serbia"],
    ["Salaš 137", "traditional Vojvodina restaurant countryside"],
    ["Fish i Zeleniš", "riverside fish restaurant Danube Serbia"],
    ["Kafe 021", "cafe bar Novi Sad street"],
    ["ICT Hub Novi Sad", "coworking office tech Serbia"],
    ["Синагога Нови-Сада", "Novi Sad synagogue concert hall"],
    ["Шафарикова улица", "Šafarikova street Novi Sad bars"],
  ],
  "san-francisco": [
    ["Golden Gate Bridge", "Golden Gate Bridge San Francisco"],
    ["Golden Gate Park", "Golden Gate Park San Francisco"],
    ["Ferry Building Marketplace", "Ferry Building San Francisco marketplace"],
    ["Фрески Балми-Элли (Мишен)", "Balmy Alley murals Mission San Francisco"],
    ["Чайна-таун", "Chinatown San Francisco gate"],
    ["Пирс 39 / Fisherman's Wharf", "Pier 39 Fisherman's Wharf San Francisco"],
    ["Blue Bottle Coffee", "Blue Bottle Coffee San Francisco"],
    ["Tartine Bakery", "bakery bread San Francisco Mission"],
    ["Dolores Park", "Dolores Park San Francisco skyline"],
    ["WeWork Market Street", "coworking office San Francisco"],
    ["Alcatraz Island", "Alcatraz Island San Francisco bay"],
    ["House of Prime Rib", "steakhouse restaurant interior classic"],
  ],
  kyrenia: [
    ["Замок Кирении", "Kyrenia Castle Cyprus harbour"],
    ["Гавань Кирении", "Kyrenia harbour Cyprus boats"],
    ["Замок Святого Иллариона", "St Hilarion Castle Cyprus"],
    ["Аббатство Беллапаис", "Bellapais Abbey Cyprus"],
    ["Пляж Алагади", "Alagadi beach Cyprus turtle"],
    ["Карakum", "Karakum Kyrenia Cyprus coast"],
    ["Niazi's Restaurant", "kebab restaurant Cyprus harbour"],
    ["Кофейни набережной гавани", "harbour cafe Mediterranean seafront"],
    ["Пятничный рынок Кирении (Cuma Pazarı)", "local market Cyprus Turkish"],
    ["Лапта", "Lapta village Cyprus mountains sea"],
    ["Смотровая площадка Озанкёй", "Ozankoy Cyprus mountain view"],
    ["Музей икон Архангела Михаила", "Archangelos church icon museum Cyprus"],
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

// Заливает фото для best_places (21-я волна: osh, nis, guangzhou) в
// lib/cities-content.ts.
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
  osh: [
    ["Гора Сулайман-Тоо", "Sulaiman-Too mountain Osh"],
    ["Пещерный музей на Сулайман-Тоо", "Sulaiman-Too cave museum"],
    ["Ошский базар (Джайма-базар)", "Osh bazaar Kyrgyzstan market"],
    ["Мечеть Рабат Абдулла-хана", "old mosque Central Asia Kyrgyzstan"],
    ["Парк имени Алишера Навои", "city park Central Asia trees"],
    ["Узгенский архитектурный комплекс", "Uzgen minaret Kyrgyzstan"],
    ["Дом-музей Курманджан-датки", "Kyrgyz museum traditional"],
    ["Коворкинг при Ошском государственном университете", "university coworking Central Asia"],
    ["Чайхана в центре Оша", "plov pilaf restaurant Central Asia"],
    ["Кофейня на проспекте Ленина", "coffee shop Central Asia street"],
    ["Набережная реки Ак-Буура", "river embankment Central Asia city"],
    ["Микрорайон Достук", "residential district Central Asia city"],
  ],
  nis: [
    ["Нишка тврджава (крепость)", "Nis fortress Serbia"],
    ["Чегар (Ćele Kula, башня из черепов)", "Cele Kula Skull Tower Nis"],
    ["Мемориал Црвени Крст", "Crveni Krst memorial Nis"],
    ["Бульвар Обреновича", "pedestrian street Serbia city"],
    ["Нишка Баня", "spa town thermal Serbia"],
    ["Парк «Чаир»", "Cair park Nis Serbia"],
    ["Пијаца (центральный рынок)", "Serbian market stalls"],
    ["Кафана в центре Ниша", "Serbian tavern restaurant traditional"],
    ["Кофейня на бульваре Обреновича", "cafe street Serbia"],
    ["Niš Science and Technology Park", "technology park office Serbia"],
    ["Нишский университет", "university building Serbia"],
    ["Набережная реки Нишава", "river embankment Serbia city"],
  ],
  guangzhou: [
    ["Кантонская телебашня (Canton Tower)", "Canton Tower Guangzhou"],
    ["Остров Шамянь (Shamian Island)", "Shamian Island Guangzhou colonial"],
    ["Академия семьи Чэнь (Chen Clan Academy)", "Chen Clan Academy Guangzhou"],
    ["Храм Шести баньянов (Six Banyan Temple)", "Six Banyan Temple Guangzhou pagoda"],
    ["Пешеходная улица Шансяцзю (Shangxiajiu)", "Shangxiajiu pedestrian street Guangzhou"],
    ["Оптовый рынок тканей Чжунда (Zhongda Fabric Market)", "fabric wholesale market China"],
    ["Чайный рынок Фанцунь (Fangcun Tea Market)", "tea market wholesale China"],
    ["Площадь Хуачэн и Чжуцзян Синьчэн", "Zhujiang New Town Guangzhou skyline"],
    ["Парк Юэсю", "Yuexiu Park Guangzhou"],
    ["Ресторан «Таотаоцзюй» (Tao Tao Ju)", "Cantonese dim sum restaurant"],
    ["Кофейня в Тяньхэ (Zhujiang New Town)", "coffee shop China modern"],
    ["WeWork Zhujiang New Town", "coworking office China modern"],
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

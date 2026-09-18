// Заливает фото для best_places (19-я волна: ras-al-khaimah, kotor, busan,
// fukuoka, palma-de-mallorca) в lib/cities-content.ts.
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
  "ras-al-khaimah": [
    ["Остров Аль-Марджан (Al Marjan Island)", "Al Marjan Island Ras Al Khaimah resort"],
    ["Джебель-Джайс (Jebel Jais)", "Jebel Jais mountain zipline UAE"],
    ["Марина Аль-Хамра-Виллидж", "Al Hamra Village marina Ras Al Khaimah"],
    ["Форт Дхайя (Dhayah Fort)", "Dhayah Fort Ras Al Khaimah hill"],
    ["Национальный музей RAK", "museum interior Arabian heritage"],
    ["Мангровый заповедник Мина-эль-Араб", "mangrove boardwalk UAE coast"],
    ["Suwaidi Pearl Farm", "pearl oyster diving Gulf"],
    ["Набережная Аль-Каваcим-Корниш", "corniche waterfront Ras Al Khaimah"],
    ["Manar Mall", "shopping mall UAE interior"],
    ["Старый рынок RAK (Old Souq)", "traditional souq market UAE"],
    ["RAKEZ Business Zone", "business park office UAE"],
    ["Кофейня в марине Аль-Хамра", "coffee shop yacht marina"],
  ],
  kotor: [
    ["Старый город Котора", "Kotor old town Montenegro bay"],
    ["Крепостная стена и крепость Святого Иоанна", "Kotor fortress walls hike Montenegro"],
    ["Бухта Котора (Бока-Которска)", "Bay of Kotor Montenegro aerial"],
    ["Пераст", "Perast Montenegro coast"],
    ["Госпа-од-Шкрпела (Our Lady of the Rocks)", "Our Lady of the Rocks island Montenegro"],
    ["Кафедральный собор Святого Трифона", "Saint Tryphon Cathedral Kotor"],
    ["Пьяца-де-Арме (главная площадь)", "Kotor main square Montenegro"],
    ["Рынок Котора (Pijaca)", "outdoor market stalls Balkans"],
    ["Konoba Scala Santa", "traditional tavern restaurant Balkans"],
    ["Cesarica", "seafood restaurant waterfront Montenegro"],
    ["Кафе на площади Цветов (Trg od Cvijeća)", "cafe square Kotor Montenegro"],
    ["Смотровая площадка на серпантине к Негушам", "Kotor serpentine road viewpoint Montenegro"],
  ],
  busan: [
    ["Пляж Хэундэ", "Haeundae beach Busan skyline"],
    ["Пляж Кванмён (Gwangalli)", "Gwangalli beach Busan bridge"],
    ["Рынок Чагальчхи", "Jagalchi fish market Busan"],
    ["Деревня Камчхон (Gamcheon Culture Village)", "Gamcheon Culture Village Busan colorful"],
    ["Храм Хэдонъёнгунса (Haedong Yonggungsa)", "Haedong Yonggungsa temple Busan coast"],
    ["Centum City / BEXCO", "Busan modern skyline towers"],
    ["Мост Кванан-Дэгё (Gwangan Bridge)", "Gwangan Bridge Busan night"],
    ["Тхэджондэ (Taejongdae)", "coastal cliff lighthouse Korea"],
    ["BIFF Square / рыночный квартал Нампходона", "Busan street market night"],
    ["Канатная дорога Сондо (Songdo Marine Cable Car)", "cable car over beach Asia"],
    ["Кофейня в Centum City", "coffee shop Korea modern"],
    ["Набережный квартал живой рыбы у Кванмён", "seafood market tank Korea"],
  ],
  fukuoka: [
    ["Тэндзин", "Tenjin Fukuoka shopping district"],
    ["Хаката (у вокзала)", "Hakata Station Fukuoka"],
    ["Храм Дазайфу Тэммангу", "Dazaifu Tenmangu shrine Japan"],
    ["Fukuoka Tower", "Fukuoka Tower Momochi beach"],
    ["Парк Оходри (Ohori Park)", "Ohori Park Fukuoka lake"],
    ["Ятай (уличные ларьки) вдоль реки Наканосу", "yatai street food stalls Fukuoka"],
    ["Рынок Янагибаси (Yanagibashi Market)", "Yanagibashi Market Fukuoka"],
    ["Ичиран (оригинальный ресторан)", "tonkotsu ramen shop Japan"],
    ["Канал-Сити Хаката (Canal City Hakata)", "Canal City Hakata Fukuoka"],
    ["Руины замка Фукуока", "Fukuoka Castle ruins park"],
    ["Fukuoka Growth Next", "startup coworking Japan office"],
    ["Кофейня в Якуине", "cafe Japan neighborhood street"],
  ],
  "palma-de-mallorca": [
    ["Кафедральный собор Ла-Сеу (Catedral de Mallorca)", "Palma Cathedral La Seu Mallorca"],
    ["Старый город Пальмы (Casco Antiguo)", "Palma de Mallorca old town streets"],
    ["Замок Бельвер (Castell de Bellver)", "Bellver Castle Palma Mallorca"],
    ["Рынок Санта-Каталина (Mercat de Santa Catalina)", "Santa Catalina market Palma"],
    ["Пасео-Маритимо и порт Пальмы", "Paseo Maritimo Palma marina"],
    ["Пляж Кан-Пастилья / Плайя-де-Пальма", "Playa de Palma beach Mallorca"],
    ["Деревня Вальдемосса (Valldemossa)", "Valldemossa village Mallorca mountains"],
    ["Серра-де-Трамунтана", "Serra de Tramuntana Mallorca mountains"],
    ["Пляж Кала-Майор", "Cala Major beach Palma"],
    ["Форн-дес-Театре (историческая пекарня)", "bakery pastry Spain traditional"],
    ["Рестораны и бары Санта-Каталины", "Santa Catalina Palma restaurants street"],
    ["ParcBit", "tech park office building Spain"],
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

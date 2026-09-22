// Заливает фото для best_places (седьмая волна: mersin, torrevieja, galle,
// bar, kragujevac) в lib/cities-content.ts.
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
  mersin: [
    ["Крепость Кызкалеси (Девичий замок)", "Kizkalesi Maiden Castle Turkey"],
    ["Тарс (Tarsus)", "Tarsus Turkey ancient street"],
    ["Набережная Мерсина", "Mersin Turkey waterfront promenade"],
    ["Мезитли", "Mediterranean coast villas Turkey"],
    ["Рынок Мерсина (Мерсин Пазары)", "Turkish bazaar market vegetables"],
    ["Марина Мерсина", "yacht marina Mediterranean Turkey"],
    ["Рыбный ресторан в порту Мерсина", "seafood restaurant port Turkey"],
    ["Кафе на набережной Йеничехира", "cafe seaside terrace Turkey"],
    ["Русский магазин и кафе в Мезитли", "bakery shop shelves bread"],
    ["Пещеры Небо и Ад (Cennet ve Cehennem)", "sinkhole cave Turkey canyon"],
    ["Коворкинг в Йеничехире", "coworking space desks"],
    ["Пляж Куршунлу", "pine forest sandy beach Turkey"],
  ],
  torrevieja: [
    ["Розовая лагуна Торревьехи (Лас-Салинас)", "Torrevieja pink lagoon salt lake"],
    ["Пляж Плайя-дель-Кура", "Playa del Cura beach Spain"],
    ["Пляж Ла-Мата", "La Mata beach Spain"],
    ["Муниципальный рынок Меркадо-Мунисипаль", "Spanish market fresh produce"],
    ["Лос-Бальконес", "Costa Blanca villas Spain suburb"],
    ["Торговый центр Хабанерас", "shopping mall Spain"],
    ["Набережная Пасео Вista Alegre", "Torrevieja marina promenade"],
    ["Рыбный ресторан в порту Торревьехи", "seafood restaurant marina Spain"],
    ["Русский магазин и кафе в Лос-Бальконес", "bakery shop shelves bread"],
    ["Парк Асиклия", "palm tree park Spain"],
    ["Коворкинг в центре Торревьехи", "coworking office Spain"],
    ["Пляж Агуас-Нуэвас", "Aguas Nuevas beach Spain"],
  ],
  galle: [
    ["Галле-Форт (крепостные стены)", "Galle Fort walls Sri Lanka"],
    ["Пляж Унаватуна", "Unawatuna beach Sri Lanka"],
    ["Маяк Галле", "Galle lighthouse Sri Lanka"],
    ["Пляж Джангл-Бич", "jungle beach tropical cove Sri Lanka"],
    ["Рыбный рынок Галле", "fish market Sri Lanka"],
    ["Морской храм на мысе форта", "Buddhist temple ocean Sri Lanka"],
    ["Ресторан морепродуктов в Унаватуне", "beach seafood restaurant Sri Lanka"],
    ["Кафе для серферов и номадов в Далавелле", "cafe smoothie bowl beach"],
    ["Далавелла-Бич", "Dalawella beach Sri Lanka"],
    ["Мирисса (китовое сафари)", "Mirissa beach boats Sri Lanka"],
    ["Коворкинг в Унаватуне", "coworking space tropical"],
    ["Голландская реформатская церковь", "Dutch Reformed Church colonial"],
  ],
  bar: [
    ["Старый Бар (Стари-Бар)", "Stari Bar ruins Montenegro"],
    ["Порт Бара", "Bar Montenegro port"],
    ["Королевский парк (Кральичин Парк)", "botanical park Montenegro"],
    ["Пляж Сутоморе", "Sutomore beach Montenegro"],
    ["Рынок Бара (Пијаца)", "Montenegro market produce"],
    ["Старейшая олива Европы", "old olive tree Mediterranean"],
    ["Рыбный ресторан на набережной Бара", "seafood restaurant harbor Montenegro"],
    ["Кафе в Королевском парке", "park cafe trees shade"],
    ["Русский магазин и пекарня в Шушани", "bakery shop shelves bread"],
    ["Пляж Зеленый пояс", "Montenegro city beach promenade"],
    ["Коворкинг в центре Бара", "coworking office space"],
    ["Собор Святого Иоанна Владимира", "Orthodox cathedral Montenegro"],
  ],
  kragujevac: [
    ["Мемориальный парк Шумарице", "Sumarice memorial park Serbia"],
    ["Старая ратуша (Стара Скупштина)", "old parliament building Serbia"],
    ["Музей «Старая Ливница»", "industrial museum foundry"],
    ["Великий парк (Велики парк)", "city park Serbia autumn"],
    ["Городской рынок (Зелена пијаца)", "Serbia farmers market produce"],
    ["Церковь Успения Богородицы (Стари Храм)", "Orthodox church Serbia old"],
    ["Ресторан сербской кухни в центре", "Serbian restaurant grill traditional"],
    ["Кафе на пешеходной улице Князя Милоша", "pedestrian street cafe Europe"],
    ["Национальный музей Крагуеваца", "museum exhibition hall"],
    ["Ботанический сад Университета", "botanical garden university"],
    ["Коворкинг при Технопарке Крагуеваца", "tech coworking space"],
    ["Завод Stellantis (историческая часть)", "car factory industrial"],
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

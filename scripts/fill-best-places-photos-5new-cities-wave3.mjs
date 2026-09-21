// Заливает фото для best_places (20-я волна: beijing, netanya, marbella,
// trabzon, shymkent) в lib/cities-content.ts.
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
  beijing: [
    ["Запретный город", "Forbidden City Beijing palace"],
    ["Великая Китайская стена (участок Мутяньюй)", "Mutianyu Great Wall China"],
    ["Площадь Тяньаньмэнь", "Tiananmen Square Beijing"],
    ["Храм Неба", "Temple of Heaven Beijing"],
    ["Хутуны Наньлогусян", "Nanluoguxiang hutong Beijing alley"],
    ["798 Art Zone", "798 Art Zone Beijing gallery"],
    ["Летний дворец", "Summer Palace Beijing lake"],
    ["Рынок Ванфуцзин", "Wangfujing street Beijing"],
    ["Da Dong Roast Duck", "Peking duck restaurant China"],
    ["Кофейня в Саньлитунь", "coffee shop Sanlitun Beijing"],
    ["WeWork Zhongguancun", "coworking office China modern"],
    ["Озеро Хоухай (Houhai)", "Houhai lake Beijing night"],
  ],
  netanya: [
    ["Набережная Ир-Ямим", "Netanya promenade Ir Yamim towers"],
    ["Пляж Сиронит (Sironit Beach)", "Netanya beach cliff Israel"],
    ["Площадь Независимости (Kikar Ha'atzmaut)", "Netanya Independence Square"],
    ["Пешеходная улица Герцль", "Herzl street pedestrian Israel"],
    ["Алмазная биржа Нетании", "diamond polishing workshop Israel"],
    ["Парк Ям (Sea Park)", "sea park cliff sunset Israel"],
    ["Рынок Шук ха-Ир", "Israeli market spices stalls"],
    ["Chuk Chuk", "seafood restaurant Mediterranean terrace"],
    ["Cafe Cafe на площади Независимости", "cafe square Israel outdoor"],
    ["Yes Планет Нетания", "shopping mall cinema modern"],
    ["Заповедник Черного Ириса", "black iris flower reserve Israel"],
    ["Коворкинг в Рамат-Полег", "coworking office park Israel"],
  ],
  marbella: [
    ["Пуэрто-Банус", "Puerto Banus marina yachts Marbella"],
    ["Старый город (Casco Antiguo)", "Marbella old town white streets"],
    ["Пляж Эль-Фаро (Playa El Faro)", "Marbella beach lighthouse"],
    ["Золотая миля (Milla de Oro)", "Golden Mile Marbella villas"],
    ["Апельсиновая площадь (Plaza de los Naranjos)", "Plaza de los Naranjos Marbella"],
    ["Парк Аламеда (Alameda Park)", "Alameda Park Marbella"],
    ["Гольф-долина Нуэва-Андалусия", "golf course Costa del Sol Spain"],
    ["Муниципальный рынок Марбельи", "Spanish market seafood stalls"],
    ["El Lago", "fine dining restaurant terrace Spain"],
    ["Кофейня на набережной Пасео-Маритимо", "beachfront promenade cafe Spain"],
    ["Coworking Marbella", "coworking space Spain modern"],
    ["Крепость Марбельи (Castillo de Marbella)", "old fortress wall Andalusia"],
  ],
  trabzon: [
    ["Монастырь Сумела (Sümela Manastırı)", "Sumela Monastery Trabzon cliff"],
    ["Площадь Мейдан (Atatürk Alanı)", "Trabzon Ataturk square"],
    ["Крепость Трабзона (Ortahisar Kalesi)", "Trabzon castle walls Turkey"],
    ["Айя-София Трабзона", "Hagia Sophia Trabzon Turkey"],
    ["Озеро Узунгёль (Uzungöl)", "Uzungol lake Turkey mountains"],
    ["Форум Трабзон (Forum Trabzon)", "shopping mall Turkey modern"],
    ["Набережная Трабзон Кордону", "Trabzon coastal promenade Black Sea"],
    ["Боздепе (смотровая площадка)", "Boztepe viewpoint Trabzon sunset"],
    ["Старый базар Трабзона", "Trabzon bazaar market Turkey"],
    ["Ресторан черноморской кухни на площади Мейдан", "Black Sea Turkish cuisine restaurant"],
    ["Чайхана на площади Мейдан", "Turkish tea house traditional"],
    ["Коворкинг у Karadeniz Technical University", "university campus coworking Turkey"],
  ],
  shymkent: [
    ["Площадь Ордабасы", "Ordabasy square Shymkent Kazakhstan"],
    ["Парк Абая", "Abai park Shymkent Kazakhstan"],
    ["Дендропарк Шымкента", "dendrological park garden Kazakhstan"],
    ["Зоопарк Шымкента", "zoo Kazakhstan animals park"],
    ["Древнее городище Сайрам", "ancient Silk Road settlement ruins"],
    ["Мавзолей Ходжи Ахмеда Ясави в Туркестане", "Khoja Ahmed Yasawi Mausoleum Turkestan"],
    ["Старый базар Шымкента", "Central Asian bazaar market spices"],
    ["Центральная мечеть Шымкента", "mosque Kazakhstan central Asia"],
    ["Ресторан узбекско-казахской кухни на Тауке-хана", "plov pilaf restaurant Central Asia"],
    ["Кофейня на проспекте Тауке-хана", "coffee shop Central Asia street"],
    ["IT Hub Shymkent", "startup coworking office Central Asia"],
    ["Каскадный фонтан на проспекте Тауке-хана", "fountain city avenue evening"],
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

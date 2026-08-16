// ============================================================
// Миграция фото городов в Cloudflare R2 (slug-based подход).
// R2 не берёт плату за egress; файлы кладём по пути city/{slug}.jpg
// Работает БЕЗ доступа к Supabase.
//
// Что делает:
//  1. Для каждого города поочерёдно ищет фото через Unsplash API.
//  2. Скачивает топ-результат (w=1600, q=80, fm=jpg).
//  3. Загружает в R2 bucket как city/{slug}.jpg (idempotent: пропускает уже загруженные).
//  4. Также загружает фото главной страницы как home/hero.jpg
//
// В коде: lib/photo.ts::cityPhotoSrc() читает ${NEXT_PUBLIC_R2_URL}/city/{slug}.jpg
//
// Требования:
//  ~/.relocost/r2_account_id     — Cloudflare Account ID
//  ~/.relocost/r2_access_key_id  — R2 API Token (Access Key ID)
//  ~/.relocost/r2_secret_key     — R2 API Token (Secret Key)
//  ~/.relocost/r2_bucket         — имя бакета (relocost-photos)
//  ~/.relocost/r2_public_url     — публичный URL (https://pub-XXX.r2.dev)
//  ~/.relocost/unsplash_access_key — Unsplash API key
//
// Запуск: node scripts/migrate-to-r2.mjs
// ============================================================

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readSecret(name) {
  const p = path.join(HOME, ".relocost", name);
  if (!fs.existsSync(p)) throw new Error(`Файл не найден: ${p}`);
  return fs.readFileSync(p, "utf8").trim();
}

const R2_ACCOUNT_ID  = readSecret("r2_account_id");
const R2_ACCESS_KEY  = readSecret("r2_access_key_id");
const R2_SECRET_KEY  = readSecret("r2_secret_key");
const R2_BUCKET      = readSecret("r2_bucket");
const R2_PUBLIC_URL  = readSecret("r2_public_url");
const UNSPLASH_KEY   = readSecret("unsplash_access_key");

const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Все города (slug → Unsplash query) ──────────────────────────────────────
// Включает как города из seed-batch-*.mjs, так и первоначальные (tbilisi, dubai, etc.)
const CITIES = {
  // Первые популярные (из первого сида)
  "tbilisi":              "tbilisi georgia old town",
  "istanbul":             "istanbul turkey bosphorus",
  "dubai":                "dubai uae skyline marina",
  "yerevan":              "yerevan armenia city ararat",
  "almaty":               "almaty kazakhstan city mountains",
  "bangkok":              "bangkok thailand skyline",
  "prague":               "prague czech republic old town bridge",
  // Из seed-batch-2.mjs
  "bishkek":              "bishkek kyrgyzstan",
  "tashkent":             "tashkent uzbekistan",
  "minsk":                "minsk belarus",
  "podgorica":            "podgorica montenegro",
  "batumi":               "batumi black sea georgia",
  "antalya":              "antalya turkey",
  "phuket":               "phuket thailand beach",
  "chiang-mai":           "chiang mai thailand",
  "kutaisi":              "kutaisi georgia",
  "budva":                "budva montenegro sea",
  // Из seed-batch-3.mjs
  "sofia":                "sofia bulgaria city",
  "varna":                "varna bulgaria city",
  "athens":               "athens greece acropolis",
  "valencia":             "valencia spain city",
  "nicosia":              "nicosia cyprus city",
  "paphos":               "paphos cyprus city",
  "dubrovnik":            "dubrovnik croatia old town",
  "kuala-lumpur":         "kuala lumpur malaysia city",
  "da-nang":              "da nang vietnam beach",
  "nha-trang":            "nha trang vietnam beach",
  // Из seed-batch-4.mjs
  "tel-aviv":             "tel aviv israel beach city",
  "barcelona":            "barcelona spain sagrada familia",
  "ho-chi-minh":          "ho chi minh city vietnam",
  "goa":                  "goa india beach",
  "astana":               "astana kazakhstan city",
  "izmir":                "izmir turkey waterfront",
  "porto":                "porto portugal douro",
  "malaga":               "malaga spain coast",
  "samarkand":            "samarkand registan uzbekistan",
  "pattaya":              "pattaya thailand beach",
  // Из seed-batch-5.mjs
  "penang":               "penang george town malaysia",
  "abu-dhabi":            "abu dhabi uae skyline",
  "bukhara":              "bukhara uzbekistan old city",
  "baku":                 "baku azerbaijan flame towers",
  "samui":                "koh samui thailand beach",
  "bodrum":               "bodrum turkey marina",
  "tirana":               "tirana albania city",
  "chisinau":             "chisinau moldova city",
  "dushanbe":             "dushanbe tajikistan city",
  "colombo":              "colombo sri lanka city",
  // Из seed-batch-6.mjs
  "hanoi":                "hanoi vietnam old quarter",
  "larnaca":              "larnaca cyprus beach",
  "heraklion":            "heraklion crete greece",
  "alicante":             "alicante spain beach",
  "fethiye":              "fethiye turkey oludeniz",
  "tivat":                "tivat montenegro porto",
  "doha":                 "doha qatar skyline",
  "cebu":                 "cebu philippines city",
  "split":                "split croatia old town",
  "thessaloniki":         "thessaloniki greece waterfront",
  // Из seed-batch-7.mjs
  "aktau":                "aktau kazakhstan caspian sea",
  "muscat":               "muscat oman sultan mosque",
  "manama":               "manama bahrain skyline",
  "phnom-penh":           "phnom penh cambodia city",
  "sanya":                "sanya hainan china beach",
  "seoul":                "seoul south korea city",
  "sharjah":              "sharjah uae city",
  "madrid":               "madrid spain gran via",
  "jakarta":              "jakarta indonesia city",
  "phu-quoc":             "phu quoc vietnam beach",
  "krabi":                "krabi thailand beach cliffs",
  // Из seed-batch-8.mjs
  "hurghada":             "hurghada egypt red sea",
  "sharm-el-sheikh":      "sharm el sheikh egypt sea",
  "cairo":                "cairo egypt pyramids",
  "marrakesh":            "marrakesh morocco medina",
  "sousse":               "sousse tunisia medina sea",
  "mexico-city":          "mexico city architecture",
  "playa-del-carmen":     "playa del carmen mexico beach",
  "buenos-aires":         "buenos aires argentina city",
  "rio-de-janeiro":       "rio de janeiro brazil beach",
  "amman":                "amman jordan city",
  // Из seed-batch-9.mjs
  "haifa":                "haifa israel bahai gardens",
  "manila":               "manila philippines city",
  "kathmandu":            "kathmandu nepal temple",
  "siem-reap":            "siem reap angkor cambodia",
  "seville":              "seville spain plaza",
  "ankara":               "ankara turkey city",
  "skopje":               "skopje north macedonia city",
  "kazan":                "kazan russia kremlin",
  "yekaterinburg":        "yekaterinburg russia city",
  "gyumri":               "gyumri armenia city",
  // Из seed-batch-10.mjs
  "berlin":               "berlin germany city",
  "vienna":               "vienna austria city",
  "paris":                "paris france eiffel tower",
  "rome":                 "rome italy colosseum",
  "amsterdam":            "amsterdam netherlands canal",
  "ljubljana":            "ljubljana slovenia city",
  "warsaw":               "warsaw poland old town",
  "tallinn":              "tallinn estonia old town",
  "riga":                 "riga latvia old town",
  "vilnius":              "vilnius lithuania old town",
  // Дополнительные (могут быть в batch-11, 12)
  "limassol":             "limassol cyprus marina",
  "ohrid":                "ohrid north macedonia lake",
  "sarajevo":             "sarajevo bosnia city",
  "belgrade":             "belgrade serbia city",
  "bucharest":            "bucharest romania city",
  "budapest":             "budapest hungary parliament",
  "lisbon":               "lisbon portugal city",
  "milan":                "milan italy duomo",
  "munich":               "munich germany city",
  "zurich":               "zurich switzerland city",
  // Из seed-batch-13.mjs
  "zagreb":               "zagreb croatia upper town",
  "singapore":            "singapore skyline marina bay",
  "tokyo":                "tokyo japan city skyline",
  "alanya":               "alanya turkey castle sea",
  "herceg-novi":          "herceg novi montenegro bay",
  "merida":               "merida mexico colonial city",
  "cape-town":            "cape town south africa table mountain",
  // Из seed-batch-14.mjs (Индонезия)
  "ubud":                 "ubud bali indonesia rice terraces",
  "seminyak":             "seminyak bali beach sunset",
  "lombok":               "lombok indonesia beach ocean",
  "medan":                "medan indonesia city sumatra",
  "yogyakarta":           "yogyakarta java indonesia borobudur",
  // Из seed-batch-14.mjs (Индия)
  "mumbai":               "mumbai india skyline gateway",
  "bangalore":            "bangalore india city modern",
  "delhi":                "new delhi india red fort city",
  "chennai":              "chennai india beach marina",
  "pondicherry":          "pondicherry india french quarter beach",
};

// Главная страница — отдельно
const HOME_HERO_KEY = "home/hero.jpg";
const HOME_HERO_QUERY = "world map globe city travel";

// ── Unsplash API ─────────────────────────────────────────────────────────────
async function searchUnsplash(query, retries = 3) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (res.status === 403 || res.status === 429) {
    if (retries > 0) {
      console.log(`  [rate-limit] Unsplash, жду 75 сек… (попыток осталось: ${retries})`);
      await sleep(75_000);
      return searchUnsplash(query, retries - 1);
    }
    throw new Error(`Unsplash rate-limit (${res.status})`);
  }
  if (!res.ok) throw new Error(`Unsplash search error ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) throw new Error(`Unsplash: нет фото для "${query}"`);
  return data.results[0].urls.raw;
}

async function downloadPhoto(rawUrl) {
  const url = `${rawUrl}&w=1600&q=80&fm=jpg&fit=crop`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download error ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// ── R2 upload via S3-compatible API ─────────────────────────────────────────
const hmac = (key, msg, enc) => {
  const k = typeof key === "string" ? Buffer.from(key, "utf8") : key;
  return crypto.createHmac("sha256", k).update(msg, "utf8").digest(enc || "");
};

async function r2Request(method, key, buffer = null, contentType = "image/jpeg") {
  const now = new Date();
  // Правильный AWS4 timestamp: "20260703T103045Z" (17 символов)
  const dateStr = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const dateOnly = dateStr.slice(0, 8);
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const bodyHash = buffer
    ? crypto.createHash("sha256").update(buffer).digest("hex")
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const headers = {
    "Content-Type": contentType,
    "x-amz-content-sha256": bodyHash,
    "x-amz-date": dateStr,
    "Host": new URL(R2_ENDPOINT).host,
  };

  const sortedKeys = Object.keys(headers).sort();
  const signedHeaders = sortedKeys.map(k => k.toLowerCase()).join(";");
  const canonReq = [
    method,
    `/${R2_BUCKET}/${key}`,
    "",
    sortedKeys.map(k => `${k.toLowerCase()}:${headers[k]}`).join("\n") + "\n",
    signedHeaders,
    bodyHash,
  ].join("\n");

  const scope = `${dateOnly}/auto/s3/aws4_request`;
  const strToSign = ["AWS4-HMAC-SHA256", dateStr, scope,
    crypto.createHash("sha256").update(canonReq).digest("hex")].join("\n");
  const sigKey = hmac(hmac(hmac(hmac(`AWS4${R2_SECRET_KEY}`, dateOnly), "auto"), "s3"), "aws4_request");
  const sig = crypto.createHmac("sha256", sigKey).update(strToSign).digest("hex");
  const auth = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${scope},SignedHeaders=${signedHeaders},Signature=${sig}`;

  const fetchOpts = { method, headers: { ...headers, Authorization: auth } };
  if (buffer) { fetchOpts.body = buffer; fetchOpts.duplex = "half"; }

  const res = await fetch(url, fetchOpts);
  if (method === "HEAD") return res.ok;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 ${method} ${res.status}: ${text.slice(0, 200)}`);
  }
  return true;
}

async function existsInR2(key) { return r2Request("HEAD", key); }
async function uploadToR2(key, buffer, ct = "image/jpeg") { return r2Request("PUT", key, buffer, ct); }

// ── Main ────────────────────────────────────────────────────────────────────
async function processOne(key, query, label) {
  if (await existsInR2(key)) {
    console.log(`  [EXISTS] ${label} → ${key}`);
    return "skip";
  }
  console.log(`  [↓ Unsplash] ${label}: "${query}"…`);
  const rawUrl = await searchUnsplash(query);
  const buf = await downloadPhoto(rawUrl);
  await uploadToR2(key, buf);
  console.log(`  [✓ R2] ${label}: ${R2_PUBLIC_URL}/${key}`);
  return "ok";
}

async function main() {
  console.log(`\n🚀 Relocost → Cloudflare R2 migration`);
  console.log(`   Bucket:     ${R2_BUCKET}`);
  console.log(`   Public URL: ${R2_PUBLIC_URL}`);
  console.log(`   Cities:     ${Object.keys(CITIES).length}\n`);

  let ok = 0, skip = 0, fail = 0;

  // Hero главной
  try {
    const r = await processOne(HOME_HERO_KEY, HOME_HERO_QUERY, "homepage hero");
    if (r === "ok") ok++; else skip++;
  } catch (e) {
    console.error(`  [✗] homepage hero: ${e.message}`);
    fail++;
  }
  await sleep(400);

  // Города
  const entries = Object.entries(CITIES);
  for (let i = 0; i < entries.length; i++) {
    const [slug, query] = entries[i];
    try {
      const r = await processOne(`city/${slug}.jpg`, query, slug);
      if (r === "ok") ok++; else skip++;
    } catch (e) {
      console.error(`  [✗] ${slug}: ${e.message}`);
      fail++;
    }
    if (i < entries.length - 1) await sleep(350); // Unsplash rate-limit
  }

  console.log(`\n✅ Готово: загружено ${ok}, пропущено ${skip}, ошибок ${fail}`);
  console.log(`\n📝 Добавь в .env.local и на VPS (.env.production):`);
  console.log(`   NEXT_PUBLIC_R2_URL=${R2_PUBLIC_URL}`);
  console.log(`\n📝 Затем задеплой: rm -rf .next/cache && ./deploy.sh`);
}

main().catch(e => { console.error(e); process.exit(1); });

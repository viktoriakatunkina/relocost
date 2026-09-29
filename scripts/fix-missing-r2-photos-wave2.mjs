// ============================================================
// Дозаливка фото в R2 для городов, добавленных ПОСЛЕ последней правки
// migrate-to-r2.mjs — их slug просто не было в хардкоженном словаре CITIES
// того скрипта, поэтому миграция их никогда не касалась.
//
// 2026-09-29: продуктовый аудит нашёл ~40-60% карточек без фото в подборках/
// странах — HEAD-проверкой подтверждено 55 городов, у которых в Supabase
// cities.unsplash_url ЕСТЬ (значит lib/photo.ts::cityPhotoSrc считает, что
// R2-файл точно существует, и НЕ показывает градиентный фоллбэк), но самого
// файла city/{slug}.jpg в R2 физически нет → next/image получает 404.
// Список — 55 slug'ов, не встречающихся в CITIES-словаре migrate-to-r2.mjs.
//
// Логика загрузки (Unsplash search → R2 PUT) скопирована из migrate-to-r2.mjs
// один в один — не модифицируем тот скрипт, чтобы не рисковать его
// стабильной хардкоженной частью с уже проверенными query для 193 городов.
//
// Запуск: node scripts/fix-missing-r2-photos-wave2.mjs
// ============================================================

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const HOME = os.homedir();

function readSecret(name) {
  const p = path.join(HOME, ".relocost", name);
  if (!fs.existsSync(p)) throw new Error(`Файл не найден: ${p}`);
  return fs.readFileSync(p, "utf8").trim();
}

const R2_ACCOUNT_ID = readSecret("r2_account_id");
const R2_ACCESS_KEY = readSecret("r2_access_key_id");
const R2_SECRET_KEY = readSecret("r2_secret_key");
const R2_BUCKET = readSecret("r2_bucket");
const R2_PUBLIC_URL = readSecret("r2_public_url");
const UNSPLASH_KEY = readSecret("unsplash_access_key");

const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// slug → query. Собраны вручную из name_en/country_en (missing_r2_details.json)
// + уточнение достопримечательности/контекста там, где голого "City Country"
// недостаточно для релевантного результата Unsplash.
const CITIES = {
  atyrau: "atyrau kazakhstan caspian city",
  ashdod: "ashdod israel port city",
  bansko: "bansko bulgaria mountain town",
  bakuriani: "bakuriani georgia mountain resort",
  bar: "bar montenegro coast marina",
  "bat-yam": "bat yam israel beach city",
  beijing: "beijing china forbidden city skyline",
  brno: "brno czech republic old town",
  busan: "busan south korea coast city",
  burgas: "burgas bulgaria black sea",
  chania: "chania crete greece old harbor",
  chengdu: "chengdu china city",
  cetinje: "cetinje montenegro old capital",
  denpasar: "denpasar bali indonesia city",
  didim: "didim turkey coast",
  cascais: "cascais portugal coast town",
  "da-lat": "da lat vietnam highlands",
  faro: "faro portugal algarve city",
  galle: "galle sri lanka fort coast",
  guangzhou: "guangzhou china skyline",
  fukuoka: "fukuoka japan city",
  "hoi-an": "hoi an vietnam old town lanterns",
  kandy: "kandy sri lanka lake temple",
  kos: "kos greece island town",
  "hua-hin": "hua hin thailand beach",
  kotor: "kotor montenegro bay old town",
  jerusalem: "jerusalem israel old city",
  kragujevac: "kragujevac serbia city",
  kyrenia: "kyrenia cyprus harbor",
  marbella: "marbella spain coast marina",
  mersin: "mersin turkey coast city",
  netanya: "netanya israel beach city",
  osh: "osh kyrgyzstan city mountains",
  "palma-de-mallorca": "palma de mallorca spain cathedral",
  nis: "nis serbia city",
  "novi-sad": "novi sad serbia fortress",
  pavlodar: "pavlodar kazakhstan river city",
  "phan-thiet": "phan thiet vietnam beach dunes",
  plovdiv: "plovdiv bulgaria old town",
  "ras-al-khaimah": "ras al khaimah uae skyline",
  "san-francisco": "san francisco golden gate bridge",
  rijeka: "rijeka croatia port city",
  pula: "pula croatia arena coast",
  ruse: "ruse bulgaria danube city",
  shenzhen: "shenzhen china skyline",
  shanghai: "shanghai china skyline bund",
  shymkent: "shymkent kazakhstan city",
  "sunny-beach": "sunny beach bulgaria resort",
  ulcinj: "ulcinj montenegro beach old town",
  vanadzor: "vanadzor armenia city",
  "udon-thani": "udon thani thailand city",
  torrevieja: "torrevieja spain coast",
  trabzon: "trabzon turkey black sea coast",
  weligama: "weligama sri lanka beach surf",
  zadar: "zadar croatia old town sea",
};

async function searchUnsplash(query, retries = 3) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
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
  return data.results[0];
}

async function downloadPhoto(rawUrl) {
  const url = `${rawUrl}&w=1600&q=80&fm=jpg&fit=crop`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download error ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const hmac = (key, msg, enc) => {
  const k = typeof key === "string" ? Buffer.from(key, "utf8") : key;
  return crypto.createHmac("sha256", k).update(msg, "utf8").digest(enc || "");
};

async function r2Request(method, key, buffer = null, contentType = "image/jpeg") {
  const now = new Date();
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
    Host: new URL(R2_ENDPOINT).host,
  };
  const sortedKeys = Object.keys(headers).sort();
  const signedHeaders = sortedKeys.map((k) => k.toLowerCase()).join(";");
  const canonReq = [
    method,
    `/${R2_BUCKET}/${key}`,
    "",
    sortedKeys.map((k) => `${k.toLowerCase()}:${headers[k]}`).join("\n") + "\n",
    signedHeaders,
    bodyHash,
  ].join("\n");
  const scope = `${dateOnly}/auto/s3/aws4_request`;
  const strToSign = ["AWS4-HMAC-SHA256", dateStr, scope, crypto.createHash("sha256").update(canonReq).digest("hex")].join("\n");
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

const ENV_TEXT = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const envGet = (name) => ENV_TEXT.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim();
const SUPABASE_URL = envGet("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_KEY = envGet("SUPABASE_SERVICE_ROLE_KEY") || envGet("NEXT_PUBLIC_SUPABASE_ANON_KEY");

// unsplash_url у этих 55 городов и так был заполнен (иначе cityPhotoSrc вообще
// не пытался бы строить R2-ссылку), но реального соответствия загруженному
// файлу не было — перезаписываем актуальными метаданными именно того фото,
// которое реально легло в R2, чтобы атрибуция (CityHero "Фото: X / Unsplash")
// не врала.
async function updateSupabase(slug, photo) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cities?slug=eq.${slug}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      unsplash_url: photo.urls.raw,
      unsplash_photo_id: photo.id,
      unsplash_author_name: photo.user?.name ?? null,
      unsplash_author_url: photo.user?.links?.html ?? null,
    }),
  });
  if (!res.ok) throw new Error(`Supabase update ${res.status}: ${await res.text()}`);
}

async function main() {
  console.log(`\n🚀 Дозаливка R2-фото — волна 2 (города, пропущенные при основной миграции)`);
  console.log(`   Bucket:     ${R2_BUCKET}`);
  console.log(`   Public URL: ${R2_PUBLIC_URL}`);
  console.log(`   Городов:    ${Object.keys(CITIES).length}\n`);

  let ok = 0, skip = 0, fail = 0;
  const failed = [];
  const entries = Object.entries(CITIES);

  for (let i = 0; i < entries.length; i++) {
    const [slug, query] = entries[i];
    const key = `city/${slug}.jpg`;
    try {
      if (await existsInR2(key)) {
        console.log(`  [EXISTS] ${slug} → ${key}`);
        skip++;
      } else {
        console.log(`  [↓ Unsplash] ${slug}: "${query}"…`);
        const photo = await searchUnsplash(query);
        const buf = await downloadPhoto(photo.urls.raw);
        await uploadToR2(key, buf);
        await updateSupabase(slug, photo);
        console.log(`  [✓ R2 + Supabase] ${slug}: ${R2_PUBLIC_URL}/${key}`);
        ok++;
      }
    } catch (e) {
      console.error(`  [✗] ${slug}: ${e.message}`);
      failed.push(slug);
      fail++;
    }
    if (i < entries.length - 1) await sleep(350);
  }

  console.log(`\n✅ Готово: загружено ${ok}, пропущено (уже было) ${skip}, ошибок ${fail}`);
  if (failed.length) console.log(`   Провалились: ${failed.join(", ")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

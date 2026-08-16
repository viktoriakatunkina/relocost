// Загружает в R2 фото для городов без фото: aktau, sousse, pondicherry.
// aktau и sousse берём из Supabase Storage (прямой URL).
// pondicherry ищем через Unsplash с другими запросами.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();

function readSecret(name) {
  const p = path.join(HOME, ".relocost", name);
  if (!fs.existsSync(p)) throw new Error(`Не найден: ${p}`);
  return fs.readFileSync(p, "utf8").trim();
}

const R2_ACCOUNT_ID = readSecret("r2_account_id");
const R2_ACCESS_KEY = readSecret("r2_access_key_id");
const R2_SECRET_KEY = readSecret("r2_secret_key");
const R2_BUCKET     = readSecret("r2_bucket");
const R2_PUBLIC_URL = readSecret("r2_public_url");
const UNSPLASH_KEY  = readSecret("unsplash_access_key");

const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const hmac = (key, msg, enc) => {
  const k = typeof key === "string" ? Buffer.from(key, "utf8") : key;
  return crypto.createHmac("sha256", k).update(msg, "utf8").digest(enc || "");
};

async function r2Request(method, key, buffer = null, contentType = "image/jpeg") {
  const now = new Date();
  const datestamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timestamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
  const bodyHash = buffer
    ? crypto.createHash("sha256").update(buffer).digest("hex")
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const headers = {
    host: `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    "x-amz-date": timestamp,
    "x-amz-content-sha256": bodyHash,
    ...(buffer ? { "content-type": contentType } : {}),
  };
  const sortedKeys = Object.keys(headers).sort();
  const canonHeaders = sortedKeys.map(k => `${k}:${headers[k]}\n`).join("");
  const signedHeaders = sortedKeys.join(";");
  const canonReq = [method, `/${R2_BUCKET}/${key}`, "", canonHeaders, signedHeaders, bodyHash].join("\n");
  const scope = `${datestamp}/auto/s3/aws4_request`;
  const strToSign = ["AWS4-HMAC-SHA256", timestamp, scope, crypto.createHash("sha256").update(canonReq).digest("hex")].join("\n");
  const sigKey = hmac(hmac(hmac(hmac(`AWS4${R2_SECRET_KEY}`, datestamp), "auto"), "s3"), "aws4_request");
  const sig = crypto.createHmac("sha256", sigKey).update(strToSign).digest("hex");
  const auth = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${scope},SignedHeaders=${signedHeaders},Signature=${sig}`;
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const fetchOpts = { method, headers: { ...headers, Authorization: auth } };
  if (buffer) { fetchOpts.body = buffer; fetchOpts.duplex = "half"; }
  const res = await fetch(url, fetchOpts);
  if (method === "HEAD") return res.ok;
  if (!res.ok) throw new Error(`R2 ${method} error ${res.status}: ${await res.text()}`);
  return res;
}

async function existsInR2(key) { return r2Request("HEAD", key); }
async function uploadToR2(key, buffer) { return r2Request("PUT", key, buffer, "image/jpeg"); }

async function downloadUrl(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Download error ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function searchUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
  if (!res.ok) throw new Error(`Unsplash error ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) throw new Error(`Unsplash: нет фото для "${query}"`);
  return `${data.results[0].urls.raw}&w=1600&q=80&fm=jpg&fit=crop`;
}

// Города: slug → прямой URL или массив Unsplash-запросов для fallback
const MISSING = {
  sousse:      { directUrl: "https://ftkyoneazoqlkrpisdef.supabase.co/storage/v1/object/public/photos/u/411d6deb9af9c014.jpg" },
  aktau:       { directUrl: "https://ftkyoneazoqlkrpisdef.supabase.co/storage/v1/object/public/photos/u/ad774237a2a05aa8.jpg" },
  pondicherry: { queries: ["puducherry india", "pondicherry india", "india colonial beach town"] },
};

async function main() {
  for (const [slug, cfg] of Object.entries(MISSING)) {
    const key = `city/${slug}.jpg`;
    if (await existsInR2(key)) {
      console.log(`  [EXISTS] ${slug}`);
      continue;
    }
    try {
      let buf;
      if (cfg.directUrl) {
        console.log(`  [↓ Storage] ${slug}: ${cfg.directUrl}`);
        buf = await downloadUrl(cfg.directUrl);
      } else {
        for (const q of cfg.queries) {
          try {
            console.log(`  [↓ Unsplash] ${slug}: "${q}"`);
            const url = await searchUnsplash(q);
            buf = await downloadUrl(url);
            break;
          } catch (e) {
            console.log(`    → ${e.message}`);
            await sleep(2000);
          }
        }
      }
      if (!buf) throw new Error("Не удалось получить фото");
      await uploadToR2(key, buf);
      console.log(`  [✓ R2] ${slug}: ${R2_PUBLIC_URL}/${key}`);
    } catch (e) {
      console.error(`  [✗] ${slug}: ${e.message}`);
    }
    await sleep(500);
  }
  console.log("Done.");
}

main().catch(console.error);

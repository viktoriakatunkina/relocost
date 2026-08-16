// Загружает обложки статей блога из Supabase Storage в Cloudflare R2.
// Фото хранятся в Storage как photos/u/xxx.jpg → в R2 кладём по тому же пути u/xxx.jpg.
// Idempotent: пропускает уже загруженные файлы.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const HOME = os.homedir();
const DOTFILE = (n) => fs.readFileSync(path.join(HOME, ".relocost", n), "utf8").trim();

const R2_ACCOUNT_ID = DOTFILE("r2_account_id");
const R2_ACCESS_KEY = DOTFILE("r2_access_key_id");
const R2_SECRET_KEY = DOTFILE("r2_secret_key");
const R2_BUCKET     = DOTFILE("r2_bucket");
const R2_PUBLIC_URL = DOTFILE("r2_public_url");
const SB_URL        = DOTFILE("supabase_url");
const SB_KEY        = DOTFILE("supabase_service_role_key");

const R2_ENDPOINT   = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const SB_PREFIX     = "/object/public/photos/";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const hmac  = (key, msg, enc) => {
  const k = typeof key === "string" ? Buffer.from(key, "utf8") : key;
  return crypto.createHmac("sha256", k).update(msg, "utf8").digest(enc || "");
};

async function r2Request(method, key, buffer = null) {
  const now  = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const ts   = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
  const bodyHash = buffer
    ? crypto.createHash("sha256").update(buffer).digest("hex")
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const hdrs = {
    host: `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    "x-amz-date": ts,
    "x-amz-content-sha256": bodyHash,
    ...(buffer ? { "content-type": "image/jpeg" } : {}),
  };
  const sk  = Object.keys(hdrs).sort();
  const ch  = sk.map(k => `${k}:${hdrs[k]}\n`).join("");
  const sh  = sk.join(";");
  const cr  = [method, `/${R2_BUCKET}/${key}`, "", ch, sh, bodyHash].join("\n");
  const sc  = `${date}/auto/s3/aws4_request`;
  const sts = ["AWS4-HMAC-SHA256", ts, sc,
    crypto.createHash("sha256").update(cr).digest("hex")].join("\n");
  const sk2 = hmac(hmac(hmac(hmac(`AWS4${R2_SECRET_KEY}`, date), "auto"), "s3"), "aws4_request");
  const sig = crypto.createHmac("sha256", sk2).update(sts).digest("hex");
  const auth = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${sc},SignedHeaders=${sh},Signature=${sig}`;
  const url  = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const opts = { method, headers: { ...hdrs, Authorization: auth } };
  if (buffer) { opts.body = buffer; opts.duplex = "half"; }
  const res = await fetch(url, opts);
  if (method === "HEAD") return res.ok;
  if (!res.ok) throw new Error(`R2 ${method} ${res.status}: ${await res.text()}`);
  return res;
}

async function existsInR2(key)          { return r2Request("HEAD", key); }
async function uploadToR2(key, buffer)  { return r2Request("PUT",  key, buffer); }

async function getAllCoverUrls() {
  const res = await fetch(
    `${SB_URL}/rest/v1/blog_posts?select=cover_url&published=eq.true&cover_url=not.is.null`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
  );
  const data = await res.json();
  const set = new Set();
  for (const row of data) {
    if (row.cover_url) set.add(row.cover_url);
  }
  return Array.from(set);
}

async function main() {
  console.log("\n🚀 Миграция обложек блога → Cloudflare R2");
  const urls = await getAllCoverUrls();
  console.log(`   Уникальных обложек в БД: ${urls.length}\n`);

  let ok = 0, skip = 0, fail = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const idx = url.indexOf(SB_PREFIX);
    if (idx === -1) {
      console.log(`  [skip] Не Supabase Storage: ${url.slice(0, 60)}`);
      skip++;
      continue;
    }
    const filePath = url.slice(idx + SB_PREFIX.length); // e.g. "u/de5dbb2df5b47f02.jpg"
    if (await existsInR2(filePath)) {
      process.stdout.write(".");
      skip++;
      continue;
    }
    try {
      const dlRes = await fetch(url);
      if (!dlRes.ok) throw new Error(`Download ${dlRes.status}`);
      const buf = Buffer.from(await dlRes.arrayBuffer());
      await uploadToR2(filePath, buf);
      process.stdout.write("+");
      ok++;
    } catch (e) {
      console.log(`\n  [✗] ${filePath}: ${e.message}`);
      fail++;
    }
    if (i < urls.length - 1) await sleep(80);
  }

  console.log(`\n\n✅ Готово: загружено ${ok}, пропущено ${skip}, ошибок ${fail}`);
}

main().catch(console.error);

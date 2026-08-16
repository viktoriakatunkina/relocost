// Загружает обложки блога с прямыми Unsplash URL в R2 и обновляет cover_url в БД.
// images.unsplash.com недоступен с российского VPS → все Unsplash-обложки нужно
// перенести в R2, чтобы Next.js Image мог их оптимизировать с VPS.
//
// Логика:
//  1. Берём все blog_posts с cover_url начинающимся на images.unsplash.com
//  2. Извлекаем Unsplash photo-id из URL
//  3. Скачиваем фото (с Mac, где Unsplash доступен)
//  4. Загружаем в R2 как blog/{photo-id}.jpg
//  5. Обновляем cover_url в БД на R2-URL
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const HOME   = os.homedir();
const dot    = (n) => fs.readFileSync(path.join(HOME, ".relocost", n), "utf8").trim();

const R2_ACCOUNT_ID = dot("r2_account_id");
const R2_ACCESS_KEY = dot("r2_access_key_id");
const R2_SECRET_KEY = dot("r2_secret_key");
const R2_BUCKET     = dot("r2_bucket");
const R2_PUBLIC_URL = dot("r2_public_url");
const SB_URL        = dot("supabase_url");
const SB_KEY        = dot("supabase_service_role_key");

const R2_ENDPOINT   = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const sleep         = (ms) => new Promise(r => setTimeout(r, ms));
const hmac          = (key, msg, enc) => {
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

async function existsInR2(key)         { return r2Request("HEAD", key); }
async function uploadToR2(key, buffer) { return r2Request("PUT",  key, buffer); }

// Извлекаем ID фото из Unsplash URL: photo-1234567890-xxx → 1234567890-xxx
function photoIdFromUrl(url) {
  const m = url.match(/photo-([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

async function getAllUnsplashCovers() {
  const res = await fetch(
    `${SB_URL}/rest/v1/blog_posts?select=id,slug,cover_url&published=eq.true&cover_url=like.https://images.unsplash.com/*`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
  );
  return await res.json();
}

async function updateCoverUrl(id, newUrl) {
  const res = await fetch(
    `${SB_URL}/rest/v1/blog_posts?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ cover_url: newUrl }),
    }
  );
  if (!res.ok) throw new Error(`DB update failed: ${res.status}`);
}

async function main() {
  console.log("\n🚀 Миграция Unsplash-обложек блога → Cloudflare R2");
  const posts = await getAllUnsplashCovers();
  console.log(`   Статей с Unsplash-обложкой: ${posts.length}\n`);

  // Группируем по photo ID (один файл может использоваться в нескольких статьях)
  const byId = new Map(); // photoId → { posts: [], url }
  for (const p of posts) {
    const id = photoIdFromUrl(p.cover_url);
    if (!id) { console.log(`  [skip] Не могу извлечь ID: ${p.cover_url}`); continue; }
    if (!byId.has(id)) byId.set(id, { posts: [], url: p.cover_url, newR2: null });
    byId.get(id).posts.push(p);
  }
  console.log(`   Уникальных фото: ${byId.size}\n`);

  let ok = 0, skip = 0, fail = 0;

  for (const [photoId, info] of byId) {
    const key     = `blog/${photoId}.jpg`;
    const r2Url   = `${R2_PUBLIC_URL}/${key}`;

    if (await existsInR2(key)) {
      process.stdout.write(".");
      skip++;
      // Всё равно обновим DB если ещё не обновлена
      for (const p of info.posts) {
        if (p.cover_url !== r2Url) {
          try { await updateCoverUrl(p.id, r2Url); } catch {}
        }
      }
      continue;
    }

    try {
      // Скачиваем в хорошем качестве (1600px)
      const dlUrl = `${info.url}?auto=format&fit=crop&w=1600&q=85&fm=jpg`;
      const dlRes = await fetch(dlUrl, { redirect: "follow" });
      if (!dlRes.ok) throw new Error(`Download ${dlRes.status}`);
      const buf   = Buffer.from(await dlRes.arrayBuffer());
      await uploadToR2(key, buf);
      // Обновляем cover_url для всех статей с этим фото
      for (const p of info.posts) {
        await updateCoverUrl(p.id, r2Url);
      }
      process.stdout.write("+");
      ok++;
    } catch (e) {
      console.log(`\n  [✗] ${photoId}: ${e.message}`);
      fail++;
    }
    await sleep(100);
  }

  console.log(`\n\n✅ Готово: загружено ${ok}, пропущено ${skip}, ошибок ${fail}`);
  if (ok + skip > 0) {
    console.log(`\nℹ️  cover_url в БД обновлены на R2-URLs.`);
    console.log(`   Обложки теперь доступны без rebuild — VPS подхватит при следующем ISR.`);
  }
}

main().catch(console.error);

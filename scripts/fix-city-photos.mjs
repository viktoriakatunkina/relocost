import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const r = (f) => fs.readFileSync(path.join(os.homedir(), ".relocost", f), "utf8").trim();
const sb = createClient(r("supabase_url"), r("supabase_service_role_key"), {
  auth: { persistSession: false },
});

const BUCKET = "photos";
const norm = (u) => (u ? u.split("?")[0] : u);
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);

async function migrateUnsplashUrl(slug, rawUrl) {
  const base = norm(rawUrl);
  const objectPath = `u/${hash(base)}.jpg`;
  const dl = `${base}?w=1600&q=80&fm=jpg&fit=max&auto=format`;

  console.log(`Downloading ${slug}: ${dl.slice(0, 80)}...`);
  const res = await fetch(dl, { signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`  Downloaded ${buf.length} bytes`);

  const { error: uploadErr } = await sb.storage.from(BUCKET).upload(objectPath, buf, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: true,
  });
  if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

  const storageUrl = sb.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
  console.log(`  Uploaded to: ${storageUrl}`);

  const { error: updateErr } = await sb.from("cities")
    .update({ unsplash_url: storageUrl })
    .eq("slug", slug);
  if (updateErr) throw new Error(`Update failed: ${updateErr.message}`);
  console.log(`  ✓ Updated ${slug}.unsplash_url`);
  return storageUrl;
}

const { data: cities } = await sb.from("cities")
  .select("slug, name_ru, unsplash_url")
  .in("slug", ["chiangmai", "medellin"]);

console.log("Cities to fix:", JSON.stringify(cities, null, 2));

for (const city of cities) {
  if (city.unsplash_url && city.unsplash_url.includes("images.unsplash.com")) {
    await migrateUnsplashUrl(city.slug, city.unsplash_url);
  } else {
    console.log(`${city.slug}: already OK (${city.unsplash_url?.slice(0, 60)})`);
  }
}

// verify
const { data: after } = await sb.from("cities")
  .select("slug, unsplash_url")
  .in("slug", ["chiangmai", "medellin"]);
console.log("\nResult:", JSON.stringify(after, null, 2));

import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET || "relocost-photos";
const R2_PUBLIC_URL = "https://pub-7477decb939643d4a260e579876bef17.r2.dev";

const supabase = createClient(supabaseUrl, supabaseKey);
const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
});

const RETRY_SLUGS = ["ohrid", "sarajevo", "belgrade", "bucharest", "budapest", "lisbon", "milan", "munich"];

async function existsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function downloadUnsplash(query) {
  // Use unsplash source redirect (no API key needed, uses redirect)
  const url = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(query)}`;
  const tmpFile = path.join(os.tmpdir(), `photo_${Date.now()}.jpg`);
  try {
    execSync(`/usr/bin/curl -L -s -m 20 --retry 2 -o "${tmpFile}" "${url}"`, { stdio: "pipe" });
    if (!fs.existsSync(tmpFile)) return null;
    const stat = fs.statSync(tmpFile);
    if (stat.size < 10000) { fs.unlinkSync(tmpFile); return null; }
    return tmpFile;
  } catch {
    return null;
  }
}

async function run() {
  const { data: cities } = await supabase.from("cities").select("slug, name_ru, country_ru, unsplash_url").in("slug", RETRY_SLUGS);
  if (!cities?.length) { console.log("No cities found"); return; }

  for (const city of cities) {
    const key = `city/${city.slug}.jpg`;
    if (await existsInR2(key)) {
      console.log(`  [EXISTS] ${city.slug}`);
      continue;
    }

    // Try with unsplash source
    const query = `${city.name_ru} city`;
    console.log(`  Downloading ${city.slug}: ${query}...`);
    const tmpFile = await downloadUnsplash(query);
    
    if (!tmpFile) {
      // Try fetching the stored unsplash_url directly
      if (city.unsplash_url) {
        const tmpFile2 = path.join(os.tmpdir(), `photo2_${Date.now()}.jpg`);
        try {
          execSync(`/usr/bin/curl -L -s -m 20 --retry 2 -o "${tmpFile2}" "${city.unsplash_url}"`, { stdio: "pipe" });
          if (fs.existsSync(tmpFile2) && fs.statSync(tmpFile2).size > 10000) {
            const body = fs.readFileSync(tmpFile2);
            await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: "image/jpeg" }));
            fs.unlinkSync(tmpFile2);
            console.log(`  [✓ R2] ${city.slug}: ${R2_PUBLIC_URL}/${key} (from unsplash_url)`);
            continue;
          }
          if (fs.existsSync(tmpFile2)) fs.unlinkSync(tmpFile2);
        } catch {}
      }
      console.log(`  [✗] ${city.slug}: no photo available`);
      continue;
    }

    const body = fs.readFileSync(tmpFile);
    await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: "image/jpeg" }));
    fs.unlinkSync(tmpFile);
    console.log(`  [✓ R2] ${city.slug}: ${R2_PUBLIC_URL}/${key}`);
  }
  console.log("Done.");
}

run().catch(console.error);

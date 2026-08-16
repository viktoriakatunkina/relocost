import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import { createHash } from "node:crypto";

const H = os.homedir();
const SUPA_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

// Уже загруженные обложки из первого прогона
const covers = {
  "pereezd-v-chernogoriyu-2026": `${SUPA_URL}/storage/v1/object/public/photos/u/15659e89dbb6.jpg`,
  "pereezd-v-armeniyu-2026": `${SUPA_URL}/storage/v1/object/public/photos/u/a8e6b99c53fd.jpg`,
  "byudzhet-pereezda-50000-rubley": `${SUPA_URL}/storage/v1/object/public/photos/u/23defc8749fe.jpg`,
  "top-10-stran-dlya-relokatsii-2026": `${SUPA_URL}/storage/v1/object/public/photos/u/febe702bd241.jpg`,
  "nalogi-dlya-nalogovogo-rezidenta-za-rubezhom": `${SUPA_URL}/storage/v1/object/public/photos/u/3daac58925bd.jpg`,
  "pereezd-v-kazahstan-almaty-2026": `${SUPA_URL}/storage/v1/object/public/photos/u/d84fb4e3baf9.jpg`,
  "istanbul-stoimost-zhizni-2026": `${SUPA_URL}/storage/v1/object/public/photos/u/7b70b88fda6e.jpg`,
  "kak-otkryt-ip-v-gruzii-rossiyane": `${SUPA_URL}/storage/v1/object/public/photos/u/3efe85319da2.jpg`,
  "oformit-meditsinskuyu-strakhovku-za-rubezhom": `${SUPA_URL}/storage/v1/object/public/photos/u/a397f1a7ae87.jpg`,
};

async function run() {
  // Обновляем уже загруженные обложки
  for (const [slug, url] of Object.entries(covers)) {
    const { error } = await sb.from("blog_posts").update({ cover_url: url }).eq("slug", slug);
    console.log(`${slug}: ${error ? "ERROR " + error.message : "OK"}`);
  }

  // Для Тбилиси — ищем и загружаем
  const tbilisiSlug = "arenda-kvartiry-tbilisi-2026-lajfhaki";
  const searchRes = await fetch(
    "https://api.unsplash.com/search/photos?query=tbilisi+georgia+old+city+buildings&per_page=5&orientation=landscape",
    { headers: { Authorization: `Client-ID ${UNSPLASH}` } }
  );
  const j = await searchRes.json();
  const photo = j.results?.[0];

  if (photo) {
    const imgRes = await fetch(photo.urls.raw + "&w=1200&q=80&fm=jpg");
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const hash = createHash("md5").update(tbilisiSlug).digest("hex").slice(0, 12);
    const storagePath = `u/${hash}.jpg`;

    const { error: upErr } = await sb.storage.from("photos").upload(storagePath, buf, {
      contentType: "image/jpeg",
      upsert: true,
    });

    if (!upErr) {
      const url = `${SUPA_URL}/storage/v1/object/public/photos/${storagePath}`;
      const { error } = await sb.from("blog_posts").update({ cover_url: url }).eq("slug", tbilisiSlug);
      console.log(`${tbilisiSlug}: ${error ? "ERROR " + error.message : "OK cover=" + url}`);
    } else {
      console.log(`${tbilisiSlug} storage error: ${upErr.message}`);
    }
  } else {
    console.log(`${tbilisiSlug}: no photo found`);
  }

  console.log("\nDone.");
}

run().catch((e) => { console.error(e); process.exit(1); });

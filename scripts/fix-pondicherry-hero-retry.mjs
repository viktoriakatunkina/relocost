import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";

const H = os.homedir();
const dot = (n) => fs.readFileSync(path.join(H, ".relocost", n), "utf8").trim();
const SUPA_URL = dot("supabase_url");
const sb = createClient(SUPA_URL, dot("supabase_service_role_key"), { auth: { persistSession: false } });
const UNSPLASH = dot("unsplash_access_key");

const slug = "pondicherry";
const query = "Pondicherry India promenade";

async function run() {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) { console.log("нет результата"); return; }
  const photo = { rawUrl: p.urls.raw, authorName: p.user.name, authorUrl: p.user.links.html, id: p.id };

  const imgRes = await fetch(photo.rawUrl + "&w=1600&q=80&fm=jpg");
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const hash = createHash("md5").update(`hero::${slug}`).digest("hex").slice(0, 16);
  const storagePath = `u/${hash}.jpg`;
  const { error: upErr } = await sb.storage.from("photos").upload(storagePath, buf, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (upErr) throw upErr;
  const url = `${SUPA_URL}/storage/v1/object/public/photos/${storagePath}`;

  const { error } = await sb
    .from("cities")
    .update({
      unsplash_photo_id: photo.id,
      unsplash_url: url,
      unsplash_author_name: photo.authorName,
      unsplash_author_url: photo.authorUrl,
    })
    .eq("slug", slug);
  if (error) throw error;
  console.log(`✓ ${slug} -> "${query}" (${photo.authorName}) -> ${url}`);
}

run();

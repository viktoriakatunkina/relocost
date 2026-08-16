/**
 * seed-articles-batch3.mjs
 * Upserts 8 blog articles (batch 3) into Supabase blog_posts table.
 * Also fetches Unsplash cover photos and uploads to Supabase Storage.
 * Run: node scripts/seed-articles-batch3.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import https from "node:https";
import crypto from "node:crypto";

// ── Credentials ──────────────────────────────────────────────────────────────
const SUPABASE_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const SUPABASE_KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH_KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

const BLOG_DIR = path.join(os.homedir(), "Desktop/Работа/Клод/relocost/content/blog");

// ── Article definitions ──────────────────────────────────────────────────────
const ARTICLES = [
  {
    slug: "stoimost-zhizni-v-tbilisi-2026-rayony",
    unsplash_query: "tbilisi georgia old town",
  },
  {
    slug: "pereezd-v-gruziyu-2026-cheklista",
    unsplash_query: "georgia caucasus mountain landscape",
  },
  {
    slug: "pereezd-vo-vetnam-hanoy-vs-hochimin-2026",
    unsplash_query: "vietnam hanoi street food",
  },
  {
    slug: "kipr-ili-malta-dlya-rossiyan-2026",
    unsplash_query: "mediterranean sea island",
  },
  {
    slug: "arenda-kvartiry-v-Belgrade-2026",
    unsplash_query: "belgrade serbia architecture",
  },
  {
    slug: "it-spetsialist-v-erevane-2026",
    unsplash_query: "yerevan armenia city",
  },
  {
    slug: "pensionery-v-chernogorii-2026",
    unsplash_query: "budva montenegro adriatic coast",
  },
  {
    slug: "kak-vernutsya-v-rossiyu-posle-pereezda-2026",
    unsplash_query: "moscow russia city",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  const body = match[2].trim();
  return { fm, body };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}`, "Accept-Version": "v1" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
  });
}

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    function doGet(u) {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doGet(res.headers.location);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }).on("error", reject);
    }
    doGet(url);
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let seededCount = 0;
  let coverCount = 0;

  for (const art of ARTICLES) {
    const filePath = path.join(BLOG_DIR, `${art.slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  [SKIP] File not found: ${filePath}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    let fm, body;
    try {
      ({ fm, body } = parseFrontmatter(raw));
    } catch (e) {
      console.error(`  [ERROR] Frontmatter parse failed for ${art.slug}:`, e.message);
      continue;
    }

    // Map frontmatter city → country_slug heuristic (city_id stays null; country_slug optional)
    const cityToCountry = {
      tbilisi: "georgia",
      yerevan: "armenia",
      belgrade: "serbia",
      budva: "montenegro",
    };
    const cityVal = (fm.city || "").trim();
    const countrySlug = cityToCountry[cityVal] ?? null;

    const record = {
      slug: fm.slug || art.slug,
      title: fm.title || "",
      seo_title: fm.title || "",
      seo_description: fm.description || "",
      tag: fm.tag || "",
      country_slug: countrySlug,
      city_id: null,
      content_md: body,
      published: true,
      read_time: parseInt(fm.reading_time || "10", 10),
    };

    console.log(`\n[UPSERT] ${record.slug}`);
    const { error: upsertErr } = await sb
      .from("blog_posts")
      .upsert(record, { onConflict: "slug" });

    if (upsertErr) {
      console.error(`  [ERROR] Upsert failed:`, upsertErr.message);
      continue;
    }
    seededCount++;
    console.log(`  ✓ Upserted to blog_posts`);

    // ── Cover photo ──────────────────────────────────────────────────────────
    await sleep(1500);

    try {
      console.log(`  [UNSPLASH] Query: "${art.unsplash_query}"`);
      const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(art.unsplash_query)}&per_page=1&orientation=landscape`;
      const searchResult = await fetchJson(searchUrl);

      if (!searchResult.results || searchResult.results.length === 0) {
        console.warn(`  [WARN] No Unsplash results for "${art.unsplash_query}"`);
        continue;
      }

      const photo = searchResult.results[0];
      const downloadApiUrl = photo.links.download_location;

      // Trigger download event (Unsplash guidelines)
      const dlData = await fetchJson(downloadApiUrl);
      const imageUrl = dlData.url || photo.urls.full;

      console.log(`  [DOWNLOAD] ${imageUrl.slice(0, 80)}...`);
      const imgBuffer = await downloadUrl(imageUrl);

      // Generate storage path
      const hash = crypto.createHash("sha1").update(art.slug).digest("hex").slice(0, 16);
      const storagePath = `u/${hash}.jpg`;

      console.log(`  [STORAGE] Uploading to photos/${storagePath}`);
      const { error: uploadErr } = await sb.storage
        .from("photos")
        .upload(storagePath, imgBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadErr) {
        console.error(`  [ERROR] Storage upload failed:`, uploadErr.message);
        continue;
      }

      const { data: publicUrlData } = sb.storage.from("photos").getPublicUrl(storagePath);
      const coverUrl = publicUrlData.publicUrl;

      // Update cover_url in blog_posts
      const { error: updateErr } = await sb
        .from("blog_posts")
        .update({ cover_url: coverUrl })
        .eq("slug", record.slug);

      if (updateErr) {
        console.error(`  [ERROR] cover_url update failed:`, updateErr.message);
        continue;
      }

      // Update cover_url in local .md file
      const updatedRaw = raw.replace(/^cover_url:.*$/m, `cover_url: ${coverUrl}`);
      fs.writeFileSync(filePath, updatedRaw, "utf8");

      coverCount++;
      console.log(`  ✓ Cover set: ${coverUrl}`);
    } catch (e) {
      console.error(`  [ERROR] Cover fetch/upload failed:`, e.message);
    }

    await sleep(1500);
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`DONE: ${seededCount}/${ARTICLES.length} articles seeded`);
  console.log(`      ${coverCount}/${ARTICLES.length} covers uploaded`);
  console.log("═══════════════════════════════════════");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});

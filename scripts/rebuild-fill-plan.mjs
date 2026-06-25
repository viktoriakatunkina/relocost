// Пересобирает scripts/.photo-fill-plan.json детерминированно из БД:
// для каждого base-URL Unsplash вычисляет storage-URL по hash (файлы уже залиты).
// Не качает ничего. Использовать после migrate-photos-to-storage.mjs.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs"; import os from "node:os"; import path from "node:path"; import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SUPA_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"),"utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"),"utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth:{persistSession:false} });
const norm = (u)=> u ? u.split("?")[0] : u;
const hash = (s)=> crypto.createHash("sha1").update(s).digest("hex").slice(0,16);
const surl = (base)=> sb.storage.from("photos").getPublicUrl(`u/${hash(base)}.jpg`).data.publicUrl;
const HOME_HERO = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e";

const { data: cities } = await sb.from("cities").select("id, slug, unsplash_url");
const { data: posts } = await sb.from("blog_posts").select("id, slug, cover_url");

const cityUpdates = cities.map(c=>({ id:c.id, slug:c.slug, image_url: c.unsplash_url ? surl(norm(c.unsplash_url)) : null }));
const postUpdates = posts.map(p=>({ id:p.id, slug:p.slug, cover_image_url: p.cover_url ? surl(norm(p.cover_url)) : null }));
const homeHeroUrl = surl(HOME_HERO);

fs.writeFileSync(path.join(ROOT,"scripts",".photo-fill-plan.json"), JSON.stringify({ cityUpdates, postUpdates, homeHeroUrl }, null, 2));
console.log(`plan: cities ${cityUpdates.length}, posts ${postUpdates.length}, nulls(city)=${cityUpdates.filter(c=>!c.image_url).length}, nulls(post)=${postUpdates.filter(p=>!p.cover_image_url).length}`);
console.log("HOME HERO:", homeHeroUrl);

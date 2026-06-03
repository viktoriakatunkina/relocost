// Одноразовый скрипт: заменяет «ё»/«Ё» → «е»/«Е» в текстовых
// колонках Supabase (cities, prices, blog_posts).
// Запуск: node scripts/yo-to-e.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

const fix = (s) => (typeof s === "string" ? s.replace(/ё/g, "е").replace(/Ё/g, "Е") : s);
const has = (s) => typeof s === "string" && /[ёЁ]/.test(s);

async function sweep(table, fields, idField = "id") {
  const { data, error } = await sb.from(table).select(`${idField},${fields.join(",")}`);
  if (error) throw new Error(`${table}: ${error.message}`);
  let touched = 0, replacements = 0;
  for (const row of data) {
    const patch = {};
    for (const f of fields) {
      if (has(row[f])) {
        const next = fix(row[f]);
        replacements += (row[f].match(/[ёЁ]/g) || []).length;
        patch[f] = next;
      }
    }
    if (Object.keys(patch).length === 0) continue;
    const { error: upErr } = await sb.from(table).update(patch).eq(idField, row[idField]);
    if (upErr) throw new Error(`${table}#${row[idField]}: ${upErr.message}`);
    touched++;
  }
  console.log(`${table}: ${touched} rows updated, ${replacements} replacements`);
}

await sweep("cities", [
  "name_ru", "country_ru", "population", "climate", "language",
  "currency", "flight_from_moscow", "seo_title", "seo_description", "intro_text",
]);
await sweep("prices", ["item_name_ru"]);
await sweep("blog_posts", ["title", "content_md", "seo_title", "seo_description"]);

console.log("done.");

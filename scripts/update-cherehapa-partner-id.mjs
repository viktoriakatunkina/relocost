/**
 * Обновляет все статьи блога: заменяет Cherehapa-ссылки без partner ID
 * на ссылки с реальным partner=13006
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim(),
  fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim(),
  { auth: { persistSession: false } }
);

const PARTNER_ID = "13006";

// Старые варианты ссылок (без partner ID)
const OLD_URL = "https://cherehapa.ru/?utm_source=relocost&utm_medium=referral";
// Новая ссылка с partner ID
const NEW_URL = `https://cherehapa.ru/?partner=${PARTNER_ID}&utm_source=relocost&utm_medium=referral`;

// Получаем все статьи с Cherehapa-ссылками
let allPosts = [];
let from = 0;
while (true) {
  const { data, error } = await sb.from("blog_posts")
    .select("id, slug, content_md")
    .eq("published", true)
    .range(from, from + 199);
  if (error) throw new Error(error.message);
  if (!data.length) break;
  allPosts.push(...data);
  if (data.length < 200) break;
  from += 200;
}

console.log(`Всего статей: ${allPosts.length}`);

const toUpdate = allPosts.filter(p =>
  p.content_md && p.content_md.includes("cherehapa.ru") && !p.content_md.includes(`partner=${PARTNER_ID}`)
);

console.log(`Статей с Cherehapa без partner ID: ${toUpdate.length}`);

let updated = 0;
for (const post of toUpdate) {
  const newContent = post.content_md.replaceAll(OLD_URL, NEW_URL);

  const { error } = await sb.from("blog_posts")
    .update({ content_md: newContent })
    .eq("id", post.id);

  if (error) {
    console.error(`✗ ${post.slug}: ${error.message}`);
    continue;
  }
  updated++;
  console.log(`✓ ${post.slug}`);
}

console.log(`\nГотово: обновлено ${updated} статей`);
console.log(`Cherehapa-ссылка теперь: ${NEW_URL}`);

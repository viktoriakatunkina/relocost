/**
 * Добавляет Unsplash-обложки к статьям батча 25 (засеяны без фото)
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';

const H = os.homedir();
const SUPA_URL = fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim();
const SUPA_KEY = fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim();
const UNSPLASH = fs.readFileSync(H+'/.relocost/unsplash_access_key','utf8').trim();
const sb = createClient(SUPA_URL, SUPA_KEY, {auth:{persistSession:false}});
const sleep = ms => new Promise(r=>setTimeout(r,ms));

async function getPhoto(q) {
  await sleep(700);
  const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`,
    {headers:{'Authorization':'Client-ID '+UNSPLASH}});
  const j = await r.json();
  if (j.errors) { console.log('[LIMIT]', j.errors); return null; }
  return j.results?.[0]?.urls?.regular ?? null;
}

const ITEMS = [
  { slug: 'pereezd-na-kipr-dlya-rossiyan-2026',             q: 'cyprus island mediterranean coast sea' },
  { slug: 'pereezd-v-bolgariyu-dlya-rossiyan-2026',          q: 'sofia bulgaria church old town' },
  { slug: 'dvoynoye-grazhdanstvo-dlya-rossiyan-2026',        q: 'passport travel documents citizenship' },
  { slug: 'kak-zarabotat-v-internete-za-rubezhom-2026',      q: 'laptop remote work freelance coffee' },
  { slug: 'meditsina-v-serbii-dlya-rossiyan-2026',           q: 'hospital clinic medical healthcare modern' },
  { slug: 'pereezd-v-indiyu-goa-dlya-rossiyan-2026',         q: 'goa india beach palm tropical' },
  { slug: 'kak-nayti-partnera-za-rubezhom-dlya-biznesa-2026', q: 'business handshake partners meeting' },
  { slug: 'izuchit-inostrannyy-yazyk-pereezd-2026',          q: 'language learning books study abroad' },
  { slug: 'pereezd-v-kambodzhu-2026',                        q: 'cambodia angkor wat temple asia' },
  { slug: 'kak-sokhranit-svyaz-s-rossiyey-pri-pereezde-2026', q: 'video call family connection phone' },
  // Бонус: Мексика (батч 23) — тоже без фото
  { slug: 'pereezd-v-meksiku-dlya-rossiyan-2026',            q: 'mexico city cathedral colorful street' },
];

let ok = 0, skipped = 0, failed = 0;

for (const { slug, q } of ITEMS) {
  // Проверяем, есть ли уже фото
  const { data } = await sb.from('blog_posts').select('cover_url').eq('slug', slug).maybeSingle();
  if (data?.cover_url) {
    console.log('[SKIP уже есть]', slug);
    skipped++;
    continue;
  }

  const url = await getPhoto(q);
  if (!url) { console.log('[NO PHOTO]', slug); failed++; continue; }

  const { error } = await sb.from('blog_posts').update({ cover_url: url }).eq('slug', slug);
  if (error) { console.error('[ERR]', slug, error.message); failed++; }
  else { console.log('[OK]', slug, url.slice(0,60)+'...'); ok++; }
}

console.log(`\nФото батч 25+: ${ok} добавлено, ${skipped} уже было, ${failed} не удалось`);

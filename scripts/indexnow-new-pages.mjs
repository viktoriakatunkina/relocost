#!/usr/bin/env node
// Уведомляет IndexNow о новых подстраницах /city/*/budget и /city/*/prices,
// которые добавлены в sitemap.ts в июле 2026 и ранее не индексировались.
// Запускать один раз после деплоя: node scripts/indexnow-new-pages.mjs

const HOST = "relocost.ru";
const KEY = "c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a";
const BATCH = 100;

// Получаем список слагов городов из живого sitemap
async function getCitySlugs() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>https:\/\/relocost\.ru\/city\/([^/<]+)<\/loc>/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

async function submitBatch(urls) {
  const res = await fetch("https://yandex.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  return res.status;
}

const slugs = await getCitySlugs();
console.log(`Найдено ${slugs.length} городов`);

// Формируем URL для /budget и /prices (только ru-версии — основной трафик)
const urls = slugs.flatMap((slug) => [
  `https://${HOST}/city/${slug}/budget`,
  `https://${HOST}/city/${slug}/prices`,
]);

console.log(`IndexNow: ${urls.length} новых URL (/budget + /prices)`);

for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const status = await submitBatch(batch);
  console.log(`  Батч ${Math.floor(i / BATCH) + 1}: ${batch.length} URL → HTTP ${status}`);
}

console.log("Готово. Яндекс получил уведомление.");

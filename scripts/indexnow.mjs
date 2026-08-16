#!/usr/bin/env node
// Уведомляет IndexNow (Яндекс, Bing) о всех страницах сайта после деплоя.
// Читает живой sitemap.xml чтобы не дублировать логику генерации URL.
import { createReadStream } from "fs";

const HOST = "relocost.ru";
const KEY = "c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const BATCH = 100;

async function getSitemapUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Sitemap ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(https:\/\/relocost\.ru[^<]*)<\/loc>/g)];
  return matches.map((m) => m[1]);
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

const urls = await getSitemapUrls();
console.log(`IndexNow: ${urls.length} URL из sitemap`);

for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const status = await submitBatch(batch);
  console.log(`  Батч ${Math.floor(i / BATCH) + 1}: ${batch.length} URL → HTTP ${status}`);
}

console.log("IndexNow готово.");

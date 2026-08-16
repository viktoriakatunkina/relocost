const KEY = 'c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a';
const HOST = 'relocost.ru';
const BASE = 'https://relocost.ru';

const NEW_SLUGS = [
  'yaponiya-tokio-pereezd-dn-2026',
  'kak-otkryt-ooo-ip-za-rubezhom-2026',
  'top-stran-dlya-sozdaniya-semi-pereezd-2026',
];

const urls = [];
for (const slug of NEW_SLUGS) {
  urls.push(`${BASE}/ru/blog/${slug}`);
  urls.push(`${BASE}/en/blog/${slug}`);
}

const body = { host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList: urls };
const r = await fetch('https://yandex.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
console.log(`IndexNow 602: ${r.status} (${urls.length} URLs)`);

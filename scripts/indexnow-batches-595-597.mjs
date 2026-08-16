const KEY = 'c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a';
const HOST = 'relocost.ru';
const BASE = 'https://relocost.ru';

const NEW_SLUGS = [
  // 595
  'italiya-neapol-pereezd-dn-2026',
  'yuznaya-koreya-busan-pereezd-dn-2026',
  'pereezd-s-ipotekoy-rossii-2026',
  // 596
  'chernogoriya-podgorica-pereezd-dn-2026',
  'khroatiya-zagreb-pereezd-dn-2026',
  // 597
  'turtsiya-izmir-pereezd-dn-2026',
  'obustroistvo-kvartiry-za-rubezhom-2026',
  'top-gorodov-dlya-yuristov-advokatov-2026',
];

const urls = [];
for (const slug of NEW_SLUGS) {
  urls.push(`${BASE}/ru/blog/${slug}`);
  urls.push(`${BASE}/en/blog/${slug}`);
}

console.log(`Всего URLs: ${urls.length}`);

async function submitBatch(batch, idx) {
  const body = { host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList: batch };
  const r = await fetch('https://yandex.com/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log(`Батч ${idx}: ${r.status} (${batch.length} URLs)`);
  return r.status;
}

let i = 0, batchIdx = 1;
while (i < urls.length) {
  const batch = urls.slice(i, i + 100);
  await submitBatch(batch, batchIdx++);
  i += 100;
}
console.log('\nIndexNow батчей 595-597 готово.');

const KEY = 'c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a';
const HOST = 'relocost.ru';
const BASE = 'https://relocost.ru';

const NEW_SLUGS = [
  // 581
  'armeniya-erevan-pereezd-2026',
  'egipet-kairo-pereezd-2026',
  // 582
  'ispaniya-malaga-pereezd-dn-2026',
  'strakhovka-dlya-ekspata-polnoye-rukovodstvo-2026',
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
console.log('\nIndexNow батчей 581-582 готово.');

const KEY = 'c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a';
const HOST = 'relocost.ru';
const BASE = 'https://relocost.ru';

const NEW_SLUGS = [
  // 577
  'ispaniya-alicante-pereezd-2026',
  'kak-pereekhat-s-semey-rukovodstvo-2026',
  // 578
  'shvetsiya-gyoteborg-pereezd-2026',
  'kosta-rika-san-khoze-pereezd-dn-2026',
  'kak-perevezti-imushchestvo-za-rubezh-2026',
  // 579
  'indiya-goa-pereezd-dn-2026',
  'top-gorodov-s-dostupnoy-arenda-dlya-ekspata-2026',
  // 580
  'kazahstan-almaty-pereezd-2026',
  'indiya-bangalor-pereezd-2026',
  'kak-vychit-yazyk-v-emigratsii-praktika-2026',
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
console.log('\nIndexNow батчей 577-580 готово.');

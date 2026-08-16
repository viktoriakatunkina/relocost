// IndexNow для новых статей батчей 573-576
const KEY = 'c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a';
const HOST = 'relocost.ru';
const BASE = 'https://relocost.ru';

const NEW_SLUGS = [
  // 573
  'latviya-riga-pereezd-2026',
  'finlyandiya-tampere-pereezd-2026',
  // 574
  'germaniya-gamburg-pereezd-2026',
  'plyazhnye-goroda-dlya-pereezda-top-2026',
  'kak-poluchit-grazhdanstvo-eu-vse-sposoby-2026',
  // 575
  'kolombia-medellin-pereezd-dn-2026',
  'peru-lima-pereezd-2026',
  'tayland-chiangmai-pereezd-dn-2026',
  // 576
  'turtsiya-istanbul-pereezd-dn-2026',
  'gruziya-batumi-pereezd-dn-2026',
  'kakaya-strana-podkhodit-freelanceru-2026',
];

const urls = [];
for (const slug of NEW_SLUGS) {
  urls.push(`${BASE}/ru/blog/${slug}`);
  urls.push(`${BASE}/en/blog/${slug}`);
}

console.log(`Всего URLs: ${urls.length}`);

async function submitBatch(batch, idx) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: batch,
  };
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

console.log('\nIndexNow батчей 573-576 готово.');

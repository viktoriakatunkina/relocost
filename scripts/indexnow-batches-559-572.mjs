// IndexNow для новых статей батчей 559-572
const KEY = 'c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a';
const HOST = 'relocost.ru';
const BASE = 'https://relocost.ru';

const NEW_SLUGS = [
  'irlandiya-dublin-pereezd-2026',
  'gretsiya-afiny-pereezd-2026',
  'skolko-stoit-pereekhat-za-rubezh-polnyy-byudzhet-2026',
  'kanada-toronto-pereezd-2026',
  'maldivy-pereezd-dn-2026',
  'nalogi-ekspata-iz-rossii-kak-platit-2026',
  'tayvan-taybey-pereezd-2026',
  'vengriya-budapesht-pereezd-2026',
  'kak-nayti-rabotu-za-rubezhom-prakticheskoe-rukovodstvo-2026',
  'chekhiya-praga-pereezd-2026',
  'pereezd-s-pitomtsem-kak-vyvezti-koshku-sobaku-2026',
  'novaya-zelandiya-velington-pereezd-2026',
  'malaziya-kuala-lumpur-pereezd-2026',
  'avstriya-vena-pereezd-2026',
  'rumyniya-bukharest-pereezd-2026',
  'top-stran-dlya-it-spetsialistov-2026',
  'shveytssariya-tsyurikch-pereezd-2026',
  'yuznaya-koreya-seul-pereezd-dn-2026',
  'pereezd-na-pensiyu-luchshie-strany-pensionery-2026',
  'polsha-varshava-pereezd-2026',
  'stomatologicheskiy-turizm-gde-deshevle-lechit-zuby-2026',
  'estoniya-tallin-pereezd-dn-2026',
  'indoneziya-bali-pereezd-dn-2026',
  'chili-santyago-pereezd-2026',
  'bolgariya-sofiya-pereezd-2026',
  'singapur-pereezd-2026',
  'pereezd-v-dubai-poshagovyy-gid-2026',
  'argentina-buenos-ayres-pereezd-2026',
  'marokko-marrakesh-pereezd-2026',
  'kak-perevesti-pensiyu-za-rubezh-2026',
  'vietnam-khoshimin-pereezd-dn-2026',
  'meksika-oakhaka-pereezd-dn-2026',
  'kak-vybrat-stranu-dlya-pereezda-10-voprosov-2026',
  'norvegiya-bergen-pereezd-2026',
  'kipr-limasol-pereezd-2026',
  'zhizn-za-rubezhom-kak-ne-skuchat-po-rodine-2026',
  'daniya-kopengagen-pereezd-2026',
  'top-gorodov-schastye-kachestvo-zhizni-2026',
  'kak-otkryt-kompaniyu-za-rubezhom-iz-rossii-2026',
];

// Генерируем URLs для обеих локалей
const urls = [];
for (const slug of NEW_SLUGS) {
  urls.push(`${BASE}/ru/blog/${slug}`);
  urls.push(`${BASE}/en/blog/${slug}`);
}

console.log(`Всего URLs: ${urls.length}`);

// Отправляем батчами по 100
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

console.log('\nIndexNow батчей 559-572 готово.');

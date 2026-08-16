import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';
const H = os.homedir();
const SUPA_URL = fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim();
const SUPA_KEY = fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim();
const sb = createClient(SUPA_URL, SUPA_KEY, {auth:{persistSession:false}});
async function getPhoto(q) { return null; }

const POSTS = [
  {
    slug: 'kak-pereekhat-v-finlandiyu-helsinki-it-2026',
    title: 'Финляндия Хельсинки IT 2026: Specialist visa, Nokia, Supercell, Wolt, €1 300-2 500 аренда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Финляндия Хельсинки IT 2026 Specialist visa Nokia Supercell Wolt аренда переезд EU',
    seo_description: 'Финляндия Хельсинки IT 2026 Specialist visa Nokia Supercell Wolt аренда переезд EU',
    content_md: `# Финляндия IT 2026: Specialist Visa €5 000+/мес, Supercell $5B, Wolt $8B, Хельсинки €1 300-2 500

Финляндия — скандинавский рай с одной из лучших систем образования. Specialist Residence Permit для высокооплачиваемых специалистов (€5 000+/мес). Supercell ($5B; Clash of Clans!). Wolt ($8B; food delivery). Nokia (легенда; IoT comeback). F-Secure $1.7B. €1 300-2 500 аренда Хельсинки.

---

## Specialist Residence Permit

| Параметр | Значение |
|---------|---------|
| Порог | €5 000/мес (рекомендованный; не формальный) |
| Оффер | Обязателен от финской компании |
| Обработка | 2 нед через Fast Track (certified employers) |
| Срок | 1 год; продляемый |
| ПМЖ | 4 года |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Supercell | $5B; Clash of Clans; Brawl Stars; Helsinki |
| Wolt | $8B; food delivery; DoorDash купила 2022 |
| Nokia | $18B; 5G; networking hardware comeback |
| F-Secure | $1.7B; cybersecurity |
| Aiven | $3B; open source data infra |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Хельсинки (Käpylä; Kallio) | €1 300-2 000 |
| Хельсинки (Espoo; Vantaa) | €1 100-1 800 |
| Тампере (2-й город; дешевле) | €900-1 500 |
| Турку (студенческий; западное побережье) | €800-1 400 |

---

## Itogo

Финляндия Хельсинки IT 2026: Specialist Visa €5k/мес (2 нед Fast Track; certified employer обязателен; оффер нужен!); Supercell $5B (Clash of Clans; Clash Royale; Helsinki HQ; employee ownership!); Wolt $8B (DoorDash; €3B выход 2022; founders made millions!); Nokia 5G comeback; F-Secure кибербезопасность; Aiven $3B; €1 300-2 000 аренда (Kallio = хипстерский; Käpylä = спокойный!); Finnish Sauna (культурное наследие ЮНЕСКО; обязательно сходи в публичную; Löyly; Allas Sea Pool!); Northern Lights (Лапландия; декабрь-февраль; 8-10ч полет из Хельсинки!); финский язык (один из сложнейших; но в IT всё English!); Moomin (Муми-тролли; Хельсинки; Naantali = Муми-мир!).
`,
  },
  {
    slug: 'kak-pereekhat-v-niderlandy-amsterdam-it-2026',
    title: 'Нидерланды Амстердам IT 2026: 30% Ruling, ASML €300B, Adyen €40B, €1 500-2 800 аренда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Нидерланды Амстердам IT 2026 30% Ruling ASML Adyen аренда переезд EU',
    seo_description: 'Нидерланды Амстердам IT 2026 30% Ruling ASML Adyen аренда переезд EU Holland',
    content_md: `# Нидерланды IT 2026: 30% Tax Ruling (10 лет!), ASML €300B, Adyen €40B, Амстердам €1 500-2 800

Нидерланды — один из главных EU-tech-хабов. 30% Tax Ruling: 30% зарплаты освобождено от налогов (на 10 лет!). ASML (€300B; монополия на EUV литографию для чипов — без ASML нет iPhone!). Adyen (€40B; платежи). Booking.com. Philips. €1 500-2 800 аренда Амстердам.

---

## 30% Tax Ruling

| Параметр | Значение |
|---------|---------|
| Суть | 30% зарплаты — tax-free (как «компенсация расходов») |
| Срок | 10 лет максимум (снижен с 2024) |
| Условие | Специалист нанятый из-за рубежа (>150 км от NL) |
| Порог зарплаты | €46 107/год для 2026 |
| Эффект | Эффективный налог снижается с ~52% до ~37% |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| ASML | €300B; EUV lithography = без них нет чипов |
| Adyen | €40B; платежи (Amazon; Spotify; McDonald клиенты) |
| Booking.com | $15B; online travel |
| Philips | $20B; healthcare tech |
| Coolblue | $3B; e-commerce |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Амстердам (Centrum; De Pijp) | €2 000-3 500 |
| Амстердам (Noord; East) | €1 600-2 500 |
| Эйндховен (ASML-штаб; дешевле!) | €1 000-1 800 |
| Роттердам (порт; современный) | €1 200-2 000 |
| Утрехт (студенческий; центральный) | €1 200-2 000 |

---

## Itogo

Нидерланды IT 2026: 30% Ruling (30% зарплаты tax-free 10 лет; €46k порог; приедь из 150+ км!); ASML €300B (монополия EUV; без них нет чипов iPhone/M1/H100; Эйндховен 28 000 сотрудников!); Adyen €40B (Амстердам; Amazon/Spotify клиенты!); Booking.com; Philips Healthcare; EU Blue Card €46k порог; Амстердам €1 600-3 500 (дорого!); Эйндховен (€1-1.8k; ASML town; Design Museum + DDW фестиваль дизайна ноябрь!); велосипед (больше велов чем людей; 23М велов на 17М людей; езди как все — быстро!); стромпот (stamppot; картофель+капуста+колбаса = зимнее блюдо); stroopwafel (вафля с карамелью; $1-2; лучшая с кофе!).
`,
  },
  {
    slug: 'kenya-mombasa-diani-dn-coast-2026',
    title: 'Кения Момбаса Диани DN 2026: Индийский океан, $250-500 аренда, коралловые рифы, карибские пляжи Африки',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Кения Момбаса Диани DN 2026 Индийский океан аренда кораллы пляжи переезд Африка',
    seo_description: 'Кения Момбаса Диани DN 2026 Индийский океан аренда кораллы пляжи переезд Африка',
    content_md: `# Кения Coast DN 2026: Момбаса/Диани Индийский океан, $250-500 аренда, белые пляжи, 0% налог иностранный доход

Кения Coast — альтернатива дорогим Карибам для любителей белых пляжей. Диани: белоснежный песок + бирюзовый океан + обезьяны-колобусы в дереве + $250-500 аренда. Момбаса: Старый Город Arab heritage; Fort Jesus ЮНЕСКО. Kenya: 0% налог на иностранный доход (территориальная система!).

---

## Диани: жемчужина кенийского побережья

| Параметр | Значение |
|---------|---------|
| Пляж | 17 км белого коралловый песка |
| Вода | Теплая +26-29 круглый год |
| Кораллы | Снорклинг/дайвинг; $30-50 экскурсия |
| Аренда | $250-500 (коттедж / apartment) |
| Безопасность | Туристическая зона; относительно безопасно |
| Путь из Найроби | 8ч на автобусе; 1ч перелет ($50-80!) |

---

## Сравнение: Диани vs Занзибар

| Параметр | Диани (Кения) | Занзибар (Танзания) |
|---------|-------------|-------------------|
| Цена | Дешевле | Чуть дороже |
| Доступность | 1ч из Найроби | Паром/перелет |
| Туристы | Меньше | Больше (популярнее) |
| Культура | Swahili coast | Stone Town Arab |
| Дайвинг | Хорошо | Хорошо |

---

## Момбаса: история

| Место | Описание |
|-------|---------|
| Fort Jesus | ЮНЕСКО; португальская крепость 1593; музей |
| Старый Город | Arab heritage; мечети; базары; специи |
| Mombasa Tusks | Арка-бивни через главную дорогу = символ города |
| Haller Park | Бегемоты; черепахи; рептилии; $10 вход |

---

## Itogo

Кения Coast DN 2026: Диани Beach (17 км белого песка; $250-500 аренда; обезьяны-колобусы в пальмах — уникально!); Момбаса Старый Город (Arab heritage; Fort Jesus ЮНЕСКО; 1593!); Kenya 0% налог на иностранный доход (территориальная; работаешь на EU/US = 0%!); English официальный; UTC+3 (Москва = идеально!); дайвинг/снорклинг ($30-50; коралловые рифы; черепахи!); Wasini Island (полдня; дельфины; Full Meal в ресторане; $60-80 тур!); Giriama culture (прибрежные кенийцы; танцы; ткани); pilau rice ($3-5; пряный рис с мясом = побережье Кении!); mahamri (кокосовый пончик + чай; завтрак $1-2!).
`,
  },
  {
    slug: 'kak-pereekhat-v-izrail-teh-startap-2026',
    title: 'Израиль Тель-Авив Стартап-нация IT 2026: B1/B2 Work, Aliyah, Waze, Mobileye, $1 500-3 000 аренда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Израиль Тель-Авив IT 2026 B1 Work Aliyah Waze Mobileye стартап аренда переезд',
    seo_description: 'Израиль Тель-Авив IT 2026 B1 Work Aliyah Waze Mobileye стартап аренда переезд',
    content_md: `# Израиль Тель-Авив IT 2026: Startup Nation, B1/B2 Work Visa, Waze, Mobileye $50B, $1 500-3 000 аренда

Израиль — «Startup Nation» (#3 в мире по количеству стартапов на душу). Тель-Авив: $14B VC инвестиций ежегодно. Waze (Google купила $1.1B). Mobileye ($50B; autonomous driving). Aliyah: репатриация еврейского населения = гражданство. B1/B2 Work Visa для не-евреев. $1 500-3 000 аренда.

---

## Пути в Израиль

| Путь | Условие | Для кого |
|------|---------|---------|
| Aliyah | Еврейское происхождение (бабушка и дедушка) | Евреи диаспоры |
| B1/B2 Work Visa | Оффер от израильской компании | Любой |
| Expert Visa | Специалист; уникальные навыки | IT; наука |
| Volunteer | Kibbutz volunteer | 18-35 лет |

---

## Startup Nation: факты

| Факт | Число |
|------|------|
| Стартапов на 1M чел | #3 в мире |
| VC инвестиций ежегодно | $14B |
| Единороги | 100+ |
| Выходы на NASDAQ | Лидирующее место среди не-US стран |
| R&D центры | Microsoft; Google; Apple; Intel; Amazon |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Mobileye | $50B; автопилот; Intel купила |
| Waze | Maps; Google купила $1.1B 2013 |
| Check Point | $19B; cybersecurity; основана 1993 |
| CyberArk | $6B; identity security |
| monday.com | $8B; work management |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Тель-Авив (Florentin; Neve Tzedek) | ₪7 000-12 000 ($1 900-3 300) |
| Тель-Авив (Bat Yam; Givatayim) | ₪5 000-8 000 ($1 400-2 200) |
| Иерусалим (тихий; историческое) | ₪4 000-7 000 ($1 100-1 900) |
| Хайфа (3-й город; дешевле) | ₪3 500-6 000 ($950-1 650) |

---

## Itogo

Израиль Тель-Авив IT 2026: Startup Nation #3 мира; $14B VC/год; Mobileye $50B; Waze; Check Point $19B; monday.com $8B; B1/B2 Work Visa (оффер от израильской компании → виза); Aliyah (еврейское происхождение бабушки/дедушки = гражданство прямо!); R&D центры (Microsoft; Google; Apple; Intel = $2-5k/мес + сток!); ₪5 000-12 000 аренда ($1 400-3 300; дорого!); пляж Тель-Авива (15 мин пешком из центра; круглый год почти!); хумус ($3-8; лепешка+оливковое масло+специи = культ!); шакшука (яйца в томате; завтрак $8-15 в кафе!); шаббат (пятница вечер - суббота вечер = всё закрыто включая транспорт; планируй!).
`,
  },
];

let ok = 0, err = 0;
for (const p of POSTS) {
  const { data: existing } = await sb.from('blog_posts').select('id').eq('slug', p.slug).maybeSingle();
  if (existing) { console.log('[SKIP]', p.slug); ok++; continue; }
  const cover_url = await getPhoto(p.slug);
  const { error } = await sb.from('blog_posts').insert({
    slug: p.slug, title: p.title, tag: p.tag, read_time: p.read_time,
    seo_title: p.seo_title, seo_description: p.seo_description,
    content_md: p.content_md, country_slug: p.country_slug ?? null,
    city_id: null, published: true, cover_url,
    cover_author_name: null, cover_author_url: null, cover_unsplash_id: null,
  });
  if (error) { console.log('[ERR]', p.slug, error.message); err++; }
  else { console.log('[OK]', p.slug); ok++; }
}
console.log(`\nБатч 303: ${ok} OK, ${err} ошибок`);

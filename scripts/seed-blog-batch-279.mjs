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
    slug: 'meksika-mexiko-siti-merida-dn-2026',
    title: 'Мексика Мехико Мерида DN 2026: без НДФЛ для DN, $500-1 200 аренда, Residente Temporal',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Мексика Мехико Мерида DN 2026 НДФЛ аренда Residente Temporal переезд Латинская Америка',
    seo_description: 'Мексика Мехико Мерида DN 2026 НДФЛ аренда Residente Temporal переезд Латинская Америка пирамиды',
    content_md: `# Мексика DN 2026: 0% НДФЛ для иностранного дохода, Мехико $700-1 500, Мерида $500-900, VisaFacil

Мексика — самое популярное направление для DN-американцев, но работает и для русских. Мехико: огромный (22M чел); Кондеса и Рома — DN-кварталы; $700-1 500 аренда. Мерида (Юкатан): безопаснее; $500-900; Карибское море рядом. Испанский = необходимость (за пределами centro).

---

## Residente Temporal: как получить

| Параметр | Значение |
|---------|---------|
| Доход | $1 620/мес (6-месячная выписка) |
| Срок | 1 год (продление до 4 лет) |
| Тип | Временный резидент (Residente Temporal) |
| Право работы | Нет (для DN: работаешь на иностранных клиентов) |
| После 4 лет | Постоянный резидент → гражданство через 5 лет |

---

## Стоимость жизни

| Место | Аренда 2-комн | Нюанс |
|-------|-------------|-------|
| CDMX Condesa/Roma | $700-1 500 | DN-хаб; дорожает! |
| CDMX Coyoacan/Xochimilco | $500-1 000 | Спокойнее; колориальнее |
| Мерида (Centro; Santiago) | $500-900 | Безопаснее CDMX; медленнее |
| Оахака | $400-800 | Небольшой; аутентичный |
| Плайя-дель-Кармен | $600-1 200 | Пляжи; дороже; туристический |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Clip | $400M; Payments; CDMX |
| Kavak | $8.7B; Used cars; CDMX |
| Konfio | $1.3B; SME lending |
| Bitso | $2.2B; Crypto exchange |
| Kueski | $600M; BNPL |

---

## Безопасность

- CDMX: Condesa/Roma/Coyoacan = относительно безопасны
- Колими; Гуэрреро = НЕТ (карательные зоны)
- Мерида = самый безопасный крупный город Мексики
- Общее правило: такси через Uber (не уличное!); ночью осторожно

---

## Itogo

Мексика DN 2026: Residente Temporal ($1 620/мес; 1-4 года); 0% НДФЛ на иностранный доход (при нерезидентстве); Мехико Condesa/Roma (DN-хаб; $700-1 500; дорожает!); Мерида (Юкатан; безопаснее; $500-900; Карибское рядом 2ч!); Oaxaca (аутентичный; $400-800; тлаюдос; мескаль!); Kavak $8.7B; Bitso $2.2B; Uber (такси = ТОЛЬКО через приложение!); испанский язык = необходимость; tacos al pastor $0.50-1; mole negro; mezcal (Oaxaca); Chichen Itza 4ч от Мериды.
`,
  },
  {
    slug: 'kak-pereekhat-dizajneru-za-rubezh-2026',
    title: 'Как переехать дизайнеру за рубеж 2026: Figma, Dribbble, Toptal, удаленные вакансии',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать дизайнер рубеж 2026 Figma Dribbble Toptal удаленные вакансии UX UI',
    seo_description: 'Переехать дизайнер рубеж 2026 Figma Dribbble Toptal удаленные вакансии UX UI портфолио',
    content_md: `# Дизайнер за рубежом 2026: Figma/Toptal/Dribbble, ставки $30-150/ч, топ-направления

Дизайнеры — одна из самых мобильных профессий. Figma (стандарт индустрии); Toptal (топ-3% screened дизайнеров; $30-100/ч); Contra (0% комиссии). Ставки: Junior $20-40/ч; Middle $40-80/ч; Senior $60-150/ч. Лучшие направления: Нидерланды (Design Capital Amsterdam); Великобритания; Берлин.

---

## Платформы для дизайнеров (удаленно)

| Платформа | Ставки | Особенность |
|-----------|--------|------------|
| Toptal | $30-150/ч | Screened (сложный тест!); только топ |
| Contra | $20-100/ч | 0% комиссии |
| 99designs | $100-2 000/проект | Contest-based + Direct работа |
| Upwork | $15-80/ч | Большая биржа; конкуренция |
| DesignCraft | $30-80/ч | Немецкий рынок; EU-фокус |

---

## Как пройти Toptal Screening (для дизайна)

1. Application Form (зачем Toptal; прошлые проекты; ставки)
2. Language & Personality Interview (видео; English Level B2+!)
3. Technical Screen (Figma-задание; 2-4 часа; реальный кейс)
4. Test Project (оплачиваемый; реальный клиент; 1-2 нед)
5. Continued Engagement (ты в сети Toptal!)

Проходимость: ~3% от подавших = серьезная конкуренция.

---

## Страны с высоким спросом на дизайнеров

| Страна | Особенность |
|--------|------------|
| Нидерланды | Amsterdam = Design Capital EU; IKEA; Booking.com; Miro |
| Германия | BMW; Volkswagen; Zalando; прагматичный дизайн |
| Великобритания | Лондон Fintech (Monzo; Starling); медиа |
| США (удаленно) | Самые высокие ставки; $60-200/ч Senior |
| ОАЭ | 0% НДФЛ; luxury-бренды; архитектура |

---

## Инструменты в 2026

| Инструмент | Зачем |
|-----------|-------|
| Figma | Прототипирование; Collaboration; стандарт |
| FigJam | Воркшопы; Mapping; UX Research |
| Framer | No-code веб (сайты из Figma-макетов) |
| Lottie/Rive | Анимация для разработчиков |
| AI (Midjourney; Adobe Firefly) | Быстрые концепты; mood boards |

---

## Itogo

Дизайнер за рубежом 2026: Toptal (сложный скрин; 3%; $30-150/ч; но стабильные клиенты!); Contra 0% комиссии; Figma = стандарт (Figma AI → освой!); FigJam; Framer (no-code сайты = ценный скилл!); Dribbble профиль (портфолио = кейсы с Problem+Solution+Result + цифры!); Behance; Нидерланды (Amsterdam Design Capital); Германия (Zalando; BMW); $40-80/ч Middle удаленно; Toptal screened = premium-клиенты без поиска; AI-инструменты = конкурентное преимущество (не замена; ускоритель!).
`,
  },
  {
    slug: 'uruguaj-montevideo-it-2026',
    title: 'Уругвай Монтевидео IT 2026: 0% налог резидента на иностранный доход, $600-1 000 аренда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Уругвай Монтевидео IT 2026 налог резидент иностранный доход аренда переезд ЛатАм',
    seo_description: 'Уругвай Монтевидео IT 2026 налог резидент иностранный доход аренда переезд ЛатАм стабильная страна',
    content_md: `# Уругвай Монтевидео IT 2026: 0% налог на иностранный доход резидента, $600-1 000 аренда, стабильность

Уругвай — самая стабильная демократия Латинской Америки. Без коррупции (по меркам региона). ВВП/чел $17 000 (выше Бразилии; Аргентины). 0% налог на иностранный доход для новых резидентов (Tax Exemption: первые 5 лет → затем 12% IRNR). Монтевидео: $600-1 000 аренда 2-комн.

---

## Налоговый режим для иностранцев

| Период | Налог на иностранный доход |
|--------|--------------------------|
| Первые 5 лет (новый резидент) | 0% |
| После 5 лет | 12% IRNR (на иностранный доход) |
| Местный доход | Прогрессивный до 36% |

---

## Резидентство Уругвая

| Путь | Условие | Срок |
|------|---------|------|
| Temporal (через доход) | $1 500/мес OR $500k инвестиции | 6-12 мес оформление |
| Через работу | Оффер от уругвайской компании | 1-3 мес |
| Через недвижимость | Покупка $380k+ | 6-12 мес |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Quabit Genomics | Biotech + AI; Montevideo |
| Kushki | Payments ЛатАм; $300M |
| Teledata | IT Services; публичная |
| GeneXus | No-code development platform |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Монтевидео (Pocitos; Punta Carretas) | $700-1 200 |
| Монтевидео (Centro; Aguada) | $500-900 |
| Пунта-дель-Эсте (пляжи; сезонно) | $800-2 000 |

---

## Itogo

Уругвай IT 2026: 0% налог на иностранный доход первые 5 лет (затем 12% IRNR); самая стабильная демократия ЛатАм (прозрачность; нет политических потрясений); Монтевидео $600-1 000 (Pocitos = приморский; уютный); ВВП/чел $17k (выше Бразилии!); GeneXus (no-code; собственная платформа; легенда!); Пунта-дель-Эсте (летний курорт; декабрь-март; яхты; казино); asado (аргентинское; уругвайское = одно из лучших в ЛатАм!); mate (обязательный ритуал; предлагают на улице!); испанский язык; Uruguay гражданство через 3 года (ПМЖ) или 5 лет.
`,
  },
  {
    slug: 'kak-pereekhat-mediku-vrachu-za-rubezh-2026',
    title: 'Как переехать врачу или медику за рубеж 2026: нострификация, USMLE, PLAB, EU признание',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать врач медик рубеж 2026 нострификация USMLE PLAB EU признание диплом',
    seo_description: 'Переехать врач медик рубеж 2026 нострификация USMLE PLAB EU признание диплом работа',
    content_md: `# Врач за рубежом 2026: нострификация диплома, USMLE (США), PLAB (UK), Approbation (Германия)

Медицинская эмиграция — длительный процесс, но зарплаты оправдывают усилия. США: USMLE (3 этапа; $2 000+ сборы; 3-5 лет подготовки). UK: PLAB 1+2 ($1 600 сборы; 1-2 года). Германия: Approbation (языковой экзамен B2-C1 + Fachsprachprüfung; 1-2 года). Грузия/Армения: проще всего, но другой уровень зарплат.

---

## Пути нострификации медицинского диплома

| Страна | Система | Срок | Зарплата врача |
|--------|---------|------|----------------|
| США | USMLE Step 1+2+3 + Match | 3-6 лет | $150 000-400 000/год |
| UK | PLAB 1+2 | 1-3 года | £45 000-100 000 |
| Германия | Approbation + FSP | 1-3 года | €48 000-90 000 |
| Нидерланды | BIG-register | 2-4 года | €50 000-100 000 |
| Австралия | AMC (MCQ + Clinical) | 2-4 года | AU$80 000-200 000 |
| Грузия / Армения | Упрощенная | 6-12 мес | $1 000-2 500/мес |

---

## USMLE: путь в США

1. Step 1 (Basic Sciences) — $1 000 сбор; проходной 194+ (медиана матчинга 230+!)
2. Step 2 CK (Clinical Knowledge) — $1 000 сбор; 1-2 года подготовки
3. Step 2 CS (Clinical Skills) — отменен после COVID!
4. OET / TOEFL (English proficiency)
5. Match (NRMP): ежегодно в марте; конкуренция жесткая!
6. Residency: 3-7 лет (оплачивается; $55 000-70 000/год)

---

## Германия Approbation

1. Диплом в Landesamt fur Gesundheit (оценка)
2. Немецкий язык B2 (медицинский) — TestDaF или Goethe
3. Fachsprachprüfung (FSP) — медицинская устная коммуникация; в ärztekammer
4. Approbation → право практиковать

---

## Itogo

Врач за рубежом 2026: США (USMLE 3 этапа $2 000+ + Match; 4-6 лет; зарплата $150-400k!); UK PLAB (1-2 года; NHS; NHS Workforce Shortage = реально!); Германия Approbation (немецкий B2-C1 + FSP; 1-3 года; €48-90k); Австралия AMC (2-4 года; AU$80-200k); Грузия (1 год; $1-2.5k; самый быстрый старт + международный опыт!); дантисты/стоматологи = отдельный путь (часто быстрее нострификация!); медсестры (упрощенная нострификация в EU = NMC Registration UK; $1-3k; 6-18 мес).
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
console.log(`\nБатч 279: ${ok} OK, ${err} ошибок`);

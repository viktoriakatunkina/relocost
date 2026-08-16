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
    slug: 'kak-pereekhat-data-scientist-analytics-za-rubezh-2026',
    title: 'Как переехать data scientist/аналитику за рубеж 2026: США, Великобритания, Сингапур, $8-20k/мес',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать data scientist аналитик рубеж 2026 США Великобритания Сингапур зарплаты',
    seo_description: 'Переехать data scientist аналитик рубеж 2026 США Великобритания Сингапур зарплаты',
    content_md: `# Data Scientist/Аналитик за рубежом 2026: США $8-20k/мес, Великобритания £50-120k, Сингапур $10-25k SGD

Data Scientists — одна из самых востребованных профессий в мире (по данным LinkedIn). Нострификации нет. Portfolio на Kaggle + GitHub. США: $100-250k/год в tech. Великобритания: £50-120k. Сингапур: $10-25k SGD/мес + 0% прирост капитала. ОАЭ: $80-150k + 0% НДФЛ.

---

## Portfolio для DS: что работает

| Элемент | Что делать |
|---------|-----------|
| **Kaggle** | Войти в топ-10% в нескольких соревнованиях |
| **GitHub** | Минимум 3 проекта с реальными данными + README |
| **LinkedIn** | Статьи; визуализации; инсайты с реальных данных |
| **Deployed ML** | Хоть один реально работающий API (FastAPI + Streamlit) |
| **Blog/Medium** | Объяснение методов просто = демонстрация глубины |

---

## Зарплаты по странам

| Страна | Уровень | Зарплата |
|-------|---------|---------|
| США (Big Tech) | Senior DS | $180-300k/год |
| США (Стартап) | Mid DS | $120-180k/год |
| Великобритания | Mid DS | £60-100k/год |
| Сингапур | Senior DS | SGD $150-300k/год |
| ОАЭ | Senior DS | $100-200k/год + 0% |
| Германия | Mid DS | €70-120k/год |
| Канада | Mid DS | $100-150k CAD/год |

---

## Главные пути в DS без опыта DS

| Путь | Срок | Результат |
|------|------|---------|
| Kaggle + курсы (Coursera ML) | 6-12 мес | Junior DS |
| Bootcamp (Flatiron; BrainStation) | 3-6 мес | DA → DS |
| Аналитик → DS (внутри компании) | 1-3 года | Mid DS |
| Магистратура (MSCS; Statistics) | 1-2 года | Entry в Big Tech |

---

## Itogo

Data Scientist за рубежом 2026: Kaggle (соревнования; Gold medal в top-100 = визитка; bronze medal уже впечатляет!); GitHub (3 реальных проекта; deployed; README зачем+как+что нашел!); Coursera ML (Andrew Ng = базовый курс мира; 2 мес+!); USA H-1B (лотерея апрель; O-1A через публикации + топ-Kaggle = реалистично!); Сингапур EP (Employment Pass $6k/мес; DS в Grab/SEA/DBS!); ОАЭ (0% НДФЛ; быстро; $100-200k; Talabat; Emirates; ADNOC!); Великобритания Skilled Worker (£45k порог; DS везде!); SQL (знай хорошо!); Python pandas+sklearn+pytorch = фундамент; LLMs (2026 = обязательно LangChain+RAG!).
`,
  },
  {
    slug: 'kak-pereekhat-v-vengriyu-budapest-it-2026',
    title: 'Как переехать в Венгрию Будапешт IT 2026: EU White Card, €500-1 000 аренда, Magyar, Prezi',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Венгрия Будапешт IT 2026 EU White Card аренда Magyar Prezi переезд',
    seo_description: 'Венгрия Будапешт IT 2026 EU White Card аренда Magyar Prezi переезд Schengen',
    content_md: `# Венгрия Будапешт IT 2026: EU White Card, €1 200/год (дешевейший EU!), Prezi $73M, €500-1 000 аренда

Венгрия — одна из самых доступных EU-столиц. EU White Card (национальный аналог Blue Card): очень низкий порог (€12 500/год — самый низкий в EU!). Budapest: Дунай; термальные бани; архитектура. Prezi; Ustream; EPAM; IT-сектор быстро растет. €500-1 000 аренда в центре.

---

## EU White Card Венгрия

| Параметр | Значение |
|---------|---------|
| Порог | HUF 600 000/мес (~€1 500; €18k/год) |
| Более точно 2026 | Уточняй на Hungary Gov — порог обновляется |
| Срок | 2 года |
| ПМЖ | 3 года |
| EU | Полноценный Schengen + Euro (нет; Hungary = forint!) |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Prezi | $73M; presentations (конкурент PowerPoint!) |
| Ustream | Video streaming; IBM купила 2016 |
| EPAM Systems | IT-outsource; большой офис |
| Morgan Stanley | Tech hub Budapest |
| Emarsys | $1B; marketing automation (SAP купила) |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Будапешт (District V; VI; VII) | €700-1 300 |
| Будапешт (District VIII; IX) | €500-900 |
| Дебрецен (2-й город) | €300-600 |
| Мишкольц (3-й город) | €250-500 |

---

## Itogo

Венгрия Будапешт IT 2026: EU White Card (€18k/год — один из самых низких порогов EU!); Prezi $73M; Emarsys $1B; Morgan Stanley Budapest tech hub; €500-1 300 аренда (одна из дешевейших EU-столиц!); термальные бани (Szechenyi; Rudas; Gellert = 150+ лет; $15-25 вход; традиция!); Parliament (самый красивый в мире по спорным рейтингам; Дунай вечером!); ruin bars (District VII; Szimpla Kert; бары в заброшенных зданиях = уникально!); EU Schengen (да); Euro (НЕТ; forint — это минус для путешествий!); венгерский язык (один из сложнейших в мире; для PR нужен; на работе часто English!); lángos (жареное тесто со сметаной+сыром $2-3 = уличная еда!); goulash ($8-15 в ресторане; суп а не рагу = помни!).
`,
  },
  {
    slug: 'yamayka-kingston-dn-karib-2026',
    title: 'Ямайка Кингстон DN 2026: Jamaica Welcome Stamp $1 500/год, $400-700 аренда, reggae, rum',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Ямайка Кингстон DN 2026 Jamaica Welcome Stamp аренда reggae rum переезд Карибы',
    seo_description: 'Ямайка Кингстон DN 2026 Jamaica Welcome Stamp аренда reggae rum переезд Карибы Bob Marley',
    content_md: `# Ямайка DN 2026: Jamaica Welcome Stamp $1 500/год, $400-700 аренда, Bob Marley, reggae, rum

Ямайка — карибское государство с собственной DN-визой. Jamaica Welcome Stamp: $1 500/год (или $3 000 для семьи). Работа удаленно из Монтего-Бей или Кингстона. Bolt Energy; Digicel. Blue Mountain Coffee — лучший кофе в мире (по многим оценкам). Боб Марли родился здесь.

---

## Jamaica Welcome Stamp

| Параметр | Значение |
|---------|---------|
| Стоимость | $1 500/год (одиночка); $3 000/год (семья) |
| Срок | 1 год; продляемый |
| Условие | Удаленная работа вне Ямайки |
| Налог | 0% на иностранный доход |
| Процесс | Онлайн-заявка; в среднем 2-3 недели |

---

## Регионы для жизни

| Место | Характер | Аренда 2-комн |
|-------|---------|-------------|
| Монтего-Бей (MoBay) | Туристический; пляжи; аэропорт | $600-1 200 |
| Кингстон (столица) | Деловой; культурный; аутентичный | $500-900 |
| Неґрил (Negril) | Пляж 7 миль; закаты; hippie-DN | $400-800 |
| Порт-Антонио | Нетронутый; джунгли; водопады | $350-700 |

---

## Cultura Jamaicana

| Факт | Подробности |
|------|-----------|
| Боб Марли | Nine Mile — место рождения; Кингстон — Kingston studio |
| Reggae | Музыкальная столица; нематериальное наследие ЮНЕСКО 2018 |
| Blue Mountain Coffee | $50-80/фунт (!); только 6 000 акров сертифицировано |
| Bolt | Усэйн Болт родился здесь; самый быстрый человек в истории |
| Rum | Appleton Estate; Myers; Red Stripe пиво |

---

## Itogo

Ямайка DN 2026: Jamaica Welcome Stamp ($1 500/год; онлайн; 0% налог иностранный доход!); Монтего-Бей (аэропорт; пляжи; $600-1.2k!); Неґрил (7-мильный пляж = лучший закат Карибов; hippie-DN $400-800!); Bob Marley Museum Кингстон (Half Way Tree; оригинальный дом; обязательно!); Blue Mountain Coffee ($50-80/фунт; самый дорогой и самый мягкий в мире; купи кило и вези домой!); reggae (живые jam sessions каждую ночь; $2-5 вход!); Red Stripe (ямайское пиво; $1-2; повсюду!); jerk chicken (маринованное в scotch bonnet перце + специях; $5-10; национальное блюдо!); ackee and saltfish (завтрак национальный; ackee = фрукт похожий на scrambled eggs!).
`,
  },
  {
    slug: 'kak-pereekhat-v-daniyu-kopengagen-it-2026',
    title: 'Как переехать в Данию Копенгаген IT 2026: Pay Limit Scheme, €80k+ зарплата, Lego, Novo Nordisk',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Дания Копенгаген IT 2026 Pay Limit Scheme зарплата Lego Novo Nordisk переезд EU',
    seo_description: 'Дания Копенгаген IT 2026 Pay Limit Scheme зарплата Lego Novo Nordisk переезд EU',
    content_md: `# Дания IT 2026: Pay Limit Scheme DKK 500k ($72k/год), Kopenhagen, Novo Nordisk $600B, Lego, велосипеды

Дания — самая счастливая страна мира (регулярно #1 по World Happiness Report). Pay Limit Scheme: быстрый путь для высоких зарплат (DKK 500 000+/год). Novo Nordisk ($600B; GLP-1; Ozempic). Lego. Maersk (крупнейший контейнерный перевозчик). €1 800-3 500 аренда Копенгаген. 62% передвижений — на велосипеде!

---

## Pay Limit Scheme (Betalingsordning)

| Параметр | Значение |
|---------|---------|
| Порог | DKK 500 000+/год (~$72 000 USD) |
| Срок | 4 года |
| Путь к ПМЖ | После 4 лет + датский язык A1 + экзамен |
| Специальности | Любые (главное — зарплата) |
| Fast Track | Certified company = ускоренное рассмотрение |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Novo Nordisk | $600B; Ozempic/Wegovy; pharma tech |
| LEGO | $12B; toys + digital |
| Maersk | $25B; logistics tech; shipping |
| Ørsted | $20B; offshore wind energy tech |
| Unity Technologies | Game engine HQ; Copenhagen office |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Копенгаген (Indre By; Frederiksberg) | €2 000-3 500 |
| Копенгаген (Norrebro; Vesterbro) | €1 800-2 800 |
| Орхус (2-й город; дешевле!) | €1 200-2 000 |
| Оденсе (3-й; Андерсен birthplace!) | €1 000-1 800 |

---

## Itogo

Дания Копенгаген IT 2026: Pay Limit Scheme DKK 500k ($72k; любая специальность; 4 года → ПМЖ!); Novo Nordisk $600B (Ozempic = Дания спасла мир от ожирения?; крупнейший работодатель!); Lego HQ Биллунд; Maersk логистика-tech; самая счастливая страна мира (#1 регулярно!); 62% на велосипеде (велодорожки везде; обязательно купи велик в первый день!); €1 800-3 500 аренда (дорого; зарплаты оправдывают!); датский язык (A1 = для ПМЖ; но в компаниях English!); hygge (философия уюта; свечи + плед + какао + хорошая компания = смысл жизни по-датски!); Nyhavn (цветные дома; каналы; пиво $8-12; открытка Копенгагена!); смørrebrød (открытый бутерброд; 50+ вариантов; $5-15 в кафе!).
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
console.log(`\nБатч 301: ${ok} OK, ${err} ошибок`);

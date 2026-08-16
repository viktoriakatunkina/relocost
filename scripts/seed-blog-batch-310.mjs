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
    slug: 'kak-pereekhat-yuristu-advodkatu-za-rubezh-2026',
    title: 'Как переехать юристу и адвокату за рубеж в 2026: requalification, ОАЭ DIFC, UK SRA, Канада',
    tag: 'профессии',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как переехать юристу адвокату за рубеж 2026 requalification ОАЭ DIFC UK SRA Канада',
    seo_description: 'Как переехать юристу адвокату за рубеж 2026 requalification ОАЭ DIFC UK SRA Канада зарплата',
    content_md: `# Как переехать юристу и адвокату в 2026: ОАЭ DIFC ($150-350k!), UK SRA, Канада NCA, международное право

Юрист — лицензированная профессия. В каждой стране своя bar association. Но международные юристы востребованы везде. ОАЭ DIFC (Dubai International Financial Centre): common law юрисдикция = английские дипломы признаются! UK: Solicitor через SRA Qualified Lawyers Transfer. Канада: NCA процесс.

---

## Зарплаты по направлениям

| Специализация | Страна | Диапазон |
|-------------|--------|---------|
| Corporate/M&A | ОАЭ Дубай | $120-350k |
| Litigation | UK Лондон | £60-180k |
| IP/Tech | США Сан-Франциско | $180-400k |
| Compliance/Regulatory | Сингапур | SGD 80-200k |
| International Trade | Швейцария | CHF 90-160k |
| In-house Counsel | EU/Германия | €70-150k |

---

## ОАЭ DIFC: почему особенный

| Факт | Описание |
|------|---------|
| Юрисдикция | English Common Law (отдельно от ОАЭ!); свой суд |
| Признание дипломов | UK+Anglophone дипломы признаются; упрощенная процедура |
| Бум финансов | $5T assets under management |
| Без налога | 0% НДФЛ; 0% corporate tax в DIFC |
| Офисы | Clifford Chance; Allen & Overy; Baker McKenzie; все Big Law |

---

## Пути реквалификации

| Страна | Процесс | Срок |
|--------|---------|------|
| UK | SRA QLTS (Qualified Lawyers Transfer Scheme) | 1-2 года |
| Канада | NCA (National Committee on Accreditation) | 1-3 года |
| Австралия | OLGA (Overseas Lawyers Admission) | 1-2 года |
| ОАЭ | DIFC Courts Wills Service; DIFC registration | 3-12 мес |
| Сингапур | Singapore Bar; FLPL Foreign Practitioner | 1-2 года |

---

## Международное право: без реквалификации

| Направление | Почему не нужна нац. лицензия |
|------------|------------------------------|
| International Arbitration | Арбитры не регулируются нацбаром |
| Academic/Research | Профессор права; LLM-преподаватель |
| In-house (MNC) | Многие стран не требуют local bar для in-house |
| Legal Consultant | Советник (не адвокат представляющий в суде) |
| NGO/UN | Международные организации |

---

## Itogo

Юрист/адвокат за рубеж 2026: лицензированная профессия (реквалификация нужна; но международное право = без бара!); ОАЭ DIFC ($120-350k/год; 0% налог; Common Law = UK дипломы признаются; Clifford Chance+Allen&Overy+Baker McKenzie работают!); UK SRA QLTS (1-2 года; London BigLaw £60-180k!); Канада NCA (1-3 года; Express Entry потом!); международный арбитраж (без нац. лицензии = ICC; DIFC-LCIA; SIAC; Vienna!); LLM (London; NYU; Georgetown; Harvard = открывает BigLaw двери; $50-90k стоимость!); in-house в MNC (legal counsel без local bar во многих юрисдикциях!); английский (всё международное право на английском = must!).
`,
  },
  {
    slug: 'kak-pereekhat-uchitelyu-pedagogu-za-rubezh-2026',
    title: 'Как переехать учителю и педагогу за рубеж в 2026: международные школы IB, $30-80k, визы',
    tag: 'профессии',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как переехать учителю педагогу за рубеж 2026 международные школы IB зарплата визы',
    seo_description: 'Как переехать учителю педагогу за рубеж 2026 международные школы IB зарплата визы ОАЭ',
    content_mid: 'ignored',
    content_md: `# Как переехать учителю в 2026: IB-школы ($50-100k!), ОАЭ ($40-80k + жилье!), Азия, International Schools

Учитель — один из самых стабильных путей переезда через международные школы. IB Diploma Programme (International Baccalaureate): устойчивый спрос. ОАЭ: $40-80k + жилье + перелет + страховка (total package!). Азия (Китай; Вьетнам; Таиланд): $30-55k. Топ-платформа: TIE Online; Search Associates; ISS.

---

## Зарплаты и пакеты по регионам

| Регион | Зарплата | Бенефиты |
|--------|---------|---------|
| ОАЭ/Катар/Кувейт | $40-80k/год | + жилье + перелет + страховка + бонусы |
| Сингапур/Гонконг | $50-90k/год | + жилье частично; дорогой город |
| Китай | $25-50k/год | + жилье + перелет + страховка |
| Вьетнам/Таиланд | $20-40k/год | + жилье часто |
| Европа (нем. школы) | €30-55k/год | Зависит от страны |
| Латинская Америка | $20-40k/год | Базовый пакет |

---

## Платформы для поиска

| Платформа | Описание |
|----------|---------|
| TIE Online (The International Educator) | Основная платформа; 5 000+ вакансий |
| Search Associates | Premium; ярмарки вакансий |
| ISS (International Schools Services) | США-база; все регионы |
| ECIS | European schools; Европа + overseas |
| Teachaway | Online + international |

---

## IB Diploma Programme: преимущество

| Факт | Описание |
|------|---------|
| Что такое | International Baccalaureate; признан в 150+ странах |
| IB Schools | 5 500+ школ в 159 странах |
| Зарплата | 20-30% выше обычных международных школ |
| Квалификация | IB World School teachers = специальные курсы |
| Спрос | Растет 8-10% год к году |

---

## Что нужно

| Требование | Детали |
|-----------|--------|
| Диплом | Педагогический или по предмету |
| QTS/PGCE | UK учительская квалификация ценится! |
| Английский | C1+ для anglophone школ |
| Опыт | 2+ года; 5+ лет для топ-школ |
| Clearances | Criminal background check; safeguarding |

---

## Itogo

Учитель/педагог за рубеж 2026: международные школы = стабильный путь (TIE Online; Search Associates; ISS = 5 000+ вакансий постоянно!); ОАЭ/Катар/Кувейт ($40-80k + жилье + перелет + страховка = total package!; 0% налог!); IB-школы (20-30% выше зарплата; 5 500 школ 159 стран!); Сингапур/Гонконг ($50-90k; дорогой город; но экономика ок); Китай ($25-50k + жилье + перелет; много школ!); QTS/PGCE UK (открывает двери в premium anglophone schools!); сезон найма (зима-весна = основной найм на следующий год; сентябрь начало!); IB Teacher Certificates ($500-2000; online; Coursera+IB; резко увеличивает шансы!); математика/физика (дефицит преподавателей = 10-15% выше предложения!).
`,
  },
  {
    slug: 'kak-pereekhat-v-rumuniyu-bukharest-2026',
    title: 'Румыния Бухарест DN 2026: EU + Schengen 2024, €600-1 000 аренда, IT-хаб, самое дешевое в EU',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Румыния Бухарест DN 2026 EU Schengen аренда IT-хаб дешевое EU переезд',
    seo_description: 'Румыния Бухарест DN 2026 EU Schengen аренда IT-хаб самое дешевое EU переезд',
    content_md: `# Румыния Бухарест DN 2026: EU + Schengen 2024, €600-1 000 аренда (дешевейшая EU!), IT-хаб, UiPath $7B

Румыния в Schengen с 2024! EU + Schengen + одни из самых низких цен в EU = идеальная формула. €600-1 000 аренда Бухарест. UiPath ($7B RPA-чемпион). Bitdefender ($1B+ кибербез). Один из лучших интернетов в мире (топ-3 по скорости!). IT-зарплаты: €1 500-3 500 нетто.

---

## Румыния vs Другие EU-страны

| Параметр | Румыния | Польша | Чехия | Германия |
|---------|---------|--------|-------|---------|
| Аренда 2-комн | €600-1 000 | €800-1 400 | €800-1 250 | €1 400-2 500 |
| Schengen | ДА (с марта 2024!) | ДА | ДА | ДА |
| IT-зарплата нетто | €1 500-3 500 | €1 800-3 500 | €1 500-3 000 | €2 500-5 000 |
| Интернет | Топ-3 мира | Хороший | Хороший | Средний |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| UiPath | $7B RPA (Robotic Process Automation); Nasdaq; основан в Бухаресте |
| Bitdefender | Кибербезопасность; $1B+; 400M+ защищенных систем |
| Ness Digital Engineering | Engineering services |
| Endava | Digital services; LSE; €1B+ |
| Oracle Romania | 3 000+ сотрудников |

---

## Жизнь в Бухаресте

| Параметр | Детали |
|---------|--------|
| Районы для DN | Floreasca; Dorobanti; Herastrau (посолиднее); Militari; Drumul Taberei (дешевле) |
| Интернет | 500 Mbps fiber = €10-15/мес (топ-3 мира!) |
| Общественный транспорт | Метро; трамваи; хорошее |
| Рестораны | €5-15 ужин; румынская; международная кухня |
| Expat-community | Растет быстро |

---

## Itogo

Румыния Бухарест DN 2026: EU + Schengen (с марта 2024; 26 стран свободного перемещения!); самый дешевый EU-вариант (€600-1 000 аренда!); интернет топ-3 мира (500 Mbps за €10-15!); UiPath $7B (основан в Бухаресте; Nasdaq; RPA-чемпион мира!); Bitdefender $1B+ (кибербез; 400M защищенных систем!); IT-зарплаты (€1 500-3 500 нетто = при €600-1 000 аренде — отличный баланс!); безвизовый въезд (CBTC для non-EU; или рабочая виза EU Blue Card €2 877 порог — один из самых низких!); Трансильвания (Брашов; Сибиу; Сигишоара; замок Дракулы = выходные!); sarmale (голубцы с рисом и мясом = национальное; $3-7!); mici (мясные колбаски на гриле = street food!); tuica (сливовая ракия = дегустировать с осторожностью!).
`,
  },
  {
    slug: 'kak-pereekhat-v-slovakiyu-bratislava-2026',
    title: 'Словакия Братислава DN 2026: EU + Schengen, €700-1 100 аренда, 15 мин до Вены, дешевле в 3 раза',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Словакия Братислава DN 2026 EU Schengen аренда Вена 15 минут дешевле переезд',
    seo_description: 'Словакия Братислава DN 2026 EU Schengen аренда Вена 15 минут дешевле три раза переезд',
    content_md: `# Словакия Братислава DN 2026: EU + Schengen + Euro + 15 мин до Вены, €700-1 100 аренда (втрое дешевле)

Братислава — уникальный феномен. 15 минут на автобусе до Вены! Но Братислава втрое дешевле. EU + Schengen + Euro (единая валюта!). Volkswagen Slovakia; Dell; AT&T; IBM — все здесь. €700-1 100 аренда vs €1 800-3 000+ в Вене. Словацкий EU Blue Card: €1 533/мес порог (самый низкий EU!).

---

## Братислава vs Вена

| Параметр | Братислава | Вена |
|---------|----------|------|
| Аренда 2-комн | €700-1 100 | €1 800-3 000+ |
| Расстояние | 15 мин автобус (63km) | — |
| Язык | Словацкий | Немецкий |
| EU Blue Card порог | €1 533/мес (! очень низко) | €3 500+/мес Австрия |
| Expat | Растет | Большой |
| Метро | Нет (маленький город!) | Да |

---

## Компании в Братиславе

| Компания | Профиль |
|---------|---------|
| Volkswagen Slovakia | Крупнейший завод VW; 12 000 сотрудников |
| Dell Technologies | EMEA Shared Services |
| AT&T | EMEA offices |
| IBM | Business services |
| Swiss Re | Reinsurance |
| Slido (Cisco) | Интерактивные опросы; $250M |

---

## EU Blue Card Словакия: самый низкий порог

| Параметр | Значение |
|---------|---------|
| Зарплатный порог | €1 533/мес (€18 400/год) — самый низкий в EU! |
| Высшее образование | Обязательно |
| Оффер | Обязателен |
| ПМЖ | 5 лет |
| Языки | Словацкий и/или английский |

---

## Жизнь в Братиславе

| Параметр | Детали |
|---------|--------|
| Размер | 475 000 чел; камерный |
| Expat-районы | Ruzinov; Petrzalka; Stare Mesto (центр) |
| Природа | Малые Карпаты в черте города; винодельни! |
| Вена | Автобус Flixbus €5-15; 1ч; или RegioJet |
| Будапешт | 2ч автобус; Прага 4ч |

---

## Itogo

Словакия Братислава DN 2026: EU + Schengen + Euro (единая валюта!; 26 стран!); 15 мин до Вены ($700-1 100 vs $1 800-3 000+ = втрое дешевле за тот же доступ!); EU Blue Card €1 533/мес (самый низкий порог в EU = легче получить!); Volkswagen Slovakia + Dell + AT&T + IBM = серьезные работодатели; Slido $250M (словацкий стартап; Cisco купил); Малые Карпаты в городе (пешеходные тропы + вино из винодельни $5-10!); Будапешт 2ч; Прага 4ч; Вена 15 мин = идеальная база!; bryndzove halusky (клецки с овечьим сыром = национальное; $4-8!); kapustnica (кислый капустный суп; Рождество!); Slovak wine (малокарпатское; недооцененное; дегустация $10-20!).
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
console.log(`\nБатч 310: ${ok} OK, ${err} ошибок`);

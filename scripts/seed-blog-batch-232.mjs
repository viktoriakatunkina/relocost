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
    slug: 'malajziya-kuala-lumpur-it-dn-2026',
    title: 'Малайзия Куала-Лумпур IT DN 2026: DE Rantau Visa, Grab, AirAsia, PETRONAS tech',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Малайзия Куала-Лумпур IT DN 2026 DE Rantau Visa Grab AirAsia PETRONAS tech',
    seo_description: 'Малайзия Куала-Лумпур IT 2026 DE Rantau Visa Grab AirAsia PETRONAS tech Petaling Jaya: МАЛАЙЗИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ МАЛАЙЗИЯ: DE RANTAU = ОФИЦИАЛЬНАЯ DN-ПРОГРАММА (с 2022): одна из первых в Азии; доступная; IT-ориентированная; СТОИМОСТЬ ЖИЗНИ: ниже Сингапура в 3-4 раза при схожей инфраструктуре; MULTICULTURAL: малайцы; китайцы (26%); индийцы (7%); + expat; 3 культуры в одном городе; PETRONAS TOWERS: был самым высоким зданием мира (1998-2004; 452 м); ИСТОРИЯ: Малайская Федерация; независимость 1957; Малайзия 1963 (с Сингапуром; Северным Борнео); Сингапур вышел 1965; Vision 2020 (Махатхир); ПРИРОДА: джунгли Борнео (орангутаны!); острова (Langkawi; Perhentian; Tioman; кораллы); горы Cameron Highlands (чай!); Taman Negara (старейший тропический лес мира; 130M лет!); КУХНЯ: nasi lemak (рис в кокосовом молоке + ikan bilis; национальное блюдо); char kway teow (жареная лапша); roti canai (хлеб с карри); laksa; wonton mee; mee goreng; MAMAK STALLS: круглосуточные кафе (teh tarik; roti canai; nasi goreng); ВРЕМЕННАЯ ЗОНА: MYT UTC+8; EU: большая разница; Австралия/Азия = лучше; ВИЗЫ МАЛАЙЗИЯ: 1. DE RANTAU DN VISA: ОФИЦИАЛЬНАЯ DN-VISA с 2022; ТРЕБОВАНИЯ: иностранный доход минимум $24 000/год ($2 000/мес); tech-специальность (listed occupations; IT-разработчики = включены); медстраховка; СРОК: 12 мес; продляется ещё 12 мес = 2 года; для семьи: spouse + children; СТОИМОСТЬ: MYR 1 000 ($225) для single; MYR 500 для spouse; ПРЕИМУЩЕСТВА: работать из Малайзии на иностранных клиентов; не платить малайзийский налог на иностранный доход; 2. TOURIST VISA: граждане РФ = 30 дней без визы; автоматически; 3. MM2H (MALAYSIA MY SECOND HOME): долгосрочная резидентная программа; пересмотрена в 2021 (стала сложнее); требует: возраст 35+; депозит от RM 1M ($225 000) или RM 500 000 ($112 000) для Sarawak; 4. EMPLOYMENT PASS: через малайзийского работодателя; ПМЖ/ГРАЖДАНСТВО: очень сложно для иностранцев (Malaysia = не иммиграционная страна; ПМЖ редко); РЫНОК IT МАЛАЙЗИЯ: GRAB ($14B; но зарегистрирован в Сингапуре; основан в KL!; команды в обоих); AIRASIA ($1B; авиакомпания + digital AirAsia Super App); PETRONAS DIGITAL ($5B+ материнская; цифровая трансформация нефти); CELCOM AXIATA (телеком; Axiata Group); Maxis Berhad (телеком); CIMB (banking; regional); MAXIS (telco; Malaysia Tech Drive 5G); CARSOME ($2B; used car marketplace; region-leading); Lalamove Malaysia; SHOPEE Malaysia; LAZADA Malaysia; MOL (платёжные системы региона); ЗАРПЛАТЫ IT МАЛАЙЗИЯ (GROSS MYR; 1 USD = 4.44 MYR): LOCAL: Junior: MYR 3 000-5 000/мес ($675-1 126); Middle: MYR 5 000-10 000 ($1 126-2 252); Senior: MYR 10 000-20 000 ($2 252-4 505); GRAB/Carsome Senior: MYR 15 000-30 000 ($3 378-6 757); REMOTE EU/US: $3 000-12 000; НАЛОГИ МАЛАЙЗИЯ: НДФЛ: 0% до MYR 5 000/год; 1% до MYR 20 000; 3% до MYR 35 000; 8% до MYR 50 000; 13% до MYR 70 000; 21% до MYR 100 000; 24% до MYR 400 000; 25% до MYR 600 000; 26% до MYR 2M; 28% свыше; ДЛЯ ИНОСТРАННОГО ДОХОДА: территориальная система до 2022 = иностранный доход 0% налог; С 2022: иностранный доход ОБЛАГАЕТСЯ при ввозе в Малайзию; это осложнило ситуацию; НО: для DE Rantau: правила различные; уточнять актуально; СТОИМОСТЬ ЖИЗНИ МАЛАЙЗИЯ 2026: КУАЛА-ЛУМПУР: АРЕНДА: 2-комн Bangsar; Mont Kiara; Bukit Bintang: MYR 2 500-5 000/мес ($563-1 126); 2-комн Cheras; Shah Alam; Petaling Jaya: MYR 1 500-3 000 ($338-675); ПЕНАНГ (FOOD CAPITAL; КУЛЬТУРНОЕ НАСЛЕДИЕ): 2-комн Georgetown: MYR 1 200-2 500 ($270-563); ДЖОХОР БАРУ (РЯДОМ СИНГАПУР): 2-комн: MYR 1 000-2 000 ($225-450); КОТА-КИНАБАЛУ (БОРНЕО): 2-комн: MYR 1 000-2 000; ПРОДУКТЫ: nasi lemak (национальный завтрак): MYR 3-8 ($0.68-1.80); roti canai: MYR 2-5; teh tarik (чай с молоком; встряхнутый): MYR 1.5-3.5; mee goreng (жареная лапша): MYR 4-8; продукты в Giant; Lotus Tesco; Cold Storage: MYR 600-1 200/мес ($135-270); ТРАНСПОРТ: Grab (Uber KL): MYR 8-25/поездка; LRT/MRT: MYR 1.2-5.2/поездка; месячный pass: MYR 150-250 ($34-56); КЛИМАТ: equatorial; +27-35; влажность 75-90%; дождь часто (но быстро); без сезонов (кроме дождей ноябрь-январь в восточном побережье)',
    content_md: `# Малайзия Куала-Лумпур IT DN 2026: DE Rantau $2k/мес, Grab, PETRONAS, Petronas Towers

Малайзия — официальная DN-виза DE Rantau (2022). Минимальный доход $2 000/мес. Petronas Towers (был #1 в мире). Grab (основан в KL). AirAsia Super App. Remote $5 000 → расходы $700 → остаток $4 300. В 3-4 раза дешевле Сингапура.

---

## DE Rantau DN Visa

| Параметр | Значение |
|---------|---------|
| Минимальный доход | $24 000/год ($2 000/мес) |
| Специальности | IT-разработчики включены |
| Срок | 12 мес + 12 мес = 2 года |
| Стоимость | MYR 1 000 ($225) single |
| Семья | Spouse + дети включены |

---

## IT-экосистема

| Компания | Оценка | Профиль |
|---------|--------|---------|
| **Grab** | **$14B** | **Основан в KL; суперапп ЮВА** |
| AirAsia | $1B | Авиа + digital super app |
| Carsome | $2B | Used car marketplace; регион #1 |
| PETRONAS Digital | — | Цифровая трансформация нефти |

---

## Стоимость жизни

| Город/Район | Аренда 2-комн MYR/мес | USD/мес |
|-------------|---------------------|---------|
| KL Bangsar; Mont Kiara | 2 500-5 000 | $563-1 126 |
| KL пригород | 1 500-3 000 | $338-675 |
| **Пенанг** | **1 200-2 500** | **$270-563 (кулинар. столица!)** |
| Джохор Бару (рядом SG) | 1 000-2 000 | $225-450 |

---

## Итого

Малайзия IT 2026: DE Rantau DN Visa ($2k/мес); в 3-4 раза дешевле Сингапура; Grab (основан в KL); Carsome ($2B); nasi lemak $0.68-1.80; roti canai MYR 2-5; Mamak stalls круглосуточные; Petronas Towers (была #1 мира); Борнео орангутаны; Cameron Highlands чай; иностранный доход: налогообложение изменилось с 2022 (уточнять); ПМЖ очень сложно; часовой пояс +8 (плохо для EU).
`,
  },
  {
    slug: 'taivan-taipei-it-2026',
    title: 'Тайвань Тайбэй IT 2026: Gold Card Visa, TSMC, Asus, MediaTek, пузыри с молоком',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Тайвань Тайбэй IT 2026 Gold Card Visa TSMC Asus MediaTek пузыри с молоком',
    seo_description: 'Тайвань Тайбэй IT 2026 Gold Card Visa TSMC Asus MediaTek пузыри молоко chip: ТАЙВАНЬ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ТАЙВАНЬ: TSMC: Taiwan Semiconductor Manufacturing Company = производит 92% самых передовых чипов в мире (5nm и ниже); без TSMC нет iPhone; без TSMC нет Nvidia GPU; без TSMC нет современной компьютерной техники; TECH CAPITAL ASIA: Asus; Acer; HTC; MediaTek; Foxconn; всё создано на Тайване; GOLD CARD: специальная упрощённая виза для талантов; ЕДА: пузыри с чаем (boba tea = изобретены на Тайване!); night markets (Shilin; Raohe; Feng Chia); xiaolongbao; stinky tofu; oyster omelette; ИСТОРИЯ: колонизация португальцами; потом Голландией; Империя Цин; Япония (1895-1945); гражданская война Китая (1945-1949) → Чан Кайши с гоминьдановцами бежал на Тайвань; РПЦ (Republic of China) vs КНР (People Republic of China); современный статус: Тайвань де-факто независимое государство; де-юре = спорно; ГЕОПОЛИТИКА: напряжение КНР-Тайвань; США защищают Тайвань (Taiwan Relations Act); полупроводниковый щит; ПРИРОДА: Taroko Gorge (мраморный каньон); Ali Shan (горы; чайные плантации); Sun Moon Lake; Green Island; Kenting (субтропические пляжи); ВРЕМЕН ЗОНА: CST UTC+8; EU: большая разница; ЯЗЫКИ: мандаринский (официальный); тайваньский (Hokkien; 80% населения); Hakka; English в IT = достаточно в крупных компаниях; ВИЗЫ ТАЙВАНЬ: 1. GOLD CARD (EMPLOYMENT GOLD CARD): ОТЛИЧНАЯ ВИЗОВАЯ ПРОГРАММА для специалистов; ТРЕБОВАНИЯ: в одной из 7 сфер (IT; Humanities; Art; Finance; Science; Architecture; Sport); специфические критерии для IT: международная публикация; патент; OR зарплата в иностранной компании минимум TWD 160 000/мес ($5 000+); ПРЕИМУЩЕСТВА: работать в Тайване или удалённо; открыть компанию; искать работу; СРОК: 1-3 года; продляется; ПМЖ через 5 лет; СТОИМОСТЬ: TWD 3 000 ($94) + рассмотрение; ПОДАЧА: онлайн через goldcard.nat.gov.tw; 2. TOURIST VISA: граждане РФ = 30 дней; некоторые категории 90 дней; 3. EMPLOYMENT AUTHORIZATION LETTER: через работодателя; РЫНОК IT ТАЙВАНЬ: TSMC ($450B; производство чипов; №1 в мире; Morris Chang; нет у конкурентов аналога); ASML продает EUV только TSMC + Intel + Samsung; MEDIATEK ($30B; fabless chip design; 5G; AI); ASUS ($7B; ноутбуки; смартфоны; роутеры; ROG gaming); ACER ($4B; ноутбуки; мониторы; Predator gaming); HTC ($1B+ на пике; Vive VR headsets; первые Android-смартфоны); FOXCONN ($50B; contract manufacturing; iPhone assembly); PEGATRON (Apple manufacturing; ASUS spinoff); COMPUTEX: крупнейшая tech-выставка Азии (Тайбэй; май); ЗАРПЛАТЫ IT ТАЙВАНЬ (GROSS TWD; 1 USD = 31.8 TWD): LOCAL: Junior: TWD 35 000-55 000/мес ($1 100-1 730); Middle: TWD 55 000-90 000 ($1 730-2 830); Senior: TWD 90 000-160 000 ($2 830-5 031); TSMC Senior: TWD 120 000-250 000 ($3 774-7 862) + bonus; MEDIATEK Senior: TWD 150 000-300 000 ($4 717-9 434); GOLD CARD REMOTE EU/US: $5 000-15 000; НАЛОГИ ТАЙВАНЬ: НДФЛ: 5% до TWD 590 000/год; 12% до TWD 1 330 000; 20% до TWD 2 660 000; 30% до TWD 4 980 000; 40% свыше; эффективная ставка при TWD 1.2M/год (~$37 700): ~12-15%; при REMOTE EU/US income: если не работаешь в тайванской компании = минимальный тайваньский налог; СТОИМОСТЬ ЖИЗНИ ТАЙВАНЬ 2026: ТАЙБЭЙ: АРЕНДА: 2-комн Da An; Xinyi; Zhongzheng: TWD 35 000-60 000/мес ($1 101-1 887); 2-комн Wenshan; Neihu; Xizhi (пригород): TWD 20 000-35 000 ($629-1 101); ТАЙЧУНГ (ВТОРОЙ ГОРОД; ДЕШЕВЛЕ): 2-комн: TWD 15 000-28 000 ($472-880); ГАОСЮН (ЮГ): 2-комн: TWD 12 000-25 000 ($377-786); ПРОДУКТЫ: beef noodle soup (говяжий суп с лапшой; культовый): TWD 150-300 ($4.72-9.43); lu rou fan (тушёная свинина на рисе): TWD 60-120; scallion pancake: TWD 20-40; night market food: TWD 30-80 за блюдо; boba tea (пузырьковый чай): TWD 50-90 ($1.57-2.83); продукты в PX Mart; Carrefour: TWD 5 000-10 000/мес ($157-314); ТРАНСПОРТ: MRT Taipei: TWD 20-65/поездка; Easy Card месячный: TWD 1 280 ($40); YouBike (прокат велосипедов): TWD 10/30 мин; КЛИМАТ: subtropical; Тайбэй: зима +15 (редко <10; влажно); лето +33 (влажно!); Тайфуны (июль-октябрь; от 3 до 10/год!); БЕЗОПАСНОСТЬ: очень безопасно внутри; основной риск = тайфуны и геополитика КНР',
    content_md: `# Тайвань Тайбэй IT 2026: Gold Card Visa, TSMC $450B, MediaTek, boba tea

Тайвань — сердце мировой полупроводниковой промышленности. TSMC ($450B): 92% самых продвинутых чипов мира. Gold Card Visa: 1-3 года для IT-специалистов ($5 000+/мес). MediaTek ($30B), ASUS ($7B). Boba tea — изобретена на Тайване.

---

## Gold Card Visa

| Параметр | Значение |
|---------|---------|
| Для IT | Зарплата иностранной компании TWD 160 000/мес ($5 000+) |
| Срок | 1-3 года; продляется |
| Стоимость | TWD 3 000 ($94) |
| Права | Работать; открыть компанию; искать работу |
| ПМЖ | Через 5 лет |

---

## IT-экосистема

| Компания | Оценка | Профиль |
|---------|--------|---------|
| **TSMC** | **$450B** | **92% продвинутых чипов мира** |
| MediaTek | $30B | Fabless chip design; 5G; AI |
| ASUS | $7B | Ноутбуки; ROG gaming |
| Foxconn | $50B | Contract manufacturing; iPhone |

---

## Стоимость жизни

| Город | Аренда 2-комн TWD/мес | USD/мес |
|-------|--------------------|---------|
| Тайбэй центр | 35 000-60 000 | $1 101-1 887 |
| Тайбэй пригород | 20 000-35 000 | $629-1 101 |
| **Тайчунг** | **15 000-28 000** | **$472-880** |

---

## Итого

Тайвань IT 2026: TSMC ($450B; 92% продвинутых чипов — без него нет iPhone/Nvidia); Gold Card Visa ($5k/мес); MediaTek ($30B); ASUS; boba tea (изобретена здесь!); Taroko Gorge мраморный каньон; ночные рынки; very safe; геополитика КНР-Тайвань (основной риск); тайфуны 3-10/год; мандаринский язык помогает но не обязателен в IT.
`,
  },
  {
    slug: 'kak-pereekhat-v-it-bez-opyta-s-nulja-2026',
    title: 'Как войти в IT без опыта с нуля 2026: курсы, стек, портфолио, первая работа, переезд',
    tag: 'переезд',
    read_time: 2,
    country_slug: null,
    seo_title: 'Войти в IT без опыта с нуля 2026 курсы стек портфолио первая работа переезд',
    seo_description: 'Войти IT без опыта 2026 курсы стек портфолио первая работа переезд за рубеж: КАК ВОЙТИ В IT БЕЗ ОПЫТА С НУЛЯ В 2026 ГОДУ — ПРАКТИЧЕСКОЕ РУКОВОДСТВО: ПОЧЕМУ IT: средняя зарплата Senior Developer в EU = EUR 80 000-140 000/год; remote работа = свобода выбора страны; постоянный рост спроса (дефицит 700 000 специалистов в Германии одной); РЕАЛИСТИЧНЫЕ СРОКИ: от нуля до первой работы = 12-24 мес (зависит от интенсивности); БЕСПЛАТНЫЕ ПУТИ: 1. CS50 (HARVARD): лучшее введение в Computer Science; бесплатно на edx.org; сертификат можно купить (необязательно); на русском дублирования нет; английский B2 = нужен; покрывает: C; Python; SQL; JavaScript; React; CS фундаментал; ~50-100 часов; 2. THE ODIN PROJECT: бесплатный curriculum от Junior до Fullstack Developer; JavaScript/Node/React; открытый исходный код; сообщество Discord; на английском; занимает 1-2 года при нормальном темпе; 3. FREECODECAMP.ORG: бесплатные сертификаты; 300+ часов на каждый; JavaScript; Python; Data Science; Machine Learning; SQL; качество хорошее; огромное сообщество; 4. JAVASCRIPT.INFO: лучший русскоязычный ресурс по JavaScript; бесплатно; 5. HEXLET: русскоязычный онлайн-bootcamp; базовый курс бесплатный; продвинутый = платный (~4 000-8 000 ₽/мес); 6. PYTHON FOR EVERYBODY (COURSERA; Michigan): бесплатно при аудите; Python; одна из самых популярных точек входа для новичков; 7. MISSING SEMESTER (MIT): утилиты разработчика (bash; vim; git; ssh; debuggers); бесплатно; критически важно для продуктивности; ПЛАТНЫЕ BOOTCAMP: YANDEX PRACTICUM: 6-10 мес; EUR 2 000-4 000; Python; JS; Java; гарантия трудоустройства (ограниченная); SKILLBOX: русскоязычный; широкий выбор; IRONHACK: международный bootcamp (Мадрид; Берлин; Лиссабон и др.); EN-язык; визовая помощь для переезда; 3-9 мес; EUR 8 000-14 000; TRIPLETEN (экс-Яндекс Практикум): EN-версия для US/EU; КАКОЙ СТЕК ВЫБРАТЬ ДЛЯ ПЕРВОЙ РАБОТЫ В 2026: FRONTEND: HTML/CSS/JavaScript → React или Vue.js; самый лёгкий вход; много вакансий; BACKEND PYTHON: Django или Flask; плюс PostgreSQL + REST API; BACKEND JAVASCRIPT (NODE.JS): Express + MongoDB или PostgreSQL; QA (ТЕСТИРОВАНИЕ): нет программирования; Selenium; Postman; Python + Playwright; САМЫЙ ЛЕГКИЙ ВХОД в IT; Data Analyst: Excel; SQL; Python; Tableau/Power BI; аналитическое мышление важнее кода; DevOps (ПОЗЖЕ): Docker; Kubernetes; Terraform; AWS/GCP/Azure; для начала не рекомендуется; ПОРТФОЛИО = КЛЮЧ К ПЕРВОЙ РАБОТЕ: GITHUB ПРОФИЛЬ: минимум 3-5 проектов с README; регулярные коммиты; КЛОНЫ ИЗВЕСТНЫХ ПРИЛОЖЕНИЙ: клон Netflix; Airbnb; Twitter — показывает что умеешь; РЕШЕНИЕ РЕАЛЬНЫХ ЗАДАЧ: построил калькулятор; парсер; бота; сайт-портфолио; TODO-APP НЕ БЕРУТ: слишком базово; нужны проекты с базой данных; авторизацией; API; LINKEDIN + GITHUB = ОБЯЗАТЕЛЬНО: рекрутеры смотрят в первую очередь; АЛГОРИТМЫ И LEETCODE: для работы в обычной компании: достаточно Easy/Medium LeetCode; для FAANG: Hard + системный дизайн; начинать с NeetCode Blind 75; ПЕРВАЯ РАБОТА: ДЖУНИОР-ГАРАНТИЯ НЕ БЫВАЕТ: первую работу ищут 3-12 мес; ПОИСК: linkedin.com/jobs; hh.ru (RU); djinni.co (Ukraine); nofluffjobs.com (EU); werk.nl (NL); ПРИМЕНЯЙ: 10-20 откликов в неделю; не жди идеального; СТАЖИРОВКИ (INTERNSHIP): иногда лучше первой работы — реальный опыт; УДАЛЁННАЯ РАБОТА + ПЕРЕЕЗД: После 1-2 лет опыта: рассматривай визы (Portugal D8; Estonia OY; Georgia IP); с опытом 3+ лет = EU Blue Card; Швеция Work Permit; Нидерланды Kennismigrant; СМЕНА СТРАНЫ + СМЕНА ПРОФЕССИИ: не пытайся делать одновременно; сначала работу в IT → потом переезд; OR сначала переезд (Грузия; Армения; Казахстан; EU-студент) → потом работу',
    content_md: `# Войти в IT с нуля в 2026: курсы, стек, портфолио, первая работа, переезд

Реалистичный путь: 12-24 месяца интенсивной учёбы → первая работа → 1-2 года опыта → EU Blue Card / DN Visa / переезд. Не пытайся менять страну и профессию одновременно.

---

## Лучшие бесплатные ресурсы

| Ресурс | Стек | Длительность |
|--------|------|-------------|
| **CS50 (Harvard)** | C; Python; SQL; JS; React | 50-100 ч |
| **The Odin Project** | JavaScript/Node/React fullstack | 1-2 года |
| freeCodeCamp.org | JS; Python; DS | 300+ ч/сертификат |
| JavaScript.info | JavaScript (RU) | Свой темп |
| Missing Semester (MIT) | bash; git; vim; ssh | 20-30 ч |

---

## Какой стек выбрать для первой работы

| Стек | Сложность | Вакансии |
|------|-----------|---------|
| Frontend (HTML/CSS/JS/React) | Низкая | Много |
| Backend Python (Django/Flask) | Средняя | Много |
| **QA-тестирование** | **Минимальная** | **Самый лёгкий вход** |
| Data Analyst (SQL/Excel/Python) | Низкая-средняя | Растёт |

---

## Портфолио — что нужно

- GitHub: 3-5 проектов с README + регулярные коммиты
- Клон Netflix/Airbnb/Twitter (с авторизацией + БД + API)
- Свой проект решающий реальную задачу
- TODO-app и калькуляторы — не берут в 2026

---

## Итого

Войти в IT с нуля 2026: CS50 → The Odin Project / freeCodeCamp → 3-5 GitHub-проектов → LinkedIn + 20 откликов/нед → первая работа за 3-12 мес; QA = самый лёгкий вход; после 1-2 лет опыта = Portugal D8 / Estonia Gold Card / Грузия ИП; не менять страну и профессию одновременно.
`,
  },
  {
    slug: 'italiya-milan-rim-it-2026',
    title: 'Италия Милан Рим IT 2026: Beckham Law Impatriati, 50% льгота, Luxottica, Ferrari tech',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Италия Милан Рим IT 2026 Impatriati 50% льгота Luxottica Ferrari tech жизнь',
    seo_description: 'Италия Милан Рим IT 2026 Impatriati 50% льгота Luxottica Ferrari Enel Tech pizza pasta: ИТАЛИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ИТАЛИЯ: IMPATRIATI: уникальная налоговая льгота для иностранцев; 50% освобождение от НДФЛ на 5 лет! КУЛЬТУРА: пицца; паста; Колизей; Везувий; Флоренция (Уффици; Давид; Дуомо); Венеция (каналы; гондолы; карнавал); ИСТОРИЯ: Древний Рим (753 до н.э. - 476 н.э.); Возрождение (Леонардо; Микеланджело; Рафаэль); объединение 1861; две мировые войны; Берлускони; Драги; EU с 1957 (основатель!); МОДА: Milano Fashion Week; Gucci; Prada; Versace; Armani; Dolce & Gabbana; СУПЕРКАРЫ: Ferrari; Lamborghini; Maserati; Alfa Romeo; Ducati; КУЛИНАРИЯ: пиццерии неаполитанские (UNESCO!); Parmigiano Reggiano; Prosciutto di Parma; Barolo; Brunello di Montalcino; мороженое gelato; тирамису; карбонара (ТОЛЬКО яйцо + гуанчиале + пекорино!); ПРИРОДА: Альпы; озеро Комо; Амальфитанское побережье; Сицилия; Сардиния; Доломиты; ВРЕМЕННАЯ ЗОНА: CET UTC+1/+2; EU; ВИЗЫ ИТАЛИЯ: EU-ГРАЖДАНЕ: свободно; НЕ-EU (РФ): 1. NATIONAL VISA (D) → PERMESSO DI SOGGIORNO: через работодателя или компанию; DECRETO FLUSSI: ежегодная квота на рабочие визы для non-EU (ограниченное число мест; публикуется в январе каждого года; очень конкурентно!); 2. SELF-EMPLOYED VISA: для фрилансеров; нужны клиенты в Италии или иностранный доход + подтверждение профессии; 3. STARTUP VISA ITALY: через Italia Startup Visa; нужен инновационный проект; 4. ARTIST/RESEARCHER VISA: для исследователей и деятелей искусства; IMPATRIATI (AGEVOLAZIONE): КЛЮЧЕВАЯ ЛЬГОТА; СУТЬ: приехавшие работать в Италию освобождаются от НДФЛ на 50% дохода; СТАВКА С ЛЬГОТОЙ: при доходе EUR 60 000/год → платишь налог только с EUR 30 000 = эффективная ставка снижается с ~32% до ~16%; СРОК: 5 лет; ПРОДЛЕНИЕ: ещё 5 лет если купил недвижимость или есть ребёнок; УСЛОВИЕ: не был налоговым резидентом Италии последние 2 года (ранее 5 лет; ослабили); ПМЖ: через 5 лет легального пребывания; ГРАЖДАНСТВО: через 10 лет (долго!); через брак с итальянским гражданином: 2 года; через итальянского предка (jure sanguinis): можно без срока проживания (если предок был итальянским гражданином до иммиграции)!; двойное: разрешено!; паспорт Италии: 190 стран; РЫНОК IT ИТАЛИЯ: LUXOTTICA ($17B; очки; Ray-Ban; Oakley; EssilorLuxottica #1 оптика мира); ENEL (электроэнергетика; крупнейшая EU; digital transformation; renewables AI); ENI (нефть; tech); FIAT CHRYSLER / STELLANTIS (automotive; tech); FERRARI (supercar + tech; Ferrari Software Division); MEDIOBANCA (fintech); PIRELLI (шины + digital; Formula 1); SIEMENS Italy; GE Healthcare Italy; FERRERO TECH (Nutella + digital supply chain); ZUCCHETTI ($600M; ERP; HR); ENGINEERING ($600M; IT-услуги для банков и госструктур); ЗАРПЛАТЫ IT ИТАЛИЯ (GROSS EUR): МИЛАН: Junior: EUR 25 000-40 000/год; Middle: EUR 40 000-65 000; Senior: EUR 65 000-100 000; РИМ: Junior: EUR 22 000-35 000; Senior: EUR 55 000-90 000; НИЖЕ ДРУГИХ EU: Италия ≠ DE; NL; CH; IE; но с Impatriati = сопоставимо чисто; НАЛОГИ ИТАЛИЯ: НДФЛ (IRPEF): 23% до EUR 28 000/год; 35% до EUR 50 000; 43% свыше; Regione + Comune: ~3%; WITHOUT IMPATRIATI: при EUR 60 000 gross = ~33% eff; WITH IMPATRIATI: при EUR 60 000 gross → облагается EUR 30 000 → ~14% eff!; СТОИМОСТЬ ЖИЗНИ ИТАЛИЯ 2026: МИЛАН: АРЕНДА: 2-комн Navigli; Porta Venezia; Isola: EUR 1 600-2 800/мес; 2-комн Dergano; Sesto San Giovanni: EUR 1 100-1 800; РИМ: 2-комн Trastevere; Pigneto: EUR 1 200-2 200; 2-комн дальше: EUR 900-1 600; ФЛОРЕНЦИЯ: 2-комн EUR 1 000-1 800; НАПОЛЬ (ДЕШЕВЛЕ!): 2-комн: EUR 500-900; ПРОДУКТЫ: margherita pizza (Неаполь; UNESCO!): EUR 5-12; pasta carbonara (оригинальная): EUR 10-18; gelato: EUR 2-4/шарик; cappuccino: EUR 1.20-1.80 (at bar стоя!); продукты Esselunga; Carrefour: EUR 350-600/мес; ТРАНСПОРТ: ATM (Милан); ATAC (Рим): EUR 2/поездка; месячный: EUR 39 (Милан!); Trenitalia (поезда); Italo (частный; быстрее); КЛИМАТ: разный; Милан: 4 сезона; зима -2-5; лето +32-38 (влажный); Рим: Mediterranean; зима +8-15; лето +35; Юг: настоящий Mediterranean; жарко',
    content_md: `# Италия Милан Рим IT 2026: Impatriati 50% льгота, Luxottica $17B, Ferrari, pasta

Италия — Impatriati: 50% освобождение от НДФЛ на 5 лет (эффективная ставка ~14% вместо 33%). Luxottica ($17B), Enel (крупнейший EU), Ferrari tech. Пицца Неаполь (UNESCO!). Jure sanguinis: гражданство через итальянского предка без срока проживания.

---

## Impatriati — налоговая льгота

| Параметр | Значение |
|---------|---------|
| Суть | 50% дохода освобождено от НДФЛ |
| Срок | 5 лет; +5 лет при недвижимости/ребёнке |
| Эффект | EUR 60k gross: эффективная ставка ~14% (vs 33% без льготы) |
| Условие | Не был резидентом Италии 2+ лет |
| Двойное | Разрешено |

---

## Особые пути к гражданству

| Путь | Срок |
|------|------|
| Обычный | 10 лет легального проживания |
| Через брак | 2 года |
| **Jure sanguinis** | **Без срока (если предок — итальянский гражданин до иммиграции)** |

---

## Стоимость жизни

| Город | Аренда 2-комн EUR/мес | Особенность |
|-------|--------------------|----------|
| Милан центр | €1 600-2 800 | Мода; финансы; метро €39/мес |
| Рим | €1 200-2 200 | Вечный город; туризм |
| **Неаполь** | **€500-900** | **Пицца UNESCO; самый дешёвый север** |

---

## Итого

Италия IT 2026: Impatriati 50% НДФЛ-льгота (5 лет; eff rate ~14%); Luxottica ($17B; Ray-Ban; #1 мировая оптика); Ferrari tech division; пицца Неаполь UNESCO; cappuccino стоя EUR 1.20-1.80; gelato EUR 2-4; jure sanguinis (итальянский предок = гражданство без проживания!); Decreto Flussi = ограниченные квоты для non-EU; гражданство 10 лет (долго).
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
console.log(`\nБатч 232: ${ok} OK, ${err} ошибок`);

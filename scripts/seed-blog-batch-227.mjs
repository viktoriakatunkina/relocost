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
    slug: 'estoniya-tallinn-e-residency-it-2026',
    title: 'Эстония Таллин e-Residency IT 2026: цифровое ОУ, Transferwise, Pipedrive, Skype, жизнь',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Эстония Таллин e-Residency IT 2026 цифровое ОУ Transferwise Pipedrive Skype жизнь',
    seo_description: 'Эстония e-Residency IT 2026 Таллин Pipedrive Skype Bolt Wise EU паспорт цифровое ОУ: ЭСТОНИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ЭСТОНИЯ: САМАЯ ЦИФРОВАЯ СТРАНА В МИРЕ: 99% госуслуг онлайн; X-Road (цифровая инфраструктура); e-Voting (с 2005!); e-Tax; e-Prescription; e-Ambulance; E-RESIDENCY: уникальная программа; цифровое удостоверение ЕС; открыть эстонское OY (компанию) онлайн из любой точки мира; UNICORN FACTORY: Skype (Microsoft $8.5B); Wise (Лондон-Таллин; $9B; экс-TransferWise); Bolt ($8B; Uber-конкурент); Pipedrive ($1.5B; CRM; Vista Equity); Taxify; ZeroTurnaround; Veriff ($1.5B); Guardtime; Nortal; ИСТОРИЯ: Тевтонские рыцари; Ганзейский союз; российская империя; советский период; независимость 1991 (пением!); Певческая революция; СРЕДНЕВЕКОВЫЙ ТАЛЛИН: UNESCO-статус; башни; городская стена 14 века; ратуша; Toompea (Вышгород); Raekoja Plats; Alexander Nevsky Cathedral; ПРИРОДА: Лахемаа (нацпарк; болота; леса); острова (Сааремаа; Хийумаа); 4 сезона; зима -5-15; ЯЗЫКИ: эстонский (финно-угорская группа; близок к финскому; далёк от IE языков); русский: 30% населения говорит (особенно Нарва; Таллин-Ласнамяэ); ВРЕМЕННАЯ ЗОНА: EET UTC+2/+3; ВИЗЫ ЭСТОНИЯ: EU-ГРАЖДАНСТВО: свободный въезд; EU EU EU; НЕ-EU (РФ): 1. D-VISA (ДОЛГОСРОЧНАЯ; для работы): через работодателя-спонсора; 2. STARTUP VISA: для предпринимателей со скалируемым бизнесом; через Estonian Startup Committee; 3. EMPLOYEE VISA через recognized company (startup; tech): через Startup Estonia; ПМЖ: через 5 лет; ГРАЖДАНСТВО: через 5 лет ПМЖ; знание эстонского языка A2 (низкий порог!); двойное: НЕ допускается (выходить из РФ-гражданства); паспорт Эстонии: 188 стран; E-RESIDENCY (КЛЮЧЕВАЯ ОСОБЕННОСТЬ): НЕ ВНЖ; НЕ право жить в Эстонии; НЕ право работать в EU; это: цифровой идентификатор для открытия и управления эстонской компанией (ОУ); регистрация ОУ онлайн: EUR 165 + нотариус; государственные пошлины; бухгалтерия; налоги через e-Residency; VAT-регистрация; банковский счёт (Wise Business; LHV; Swedbank); НАЛОГИ ЭСТОНСКОЙ OY (OU): корпоративный налог: 0% на реинвестированную прибыль; 20% только при выплате дивидендов; одна из самых инновационных налоговых систем в мире; ПРАКТИКА: Remote-разработчик из любой страны открывает эстонское ОУ через e-Residency; выставляет счета клиентам из EU/US; деньги идут в ОУ; корп налог 0%; при выплате себе дивидендов = 20%; + налог страны проживания; РЫНОК IT ЭСТОНИЯ: BOLT ($8B; Uber-конкурент в EU; 40M+ пользователей; основатель Markus Villig); WISE ($9B; LSE; ex-TransferWise; мировой стандарт денежных переводов); PIPEDRIVE ($1.5B; Vista Equity; CRM для малого бизнеса); VERIFF ($1.5B; AI identity verification; Sequoia); GUARDTIME (blockchain для госуслуг); SKYPE (основан в Таллине 2003; Microsoft $8.5B 2011); NORTAL (digital transformation; govtech); TRANSFERWISE основатели Taavet Hinrikus и Kristo Kaarmann = первый эстонский unicorn; ЗАРПЛАТЫ IT ЭСТОНИЯ (GROSS EUR): LOCAL: Junior: EUR 1 500-2 500/мес; Middle: EUR 2 500-4 000; Senior: EUR 4 000-8 000; BOLT Senior: EUR 5 000-10 000; REMOTE: $4 000-15 000; НАЛОГИ ЭСТОНИЯ (ФИЗЛИЦО): НДФЛ: 20% flat (одна из нижайших в EU); Социальное страхование: 2.4% (работник); работодатель: 33% social tax; Обязательная накопительная пенсия: 2%; фактически для Remote через ОУ: при выплате дивидендов: 20% корп + личный доход может облагаться в стране фактического проживания; СТОИМОСТЬ ЖИЗНИ ЭСТОНИЯ 2026: ТАЛЛИН: АРЕНДА: 2-комн Kalamaja; Kadriorg; Kristiine: EUR 900-1 600/мес; 2-комн Lasnamae (русскоязычный; дешевле): EUR 600-1 000; ТАРТУ (студенческий второй город): 2-комн: EUR 600-1 000; ПРОДУКТЫ: rukkileib (ржаной хлеб; национальная традиция): EUR 1-2/кг; kohuke (творожная глазированная сырок; национальная закуска): EUR 0.50-1; kama (ферментированная мука + кисломолочное; традиционный завтрак); маринованная селёдка; рынок Balti Jaam: EUR 300-500/мес; ТРАНСПОРТ: Таллин = бесплатный автобус для резидентов города (с 2013!); велосипед распространен; КЛИМАТ: 4 сезона; зима -5 до -15 (снег; лед; темнота 17:00); лето до +30; белые ночи (июнь-июль); БЕЗОПАСНОСТЬ: ОЧЕНЬ БЕЗОПАСНО; НАТО-член с 2004',
    content_md: `# Эстония Таллин e-Residency IT 2026: цифровое ОУ, Bolt $8B, Wise, 0% корп налог

Эстония — самая цифровая страна в мире. e-Residency: открыть EU компанию онлайн из любой точки мира. Корп налог ОУ: 0% на реинвестированную прибыль. Bolt ($8B), Wise ($9B), Pipedrive ($1.5B), Skype (основан в Таллине). EU паспорт через 10 лет.

---

## e-Residency — в чём суть

| Что это | Что не это |
|---------|-----------|
| Цифровой идентификатор EU | Не ВНЖ |
| Право открыть эстонскую OY онлайн | Не право жить в EU |
| Выставлять EU-счета; VAT-регистрация | Не EU-гражданство |
| Регистрация: EUR 165 | — |

---

## Налоги эстонского ОУ

| Событие | Налог |
|---------|------|
| Прибыль в ОУ (реинвестирование) | **0%** |
| Выплата дивидендов себе | 20% |

---

## IT-единороги из Эстонии

| Компания | Оценка | Профиль |
|---------|--------|---------|
| **Bolt** | **$8B** | Uber-конкурент в EU; 40M+ пользователей |
| **Wise** | **$9B (LSE)** | Денежные переводы; экс-TransferWise |
| Pipedrive | $1.5B | CRM; Vista Equity |
| Veriff | $1.5B | AI identity verification |

---

## Итого

Эстония e-Residency IT 2026: e-Residency для EU OY (0% корп на реинвест); Bolt ($8B); Wise ($9B); Pipedrive; Veriff; 99% госуслуг онлайн; средневековый Таллин UNESCO; бесплатный автобус для резидентов города; EU паспорт через 10 лет (двойное не допускается); рабочая виза через работодателя или Startup Visa; эстонский язык A2 для гражданства (низкий порог).
`,
  },
  {
    slug: 'kak-nayti-rabotu-v-it-za-rubezhom-2026',
    title: 'Как найти работу в IT за рубежом 2026: LinkedIn, Glassdoor, VisaJobs, Cover Letter',
    tag: 'переезд',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как найти работу в IT за рубежом 2026 LinkedIn Glassdoor VisaJobs Cover Letter',
    seo_description: 'Найти работу IT за рубежом 2026 LinkedIn Glassdoor VisaJobs резюме Cover Letter: КАК НАЙТИ РАБОТУ В IT ЗА РУБЕЖОМ 2026 — ПРАКТИЧЕСКИЙ ГАЙД: ПЛАТФОРМЫ ДЛЯ ПОИСКА: LINKEDIN: главная платформа для международного IT; оптимизируй профиль под ключевые слова (python; react; backend; frontend; devops; machine learning); #OpenToWork; Easy Apply; искать по: Software Engineer; Backend; Frontend; Full Stack; DevOps; ML Engineer; Data Engineer; Data Scientist; фильтр: On-site; Remote; Hybrid; GLASSDOOR: отзывы о компаниях; анонимные зарплаты (самый честный источник); INDEED: общая платформа; много вакансий; OTTA: специализируется на стартапах EU/UK; отличный фильтр; RELOCATE.ME: специально для переезда; с информацией о спонсорстве визы; ANGEL.CO (Wellfound): стартапы; много US/EU удалёнки; HIRED: curated; для опытных; TOPTAL; UPWORK; X-TEAM: топовый удалённый фриланс; VISAJOBS: агрегатор вакансий с визовым спонсорством; STACKOVERFLOW JOBS; GitHub Jobs: техническая аудитория; СПЕЦИФИКА ПО СТРАНАМ: ГЕРМАНИЯ: Xing (немецкий аналог LinkedIn; обязателен для Германии); Stepstone; Jobbr; Indeed.de; НИДЕРЛАНДЫ: LinkedIn главный; Werkzoeken; ШВЕЙЦАРИЯ: jobs.ch; jobup.ch; LinkedIn; ИРЛАНДИЯ: irishjobs.ie; IrishTech.jobs; LinkedIn; ПОРТУГАЛИЯ: net-empregos.com; LinkedIn; ИСПАНИЯ: InfoJobs; LinkedIn; ИЗРАИЛЬ: Jobmaster; NExtra; LinkedIn; KAK PRAVILNO SOSTAVIT REZYUME: ФОРМАТ: 1 страница для до 5 лет опыта; 2 страницы для 5+ лет; PDF; без фото (в большинстве западных стран); ATS-FRIENDLY: Applicant Tracking System сканирует резюме; используй ключевые слова из описания вакансии; СТРУКТУРА: Contact Info (email; LinkedIn; GitHub; Portfolio); Professional Summary (2-3 строки WHO ARE YOU); Work Experience (обратный хронологический; буллеты с глаголами действия — Led; Built; Improved; Reduced; Increased — с ЧИСЛАМИ: Improved API performance by 40%; Reduced deployment time from 2 hours to 15 minutes; Led team of 5 engineers); Education; Skills (Languages; Frameworks; Databases; Cloud); Projects (если junior — очень важно); Open Source (если есть — большой плюс); ENGLISH: резюме ТОЛЬКО на английском для международных вакансий; грамматика = critical (Grammarly; Hemingway); COVER LETTER: кратко (3 параграфа); зачем ты интересен ИМЕННО ЭТОЙ компании (исследуй!); что ты решаешь; почему хочешь переехать в эту страну; СПОНСОРСТВО ВИЗЫ: важно: явно спрашивать/указывать need visa sponsorship; НЕКОТОРЫЕ КОМПАНИИ НЕ СПОНСИРУЮТ: читай описание (We do not sponsor work visas = пропускай); КРУПНЫЕ КОМПАНИИ КОТОРЫЕ СПОНСИРУЮТ: Google; Microsoft; Amazon; Meta; Booking.com; ASML; SAP; Stripe; Revolut; Delivery Hero; Zalando; CHECK24; Spotify; Klarna; ИНТЕРВЬЮ В МЕЖДУНАРОДНЫХ IT: CODING INTERVIEW: LeetCode (Easy/Medium для большинства; Hard для FAANG); HackerRank; NeetCode; Blind 75 список; SYSTEM DESIGN: Grokking System Design; Alex Xu System Design Interview vol.1+2; ByteByteGo; BEHAVIORAL (STAR-метод): Situation; Task; Action; Result; FAANG-PREP: total comp = base + RSU (акции) + bonus; Levels.fyi = реальные компенсации; Glassdoor = отзывы о процессе; TIP: тайм-зоны; договорись о времени удобном для обеих сторон; НЕТВОРКИНГ = ТОЖЕ ВАЖЕН: LinkedIn connections → cold outreach → referral = в 3x больше шансов пройти; "я видел твой пост про [тема]; я тоже занимался [схожая задача]; могу ли я задать вопрос о вакансии?"; конференции; митапы; русскоязычные tech-сообщества в стране назначения; ОЖИДАЕМЫЕ СРОКИ: отклики → первый отклик: 1-4 нед; полный цикл интервью: 2-8 нед; до оффера: 1-3 мес; от оффера до визы: 1-6 мес (зависит от страны); ИТОГО ОТ СТАРТА ДО ПЕРЕЕЗДА: 3-12 месяцев',
    content_md: `# Как найти работу в IT за рубежом 2026: LinkedIn, платформы, интервью, виза

Путь: выбрать страну → оптимизировать LinkedIn → откликнуться 50+ вакансий → пройти интервью (Leetcode + System Design) → получить оффер → дождаться визы. Полный цикл: 3-12 месяцев.

---

## Платформы для поиска

| Платформа | Специализация |
|-----------|--------------|
| **LinkedIn** | Главная; Easy Apply; фильтр визы |
| **Otta** | Стартапы EU/UK; лучший фильтр |
| **Relocate.me** | Специально для переезда; с визой |
| Glassdoor | Анонимные зарплаты; отзывы |
| Wellfound (Angel.co) | Стартапы; удалёнка |
| VisaJobs | Агрегатор с визовым спонсорством |
| Xing (Германия) | Немецкий LinkedIn; обязателен для DE |

---

## ATS-резюме — ключевые правила

- 1 страница (до 5 лет опыта); 2 страницы (5+ лет)
- PDF; без фото (большинство западных стран)
- Буллеты с глаголами + числа: "Reduced deployment time from 2h to 15min"
- Ключевые слова из описания вакансии (ATS сканирует)
- GitHub/Portfolio — ссылка обязательна

---

## Интервью — что готовить

| Этап | Ресурс |
|------|--------|
| Coding | LeetCode; NeetCode Blind 75 |
| System Design | Alex Xu; ByteByteGo |
| Behavioral | STAR-метод (Situation/Task/Action/Result) |

---

## Компании, которые спонсируют визы

Google; Microsoft; Amazon; Meta; Booking.com; ASML; SAP; Stripe; Revolut; Delivery Hero; Zalando; Spotify; Klarna.

---

## Итого

Поиск IT-работы за рубежом 2026: LinkedIn + Otta + Relocate.me + Glassdoor; ATS-резюме с числами ("40% faster"); LeetCode Medium; System Design; явно указывай "need visa sponsorship"; нетворкинг = 3x больше шансов на оффер; полный цикл от старта до переезда = 3-12 месяцев.
`,
  },
  {
    slug: 'avstriya-vena-grats-it-2026',
    title: 'Австрия Вена Грац IT 2026: Red-White-Red Card, Wiener Schnitzel, Opera, Alps, жизнь',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Австрия Вена Грац IT 2026 Red White Red Card Wiener Schnitzel Opera Alps жизнь',
    seo_description: 'Австрия Вена Грац IT 2026 Red White Red Card Wiener Schnitzel Opera Alps жизнь: АВСТРИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ АВСТРИЯ: КАЧЕСТВО ЖИЗНИ: Вена = стабильно #1-2 в мире по качеству жизни (Mercer; The Economist); КУЛЬТУРА: Моцарт (Зальцбург); Бетховен (Вена); Opera (Wiener Staatsoper); Kunsthistorisches Museum; Musikverein; Бальный сезон (Венский Бал); Штрудели и шницели; Sachertorte; ИСТОРИЯ: Священная Римская Империя; Габсбурги (600 лет!); Австро-Венгрия; WWI конец; EU с 1995; SCHENGEN; ALPS: горнолыжные курорты мирового класса (Ischgl; Sölden; Kitzbühel; Mayrhofen; Schladming; Zell am See); Hallstatt (UNESCO; самое фотографируемое место Австрии); ЯЗЫКИ: австрийский немецкий (диалекты сильно отличаются от стандартного немецкого!); English в IT-сфере достаточен; ВРЕМЕННАЯ ЗОНА: CET UTC+1/+2; идеально EU-remote; БЕЗОПАСНОСТЬ: очень безопасно; Global Peace Index #4 (2023); ВИЗЫ АВСТРИЯ: 1. RED-WHITE-RED CARD (ROT-WEISS-ROT KARTE; RWR): балльная система для квалифицированных специалистов; ДЕФИЦИТНЫЕ СПЕЦИАЛЬНОСТИ (Shortage Occupations; MSOT): IT-разработчики = в списке!; для shortage: меньше баллов нужно; для других специальностей: нужно 55+ баллов из 100; КРИТЕРИИ БАЛЛОВ: образование (до 20 баллов); языки (немецкий/английский; до 10 баллов); опыт работы (до 10 баллов); возраст (до 15 баллов); зарплата (минимум EUR 37 125/год для квалифицированных рабочих); ВНЖ: 2 года; RED-WHITE-RED CARD PLUS: продление; после 2 лет; больше прав; ПМЖ (NIEDERLASSUNGSBEWILLIGUNG): через 5 лет; ГРАЖДАНСТВО: через 6 лет легального пребывания (при знании немецкого); двойное: НЕ допускается (выходить из РФ гражданства); паспорт Австрии: 188 стран; 2. EU BLUE CARD: альтернатива; EUR 49 518+/год gross; 3. JOBSEEKER VISA: поиск работы 6 месяцев (нужна квалификация); РЫНОК IT АВСТРИЯ: AVL LIST (крупнейший независимый R&D для автодвигателей; Грац); DATAHOUSE; DYNATRACE ($15B; APM-лидер; Линц; NYSE DT!); VIRTUALMINDS; RUNTASTIC (Adidas $240M; fitness app); WILLHABEN (classifieds; крупнейший Австрия); RAIFFEISEN BANK TECH; Erste Bank Digital; OMV TECH; VERBUND (энергетика); AIT (Austrian Institute of Technology); KEBA (автоматизация; EV charging); ЗНАМЕНИТЫЕ АВСТРИЙЦЫ: Арнольд Шварценеггер; Falco (Rock Me Amadeus); Red Bull (Матешиц; австриец!); GOOGLE (есть офис); SAP Австрия; ЗАРПЛАТЫ IT АВСТРИЯ (GROSS EUR): Junior: EUR 35 000-50 000/год; Middle: EUR 50 000-75 000; Senior: EUR 75 000-110 000; DYNATRACE Senior: EUR 80 000-130 000; НАЛОГИ АВСТРИЯ: НДФЛ: 0% до EUR 12 816; 20% до EUR 20 818; 30% до EUR 34 513; 40% до EUR 66 612; 48% до EUR 99 266; 50% свыше; + дополнительная ставка 55% для очень высоких доходов; Sozialversicherung: ~18.12% работник; при EUR 80 000: эффективная ставка ~35-40%; СТОИМОСТЬ ЖИЗНИ АВСТРИЯ 2026: ВЕНА: АРЕНДА: 2-комн Innere Stadt; Leopoldstadt (центр): EUR 1 500-2 500/мес; 2-комн Favoriten; Simmering; Floridsdorf (outer): EUR 900-1 500; ГРАЦ (ВТОРОЙ ГОРОД; AVL; TU Graz): 2-комн: EUR 800-1 400; на 30-40% дешевле Вены; ЗАЛЬЦБУРГ (Моцарт): 2-комн: EUR 900-1 600; ЛИНЦ (DYNATRACE): 2-комн: EUR 750-1 300; ПРОДУКТЫ: Wiener Schnitzel (телятина в панировке; национальное блюдо): EUR 15-25 в ресторане; Tafelspitz (варёная говядина с хреном): EUR 18-28; Marillenknödel (абрикосовые клёцки); Sachertorte (шоколадный торт): EUR 6-10/порция; кофе Melange (венский): EUR 3-5; рынок Naschmarkt Вена: EUR 300-600/мес; ТРАНСПОРТ: Wien Linien (U-Bahn; Strassenbahn; Bus): EUR 2.20/поездка; Jahreskarte (годовой): EUR 365 (1 EUR в день!); КЛИМАТ: 4 сезона; умеренный; Вена: зима -2-5 (снег); лето +25-32; ветер Fohen; горнолыжный сезон: декабрь-март',
    content_md: `# Австрия Вена Грац IT 2026: Red-White-Red Card, Dynatrace $15B, Alps, #1 Quality of Life

Австрия — Вена стабильно #1-2 по качеству жизни в мире. Red-White-Red Card для IT (дефицитная специальность). Dynatrace ($15B, NYSE). Горнолыжные курорты мирового класса. Sachertorte. Wiener Schnitzel. EU паспорт через 6 лет.

---

## Red-White-Red Card для IT

| Параметр | Значение |
|---------|---------|
| IT = дефицитная специальность | Упрощённые требования по баллам |
| Минимальная зарплата | EUR 37 125/год |
| ВНЖ | 2 года → RWR+ → ПМЖ через 5 лет |
| Гражданство | 6 лет + знание немецкого |
| Двойное | Не допускается |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| **Dynatrace** | **$15B (NYSE DT); APM; Линц** |
| AVL List | Крупнейший независимый R&D двигателей; Грац |
| Red Bull | Австрийский; tech-маркетинг |
| Willhaben | Крупнейший Австрия classifieds |

---

## Стоимость жизни

| Город | Аренда 2-комн EUR/мес | Особенность |
|-------|--------------------|----------|
| Вена центр | €1 500-2 500 | Опера; Наschmarkt; культура |
| Вена пригород | €900-1 500 | Jahresticket €365 (€1/день) |
| **Грац** | **€800-1 400** | **AVL; TU Graz; -35% vs Вена** |
| Линц | €750-1 300 | Dynatrace HQ; дешевле всего |

---

## Итого

Австрия IT 2026: Вена #1-2 Quality of Life; Red-White-Red Card для IT (дефицит); Dynatrace ($15B NYSE); Wiener Jahresticket EUR 365 (EUR 1/день!); Alps (Ischgl; Kitzbühel; Hallstatt); Sachertorte; Melange-кофе; Ernst Mach (физика); Шварценеггер; паспорт 188 стран; двойное гражданство не допускается; НДФЛ до 55% для высоких доходов; Грац на 35% дешевле Вены.
`,
  },
  {
    slug: 'ispaniya-barselona-madrid-it-2026',
    title: 'Испания Барселона Мадрид IT 2026: Digital Nomad Visa, Cabify, Glovo, Beckham Law',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Испания Барселона Мадрид IT 2026 Digital Nomad Visa Cabify Glovo Beckham Law',
    seo_description: 'Испания Барселона Мадрид IT 2026 Digital Nomad Visa Cabify Glovo Beckham Law жизнь: ИСПАНИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ИСПАНИЯ: КЛИМАТ: 300+ солнечных дней в Мадриде; средиземноморье (Барселона; Валенсия; Малага); сиеста; terrazas; КУЛЬТУРА: Гауди (Sagrada Familia; Park Guell; La Pedrera; Casa Batllo); Дали; Пикассо; Сервантес; Flamenco; Corrida (спорно); FC Barcelona; Real Madrid; ИСТОРИЯ: Reyes Católicos; Колумб; Конкиста; Золотой Век; Франко; демократия 1978; EU 1986; ПРИРОДА: Канарские острова (Тенерифе; Гран Канария; 20+ гр зимой!); Балеарские острова (Майорка; Ибица); Пиренеи; Пресост де Эль (горы); ГОРОДА: Барселона (Каталония; Gaudi; море; горы; атмосфера); Мадрид (столица; Reina Sofia; Prado; ночная жизнь); Валенсия (Valencia CF; Paella; El Cid; дешевле Бары/Мадрида); Малага (Costa del Sol; Пикассо; экспаты); Сан-Себастьян (ТОПОВАЯ ГАСТРОНОМИЯ; пинтос); ВРЕМЕННАЯ ЗОНА: CET UTC+1/+2; идеально EU; ВИЗЫ ИСПАНИЯ: 1. DIGITAL NOMAD VISA (DNV): испанская DN-виза; с 2023; для удалённых работников; УСЛОВИЯ: доход минимум 2 334 EUR/мес (200% SMI = минимальная зарплата); работа для иностранных компаний (не испанских!); медстраховка; чистая уголовка; жильё; СРОК: 1 год → продляется 2 года → ПМЖ через 5 лет; НАЛОГ ДЛЯ DNV: 24% flat (Beckham Law режим!); вместо прогрессивного НДФЛ до 47%!; Beckham Law: специальный налоговый режим для иностранцев; срок: 6 лет; ПРИМЕНЯЕТСЯ НА ПЕРВЫЕ EUR 600 000: 24%; свыше EUR 600 000: 47%; 2. EU BLUE CARD: для работников в испанских компаниях; EUR 37 000-41 000+/год; 3. STARTUP LAW (LEY DE STARTUPS; 2023): упрощение для стартапов; стартап-виза; ПМЖ: через 5 лет легального проживания; ГРАЖДАНСТВО: через 10 лет (одно из самых длинных в EU!); ИСКЛЮЧЕНИЕ: Латинская Америка; Филиппины; Португалия = 2 года!; двойное: не допускается по умолчанию (исключения для ряда стран); паспорт Испании: 190 стран; РЫНОК IT ИСПАНИЯ: GLOVO ($2.5B; доставка еды; Барселона; Delivery Hero); CABIFY ($1.4B; ride-hailing; Мадрид; конкурент Uber); TYPEFORM ($1B; онлайн-формы; Барселона); FACTORIAL ($1B; HR-tech; Барселона); WALLAPOP ($1B; C2C marketplace; Барселона); IDEALISTA (proptech; крупнейший рынок недвижимости Испании); SCALEPAD; FLYWIRE ($1B; payment; Барселона); MANGO TECH (fashion tech); AMAZON SPAIN; GOOGLE SPAIN (офис); ЗАРПЛАТЫ IT ИСПАНИЯ (GROSS EUR): БАРСЕЛОНА/МАДРИД: Junior: EUR 25 000-40 000/год; Middle: EUR 40 000-65 000; Senior: EUR 65 000-100 000; GLOVO/FACTORIAL Senior: EUR 70 000-110 000; НИЖЕ EU в среднем: Испания = не самые высокие зарплаты в EU; НАЛОГИ ИСПАНИЯ: Стандарт НДФЛ (IRPF): 19% до EUR 12 450; 24% до EUR 20 200; 30% до EUR 35 200; 37% до EUR 60 000; 45% до EUR 300 000; 47% свыше; BECKHAM LAW (с DNV): 24% flat первые 6 лет; AUTONOMO (самозанятый; ИП): взносы Seguridad Social: EUR 294/мес (flat 2023-2025 для начинающих); IRPF 15-30% на прибыль; СТОИМОСТЬ ЖИЗНИ ИСПАНИЯ 2026: БАРСЕЛОНА (ДОРОГОЙ): АРЕНДА: 2-комн Eixample; Gracia; Poblenou: EUR 1 400-2 500/мес; 2-комн дальше (Les Corts; Nou Barris): EUR 1 000-1 800; МАДРИД: 2-комн Malasana; Chueca; Lavapies: EUR 1 200-2 000; 2-комн Carabanchel; Vallecas: EUR 800-1 400; ВАЛЕНСИЯ (ДЕШЕВЛЕ): 2-комн EUR 800-1 500; МАЛАГА (EXPAT HUB): 2-комн EUR 700-1 300; ПРОДУКТЫ: bocadillo (бутерброд): EUR 3-6; Menu del dia (бизнес-ланч 3 блюда + вино + кофе): EUR 10-16; tapas + cana (пинта пива): EUR 2-4 каждый; paella валенсийская (в Валенсии): EUR 12-18; рынок La Boqueria (Барселона): EUR 300-600/мес; ТРАНСПОРТ: Metro + Bus: EUR 1.40-2.60; TMB (Барселона) abono; Metro Madrid abono; Cercanias (пригородные): из EUR 20/мес; КЛИМАТ: разный; Барселона: средиземноморский; Мадрид: континентальный (зима холоднее; лето жарче); Малага: самый тёплый материковый город Испании; Канары: +20 зимой',
    content_md: `# Испания Барселона Мадрид IT 2026: DNV, Beckham Law 24%, Glovo, Gaudí

Испания — Digital Nomad Visa с 2023 (EUR 2 334/мес нетто). Beckham Law: 24% flat вместо 47% стандартного НДФЛ (6 лет). Glovo ($2.5B), Cabify ($1.4B), Factorial ($1B). Барселона = Gaudí + море + горы. Малага — самый дешёвый expat-хаб.

---

## Digital Nomad Visa

| Параметр | Значение |
|---------|---------|
| Минимальный доход | EUR 2 334/мес нетто |
| Условие | Работа на иностранные компании |
| Налог (Beckham Law) | **24% flat (6 лет)** vs 47% стандарт |
| Срок | 1 год → 2 года → ПМЖ через 5 лет |
| Гражданство | 10 лет (длинное в EU!) |

---

## IT-единороги

| Компания | Оценка | Профиль |
|---------|--------|---------|
| Glovo | $2.5B | Доставка еды; Барселона |
| Cabify | $1.4B | Ride-hailing; Мадрид |
| Factorial | $1B | HR-tech; Барселона |
| Typeform | $1B | Онлайн-формы; Барселона |

---

## Стоимость жизни

| Город | Аренда 2-комн EUR/мес | Особенность |
|-------|--------------------|----------|
| Барселона центр | €1 400-2 500 | Жилищный кризис; Gaudí |
| Мадрид центр | €1 200-2 000 | Столица; музеи; ночная жизнь |
| **Малага** | **€700-1 300** | **Тепло круглый год; экспат-хаб** |
| Валенсия | €800-1 500 | Paella; дешевле; море |

---

## Итого

Испания IT 2026: Digital Nomad Visa (EUR 2 334+/мес); Beckham Law 24% flat 6 лет; Glovo ($2.5B); Cabify; Factorial; Gaudí Sagrada Familia; Барселона море + горы + архитектура; Menu del dia EUR 10-16 (3 блюда + вино + кофе!); Малага = экспат-хаб (тепло; дёшево; Пикассо); гражданство 10 лет (долго); паella в Валенсии EUR 12-18.
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
console.log(`\nБатч 227: ${ok} OK, ${err} ошибок`);

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
    slug: 'rumyniya-bukharest-kluzh-it-pereezd-2026',
    title: 'Румыния Бухарест Клуж IT 2026: НДФЛ 10%, льгота IT 0%, UiPath, EU, зарплаты',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Румыния Бухарест Клуж IT 2026 НДФЛ 10% льгота IT 0% UiPath EU зарплаты: РУМЫНИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ РУМЫНИЯ: EU-СТРАНА С НДФЛ 10% ПЛОСКИМ (один из самых низких в EU); ЛЬГОТА ДЛЯ IT-СПЕЦИАЛИСТОВ: 0% НДФЛ для software developers (до определённого порога дохода; зарплата до RON 10 000/мес = полностью освобождена от НДФЛ!); UIPATH ($35B на пике; $7B оценка 2026; RPA-автоматизация; основана в Бухаресте 2005); ДЁШЕВО по EU-меркам; аренда 2-комн Бухарест: EUR 400-700 (vs Варшава EUR 700-1 200); Cluj-Napoca (Клуж-Напока) = Silicon Valley Румынии; ВИЗЫ РУМЫНИЯ: 1. EU BLUE CARD: salary minimum EUR 30 000/год; диплом 3+ лет; стандартный EU-путь; 2. SINGLE PERMIT: через конкретного румынского работодателя; 3. DIGITALA NOMAD VISA: Румыния планировала ввести DN Visa; статус уточнять; 4. STARTUP VISA: через инновационный стартап; ПМЖ: 5 лет; ГРАЖДАНСТВО: 8 лет; двойное: принято; EU-паспорт; РЫНОК IT РУМЫНИЯ: UIPATH ($35B peak; $7B 2026; RPA; Robotic Process Automation; Daniel Dines основатель-миллиардер); КЛУЖ-НАПОКА: Tremend (Accenture купила); Fortech; Softvision (Cognizant); Yonder; Betfair Romania (Flutter Entertainment); БУХАРЕСТ: Oracle Bucharest; Microsoft; IBM; Accenture; Capgemini; Endava (LSE:DAVA; $3B; nearshore); ING Tech (банк); Raiffeisen Bank tech; Orange Romania tech; Stefanini; ЗАРПЛАТЫ IT РУМЫНИЯ (GROSS RON; 1 EUR = 5 RON): Junior: RON 5 000-8 000/мес ($1 000-1 600); Middle: RON 8 000-15 000 ($1 600-3 000); Senior: RON 15 000-25 000 ($3 000-5 000); UiPath/Endava Senior: RON 20 000-35 000 ($4 000-7 000); НАЛОГИ РУМЫНИЯ: НДФЛ: 10% плоский; Social Security (CAS): 25% (работник); Health Insurance (CASS): 10%; ЛЬГОТА IT: 0% НДФЛ для software developers зарплата до RON 10 000/мес; выше порога = 10% на превышение; ИТОГО: junior/middle IT = почти весь НДФЛ 0%; ЭФФЕКТИВНАЯ СТАВКА для middle: ~5-8% итого; СТОИМОСТЬ ЖИЗНИ РУМЫНИЯ 2026: БУХАРЕСТ: АРЕНДА: 2-комн Floreasca; Dorobanti (буржуазный): EUR 500-900/мес; 2-комн Militari; Berceni (спальные): EUR 300-500; КЛУЖ-НАПОКА: 2-комн: EUR 400-700 (растёт из-за студентов и IT); ТИМИШОАРА: EUR 300-500; СИБИУ: EUR 250-400 (красивый средневековый город!); ПРОДУКТЫ: дёшево; Carrefour; Kaufland; Mega Image; EUR 150-300/мес; mici (румынские колбаски): EUR 5-8 кг; sarmale (голубцы в виноградных листьях); mamaliga (кукурузная каша аналог polenta); ciorba (суп); tuica (сливовица); ТРАНСПОРТ: метро Бухарест (4 линии); автобус; STB; месячный проездной: RON 70 ($14); Клуж: автобус + трамвай; КЛИМАТ: умеренный континентальный; -10-38 гр; 4 сезона; Бухарест = жаркое лето; зима холодная; Карпаты = лыжи (Sinaia; Predeal; Poiana Brasov)',
    seo_description: 'Румыния IT 2026 жизнь Бухарест Клуж UiPath аренда: ЖИЗНЬ В РУМЫНИИ: КУЛЬТУРА: романцы = латинский темперамент в Восточной Европе; Orthodox Christian; Hagi (футбол); Eminescu (поэзия); Dracula (Bran Castle!); Transfagarasan (дорога через Карпаты; Top Gear топ-1 дорога мира); Sibiu = Европейская культурная столица 2007; РУМЫНСКИЙ ЯЗЫК: романский (похож на итальянский/испанский); легче чем польский или чешский; English хорошо знают в IT; RUSSOAZYCHNOE SOOBSHESTVO: маленькое; молдавский = по сути румынский; MEDITSINA: государственная слабая (недофинансирование); частная хорошая и дешёвая: EUR 30-80/визит; MedLife; Regina Maria (сети частных клиник); ОБРАЗОВАНИЕ: Universitatea Babes-Bolyai Cluj-Napoca; Politehnica Bucuresti; Universitatea Alexandru Ioan Cuza Iasi; международные школы; КЛУЖ-НАПОКА: почему Silicon Valley Румынии: 5 университетов; 90 000 студентов; Babes-Bolyai (120 000+ студентов; крупнейший в Румынии); Betfair Poker (650+ инженеров); Fortech (500+); Tremend; Softvision; живая startup-экосистема; TRANSYLVANIA: Брашов; Синая; Сибиу; Сигишоара; замок Бран (Дракула); Карпаты; медведи; ПУТЬ К ПМЖ: 5 лет; ГРАЖДАНСТВУ: 8 лет; EU-паспорт = 180+ стран; БЮДЖЕТ SENIOR DEVELOPER КЛУЖ (LOCAL): gross RON 25 000/мес ($5 000); НДФЛ 0% (льгота IT до RON 10 000) + 10% на превышение; CAS 25%: RON 6 250; CASS 10%: RON 2 500; НДФЛ ~10%: RON 1 500; net RON 14 750/мес ($2 950); аренда 2-комн Клуж: EUR 600 ($600); продукты: EUR 200; транспорт: EUR 14; итого расходы: EUR 814 ($814); остаток: RON 10 690/мес + $2 136; ИТОГО ПРИ REMOTE EU: gross EUR 5 000 (remote); taxes минимальные (статус зависит от резидентства); остаток EUR 3 500+; ITOGO PLYUSY: 0% НДФЛ для IT-специалистов (до RON 10 000/мес; УНИКАЛЬНО ДЛЯ EU!); EU ПМЖ и паспорт; UiPath ($35B peak); дёшево (Клуж EUR 400-700 аренда); Endava (LSE:DAVA); Трансильвания; Брашов; Дракула; Карпаты; MINUSY: социальные взносы CAS 25% + CASS 10% = 35% суммарно (высоко!); инфраструктура государственных услуг отстаёт; коррупция исторически; медицина государственная слабая; зарплаты местных IT ниже чем в Польше или Чехии.',
    content_md: `# Румыния Бухарест Клуж IT 2026: 0% НДФЛ для IT, UiPath, EU, дёшево

Румыния — 0% НДФЛ для IT-специалистов (до RON 10k/мес) и 10% плоский выше — уникальная льгота в EU. Клуж-Напока = Silicon Valley Румынии. UiPath ($35B на пике), Endava (LSE). Senior local RON 25k → net RON 14 750 ($2 950). EU-паспорт через 8 лет.

---

## IT-льгота: 0% НДФЛ

| Зарплата | НДФЛ | Эффективная ставка |
|---------|------|--------------------|
| До RON 10 000/мес | **0%** | 0% |
| Выше RON 10 000 | 10% на превышение | ~5-8% |

Дополнительно: CAS 25% + CASS 10% (социальные взносы) — высоко, но это с gross.

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| **UiPath** | $35B peak; RPA; основана Бухарест 2005 |
| **Endava** | LSE:DAVA; $3B; nearshore |
| Betfair Romania | Flutter Entertainment; 650+ инженеров в Клуже |
| Oracle; Microsoft; IBM | R&D офисы в Бухаресте |

---

## Стоимость жизни

| Город | Аренда 2-комн | Характер |
|-------|--------------|---------|
| **Клуж-Напока** | **EUR 400-700** | Silicon Valley; студгород |
| Бухарест Floreasca | EUR 500-900 | Столица; жизнь |
| Тимишоара | EUR 300-500 | Тихо; дёшево |
| Сибиу | EUR 250-400 | Средневековый; UNESCO |

---

## Итого

Румыния IT 2026: 0% НДФЛ для IT до RON 10k/мес (ЛУЧШАЯ ЛЬГОТА В EU!); UiPath ($35B peak); Endava (LSE); Клуж = Silicon Valley Румынии (90k студентов; 5 университетов); EU ПМЖ 5 лет + паспорт 8 лет; аренда Клуж EUR 400-700; Карпаты; Трансильвания; Брашов; замок Бран; CAS 25% + CASS 10% = высокие социальные взносы; медицина государственная слабая (частная дешёвая).
`,
  },
  {
    slug: 'indoneziya-bali-it-dn-2026',
    title: 'Бали Индонезия DN IT 2026: Digital Nomad Visa E33G, Canggu, Ubud, стоимость жизни',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Бали Индонезия DN IT 2026 Digital Nomad Visa E33G Canggu Ubud стоимость жизни: БАЛИ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ БАЛИ: САМЫЙ INSTAGRAM-ГОРЯЧИЙ DN-ХАБ МИРА; 5+ миллионов туристов в год; рисовые террасы Tegallalang; храм Tanah Lot; Uluwatu sunset; Ubud = культура и йога; Canggu = серфинг и digital nomads; Seminyak = вечеринки и роскошь; Kuta = дёшево и шумно; Sanur = семейный; Amed = дайвинг; Nusa Penida = скала Kelingking; КЛИМАТ: тропический; 26-32 гр; 2 сезона: сухой (апрель-октябрь; ЛУЧШИЙ) и дождливый (ноябрь-март); ВРЕМЕННАЯ ЗОНА: WITA UTC+8 (плохо для EU-remote; хорошо для Австралии; OK для Сингапура/Гонконга); ВИЗЫ ИНДОНЕЗИЯ БАЛИ: 1. VISA ON ARRIVAL (VOA): гражданам РФ НЕДОСТУПНА без оформления через eVOA; eVOA: $35 онлайн; 30 дней; продляется 1 раз на 30 дней (итого 60 дней); 2. TOURIST VISA B211A (SOCIAL VISIT): через агентство; $50-100; 60 дней; продляется до 2 раз (итого 6 мес!); "visa run" = выезд в Сингапур/Малайзию/Австралию; 3. DIGITAL NOMAD VISA E33G (с 2023): ОФИЦИАЛЬНАЯ DN VISA ДЛЯ БАЛИ; бесплатная; 5 лет (не опечатка!); требования: работа на иностранного работодателя/own foreign company; доход за пределами Индонезии; УСЛОВИЯ: подать через консульство Индонезии; НО: на практике выдача E33G = СЛОЖНО и непоследовательно (иммиграционные офицеры применяют по-разному); многие DN живут по B211A; 4. KITAS (ВНЖ через работодателя): через индонезийскую компанию; 5. INVESTOR KITAS: инвестиции IDR 13.5 млрд ($860k+); ПМЖ: практически недостижимо; ГРАЖДАНСТВО: крайне сложно (Индонезия не признает двойное гражданство!); РЫНОК IT ИНДОНЕЗИЯ: JAKARTA (не Бали): GOJEK ($14B; супер-приложение; on-demand; GO-PAY; GoFood; GoRide); TOKOPEDIA (объединилась с GOJEK в GoTo); GRAB Indonesia; Traveloka ($3B; travel); OVO (fintech; $2.9B); Bukalapak (BUKA; $2.4B; Nasdaq IDX); Shopee Indonesia (SEA $12B); LAZADA Indonesia (Alibaba); DANA (fintech); Ajaib (wealthtech; $270M); ЗАРПЛАТЫ IT ИНДОНЕЗИЯ (IDR; 1 USD = 15 800 IDR): LOCAL: Junior: IDR 7M-15M/мес ($443-949); Middle: IDR 15M-30M ($949-1 899); Senior: IDR 30M-60M ($1 899-3 797); GOJEK/Tokopedia Senior: IDR 50M-100M ($3 165-6 329); REMOTE EU/US: 3-10x выше local; НАЛОГИ ИНДОНЕЗИЯ: НДФЛ: 5% до IDR 60M/год ($3 797); 15% до IDR 250M; 25% до IDR 500M; 30% до IDR 5 000M; 35% свыше; ДЛЯ ИНОСТРАНЦЕВ TOURIST/B211A: доход из иностранных источников = не облагается индонезийским налогом; E33G также не облагает иностранный доход; СТОИМОСТЬ ЖИЗНИ БАЛИ 2026: CANGGU (DN-хаб #1 Бали): АРЕНДА: 2-комн: $500-1 000/мес; студия: $300-600; вилла с бассейном: $800-2 000; UBUD (культура; тропики): 2-комн: $400-800; вилла: $600-1 500; SEMINYAK (люкс; рестораны): вилла: $800-2 500; ULUWATU (серфинг; скалы): вилла/2-комн: $500-1 000; SANUR (спокойно; семья): $400-700; ПРОДУКТЫ: дёшево; nasi goreng (жареный рис): IDR 15 000-30 000 ($1-2); babi guling (поросёнок на вертеле; Ubud; IDR 50 000-80 000); ayam betutu (курица в специях); gado-gado; sate; tempeh; tofu; рынок (pasar): IDR 500 000/мес ($32); western grocery (Bintang; Pepito): $200-400/мес; ТРАНСПОРТ: мотоцикл: $60-100/мес аренда (СТАНДАРТ НА БАЛИ); Gojek (приложение): IDR 10 000-30 000/поездка; такси Bluebird; аренда скутера сам: IDR 600 000-800 000/мес; БЕЗОПАСНОСТЬ: хорошая; баланезийцы мирные; основные риски: трафик на мотоцикле (ГЛАВНАЯ ОПАСНОСТЬ); петти-кражи в туристических районах; КЛИМАТ: тропический; дождливый ноябрь-март; жарко круглый год; Ubud прохладнее (горы)',
    seo_description: 'Бали IT DN 2026 жизнь аренда Canggu Ubud серфинг коворкинг: ЖИЗНЬ НА БАЛИ: КУЛЬТУРА: балинезийская культура = УНИКАЛЬНА; Hinduism (98% Бали = Hindu в мусульманской Индонезии); ежедневные подношения богам (canang sari); кремация (ngaben) = праздник; Galungan и Kuningan = главные праздники; баронг-танец; УВАЖЕНИЕ: одевать sarong в храмах; не указывать ногами на людей/предметы; левая рука = нечистая; ИНТЕРНЕТ: Canggu = хорошо (100 Mbps+); Ubud = хуже; загородные виллы = нестабильно; Starlink набирает популярность; COWORKINGS CANGGU: Dojo Bali (#1 по отзывам); Outpost; Lawn; Bali Bustle; Serenity; ZEPHYR; COWORKINGS UBUD: Outpost Ubud; Hubud (закрыт в 2020; частично вернулся); МЕДИЦИНА: туристическая страховка ОБЯЗАТЕЛЬНА; серьёзные случаи = Сингапур или Гонконг; BIMC Hospital (международный); Siloam; базовые вещи = OK; SCOOTER SAFETY: главная причина смерти туристов; шлем ВСЕГДА; международные водительские права или SIM Индонезия; ИНТЕРНЕТ-БАНКИНГ: Wise; Revolut; криптовалюта; местный счёт без KITAS = невозможно; ограничения на вывод наличных (ATM лимиты); Gopay работает; RUSSOAZYCHNOE SOOBSHESTVO: ОГРОМНОЕ; после 2022 русскоязычная диаспора на Бали выросла в 5-10 раз; Canggu = "Русские на Бали" Telegram 50k+ участников; русские рестораны; детские сады; coworkings; врачи; ВУЛКАН: Gunung Agung (3 142 м; священный; активный); Gunung Batur (1 717 м; трекинг на рассвете); НУСА ПЕНИДА: остров 45 мин паром от Санура; Kelingking Beach; Angel Billabong; Crystal Bay; мантинеи; ПЕЙНТ: Canggu Circuit: Echo Beach; Old Man (серфинг для beginners); Berawa; Pererenan; Seminyak = шоппинг и рестораны; Kuta = budget backpackers; ПУТЬ К СТАТУСУ: практически нет пути к ПМЖ или гражданству; Индонезия не признает двойное гражданство; жить по B211A продления; БЮДЖЕТ REMOTE DEVELOPER CANGGU: gross (EU-компания): $5 000/мес; налог Индонезия: $0 (иностранный источник); аренда студия/1-комн Canggu: $500; продукты западные: $250; скутер: $80; Gojek/транспорт: $50; коворкинг Dojo: $150; медстраховка: $100; обеды (mix west+local): $150; итого расходы: $1 280; остаток: $3 720/мес; ITOGO PLYUSY: Digital Nomad Visa E33G 5 лет (если дадут); $0 налог на иностранный доход; огромная русская диаспора на Бали (2022+); Canggu = топ-коворкинги мира; Gojek ($14B); острова (Нуса Пенида; Ломбок; Гили); серфинг; йога; рисовые террасы; MINUSY: E33G Visa = непоследовательно выдают (практика разная); ПМЖ практически недостижимо; индонезийский не признает двойное гражданство; мотоцикл = главная опасность; интернет нестабильный на виллах; timezone +8 (плохо EU-remote); трафик в Кутте/Чангу ужасный.',
    content_md: `# Бали DN IT 2026: Digital Nomad Visa E33G, Canggu, $3 720 остаток

Бали — самый популярный DN-хаб мира. Digital Nomad Visa E33G (5 лет, без налога на иностранный доход). Canggu: коворкинги Dojo, Outpost. Remote $5 000 → расходы $1 280 → остаток $3 720. Огромная русская диаспора с 2022.

---

## Визы

| Тип | Условие | Срок |
|-----|---------|------|
| eVOA | $35 онлайн | 30+30 дней |
| B211A Tourist | Через агентство $50-100 | 60+60+60 дней |
| **E33G Digital Nomad** | Иностранный работодатель; 0 IDR дохода | **5 лет** |

E33G выдают непоследовательно — на практике многие живут по B211A.

---

## Стоимость жизни

| Район | Аренда | Атмосфера |
|-------|--------|----------|
| **Canggu** | **$500-1 000** | **DN-хаб; серфинг; коворкинги** |
| Ubud | $400-800 | Культура; йога; горы |
| Uluwatu | $500-1 000 | Серфинг; скалы; закат |
| Sanur | $400-700 | Семейный; спокойно |

---

## Бюджет Remote Developer в Чангу

| Статья | USD/мес |
|--------|---------|
| Студия/1-комн | $500 |
| Продукты (западные) | $250 |
| Скутер аренда | $80 |
| Коворкинг Dojo | $150 |
| Медстраховка | $100 |
| Обеды | $150 |
| **Итого расходы** | **$1 280** |
| **Остаток ($5 000 gross)** | **$3 720** |

---

## Итого

Бали IT DN 2026: топ-1 DN-хаб мира; E33G Visa 5 лет (если получите; выдача непоследовательная); $0 налог на иностранный доход; огромная русскоязычная диаспора (Canggu; 50k+ Telegram); Gojek ($14B GoTo); коворкинги Dojo; Нуса Пенида; Gunung Batur; серфинг; йога; ПМЖ практически недостижимо; Индонезия не признает двойное гражданство; скутер = главная опасность (шлем всегда); timezone +8 плохо для EU-remote.
`,
  },
  {
    slug: 'meksika-mehiko-gvadalahara-dn-it-2026',
    title: 'Мексика Мехико Гвадалахара DN IT 2026: Residente Temporal, стоимость жизни, Mercado Libre',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Мексика Мехико Гвадалахара DN IT 2026 Residente Temporal стоимость жизни Mercado Libre: МЕКСИКА ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ МЕКСИКА: CDMX (Ciudad de Mexico) = один из крупнейших мегаполисов мира (22M+); Roma Norte; Condesa; Polanco; Coyoacan (Фрида Кало); GUADALAJARA = Silicon Valley of Mexico (Jalisco); IBM; Intel; Oracle; HP; Luxoft; крупнейший IT-экспортёр ЛА; УДОБСТВО ДЛЯ US REMOTE: CST/MST (UTC-6/-7) = идеально синхронизируется с US East/West Coast; граница с США = 1 ч полёт до любого US города; МЕКСИКАНСКАЯ ЕДА: ШЕДЕВР; tacos; tamales; mole negro (Оахака); chiles en nogada; tlayuda; mezcal; pulque; ВРЕМЕННАЯ ЗОНА: CST UTC-6 (идеально для US-remote); ВИЗЫ МЕКСИКА: 1. TOURIST VISA: гражданам РФ = 180 дней без визы; продление через INM; 2. RESIDENTE TEMPORAL: для длительного проживания: варианты: экономическая состоятельность (banco extracto: $3 000+/мес за последние 6-12 мес); пенсия/доход; инвестиции в Мексике; СРОК: 1 год → продляется до 4 лет → ПМЖ (Residente Permanente) → ГРАЖДАНСТВО: 5 лет (или 2 года через брак); 3. VISITANTE CON PERMISO PARA REALIZAR ACTIVIDADES REMUNERADAS: для работы по приглашению мексиканского работодателя; 4. ИНВЕСТОР: регистрация компании в Мексике + инвестиции; РЫНОК IT МЕКСИКА: GUADALAJARA (Silicon Valley Мексики): IBM (крупнейший работодатель; 15 000+ чел); Intel (microprocessor design); Oracle; HP; Accenture; Luxoft; Hpe; Tata Consultancy; Infosys; Softtek ($1B; Monterrey+Guadalajara; крупнейшая IT-компания Мексики); Thomson Reuters Latam; CDMX: Mercado Libre Mexico; Grupo Salinas Plata (fintech); BBVA Mexico tech; Citibanamex tech; Santander Mexico tech; Rappi Mexico; Cabify; СТАРТАПЫ: Kavak ($8.7B; used cars; основан CDMX); Konfio ($800M; SME lending); Clip ($2B; point-of-sale); Kueski ($200M; BNPL); Bitso ($2.2B; crypto); Clara ($150M; corporate cards); Merama ($200M; e-commerce); ЗАРПЛАТЫ IT МЕКСИКА (LOCAL MXN; 1 USD = 17 MXN): Junior: MXN 20 000-35 000/мес ($1 176-2 059); Middle: MXN 35 000-60 000 ($2 059-3 529); Senior: MXN 60 000-120 000 ($3 529-7 059); IBM/Intel Guadalajara Senior: MXN 80 000-150 000 ($4 706-8 824); REMOTE EU/US: $4 000-15 000; НАЛОГИ МЕКСИКА: ISR (Impuesto Sobre la Renta; НДФЛ): 1.92% до MXN 75 984/год; 6.4% до MXN 75 984; 10.88% до MXN 91 050; 16% до MXN 106 116; 17.92% до MXN 121 182; 21.36% до MXN 152 088; 23.52% до MXN 182 088; 30% до MXN 250 000; 32% до MXN 392 841; 34% до MXN 750 000; 35% свыше; ДЛЯ РЕЗИДЕНТОВ: весь мировой доход; ДЛЯ НЕРЕЗИДЕНТОВ (tourist 180 дней): только мексиканский доход; iностранный доход не облагается; IMSS (Social Security): ~6-7% работник; СТОИМОСТЬ ЖИЗНИ МЕКСИКА 2026: CDMX (Roma Norte; Condesa; Polanco): АРЕНДА: 2-комн: $800-1 600/мес; Roma Norte 1-комн: $500-900; Polanco (люкс): $1 500-3 000+; GUADALAJARA (Zapopan; Providencia): 2-комн: $500-900; MONTERREY (norte; богатый): $600-1 000; ОАХАКА (Oaxaca City): 2-комн: $300-600 (RED HOT DN-направление!); PUERTO ESCONDIDO (серфинг): $300-600; ПЛАЙА-КАРАТА (Playa del Carmen): $500-1 000; ТУЛУМ (Tulum): $600-1 500 (дороже; модно); ПРОДУКТЫ: tacos de canasta (придорожные): MXN 10-15 ($0.60-0.90); taqueria: MXN 30-60 ($1.76-3.53); comida corrida (комплексный обед): MXN 60-100 ($3.5-5.9); рынок Mercado de Medellín: MXN 2 000-4 000/мес; supermercado: MXN 4 000-7 000; ТРАНСПОРТ: CDMX Metro: MXN 5/поездка ($0.29!); Metrobus; Ecobici (байкшеринг); Uber работает; БЕЗОПАСНОСТЬ: CDMX Roma/Condesa/Polanco = относительно безопасно; НО: следить за обстановкой (carjacking; extorsion в некоторых районах); Guadalajara Centro = аккуратно; туристические Riviera Maya = безопасно',
    seo_description: 'Мексика IT DN 2026 жизнь CDMX Гвадалахара Оахака такос mezcal: ЖИЗНЬ В МЕКСИКЕ: КУЛЬТУРА: mexicanos = теплые; griteria (Day of the Dead = UNESCO!); Frida Kahlo; Octavio Paz; Dia de Muertos (ноябрь; главный праздник); Mariachi; Lucha Libre; futbol (Club America; Chivas; Monterrey); ИСПАНСКИЙ: мексиканский акцент = четкий и понятный; хорош для изучения; MEDITSINA: частная дешевле Европы; ABC Hospital; Medica Sur; $50-150/визит; IMSS для официально работающих; ОБРАЗОВАНИЕ: UNAM (Universidad Nacional Autonoma de Mexico; крупнейший вуз ЛА; бесплатный); Tecnologico de Monterrey (ITESM; #1 в Мексике; платный); RUSSOAZYCHNOE SOOBSHESTVO: есть в CDMX; небольшое; ЕВРЕЙСКАЯ ДИАСПОРА: одна из крупнейших в ЛА (50 000+ в CDMX; Polanco); ЕДА: tacos al pastor; mole negro (Оахака; шоколад+чили+специи 30 ингредиентов); chiles en nogada (патриотическое блюдо); tlayuda; tamales; pozole; aguas frescas (horchata; jamaica); mezcal vs tequila (mezcal = artisanal); pulque; ОАХАКА: почему топ DN: Zocalo (главная площадь); Monte Alban (ацтекские руины); tianguis (рынок); mole negro; mezcal; textile; безопасно; дёшево; international expat community; ИНТЕРНЕТ: хорошо в CDMX и Guadalajara; Telmex; AT&T Mexico; Izzi; coworkings: CDMX = WeWork; Common Ground; Impact Hub; Guadalajara = Selina; GDL+; ПУТЬ К ГРАЖДАНСТВУ: Residente Temporal до 4 лет → Residente Permanente → гражданство 5 лет (или 2 года через брак с мексиканцем); двойное: разрешено!; мексиканский паспорт: 160 стран безвизово (включая EU Шенген); БЮДЖЕТ REMOTE DEVELOPER CDMX ROMA NORTE (US-КОМПАНИЯ): gross $6 000/мес; налог Мексика (нерезидент/tourist): $0 на иностранный доход; аренда 1-комн Roma Norte: $700; продукты: $300; Metro + Uber: $100; taqueria обеды: $150; медстраховка: $100; mezcal weekend: $80; итого расходы: $1 430; остаток: $4 570/мес; ITOGO PLYUSY: UST (US-remote = UTC-6; идеальная синхронизация); граница с США 1 ч полёт; Guadalajara Silicon Valley Мексики (IBM; Intel; Softtek); Kavak ($8.7B); Bitso ($2.2B); Mole negro + mezcal; Оахака (дёшево + аутентично); гражданство через 5 лет (двойное OK); MINUSY: безопасность (следить); трафик в CDMX ужасный; неравномерное качество жизни; налоги для резидентов = мировой доход; Tulum и Playa del Carmen = дорого.',
    content_md: `# Мексика Мехико Гвадалахара DN IT 2026: $1 430 расходы, US-remote рай, Kavak $8.7B

Мексика — идеал для US-remote (UTC-6, граница с США — 1 ч полёт). Guadalajara = Silicon Valley Мексики (IBM, Intel, Softtek $1B). Remote $6 000 → расходы $1 430 → остаток $4 570. Tacos от $0.60. Оахака = DN-рай.

---

## Визы

| Тип | Условие | Срок |
|-----|---------|------|
| **Tourist** | РФ 180 дней без визы | 180 дней |
| **Residente Temporal** | Доход $3k+/мес или сбережения | 1-4 года → ПМЖ |
| Residente Permanente | Через Temporal или пенсия | ПМЖ |

---

## IT-экосистема

| Компания | Детали |
|---------|--------|
| **Kavak** | $8.7B; used cars; CDMX |
| **Bitso** | $2.2B; crypto; CDMX |
| **Softtek** | $1B; IT services; Guadalajara |
| IBM Guadalajara | 15 000+ сотрудников |
| Intel | Chip design; Guadalajara |

---

## Стоимость жизни

| Город | Аренда 2-комн | Атмосфера |
|-------|--------------|----------|
| CDMX Roma Norte | $700-1 200 | Хипстер; культура |
| Guadalajara Providencia | $500-900 | Tech hub; спокойно |
| **Оахака** | **$300-600** | **DN-рай; mole; mezcal** |
| Playa del Carmen | $500-1 000 | Пляж; Карибы |

---

## Итого

Мексика IT DN 2026: UTC-6 = идеально для US-remote; Guadalajara Silicon Valley (IBM 15k+; Intel; Softtek $1B); Kavak ($8.7B); Bitso ($2.2B криптo); tacos от $0.60; mole negro Оахака (UNESCO-еда); mezcal; $0 налог на иностранный доход (нерезиденты tourist 180 дней); гражданство 5 лет (двойное OK); безопасность — следить (Roma/Condesa OK; центры крупных городов — аккуратно); трафик CDMX = катастрофа.
`,
  },
  {
    slug: 'shri-lanka-kolombo-galle-dn-2026',
    title: 'Шри-Ланка Коломбо Галле DN 2026: Digital Nomad Visa, $600 расходы, чай, серфинг',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Шри-Ланка Коломбо Галле DN 2026 Digital Nomad Visa 600 расходы чай серфинг: ШРИ-ЛАНКА ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ШРИ-ЛАНКА: НЕДООЦЕНЁННЫЙ GEM ЮВА; после экономического кризиса 2022 (дефолт; топливный кризис; отставка Раджапаксы) ситуация стабилизировалась; туристы вернулись; ЦЕНЫ: упали и остаются низкими; один из самых доступных островов Азии; ПРИРОДА: чайные плантации (Ceylon Tea = лучший чай мира!); слоны; Yala National Park (леопарды; крокодилы); Ella (горы; водопады; Nine Arches Bridge); Sigiriya (скальная крепость; ЮНЕСКО); Dambulla cave temple; кит-наблюдение (Mirissa); СЕРФИНГ: Arugam Bay (#1 серфинг-хаб ЮВА; восточное побережье; май-октябрь); Hikkaduwa; Weligama; Mirissa; GALLE = колониальный форт (Dutch; португальский; UNESCO); КЛИМАТ: тропический; 2 муссона (юго-запад и северо-восток; разные сезоны в разных частях острова!); запад/юг лучше ноябрь-апрель; восток лучше май-октябрь; ВРЕМЕННАЯ ЗОНА: IST UTC+5:30 (удобно EU-remote: разница 2.5 ч с Берлином; 3.5 ч с Москвой); ВИЗЫ ШРИ-ЛАНКА: 1. TOURIST ETA (Electronic Travel Authorization): гражданам РФ = $50 онлайн; 30 дней; продляется 2 раза до 3 мес total; 2. DIGITAL NOMAD VISA (с 2023): ОФИЦИАЛЬНАЯ DN VISA: через ETA Visa Portal или консульство; $500/год; 1 год; продляемая; требования: работа на иностранного работодателя; доход за пределами Шри-Ланки; $2 000/мес minimum; рекомендуется медицинская страховка; 3. RESIDENCE VISA: через инвестиции $250 000+ или недвижимость; 4. STUDENT VISA: через аккредитованный ВУЗ; ПМЖ: через инвестиции или долгосрочное проживание; ГРАЖДАНСТВО: крайне сложно; РЫНОК IT ШРИ-ЛАНКА: КОЛОМБО (деловой центр): WSO2 ($1B; open source middleware; основана в Sri Lanka); IFS ($3B; enterprise software; Svenska-Sri Lanka); Dialog Axiata (Axiata Group; telco + tech); SriLankan Airlines IT; Virtusa (NASDAQ; BPO+IT); Millennium IT (LSE; fintech trading systems; куплена LSEG); Haycarb; STAX; ZILLAbs; Rootcode; Sparrow; ЗАРПЛАТЫ IT ШРИ-ЛАНКА (LKR; 1 USD = 300 LKR): LOCAL: Junior: LKR 80 000-150 000/мес ($267-500); Middle: LKR 150 000-300 000 ($500-1 000); Senior: LKR 300 000-600 000 ($1 000-2 000); WSO2/IFS Senior: LKR 500 000-900 000 ($1 667-3 000); REMOTE EU/US: 3-10x выше; НАЛОГИ ШРИ-ЛАНКА: НДФЛ: 6% до LKR 1.2M/год ($4 000); 12% до LKR 2.4M; 18% до LKR 3.6M; 24% до LKR 4.8M; 30% до LKR 6M; 36% свыше; ДЛЯ ИНОСТРАНЦЕВ: доход из иностранных источников не облагается шри-ланкийским налогом; DN Visa + иностранный работодатель = $0 налог; СТОИМОСТЬ ЖИЗНИ ШРИ-ЛАНКА 2026: КОЛОМБО (Colombo 3; 5; 7 = лучшие районы): АРЕНДА: 2-комн: $300-600/мес; 1-комн: $200-400; ГАЛЛЕ (Galle Fort): 2-комн: $400-800 (популярнее; дороже); ВЕЛИГАМА (Weligama; серфинг): $250-500; АРОГАМ БЭЙ (Arugam Bay; серфинг): $150-350 (только сезон!); ЭЛЛА (горы): $200-400; ТАНГАЛЛЕ (Tangalle; пляж): $200-400; ПРОДУКТЫ: дёшево; котту-ротти (roti + vegetables; уличная еда): LKR 300-500 ($1-1.7); rice and curry: LKR 200-400 ($0.67-1.33); hoppers (рисовые блины); dhal curry; coconut sambol; Ceylon Tea (100г): LKR 200-400; supermarket: $150-250/мес; ТРАНСПОРТ: tuktuk: $1-3 по городу; автобус: LKR 30-100/поездка ($0.10-0.33); поезд (Ella-Colombo; знаменитый scenic route): LKR 500-1 500; Uber/PickMe: $2-5; БЕЗОПАСНОСТЬ: хорошая (после 2009 войны нет; туристы снова; Easter bombings 2019 в прошлом)',
    seo_description: 'Шри-Ланка DN IT 2026 жизнь Коломбо Галле серфинг чай Сигирия: ЖИЗНЬ В ШРИ-ЛАНКЕ: КУЛЬТУРА: Sri Lankans = теплые; гостеприимные; Theravada Buddhism (70%); сингальский + тамильский + English; Vesak (день Будды); Sinhala+Tamil New Year (апрель); Poya дни (полнолуние = общественный выходной!); ЦЕЙЛОНСКИЙ ЧАЙ: Nuwara Eliya = чайная столица мира; Dimbula; Uva; Kandy; экскурсии на плантации; СЛОНЫ: Pinnawala Elephant Orphanage; Udawalawe; Yala (леопарды!); Kumana; СИГИРИЯ: скальная крепость 477 н.э.; фрески; сады; TOP-10 объектов UNESCO в Азии; СЕРФИНГ: Arugam Bay = одна из лучших волн в мире (bay point break); Hikkaduwa; Midigama; Weligama (ideal beginners); ДАЙВИНГ: Hikkaduwa; Pasikuda; GALЛЕ FORT: UNESCO; Dutch-Portuguese colonial fort; boutique отели; рестораны; art galleries; МЕДИЦИНА: Национальная больница Colombo (бесплатная; перегружена); частная: Durdans; Lanka; Asiri; $20-60/визит; ТУРИСТИЧЕСКАЯ страховка обязательна; ИНТЕРНЕТ: Dialog; Mobitel; SLT; 4G хорошо в Коломбо и Галле; горные районы (Элла) = медленнее; коворкинги: Work in Colombo; Hatch Works; Regus Colombo; WSO2 campus (открытый); БАНКИНГ: иностранцу открыть счёт трудно без ВНЖ; Wise + карта для снятия; Commercial Bank; Sampath Bank (иногда дают иностранцам); RUSSOAZYCHNOE SOOBSHESTVO: небольшое; туристы из РФ вернулись; WELIGAMA/ARUGAM BAY = серфинг-сообщество international; КРИЗИС 2022: выученные уроки: держите деньги не в LKR; запас наличных; несколько карточек; ПУТЬ К ГРАЖДАНСТВУ: нет простого пути; через investment; БЮДЖЕТ REMOTE DEVELOPER WELIGAMA (СЕРФИНГ-СЕЗОН): gross (EU-компания): $4 000/мес; налог Шри-Ланка: $0 (иностранный источник); аренда 2-комн Weligama: $350; продукты: $150; tuktuk/Uber: $50; серфинг-школа/доска: $60; медстраховка: $80; rice and curry каждый день: $50; итого расходы: $740; остаток: $3 260/мес; ITOGO PLYUSY: DN Visa 1 год (официальная); $0 налог иностранный доход; очень дёшево ($740 расходы в Велигаме); Arugam Bay топ-серфинг ЮВА; чайные плантации; слоны; Сигирия (UNESCO); WSO2 ($1B); IFS ($3B); UTC+5:30 удобно для EU-remote; MINUSY: кризис 2022 (стабилизировалось; но риск LKR инфляции есть); инфраструктура неравномерная; ПМЖ/гражданство = очень сложно; интернет нестабильный в горах; туктук в дождь = мокрый.',
    content_md: `# Шри-Ланка Коломбо Галле DN 2026: $740 расходы, чай, Arugam Bay серфинг

Шри-Ланка — недооценённый DN-хаб после кризиса 2022. DN Visa на 1 год ($500). Remote $4 000 → расходы $740 → остаток $3 260. WSO2 ($1B), IFS ($3B). Arugam Bay — топ-серфинг ЮВА. Чайные плантации Нувара-Элия. UTC+5:30 — удобно для EU-remote.

---

## Визы

| Тип | Условие | Срок |
|-----|---------|------|
| Tourist ETA | $50 онлайн | 30+30+30 дней |
| **DN Visa** | Иностр. работодатель; $2k/мес; $500 fee | 1 год; продляемая |
| Residence Visa | Инвестиции $250k+ | Долгосрочная |

---

## Стоимость жизни

| Локация | Аренда 2-комн | Особенность |
|---------|--------------|------------|
| Коломбо 3/5/7 | $300-600 | Деловой центр |
| Галле Форт | $400-800 | UNESCO; бутик |
| **Велигама** | **$250-500** | **Серфинг; beginners** |
| Арогам Бей | $150-350 | Топ-серфинг; сезон |

---

## Бюджет Remote Developer в Велигаме

| Статья | USD/мес |
|--------|---------|
| Аренда 2-комн | $350 |
| Продукты | $150 |
| Tuktuk/Uber | $50 |
| Серфинг (доска/урок) | $60 |
| Медстраховка | $80 |
| Rice and curry | $50 |
| **Итого расходы** | **$740** |
| **Остаток ($4 000 gross)** | **$3 260** |

---

## Итого

Шри-Ланка DN 2026: очень дёшево ($740 расходы в Велигаме); DN Visa 1 год ($500; $2k/мес minimum); $0 налог на иностранный доход; WSO2 ($1B; open source); IFS ($3B; enterprise software); Arugam Bay (#1 серфинг ЮВА); чайные плантации Nuwara Eliya; Сигирия (UNESCO); UTC+5:30 удобно EU-remote; кризис 2022 стабилизировался (но LKR риск есть); ПМЖ практически недостижимо; интернет нестабильный в горах.
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
console.log(`\nБатч 221: ${ok} OK, ${err} ошибок`);

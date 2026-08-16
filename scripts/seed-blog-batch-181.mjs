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
    slug: 'argentiniya-buenos-ayres-it-digital-nomad-2026',
    title: 'Аргентина и Буэнос-Айрес для IT в 2026: digital nomad, Mercado Libre, вес ARS',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Аргентина Буэнос-Айрес IT 2026: Digital Nomad Visa Аргентины (Rentista или Trabajador Independiente; доход ≥$2 500/мес от иностранного источника; подавать в Consulado Argentina; срок 1-3 года; ПМЖ через 2 года с продлением); IT-компании: Mercado Libre MELI (e-com #1 LatAm; NASDAQ $75B; HQ Буэнос-Айрес; 15 000 сотрудников; MercadoPago fintech); Globant (IT consulting; NYSE $5B; HQ BA; tech delivery для Disney/United/Rockwell); Despegar.com (travel; NASDAQ); OLX (classifieds; Prosus); Satellogic (earth observation; NASDAQ SATL); Agora Speakers (Twilio LatAm); Wolox (acq. Accenture); Auth0 (acq. Okta за $6.5B; основан в Буэнос-Айресе); экономика: инфляция 200%+ в 2023-2024 (снизилась к 2025); параллельный курс USD vs официальный (blue dollar gap сократился при Милее); Milei реформы 2024: долларизация обсуждалась; liberalization; вес ARS нестабилен',
    seo_description: 'Аргентина Буэнос-Айрес IT 2026: ЭКОНОМИКА: Аргентина пережила инфляцию 200%+ (2023-2024); при президенте Хавьере Милее (с дек 2023) начаты реформы: deregulation; снижение инфляции; BCRA (ЦБ Аргентины) поднял ставку; инфляция снижалась с 200%+ до 80-100% в 2025 (проверять актуально); КУРС: официальный ARS/USD vs paralelo (blue dollar); сейчас gap сократился vs 2022-2023; для иностранцев получающих USD/EUR: income в твердой валюте = живешь дешево; сбережения НЕ хранить в ARS; VISA: Residente Transitorio Trabajador Independiente: дистанционный работник; доход ≥$2 500/мес; подавать в DNM (Dirección Nacional de Migraciones); срок 1 год + renewals; ПМЖ через 2 года; стоимость жизни BAСАРС: аренда 1BR Palermo/Belgrano USD $400-900/мес (платить в долларах на рынке); Recoleta: $500-1 000; продукты $200-400/мес; жизнь итого $700-1 500 USD/мес (дёшево если получаешь USD/EUR); КОМПАНИИ: Mercado Libre MELI (mercadolibre.com.ar; NASDAQ; $75B рыночная кап; HQ Nordelta Tigre + MercadoPago офисы BA; 15 000+ чел.; SWE Senior ARS 1M-2M/мес или $10 000-15 000/мес для international payroll; MercadoPago: #1 LatAm digital payments; $20B TPV); Globant (globant.com; NYSE GLOB; $5B; 20 000+ чел.; nearshore IT для US companies; Disney/Rockwell/Manchester City; офис в BA + Cordoba + LA; Senior SWE ARS 800k-1.5M/мес); Auth0 (okta.com/auth0; основан буэнос-айресцами Матиас Вольски и Эухенио Пейс; куплен Okta за $6.5B 2021; R&D Buenos Aires); Despegar.com (DESP NASDAQ; travel; BA HQ; Senior $5 000-10 000/мес); Satellogic (SATL NASDAQ; earth observation; LatAm deep tech); НДФЛ Аргентины: для резидентов: прогрессивный 5%-35%; AFIP (налоговая AR); Monotributista (упрощёнка для ИП: payor раз в мес фиксированный платёж по категориям; популярен для фрилансеров); социальное страхование ANSES; иностранцы на remote: мнение налоговых юристов: если работаешь для иностранного работодателя и доход поступает в иностранном банке — аргентинский НДФЛ не применяется пока не получаешь статус резидента; уточнять у аргентинского contadores; ЯЗЫК: испанский (rioplatense диалект — rio de la Plata; отличается от Мексики/Испании: voseo вместо tuteo; -LL/-Y произносится как sh); английский в IT-компаниях международного уровня; РАЙОН: Palermo (Palermo Hollywood/Palermo Soho): молодежный; рестораны/кафе/коворкинг; Belgrano: семейный; Recoleta: European style; San Telmo: исторический.',
    content_md: `# Аргентина и Буэнос-Айрес для IT: Mercado Libre, Auth0, dollar economy

LatAm tech-экосистема после Бразилии. Mercado Libre ($75B) — Amazon+PayPal LatAm. Дёшево в USD, если получаешь в твёрдой валюте.

## Экономика Аргентины: что нужно знать

| Параметр | Ситуация 2024-2025 |
|---------|------------------|
| Инфляция | 200%+ (2023) → снижается при Милее |
| Курс ARS/USD | Официальный + параллельный gap |
| Стратегия | Сбережения в USD/EUR, расходы в ARS |

**Для иностранца с USD/EUR доходом:** Буэнос-Айрес — один из дешевейших крупных городов при оплате в долларах.

---

## Visa для фрилансеров

| Параметр | Значение |
|---------|---------|
| Тип | Residente Transitorio Trabajador Independiente |
| Доход | ≥$2 500/мес от иностранного источника |
| Срок | 1 год + продление |
| ПМЖ | Через 2 года |

---

## IT-компании Аргентины

| Компания | Профиль | Факт |
|---------|---------|------|
| **Mercado Libre** | E-com #1 LatAm | NASDAQ $75B; 15 000 чел. |
| **Globant** | IT consulting/nearshore | NYSE $5B; Disney/Rockwell клиенты |
| **Auth0** | Identity (Okta) | Основан в BA; куплен за $6.5B |
| **Despegar** | Travel | NASDAQ DESP |
| **Satellogic** | Earth observation | NASDAQ SATL |

### Mercado Libre

Крупнейший e-commerce LatAm. MercadoPago (#1 LatAm fintech; $20B TPV). HQ в Нордельте + офисы в Буэнос-Айресе. Senior SWE на international payroll: $10 000-15 000/мес.

---

## Стоимость жизни в Буэнос-Айресе

| Статья | USD/мес |
|--------|---------|
| Аренда 1BR (Palermo/Belgrano) | 400-900 |
| Аренда 1BR (Recoleta) | 500-1 000 |
| Продукты | 200-400 |
| Транспорт (Subte + Uber) | 50-100 |
| **Итого** | **700-1 500** |

---

## Районы Буэнос-Айреса

| Район | Характер |
|-------|---------|
| **Palermo** | Hipster, коворкинг, рестораны |
| **Belgrano** | Семейный, спокойный |
| **Recoleta** | Европейский стиль |
| **San Telmo** | Исторический, танго |
| **Villa Crespo** | Доступный, молодёжный |

---

## НДФЛ для фрилансера

**Monotributista (упрощёнка):**
- Фиксированный ежемесячный платёж по категориям оборота
- Включает AFIP (налоговая) + ANSES (социальное) + ANSSAL (медицина)
- Популярен для фрилансеров

**Remote-работник на иностранного работодателя:** по мнению аргентинских юристов, если доход поступает в иностранный банк и нет аргентинского налогового резидентства — аргентинский НДФЛ не возникает. Уточнять у contadores.

---

## Испанский: rioplatense

Аргентинский диалект отличается от мексиканского/испанского:
- **Voseo** вместо tuteo (vos hablás вместо tú hablas)
- **-ll/-y** произносится как sh (lluvia = "shuvia")
- Итальянские интонации (125 000 итальянских иммигрантов в XIX в.)

---

## Итого

Аргентина Буэнос-Айрес IT 2026: visa Trabajador Independiente ($2 500/мес иностранный доход; 1 год); Mercado Libre ($75B)/Globant ($5B)/Auth0 ($6.5B acq.); жизнь $700-1 500 USD/мес (дёшево в USD); Palermo = лучший район для экспатов; Monotributista для ИП; инфляция снижается при Милее. Барьер: экономическая волатильность + испанский rioplatense.
`,
  },
  {
    slug: 'kak-vyvesti-dengi-iz-rossii-zakonno-2026',
    title: 'Как законно вывести деньги из России при переезде в 2026 году',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Как вывести деньги из России при переезде законно 2026: SWIFT-переводы из России (с 2022 часть российских банков отключена от SWIFT; Raiffeisenbank Russia / Gazprombank / Rosbank / Tinkoff (в зависимости от периода); лимиты на переводы физлиц за рубеж: ЦБ РФ лимит $1 000 000 в мес на счёт нерезидента ИЛИ переводы физлица нерезиденту ограничены; переводы в дружественные страны: снятые лимиты (Казахстан/Армения/Беларусь/Китай/Турция); переводы в недружественные страны (EU/US/UK): ограничены; проверять актуальные ЦБ-приказы); наличные (физический вывоз): до €10 000 или эквивалент — декларация не нужна; свыше €10 000 — обязательная таможенная декларация при выезде; вывоз более $1M — запрещён для физлиц (2022-2024 ограничения); деньги через Грузию: перевести в грузинский банк → вывести из Грузии; Wise/Revolut: работают частично; системы переводов (SPFS, российский аналог SWIFT; Cбер Pay, тебе переводят в Казахстан/Армению/Грузию → далее)',
    seo_description: 'Вывод денег из России при переезде 2026: АКТУАЛЬНАЯ СИТУАЦИЯ (проверяй актуальность на сайте ЦБ РФ cbr.ru): SWIFT-ПЕРЕВОДЫ ФИЗЛИЦ ЗА РУБЕЖ: банки с SWIFT для физлиц (2024-2025): Raiffeisenbank Россия (самый активный коридор; по состоянию на 2025 — работает; €/USD переводы в EU через Raiffeisen Austria; может быть ограничен); Газпромбанк (некоторые направления); Росбанк (Societe Generale); уточнять актуально на момент чтения; ЛИМИТЫ для физлиц-резидентов: переводы в банки дружественных стран: $1M/мес; переводы в банки недружественных стран (EU/US/UK): ограничены; конкретные условия — уточнять в ЦБ РФ; НАЛИЧНЫЕ: вывоз до €10 000 (или эквивалент в другой валюте) — таможенная декларация не нужна; от €10 000 до €100 000 — декларировать в Таможне (форма ТД-5); свыше €100 000 физлицу запрещено (ограничения 2022); можно купить наличные доллары/евро в российском банке (Сбер/ВТБ/Тинькофф продают); ЧЕРЕЗ ДРУЖЕСТВЕННЫЕ СТРАНЫ: КАЗАХСТАН: перевести рубли из Сбера/ВТБ через СБП или SWIFT в казахстанский банк (Kaspi/Halyk Bank); в Казахстане снять тенге или конвертировать в $; банки KZ хорошо работают; АРМЕНИЯ: перевод через SWIFT или Золотая Корона; Armenian банки (Ameriabank/Converse Bank) открывают счёт гражданам РФ; ГРУЗИЯ: переводы через Unistream / Золотая Корона / Georgian Post / TBC Bank Transfer; открыть счёт TBC Bank при личном визите; Грузия — ключевой транзитный хаб; WISE: Wise Business/Personal — принимает SWIFT из ряда российских банков; ситуация меняется; КРИПТОВАЛЮТА: технически доступна; легальный статус в РФ неоднозначен; P2P биржи; смарт-контракты; налоговые последствия в РФ и стране назначения; РУБЛИ В ИНОСТРАННЫЕ ФОНДЫ: покупка иностранных акций через дружественные брокеры (Казахстан/ОАЭ); ВАЖНО: при смене налогового резидентства (>183 дней за рубежом) переводы со своего российского счёта на свой зарубежный в пределах лимитов могут облагаться НДФЛ 30% (нерезидент); проконсультируйся с налоговым юристом РФ ПЕРЕД отъездом; уведомить ИФНС об открытии иностранного счёта (в течение 1 мес); ежегодный отчёт о движении средств по иностранным счётам.',
    content_md: `# Как законно вывести деньги из России при переезде

Ситуация меняется. Проверяй актуальные ограничения на cbr.ru. Основные легальные пути — SWIFT через Raiffeisenbank, наличные до €10 000, транзит через Грузию/Армению/Казахстан.

**Важно:** информация может устареть. Консультируйся с налоговым юристом РФ до отъезда.

---

## SWIFT-переводы из России

| Банк | Ситуация (2025) |
|------|----------------|
| **Raiffeisenbank RU** | Работает (коридор через Raiffeisen Austria) |
| Газпромбанк | Отдельные направления |
| Росбанк | Уточнять |

**Лимиты (ЦБ РФ):**
- В дружественные страны: до $1M/мес
- В недружественные (EU/US/UK): ограничены (уточнять)

---

## Наличные при выезде

| Сумма | Требование |
|-------|-----------|
| до €10 000 | Декларация не нужна |
| €10 000-100 000 | Декларировать в Таможне |
| свыше €100 000 | Запрещено физлицу |

Купить наличные EUR/USD в российском банке можно.

---

## Транзит через дружественные страны

### Казахстан

1. Перевести рубли из Сбера/ВТБ → Kaspi Bank / Halyk Bank через СБП или SWIFT
2. Конвертировать в USD в Казахстане
3. Перевести в EU/другую страну

### Армения

1. Перевести через Золотую Корону / Unistream / SWIFT
2. Ameriabank / Converse Bank открывают счёт гражданам РФ
3. Далее SWIFT в целевую страну

### Грузия

1. Перевести через SWIFT (Raiffeisenbank → Bank of Georgia/TBC)
2. TBC Bank открывает счёт при личном визите (паспорт)
3. SWIFT в EU из Грузии работает без ограничений

---

## Налоговые последствия при переезде

| Ситуация | НДФЛ |
|---------|------|
| Резидент РФ → перевод за рубеж | В пределах лимитов без налога |
| Нерезидент РФ (>183 дней за рубежом) → российские доходы | **30%** НДФЛ |

**Уведомить ИФНС:**
- Об открытии иностранного счёта (в течение 1 мес от открытия)
- Ежегодный отчёт о движении средств по иностранным счётам

---

## Wise и онлайн-сервисы

Wise принимает SWIFT из ряда российских банков (ситуация меняется). Revolut — аналогично. Проверяй актуально на wise.com.

---

## Планирование до отъезда

| Шаг | Детали |
|-----|--------|
| За 3-6 мес | Проконсультируйся с налоговым юристом РФ |
| За 3-6 мес | Уточни актуальные лимиты ЦБ |
| За 1-3 мес | Открой счёт в Грузии/Армении (личный визит) |
| За 1-3 мес | Открой Wise Account (из РФ) |
| При отъезде | Уведоми ИФНС об иностранных счетах |

---

## Итого

Как вывести деньги из России 2026: SWIFT через Raiffeisenbank (самый прямой путь); наличные до €10 000 без декларации; транзит через Грузию/Армению/Казахстан (открыть счёт лично → SWIFT дальше); Wise (работает частично); уведомить ИФНС об иностранном счёте в течение 1 мес; нерезидент РФ платит 30% НДФЛ с российских доходов; проверяй актуальные ограничения на cbr.ru перед принятием решений.
`,
  },
  {
    slug: 'expat-meditsinskaya-strakhovka-axa-cigna-2026',
    title: 'Медицинская страховка для экспата: Cigna, AXA, Allianz Care — как выбрать 2026',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Медицинская страховка экспат 2026: типы страховок (Travel Insurance: краткосрочная до 1 года; для туристов/digital nomad; покрывает экстренную медицину; не покрывает плановую/хронические болезни; дешёвая $50-150/мес; SafetyWing/WorldNomads; International Health Insurance (IPMI): долгосрочная (1 год+); для резидентов за рубежом; покрывает плановую и экстренную медицину; хронические болезни (с ограничениями); возможна стоматология; Cigna Global/AXA International/Allianz Care/BUPA Global; дороже $100-800/мес в зависимости от возраста/страны/покрытия; EU Social Insurance (обязательная): при официальном трудоустройстве в EU — работодатель подключает к local health fund (GKV в Германии; CSS в Испании; zorgverzekering в NL); Krankenversicherung в Германии: обязательная GKV (государственная) €400-700/мес или PKV (частная)); SafetyWing Nomad Insurance (safetywing.com; $45-130/мес в зависимости от возраста и включения США; покрывает 30 дней каждые 90 дней; emergency medical + limited coverage; Nomad Health = более широкий план; популярен у digital nomad без долгосрочного ВНЖ); Cigna Global (cigna.com/global-individual-health; индивидуальный план; $150-800/мес; 3 уровня: Silver/Gold/Platinum; global cover или excluding USA; стоматология отдельно; хронические болезни после периода ожидания)',
    seo_description: 'Медицинская страховка для экспата 2026: ТИПЫ СТРАХОВОК: Travel Insurance (краткосрочная): дешёвая $30-100/мес; только экстренная медицина + repatriation; не покрывает плановые визиты/хронические/стоматологию; подходит для первых 3-6 мес или digital nomad 1-2 мес; SafetyWing Nomad ($45-130/мес; popular); WorldNomads ($60-150/мес); International Health Insurance IPMI (долгосрочная): 1 год+; плановая + экстренная медицина; хронические болезни (after waiting period 1-2 года); стоматология (optional); госпитализация; ПРОВАЙДЕРЫ: Cigna Global (cigna.com; Silver: $150-300/мес (age 30-40); Gold: $250-500/мес; Platinum: $400-800/мес; включить/исключить USA из покрытия; без США на 30-40% дешевле; стоматология +$30-80/мес); AXA International (axa.com/international-health; аналогичные уровни; popular в EU/Asia); Allianz Care (allianzcare.com; корпоративный и индивидуальный; хорошая в EU); BUPA Global (bupaglobal.com; UK-based; EU/Asia coverage; premium сегмент); Now Health International (nowhealth.com; Asia-specialist; дешевле в APAC); Foyer Global (foyer.lu; Люксембург; хорошая для EU); SafetyWing Nomad Health (safetywing.com/nomad-health; $136-300/мес; для digital nomad; нет USA); IMG Global (imglobal.com; хорошая для Americas/Asia); КЛЮЧЕВЫЕ ПАРАМЕТРЫ ПРИ ВЫБОРЕ: Coverage area (EU only vs worldwide vs worldwide excl USA); inpatient only vs inpatient+outpatient; annual limit ($1M / $5M / unlimited); deductible (собственная доля; $0 / $250 / $1 000; выше deductible = дешевле premie); waiting period for pre-existing conditions (обычно 1-2 года); dental/vision (обычно доп. модуль); maternity (обычно 12-24 мес waiting period); repatriation (evacuation home); МЕСТНЫЕ ОБЯЗАТЕЛЬНЫЕ СТРАХОВКИ: Германия GKV (Gesetzliche Krankenversicherung): при работе в DE обязательна; €400-700/мес (50% платит работодатель); AOK/TK/Barmer — крупнейшие; для non-EU иностранцев: GKV если работаешь по трудовому договору (автоматически); PKV (Private Krankenversicherung): только для ≥salary threshold или самозанятых; лучшее покрытие но дороже при болезнях; Испания CSS (Caja de Seguridad Social): при работе в ES через компанию — автоматически; Нидерланды Zorgverzekering: обязательная для резидентов NL; €100-160/мес (базовый пакет); есть eigen risico (собственная доля €385/год); СОВЕТ: до переезда: купить travel insurance (SafetyWing); после получения ВНЖ и работы: присоединиться к local (GKV/CSS); если самозанятый/DN без local работы: Cigna Global или AXA без USA ($150-300/мес).',
    content_md: `# Медицинская страховка для экспата: SafetyWing, Cigna, AXA, GKV

Первые 3-6 месяцев — travel insurance (SafetyWing $45+). После ВНЖ и трудоустройства — local health fund. Для фрилансеров — Cigna Global или AXA ($150-300+/мес).

## Типы страховок

| Тип | Когда | Покрытие | Цена |
|-----|-------|---------|------|
| **Travel Insurance** | До 1 года, туристы/DN | Экстренная медицина | $30-150/мес |
| **IPMI (экспатская)** | 1 год+, резиденты | Плановая + экстренная | $100-800/мес |
| **Local GKV/CSS** | При работе в EU | Полное местное | €100-700/мес |

---

## Travel Insurance: для первых месяцев

| Провайдер | Цена | Покрытие |
|----------|------|---------|
| **SafetyWing Nomad** | $45-130/мес | Экстренная + limited |
| **SafetyWing Nomad Health** | $136-300/мес | Более широкое |
| WorldNomads | $60-150/мес | Аналог |

**Не покрывает:** плановые визиты, хронические болезни, стоматологию.

---

## International Health Insurance (IPMI): для долгосрочных резидентов

| Провайдер | Цена/мес (30-40 лет) | Особенность |
|----------|---------------------|------------|
| **Cigna Global** | $150-500 | 3 уровня Silver/Gold/Platinum |
| **AXA International** | $150-450 | Popular в EU/Asia |
| **Allianz Care** | $130-500 | Хорошая в EU |
| **BUPA Global** | $250-700 | Premium, UK-based |
| **Now Health** | $100-300 | Asia-specialist |

**Без США на 30-40% дешевле.** Если не планируешь в США — выбирай "excluding USA".

---

## Ключевые параметры при выборе

| Параметр | Что смотреть |
|---------|-------------|
| Coverage area | EU only / Worldwide / Worldwide excl USA |
| Inpatient/Outpatient | Только госпитализация или и поликлиника |
| Annual limit | $1M минимум ($5M лучше) |
| Deductible | $0 / $250 / $1 000 (выше = дешевле) |
| Pre-existing waiting | 1-2 года до покрытия хронических |
| Dental | Обычно отдельный модуль |

---

## Местные обязательные страховки (EU)

### Германия: GKV (обязательная)

| Параметр | Значение |
|---------|---------|
| Ставка | 14.6% от зарплаты |
| Работник | 7.3% |
| Работодатель | 7.3% |
| Примерная сумма | €400-700/мес |
| Крупнейшие | AOK / TK / Barmer |

При трудоустройстве в Германии — GKV автоматически.

### Нидерланды: Zorgverzekering

| Параметр | Значение |
|---------|---------|
| Базовый пакет | €100-160/мес |
| Eigen risico | €385/год (собственная доля) |
| Обязанность | Для всех резидентов NL |

### Испания: INSS/CatSalut

При работе через испанскую компанию — автоматически.

---

## Стратегия по этапам

| Этап | Страховка |
|------|----------|
| До переезда + первые 3-6 мес | SafetyWing Nomad ($45+) |
| Трудоустройство в EU | Местная GKV/Zorgverzekering |
| Фрилансер/DN без local работы | Cigna Global / AXA (excl USA; $150-300) |

---

## Итого

Медицинская страховка экспата 2026: SafetyWing Nomad ($45-130/мес) — для первых месяцев и DN; Cigna Global / AXA International ($150-500/мес; IPMI) — для долгосрочных без local работы; в EU при трудоустройстве — GKV (DE) / Zorgverzekering (NL) автоматически (€100-700/мес); Ключевые параметры: excl USA (на 30-40% дешевле), deductible $250+ (снижает premie), annual limit $5M, pre-existing 1-2 года.
`,
  },
  {
    slug: 'polsha-krakov-varsava-it-pereezd-2026',
    title: 'Польша: Варшава и Краков для IT в 2026 году — визы, карта побыту, зарплаты',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Польша Варшава Краков IT 2026: Карта побыту (Karta Pobytu; основной ВНЖ Польши; через работодателя; Jednolite Zezwolenie на pobyt i prace — единое разрешение на проживание + работу; срок 1-3 года с продлением; ПМЖ Karta Stałego Pobytu через 5 лет; гражданство через 5 лет проживания с непрерывным ВНЖ + B1 польского; критерии для Blue Card EU Польши: зарплата ≥5 285 PLN/мес gross в 2024; высшее образование; 1,5 года ВНЖ на Blue Card → далее Karta Stałego Pobytu); IT-компании Польши: Asseco Group (крупнейшая IT компания в Центральной Европе по рыночной кап; WSE Warsaw; $1.5B); Allegro (польский Amazon; WSE; e-commerce #1 PL; $6B cap); CD Projekt Red (ведьмак/Cyberpunk; WSE; мировая слава); Comarch (телеком+IT; Краков); ING Bank Polska tech; PKO BP IT; mBank tech; ABB Poland; Motorola Solutions Краков; Google Warsaw; Amazon Development Center Poland (Варшава/Gdansk); Microsoft Poland; Samsung R&D Польша; GlobalLogic (HCL); Capgemini Польша; Luxoft Poland; Accenture Poland',
    seo_description: 'Польша Варшава Краков IT 2026: VISA ДО ПОЛЬШИ: работа через польского работодателя; работодатель подаёт Wniosek (заявку) в Urząd Wojewódzki; Jednolite Zezwolenie na Pobyt i Pracę (единое разрешение на проживание+работу); срок рассмотрения 30-180 дней (бэклог большой; с 2022 много украинцев); для EU Blue Card: зарплата ≥1.5× средней по секторам (в IT 2024: ≥PLN 7 200-9 000/мес gross зависит от подтверждения); ПМЖ: Karta Stałego Pobytu через 5 лет; гражданство: через 5 лет + B1 польского; НАЛОГИ ПОЛЬШИ: PIT (НДФЛ) прогрессивный: 12% до 120 000 PLN/год; 32% свыше 120 000 PLN/год; Premia podatkowa (tax-free amount): PLN 30 000/год (новое с 2022); Ryczalt для IT: 12% (код PKD 62.01/62.02); это vмене прогрессивного (подходит при доходе >120k PLN); ZUS (Social Insurance): Ubezpieczenie społeczne + Ubezpieczenie zdrowotne; для ИП (JDG): PLN 1 500-2 500/мес; для сотрудника: работодатель платит ~22%; работник ~13.71%; ЗАРПЛАТЫ IT Польша: Junior Dev PLN 5 000-9 000/мес gross ($1 230-2 210); Middle PLN 9 000-16 000/мес ($2 210-3 930); Senior PLN 15 000-25 000/мес ($3 680-6 140); Lead/Principal PLN 20 000-35 000/мес; CD Projekt Senior: PLN 20 000-30 000; Allegro Senior: PLN 18 000-28 000; Google Poland Senior: PLN 25 000-45 000; СТОИМОСТЬ ЖИЗНИ ВАРШАВА: аренда 1BR (Srodmiescie/Mokotow) PLN 3 500-6 000/мес ($860-1 470); (Ursynow/Wola) PLN 2 500-4 000/мес; продукты PLN 800-1 500/мес; транспорт (ZTM Варшавы) PLN 78/мес (Karta Miejska); жизнь итого PLN 5 000-9 000/мес = $1 230-2 210; КРАКОВ: аренда 1BR (Stare Miasto/Kazimierz) PLN 2 500-4 500/мес; (Podgorze/Bronowice) PLN 1 800-3 000/мес; жизнь PLN 4 000-7 000/мес = $980-1 720; ПОЛЬСКИЙ ЯЗЫК: обязателен для ПМЖ (B1) и гражданства; в IT компаниях Варшавы/Кракова: английский рабочий язык (особенно в международных); русский понимают (схожесть языков помогает); польский учить: 500-600 часов до B1 (Polyglot/Duolingo/iTalki; польский легче для носителей русского чем немецкий); РАЙОНЫ Варшавы: Mokotow (деловой/жилой; IT офисы); Srodmiescie (центр; дороже); Wola (деловой квартал + рост); Ursus/Ursynow (тише; дешевле).',
    content_md: `# Польша: Варшава и Краков для IT — ближайшая EU страна к России

Польша — ближайший EU-сосед. CD Projekt Red (Ведьмак), Allegro ($6B), Amazon Development Center. Цены ниже западной Европы на 40-60%.

## Кarta Pobytu: разрешение на проживание+работу

| Параметр | Значение |
|---------|---------|
| Тип | Jednolite Zezwolenie na Pobyt i Pracę |
| Подаёт | Работодатель в Urząd Wojewódzki |
| Срок рассмотрения | 30-180 дней |
| ВНЖ | 1-3 года с продлением |
| ПМЖ | После 5 лет |

---

## Налоги Польши

| Параметр | Значение |
|---------|---------|
| НДФЛ (до 120k PLN/год) | **12%** |
| НДФЛ (свыше 120k PLN) | 32% |
| Налоговый вычет | PLN 30 000/год (не облагается) |
| Ryczalt для IT (PKD 62) | **12%** (flat) |

**ZUS (социальное) для ИП:** PLN 1 500-2 500/мес

**Для сотрудника:** работодатель платит ~22%, работник ~13.71%

---

## IT-компании Польши

| Компания | Профиль | Факт |
|---------|---------|------|
| **CD Projekt Red** | AAA игры (Ведьмак/Cyberpunk) | WSE; мировой масштаб |
| **Allegro** | E-commerce #1 PL | WSE; $6B cap |
| **Asseco Group** | Enterprise IT | WSE; $1.5B; крупнейший в ЦЕ |
| **Comarch** | Telecom+IT | Kraków HQ |
| **Amazon Dev Poland** | Cloud/AWS | Варшава + Gdansk |
| **Google Poland** | R&D | Варшава |
| **Samsung R&D** | Tech research | Польша |

---

## Зарплаты IT в Польше

| Уровень | PLN/мес | USD/мес |
|---------|---------|---------|
| Junior | 5 000-9 000 | $1 230-2 210 |
| Middle | 9 000-16 000 | $2 210-3 930 |
| Senior | 15 000-25 000 | $3 680-6 140 |
| CD Projekt Senior | 20 000-30 000 | $4 910-7 360 |
| Google PL Senior | 25 000-45 000 | $6 140-11 050 |

---

## Варшава vs Краков

| Критерий | Варшава | Краков |
|---------|---------|--------|
| Аренда 1BR (центр) | PLN 3 500-6 000 | PLN 2 500-4 500 |
| Аренда 1BR (эконом) | PLN 2 500-4 000 | PLN 1 800-3 000 |
| Жизнь итого | PLN 5 000-9 000 | PLN 4 000-7 000 |
| Жизнь в USD | $1 230-2 210 | $980-1 720 |
| IT-компании | Amazon/Google/Allegro | Comarch/Motorola/Capgemini |
| Атмосфера | Столица, динамичная | Студенческая, историческая |

---

## Польский язык

| Параметр | Значение |
|---------|---------|
| Для ПМЖ | B1 польского (Karta Stałego Pobytu) |
| Для гражданства | B1 (устный тест) |
| Трудность | Легче немецкого для носителей русского |
| Срок до B1 | ~500 часов (12-18 мес по 1 час/день) |

В международных IT-компаниях (Amazon/Google/CD Projekt) — рабочий язык английский.

---

## Итого

Польша Варшава Краков IT 2026: Karta Pobytu (через работодателя; 30-180 дней; 1-3 года); НДФЛ 12% до 120k PLN + Ryczalt 12% для ИП-разработчиков; CD Projekt Red/Allegro/Amazon/Google; Senior PLN 15 000-25 000/мес ($3 680-6 140); жизнь Краков $980-1 720/мес (дешевле Варшавы); польский B1 для ПМЖ через 5 лет. Лучшая точка входа в EU для тех кто хочет дешёвую жизнь + EU-резидентуру + близость к России.
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
console.log(`\nБатч 181: ${ok} OK, ${err} ошибок`);

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
    slug: 'yaponiya-tokio-osaka-it-pereezd-2026',
    title: 'Япония Токио Осака IT переезд 2026: Highly Skilled Professional, SoftBank, аниме',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Япония Токио Осака IT переезд 2026 Highly Skilled Professional SoftBank аниме',
    seo_description: 'Япония IT 2026 Токио Осака Highly Skilled Professional SoftBank Fujitsu аниме жизнь: ЯПОНИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ЯПОНИЯ: УНИКАЛЬНАЯ КУЛЬТУРА: аниме; манга; катана; суши; онсен; сакура; Фудзи; каллиграфия; Дзен-буддизм; БЕЗОПАСНОСТЬ: Global Peace Index #10; забытые вещи возвращают; нет уличной преступности; ТРАНСПОРТ: синкансэн (Shinkansen) 300+ км/ч точнее часов; метро Токио = самое сложное и идеальное в мире; ПРАВИТЕЛЬСТВО ПООЩРЯЕТ ИНОСТРАННЫХ IT: Highly Skilled Professional Visa с баллами; упрощение ПМЖ до 1-3 лет; ИСТОРИЯ: самурайская эра; сёгунат Токугава; Мэйдзи-реставрация; WW2 и возрождение; экономическое чудо 1960-80х; ПРИРОДА: гора Фудзи (3 776 м; UNESCO); Никко (мавзолей Тосёгу; UNESCO); Ки-ии (паломнические тропы; UNESCO); острова Рюкю; Хоккайдо (лыжи; сашими); АНИМЕ КУЛЬТУРА: Studio Ghibli (Тоторо; Сенидзя; Мой сосед Тоторо; Принцесса Мононоке); One Piece; Naruto; Demon Slayer; Akihabara (Токио) = мекка аниме и электроники; ВРЕМЕННАЯ ЗОНА: JST UTC+9 (EU: разница 7-9 ч; работать параллельно с EU = сложно!); ВИЗЫ ЯПОНИЯ: 1. ENGINEER/SPECIALIST IN HUMANITIES/INTERNATIONAL SERVICES VISA: стандартная рабочая виза через работодателя; нужен sponsor; 3-5 лет; 2. HIGHLY SKILLED PROFESSIONAL VISA (HSP): балльная система (Academic Background; Career history; Annual Salary; Age; Japan-specific); 70+ баллов = ВНЖ 5 лет; ПМЖ через 3 года вместо 10!; 80+ баллов = ПМЖ через 1 год!; РАСЧЁТ БАЛЛОВ: PhD/Master в IT: +20 баллов; топ-50 ВУЗ мирового рейтинга: +10 баллов; работа в JP компании: +10; Salary JPY 6M+: +10; до 35 лет: +10-15; бонус за диплом; ГРАЖДАНСТВО: через 5 лет ПМЖ (или 10 лет легального проживания); двойное: НЕ ДОПУСКАЕТСЯ (нужно выбирать); паспорт Японии: 193 страны (#2 в мире вместе с Сингапуром!); 3. SPECIFIED SKILLED WORKER (SSW): для определённых профессий; 4. GLOBAL TALENT VISA (2023): для топ-IT специалистов; J-Startup выпускники; РЫНОК IT ЯПОНИЯ: SOFTBANK ($62B; телеком + Vision Fund; инвестиции в Arm; Uber; WeWork; ByteDance); SONY ($100B; PlayStation; музыка; кино; сенсоры); TOYOTA TECH (Connected Car; автопилот); NINTENDO (игры; Switch); FUJITSU (IT-сервисы; квантовые компьютеры); NTT DATA ($14B; IT-аутсорсинг; 100k+ сотрудников); HITACHI VANTARA; LINE (Naver; мессенджер 90M+ в JP/KR/TW); MERCARI ($3B; C2C marketplace); SmartNews ($1.2B); COOKPAD (рецепты; IPO); ЗАРПЛАТЫ IT ЯПОНИЯ (GROSS JPY; 1 USD = 155 JPY 2024): LOCAL: Junior: JPY 4-6M/год ($25 806-38 710); Middle: JPY 6-10M ($38 710-64 516); Senior: JPY 10-18M ($64 516-116 129); SONY/SoftBank Senior: JPY 14-25M ($90 000-161 290); GOOGLE JP (один из лучших работодателей JP): JPY 18-35M ($116 000-225 806); REMOTE EU/US: $5 000-15 000 (при жизни в Японии = отличный вариант); НАЛОГИ ЯПОНИЯ: НДФЛ: 5% до JPY 1.95M; 10% до JPY 3.3M; 20% до JPY 6.95M; 23% до JPY 9M; 33% до JPY 18M; 40% до JPY 40M; 45% свыше; Resident Tax: 10% дополнительно; при JPY 10M/год gross: ~28-30% эффективная ставка; СТОИМОСТЬ ЖИЗНИ ЯПОНИЯ 2026: ТОКИО: АРЕНДА (ДОРОГО): 1K (1-комн) Shinjuku; Shibuya; Roppongi: JPY 120 000-200 000/мес ($774-1 290); 2LDK (2-комн + гостиная) центр: JPY 200 000-350 000 ($1 290-2 258); 2LDK Itabashi; Nerima; Edogawa (дальше): JPY 130 000-200 000 ($839-1 290); ОСАКА: 2LDK Namba; Shinsaibashi: JPY 100 000-180 000 ($645-1 161); ПРОДУКТЫ: ramen (лапша): JPY 800-1 200 ($5.16-7.74); sushi kaitenzushi (конвейер): JPY 2 000-4 000; obento из конбини: JPY 500-700; onigiri: JPY 120-180; продукты из Aeon; Ito Yokado: JPY 30 000-60 000/мес ($193-387); ТРАНСПОРТ: метро IC Card (Suica; Pasmo): JPY 250-500/поездка; месячный Teiki от Shinjuku до офиса: JPY 15 000-25 000; КЛИМАТ: 4 сезона; Токио: зима +3; лето +35 (очень влажно; Tsuyu = сезон дождей июнь-июль); сакура: март-апрель (Hanami); осень: момидзи (красные листья)',
    content_md: `# Япония Токио Осака IT 2026: HSP виза, ПМЖ за 1-3 года, SoftBank, аниме

Япония — уникальная культура, безопасность #10 в мире, паспорт #2. HSP Visa (Highly Skilled Professional): 80+ баллов = ПМЖ через 1 год. SoftBank ($62B), Sony ($100B), Nintendo. Remote EU/US + жизнь в Токио — лучший вариант.

---

## Highly Skilled Professional Visa — баллы

| Критерий | Баллы |
|---------|------|
| Диплом PhD/Master IT | +20 |
| Топ-50 ВУЗ мирового рейтинга | +10 |
| Работа в японской компании | +10 |
| Зарплата JPY 6M+ ($38 700+) | +10 |
| Возраст до 35 лет | +10-15 |
| **70+ баллов = ПМЖ через 3 года** | — |
| **80+ баллов = ПМЖ через 1 год** | — |

---

## IT-экосистема

| Компания | Оценка | Профиль |
|---------|--------|---------|
| Sony | $100B | PlayStation; сенсоры; музыка |
| SoftBank | $62B | Telecom; Vision Fund (ARM; Uber) |
| Nintendo | — | Switch; Mario; Zelda |
| NTT Data | $14B | IT-аутсорсинг; 100k+ сотрудников |

---

## Стоимость жизни

| Город/Район | Аренда 2-комн (JPY/мес) | USD |
|-------------|------------------------|-----|
| Токио центр | 200 000-350 000 | $1 290-2 258 |
| Токио пригород | 130 000-200 000 | $839-1 290 |
| Осака | 100 000-180 000 | $645-1 161 |

---

## Итого

Япония IT 2026: HSP Visa с баллами (ПМЖ за 1-3 года!); паспорт #2 мира (193 страны); Sony ($100B); SoftBank; Nintendo; синкансэн (300 км/ч); сакура (март-апрель); аниме Акихабара; онсен; sumo; ramen JPY 800-1 200; двойное гражданство ЗАПРЕЩЕНО; EU-remote сложно (timezone +9); японский язык = обязателен для интеграции.
`,
  },
  {
    slug: 'irlandiya-dublin-it-pereezd-2026',
    title: 'Ирландия Дублин IT 2026: Critical Skills, Google, Meta, Apple EMEA, Celtic Tiger 2.0',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Ирландия Дублин IT 2026 Critical Skills Google Meta Apple EMEA Celtic Tiger 2.0',
    seo_description: 'Ирландия Дублин IT 2026 Critical Skills Employment Permit Google Meta Apple EMEA: ИРЛАНДИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ИРЛАНДИЯ: SILICON VALLEY OF EUROPE: Google; Meta; Apple; Microsoft; Amazon; LinkedIn; Twitter(X); Airbnb; Stripe; Salesforce — все имеют EMEA или International HQ в Дублине; НАЛОГ НА ПРИБЫЛЬ: 12.5% — исторически самый низкий в EU (это почему все tech-гиганты выбрали Ирландию); АНГЛИЙСКИЙ: родной язык (плюс ирландский гэльский); КУЛЬТУРА: пабы; Guinness; Irish pub; Kilkenny; Celtic music; Game of Thrones съёмки; зелёные холмы; кельтская история; ИСТОРИЯ: Viking Town (Дублин от Dubh Linn — черная лужа); Norman conquest; British colonial; Easter Rising 1916; независимость 1922; EU с 1973; Celtic Tiger (1990-2000е); Celtic Tiger 2.0 (2010е-настоящее); ПРИРОДА: Cliffs of Moher (скалы 200м; вертикальные над Atlantic); Ring of Kerry (побережье); Wicklow Mountains; Giant Causeway (Северная Ирландия; UNESCO); Wild Atlantic Way; ВРЕМЕННАЯ ЗОНА: GMT UTC+0/+1; идеально для EU-remote и US-remote; ВИЗЫ ИРЛАНДИЯ: 1. CRITICAL SKILLS EMPLOYMENT PERMIT (КЛЮЧЕВАЯ): для высококвалифицированных специалистов из Critical Skills Occupations List; IT = в списке; УСЛОВИЯ: предложение о работе от ирландского работодателя; зарплата: для IT минимум EUR 32 000/год (в большинстве случаев); для не-Critical Skills работ: EUR 34 000+; СРОК: 2 года; потом General Employment Permit = ещё 3 года; ПМЖ через 5 лет легального проживания; 2. GENERAL EMPLOYMENT PERMIT: для других специальностей; 3. STAMP 4: статус позволяет жить и работать без работодателя-спонсора; получают через брак с гражданином; через ПМЖ; через беженство; ПМЖ: через 5 лет; ГРАЖДАНСТВО: через 5 лет ПМЖ (итого 5 лет ПМЖ включая 5 лет permit!); по расширенному пути: 5 из 9 последних лет = гражданство; EU-паспорт Ирландии: 190+ стран безвизово; особая ценность после Brexit (ирландский паспорт = единственный EU-паспорт работающий в UK!); двойное: разрешено Ирландией!; РЫНОК IT ИРЛАНДИЯ: GOOGLE EMEA HQ Дублин (реальные R&D + EMEA operations; тысячи сотрудников); META EMEA Дублин (реальный офис; нет 5 000+); APPLE EMEA HQ Корк (европейское HQ); MICROSOFT EMEA Дублин; AMAZON AWS EMEA Дублин; LINKEDIN HQ вне США; TWITTER(X) EMEA; AIRBNB EMEA; STRIPE (основатели из Ирландии; Collison brothers; крупный офис); SALESFORCE EMEA; HubSpot EMEA; ZENDESK; SHOPIFY EMEA; WORKDAY; ORACLE; SAP; PFIZER (не IT но крупнейший работодатель); KIRRA; WORKDAY EMEA; ZUORA; ЗАРПЛАТЫ IT ИРЛАНДИЯ (GROSS EUR): Junior: EUR 35 000-55 000/год; Middle: EUR 55 000-85 000; Senior: EUR 85 000-140 000; Google/Meta/Amazon EMEA Senior: EUR 100 000-200 000+ (total comp; включая RSU); НАЛОГИ ИРЛАНДИЯ: PAYE (Pay As You Earn): 20% первые EUR 42 000; 40% свыше; USC (Universal Social Charge): до 2%: 0.5%; 2%-12 012: 2%; 12 012-70 044: 4.5%; 70 044+: 8%; PRSI: 4%; фактически при EUR 80 000: эффективная ставка ~36-40%; СТОИМОСТЬ ЖИЗНИ ИРЛАНДИЯ 2026: ДУБЛИН (ОДИН ИЗ ДОРОЖИХ ГОРОДОВ EU): АРЕНДА (ЖИЛИЩНЫЙ КРИЗИС хуже Амстердама!): 2-комн City Centre; D2; D4: EUR 2 500-4 000/мес; 2-комн D7; D8; D12 (немного дальше): EUR 1 800-2 800; 2-комн пригород (Sandyford; Blanchardstown; Clondalkin): EUR 1 500-2 200; КОРК (второй город; Apple HQ; дешевле на 30%): 2-комн: EUR 1 200-2 000; ПРОДУКТЫ: full Irish breakfast (rashers; sausages; black pudding; eggs; beans): EUR 10-18; fish and chips: EUR 8-15; Guinness в пабе: EUR 5-7 (Дублин); продукты из Lidl; Aldi; Dunnes: EUR 400-700/мес; ТРАНСПОРТ: Leap Card (автобус+DART+Luas+поезд); EUR 2-3/поездка; месячный: EUR 80-120; КЛИМАТ: temperate oceanic; зима +5 (дождь; ветер; но редко снег); лето +16-22 (не жарко; часто пасмурно); дождь ~150 дней/год (Ирландия = не зря зелёная)',
    content_md: `# Ирландия Дублин IT 2026: Critical Skills, Google/Meta EMEA, EU паспорт с двойным

Ирландия — европейская Кремниевая долина. Google; Meta; Apple; Microsoft; Amazon; Stripe — все EMEA HQ в Дублине или Корке. Critical Skills Employment Permit. EU паспорт с разрешением двойного гражданства. Senior EUR 85-140k, EMEA-гиганты до EUR 200k+.

---

## Critical Skills Employment Permit

| Параметр | Значение |
|---------|---------|
| Список профессий | IT — в Critical Skills List |
| Минимальная зарплата | EUR 32 000+/год |
| Срок | 2 года → General Permit 3 года → ПМЖ 5 лет → гражданство |
| Двойное гражданство | **Разрешено!** (редкость в EU) |

---

## EMEA-гиганты в Дублине

| Компания | Профиль |
|---------|---------|
| Google EMEA | HQ; тысячи инженеров |
| Meta EMEA | HQ; 5 000+ |
| Apple EMEA | HQ в Корке |
| Stripe | Основатели ирландцы; крупный офис |
| LinkedIn; Airbnb; Shopify EMEA | Офисы |

---

## Стоимость жизни

| Район | Аренда 2-комн EUR/мес |
|-------|---------------------|
| Дублин центр D2/D4 | €2 500-4 000 |
| Дублин D7/D8 | €1 800-2 800 |
| Дублин пригород | €1 500-2 200 |
| **Корк (Apple)** | **€1 200-2 000** |

---

## Итого

Ирландия IT 2026: Critical Skills Permit; Google/Meta/Apple EMEA HQ; Senior EUR 85-140k; EU паспорт (190+ стран) с РАЗРЕШЕНИЕМ ДВОЙНОГО; ирландский паспорт = единственный EU-паспорт для UK; Stripe (ирландские основатели); Guinness EUR 5-7; fish and chips; Cliffs of Moher; Ring of Kerry; жилищный кризис хуже Амстердама (аренда EUR 2 500+ в центре); дождь 150 дней/год.
`,
  },
  {
    slug: 'shveytsariya-tsurik-geneva-it-2026',
    title: 'Швейцария Цюрих Женева IT 2026: зарплаты CHF 15 000+, UBS, Google, CERN, нейтралитет',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Швейцария Цюрих Женева IT 2026 зарплаты CHF 15000 UBS Google CERN нейтралитет',
    seo_description: 'Швейцария Цюрих Женева IT 2026 CHF 15000 UBS Google CERN нейтралитет горы: ШВЕЙЦАРИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ШВЕЙЦАРИЯ: САМЫЕ ВЫСОКИЕ ЗАРПЛАТЫ IT В ЕВРОПЕ: CHF 15 000-30 000/мес gross (Senior) = EUR 15 700-31 500; в USD = $17 000-34 000; несмотря на высокий налог и стоимость жизни = остаток выше чем в EU; НЕЙТРАЛИТЕТ: политический с 1815; НАТО и EU не является членом; штаб-квартиры ООН; ВОЗ; МОТ; ICRC в Женеве; ПРИРОДА: Альпы (Маттерхорн 4 478 м; Юнгфрау 4 158 м); озера (Цюрих; Женева; Лугано; Тун); горнолыжные курорты (Verbier; Zermatt; St. Moritz; Davos/WEF); CERN: в Женеве; крупнейший ускоритель частиц в мире; Большой Адронный Коллайдер; КАЧЕСТВО ЖИЗНИ: Zürich = #1 Quality of Life город мира (EIU; Mercer) многие годы; ЯЗЫКИ: немецкий (Цюрих; Берн; Базель); французский (Женева; Лозанна); итальянский (Лугано; Тичино); романшский (Граубюнден); English = рабочий в tech; ВРЕМЕННАЯ ЗОНА: CET UTC+1/+2; идеально EU; ИСТОРИЯ: Гельветическая конфедерация; Вильгельм Телль; Реформация (Цвингли; Кальвин); банковская тайна (ослаблена); Давос WEF; часовая промышленность (Rolex; Patek Philippe; Omega); ВИЗЫ ШВЕЙЦАРИЯ: ВАЖНО: Швейцария НЕ в EU (не ЕЭЗ в смысле рынка труда); НО: часть Schengen; и имеет Bilateral Agreements с EU; EU/EFTA граждане: свободное перемещение; НЕ-EU ГРАЖДАНЕ (в т.ч. РФ): нужна рабочая виза; КВОТЫ: Швейцария устанавливает квоты на рабочие визы для non-EU; ОГРАНИЧЕНИЕ: количество разрешений ограничено; работодатель должен доказать что не нашел EU-кандидата (Priority Check); категории: B Permit (1 год renewable) и C Permit (5 лет = ПМЖ аналог); ГРАЖДАНСТВО: через 10 лет ПМЖ (C Permit); кантональные различия; двойное: разрешено с 2014!; паспорт Швейцарии: 186 стран безвизово; РЫНОК IT ШВЕЙЦАРИЯ: GOOGLE EUROPE HQ Цюрих (крупнейший инженерный офис вне США; 5 000+ сотрудников); UBS ($78B; банк; крупный tech-стек); CREDIT SUISSE (теперь часть UBS); ABB ($35B; промышленная автоматизация; robotics); NESTLE TECH (цифровая трансформация; Vevey); ROCHE (медицинская технология; диагностика; Базель); NOVARTIS (pharmatech; Базель); ZURICH INSURANCE GROUP; SWISS RE; TEMENOS ($2B; banking software); AVALOQ ($1B; private banking software); CERN (физика частиц; Женева; огромный IT-стек; OpenStack контрибьютор; 10 000+ компьютеров); ETH ZURICH (топ-10 ВУЗов мира; tech spin-offs); ЗАРПЛАТЫ IT ШВЕЙЦАРИЯ (GROSS CHF; 1 CHF = 1.05 EUR/1.15 USD): Junior: CHF 90 000-120 000/год ($103 500-138 000); Middle: CHF 120 000-170 000 ($138 000-195 500); Senior: CHF 170 000-280 000 ($195 500-322 000); GOOGLE ZURICH: CHF 200 000-400 000+ ($230 000-460 000; total comp); НАЛОГИ ШВЕЙЦАРИЯ: кантональные различия! ЦЮРИХ (кантон): federal + cantonal + municipal; при CHF 200 000 gross = ~25-30% total; ЦУГ (ZUG; самый льготный кантон): ~17-22%; ЖЕНЕВА: ~35-40% (один из самых дорогих кантонов!); ЛОЗАННА (Во): ~30-35%; Паушальное налогообложение (Lump Sum): для богатых иностранцев; налог на стоимость жизни вместо дохода; СТОИМОСТЬ ЖИЗНИ ШВЕЙЦАРИЯ 2026: ЦЮРИХ: АРЕНДА (САМЫЙ ДОРОГОЙ ГОРОД МИРА): 2-комн Kreis 4; 5 (expat/trendy): CHF 3 000-5 000/мес ($3 450-5 750); 2-комн Altstetten; Oerlikon (дальше): CHF 2 000-3 500; ЖЕНЕВА: 2-комн: CHF 2 500-4 500; БАЗЕЛЬ: 2-комн: CHF 1 800-3 000; ПРОДУКТЫ: fondue (сырное фондю): CHF 25-40 в ресторане; raclette: CHF 20-35; Migros (бюджетный) или Coop: CHF 600-1 000/мес; бигмак: CHF 7-10 (Big Mac Index = CHF =самый дорогой); кофе: CHF 4-7; ТРАНСПОРТ: ZVV (Цюрих; метро+трамвай+автобус+лодки); месячный: CHF 100-130; Swiss Pass (поезда по всей стране): CHF 300-500/мес',
    content_md: `# Швейцария Цюрих Женева IT 2026: CHF 170-280k Senior, Google EMEA, CERN

Швейцария — самые высокие IT-зарплаты Европы. Senior CHF 170-280k/год ($195-322k). Google Европейский HQ в Цюрихе (5 000+ инженеров). ETH Zurich (топ-10 мира). Цюрих = #1 Quality of Life город мира. CERN (Большой Адронный Коллайдер) в Женеве.

---

## Зарплаты IT

| Уровень | CHF/год | USD/год |
|---------|---------|---------|
| Junior | 90 000-120 000 | $103 500-138 000 |
| Middle | 120 000-170 000 | $138 000-195 500 |
| **Senior** | **170 000-280 000** | **$195 500-322 000** |
| Google Zurich | 200 000-400 000+ | $230 000-460 000 (total comp) |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| **Google Europe HQ** | **Цюрих; 5 000+ инженеров; крупнейший офис вне США** |
| UBS | $78B; банк; крупный tech-стек |
| CERN | Большой Адронный Коллайдер; Женева; огромный IT |
| ETH Zurich | Топ-10 ВУЗов мира; spin-offs |

---

## Налоги по кантонам

| Кантон | Эффективная ставка (CHF 200k) |
|--------|------------------------------|
| Zug (Цуг) | 17-22% — самый льготный |
| Zurich (Цюрих) | 25-30% |
| Vaud (Лозанна) | 30-35% |
| Geneva (Женева) | 35-40% — один из дорогих |

---

## Итого

Швейцария IT 2026: самые высокие зарплаты EU (CHF 170-280k Senior); Google Europe HQ Цюрих (5 000+); CERN (Женева); ETH Zurich (топ-10); нейтралитет; Цюрих #1 Quality of Life; CHF = самая дорогая валюта (бигмак CHF 10); аренда CHF 2 000-5 000; квоты на рабочие визы для non-EU (ограничено); гражданство через 10 лет; двойное РАЗРЕШЕНО.
`,
  },
  {
    slug: 'kak-pereekhat-v-germaniyu-it-2026',
    title: 'Как переехать в Германию IT 2026: Opportunity Card, Blue Card, SAP, немецкий, документы',
    tag: 'переезд',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как переехать в Германию IT 2026 Opportunity Card Blue Card SAP немецкий документы',
    seo_description: 'Переехать Германию IT 2026 Opportunity Card Blue Card SAP Siemens немецкий: КАК ПЕРЕЕХАТЬ В ГЕРМАНИЮ IT 2026 — ПОШАГОВЫЙ ГАЙД: ПОЧЕМУ ГЕРМАНИЯ ДЛЯ IT: КРУПНЕЙШАЯ ЭКОНОМИКА EU; дефицит IT-специалистов 700 000 вакансий (по данным Bitkom 2023); SAP ($200B); Siemens; BMW Tech; Mercedes-Benz Tech; Volkswagen Cariad; Zalando ($5B); ВИЗОВЫЕ ПУТИ 2026: 1. EU BLUE CARD (EU BLAUE KARTE): ТРЕБОВАНИЯ: диплом (признанный в Германии); контракт с зарплатой MIN EUR 58 400/год для IT (shortage occupation); немецкий язык: не обязателен для получения; НО нужен для жизни; ПОЛУЧЕНИЕ: в немецком посольстве РФ (ограничено после 2022; время ожидания 3-12 мес); ВНЖ: 4 года Blue Card; ПМЖ через 2 года (при B1 немецкий); или через 33 мес без; ГРАЖДАНСТВО: через 5-8 лет (реформа 2024 сократила с 8 до 5 лет!); двойное: разрешено с 2024 (РЕФОРМА!); ранее нужно было отказываться от гражданства РФ; теперь можно сохранить; 2. OPPORTUNITY CARD (CHANCENKARTE): новый с 2024!; для поиска работы в Германии без предварительного предложения; БАЛЛЫ (нужно 6 из 13): немецкий B1+: +6; английский B2+: +4; диплом Германии или признанный: +4; немецкий опыт учёбы/работы: +4; возраст до 35 лет: +4; опыт управления: +3; диплом топ-ВУЗа: +4; прочее: по 1-2 балла; 1 год на поиск работы; можно работать 20 ч/нед пока ищешь; ПРЕИМУЩЕСТВО: приехать → найти работу на месте → перейти на Blue Card; 3. SKILLED IMMIGRATION ACT 2023 (FACHKRAEFTEZUWANDERUNGSGESETZ): расширение → признание иностранного опыта работы без диплома (для IT!); потенциально проще для опытных специалистов; 4. FREELANCER VISA: для фрилансеров; нужно доказать нишу; клиентов; доход; ПРИЗНАНИЕ ДИПЛОМА: через anabin.kmk.org (проверить твой ВУЗ); если не признан: через ENIC-NARIC или через оценку IQ.NRW; для IT-специалистов с опытом: возможен путь без формального признания (через 2023 реформу); ШАГ 2: ОТКРЫТИЕ БАНКОВСКОГО СЧЕТА (до переезда): DEUTSCHE BANK; N26 (онлайн; без Anmeldung); DKB (онлайн; лучший для путешественников); Commerzbank; Sparkasse (требует Anmeldung!); ШАГ 3: ЖИЛЬЁ И ANMELDUNG: ANMELDUNG = РЕГИСТРАЦИЯ ПО МЕСТУ ЖИТЕЛЬСТВА: обязательна в течение 2 нед после переезда; нужен Wohnungsgeberbestaetigung (письмо от арендодателя); делается в Einwohnermeldeamt; без Anmeldung: нет счёта Sparkasse; нет медстраховки; нет Steuernummer; ШАГ 4: МЕДИЦИНСКАЯ СТРАХОВКА: GESETZLICHE KRANKENVERSICHERUNG (GKV): государственная; обязательна; AOK; TK (Techniker Krankenkasse — самая популярная у IT); Barmer; DAK; Взнос: ~14.6% зарплаты (половину платит работодатель); PRIVATE KRANKENVERSICHERUNG (PKV): частная; выгодна при зарплате >EUR 69 300/год; НЕМЕЦКИЙ ЯЗЫК: без B2-C1 немецкого: врач; чиновник; сосед; бюрократия = проблема; IT-компании работают на English; НО для ЖИЗНИ нужен немецкий; РЕСУРСЫ: DW Learn German (бесплатно); Goethe Institut (платно; лучшее); Duolingo (для начала); Anki + немецкие фильмы; РЫНОК IT ГЕРМАНИЯ: SAP ($200B; Waldorf; enterprise software; крупнейшая EU tech-компания); SIEMENS TECH (автоматизация; IoT; Siemens Healthineers); BMW; MERCEDES-BENZ; VW CARIAD (ПО для автомобилей); ZALANDO ($5B; e-commerce; Берлин); AUTO1 ($2B; e-commerce авто; Берлин); CELONIS ($11B; process mining; Берлин/Мюнхен); PERSONIO ($1.7B; HR-tech); CHECK24; IDEALO; TRIVAGO; БИЗНЕС БЕРЛИН; МЮНХЕН; ГАМБУРГ; КЁЛЬН; ФРАНКФУРТ; ЗАРПЛАТЫ IT ГЕРМАНИЯ (GROSS EUR): БЕРЛИН: Junior: EUR 40 000-55 000/год; Middle: EUR 55 000-80 000; Senior: EUR 80 000-130 000; МЮНХЕН (SAP; BMW): Junior: EUR 45 000-65 000; Senior: EUR 90 000-150 000; ГАМБУРГ; ФРАНКФУРТ: схоже с Мюнхеном; НАЛОГИ ГЕРМАНИЯ: прогрессивный НДФЛ: 0% до EUR 11 604; 14% до EUR 66 760; 42% до EUR 277 825; 45% свыше; Solidaritaetszuschlag (допол.): упразднен для большинства; Kirchensteuer (церковный): можно отказаться; при EUR 80 000: ~30-35% эффективная ставка',
    content_md: `# Переезд в Германию IT 2026: Opportunity Card, EU Blue Card, SAP, немецкий

Германия — крупнейшая экономика EU, дефицит 700 000 IT-вакансий. EU Blue Card с 2024: гражданство за 5 лет (было 8), двойное РАЗРЕШЕНО. Opportunity Card: приехать → искать работу 1 год. SAP ($200B), Zalando ($5B), Celonis ($11B).

---

## Визовые пути

| Путь | Условие | Особенность |
|------|---------|------------|
| **EU Blue Card** | Диплом + EUR 58 400+/год | **Гражданство 5 лет; двойное ОК** |
| **Opportunity Card** | 6+ баллов (диплом; немецкий; возраст) | **Приехать без работы; искать 1 год** |
| Skilled Immigration | Опыт без диплома (IT) | Реформа 2023 |
| Freelancer Visa | Нужны клиенты + доход | Сложнее |

---

## Пошаговый план

1. Проверить диплом на [anabin.kmk.org](https://anabin.kmk.org)
2. Набрать 6+ баллов Opportunity Card → виза
3. Открыть N26 или DKB онлайн (до переезда)
4. Найти жильё → Anmeldung в течение 2 нед
5. Оформить Techniker Krankenkasse (TK) медстраховку
6. Найти работу → перейти на Blue Card

---

## Зарплаты IT

| Город | Junior | Senior |
|-------|--------|--------|
| Берлин | €40-55k | €80-130k |
| Мюнхен (SAP; BMW) | €45-65k | €90-150k |
| Гамбург; Франкфурт | €42-60k | €85-140k |

---

## Итого

Германия IT 2026: EU Blue Card (диплом + EUR 58k+ оффер); Opportunity Card (новый с 2024; 1 год поиска без оффера); гражданство за 5 лет (реформа 2024!); двойное гражданство РАЗРЕШЕНО с 2024; SAP ($200B); Zalando ($5B); Celonis ($11B); TK медстраховка; Anmeldung обязательна; немецкий B2 = нужен для жизни (даже если IT-офис на English).
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
console.log(`\nБатч 226: ${ok} OK, ${err} ошибок`);

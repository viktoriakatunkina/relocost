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
    slug: 'irlandiya-dublin-it-pereezd-2026',
    title: 'Ирландия Дублин IT 2026: Critical Skills Permit, Google Meta Apple Amazon, зарплаты EUR 65-110k',
    tag: 'страны',
    read_time: 2,
    country_slug: 'ireland',
    seo_title: 'Ирландия Дублин IT 2026 Critical Skills Permit Google Meta Apple Amazon EMEA зарплаты EUR 65 110k: ИРЛАНДИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ИРЛАНДИЯ: European HQ всех крупнейших tech-гигантов; Google; Facebook/Meta; Apple; LinkedIn; Twitter/X; Amazon; Microsoft; Airbnb; Dropbox; PayPal; Stripe; ACI: EU; английский официальный (ЕДИНСТВЕННАЯ англоязычная страна в EU кроме Мальты!); 12.5% корпоративный налог = привлекает tech; стабильная экономика; ВИЗЫ ИРЛАНДИЯ: 1. CRITICAL SKILLS EMPLOYMENT PERMIT (CSEP): ОСНОВНАЯ ВИЗА ДЛЯ IT; ДЛЯ КОГО: профессии в критическом дефиците (Critical Skills Occupation List); IT = большинство специальностей; ТРЕБОВАНИЯ: оффер EUR 32 000+/год (junior); EUR 64 000+ (senior; более лёгкий путь); диплом ИЛИ опыт; СРОК: 2 года; продление → ПМЖ через 5 лет; СЕМЬЯ: immediate при CSEP (партнёр получает General Employment Permit автоматически!); 2. GENERAL EMPLOYMENT PERMIT: для профессий не в Critical Skills List; требует Labor Market Needs Test (LMNT); работодатель доказывает что нет ирландских кандидатов; дольше и сложнее; 3. INTERNSHIP PERMIT: для студентов/стажёров; 4. SELF-EMPLOYMENT PERMIT: для предпринимателей; доказать бизнес; РЫНОК IT ДУБЛИН: BIG TECH EMEA HQ: Google (Dublin = European HQ; 8 000+ сотрудников); Meta (Facebook Dublin; 4 000+); LinkedIn (European HQ); Twitter/X (European HQ); Microsoft (уволил часть в 2023 НО огромный HQ); Apple (European HQ; Cork + Dublin; 6 000+); Amazon (EMEA Dublin); Airbnb (Dublin); Salesforce (Dublin); HubSpot (Dublin; основан в Ирландии); Stripe (Дублин основан Collisons; US+Dublin); PayPal; eBay; Intercom; Workday; Zendesk; ИРЛАНДСКИЕ TECH: Paddy Power Betfair (Flutter Entertainment; gambling tech); CRH (строительство + tech); Kingspan (zелёные технологии); Hostelworld; Realex Payments (куплен GlobalPayments); Swrve; Buymie; ЗАРПЛАТЫ IT ИРЛАНДИЯ (GROSS EUR): Junior: EUR 35 000-55 000/год; Middle: EUR 55 000-80 000; Senior: EUR 80 000-130 000; Google/Meta Senior Software Engineer: EUR 90 000-200 000 (+ RSU + bonus); Staff Engineer: EUR 130 000-200 000; НАЛОГИ ИРЛАНДИЯ: USC (Universal Social Charge): 0.5% до EUR 12 012; 2% до EUR 22 920; 4% до EUR 70 044; 8% свыше; PAYE (НДФЛ): 20% до EUR 40 000 (для одинокого 2024); 40% свыше; PRSI: 4% (работник); итого эффективная ставка Senior EUR 90 000: ~40-45%; СТОИМОСТЬ ЖИЗНИ ДУБЛИН 2026: ДУБЛИН = ОДИН ИЗ САМЫХ ДОРОГИХ EU (жилищный кризис как в Лондоне); АРЕНДА: студия D1/D2 (центр): EUR 1 800-2 800/мес; 2-комн Rathmines; Ranelagh: EUR 2 500-4 000; Ballsbridge (посольства): EUR 3 000-5 000; пригороды (Bray; Maynooth): EUR 1 500-2 500; Commuter (Kildare; Meath): EUR 1 200-2 000; ПРОБКА В ДУБЛИНЕ: одна из худших в EU; 40-60 мин в час пик на 10 км; рекомендован велосипед или LUAS (трамвай); ПРОДУКТЫ: Lidl; Aldi; Tesco; Supervalu; EUR 500-900/мес; pint Guinness в паб: EUR 6.50-8 (дорого!); fish and chips: EUR 12-20; full Irish breakfast: EUR 12-18; ТРАНСПОРТ: Dublin Bus + LUAS + DART: Leap Card EUR 120-180/мес; КЛИМАТ: умеренный морской; НЕ СОЛНЕЧНО; 170-200 дней дождя/год; 8-18 гр круглый год; редко экстремальные температуры; БЕЗОПАСНОСТЬ: хорошая безопасность; Dublin 1; части Северной стороны: осторожность',
    seo_description: 'Ирландия IT 2026 Дублин жизнь аренда Google Meta Apple: ЖИЗНЬ В ДУБЛИНЕ: ИРЛАНДСКОЕ ОБЩЕСТВО: pub culture; craic (хорошее времяпровождение); сердечные люди; очень дружелюбны к иностранцам; многонациональная среда (Дублин = 20% не ирландского происхождения); МЕДИЦИНА: HSE (Health Service Executive): публичная система; GP visit card: бесплатно при низком доходе; private health insurance: VHI; Laya; Irish Life; EUR 100-200/мес; рекомендована для ускорения доступа; ОБРАЗОВАНИЕ: государственные школы: бесплатно; ETB (Education and Training Boards); Trinity College Dublin; UCD; Dublin City University = отличные; RUSSOAZYCHNOE SOOBSHESTVO: небольшое; Telegram "Русские в Дублине"; "Россияне в Ирландии"; АНГЛИЙСКИЙ: единственная EU-страна с английским → легко найти работу; легко интегрироваться; легко для детей; ПУТЬ К ГРАЖДАНСТВУ: ПМЖ: 5 лет (через CSEP); гражданство: 5 лет легального проживания; БЫСТРЕЕ ЧЕМ БОЛЬШИНСТВО EU; ирландский язык: проверка символическая (не нужен реально); двойное гражданство: РАЗРЕШЕНО; ирландский паспорт: 185 стран; ВАЖНО: после Brexit ирландский паспорт = единственный EU-паспорт для граждан UK (огромный спрос); ПРАУД ФАК (proud fact): 70+ миллионов в мире считают себя ирландцами по происхождению; только 5 млн в Ирландии; БЮДЖЕТ SENIOR DEVELOPER В ДУБЛИНЕ: gross EUR 95 000/год; PAYE 40%: EUR 38 000; USC: EUR 5 500; PRSI 4%: EUR 3 800; net EUR 47 700/год = EUR 3 975/мес; НО: в большинстве Big Tech зарплаты EUR 80 000-150 000 base + RSU!; пример Google L5 Дублин: base EUR 120 000; bonus EUR 18 000; RSU EUR 80 000/год = EUR 218 000 total; после налогов net EUR 105 000/год = EUR 8 750/мес; аренда 2-комн Ranelagh: EUR 3 200; продукты: EUR 700; LUAS: EUR 150; медстраховка: EUR 120; итого расходы: EUR 4 170; остаток: EUR 4 580/мес (для обычного Senior EUR 95k: ОЧЕНЬ МАЛО после налогов и аренды); СТРАТЕГИЯ: Google/Meta/Apple платят значительно выше рынка; именно туда стоит целиться; ITOGO PLYUSY: единственная англоязычная EU-страна (кроме Мальты); Google; Meta; Apple; Amazon; LinkedIn; Stripe (all EMEA HQ!); гражданство 5 лет + двойное OK; ирландский паспорт в EU; дружелюбная среда; MINUSY: САМЫЙ ДОРОГОЙ ГОРОД EU по аренде (кризис как в Лондоне); дождливо (200 дней/год); пробки; НДФЛ 40%+; недостаток жилья критический (National Housing Crisis).',
    content_md: `# Ирландия Дублин IT 2026: Critical Skills Permit, Google Meta Apple EMEA

Ирландия — единственная англоязычная EU-страна, где сидят EMEA HQ всех Tech-гигантов: Google, Meta, Apple, Amazon, LinkedIn, Stripe. Critical Skills Employment Permit — самый прямой путь. Дублин: дорогая аренда (жилищный кризис). Google L5: EUR 218k total comp, net EUR 8 750/мес.

---

## Визы

| Тип | Условие | Срок |
|-----|---------|------|
| **Critical Skills Employment Permit** | Оффер + IT-специальность | 2 года → ПМЖ 5 лет |
| General Employment Permit | LMNT + оффер | 2 года |

Семья: партнёр получает работу автоматически при CSEP.

---

## Big Tech EMEA HQ в Дублине

| Компания | Сотрудников |
|---------|------------|
| Google | 8 000+ |
| Apple (Dublin+Cork) | 6 000+ |
| Meta | 4 000+ |
| LinkedIn; Microsoft; Amazon | Тысячи каждая |
| Stripe; PayPal; Airbnb | — |

---

## IT-зарплаты

| Уровень | EUR/год | EUR/мес net |
|---------|---------|------------|
| Junior | 35-55k | 2 500-3 500 |
| Middle | 55-80k | 3 500-4 800 |
| **Senior** | **80-130k** | **4 500-6 500** |
| Google L5 (total comp) | **EUR 218k** | **EUR 8 750 net** |

---

## Итого

Ирландия IT 2026: единственная EU-страна с английским языком (кроме Мальты); CSEP через оффер в IT (2 года → ПМЖ 5 лет); Google/Meta/Apple EMEA HQ = EUR 150-250k total comp; гражданство 5 лет + двойное OK; ирландский паспорт 185 стран; дождливо 200 дней/год; аренда Дублин EUR 2 500-4 000 (жилищный кризис); рядовой Senior EUR 95k → net EUR 3 975/мес + аренда EUR 3 200 = мало остаётся; целиться в Big Tech с RSU.
`,
  },
  {
    slug: 'italiya-milan-rim-it-pereezd-2026',
    title: 'Италия Милан Рим IT 2026: стартап-виза, Flat Tax 100k, Cedolare Secca, EUR 50-90k',
    tag: 'страны',
    read_time: 2,
    country_slug: 'italy',
    seo_title: 'Италия Милан Рим IT 2026 стартап виза Flat Tax 100k EUR 50 90k стоимость жизни: ИТАЛИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ИТАЛИЯ: EU+Шенген; ОГРОМНАЯ КУЛЬТУРА (искусство; еда; архитектура); Милан = мировой центр дизайна и моды; стартап-виза; FLAT TAX для иностранцев EUR 100 000 = уникально; относительно доступная аренда вне Милана; небольшой IT-рынок но растёт; ВИЗЫ ИТАЛИЯ: 1. NULLA OSTA ПО DECRETO FLUSSI (РАБОТА): ежегодные квоты (decreto flussi); ограниченное кол-во мест в год; через работодателя; для IT = в privileged quota; очень конкурентно (очереди); 2. ITALY DIGITAL NOMAD VISA (2024): введена в 2024; для remote workers и фрилансеров; требования: доход EUR 28 000/год+; работа для иностранной компании; медстраховка; место проживания; СРОК: 1 год; возможно продление; ВАЖНО: относительно новая; детали уточнять; 3. STURTUP VISA ITALIA: для учредителей инновационных стартапов; Italia Startup Visa; через аккредитованный инкубатор; 4. ITALY INNOVATORS VISA: через Italian Trade Agency (ITA); критерии высоки; 5. SELF-EMPLOYMENT (Lavoro Autonomo): если есть итальянские клиенты; 6. EU BLUE CARD: через работодателя; 7. FLAT TAX РЕЗИДЕНТСТВО (100 000 EUR): для состоятельных: переехать в Италию + платить фикс EUR 100 000/год; не зависит от дохода (хоть $10M/год); популярен у крипто-состоятельных; РЫНОК IT ИТАЛИЯ: маленький для размера страны; MICROSOFT ITALIA; Google Italia; Amazon AWS Italia; Oracle Italia; IBM Italia; Accenture Italia; REPLY (IT-консалтинг; EUR 2B; Турин); ENGINEERING Group (EUR 1B+; Рим; крупнейшая IT-компания Италии); VAR Group; ALMAVIVA; Telecom Italia (TIM) tech; Eni digital (нефть); Fiat/Stellantis tech; Ferrari tech (!) модульные системы; PEC (паспорт-электронной-почты); Satispay (fintech; Milan; $2B); Scalapay (BNPL); Prima Assicurazioni; Musixmatch (музыка); Buongiorno (интернет-пионер); ВИА ФАРИНИ (Via Farini; Милан): итальянская Silicon Valley в Сан-Фелис; ЗАРПЛАТЫ IT ИТАЛИЯ (GROSS EUR): Милан: Junior: EUR 28 000-40 000/год; Middle: EUR 40 000-60 000; Senior: EUR 60 000-90 000; ПРЕДЕЛЫ: маленький рынок = зарплаты ниже чем в Германии/Нидерландах на 20-40%; Remote работа для иностранных компаний = решение (американский/немецкий оклад в итальянском городе); НАЛОГИ ИТАЛИЯ: IRPEF (НДФЛ): 23% до EUR 28 000/год; 35% до EUR 50 000; 43% свыше; Addizionale Regionale: до 3.33% (по регионам); Addizionale Comunale: до 0.9%; итого Senior EUR 80 000: ~44-47%; AGEVOLAZIONI IMPATRIATI (Impatriate Tax Regime): для тех кто НЕ жил в Италии последние 3 года: 50% доходов освобождено от IRPEF (ставка на 50% дохода)! на 5 лет; расширения: до 10 лет при определённых условиях; + EUR 1 000 вычет/год за ребёнка; ВАЖНО: 2024 изменена (ужесточена); уточнять актуальные условия',
    seo_description: 'Италия IT 2026 Милан Рим жизнь аренда еда климат: СТОИМОСТЬ ЖИЗНИ ИТАЛИЯ 2026: МИЛАН: дорогой по итальянским меркам; АРЕНДА: 2-комн Navigli; Isola; Porta Romana: EUR 1 400-2 200/мес; Brera; Centro: EUR 2 000-3 500; пригород (Monza; Sesto; Rho): EUR 900-1 400; РОМА (РИМ): 2-комн Trastevere; Prati; Testaccio: EUR 1 300-2 000; EUR; Parioli: EUR 1 800-3 000; ФЛОРЕНЦИЯ: менее дорогая; 2-комн: EUR 1 000-1 600; ТУРИН: дёшево; 2-комн: EUR 700-1 200; Reply HQ; БОЛОНЬЯ: дёшево; университет; EUR 700-1 200; НЕАПОЛЬ: ещё дешевле; EUR 500-900; красивый но специфический; ПРОДУКТЫ: Esselunga; Coop; Conad; Lidl; EUR 350-600/мес; эспрессо: EUR 1-1.50 (стоя у барной стойки); cornetto: EUR 1-2; pranzo (обед в тратторике): EUR 10-20; pizza napoletana (Неаполь): EUR 7-14; паста ресторан: EUR 10-18; вино супермаркет: EUR 3-10; ТРАНСПОРТ: ATM Милан (метро+автобус+трамвай): EUR 39/мес (CARNET 10 поездок); Trenitalia; Italo (поезда): Милан-Рим за 2.5 ч на Frecciarossa ($30-80); велосипед в Милане: BikeMi; КЛИМАТ: разный по регионам; МИЛАН: континентальный; -5 до +30; туман (nebbia) зимой; жарко летом; РИМ: средиземноморский; 5-32 гр; 270 дней солнца; СИЦИЛИЯ; КАЛАБРИЯ; САРДИНИЯ: тропически жарко летом; прекрасны весна/осень; БЕЗОПАСНОСТЬ: хорошая безопасность; карманники в туристических зонах (Рим; Флоренция); скутеры-воры; RUSSOAZYCHNOE SOOBSHESTVO: небольшое но присутствует; Telegram "Русские в Милане"; "Итальянская жизнь"; ИТАЛЬЯНСКИЙ ЯЗЫК: нужен для жизни; курсы в Dantovi (Istituto Dante Alighieri); A2 за 3-4 мес; ПУТЬ К ГРАЖДАНСТВУ: ПМЖ: 5 лет; гражданство: 10 лет (или 3 года для граждан EU + чьи предки итальянцы); ius sanguinis (итальянское происхождение): право на гражданство по предкам-итальянцам (если они у тебя есть!); двойное гражданство: РАЗРЕШЕНО; итальянский паспорт: 188 стран; БЮДЖЕТ SENIOR DEVELOPER В МИЛАНЕ (IMPATRIATI): gross EUR 80 000/год; Impatriati Regime (50% освобождение): облагается EUR 40 000; IRPEF 35-43% от EUR 40 000: EUR 14 000-17 200; net EUR 62 800-66 000/год = EUR 5 233-5 500/мес; аренда 2-комн Navigli: EUR 1 600; продукты: EUR 450; ATM: EUR 40; итого расходы: EUR 2 090; остаток: EUR 3 143-3 410/мес; ITOGO PLYUSY: Impatriati Regime 50% освобождение 5+ лет; Flat Tax EUR 100k для состоятельных; Digital Nomad Visa 2024; Satispay ($2B); Engineering Group (крупнейшая IT Италии); эспрессо EUR 1.50; мировая кухня; климат; искусство; MINUSY: маленький местный IT-рынок (зарплаты ниже EU-топа); итальянский нужен; бюрократия легендарная; гражданство 10 лет; Милан = дорогой.',
    content_md: `# Италия Милан Рим IT 2026: Impatriati 50%, Digital Nomad Visa, EUR 60-90k

Италия — не очевидный выбор для IT (рынок маленький), но: Impatriati Regime даёт 50% освобождение от налогов на 5+ лет, Flat Tax EUR 100k/год для состоятельных, Digital Nomad Visa с 2024. Satispay ($2B), Engineering Group (крупнейшая IT Италии). Эспрессо EUR 1.50.

---

## Визы

| Тип | Условие | Срок |
|-----|---------|------|
| Digital Nomad Visa (2024) | EUR 28k+/год; иностранная компания | 1 год |
| Nulla Osta (Decreto Flussi) | Через работодателя; квоты | 1-2 года |
| EU Blue Card | Через работодателя | 2-4 года |
| Flat Tax | EUR 100k фикс/год (любой доход) | ПМЖ |

---

## Impatriati Regime: налоговая льгота

| | Без льготы | Impatriati (50% освобождение) |
|--|-----------|------------------------------|
| Gross EUR 80k | IRPEF ~43% | IRPEF ~35% от EUR 40k |
| Налог | EUR 34 000 | **EUR 14 000** |
| Экономия | — | **EUR 20 000/год** |

Требование: не жить в Италии последние 3 года. Срок: 5 лет (+ продление).

---

## Стоимость жизни

| Город | Аренда 2-комн | Характер |
|-------|--------------|---------|
| Милан (Navigli) | EUR 1 400-2 200 | Бизнес; дизайн |
| Рим (Trastevere) | EUR 1 300-2 000 | Культура; история |
| Флоренция | EUR 1 000-1 600 | Искусство; туризм |
| **Турин** | EUR 700-1 200 | Reply HQ; дёшево |
| Болонья; Неаполь | EUR 500-1 200 | Дёшево |

---

## Итого

Италия IT 2026: Digital Nomad Visa 2024 (EUR 28k+/год; 1 год); Impatriati Regime 50% освобождение 5+ лет (EUR 20k/год экономия); Satispay ($2B); Engineering Group (крупнейшая IT); местные зарплаты ниже EU-топа (Senior EUR 60-90k); Турин/Болонья дёшево; Милан дорогой; ius sanguinis — гражданство по предкам-итальянцам; бюрократия легендарная; эспрессо EUR 1.50; итальянский нужен.
`,
  },
  {
    slug: 'malta-valletta-digital-nomad-it-2026',
    title: 'Мальта Валлетта IT 2026: Digital Nomad Residence, EU, 300 дней солнца, MFSA fintech',
    tag: 'страны',
    read_time: 2,
    country_slug: 'malta',
    seo_title: 'Мальта Валлетта IT 2026 Digital Nomad Residence EU 300 дней солнца MFSA fintech: МАЛЬТА ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ МАЛЬТА: EU-член + Шенген; 300+ дней солнца; самая маленькая EU-страна (316 кв. км; 550 000 жителей); английский = официальный язык (второй официальный = мальтийский); FINTECH HUB; крипто-регуляция (Blockchain Island); MFSA = Мальтийский финансовый регулятор; исторически дешевле Великобритании/Ирландии; ВИЗЫ МАЛЬТА: 1. NOMAD RESIDENCE PERMIT (DN VISA): введена в 2021; одна из ПЕРВЫХ ОФИЦИАЛЬНЫХ DN в EU; ТРЕБОВАНИЯ: работа для иностранного работодателя (не мальтийского) или фриланс с иностранными клиентами; минимальный ежемесячный доход EUR 2 700 gross (одиночный); EUR 2 700 + EUR 400 на партнёра + EUR 400 на ребёнка; медстраховка (EUR 30 000+); медицинская справка; Гарантийное письмо от работодателя или контракты; СРОК: 1 год; ПРОДЛЕНИЕ: да (до 3 лет суммарно); НЕ ПМЖ: нет пути к ПМЖ через Nomad Permit; 2. SINGLE PERMIT (через работодателя): через мальтийскую компанию; Employment License; 3. MALTA RESIDENCE AND VISA PROGRAMME (MRVP): инвестиционный; EUR 30 000 административный взнос + недвижимость; 4. KEY WORKER: через мальтийского работодателя в критических секторах; РЫНОК IT МАЛЬТА: GAMING INDUSTRY (iGaming): КРУПНЕЙШИЙ в МИРЕ (больше казино в одной стране!); Betsson; LeoVegas (куплен MGM); Kindred Group; Gaming Innovation Group; Unibet; Mr Green; ФИНТЕК (FINTECH; БЛОКЧЕЙН): OKX (криптобиржа HQ Malta; хотя работает везде); Binance (Мальта ранее); Bitpay; BKK Protokol; MFSA регулирует крипто; СТРАХОВОЙ СЕКТОР: Mapfre; AXA; отдельные сервисы; ТРАНЗИТНЫЕ КОМПАНИИ: EU-шаттл для финтех; крипто; iGaming; ТРАДИЦИОННЫЕ: PricewaterhouseCoopers Malta; Deloitte Malta; Ernst&Young Malta; ЗАРПЛАТЫ IT МАЛЬТА (EUR): Junior: EUR 25 000-35 000/год; Middle: EUR 35 000-55 000/год; Senior: EUR 55 000-80 000/год; iGaming Senior: EUR 60 000-90 000/год; СРАВНЕНИЕ: ниже Германии/Нидерландов; для remote: мальтийская зарплата + низкая стоимость жизни = хороший баланс; НАЛОГИ МАЛЬТА: НДФЛ: 0% до EUR 9 100/год (одиночный); 15% до EUR 14 500; 25% до EUR 60 000; 35% свыше; Социальные: 10% (работник); GLOBAL RESIDENCE PROGRAMME (GRP): 15% фиксированный налог на иностранный доход ИЛИ EUR 15 000 минимальный налог; для состоятельных; нет tax обязательств на иностранный доход НЕ переведённый на Мальту',
    seo_description: 'Мальта IT 2026 жизнь аренда климат iGaming fintech: СТОИМОСТЬ ЖИЗНИ МАЛЬТА 2026: АРЕНДА: St. Julian (центр экспатов; казино; ночная жизнь): EUR 1 200-2 000/мес; Sliema (шоппинг; рестораны): EUR 1 100-1 800; Valletta (столица-UNESCO): EUR 900-1 500; Msida; Swieqi; Birkirkara: EUR 700-1 200; Gozo (остров; тише; дешевле): EUR 600-1 100; ПРОДУКТЫ: Lidl (есть!); Welbee-супермаркеты; EUR 300-500/мес; местная кухня: pastizzi (слойка с рикоттой или горохом): EUR 0.40-0.80 (символически!); rabbit stew (fenek); ftira (мальтийский хлеб); ТРАНСПОРТ: автобусная сеть; Tallinja Card (резиденты): EUR 26/мес; нет метро; машина полезна; MALTA — МАЛЕНЬКАЯ: весь остров = 27 км в длину; везде доехать за 30-45 мин; КЛИМАТ: средиземноморский; 300+ дней солнца; лето: 30-40 гр (ЖАРКО + влажно); зима: 12-20 гр (идеально!); ноябрь-март = лучший сезон для жизни; БЕЗОПАСНОСТЬ: одна из самых безопасных EU-стран; низкий уровень преступности; МЕДИЦИНА: государственная (для резидентов): бесплатная; Mater Dei Hospital = основной; Частная страховка: EUR 60-120/мес; ОБРАЗОВАНИЕ: английский в школах; международные: EUR 8 000-18 000/год; Malta University (UM); RUSSOAZYCHNOE SOOBSHESTVO: небольшое; Telegram "Русские на Мальте"; iGaming-профессионалы; МАЛЬТИЙСКИЙ МЕНТАЛИТЕТ: островной; традиционный; 95% католиков; конфиденциальность; неформальная культура; ИСТОРИЯ И АРХИТЕКТУРА: рыцари Святого Иоанна; Валлетта = UNESCO столица 2018; Мдина (Gozo = в Game of Thrones!); мегалитические храмы (5 500 лет = старше Стоунхенджа!); ПУТЬ К ГРАЖДАНСТВУ: ПМЖ: через MRVP (инвестиции EUR 30k+ взнос) или долгосрочное проживание (5 лет); гражданство: через MIIP (Malta Individual Investor Programme): EUR 750 000+ инвестиций + 1 год (или EUR 600 000 + 3 года); или через натурализацию: 5-7 лет; двойное гражданство: РАЗРЕШЕНО; мальтийский паспорт = EU-паспорт: 186 стран; БЮДЖЕТ DN В МАЛЬТЕ (SLIEMA): gross (иностранная компания): EUR 6 000/мес; Nomad Permit: 0% мальтийский налог (на иностр. доход); аренда 2-комн Sliema: EUR 1 500; продукты: EUR 400; Tallinja: EUR 26; медстраховка: EUR 80; итого расходы: EUR 2 006; остаток: EUR 3 994/мес; ITOGO PLYUSY: EU+Шенген; Nomad DN Permit (продление до 3 лет); 300+ дней солнца; английский официальный; iGaming + Fintech + крипто хаб; 15% GRP для состоятельных; MINUSY: маленькая страна; узкий рынок; горячее лето (40 гр); трафик в час пик; дорогая недвижимость для покупки (EUR 200-500k за квартиру); гражданство через инвестиции = дорого.',
    content_md: `# Мальта Валлетта IT 2026: Digital Nomad Visa EU, iGaming, 300 дней солнца

Мальта — EU+Шенген, английский официальный, 300 дней солнца. Nomad Residence Permit (1 год, продление до 3 лет; EUR 2 700/мес дохода). Мировая столица iGaming и крипто-регуляции (MFSA). Pastizzi EUR 0.40 — самый дешёвый снэк EU.

---

## Nomad Residence Permit

| Требование | Значение |
|-----------|---------|
| Минимальный доход | EUR 2 700/мес (одиночный) |
| Тип работы | Иностранный работодатель/фриланс |
| Срок | 1 год (продление до 3 лет) |
| Путь к ПМЖ | Нет (нужна другая схема) |
| Мальтийский налог | 0% на иностранный доход |

---

## IT-экосистема Мальты

| Сектор | Компании |
|--------|---------|
| **iGaming (#1 мир)** | Betsson; LeoVegas; Kindred; Unibet |
| Fintech/Крипто | OKX; MFSA регуляция |
| IT-аутсорсинг | PwC; Deloitte; EY |

---

## Стоимость жизни

| Локация | Аренда 2-комн | Климат |
|---------|--------------|--------|
| St. Julian | EUR 1 200-2 000 | Ночная жизнь |
| Sliema | EUR 1 100-1 800 | Шоппинг |
| Gozo (остров) | EUR 600-1 100 | Тихо; дёшево |

---

## Итого

Мальта IT 2026: EU+Шенген; английский официальный; Nomad Permit (EUR 2 700/мес; 0% налог на иностр. доход; до 3 лет); iGaming #1 в мире (Betsson; LeoVegas; Kindred); OKX крипто HQ; 300 дней солнца; зима 12-20 гр (лучший сезон); лето 40 гр (жарко); Valletta UNESCO; Gozo в Game of Thrones; мальтийский паспорт EU 186 стран; рынок IT узкий; гражданство через инвестиции дорого (EUR 600k+).
`,
  },
  {
    slug: 'singapur-employment-pass-kak-naiti-rabotu-2026',
    title: 'Сингапур Employment Pass как найти работу 2026: Grab, Sea, DBS, зарплаты SGD 7-15k',
    tag: 'страны',
    read_time: 2,
    country_slug: 'singapore',
    seo_title: 'Сингапур Employment Pass 2026 Grab Sea DBS зарплаты SGD 7 15k как найти работу: СИНГАПУР ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ СИНГАПУР: финансовый хаб Азии; SEA (Southeast Asia) tech-центр; 0% CGT (налог на прирост капитала); 0% наследственный; стабильность; правопорядок; центр между Индией; Китаем; ASEAN; отличная инфраструктура; английский = официальный; ВИЗЫ СИНГАПУР: 1. EMPLOYMENT PASS (EP): ОСНОВНАЯ ВИЗА ДЛЯ IT; ТРЕБОВАНИЯ 2024+: зарплата SGD 5 000/мес minimum (изменено несколько раз; уточнять; для tech/финансовых: SGD 5 500+); COMPLEMENTARITY ASSESSMENT FRAMEWORK (COMPASS) с 2023: система баллов; нужно 40+ баллов из 60; COMPASS SCORE: зарплата (vs медианная в отрасли): 10-20 баллов; образование: 10-20 баллов; diversity of nationalities в компании: 0-10; местное партнерство (компания с местными сотрудниками): 0-10; стратегические навыки (AI; deep tech; biomedical): 0-10; чем выше зарплата vs median → больше баллов; СРОК: 2 года; продление; ПМЖ: 2+ года EP; 2. TECH.PASS: для выдающихся tech-специалистов/предпринимателей; альтернатива EP; требования: зарплата SGD 22 500/мес (последние год); или: привлечение $30M+ инвестиций; или: продукт с 100k+ пользователей; 3. EntrePass: для предпринимателей с инновационным бизнесом; через Правительство Сингапура; 4. ONE PASS: с 2023; для exceptionally outstanding; зарплата SGD 30 000/мес или $200M+ компания; срок 5 лет; нет смены работодателя ограничений; РЫНОК IT СИНГАПУР: INTERNATIONAL: Google Singapore; Facebook/Meta Asia; Amazon AWS; Microsoft; Bytedance (TikTok HQ Overseas); Shopee; Grab; Lazada; Carousell; МЕСТНЫЕ UNICORNS: Grab ($13B; superapp; food; transport; financial); Sea Limited ($12B; Garena gaming; Shopee; SeaMoney); Razer ($1B; gaming peripherals); PropertyGuru; Carousell; Ninja Van; Gojek (частично Singapore); EDB (Economic Development Board) = tech hub; ФИНАНСОВЫЙ СЕКТОР: DBS Bank (крупнейший в SEA; digital bank leader); OCBC; UOB; Standard Chartered Singapore; Mastercard APAC Tech; ЗАРПЛАТЫ IT СИНГАПУР (GROSS SGD): Junior: SGD 4 000-6 000/мес ($2 969-4 453); Middle: SGD 6 000-10 000 ($4 453-7 422); Senior: SGD 10 000-18 000 ($7 422-13 360); Grab/Sea Senior: SGD 12 000-20 000+ ($8 906-14 844+); НАЛОГИ СИНГАПУР: Прогрессивный но НИЗКИЙ; 0% до SGD 20 000/год; 2% до SGD 30 000; 3.5% до SGD 40 000; 7% до SGD 80 000; 11.5% до SGD 120 000; 15% до SGD 160 000; 18% до SGD 200 000; 19% до SGD 240 000; 19.5% до SGD 280 000; 20% до SGD 320 000; 22% свыше SGD 320 000; CPF (Central Provident Fund): работник: 20% (уменьшается с возрастом); работодатель: 17%; НО: иностранцы (EP holders) = CPF НЕ платят! (это огромное преимущество); только граждане и ПМЖ платят CPF; СТОИМОСТЬ ЖИЗНИ СИНГАПУР 2026: ОЧЕНЬ ДОРОГО; АРЕНДА: 2-комн (condominiums): SGD 4 000-8 000/мес ($2 969-5 938); HDB (государственное жилье; только для граждан/ПМЖ): SGD 2 000-3 500; 2-комн рядовые: CBD: SGD 5 000-10 000; Queenstown; Buona Vista (tech district): SGD 3 500-6 000; ПРОДУКТЫ: hawker centres (уличные рынки): SGD 3-7/блюдо ($2.2-5.2); char kway teow; chicken rice; laksa; roti prata; NTUC FairPrice (супермаркет): SGD 500-800/мес; ресторан: SGD 30-80/чел; ТРАНСПОРТ: EZ-Link (MRT+Bus): SGD 120-200/мес ($89-148); MRT = один из лучших в мире; такси/Grab: дороже; КЛИМАТ: тропический; 28-35 гр круглый год; высокая влажность 70-90%; 2 сезона (муссон дек-янв; jun-июль); без зим; БЕЗОПАСНОСТЬ: одна из самых безопасных стран мира; смертная казнь за наркотики',
    seo_description: 'Сингапур IT 2026 жизнь аренда MRT hawker centres ПМЖ: ЖИЗНЬ В СИНГАПУРЕ: СИНГАПУР = CITY-STATE: всё городское; 733 кв. км; нет природы внутри; Parks (Gardens by the Bay; MacRitchie Reservoir); малайский; китайский; тамильский языки; Singlish (особый диалект английского); МЕДИЦИНА: MedisaveAccount; Medishield Life: обязательная страховка для граждан/ПМЖ; для EP holders: работодатель часто даёт; частная: SGD 100-250/мес; ОБРАЗОВАНИЕ: Singapore Management University; NUS (National University of Singapore; топ-25 мир); NTU; международные: SDZ; UWCSEA: SGD 35 000-55 000/год (одни из самых дорогих в Азии); RUSSOAZYCHNOE SOOBSHESTVO: небольшое; Telegram "Русские в Сингапуре"; "Russians in Singapore"; ПУТЬ К ПМЖ СИНГАПУР: EP + 2 года → подать на Singapore Permanent Residence (PR); одобрение: 30-50% (на усмотрение ICA); ФАКТОРЫ ОДО: зарплата; компания; вклад в Сингапур; ГРАЖДАНСТВО: 2+ года PR (обычно 2-4 лет); обязательная военная служба для мужских детей (NSRS); двойное гражданство: ЗАПРЕЩЕНО (нужно сдать); сингапурский паспорт: #2 в мире (193 страны); БЮДЖЕТ SENIOR DEVELOPER В СИНГАПУРЕ: gross SGD 13 000/мес ($9 648); CPF 0% (EP holder); НДФЛ ~17-18%: SGD 2 200/мес; net SGD 10 800/мес ($8 017); аренда 2-комн Queenstown: SGD 4 500; продукты (hawker + grocery): SGD 700; MRT: SGD 150; итого расходы: SGD 5 350 ($3 972); остаток: SGD 5 450/мес ($4 045); ITOGO PLYUSY: 0% CGT; 0% наследственный налог; НДФЛ от 0-22% (низкий); EP holders без CPF (экономия 17%!); Grab; Sea; DBS (топ-10 банк мира по digital); COMPASS система понятная; английский; MRT; hawker centres; MINUSY: очень дорогое жильё (EP holders не могут HDB); нет природы; ПМЖ = лотерея (30-50%); двойное гражданство запрещено; сингапурский климат (жарко и влажно); строгие законы (жвачка запрещена; смертная казнь наркотики).',
    content_md: `# Сингапур Employment Pass 2026: Grab, Sea, DBS, COMPASS Score

Сингапур — 0% CGT, 0% наследственный налог, EP holders не платят CPF (экономия 17% от gross). COMPASS System с 2023: нужно 40+ баллов. Grab ($13B), Sea ($12B), DBS (топ-10 банк). Senior SGD 13 000/мес → net $8 017 → остаток $4 045 после расходов.

---

## Employment Pass: COMPASS Score

| Критерий | Баллы |
|----------|-------|
| Зарплата выше медианы в отрасли | 10-20 |
| Образование (top university) | 10-20 |
| Diversity (национальности в компании) | 0-10 |
| Местные партнёрства компании | 0-10 |
| Стратегические навыки (AI; deep tech) | 0-10 |
| **Нужно** | **40+/60** |

Минимальная зарплата EP: SGD 5 000-5 500/мес (уточнять актуально).

---

## Налоги: почему выгодно

| Налог | Ставка |
|-------|--------|
| CGT (прирост капитала) | **0%** |
| Наследственный | **0%** |
| CPF для EP holders | **0%** (только граждане/ПМЖ) |
| НДФЛ Senior SGD 13k/мес | **~17%** |

---

## IT-зарплаты

| Уровень | SGD/мес | USD/мес |
|---------|---------|---------|
| Junior | 4-6k | $2 969-4 453 |
| Middle | 6-10k | $4 453-7 422 |
| **Senior** | **10-18k** | **$7 422-13 360** |
| Grab/Sea Senior | 12-20k+ | $8 906-14 844+ |

---

## Итого

Сингапур IT 2026: COMPASS Score (40+ из 60; зарплата = главный критерий); EP holders = 0% CPF (граждане платят 20%); 0% CGT и наследственный; НДФЛ 0-22% (низкий); Grab ($13B); Sea ($12B; TikTok HQ overseas); DBS digital bank; hawker centres $2-5/блюдо; MRT = лучший в мире; HDB жильё недоступно для EP; ПМЖ = 30-50% одобрение; двойное гражданство запрещено; паспорт #2 мира 193 страны.
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
console.log(`\nБатч 218: ${ok} OK, ${err} ошибок`);

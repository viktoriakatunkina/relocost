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
    slug: 'kak-peredat-biznes-pri-pereezde-2026',
    title: 'Что делать с бизнесом в России при переезде за рубеж в 2026 году',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Что делать с бизнесом в России при переезде 2026: ИП оставить закрыть или продать: ВАРИАНТЫ ДЛЯ ИП В РФ: 1. Оставить ИП работающим: возможно вести ИП удалённо (онлайн-банкинг; Тинькофф/СберБизнес; электронная отчётность через СБИС/Контур.Диадок); нужен бухгалтер ИЛИ онлайн-сервис (Моё дело; Контур.Эльба; Бухгалтерия 1С); платить страховые взносы (фиксированные: ~43 000 руб/год 2024 + 1% с оборота свыше 300 000 руб); ограничения: расчётный счёт из-за рубежа = риски (некоторые банки блокируют при иностранном IP; использовать VPN; иметь доверенное лицо для операций); выставлять счета иностранным клиентам: ограничено (нерезидентам РФ сложно платить на счёт в РФ; решение: открыть зарубежную компанию); 2. Закрыть ИП: подача заявления через Госуслуги (форма P26001); нотариус не нужен при электронной подаче; срок закрытия: 5-7 рабочих дней; перед закрытием: подать все отчёты; оплатить страховые взносы (пропорционально дням в году); закрыть расчётный счёт; сдать кассу; уведомить контрагентов; СТОИМОСТЬ ЗАКРЫТИЯ ИП: пошлина 160 руб (при электронной = 0); 3. Продать бизнес (ООО): ООО продаётся путём продажи долей; оформляется у нотариуса; покупатель = физлицо или другое ООО; НДФЛ при продаже долей: 13% (если владел менее 5 лет) или 0% (если более 5 лет при определённых условиях); ВАРИАНТЫ ДЛЯ ООО: 1. Оставить работающим с директором (найти управляющего; доверенность; онлайн-контроль); 2. Ввести директором доверенное лицо; 3. Выйти из учредителей и продать долю; КИК (для тех кто открыл иностранную компанию): при доле >25% в иностранной компании + статус резидента РФ = КИК режим (уведомить ФНС; включить прибыль в НДФЛ); при смене резидентства = КИК-правила перестают применяться; БАНКОВСКИЕ КАРТЫ: карты Мир: работают в Белоруссии/Армении/Казахстане/Кыргызстане/Таджикистане/Вьетнаме/ОАЭ/Турции (список меняется); в EU/US НЕ работают; дополнительные карты: оставить у доверенного лица для онлайн-платежей в РФ; СБЕРЕГАТЕЛЬНЫЙ АККАУНТ В РФ: можно оставить; пополнять из зарубежного банка (переводы в РФ из дружественных стран работают; SWIFT в РФ через ряд банков); снимать при визитах домой',
    seo_description: 'Что делать с бизнесом в России при переезде 2026: ЧЕКЛИСТ ПЕРЕД ОТЪЕЗДОМ ДЛЯ ИП: За 1-3 мес до переезда: сверка с ФНС (Личный кабинет налогоплательщика; nalog.ru; задолженности); оплата страховых взносов (на текущий год пропорционально); последняя декларация (УСН декларация или 3-НДФЛ); за 1-4 нед: закрытие расчётного счёта ИЛИ договорённость с банком о дистанционном обслуживании; при отъезде: закрыть ИП через Госуслуги ИЛИ настроить удалённое управление; ВАРИАНТ ОСТАВИТЬ ИП: лучшие сервисы для удалённого ведения: Контур.Эльба (подходит для УСН и ПСН; онлайн-декларации; напоминания о сроках; 4 600-10 000 руб/год); Моё дело (более широкий функционал; первичные документы; зарплата; 5 000-12 000 руб/год); Тинькофф Бизнес (онлайн-банк + встроенная бухгалтерия; работает через браузер с VPN из-за рубежа); бухгалтер на аутсорс: 3 000-8 000 руб/мес для ИП без сотрудников; РИСКИ ОСТАВИТЬ ИП: блокировка счёта 115-ФЗ при подозрительных переводах (приходы из-за рубежа могут триггерить); смена налогового резидентства не влияет на статус ИП сам по себе; но при статусе нерезидента РФ (>183 дней за рубежом): ставка НДФЛ для нерезидентов = 30% (для доходов от российских источников); ИП на УСН: ставка УСН не меняется от резидентства (6% или 15%); но при выплате себе дивидендов из ООО = 15% withholding для нерезидентов (было 0-9% для резидентов); ПРОДАЖА ООО: НДФЛ при продаже доли ООО: 13% при владении менее 5 лет; при владении >5 лет и если ООО не занимается продажей недвижимости = возможно освобождение (статья 217 НК); нотариальное оформление: нотариус обязателен при продаже доли ООО (расходы 5 000-30 000 руб); покупатель оплачивает часть пошлин; рекомендация: продавать заранее (найти покупателя до отъезда или через брокера компаний: avito.ru/biznes; businessbroker.ru); ДОВЕРЕННОСТЬ: генеральная доверенность на ведение бизнеса: оформляется у нотариуса; включить: подписание документов/банковские операции/подача отчётности/регистрационные действия; можно от нерезидента; апостиль не нужен для использования в РФ; при отъезде за рубеж: оформить заранее (рассмотреть срок действия 1-3 года).',
    content_md: `# Что делать с бизнесом в России при переезде 2026

Три сценария: оставить работающим (онлайн), закрыть до отъезда, продать. ИП на УСН можно вести полностью дистанционно через Контур.Эльба.

---

## Вариант 1: Оставить ИП работающим

| Инструмент | Стоимость |
|-----------|----------|
| Контур.Эльба | 4 600-10 000 руб/год |
| Моё дело | 5 000-12 000 руб/год |
| Тинькофф Бизнес | Онлайн (VPN из-за рубежа) |
| Бухгалтер аутсорс | 3 000-8 000 руб/мес |

**Важно:** ИП на УСН — ставка 6%/15% не меняется от резидентства. Нерезидент РФ платит 30% НДФЛ с российских доходов (не УСН).

**Риски:** блокировка счёта по 115-ФЗ при переводах из-за рубежа; использовать VPN; доверенное лицо на месте.

---

## Вариант 2: Закрыть ИП

| Шаг | Детали |
|-----|--------|
| Сдать все отчёты | До подачи на закрытие |
| Оплатить взносы | Пропорционально дням в году |
| Подать заявление | Госуслуги (форма P26001; пошлина 0 при электронной) |
| Срок закрытия | 5-7 рабочих дней |

---

## Вариант 3: Продать ООО

| Параметр | Детали |
|---------|--------|
| Оформление | У нотариуса (обязательно) |
| НДФЛ при продаже | 13% (владение <5 лет) / 0% (>5 лет при условиях) |
| Где искать покупателя | Avito/businessbroker.ru |

---

## Чеклист перед отъездом

| За сколько | Действие |
|-----------|---------|
| 1-3 мес | Сверка с ФНС (nalog.ru); оплата взносов |
| 1-3 мес | Оформить генеральную доверенность (если оставляешь) |
| 1-4 нед | Закрыть счёт ИЛИ договориться о дистанционном |
| При отъезде | Закрыть ИП или настроить удалённое управление |

---

## Генеральная доверенность

При отъезде — оформить у нотариуса доверенность на доверенное лицо:
- Подписание документов
- Банковские операции
- Подача отчётности
- Регистрационные действия

**Срок:** 1-3 года. Апостиль для использования в РФ не нужен.

---

## КИК: если открываешь иностранную компанию

| Ситуация | Требование |
|---------|-----------|
| Доля >25% в иностранной компании + резидент РФ | Уведомить ФНС; прибыль КИК = НДФЛ |
| Нерезидент РФ (>183 дней за рубежом) | КИК-правила перестают применяться |

---

## Итого

Что делать с бизнесом в РФ при переезде 2026: ИП можно оставить (Контур.Эльба €50/год; VPN + доверенное лицо; риск 115-ФЗ); закрыть через Госуслуги за 5-7 дней (пошлина 0); ООО — продать через нотариуса (НДФЛ 13%); генеральная доверенность — оформить за 1-3 мес до отъезда; КИК-правила перестают применяться после смены налогового резидентства.
`,
  },
  {
    slug: 'niderlandy-amsterdam-eindhoven-it-2026',
    title: 'Нидерланды: Амстердам и Эйндховен для IT в 2026 — 30% Ruling, ASML, Booking',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Нидерланды Амстердам Эйндховен IT 2026: 30% Ruling (30%-Regeling; налоговая льгота для квалифицированных иностранных специалистов; 30% зарплаты выплачивается налогозащищённо = не включается в базу НДФЛ; условия: зарплата ≥€46 107/год gross (2024; индексируется); специфические знания (для IT = практически любой Senior+); работодатель подаёт запрос в Belastingdienst; срок: с 2019 ограничен до 5 лет (было 8 лет); также: 30% Ruling holders = Partial Non-Resident Tax Status → иностранные инвестиции/сберегательные счета не облагаются в NL; НДФЛ Нидерландов: Box 1 (доход от труда): 36.97% до €73 031; 49.50% свыше €73 031; с 30% Ruling: налог применяется к 70% зарплаты = для €100 000/год gross: налог на €70 000; при €70 000 gross и 30% Ruling: налог на €49 000 = ок 20% effective rate; без 30% Ruling: эффективная ставка ~38-45%); Zorgverzekering (медстраховка): обязательная для резидентов NL; базовая €100-160/мес + eigen risico €385/год; ВНЖ Нидерландов для IT (HSMP Highly Skilled Migrant): Kennismigrant (Highly Skilled Migrant): работодатель должен быть recognized sponsor (IND.nl проверить); зарплата ≥€5 688/мес gross (2024, до 30 лет) или ≥€4 171/мес gross (с 30 лет); IND рассмотрение: 2-4 нед; ВНЖ 5 лет; ПМЖ через 5 лет; гражданство через 5 лет + inburgering (интеграционный экзамен: NT2 B2); нидерландский B2 для гражданства; Orientation Year Visa: для выпускников Top 200 университетов; 1 год поиска работы без работодателя-спонсора); IT-компании Амстердама: Booking.com (крупнейший travel OTA; Priceline Group/Booking Holdings; NYSE BKNG; €17B revenue; AMS HQ; 10 000+ chел.; крупнейший IT работодатель AMS); Adyen (Dutch fintech unicorn; Euronext AMS; €77B market cap; payments infrastructure; 4 000 чел.); Mollie (EU fintech; $6.5B; AMS HQ); TomTom (GPS/maps; Euronext AMS; AMS HQ; 5 000 чел.); Messagebird (now Bird; CPaaS; $3.8B; AMS); Takeaway.com (now Just Eat Takeaway; food delivery; Euronext AMS; 5 000+ NL); Elastic NV (ESTC NYSE; search/observability; San Francisco+AMS; $11B); АСML (ASML Holding; NASDAQ ASML; €300B+ market cap; HQ Eindhoven; крупнейшая компания Netherlands; semiconductor lithography; 40 000 чел.; поставляет только компания в мире EUV литографы для TSMC/Intel/Samsung; Senior engineer €80 000-150 000/год)',
    seo_description: 'Нидерланды Амстердам Эйндховен IT 2026: 30% RULING: выгода: 30% зарплаты = tax-free (cost of relocation allowance); пример: зарплата €100 000 gross; с 30% Ruling: налог только с €70 000; Box 1 ставки: €70 000: до €73 031 = 36.97% → ~€25 880 налог; effective rate на total зарплату: ~25.9% (vs ~38-40% без льготы); до 30 лет порог зарплаты ниже: €35 048/год gross (2024); KENNISMIGRANT (HIGHLY SKILLED MIGRANT): работодатель должен быть IND-recognised sponsor; стандартная зарплата: ≥€5 688/мес gross (>30 лет) или ≥€4 171/мес (≤30 лет); рассмотрение IND: 2-4 нед (fast track для recognised employers); ВНЖ 5 лет; ПМЖ (Verblijfsvergunning voor onbepaalde tijd) после 5 лет; гражданство после 5 лет ВНЖ + NT2 B2 (Staatsexamen NT2; нидерландский государственный экзамен уровня B2) + inburgering; ЗАРПЛАТЫ IT НИДЕРЛАНДЫ: Junior Dev AMS: €3 000-4 500/мес gross; Middle: €4 500-6 500/мес; Senior: €6 000-10 000/мес; Staff/Principal: €8 000-14 000/мес; Booking.com Senior SWE: €7 000-10 000/мес; Adyen Senior: €7 500-11 000/мес; ASML Senior Engineer: €7 000-12 000/мес; TomTom Senior: €5 500-8 500/мес; СТОИМОСТЬ ЖИЗНИ АМСТЕРДАМ: аренда 1BR (Amsterdam-West/Oost/Zuid): €1 500-2 500/мес; (Amsterdam-Noord/Nieuw-West): €1 100-1 800/мес; (Amstelveen/Diemen suburbs): €1 300-2 000/мес; продукты: €400-700/мес; транспорт (NS/GVB OV-chipkaart): €100-150/мес; eigen risico (zorgverzekering): €32/мес (€385/год); жизнь итого: €2 400-4 000/мес ($2 615-4 360); ЖИЛИЩНЫЙ КРИЗИС АМСТЕРДАМА: острейший в EU; социальное жильё: очередь 10-20 лет; private sector: limitierованные места; цены растут; rent контроль (huurprijsplafond) только для social housing; для экспатов: Airbnb/sublet/expat housing agencies (Pararius.nl; Funda.nl для выкупа; Housing.nl для аренды); ЭЙНДХОВЕН: ASML HQ; High Tech Campus Eindhoven (700 компаний; 12 000 сотрудников; NXP Semiconductors; ASML; DAF; Philips спин-оффы; Silicon Valley of NL); жильё: €1 000-1 700/мес 1BR; жизнь: €1 800-2 800/мес; НИДЕРЛАНДСКИЙ ЯЗЫК: для Kennismigrant и 30% Ruling: не нужен; для гражданства: NT2 B2 (Staatsexamen; высокий уровень); для ПМЖ: inburgering NT2 B1 (Inburgeringsexamen); рабочий язык: английский (Нидерланды = одна из лучших англоязычных неанглоязычных стран; EF EPI #1/2 регулярно); РАЙОНЫ АМСТЕРДАМА: Amsterdam-Zuid (Oud-Zuid; Vondelpark; дорого); Amsterdam-Oost (Plantage/Wibautstraat; popular expat; hip); Amsterdam-West (Jordaan/Oud-West; trendy; дорого); Nieuw-West (affordable; diverse; Slotermeer); Noord (через IJ тоннель; развивающийся; NDSM; cheaper).',
    content_md: `# Нидерланды: Амстердам и Эйндховен для IT — 30% Ruling, ASML, Booking, Adyen

Нидерланды — 30% Ruling снижает эффективный налог до ~26%. Booking.com (10 000 чел.), Adyen (€77B), ASML (€300B) — крупнейшие IT работодатели. Эйндховен — High Tech Campus = Silicon Valley NL.

## 30% Ruling: налоговая льгота для экспатов

| Параметр | Значение |
|---------|---------|
| Суть | 30% зарплаты = tax-free |
| Зарплата (>30 лет) | ≥€4 171/мес gross |
| Зарплата (<30 лет) | ≥€2 920/мес gross |
| Срок | 5 лет |
| Подаёт | Работодатель в Belastingdienst |

**Пример €100 000/год:**

| | Без 30% Ruling | С 30% Ruling |
|--|----------------|--------------|
| База для налога | €100 000 | €70 000 |
| Налог | ~€38 000 | ~€25 880 |
| Effective rate | ~38% | **~25.9%** |

---

## Kennismigrant (Highly Skilled Migrant)

| Параметр | Значение |
|---------|---------|
| Работодатель | IND-recognised sponsor (проверить на IND.nl) |
| Зарплата (>30 лет) | ≥€5 688/мес gross |
| Зарплата (≤30 лет) | ≥€4 171/мес gross |
| Рассмотрение | 2-4 нед |
| ВНЖ | 5 лет |
| ПМЖ | После 5 лет |
| Гражданство | После 5 лет + NT2 B2 |

---

## IT-компании Нидерландов

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Booking.com** | Travel OTA | 10 000+ чел.; AMS HQ |
| **Adyen** | Payments | Euronext; €77B; 4 000 чел. |
| **ASML** | EUV литографы | NASDAQ €300B+; 40 000 чел. |
| **TomTom** | GPS/Maps | Euronext AMS; 5 000 чел. |
| **Mollie** | Fintech | $6.5B; AMS |
| **Elastic** | Search/Observability | NYSE $11B; AMS |

---

## Зарплаты IT в Нидерландах

| Уровень | EUR/мес | EUR/мес (net с 30% Ruling) |
|---------|---------|---------------------------|
| Junior | 3 000-4 500 | 2 100-3 100 |
| Middle | 4 500-6 500 | 3 100-4 500 |
| Senior | 6 000-10 000 | 4 200-7 000 |
| Booking.com Senior | 7 000-10 000 | 4 900-7 000 |
| ASML Senior | 7 000-12 000 | 4 900-8 400 |

---

## Стоимость жизни: Амстердам vs Эйндховен

| Статья | Амстердам EUR/мес | Эйндховен EUR/мес |
|--------|------------------|------------------|
| Аренда 1BR (хор. р-н) | 1 500-2 500 | 1 000-1 700 |
| Продукты | 400-700 | 350-600 |
| Транспорт | 100-150 | 80-120 |
| **Итого** | **2 400-4 000** | **1 800-2 800** |

---

## Жилищный кризис

Амстердам — острейший в EU. Очередь на социальное жильё: 10-20 лет. Для экспатов:
- Pararius.nl (частная аренда)
- Expat housing agencies
- Funda.nl (покупка)

**Эйндховен** — дешевле Амстердама на 30-40% при доступе к ASML/High Tech Campus.

---

## Итого

Нидерланды Амстердам Эйндховен IT 2026: 30% Ruling (5 лет; effective tax ~26%); Kennismigrant ≥€4 171/мес (IND-recognised sponsor; 2-4 нед); Booking.com/Adyen/ASML/TomTom; Senior €6 000-12 000/мес; жизнь Амстердам €2 400-4 000/мес; Эйндховен €1 800-2 800/мес; английский рабочий язык везде; жилищный кризис — главная боль; NT2 B2 для гражданства через 5 лет.
`,
  },
  {
    slug: 'serbiya-belgrad-it-2026',
    title: 'Сербия и Белград для IT в 2026: упрощённый ВНЖ, Nordeus, IT налоговые стимулы',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Сербия Белград IT 2026: ВНЖ Сербии (Boravista dozvola; разрешение на временное проживание; два основных пути: 1. Регистрация по адресу (Prijava stanovanja): для граждан многих стран (включая РФ/Беларусь) можно проживать 30 дней без регистрации; для более долгого пребывания — регистрация; 2. Boravista dozvola (временный ВНЖ): для работников; для самозанятых; для инвесторов; для тех кто занимается бизнесом (d.o.o. — ООО Сербии); сроки: 1 год + renewals; постоянный ВНЖ через 5 лет; гражданство через 3 года (одно из самых быстрых в регионе!) + знание сербского; ПАСПОРТ СЕРБИИ = не EU паспорт; но безвиз в 138+ стран; без EU membership пока; статус кандидата на EU с 2012; БЕЗВИЗА ДЛЯ РОССИЯН: граждане РФ = 30 дней безвиза в Сербию (проверяй актуально); IT СТИМУЛЫ СЕРБИИ: IT компании регистрирующиеся в Сербии получают субсидии и льготы; программа IT поддержки (Ministarstvo informatike); ставка НДФЛ для IT-сотрудников: POREZ NA DOHODAK GRADANA: прогрессивная: 10% до 3 543 000 RSD/год (~€30 000/год); 15% выше; Social Insurance работника: 19.9% пенсионное + 5.15% здравоохранение = 25.05%; работодатель: 11.5% пенсионное + 5.15% медицина = 16.65%; РАЗРАБОТЧИК ПО в Сербии: особый режим: сниженная ставка Social Insurance для определённых IT-сотрудников; освобождение от части взносов для стартапов и IT); IT-компании Белграда: Nordeus (Top Eleven Football Manager; EA приобрела 2021; HQ Белград; 300+ чел.); NCR Voyix (NCR; POS/banking tech; 2 000+ чел. в Белграде); Levi9 (IT outsourcing; Белград+Нидерланды; 500+ чел.); Endava Serbia (IT consulting; 1 500+ чел.; Белград); MicroE / Rino (engineering; Nis); S&T (IT services; Austria+Serbia); Microsoft Serbia; Nordeus/Nordeus 2 (EA); NCR; Strawberry Energy; UserZoom (UX research acq. UserTesting); HiSense Serbia; Enjoy Technologies Serbia (IT service); Trackunit (IoT; Белград); Omnicom Group Serbia; Digital Garden Belgrade; ZUHLKE GROUP Serbia (engineering consulting); Kforce Serbia; Grid Finance (fintech); Saga (IT consulting; Serbia+Croatia; 700 чел.); Experian Belgrade; ING Tech Serbia (ING Bank; 500+ чел.)',
    seo_description: 'Сербия Белград IT 2026: ПОЧЕМУ БЕЛГРАД ДЛЯ IT ЭКСПАТОВ: с 2022 Белград = крупный hub для релоцировавшихся IT-специалистов (особенно из РФ/BY); оценивается в 30 000+ IT-специалистов из РФ переехало в Сербию с 2022; рынок труда стал конкурентным; ВИЗОВЫЙ РЕЖИМ ДЛЯ РОССИЯН: безвиз 30 дней; продление возможно (выехать в Боснию/Северную Македонию на 1 день и вернуться = visa run; популярно, но юридически серая зона); BORAVISTA DOZVOLA (ВНЖ): подавать в МВД Srbija (MUP); необходимые документы для D.O.O. основателя: регистрация D.O.O. (APR - Agencija za privredne registre; онлайн; ~24 часа; 6 000 RSD = ~€51); договор аренды офиса или коворкинга; директорский контракт с самим собой; срок рассмотрения: 30-60 дней; ВНЖ 1 год; постоянный ВНЖ (Stalno nastanjenje) через 5 лет; СЕРБСКОЕ ГРАЖДАНСТВО: через 3 года постоянного ВНЖ (очень быстро!); знание сербского (тест); НЕ dual citizenship с РФ: при получении сербского = нужно уведомить РФ об иностранном гражданстве; сербский паспорт: 138 безвизовых стран (включая UK/Турция/многие LatAm); НЕ EU; НАЛОГИ СЕРБИИ ДЛЯ ФРИЛАНСЕРА (Preduzetnik Pauzsalista): особый режим; фиксированная ставка: 40 000 - 100 000 RSD/мес фиксированный налог + Social Insurance (не % от дохода); освобождение от части взносов первые 3 года; ЗАРПЛАТЫ IT БЕЛГРАД: Junior Dev: €1 000-2 000/мес gross; Middle: €2 000-4 000/мес; Senior (local company): €3 000-6 000/мес; Senior (ING Tech / Endava / NCR): €4 000-8 000/мес; Remote для EU/US employer: €5 000-15 000/мес; D.O.O. + remote = лучшая налоговая схема; СТОИМОСТЬ ЖИЗНИ БЕЛГРАД: аренда 1BR (Vracar/Savamala/Stari Grad): €500-800/мес; (Novi Beograd/Zemun): €400-700/мес; продукты: €200-400/мес; транспорт (GSP): €20-40/мес; жизнь итого: €800-1 400/мес ($870-1 525); ОДНА ИЗ САМЫХ ДЕШЁВЫХ ЕВРОПЕЙСКИХ СТОЛИЦ; РАЙОНЫ БЕЛГРАДА: Vracar (хипстерский; Бранков мост; рестораны; expat-popular); Savamala (cultura; bars; ночная жизнь; IT офисы); Stari Grad (исторический); Novi Beograd (деловой; Sava Center; cheaper); Zemun (тихий; Дунай; местный колорит); СЕРБСКИЙ ЯЗЫК: кириллица + латиница (диграфия); схожий с русским на 60-70% (южнославянская группа); значительно ближе русскому чем польский; до B1: 250-400 часов; для работы в belgrade IT: английский рабочий язык в международных компаниях; сербский = плюс для коммуникации с местными.',
    content_md: `# Сербия и Белград для IT: D.O.O. за €51, гражданство через 3 года, €800/мес жизнь

Белград — крупнейший hub релоцировавшихся IT-специалистов с 2022. D.O.O. (ООО) за €51. Гражданство через 3 года. Жизнь €800-1 400/мес. Сербский понятен носителям русского.

## ВНЖ через D.O.O.: самый популярный путь

| Шаг | Детали |
|-----|--------|
| 1. Регистрация D.O.O. | APR онлайн; ~24 часа; 6 000 RSD (~€51) |
| 2. Аренда офиса/коворкинга | Для юр. адреса |
| 3. Boravista dozvola (ВНЖ) | Подача в MUP; 30-60 дней |
| Срок ВНЖ | 1 год + renewals |
| Постоянный ВНЖ | После 5 лет |
| Гражданство | После 3 лет ПМЖ + сербский тест |

---

## Налоги Сербии

| Налог | Ставка |
|-------|--------|
| НДФЛ (до €30 000/год) | **10%** |
| НДФЛ (свыше) | 15% |
| Social Insurance (работник) | 25.05% |
| Preduzetnik Pausalsalista | Фиксированный платёж (не % от дохода) |

**Схема D.O.O. + remote:** платишь 10-15% CT + дивиденды 15% → effective rate ~20-25%.

---

## IT-компании Белграда

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Endava Serbia** | IT consulting | 1 500+ чел. |
| **NCR Voyix** | POS/Banking IT | 2 000+ чел. |
| **Levi9** | IT outsourcing | 500+ чел. |
| **ING Tech Serbia** | Banking IT | 500+ чел. |
| **Nordeus** | Games (EA) | 300+ чел. |

---

## Зарплаты IT в Белграде

| Уровень | EUR/мес (local) | EUR/мес (remote EU/US) |
|---------|----------------|------------------------|
| Junior | €1 000-2 000 | €3 000-5 000 |
| Middle | €2 000-4 000 | €5 000-8 000 |
| Senior (local) | €3 000-6 000 | €7 000-15 000 |

---

## Стоимость жизни в Белграде

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Vracar/Savamala) | 500-800 | $545-875 |
| Аренда 1BR (Novi Beograd) | 400-700 | $435-765 |
| Продукты | 200-400 | $220-435 |
| Транспорт (GSP) | 20-40 | $22-44 |
| **Итого** | **800-1 400** | **$870-1 525** |

---

## Сербский язык

| Параметр | Значение |
|---------|---------|
| Схожесть с русским | 60-70% |
| До B1 | 250-400 часов |
| Алфавит | Кириллица + латиница |

---

## Итого

Сербия Белград IT 2026: D.O.O. за €51 (APR онлайн; 24 ч) → Boravista dozvola 30-60 дней; гражданство через 3 года ПМЖ; НДФЛ 10-15%; D.O.O.+remote = эффективная ставка ~20-25%; Endava/NCR/ING Tech; remote Senior €7 000-15 000/мес; жизнь €800-1 400/мес (одна из дешевейших столиц EU); сербский = понятен носителям русского (250-400 ч до B1). Не EU паспорт — главный минус.
`,
  },
  {
    slug: 'kak-napisat-sobesedovanie-cover-letter-2026',
    title: 'Как написать Cover Letter и пройти первое интервью при переезде за рубеж 2026',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Cover Letter и интервью при переезде за рубеж 2026: как написать и пройти: COVER LETTER (МОТИВАЦИОННОЕ ПИСЬМО): когда нужен: большинство EU компаний всё ещё принимают или требуют; стартапы: иногда просят; крупные компании с ATS: часто не читают но наличие показывает серьёзность; структура 3 абзаца: 1 абзац (зацепка): конкретный факт о компании + почему ты = почему именно здесь; 2 абзац (доказательство): 2-3 конкретных достижения с цифрами (Increased API response time by 40%; Led migration of 2M users to new platform; Built recommendation system serving 50k DAU); 3 абзац (призыв): что ты принесёшь + готовность к интервью; ОШИБКИ В COVER LETTER: "I am writing to apply for..." (клише; начни сразу с факта о компании); список навыков (это в резюме); длиннее 1 страницы; перевод своего резюме в текст; ОБЪЯСНЕНИЕ ПЕРЕЕЗДА В COVER LETTER: employers EU часто боятся: готов ли кандидат реально переехать; как написать: "I am currently preparing to relocate to Berlin and have already begun the visa application process" ИЛИ "I am planning to relocate to Amsterdam and am available to start [month]"; не нужно объяснять ПОЧЕМУ переезжаешь; достаточно подтвердить готовность; ПЕРВОЕ ИНТЕРВЬЮ: чаще всего = Screening Call (30 мин; HR или Recruiter); типичные вопросы первого интервью: Tell me about yourself (2 мин; Past: background → Present: current role → Future: why this company); Why are you interested in [company]? (3-4 конкретных факта о продукте/культуре/технологии; НЕ зарплата); Why are you looking for new opportunities / Why are you relocating? (можно честно: "seeking international experience / expanding career internationally / wanting to work in a more global environment"); What are your salary expectations? (исследуй рынок заранее; называй диапазон; "Based on my research of the market, I am targeting EUR X-Y for this level"; не называй ниже рыночного); What is your availability / when can you start? (стандартный notice period 1-3 мес; если уже без работы: "immediately" или "within 2 weeks"); VISA SPONSORSHIP ВОПРОС: как спросить: "Does [company] provide visa sponsorship for non-EU candidates?" (задавать на первом или втором интервью; не на финале — задержит или исключит); работодатели EU: крупные и tech-focused охотно спонсируют; небольшие = реже; DRESS CODE: EU стандарт: смарт-кэжуал для видеозвонков; startup: informal; финансы/банки: бизнес-кэжуал; ПОДГОТОВКА К ТЕХНИЧЕСКОМУ ИНТЕРВЬЮ: EU coding round: Leetcode Medium (Two Sum / Valid Parentheses / Binary Search / BFS/DFS) = базовый уровень; System Design: READ-WRITE разделение; масштабирование; кеширование; EF Architecture (EventSourced/CQRS для enterprise EU); BEHAVIORAL: STAR (Situation; Task; Action; Result с цифрами); подготовь 8-10 STAR историй; сгруппируй по темам: leadership / conflict / failure / success / collaboration / innovation',
    seo_description: 'Cover Letter и первое интервью при переезде за рубеж 2026: COVER LETTER TEMPLATE: [Имя рекрутера / Hiring Manager], I was excited to see [Company] is expanding its [product area / engineering team] — especially given [specific recent news/product launch/feature I noticed]. As a Senior Backend Engineer with 7 years of experience in Python and distributed systems, I believe I can contribute meaningfully to [specific challenge the company faces]. In my current role at [Company], I: [Achievement 1 with metric]: Reduced database query time by 60% through query optimization and indexing, improving page load for 2M active users. [Achievement 2 with metric]: Led migration from monolith to microservices architecture, reducing deployment time from 2 weeks to 2 hours. [Achievement 3 with metric]: Mentored team of 5 engineers, resulting in 3 promotions within 18 months. I am actively relocating to Berlin and am available to start from [Month]. I would love to discuss how my experience in [specific area] aligns with [company role]. Best regards, [Name]; ЧАСТЫЕ ВОПРОСЫ ПЕРВОГО ИНТЕРВЬЮ И ХОРОШИЕ ОТВЕТЫ: Tell me about yourself: "I am a Senior Python Engineer with 7 years of experience, currently at [Company] where I lead backend for [product]. I have worked on systems serving 5M+ users, focusing on scalability and API design. I am looking to grow internationally and your work on [specific product] particularly excites me."; Why are you relocating?: "I am looking to gain international experience and work in a more diverse, global team. I believe [City] offers a fantastic tech ecosystem, and I am already in the process of preparing my relocation."; What are your salary expectations?: "Based on my research of the Berlin/Amsterdam market for Senior Engineers with my stack, I am targeting €85 000-100 000 gross per year. I am flexible depending on the total compensation structure."; ТЕХНИЧЕСКИЕ ВОПРОСЫ (типичные EU coding round): Two Sum / Three Sum; Sliding Window (Max subarray, Longest substring); Binary Search; Tree traversal (BFS/DFS); Graph problems (shortest path); Sorting algorithms; String manipulation; Design: Design URL shortener / Design Twitter timeline / Design Rate Limiter; BEHAVIORAL ВОПРОСЫ (подготовь 8-10 историй по STAR): Tell me about a time you had a conflict with a coworker; Tell me about your biggest technical failure; Tell me about a time you had to lead without authority; Tell me about a project you are most proud of; ПОЛЕЗНЫЕ РЕСУРСЫ ПОДГОТОВКИ: Leetcode.com (задачи); AlgoMonster (структурированный курс); Pramp.com (mock interviews); Interviewing.io (платные мок-интервью с inжинерами из FAANG); Glassdoor Interview Questions (вопросы по конкретным компаниям); Levels.fyi (зарплаты для переговоров); Teamblind.com (Anonymous forum engineers).',
    content_md: `# Cover Letter и первое интервью при переезде за рубеж 2026

Cover letter — 3 абзаца максимум: зацепка + достижения с цифрами + подтверждение готовности переехать. Первое интервью — screening call 30 мин. STAR-истории готовить заранее.

---

## Структура Cover Letter

| Абзац | Содержание |
|-------|-----------|
| 1 | Конкретный факт о компании + почему именно здесь |
| 2 | 2-3 достижения с цифрами |
| 3 | Что принесёшь + подтверждение переезда |

**Ошибки:**
- "I am writing to apply..." (клише; начинай с факта о компании)
- Длиннее 1 страницы
- Список навыков (это в резюме)

---

## Как упомянуть переезд

Достаточно одного предложения:

"I am currently preparing to relocate to Berlin and have already begun the visa application process. I am available to start from [Month]."

**Не нужно объяснять ПОЧЕМУ переезжаешь** — достаточно подтвердить готовность.

---

## Первое интервью (Screening Call)

| Вопрос | Хороший ответ |
|--------|-------------|
| Tell me about yourself | 2 мин: Past → Present → Future (почему эта компания) |
| Why are you relocating? | "Seeking international experience; excited by EU tech ecosystem" |
| Salary expectations | Называть диапазон по рынку; не ниже рыночного |
| Visa sponsorship? | Спрашивать прямо на 1-2 интервью |
| When can you start? | Notice period 1-3 мес ИЛИ "immediately" |

---

## STAR-истории: что подготовить

| Тема | Примеры ситуаций |
|------|----------------|
| Технический успех | Улучшил производительность API на 40% |
| Провал и урок | Допустил баг в продакшн; как исправил |
| Конфликт | Не согласился с архитектурным решением |
| Лидерство без власти | Убедил команду изменить подход |
| Коллаборация | Работал с PM/Design на спорном решении |

---

## Техническое интервью EU: чего ожидать

| Раунд | Типичный контент |
|-------|----------------|
| Coding | Leetcode Medium: Two Sum, Sliding Window, BFS/DFS |
| System Design | URL Shortener, Rate Limiter, Twitter Timeline |
| Behavioral | STAR; 8-10 историй |

---

## Ресурсы подготовки

| Ресурс | Для чего |
|--------|---------|
| Leetcode.com | Coding задачи |
| Pramp.com | Бесплатные мок-интервью |
| Interviewing.io | Платные мок с FAANG-инженерами |
| Glassdoor Interview Questions | Вопросы конкретной компании |
| Levels.fyi | Зарплаты для переговоров |

---

## Итого

Cover Letter и интервью при переезде 2026: 3 абзаца (факт о компании + 2-3 достижения с цифрами + подтверждение переезда); screening call = STAR + Tell me about yourself (2 мин) + salary expectations (называть диапазон); спрашивать о visa sponsorship прямо на 1-2 интервью; Leetcode Medium + System Design + 8-10 STAR-историй; Pramp/Interviewing.io для практики. Главное: достижения с цифрами везде.
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
console.log(`\nБатч 188: ${ok} OK, ${err} ошибок`);

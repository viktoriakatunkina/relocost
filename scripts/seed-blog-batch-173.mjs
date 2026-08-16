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
    slug: 'kak-snyat-kvartiru-v-berlyne-2026',
    title: 'Как снять квартиру в Берлине в 2026 году: ImmobilienScout, конкуренция, документы',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Как снять квартиру в Берлине 2026: платформы поиска аренды в Берлине (ImmobilienScout24 IS24 — крупнейший немецкий портал; WG-Gesucht.de — комнаты в коммуналках (WG = Wohngemeinschaft); eBay Kleinanzeigen — частники без агента; Immowelt.de — альтернатива IS24); конкурентность берлинского рынка (в 2024 на одну объявленную квартиру: 150-300 заявок; агент/маклер стали платными только для арендодателя с 2015 (Bestellerprinzip) — агент бесплатно для арендатора; время ответа критично — отвечать за 30 мин от публикации); документы пакет (Schufa-Auskunft — кредитная история Германии; получить через schufa.de за €29.95 или бесплатно ChoicE (раз в год); Mietschuldenfreiheitsbescheinigung — справка от предыдущего арендодателя об отсутствии задолженности; Selbstauskunft — анкета арендатора (имя/семья/доход/работа); Gehaltsnachweise — последние 3 зарплатных листка ИЛИ трудовой договор; Reisepass + Meldebescheinigung — прописка); почему берлинский рынок сложный (Berlin Mietspiegel — таблица арендных ставок; Mietpreisbremse (ограничение арендной платы) есть но обходится много кем; Kaltmiete vs Warmmiete — Warmmiete включает отопление и часть коммунальных; типичная Kaution (залог) = 3 Kaltmiete вперёд)',
    seo_description: 'Как снять квартиру в Берлине 2026: РЫНОК: 2024 — один из самых конкурентных в EU; среднее число заявок на одну квартиру: 200-400 (в топовых районах ещё больше); средняя Kaltmiete 1BR 2024: €18-21/кв.м = 1BR 45 кв.м = €810-945/мес Kaltmiete (Warmmiete +€150-250 отопление+вода = Warmmiete €1 000-1 200/мес средняя); ПЛАТФОРМЫ: ImmobilienScout24 (immobilienscout24.de; самый большой; Suchabo ($4.99/мес для моментальных уведомлений — обязательно если серьёзно ищешь); WG-Gesucht.de (wg-gesucht.de; WG-комнаты (€400-800/мес) и целые квартиры; популярен у молодых и иностранцев; фильтр Gesamtmiete — Warmmiete (все включено)); Kleinanzeigen (eBay Kleinanzeigen; kleinanzeigen.de; частники без маклера; дешевле но меньше выбора); Immowelt (альтернатива IS24); Facebook Groups «WG Berlin»/«Expat Berlin»; Вся работа занимает 1-3 мес активного поиска; ДОКУМЕНТЫ ПАКЕТ (Bewerbungsmappe): Schufa-Auskunft (запросить до начала поиска; через schufa.de €29.95; или ChoicE запрос бесплатный раз в год; свежая = не старше 3 мес); Mietschuldenfreiheitsbescheinigung (справка предыдущего арендодателя; или письмо что снимали без долгов; иностранцы часто не имеют → писать объяснительное о первом переезде); Selbstauskunft (Antragsformular — заполнять точно без утайки; скачать образец онлайн); 3 последних Gehaltsnachweis (зарплатных листка) ИЛИ Arbeitsvertrag (трудовой договор); Reisepass/Personalausweis копия; немецкая Meldebescheinigung при наличии (получить сначала в Airbnb на 1-2 мес → через Bürgeramt зарегистрироваться → получить Meldebescheinigung → с ней проще снять квартиру); СОВЕТЫ: создать Schufa заранее; переводить документы на немецкий у присяжного переводчика; иметь пакет в PDF и бумажной версии; отвечать на объявление в первые 30 мин (критично!); первое письмо должно быть коротким (3-4 предложения) но личным (почему именно ЭТА квартира); предлагать депозит на месте — показывает серьёзность; посещать все доступные Besichtigungen (просмотры).',
    content_md: `# Как снять квартиру в Берлине: рынок, платформы, документы

Берлинский рынок — один из самых конкурентных в EU. 200-400 заявок на одну квартиру. Успех = правильный пакет документов + скорость реакции.

## Берлинский рынок аренды 2024

| Параметр | Значение |
|---------|---------|
| Средние заявки на 1 квартиру | 200-400 |
| 1BR Kaltmiete (аренда без ЖКУ) | €900-1 500/мес |
| 1BR Warmmiete (всё включено) | €1 100-1 800/мес |
| Типичный залог (Kaution) | 3 Kaltmiete (≈€2 700-4 500) |

**Kaltmiete vs Warmmiete:**
- Kaltmiete = только аренда
- Warmmiete = Kaltmiete + Betriebskosten (вода/отопление/домофон)

---

## Платформы поиска

| Платформа | Особенность |
|-----------|------------|
| **ImmobilienScout24** | Крупнейший; Suchabo €4.99/мес для мгновенных уведомлений |
| **WG-Gesucht.de** | WG-комнаты + квартиры; популярен у иностранцев |
| **Kleinanzeigen** | Частники без маклера; дешевле |
| **Immowelt** | Альтернатива IS24 |
| **Facebook Groups** | «WG Berlin» / «Expat Berlin» |

**ImmobilienScout24 Suchabo** — обязательно. Мгновенные уведомления о новых объявлениях — критично, т.к. лучшие квартиры разлетаются за часы.

---

## Пакет документов (Bewerbungsmappe)

| Документ | Как получить |
|---------|-------------|
| **Schufa-Auskunft** | Schufa.de €29.95 (или ChoicE — бесплатно раз/год) |
| **Mietschuldenfreiheitsbescheinigung** | От предыдущего арендодателя (для иностранцев — объяснительное) |
| **Selbstauskunft** | Анкета арендатора (скачать образец онлайн) |
| **Gehaltsnachweis × 3** | Последние 3 зарплатных листка |
| **Arbeitsvertrag** | Трудовой договор (вместо листков) |
| **Reisepass + Meldebescheinigung** | Паспорт + справка о регистрации |

**Для иностранцев без немецкой Schufa:**
- Написать объяснительное письмо
- Предложить бОльший залог (4-5 Kaltmiete)
- Показать выписку из банка за 3-6 мес

---

## Как получить Meldebescheinigung

**Порядок для первого переезда:**

1. Снять Airbnb/HousingAnywhere на 1-2 месяца
2. Зарегистрироваться в Bürgeramt (записаться онлайн заранее!)
3. Получить Meldebescheinigung
4. С Meldebescheinigung + Schufa → снять постоянную квартиру

---

## Тактика выигрыша конкуренции

**Скорость:** отвечать на объявление в первые **30 минут** от публикации.

**Первое письмо (3-4 предложения):**
- Кто вы (IT-специалист, работаю в [компании])
- Почему именно эта квартира (конкретно)
- Когда готовы заехать

**На просмотре (Besichtigung):**
- Принести распечатанный пакет документов
- Предложить депозит на месте (сигнал серьёзности)
- Быть вежливым и конкретным

---

## Популярные районы и цены

| Район | Kaltmiete 1BR | Характер |
|-------|------------|---------|
| Mitte | €1 400-2 200 | Центр, дорого |
| Prenzlauer Berg | €1 200-1 800 | Хипстерский, семейный |
| Kreuzberg | €1 100-1 700 | Богемный, экспаты |
| Neukölln | €950-1 400 | Доступный, молодёжный |
| Tempelhof | €900-1 300 | Спокойный, дешевле |
| Spandau/Reinickendorf | €700-1 100 | Пригороды, дешевле всего |

---

## Итого

Как снять квартиру в Берлине 2026: рынок конкурентный (200-400 заявок/квартира); платформы ImmobilienScout24 (Suchabo) + WG-Gesucht + Kleinanzeigen; пакет документов (Schufa + 3 Gehaltsnachweis + Selbstauskunft + Meldebescheinigung); тактика = отвечать за 30 мин + личное письмо + принести документы на просмотр; цены 1BR €700-2 200 в зависимости от района.
`,
  },
  {
    slug: 'niderlandy-amsterdam-vs-eydhoven-2026',
    title: 'Нидерланды: Амстердам vs Эйндховен vs Роттердам для IT в 2026 году',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Нидерланды Амстердам Эйндховен Роттердам IT 2026: Амстердам (Amsterdam: международный финансовый+tech центр; Booking.com HQ/Adyen/TomTom/IMDB/Uber Europe/TikTok EU/Netflix EU; самый дорогой — аренда 1BR €1 600-3 200/мес; 30% ruling первые 5 лет для иностранных специалистов с зарплатой ≥€46 107/год; НДФЛ 37%/49.5%; Senior IT €5 500-10 000/мес); Эйндховен (Eindhoven: технологический кластер; ASML (крупнейшая semiconductor-компания EU; €28B выручка; EUV lithography; 3 000+ позиций постоянно; зарплата €80k-150k/год), NXP Semiconductors (HQ Eindhoven), Philips (HQ Eindhoven — medical devices R&D), DAF Trucks; значительно дешевле Амстердама — аренда 1BR €900-1 500/мес; HSM visa (Highly Skilled Migrant) от €5 008/мес 2024 для 30+ лет; жизнь $1 600-2 500/мес); Роттердам (Rotterdam: второй крупнейший порт мира; ABN AMRO/ING/Unilever EU HQ; аренда 1BR €900-1 400/мес; дешевле Амстердама на 40%; Shell EMEA; архитектура (Erasmusbrug/Cube Houses); MVRDV офис тут)',
    seo_description: 'Нидерланды Амстердам vs Эйндховен vs Роттердам IT 2026: 30% RULING (expat налоговый режим): работодатель может выплачивать 30% зарплаты необлагаемым возмещением расходов (housing/school/travel); условия 2024: зарплата ≥€46 107/год gross (молодые специалисты до 30 лет: ≥€35 048/год); работник должен жить за пределами NL в радиусе >150 km минимум 16 мес из 24 мес до найма (revised 2023!); срок льготы: 60 мес (5 лет) с 2024 реформой — раньше было 5 лет; к 2027 реформируют ещё раз (переходный период); эффективная нагрузка с 30% ruling Senior (€100k/год): (100k × 70%) × 37-49.5% = 26-35% vs без ruling 37-49.5%; КАК ПОЛУЧИТЬ: работодатель подаёт заявление совместно с работником в Belastingdienst (налоговая NL); обычно работодатель берёт на себя; ГОРОДА: АМСТЕРДАМ: Booking.com (HQ центр Амстердама; 18 000+ чел.)/Adyen (fintech NYSE ADYEN; $14B кап)/TomTom (maps; AMS0)/Uber Europe HQ/Netflix EU HQ/TikTok EU HQ/Payu/IMDB Europe; аренда 1BR Centrum/Canal Ring €2 000-3 500/мес; Amsterdam-Noord/Bos en Lommer €1 400-2 000; жизнь $2 800-5 000/мес; самый дорогой NL (аренда дороже Берлина); Senior IT €6 000-10 000/мес; ЭЙНДХОВЕН: ASML (Veldhoven — 10 мин от центра; EUV lithography machines; продаёт единственная в мире; выручка €27.6B (2023); Senior Software/Systems Engineer €80k-160k/год; 3 000+ открытых позиций); NXP Semiconductors ($14B выручка; mixed-signal ICs; HQ Эйндховен); Philips (HQ Эйндховен; Medical Devices/HealthTech; Digital Pathology/Monitoring); DesignHuis, ASML Campus; аренда 1BR €900-1 400/мес; жизнь $1 700-2 600/мес; значительно дешевле Амстердама; HSM visa порог 30+ лет €5 008/мес; РОТТЕРДАМ: Shell Europe HQ (Malietoren) + Netherlands R&D; Unilever EU HQ (Rotterdam); ABN AMRO IT hub; KPMG NL HQ; Ernst&Young; аренда 1BR €900-1 400/мес; Rotterdam Architecture (Erasmusbrug, Cube Houses, De Rotterdam Tower MVRDV); порт (самый крупный в EU); дешевле Амстердама на 35-40%.',
    content_md: `# Нидерланды: Амстердам vs Эйндховен vs Роттердам для IT

Три разных NL города — три разных профиля. Booking.com в Амстердаме, ASML в Эйндховене, Shell в Роттердаме. И 30% ruling для всех.

## 30% Ruling: ключевая льгота

**30% зарплаты необлагаемо налогом** — для иностранных специалистов.

**Условия (2024):**
- Зарплата ≥€46 107/год (молодые до 30 лет: ≥€35 048/год)
- Жили за пределами NL в радиусе >150 км минимум 16 мес из 24 мес до найма
- Срок: 60 месяцев (5 лет)

**Пример Senior (€100k/год):**

| | Без 30% ruling | С 30% ruling |
|--|----------------|-------------|
| Налогооблагаемая база | €100k | **€70k** |
| НДФЛ | 37-49.5% | 37-49.5% |
| Эффективная ставка | 43-49% | **28-35%** |

---

## Амстердам: международный tech-хаб

**Работодатели:**
| Компания | Профиль |
|---------|---------|
| **Booking.com** | Online travel (18 000+ чел. в Амстердаме) |
| **Adyen** | Fintech payments (NYSE; $14B) |
| **TomTom** | Maps and navigation |
| **Uber Europe** | European HQ |
| **TikTok EU** | European HQ |
| **Netflix EU** | EMEA HQ |

**Зарплаты IT:** Senior €6 000-10 000/мес

**Стоимость жизни:**
| Статья | EUR/мес |
|--------|---------|
| Аренда 1BR (центр) | 2 000-3 500 |
| Аренда 1BR (North/Bos) | 1 400-2 000 |
| Продукты | 400-600 |
| Жизнь итого | **2 800-5 000** |

---

## Эйндховен: ASML и полупроводники

**ASML** — единственный в мире производитель EUV-литографии. Без ASML нет современных чипов (TSMC/Samsung/Intel используют машины ASML). Выручка €27.6 млрд (2023). 3 000+ открытых позиций постоянно.

**Зарплаты ASML:** €80 000-160 000/год

**Другие работодатели:**
| Компания | Профиль |
|---------|---------|
| **ASML** | EUV lithography (мировая монополия) |
| **NXP Semiconductors** | Mixed-signal ICs ($14B выручка) |
| **Philips** | Medical Devices/HealthTech |
| **DAF Trucks** | Automotive tech |

**Стоимость жизни Эйндховена:**
| Статья | EUR/мес |
|--------|---------|
| Аренда 1BR | 900-1 400 |
| Жизнь итого | **1 700-2 500** |

**Эйндховен на 40% дешевле Амстердама** при работодателях мирового уровня.

---

## Роттердам: логистика, Shell, архитектура

**Работодатели:**
| Компания | Профиль |
|---------|---------|
| **Shell Europe** | Нефть + Energy tech |
| **Unilever EU** | Consumer goods EMEA HQ |
| **ABN AMRO** | Banking IT |
| **Port of Rotterdam** | Smart port tech |

**Особенность:** Роттердам — архитектурная столица Нидерландов (Erasmusbrug, Cube Houses, De Rotterdam Tower by MVRDV).

**Стоимость жизни:** 1BR €900-1 400/мес. На 35-40% дешевле Амстердама.

---

## Сравнение городов

| Критерий | Амстердам | Эйндховен | Роттердам |
|---------|----------|----------|----------|
| Аренда 1BR | €1 400-3 500 | €900-1 400 | €900-1 400 |
| IT зарплата Senior | €6 000-10 000 | €5 000-9 000 | €4 500-7 500 |
| Работодатели | Booking/Adyen/Netflix | ASML/NXP/Philips | Shell/ABN/Unilever |
| Специализация | Tech+fintech | Semiconductors | Logistic+energy |
| Международность | Очень высокая | Высокая | Средняя |

---

## Visa: HSM (Highly Skilled Migrant)

| Возраст | Зарплата порог |
|---------|-------------|
| 30+ лет | €5 008/мес gross |
| до 30 лет | €3 672/мес gross |

Обработка: 2-4 нед. Через работодателя (зарегистрированный IND sponsor).

---

## Итого

Нидерланды Амстердам vs Эйндховен vs Роттердам IT 2026: 30% ruling (5 лет; ≥€46 107/год; снижает НДФЛ 43%→28%); Амстердам (Booking.com/Adyen/Netflix; Senior €6-10k/мес; дорого €2.8-5k/мес жизни); Эйндховен (ASML EUV #1 мира; €80-160k/год; жизнь €1 700-2 500/мес — лучшее соотношение); Роттердам (Shell/ABN AMRO; €900-1 400 аренда; архитектурный город). Для IT: Эйндховен = лучшее соотношение зарплата/жизнь+ASML уникален.
`,
  },
  {
    slug: 'kak-vyuchit-nemetskiy-dlya-pereezda-plan-2026',
    title: 'Как выучить немецкий для переезда в Германию: план B1 за 9-12 месяцев',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Как выучить немецкий для переезда в Германию 2026: уровни CEFR для переезда (A1-A2: базовое выживание, бытовые разговоры; B1: минимум для Einbürgerung (гражданство), необходим для ряда ВНЖ и интеграционных курсов; B2: комфортная работа и жизнь; C1: профессиональный уровень, академическое письмо; EU Blue Card — немецкий тест НЕ требуется; Niederlassungserlaubnis (ПМЖ) — требует B1 или А1 Ehe (для воссоединения с супругом); Einbürgerung (гражданство) — требует B1 минимум); реальные сроки для носителя русского (A1: 3-4 мес по 1 час/день = 120-160 часов; B1: 9-12 мес по 1 час/день = 360-500 часов; B2: 18-24 мес; Council of Europe рекомендует: German B2 = 900 часов total для славянских носителей); план: Месяц 1-3: A1 (Duolingo + учебник Netzwerk A1/Schritte A1; 200 базовых слов через Anki; записаться к tandem partner или iTalki); Месяц 4-6: A2 (Schritte A2/Klett A2; подкасты Slow German; Deutsche Welle Deutsch lernen; слушать много хотя бы 30 мин/день); Месяц 7-9: B1 (Hueber B1/Cornelsen B1; упражнения по грамматике — артикли до автоматизма; italki разговорные сессии 3 раза/нед; смотреть немецкое телевидение с субтитрами (ard.de)); Месяц 10-12: B1 экзамен Goethe B1 или TestDaF; основные экзамены: Goethe-Zertifikat B1 (Goethe-Institut; €150-200; международно признан; для ПМЖ/гражданства); telc B1 (альтернатива; дешевле; ряд мест принимает); TELC Deutsch B1 Integration — специальный для интеграционных курсов; где сдать в России: Goethe Institut Москва/СПб (всё ещё работает)',
    seo_description: 'Как выучить немецкий для переезда 2026: СРОКИ: Совет Европы: достижение B1 с нуля для русскоязычных = 350-450 учебных часов (немецкий ближе к категории III по трудности для носителей русского; проще чем финский/японский, но сложнее чем испанский); реалистичный план: 1 час/день × 9-12 мес = B1; УЧЕБНИКИ: Netzwerk (Klett Verlag; A1/A2/B1; очень современный; с аудио и онлайн дополнениями); Schritte Plus Neu (Hueber; структурированный; популярный в Германии на интеграционных курсах); Grammatik Aktiv (Cornelsen; практика грамматики; отличный для самостоятельной работы); ПРИЛОЖЕНИЯ И ПЛАТФОРМЫ: Duolingo (хорош для первых 3-4 мес, A1; потом недостаточен); Babbel (платный $8/мес; структурированные уроки; лучше Duolingo для систематики); Anki (карточки с spaced repetition; загрузить готовую деку «Deutsch A1/A2» или немецкие 5000 слов); iTalki.com (разговорная практика с носителем; Community Tutor €10-20/час; 2-3 сессии в неделю); Tandem app (языковой обмен; найти немца который учит русский → взаимная помощь); Deutsche Welle (dw.com/de-learn-german; бесплатно; уровни A1-B1; подкасты + тексты + упражнения); Slow German (podkast Annik Rubens; медленная речь; B1 хорошо подходит); Nicos Weg (ARD/DW; видеосериал для учащихся; A1-B1; бесплатно YouTube); ГРАММАТИКА: немецкие артикли (der/die/das; учить с каждым существительным; Anki очень помогает); падежи (Nominativ/Akkusativ/Dativ/Genitiv; у русских легче чем у других — похожая система); глагольные позиции (V2 в главном предложении; глагол в конец придаточного); трудности: der/die/das запомнить = главная проблема; ЭКЗАМЕН: Goethe-Zertifikat B1 (goethe.de; €150-200; состоит из Hören/Lesen/Schreiben/Sprechen; принимается для ПМЖ/гражданства РФ; можно сдать в России — Гёте-Институт Москва/СПб)',
    content_md: `# Как выучить немецкий для переезда: план B1 за 9-12 месяцев

Немецкий нужен для ПМЖ (Niederlassungserlaubnis) и гражданства (B1). Для Blue Card — тест не требуется. Реальный план: 1 час в день.

## Немецкий для каких документов нужен

| Документ | Уровень |
|---------|---------|
| EU Blue Card | **Не требуется** |
| Niederlassungserlaubnis (ПМЖ) | **B1** |
| Familiennachzug (воссоединение семьи) | A1 (супруг) |
| Einbürgerung (гражданство) | **B1** |

---

## Реальные сроки для носителя русского

| Уровень | Часов | При 1 ч/день |
|---------|-------|-------------|
| A1 | 120-150 | 4 месяца |
| A2 | +100-130 | +4 месяца |
| **B1** | **+120-150** | **+4 месяца** |
| **Итого A0→B1** | **350-430 ч** | **~12 месяцев** |

Совет Европы: немецкий = Категория III для носителей русского (похожая системя падежей → легче артикли). Но артикли der/die/das — главная трудность.

---

## 12-месячный план

### Месяц 1-3: A1

**Учебник:** Netzwerk A1 (Klett) или Schritte Plus A1 (Hueber)

| Задача | Инструмент |
|-------|-----------|
| Базовый словарь 300 слов | **Anki** (готовая дека) |
| Грамматика A1 | Учебник |
| Слух | Deutsche Welle (dw.com) |
| Разговор | Tandem или iTalki €10-15/ч |

---

### Месяц 4-6: A2

**Добавить:**
- Подкаст **Slow German** (Annik Rubens) — медленная речь
- YouTube: **Nicos Weg** (ARD/DW; A2-B1)
- Грамматика: все падежи до автоматизма

---

### Месяц 7-9: B1

**Добавить:**
- iTalki разговорные сессии **3 раза/неделю**
- ARD Mediathek — немецкое телевидение с субтитрами
- Тренировочные тесты Goethe B1

---

### Месяц 10-12: Подготовка к экзамену

- Разбор структуры экзамена (Hören/Lesen/Schreiben/Sprechen)
- Пробные тесты (goethe.de)
- Сдача Goethe-Zertifikat B1

---

## Лучшие инструменты

| Инструмент | Стоимость | Для чего |
|-----------|----------|---------|
| **Duolingo** | Бесплатно | Первые 3-4 мес (A1) |
| **Babbel** | $8/мес | Структурированные уроки |
| **Anki** | Бесплатно | Слова (spaced repetition) |
| **iTalki** | €10-20/час | Разговорная практика |
| **Deutsche Welle** | Бесплатно | Слух + тексты A1-B1 |
| **Slow German** | Бесплатно | Подкаст для B1 |

---

## Главные трудности немецкого

| Трудность | Совет |
|---------|-------|
| Артикли der/die/das | Учить с каждым существительным в Anki |
| Глагол в конец придаточного | Практика → автоматизм |
| Падежи (Kasus) | Таблицы + практика (у русских легче) |
| Длинные слова | Разбивать на части (Arbeitslosengeld = работа+без+деньги) |

---

## Goethe-Zertifikat B1: как сдать

| Параметр | Значение |
|---------|---------|
| Стоимость | €150-200 |
| Разделы | Hören + Lesen + Schreiben + Sprechen |
| Место в РФ | Гёте-Институт Москва / Санкт-Петербург |
| Признаётся | ПМЖ + гражданство Германии |

---

## Итого

Как выучить немецкий для переезда 2026: EU Blue Card — тест не нужен; ПМЖ/гражданство — B1 обязателен; реальный план: 1 час/день × 12 мес = B1; инструменты Anki+Duolingo(A1)+Babbel+Deutsche Welle+Slow German+iTalki 3×/нед; главная трудность — артикли der/die/das (учить с каждым словом в Anki); сдать Goethe-Zertifikat B1 (€150-200; в Германии или России).
`,
  },
  {
    slug: 'novaya-zelandiya-auckland-it-silver-fern-2026',
    title: 'Новая Зеландия и Окленд для IT в 2026 году: Silver Fern, Weta Digital, Xero',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Новая Зеландия Окленд IT Silver Fern 2026: Silver Fern Work Visa (работает с 2022; lottery/ballot для 300 мест; требования: возраст 18-30 лет; IELTS 6.5+; последние 2 года учёбы за рубежом; жить вне NZ; срок 2 года в NZ → потенциально Skilled Migrant PR); Accredited Employer Work Visa (AEWV; заменила Talent visa; работодатель должен быть аккредитован Immigration NZ; зарплата ≥NZD $27.76/час = NZD $57 740/год = $35 000 USD (минимальный порог для аккредитованного работодателя); для IT Senior: значительно выше; ПМЖ: Skilled Migrant Category (SMC); PR для тех кто уже в NZ; points-based; Skilled IT ANZSCO: 261312 Developer); НДФЛ Новой Зеландии: прогрессивный 10.5%-39%; взносы KiwiSaver (пенсионный) 3% работник + 3% работодатель + $521/год государство; NZD/USD: 1 USD = 1.64 NZD (2024; нестабилен); стоимость жизни Окленд ($2 500-4 500/мес; дорогой EU-уровень); аренда 1BR центр NZD 2 000-3 500/мес; IT-компании Новой Зеландии: Xero (cloud accounting; ASX XRO; $11B; Wellington+Auckland; 4 500 чел), Weta Digital (visual effects; куплен Unity 2021 за $1.625 млрд; Lord of the Rings/Avatar; Wellington), Fisher&Paykel Healthcare (medical devices; ASX FPH; NZ tech), Orion Health (health IT; NZX), Datacom (IT services)',
    seo_description: 'Новая Зеландия Окленд IT 2026: Silver Fern Work Visa (SFV; работает в режиме ballot лотереи — 300 мест/год; requirements: возраст 18-30 лет (или 31+ если отдельные категории); IELTS General Training ≥6.5 all bands; прожили вне NZ последние 3 месяца; учились за рубежом последние 2 года из 5; срок визы 2 года в NZ (work, live, travel) → можно подать на Skilled Migrant PR если получили квалифицированную работу); Accredited Employer Work Visa (AEWV): Immigration NZ аккредитует работодателей; salary threshold: NZD $27.76/час (ANZSCO Level 1 = NZD $29.66/час для TEER 0/1/2); IT зарплата Senior NZD $90k-160k/год ($55k-98k USD); Skilled Migrant Category (SMC/RV): новая версия с 2022 — упрощённая; points за NZ работу + NZ образование + age; НДФЛ: 10.5% до NZD $14 000/год; 17.5% до $48 000; 30% до $70 000; 33% до $180 000; 39% свыше $180 000; KiwiSaver: работник 3% + работодатель 3% (mandatory employer contribution с 2022) + government $521/год; NET Senior NZD $120k/год: ~NZD $84k/год = NZD $7 000/мес = $4 270 USD/мес; стоимость жизни Auckland: 1BR City Center NZD 2 000-3 200/мес ($1 220-1 951 USD); Western Auckland/Manukau NZD 1 500-2 200/мес; продукты NZD 600-900/мес; жизнь итого $2 500-4 200 USD/мес; компании: Xero (Wellington HQ; Auckland офис; cloud accounting; ASX: XRO; $11B; 4 500 чел; 95% revenue international; developer salary NZD 90k-150k); Weta Digital (Wellington; visual effects — Avatar/LOTR/Planet of Apes; куплен Unity Technologies 2021 $1.625B; tech-side CGI rendering R&D); Fisher&Paykel Healthcare (Auckland; FPH; medical devices; ASX; NZD 1.8B выручка); Datacom (Auckland; IT services/cloud; NZD $1.3B); MYOB (cloud accounting; альтернатива Xero); Orion Health (health IT); Vodafone NZ; Auckland = largest NZ city (1.7M); Wellington = capital (500k); Christchurch = tech growing ($800M rebuild funds).',
    content_md: `# Новая Зеландия: Xero, Weta Digital, Silver Fern, качество жизни

Новая Зеландия — Xero (cloud accounting) и Weta Digital (Avatar, Lord of the Rings). Silver Fern Visa для молодых специалистов. Высокое качество жизни.

## Почему Новая Зеландия для IT

- **Silver Fern Visa:** 2 года без оффера (до 30 лет)
- Xero ($11B, ASX) — cloud accounting, Wellington HQ
- Weta Digital (Avatar/LOTR) — куплен Unity за $1.625 млрд
- Безопасность + природа + English официальный
- Гражданство через 5 лет

---

## Silver Fern Work Visa

**Лотерея 300 мест/год:**

| Условие | Требование |
|---------|-----------|
| Возраст | 18-30 лет |
| IELTS | ≥6.5 все разделы |
| Место жительства | Вне NZ последние 3 мес |
| Учёба | За рубежом последние 2 из 5 лет |
| Срок | 2 года в NZ |

**После визы:** найти квалифицированную работу → подать на Skilled Migrant PR.

---

## Accredited Employer Work Visa (AEWV)

**Стандартный путь с оффером:**

- Работодатель аккредитован Immigration NZ
- Зарплата ≥NZD $27.76/час (TEER 0/1/2: ≥NZD $29.66/час)
- IT Senior зарплата: NZD $90k-160k/год

---

## НДФЛ Новой Зеландии

| Доход (NZD/год) | Ставка |
|----------------|--------|
| до 14 000 | 10.5% |
| 14 000-48 000 | 17.5% |
| 48 000-70 000 | 30% |
| 70 000-180 000 | 33% |
| свыше 180 000 | 39% |

**KiwiSaver (пенсионный):**
- Работник: 3%
- Работодатель: 3%
- Государство: +NZD $521/год

**NET Senior NZD $120k/год:** ~NZD $84 000 = NZD $7 000/мес = **$4 270 USD/мес**

---

## IT-компании Новой Зеландии

| Компания | Профиль | Факт |
|---------|---------|------|
| **Xero** | Cloud accounting | ASX XRO; $11B; Wellington HQ; 4 500 чел |
| **Weta Digital** | Visual effects | Avatar/LOTR; куплен Unity 2021 за $1.625B |
| **Fisher&Paykel Healthcare** | Medical devices | ASX FPH; NZD 1.8B выручка |
| **Datacom** | IT services | NZD $1.3B; Auckland |
| **Orion Health** | Health IT | NZX listed |

### Xero

Основан в Веллингтоне в 2006 Родом Друри. Cloud accounting SaaS. ASX: XRO. $11B пиковая кап. 4 500 сотрудников. 3+ миллиона клиентов. 95% выручки — международная (UK + AU + US). Developer salary: NZD $90k-150k/год.

---

## Зарплаты IT в Окленде

| Должность | NZD/год | USD/год |
|-----------|---------|---------|
| Junior Dev | 60k-80k | $37k-49k |
| Middle Dev | 80k-120k | $49k-73k |
| Senior Dev | 100k-160k | $61k-98k |

---

## Стоимость жизни Окленда

| Статья | NZD/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (City Center) | 2 000-3 200 | $1 220-1 951 |
| Аренда 1BR (Western AKL) | 1 500-2 200 | $915-1 341 |
| Продукты | 700-1 000 | $427-610 |
| Транспорт | 200-350 | $122-213 |
| **Итого** | **4 400-7 050** | **$2 683-4 299** |

---

## Путь к гражданству

| Этап | Срок |
|------|------|
| Silver Fern Visa | 2 года |
| Skilled Migrant PR | После оффера в NZ |
| NZ Citizenship | **5 лет** постоянного резидентства |

---

## Итого

Новая Зеландия Окленд IT 2026: Silver Fern Visa (30 лет, IELTS 6.5, 2 года без оффера); AEWV (с оффером, NZD $27.76/час); Xero (cloud accounting, Wellington)/Weta Digital ($1.6B)/Fisher&Paykel; Senior NZD $100-160k/год, NET ~$4 270 USD/мес; жизнь $2 680-4 300 USD/мес; гражданство 5 лет. Идеально для: молодые (до 30) Xero/Weta Digital + Silver Fern Visa без оффера + English + природа.
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
console.log(`\nБатч 173: ${ok} OK, ${err} ошибок`);

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
    slug: 'latviya-riga-it-2026',
    title: 'Латвия Рига IT 2026: EU страна, Startup Visa, €600-1 100 аренда, Printful €1B',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Латвия Рига IT 2026 EU страна Startup Visa аренда Printful переезд Балтия',
    seo_description: 'Латвия Рига IT 2026 EU страна Startup Visa аренда Printful переезд Балтия Прибалтика',
    content_md: `# Латвия IT 2026: EU-страна, Startup Visa, Printful €1B, Рига €600-1 100 аренда, Art Nouveau столица

Латвия — EU-страна с уникальным Art Nouveau архитектурным наследием (Рига — крупнейший Art Nouveau ансамбль в мире!). Printful (€1B; print-on-demand; Рига). Startup Visa для инновационных компаний. EU Blue Card: порог €8 500/год (очень низкий!). НДФЛ 20%.

---

## EU Blue Card Латвия

| Параметр | Значение |
|---------|---------|
| Доход | €8 500/год (один из самых низких в EU!) |
| Срок | 2 года |
| ПМЖ | 5 лет |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Printful | €1B; Print-on-Demand; Рига |
| Mintos | €400M; P2P lending |
| Infogr.am | Infographics; Рига |
| Accenture | Офис разработки; Рига |
| EPAM Systems | Офис разработки |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Рига (Центр; Art Nouveau) | €700-1 200 |
| Рига (Агенскалнс; Чиекуркалнс) | €500-900 |
| Юрмала (пляж) | €600-1 200 (летом) |

---

## Почему Латвия

- Art Nouveau: Рига имеет крупнейшее собрание Art Nouveau зданий в мире (800+!)
- Рига ЮНЕСКО исторический центр
- Юрмала (пляжный курорт; 30 мин от Риги; Балтийское море)
- EU + Schengen + Euro
- Низкий порог EU Blue Card
- Английский хорошо знают молодежь

---

## Itogo

Латвия IT 2026: EU Blue Card €8 500/год (дешевейший в EU!); Startup Visa (инновационный стартап); Printful €1B (print-on-demand; Рига!); Mintos P2P; Рига €600-1 200 (Art Nouveau ЮНЕСКО = красивейший центр Балтии!); Jurmala (30 мин; Рижское взморье; сосны + пляж!); EU Schengen Euro; НДФЛ 20%; рижский черный хлеб (плотный; с тмином; самый вкусный в мире для знатоков!); Rupjmaize; Pirmie restoraniSS; Рождественская ярмарка Риги (одна из старейших в мире с 1201!); цены на алкоголь (самые низкие в EU!); EU-паспорт 10 лет.
`,
  },
  {
    slug: 'estoniya-tallin-it-2026',
    title: 'Эстония Таллин IT 2026: EU страна, e-Residency, Wise €11B, €800-1 500 аренда, Digital Society',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Эстония Таллин IT 2026 EU страна e-Residency Wise аренда Digital Society переезд',
    seo_description: 'Эстония Таллин IT 2026 EU страна e-Residency Wise аренда Digital Society переезд Балтия',
    content_md: `# Эстония IT 2026: e-Residency, Wise €11B, Bolt €8B, Таллин €800-1 500 аренда, самое цифровое государство

Эстония — самое цифровое государство мира. 99% государственных услуг онлайн. Декларация налогов занимает 5 минут. Wise (€11B; international transfers). Bolt (€8B; ride-hailing). Skype был эстонским (продан eBay $2.6B 2005). e-Residency: цифровое гражданство без переезда. Startup Visa.

---

## e-Residency: что это на самом деле

| Параметр | Значение |
|---------|---------|
| Стоимость | €190 |
| Что дает | Регистрация OÜ (ООО) онлайн |
| Что НЕ дает | Право жить в Эстонии; ВНЖ; гражданство |
| Налог на прибыль OÜ | 0% (20% только при дивидендах!) |
| Для кого | Предприниматели; фрилансеры без переезда |

---

## Startup Visa Эстония

| Параметр | Значение |
|---------|---------|
| Условие | Инновационный масштабируемый стартап |
| Одобрение | Startup Estonia; Unicorn Squad |
| Срок | 1 год → продление |
| Для кого | Основатели tech-стартапов |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Wise | €11B; International Money Transfer |
| Bolt | €8B; Ride-hailing; Delivery |
| Pipedrive | $1.5B; CRM |
| Skeleton Technologies | Energy storage; Automotive |
| Veriff | $1.5B; Identity verification |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Таллин (Старый город; Kadriorg) | €900-1 600 |
| Таллин (Lasnamae; Mustamae) | €600-1 100 |
| Тарту (2-й город; университетский) | €500-900 |

---

## Itogo

Эстония IT 2026: самое цифровое государство мира (99% услуг онлайн; налоги 5 мин!); e-Residency $190 (OÜ онлайн; 0% нераспределенная прибыль; НЕ = ВНЖ!); Wise €11B; Bolt €8B; Pipedrive $1.5B; Veriff $1.5B; Startup Visa (инновационный стартап); EU Blue Card €10 500/год порог; Таллин €800-1 500 (средневековый ЮНЕСКО-центр; один из самых красивых в EU!); Тарту (университет; Skype создан здесь!); EU Schengen Euro; НДФЛ 20%; EU-паспорт 8 лет (через натурализацию; нужен эстонский язык B1!); kaupmeeste kodu; ряпушка (Baltic Herring; жареная; €2-5); kama (зерновой коктейль; традиционный завтрак).
`,
  },
  {
    slug: 'kak-vyjti-na-rabotu-udalonno-2026',
    title: 'Как найти удаленную работу 2026: топ-10 платформ, что писать в резюме, как пройти интервью',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Найти удаленная работа 2026 топ-10 платформ резюме интервью remote job',
    seo_description: 'Найти удаленная работа 2026 топ-10 платформ резюме интервью remote job поиск',
    content_md: `# Удаленная работа 2026: топ-10 платформ, резюме для remote, как пройти интервью онлайн

Рынок удаленной работы вырос в 3x после пандемии и стабилизировался. Лучшие платформы: We Work Remotely; Himalayas; Remote.co. Резюме для remote = особый формат (акцент на самостоятельность + async-навыки). Интервью: тест на часовой пояс; overlap; setup.

---

## Топ-10 платформ для remote-работы

| Платформа | Ниша | Бесплатно |
|-----------|------|----------|
| **We Work Remotely** | Все; tech-фокус | Да |
| **Himalayas** | Remote-only; фильтры | Да |
| **Remote.co** | Все уровни | Да |
| **Wellfound (AngelList)** | Стартапы | Да |
| **Remotive** | Tech + Marketing | Да |
| **Working Nomads** | Tech + Engineering | Да |
| **Flex Jobs** | Проверенные вакансии | $15/мес (curated) |
| **Toptal** | Screened; премиум | Сложный отбор |
| **Contra** | 0% комиссии; фриланс | Да |
| LinkedIn (Remote filter) | Все | Профиль бесплатно |

---

## Резюме для remote: ключевые отличия

| Пункт | Что написать |
|-------|-------------|
| Summary | «Remote-first professional with 4 years distributed team experience» |
| Tools | Slack; Notion; Jira; Figma; Linear; Loom (упомяни все!) |
| Async | «Documented my work for async review; reduced meeting load by 40%» |
| Timezone | Укажи часовой пояс + overlap (EU UTC+3; 6ч overlap с US EST) |
| Internet | Для некоторых ролей: «Stable 100 Mbps fiber; backup LTE» |

---

## Remote-интервью: как подготовиться

1. **Setup**: хороший микрофон ($50+); свет (кольцевая лампа ИЛИ окно сбоку); нейтральный фон
2. **Часовой пояс**: предупреди заранее; предложи их время пересчитать
3. **Async-примеры**: «В прошлой команде мы работали без синхронных встреч; я документировал...»
4. **Internet check**: накануне запусти Speedtest; упомяни стабильность
5. **Trial work**: многие remote-компании дают тестовое задание — это норма (не бойся!)

---

## Itogo

Удаленная работа 2026: We Work Remotely + Himalayas + Remote.co (топ-3 платформы; проверяй ежедневно!); Wellfound (стартапы); Contra 0% комиссии; LinkedIn фильтр Remote; резюме (async-навыки; инструменты Slack/Notion; часовой пояс; overlap); setup (микрофон!; свет!; фон нейтральный!); async-примеры на интервью (ключевые!; «Documented; reduced meetings; worked across timezones»); Toptal (screened; $30-150/ч; сложный отбор = зато клиенты высокого уровня!); тестовое задание = норма (не страшно!); оплата: Wise; Payoneer; банк в Грузии/Армении.
`,
  },
  {
    slug: 'paragvay-asunson-dn-2026',
    title: 'Парагвай Асунсьон DN 2026: 10% налог flat, ПМЖ без обязательного проживания, $200-450',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Парагвай Асунсьон DN 2026 10% налог flat ПМЖ без проживания аренда переезд',
    seo_description: 'Парагвай Асунсьон DN 2026 10% налог flat ПМЖ без проживания аренда переезд ЛатАм',
    content_md: `# Парагвай DN 2026: 10% налог flat, ПМЖ без обязательного проживания, $200-450, гражданство 3 года

Парагвай — один из самых нишевых аргументов «флаговой теории». Уникальность: ПМЖ без обязательного ежегодного проживания (можно жить где угодно!). Гражданство через 3 года ПМЖ (одно из самых быстрых в ЛатАм!). 10% налог flat. Аренда $200-450.

---

## Ключевое преимущество: ПМЖ без проживания

| Параметр | Значение |
|---------|---------|
| ПМЖ | Не требует обязательного ежегодного проживания |
| Гражданство | 3 года с ПМЖ (значительно быстрее Аргентины/Бразилии!) |
| Налог | 10% flat (территориальный; иностранный доход 0%!) |
| Условие ПМЖ | Банковский счет + регистрация |

---

## Паспорт Парагвая

| Факт | Значение |
|------|---------|
| Визовый доступ | 145+ стран безвизово |
| LATAM + EU | Безвизово |
| США | Визовый |
| Путь | ПМЖ → 3 года → гражданство → паспорт |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Асунсьон (Las Mercedes; Villa Morra) | $300-500 |
| Асунсьон (San Lorenzo; Luque) | $200-400 |
| Энкарнасьон (туристический) | $250-450 |

---

## Реальный процесс ПМЖ

1. Въезд в Парагвай (безвизово; 90 дней для РФ)
2. Нотариально заверенные документы (перевод на испанский + апостиль)
3. Residencia temporal (временная резидентность; 1-2 года)
4. Residencia permanente (постоянная; через 2 года)
5. Через 3 года ПМЖ → гражданство (не нужно жить!)

---

## Itogo

Парагвай DN 2026: ПМЖ без обязательного проживания (живи где угодно; сохраняй статус!); гражданство 3 года (быстрейший в ЛатАм!); 10% налог flat; 0% на иностранный доход (территориальный!); паспорт 145+ стран; $200-450 аренда; Асунсьон (небольшой 2.5M чел; не туристический; аутентичный); Encarnacion (пляжи реки Парана; $250-450); Itaipu Dam (крупнейшая в мире по выработке до 2022!; 2ч от Асунсьон); язык: испанский + гуарани (единственная страна ЛатАм с двумя официальными!); chipagun (сырный хлеб из манной муки; $0.50-1!).
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
console.log(`\nБатч 289: ${ok} OK, ${err} ошибок`);

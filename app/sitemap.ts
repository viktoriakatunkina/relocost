import type { MetadataRoute } from "next";
import { topComparePairs } from "@/lib/compare";
import { countryComparePairSlugs } from "@/lib/compare-countries";
import { getAllListSlugs } from "@/lib/lists";
import { CITY_ROUTES } from "@/lib/city-routes";
import { routing, type Locale } from "@/i18n/routing";
import { BLOG_TAG_FILTER } from "@/lib/blog-visibility";
import { archivePageCount } from "@/lib/blog-archive";
import { translatedLocalesFor } from "@/lib/content-i18n";

// 2026-10-21: было force-dynamic (генерация на каждый живой запрос).
// Диагностика показала, что запросы к Supabase ИЗ ЭТОГО runtime-контекста
// (App Router route handler) стабильно не укладываются по времени — при
// этом те же самые данные успешно вытягиваются и на этапе `next build`
// (все 3384 страницы городов/блога это подтверждают), и в отдельном
// standalone-скрипте на том же сервере. Причина не выяснена до конца
// (похоже на особенность рантайм-fetch Next.js в этой версии при текущей
// скорости Supabase), но воспроизводится стабильно — поднятие таймаутов
// и смена параллельных запросов на последовательные не помогли, сайтмап
// каждый раз тихо терял города/страны/блог/сравнения.
//
// Фикс — не бороться с рантаймом, а генерировать сайтмап там, где Supabase
// заведомо доступен: на этапе сборки (как и сами страницы городов/блога),
// с фоновым обновлением раз в час (ISR). Если фоновая регенерация когда-то
// снова упрётся в те же грабли — Next отдаёт последнюю УДАЧНУЮ версию
// (stale-while-revalidate), а не частичный/пустой сайтмап живым краулерам.
// Цена — сайтмап отражает изменения в БД с задержкой до часа (а при
// деплое — пересобирается заново сразу), не мгновенно на каждый HTTP-запрос.
// Для продакшена это более чем приемлемо: контент всё равно добавляется
// пачками с деплоем следом, не россыпью.
export const revalidate = 3600;

// 2026-08-25: рантайм-доступ VPS к Supabase подтверждённо нестабилен
// (см. коммит фикса generateStaticParams) — без таймаута зависший fetch
// вешал ВЕСЬ /sitemap.xml на 30+ сек до 504 от nginx (у sitemap нет ISR-
// кеша/фолбэка на stale, в отличие от страниц). Таймаут короче, чем nginx
// proxy_read_timeout (дефолт 60с) — отдаём частичный сайтмап вместо 504.
//
// 2026-10-21: после паузы/resume проекта в Supabase (см. memory) sitemap
// стабильно терял города/страны/блог/сравнения на каждый запрос. Причина
// оказалась не в длительности таймаута, а в том, что все запросы стартовали
// ОДНОВРЕМЕННО (Promise.all) — Nano-тариф не вытягивает всплеск из
// нескольких параллельных подключений разом, и все четыре блока валились
// с "This operation was aborted" в одну и ту же секунду. Фикс — запросы
// теперь идут СТРОГО ПОСЛЕДОВАТЕЛЬНО (см. sitemap() ниже), по одному
// Supabase-соединению за раз. Из-за этого таймауты каждого блока суммируются
// в общий потолок запроса — держим сумму заметно ниже 60-секундного
// proxy_read_timeout nginx (дефолт, не менялся): 10 (города) + 20 (блог) +
// 10 (новости) + 10 (сравнения) = 50с худший случай.
const FETCH_TIMEOUT_MS = 10_000;

// Общий бюджет на постраничную выборку статей (см. fetchBlogPosts — страниц
// несколько, без общего дедлайна несколько подряд подвисших запросов сами
// по себе съели бы весь бюджет). Входит в сумму последовательных таймаутов
// выше — не поднимать без пересчёта общего потолка.
const BLOG_FETCH_BUDGET_MS = 20_000;

async function fetchWithTimeout(
  input: string,
  headers: Record<string, string>,
  timeoutMs = FETCH_TIMEOUT_MS,
) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { headers, cache: "no-store", signal: ctrl.signal });
  } finally {
    clearTimeout(tid);
  }
}

// PostgREST режет ЛЮБОЙ ответ по серверному db-max-rows=1000 — параметр
// limit=3000 в запросе он молча игнорирует. Из-за этого в сайтмап попадала
// только первая тысяча статей из ~2650 подходящих (аудит 2026-09-07: 65%
// статей блога вообще не были представлены в сайтмапе). Единственный рабочий
// способ забрать всё — идти страницами по offset, как в scripts/*.mjs.
const BLOG_PAGE_SIZE = 1000;
const BLOG_MAX_PAGES = 8; // страховка от бесконечного цикла: потолок 8000 статей

async function fetchBlogPosts(): Promise<{ slug: string; created_at: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const deadline = Date.now() + BLOG_FETCH_BUDGET_MS;
  const out: { slug: string; created_at: string }[] = [];
  try {
    for (let page = 0; page < BLOG_MAX_PAGES; page++) {
      const left = deadline - Date.now();
      if (left <= 0) break;
      // Сортировка обязательно детерминированная (created_at может совпадать
      // у пачки статей одного сева) — иначе постраничная выборка теряет и
      // дублирует строки между страницами.
      const res = await fetchWithTimeout(
        `${url}/rest/v1/blog_posts?select=slug,created_at&published=eq.true` +
          `&${BLOG_TAG_FILTER}&order=created_at.desc,slug.asc` +
          `&offset=${page * BLOG_PAGE_SIZE}&limit=${BLOG_PAGE_SIZE}`,
        headers,
        Math.min(FETCH_TIMEOUT_MS, left),
      );
      if (!res.ok) {
        // 2026-10-21: раньше молча break — не было видно, РАЗВАЛИЛСЯ ли
        // запрос (таймаут/сеть) или Supabase вернул ошибку (4xx/5xx) с
        // телом, объясняющим причину. Временная диагностика после находки
        // "сайтмап стабильно теряет контент" — см. memory.
        const body = await res.text().catch(() => "");
        console.error("[sitemap] fetchBlogPosts: не-ok ответ", { page, status: res.status, body: body.slice(0, 300) });
        break;
      }
      const rows: { slug: string; created_at: string }[] = await res.json();
      out.push(...rows);
      if (rows.length < BLOG_PAGE_SIZE) break;
    }
  } catch (e) {
    console.error("[sitemap] fetchBlogPosts упал", e instanceof Error ? e.message : e);
    // Возвращаем то, что успели набрать до сбоя.
  }
  return out;
}

// Новости — небольшая таблица (десятки-сотни записей), в отличие от блога не
// нужна постраничная выборка через .range(): одного запроса с лимитом с
// запасом достаточно.
async function fetchNewsItems(): Promise<{ slug: string; created_at: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetchWithTimeout(
      `${url}/rest/v1/news_items?select=slug,created_at&published=eq.true&order=created_at.desc&limit=1000`,
      { apikey: key, Authorization: `Bearer ${key}` },
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[sitemap] fetchNewsItems: не-ok ответ", { status: res.status, body: body.slice(0, 300) });
      return [];
    }
    return res.json();
  } catch (e) {
    console.error("[sitemap] fetchNewsItems упал", e instanceof Error ? e.message : e);
    return [];
  }
}

async function fetchCities(): Promise<{ slug: string; country_slug: string; updated_at: string | null }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetchWithTimeout(
      `${url}/rest/v1/cities?select=slug,country_slug,updated_at&limit=1000`,
      { apikey: key, Authorization: `Bearer ${key}` }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[sitemap] fetchCities: не-ok ответ", { status: res.status, body: body.slice(0, 300) });
      return [];
    }
    return res.json();
  } catch (e) {
    console.error("[sitemap] fetchCities упал", e instanceof Error ? e.message : e);
    return [];
  }
}

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

// URL пути для локали с учётом as-needed: ru без префикса, en/uz с префиксом.
function urlFor(path: string, locale: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return `${BASE}${clean || "/"}`;
  return `${BASE}/${locale}${clean}`;
}

// hreflang-альтернаты для пути. По умолчанию — все локали, но если у записи
// указан список реально переведённых локалей, в hreflang попадают только они
// (+ ru как источник и x-default). Иначе сайтмап заявлял бы поисковику
// языковые версии, которых нет: см. lib/i18n-seo.ts — то же правило
// применяется в мета-тегах страниц, и расходиться они не должны.
function languagesFor(
  path: string,
  translated?: readonly string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of routing.locales) {
    if (l === routing.defaultLocale || !translated || translated.includes(l)) {
      out[l] = urlFor(path, l);
    }
  }
  out["x-default"] = urlFor(path, routing.defaultLocale);
  return out;
}

// Один логический URL = одна запись sitemap на каждую локаль, с общими
// hreflang-альтернатами (так Google понимает языковые версии одной страницы).
type Entry = {
  path: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  // Локали, на которые страница реально переведена (ru подразумевается).
  // Не задано — считаем переведёнными все (служебные страницы вроде /quiz,
  // /search: там весь текст интерфейсный и он переведён по-настоящему).
  translatedLocales?: readonly Locale[];
};

function expand(entries: Entry[]): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const languages = languagesFor(e.path, e.translatedLocales);
    // URL в сайтмап кладём только для тех локалей, что попали в hreflang:
    // непереведённая /uz-версия — не отдельная страница, а дубль русской
    // (её canonical и так указывает на ru), в индексе ей делать нечего.
    for (const locale of routing.locales) {
      if (!(locale in languages)) continue;
      out.push({
        url: urlFor(e.path, locale),
        lastModified: e.lastModified,
        changeFrequency: e.changeFrequency,
        priority: e.priority,
        alternates: { languages },
      });
    }
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 2026-10-21: было Promise.all([fetchCities(), fetchBlogPosts(),
  // fetchNewsItems()]) + comparePairs параллельно — все запросы стартовали
  // одновременно. Диагностика (console.error в catch, см. соседний коммит)
  // показала: все три валятся с одним и тем же "This operation was aborted"
  // ОДНОВРЕМЕННО, в одну и ту же секунду — не похоже на независимые таймауты
  // по 20с каждый, похоже на то, что Nano-инстанс Supabase не вытягивает
  // ВСПЛЕСК из нескольких параллельных подключений разом (сайтмап одним
  // залпом открывал: города + до 8 страниц блога + новости + сравнения).
  // Поднятие таймаута это не лечит — упирается не время, а число одновременных
  // соединений. Фикс — бить Supabase СТРОГО ПО ОДНОМУ запросу за раз. Это
  // медленнее при хорошей связи, но при хорошей связи и так всё укладывалось
  // в секунды; при плохой — последовательные запросы хотя бы не толкаются
  // друг с другом за один и тот же пул соединений.
  const cityRows = await fetchCities();
  const posts = await fetchBlogPosts();
  const newsItems = await fetchNewsItems();
  const comparePairs = await Promise.race([
    topComparePairs(),
    new Promise<string[]>((resolve) => setTimeout(() => resolve([]), FETCH_TIMEOUT_MS)),
  ]);

  const now = new Date();
  const countries = Array.from(
    new Set(cityRows.map((c) => c.country_slug).filter(Boolean)),
  );

  // Какие города/страны реально переведены на en/uz. Читает те же JSON из
  // content/i18n, что и страницы, с общим кешем в пределах процесса — то есть
  // диск дёргается один раз за жизнь процесса, а не на каждый /sitemap.xml
  // (маршрут force-dynamic).
  const cityLocales = new Map<string, Locale[]>();
  const countryLocales = new Map<string, Locale[]>();
  await Promise.all([
    ...cityRows.map(async (c) => {
      cityLocales.set(c.slug, await translatedLocalesFor("cities", c.slug));
    }),
    ...countries.map(async (slug) => {
      countryLocales.set(slug, await translatedLocalesFor("countries", slug));
    }),
  ]);
  const cityL = (slug: string) => cityLocales.get(slug) ?? [routing.defaultLocale];
  const countryL = (slug: string) =>
    countryLocales.get(slug) ?? [routing.defaultLocale];
  // В sitemap кладём только канонические пары топ-городов (те же, что
  // прегенерятся статикой). Полный декартов набор раздувал бы sitemap.
  // comparePairs уже посчитан выше (последовательно, после городов/блога/
  // новостей — см. комментарий в начале функции).

  const entries: Entry[] = [
    { path: "/", lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { path: "/countries", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/about", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/search", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { path: "/quiz", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/rating", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { path: "/checklist", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { path: "/embed", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...getAllListSlugs().map((slug) => ({
      path: `/list/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      translatedLocales: cityL(c.slug),
    })),
    // Подстраницы городов — самостоятельные SEO-URL с уникальными title/description.
    // Индексируются отдельно: «бюджет семьи в X» и «цены в X» — высокочастотные
    // информационные запросы, которые ведут на калькулятор и таблицу цен.
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}/budget`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      translatedLocales: cityL(c.slug),
    })),
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}/prices`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      translatedLocales: cityL(c.slug),
    })),
    ...countries.map((slug) => ({
      path: `/country/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      translatedLocales: countryL(slug),
    })),
    ...comparePairs.map((pair) => ({
      path: `/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Сравнения СТРАН (/compare/georgia-vs-armenia). Список статический —
    // пары отобраны по Яндекс.Suggest, запроса в Supabase не требуют, поэтому
    // попадают в sitemap даже если блок с городами отвалился по таймауту.
    // Приоритет выше городских пар: страновых сравнений на сайте не было, а
    // спрос на «X или Y» на уровне стран подтверждён подсказками.
    ...countryComparePairSlugs().map((pair) => ({
      path: `/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // ── Блог: только ru, без en/uz и без hreflang ────────────────────────────
  // Блог не переведён ни на одну локаль (0 статей из ~4258), поэтому НЕ идёт
  // через expand(): раньше он размножался на три локали и сайтмап заявлял
  // поисковику примерно вдвое больше URL, чем есть страниц, — все /en/blog/*
  // и /uz/blog/* были тем же русским текстом. С 09.09.2026 middleware отдаёт
  // по этим адресам русскую версию rewrite'ом, а canonical у них указывает на
  // бесперфиксный /blog/... — в сайтмапе им делать нечего.
  const blogEntries: Entry[] = [
    { path: "/blog", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    // Страницы архива блога — транзитные списки, через них краулер доходит
    // до статей, на которые с /blog нет серверных ссылок (список листается
    // на клиенте). Приоритет низкий: ценность в ссылках, не в самих списках.
    ...Array.from({ length: archivePageCount(posts.length) }, (_, i) => i + 1).map((n) => ({
      path: `/blog/page/${n}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  const blogSitemap: MetadataRoute.Sitemap = blogEntries.map((e) => ({
    url: urlFor(e.path, routing.defaultLocale),
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  // «Маршруты на день» — контент только на ru (dynamicParams=false, en/uz
  // не сгенерированы), поэтому НЕ идёт через expand() (размножил бы на все
  // локали и дал битые /en//uz-ссылки на 404). Одна ru-запись на город.
  const tripEntries: MetadataRoute.Sitemap = Object.keys(CITY_ROUTES).map((slug) => ({
    url: urlFor(`/city/${slug}/trip`, routing.defaultLocale),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Новости: только ru, тот же принцип, что у блога (не переведены). ────
  const newsEntries: Entry[] = [
    { path: "/news", lastModified: now, changeFrequency: "daily", priority: 0.7 },
    ...newsItems.map((n) => ({
      path: `/news/${n.slug}`,
      lastModified: n.created_at ? new Date(n.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  const newsSitemap: MetadataRoute.Sitemap = newsEntries.map((e) => ({
    url: urlFor(e.path, routing.defaultLocale),
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  // /favorites в sitemap не включаем (noindex). /search индексируется — он выше.
  return [...expand(entries), ...blogSitemap, ...newsSitemap, ...tripEntries];
}

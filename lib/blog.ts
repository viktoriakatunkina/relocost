import { supabase } from "./supabase";
import { HIDDEN_BLOG_TAG } from "./blog-visibility";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  city_id: string | null;
  country_slug: string | null;
  tag: string | null;
  read_time: number | null;
  content_md: string;
  seo_title: string | null;
  seo_description: string | null;
  cover_unsplash_id: string | null;
  cover_url: string | null;
  // Локальный URL обложки в Supabase Storage. Фолбэк — cover_url.
  // optional: до применения миграции 202606111200 колонки в выборке нет.
  cover_image_url?: string | null;
  cover_author_name: string | null;
  cover_author_url: string | null;
  published: boolean;
  created_at: string;
};

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  const q = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    // Статьи с тегом "города" — городские справки для CityArticles, не для журнала.
    .neq("tag", HIDDEN_BLOG_TAG)
    .order("created_at", { ascending: false })
    // Явный лимит-потолок: без него Supabase молча обрезает до 1000 строк.
    // Передача limit=undefined сохраняет поведение «взять все» (до 2000).
    .limit(limit ?? 2000);
  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as BlogPost[];
}

// Для /blog (листинг). В отличие от getPublishedPosts() — НЕ проглатывает
// ошибку Supabase молча в []. 2026-08-25: на проде /blog при сбое БД
// показывал «В этой категории пока нет статей» вместо тысяч реальных
// статей — на нестабильном Supabase-коннекте это вводит в заблуждение
// (выглядит как будто контента вообще нет). Бросаем ошибку — ISR-страница
// (revalidate=3600) при неудачной фоновой ревалидации оставит СТАРУЮ
// хорошую версию в кеше вместо перезаписи её пустым результатом (штатное
// поведение Next.js: исключение при revalidate не публикуется, стейл-кеш
// продолжает отдаваться). НЕ используем в generateStaticParams/на
// homepage — там частичный сбой (просто нет тизера блога) лучше, чем
// уронить всю страницу целиком через Promise.all.
export async function getPublishedPostsOrThrow(limit?: number): Promise<BlogPost[]> {
  const q = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .neq("tag", HIDDEN_BLOG_TAG)
    .order("created_at", { ascending: false })
    .limit(limit ?? 2000);
  const { data, error } = await q;
  if (error) throw new Error(`getPublishedPostsOrThrow: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

// ── Лёгкая карточка статьи для листингов ──────────────────────────────────
// 2026-09-07: /blog весила 8 МБ, потому что в клиентский <BlogFilters posts>
// уезжали ПОЛНЫЕ строки blog_posts — вместе с content_md (тело статьи!) всех
// статей разом. Ни BlogFilters, ни BlogCard тело не используют: проверено —
// нужны только id/slug/title/tag/read_time/обложка. Для листингов берём
// узкий набор колонок, тело остаётся на сервере.
export type BlogPostCard = Pick<
  BlogPost,
  "id" | "slug" | "title" | "tag" | "read_time" | "cover_url" | "created_at"
> & { cover_image_url?: string | null };

// ВНИМАНИЕ: cover_image_url в списке НЕТ. Колонка описана в BlogPost как
// опциональная, но миграция 202606111200 на проде так и не применена — в
// blog_posts её физически нет. select("*") это прощал, явный список колонок
// — нет: PostgREST отвечает «column blog_posts.cover_image_url does not
// exist» и страница падает в 500. Добавлять сюда только после миграции.
const CARD_COLUMNS = "id,slug,title,tag,read_time,cover_url,created_at";
const PAGE_SIZE = 1000;

// PostgREST режет любой ответ по db-max-rows=1000 и молча игнорирует .limit()
// сверх этого — поэтому «все статьи» приходится собирать через .range().
// Без этого /blog показывал 1000 статей из ~2650 подходящих.
export async function getPublishedPostCardsOrThrow(): Promise<BlogPostCard[]> {
  const out: BlogPostCard[] = [];
  for (let page = 0; page < 8; page++) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(CARD_COLUMNS)
      .eq("published", true)
      .neq("tag", HIDDEN_BLOG_TAG)
      // Детерминированный порядок: created_at у статей одного сева совпадает,
      // без вторичного ключа страницы теряли и дублировали строки.
      .order("created_at", { ascending: false })
      .order("slug", { ascending: true })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    // Ошибку не проглатываем — см. комментарий к getPublishedPostsOrThrow:
    // на ISR-ревалидации это сохраняет старую хорошую версию страницы.
    if (error) throw new Error(`getPublishedPostCardsOrThrow: ${error.message}`);
    const rows = (data ?? []) as unknown as BlogPostCard[];
    out.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }
  return out;
}

// 2026-10-26: на сборке 16 воркеров бьют в БД разом — там 3 попытки нужны.
// В рантайме (next start) повторы только добивают перегруженную БД: вместе с
// ретраями fetchWithRetry выходило до 15 HTTP-запросов на одну статью, и с
// 20.10 это раскрутило шторм statement timeout (300–480 в день). В рантайме —
// одна попытка; ISR при ошибке оставит старую версию страницы.
const IS_BUILD =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.LOWMEM_BUILD === "1";

// generateMetadata и сама страница статьи запрашивают один и тот же slug
// подряд — склеиваем их в один запрос. Живет секунды: только на время рендера.
const POST_MEMO_MS = 10_000;
const postMemo = new Map<string, { at: number; p: Promise<BlogPost | null> }>();

export function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const now = Date.now();
  const hit = postMemo.get(slug);
  if (hit && now - hit.at < POST_MEMO_MS) return hit.p;
  if (postMemo.size > 500) postMemo.clear();
  const p = fetchPostBySlug(slug);
  postMemo.set(slug, { at: now, p });
  p.catch(() => postMemo.delete(slug));
  return p;
}

async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const attempts = IS_BUILD ? 3 : 1;
  let lastError: unknown = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const query = supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      // Таймаут 20 сек на попытку: при зависшем Supabase-соединении без таймаута
      // процесс ждёт вечно и Next.js убивает воркер по staticPageGenerationTimeout.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("getPostBySlug timeout")), 20000),
      );
      const { data, error } = await Promise.race([query, timeout]);
      if (!error) return (data as BlogPost | null) ?? null;
      lastError = error;
    } catch (e) {
      lastError = e;
      if (attempt < attempts - 1) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  // ВАЖНО (2026-09-21): раньше здесь стоял `return null` — вызывающий код
  // (app/[locale]/blog/[slug]/page.tsx) трактует null как «статьи не
  // существует» и вызывает notFound(). Но null после 3 неудачных попыток
  // мог означать и «не достучались до Supabase» (сервер под нагрузкой/своп) —
  // и ISR на self-hosted VPS кешировал этот notFound() как постоянный 404
  // даже для статей с валидным контентом (обнаружено: 643 из ~2987 статей
  // блога, 21%, отдавали живой 404 при полностью корректном content_md).
  // Теперь при исчерпании попыток бросаем ошибку вместо null — genuine
  // «не найдено» (query отработал, данных нет) по-прежнему возвращает null
  // и корректно ведёт на notFound(), а «не смогли получить данные» больше
  // не маскируется под «не существует».
  throw new Error(
    `getPostBySlug: не удалось получить "${slug}" после ${attempts} попыток — ${String(lastError)}`,
  );
}

// ── Узкие выборки для блоков «Похожие материалы» / «Читайте также» ─────────
// 2026-10-26: раньше страница статьи ради 3 похожих карточек тянула
// getPublishedPosts() — до 1000 ПОЛНЫХ строк blog_posts вместе с content_md
// (10–20 МБ на один рендер, больше лимита Data Cache — в кеш не попадало
// никогда). Под ботами после фикса sitemap (21.10, +~2650 статей в выдаче) и
// серии деплоев это стало главной нагрузкой на Supabase. Теперь — карточные
// колонки и маленькие лимиты; city/country-блоки — то же самое.
const RELATED_COLUMNS = `${CARD_COLUMNS},city_id,country_slug`;

export type BlogPostRelated = BlogPostCard &
  Pick<BlogPost, "city_id" | "country_slug">;

const RELATED_POOL = 12;

function relatedQuery() {
  return supabase
    .from("blog_posts")
    .select(RELATED_COLUMNS)
    .eq("published", true)
    .neq("tag", HIDDEN_BLOG_TAG);
}

async function rows(
  q: PromiseLike<{ data: unknown; error: unknown }>,
): Promise<BlogPostRelated[]> {
  const { data, error } = await q;
  return error ? [] : ((data ?? []) as BlogPostRelated[]);
}

/**
 * Похожие статьи: по совпадению тега (+3), страны (+2) и города (+2) — тот же
 * скоринг, что раньше считался по 1000 статьям, но кандидаты берутся тремя
 * маленькими индексированными запросами (свежие 12 по каждому признаку).
 * Если совпадений нет — просто свежие статьи.
 */
export async function getRelatedPostCards(
  current: Pick<BlogPost, "id" | "tag" | "city_id" | "country_slug">,
  limit = 3,
): Promise<BlogPostRelated[]> {
  const byFresh = (q: ReturnType<typeof relatedQuery>) =>
    rows(q.neq("id", current.id).order("created_at", { ascending: false }).limit(RELATED_POOL));

  const pools = await Promise.all([
    current.tag ? byFresh(relatedQuery().eq("tag", current.tag)) : [],
    current.country_slug
      ? byFresh(relatedQuery().eq("country_slug", current.country_slug))
      : [],
    current.city_id ? byFresh(relatedQuery().eq("city_id", current.city_id)) : [],
  ]);

  const seen = new Map<string, BlogPostRelated>();
  for (const pool of pools) for (const p of pool) seen.set(p.id, p);
  let candidates = Array.from(seen.values());
  if (candidates.length < limit) {
    const fresh = await byFresh(relatedQuery());
    for (const p of fresh) if (!seen.has(p.id)) candidates.push(p);
  }

  const score = (p: BlogPostRelated) =>
    (current.tag && p.tag === current.tag ? 3 : 0) +
    (current.country_slug && p.country_slug === current.country_slug ? 2 : 0) +
    (current.city_id && p.city_id === current.city_id ? 2 : 0);

  candidates = candidates.sort((a, b) => {
    const d = score(b) - score(a);
    if (d !== 0) return d;
    return a.created_at < b.created_at ? 1 : -1;
  });
  return candidates.slice(0, limit);
}

export async function getAllPostSlugs(limit = 2000): Promise<string[]> {
  // Явный лимит: Supabase молча обрезает до 1000 без него. При >1000 статей
  // generateStaticParams не получит все slug и часть страниц выпадет из SSG.
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((p) => p.slug as string);
}

// Статьи блога для страницы города: сначала привязанные к самому городу
// (city_id), затем к его стране (country_slug). Используется для блока
// «Читайте также» на /city/* (внутренняя перелинковка город → блог).
export async function getPostsForCity(
  cityId: string,
  countrySlug: string | null,
  limit = 3,
): Promise<BlogPostRelated[]> {
  // Привязанные к городу — выше страновых. Два узких запроса с лимитом вместо
  // одного select("*") без лимита (сотни полных статей на страну, см. выше).
  const [own, country] = await Promise.all([
    rows(
      relatedQuery()
        .eq("city_id", cityId)
        .order("created_at", { ascending: false })
        .limit(limit),
    ),
    countrySlug
      ? rows(
          relatedQuery()
            .eq("country_slug", countrySlug)
            .order("created_at", { ascending: false })
            .limit(limit * 2),
        )
      : Promise.resolve([] as BlogPostRelated[]),
  ]);
  const out = [...own];
  for (const p of country) if (!out.some((o) => o.id === p.id)) out.push(p);
  return out.slice(0, limit);
}

// Статьи блога для страницы СТРАНЫ: привязанные к стране (country_slug) или к
// любому её городу (city_id). Внутренняя перелинковка страна → блог — раздаёт
// вес 202 статьям и усиливает страновой кластер.
export async function getPostsForCountry(
  countrySlug: string,
  cityIds: string[],
  limit = 6,
): Promise<BlogPostRelated[]> {
  const ors = [`country_slug.eq.${countrySlug}`];
  if (cityIds.length) ors.push(`city_id.in.(${cityIds.join(",")})`);
  return rows(
    relatedQuery()
      .or(ors.join(","))
      .order("created_at", { ascending: false })
      .limit(limit),
  );
}

export async function getCityForPost(cityId: string | null) {
  if (!cityId) return null;
  const { data } = await supabase
    .from("cities")
    .select("*")
    .eq("id", cityId)
    .maybeSingle();
  return data ?? null;
}

// Топ-4 города страны для блока «Города этой страны» в блог-статьях без city_id.
export async function getCitiesByCountry(countrySlug: string, limit = 4) {
  const { data } = await supabase
    .from("cities")
    .select("id, slug, name_ru, flag_emoji, is_foreign")
    .eq("country_slug", countrySlug)
    .order("name_ru")
    .limit(limit);
  return (data ?? []) as Array<{
    id: string;
    slug: string;
    name_ru: string;
    flag_emoji: string | null;
    is_foreign: boolean;
  }>;
}

const COVER_GRADIENTS = [
  "from-rose-900 via-pine-tree to-pine-tree",
  "from-amber-900 via-pine-tree to-pine-tree",
  "from-emerald-900 via-pine-tree to-pine-tree",
  "from-sky-900 via-pine-tree to-pine-tree",
  "from-violet-900 via-pine-tree to-pine-tree",
  "from-orange-900 via-pine-tree to-pine-tree",
];

export function coverGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

// Keyword → Unsplash photo ID map (same logic as fix-covers.mjs).
// Ensures every BlogCard always shows an image even when cover_url is null in DB.
const COVER_KEYWORD_PHOTOS: [string, string][] = [
  ["gruziya|tbilisi|batumi|kutaisi", "photo-1565008447742-97f6f38c985c"],
  ["armeniya|yerevan|gyumri", "photo-1581783898377-1c85bf937427"],
  ["turciya|istanbul|antalya|ankara|alanya", "photo-1541432901042-2d8bd64b4a9b"],
  ["serbiya|belgrad|beograd", "photo-1617130394051-85b12f7f9d40"],
  ["kipr|limassol|nikosia", "photo-1531572753322-ad063cecc140"],
  ["chernogoria|budva|podgorica|tivat", "photo-1504701954957-2010ec3bcec1"],
  ["gretsiya|afiny|thessaloniki|afinakh", "photo-1555993539-1732b0258235"],
  ["ispaniya|barselona|madrid|barcelona", "photo-1539037116277-4db20889f2d4"],
  ["italiya|rim|milan|italii", "photo-1523906834658-6e24ef2386f9"],
  ["polsha|varshava|warsaw|krakow", "photo-1607427293702-036933bbf746"],
  ["chekhiya|praga|prague", "photo-1546394028-05a1d4af71b3"],
  ["vengriya|budapesht|budapest", "photo-1508517476519-2b8f3f3c4a53"],
  ["germaniya|berlin|myunkhen|munich", "photo-1546268060-2592ff93ee24"],
  ["niderlandy|amsterdam|gaaga|eindhoven|gollandiya", "photo-1468495244123-6c6c332eeece"],
  ["avstriya|vena|wien", "photo-1516550893923-42d28e5677af"],
  ["shvetsiya|stokgolm|stockholm", "photo-1509356843151-3e7d96241e11"],
  ["finlyandiya|helsinki", "photo-1551582045-6ec9c11d8697"],
  ["daniya|kopengagen|copenhagen", "photo-1513622470522-26c3c8a854bc"],
  ["belgiya|bryussel|brussels", "photo-1559113513-d5b7cc9b78c3"],
  ["irlandiya|dublin", "photo-1569504615-6d0c19f2c7e2"],
  ["latviya|estoniya|litva|riga|tallin", "photo-1545239351-1141bd82e8a6"],
  ["sloveniya|lyublyana|ljubljana", "photo-1558618666-fcd25c85cd64"],
  ["khorvatiya|zagreb|split|dubrovnik", "photo-1527631746610-bca00a040d60"],
  ["rumyniya|bukharest|kluzh|bucharest", "photo-1584649525069-4dd9d2bc32b6"],
  ["bolgariya|sofiya|sofia", "photo-1631867675167-90a456a90863"],
  ["meksika|meksiko|guadalahara", "photo-1518638150340-f706e86654de"],
  ["bali|indoneziya|indonezia", "photo-1537996194471-e657df975ab4"],
  ["tailand|bangkok|chiangmay|chiang", "photo-1528181304800-259b08848526"],
  ["vyetnam|khanoy|khochiminh", "photo-1528360983277-13d401cdc186"],
  ["malaysia|kualumpur|kuala", "photo-1596422846543-75c6fc197f07"],
  ["singapur|singapore", "photo-1525625293386-3f8f99389edd"],
  ["yaponiya|tokio|osaka|tokyo", "photo-1542051841857-5f90071e7989"],
  ["kitay|shankhay|pekin|shanghai", "photo-1474181487882-5abf3f0ba6c2"],
  ["indiya|mumbai|delhi|goa", "photo-1524492412937-b28074a5d7da"],
  ["kanada|toronto|vankuver|montreal|vancouver", "photo-1503614472-8c93d56e92ce"],
  ["avstralia|sidney|melbourne|sydney", "photo-1530956424745-ff0a5b89e0a5"],
  ["ssha|nyu_york|new_york|los_andzheles", "photo-1534430480872-3498386e7856"],
  ["braziliya|rio|sao_paulo|buenos", "photo-1483729558449-99ef09a8c325"],
  ["israel|tel_aviv|jerusalem|izrail", "photo-1544400873-32a93ebf7c69"],
  ["oae|dubay|abu_dhabi|dubai", "photo-1512453979798-5ea266f8880c"],
  ["keniya|nairobi|africa|afrika", "photo-1489493887464-892be6d1daae"],
  ["bank|schet|dengi|finansy|perevod|budzhet|byudzhet|nakopleniya", "photo-1611974789855-9c2a0a7236a3"],
  ["nalogi|ip|ooo|biznes|predprinimatel", "photo-1554224155-6726b3ff858f"],
  ["rabota|udalennaya|freelance|vakansii|karera", "photo-1486312338219-ce68d2c6f44d"],
  ["it|programmirovanie|backend|developer|razrabotchik", "photo-1498050108023-c5249f4df085"],
  ["strakhovka|meditsina|zdorovye", "photo-1576091160550-2173dba999ef"],
  ["viza|vnzh|grazhdanstvo|dokumenty|pasport|permit", "photo-1451187580459-43490279c0fa"],
  ["arenda|kvartira|zhilye|pokupka|nedvizhimost|ipoteka", "photo-1560448204-e02f11c3d0e2"],
  ["psikhologiya|emigratsiya|strakhi|adaptatsia", "photo-1499209974431-9dddcece7f88"],
  ["yazyk|obuchenie|kurs|ucheba|vyuchit", "photo-1456513080510-7bf3a84b82f8"],
  ["nomad|tsifrovoy|coworking|kafe", "photo-1497366216548-37526070297c"],
  ["bezopasnost|crime|kriminal", "photo-1530026405186-ed1f139313f8"],
  ["klimat|pogoda|more|beach|sea|plaзh", "photo-1507525428034-b723cf961d3e"],
  ["eda|restoran|kukhnya|gastro", "photo-1414235077428-338989a2e8c0"],
  ["sport|fitnes|yoga|training", "photo-1517836357463-d25dfeac3438"],
  ["rebenok|deti|shkola|dvuyazychnyy", "photo-1503454537195-1dcabb73ffb9"],
  ["koshka|sobaka|zhivotnye|pitomets", "photo-1548199973-03cce0bbc87b"],
];

const COVER_FALLBACKS = [
  "photo-1488085061387-422e29b40080",
  "photo-1488646953014-85cb44e25828",
  "photo-1476514525535-07fb3b4ae5f1",
  "photo-1530789253388-582c481c54b0",
];

// Краткий отображаемый заголовок: берём часть до первого «;» (в SEO-заголовках
// вида «Страна Город DN 2026: £ХХХ; «ХУК»: …» после первой точки с запятой идут
// исторические врезки, которые выглядят ужасно в качестве h1/headline/og:title).
// Общая функция для h1, OG/Twitter meta, JSON-LD и og-image — не дублировать логику.
export function displayBlogTitle(title: string): string {
  return title.includes(";") ? title.split(";")[0].trim() : title;
}

// 2026-09-22 (SEO-аудит): часть seo_title в БД задвоена — " | Relocost | Relocost"
// (разные сид-скрипты независимо дописывали суффикс поверх уже присутствующего,
// см. scripts/fix-seo-titles.mjs). Данные в Supabase не трогаем — схлопываем
// повторяющийся суффикс только при отображении (<title>, OG, Twitter, JSON-LD
// headline). Если суффикса нет вообще — строка не меняется.
export function cleanSeoTitle(title: string | null | undefined): string | null {
  if (!title) return title ?? null;
  return title.replace(/(?:\s*\|\s*Relocost\s*)+$/i, " | Relocost").trim();
}

export function defaultCoverUrl(slug: string): string {
  const s = slug.toLowerCase().replace(/-/g, "_");
  for (const [keywords, photoId] of COVER_KEYWORD_PHOTOS) {
    if (keywords.split("|").some((k) => s.includes(k))) {
      return `https://images.unsplash.com/${photoId}?w=800&q=80`;
    }
  }
  const idx = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % COVER_FALLBACKS.length;
  return `https://images.unsplash.com/${COVER_FALLBACKS[idx]}?w=800&q=80`;
}

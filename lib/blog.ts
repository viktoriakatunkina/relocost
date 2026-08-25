import { supabase } from "./supabase";

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
    .neq("tag", "города")
    .order("created_at", { ascending: false })
    // Явный лимит-потолок: без него Supabase молча обрезает до 1000 строк.
    // Передача limit=undefined сохраняет поведение «взять все» (до 2000).
    .limit(limit ?? 2000);
  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
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
    } catch {
      if (attempt < 2) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  return null;
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
): Promise<BlogPost[]> {
  const ors = [`city_id.eq.${cityId}`];
  if (countrySlug) ors.push(`country_slug.eq.${countrySlug}`);
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .or(ors.join(","))
    .order("created_at", { ascending: false });
  const posts = (data ?? []) as BlogPost[];
  // Привязанные к городу — выше страновых.
  posts.sort(
    (a, b) => Number(b.city_id === cityId) - Number(a.city_id === cityId),
  );
  return posts.slice(0, limit);
}

// Статьи блога для страницы СТРАНЫ: привязанные к стране (country_slug) или к
// любому её городу (city_id). Внутренняя перелинковка страна → блог — раздаёт
// вес 202 статьям и усиливает страновой кластер.
export async function getPostsForCountry(
  countrySlug: string,
  cityIds: string[],
  limit = 6,
): Promise<BlogPost[]> {
  const ors = [`country_slug.eq.${countrySlug}`];
  if (cityIds.length) ors.push(`city_id.in.(${cityIds.join(",")})`);
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .or(ors.join(","))
    .order("created_at", { ascending: false });
  return ((data ?? []) as BlogPost[]).slice(0, limit);
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

// Единые числа сайта (города / страны / статьи блога) — чтобы счётчики не
// расходились по разным страницам (была проблема: «90+», «25 стран», «46 стран»
// в разных местах) И чтобы их НЕ нужно было править руками при добавлении
// контента.
//
// Раньше тут лежали захардкоженные константы (CITY_COUNT = 99 и т.п.) — при
// добавлении города цифру забывали обновить, и в SEO-мета/OG висело старое
// число. Теперь всё считается ЖИВЬЁМ из Supabase при сборке страницы и
// кешируется на время рендера (React cache). Добавили город/страну/статью →
// при следующем деплое все числа обновятся сами, править ничего не надо.
import { supabase } from "./supabase";
import { getAllCountriesAggregated } from "./countries";

export type SiteStats = {
  cityCount: number;
  countryCount: number;
  foreignCountryCount: number;
  blogCount: number;
};

async function computeSiteStats(): Promise<SiteStats> {
  const [countries, blog] = await Promise.all([
    getAllCountriesAggregated(),
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
  ]);

  const cityCount = countries.reduce((acc, c) => acc + c.city_count, 0);
  const countryCount = countries.length;
  const foreignCountryCount = countries.filter((c) => c.is_foreign).length;
  const blogCount = blog.count ?? 0;

  return { cityCount, countryCount, foreignCountryCount, blogCount };
}

// Мемоизация на уровне модуля: при SSG-сборке этот геттер дёргается на КАЖДОЙ
// из ~1549 страниц (layout, OG, поиск, страны). Без мемо это 1549 запросов в
// Supabase за билд → free tier отдаёт statement timeout и сборка падает. Кэш
// промиса делает один запрос на процесс-воркер. При ошибке сбрасываем, чтобы
// разовый таймаут не «отравил» весь билд. Числа меняются только при деплое
// (он перезапускает процесс) — staleness в рамках одного процесса безвреден.
let statsPromise: Promise<SiteStats> | null = null;

export function getSiteStats(): Promise<SiteStats> {
  if (!statsPromise) {
    statsPromise = computeSiteStats().catch((err) => {
      statsPromise = null;
      throw err;
    });
  }
  return statsPromise;
}

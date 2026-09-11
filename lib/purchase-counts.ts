// Честный счётчик покупок для соцдоказательства у paywall (2026-09-11):
// показываем реальное число оплаченных заказов по городу — только когда
// оно больше нуля (ничего не выдумываем, "0 покупок" просто не рендерим).
// purchases закрыт RLS от анонимного ключа (там email), поэтому читаем
// сервисным ключом прямым REST-запросом — то же, что и другие built-time
// одноразовые чтения в проекте (см. generateStaticParams в page.tsx).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function countPaid(cityId: string, packages: string[]): Promise<number> {
  if (!url || !serviceKey) return 0;
  const pkgFilter = packages.join(",");
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 5_000);
    const res = await fetch(
      `${url}/rest/v1/purchases?select=id&city_id=eq.${cityId}&status=eq.paid&package_type=in.(${pkgFilter})&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "count=exact",
        },
        signal: ctrl.signal,
      },
    ).finally(() => clearTimeout(tid));
    if (!res.ok) return 0;
    const range = res.headers.get("content-range"); // формат "0-0/5"
    const total = range?.split("/")[1];
    return total && total !== "*" ? parseInt(total, 10) : 0;
  } catch {
    // Не блокируем рендер страницы города из-за счётчика — просто не
    // показываем блок соцдоказательства при любой ошибке/таймауте.
    return 0;
  }
}

export async function getCityPurchaseCounts(
  cityId: string,
): Promise<{ budget: number; places: number }> {
  const [budget, places] = await Promise.all([
    countPaid(cityId, ["budget", "bundle"]),
    countPaid(cityId, ["places", "bundle"]),
  ]);
  return { budget, places };
}

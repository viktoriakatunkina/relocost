import { supabase } from "@/lib/supabase";

export interface CrowdPrice {
  id: string;
  city_slug: string;
  city_name?: string;
  category: string;
  item_name: string;
  amount_rub: number;
  created_at: string;
}

export async function getRecentCrowdPrices(limit = 8): Promise<CrowdPrice[]> {
  const { data, error } = await supabase
    .from("crowd_prices")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function getCityCrowdPrices(
  citySlug: string,
  limit = 5
): Promise<CrowdPrice[]> {
  const { data, error } = await supabase
    .from("crowd_prices")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function getCrowdPricesCount(): Promise<number> {
  const { count, error } = await supabase
    .from("crowd_prices")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");
  if (error) return 0;
  return count ?? 0;
}

export async function getCityCrowdCount(citySlug: string): Promise<number> {
  const { count, error } = await supabase
    .from("crowd_prices")
    .select("*", { count: "exact", head: true })
    .eq("city_slug", citySlug)
    .eq("status", "approved");
  if (error) return 0;
  return count ?? 0;
}

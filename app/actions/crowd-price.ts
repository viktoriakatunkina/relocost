"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { CROWD_PRICE_CATEGORIES } from "@/lib/crowd-prices";

const ALLOWED_CATEGORIES = new Set<string>(CROWD_PRICE_CATEGORIES);

export async function submitCrowdPrice(formData: FormData) {
  const citySlug = String(formData.get("city_slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const itemName = String(formData.get("item_name") ?? "").trim();
  const amount = Number(formData.get("amount_rub"));

  if (
    !citySlug ||
    !category ||
    !itemName ||
    !amount ||
    amount <= 0 ||
    amount > 999999
  ) {
    return { ok: false, error: "Некорректные данные" };
  }

  // Это server action — доступен прямым POST-запросом в обход UI, где
  // выбор категории и city_slug ограничены кнопками/пропсом страницы.
  // Поэтому обе проверки обязательны именно здесь, перед insert.
  if (!ALLOWED_CATEGORIES.has(category)) {
    return { ok: false, error: "Некорректная категория" };
  }

  const sb = supabaseAdmin();

  const { data: city, error: cityError } = await sb
    .from("cities")
    .select("id")
    .eq("slug", citySlug)
    .maybeSingle();

  if (cityError) {
    return { ok: false, error: "Ошибка сервера" };
  }
  if (!city) {
    return { ok: false, error: "Город не найден" };
  }

  const { error } = await sb.from("crowd_prices").insert({
    city_slug: citySlug,
    category,
    item_name: itemName.slice(0, 100),
    amount_rub: Math.round(amount),
  });

  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") {
      return { ok: false, error: "Таблица цен ещё не создана — обратитесь к администратору." };
    }
    return { ok: false, error: "Ошибка сервера" };
  }
  return { ok: true };
}

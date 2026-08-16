"use server";

import { supabaseAdmin } from "@/lib/supabase";

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

  const sb = supabaseAdmin();
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

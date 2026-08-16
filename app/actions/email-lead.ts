"use server";

import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitEmailLead(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 254);
  const source = String(formData.get("source") ?? "blog")
    .trim()
    .slice(0, 80);

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Укажите корректный email" };
  }

  const sb = supabaseAdmin();
  const { error } = await sb.from("email_leads").insert({ email, source });

  if (error) {
    // 23505 — unique violation: такой email уже есть, считаем успехом
    if (error.code === "23505") return { ok: true };
    if (error.code === "PGRST205" || error.code === "42P01") {
      return { ok: false, error: "Сервис временно недоступен" };
    }
    return { ok: false, error: "Ошибка сервера" };
  }
  return { ok: true };
}

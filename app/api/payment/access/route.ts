import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidPackage } from "@/lib/yokassa";
import { verifyAccessToken } from "@/lib/access-link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/payment/access
 * Тело: { slug: string, email: string } или { slug: string, token: string }
 * (token — из ссылки в письме после оплаты, см. lib/access-link.ts)
 *
 * Восстановление доступа по email. Возвращает список оплаченных пакетов для
 * этого города (purchases.status='paid'). Нужен потому, что разблокировка
 * хранится в localStorage устройства — после оплаты через СБП/телефон/новую
 * вкладку клиентский след теряется, и единственный надёжный ключ к покупке —
 * email, который покупатель указывал при оплате (и который уходит в чек ЮKassa).
 *
 * Ответ: { packages: PackageType[] } — что разблокировать на странице города.
 */
export async function POST(req: Request) {
  let payload: { slug?: string; email?: string; kind?: string; token?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const slug = typeof payload.slug === "string" ? payload.slug : "";
  let email = typeof payload.email === "string" ? payload.email.trim() : "";

  if (!slug) {
    return NextResponse.json({ error: "Не указан город" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Ссылка из письма после оплаты (?access=…, lib/access-link.ts): токен
  // подписан сервером и указывает на конкретную покупку — email берем из нее.
  // Дальше — тот же путь, что и при ручном вводе email, поэтому открываются
  // все оплаченные пакеты этого покупателя для страницы.
  if (payload.token !== undefined) {
    const purchaseId = verifyAccessToken(payload.token);
    if (!purchaseId) {
      return NextResponse.json({ error: "Ссылка недействительна" }, { status: 403 });
    }
    const { data: purchase } = await db
      .from("purchases")
      .select("email, status")
      .eq("id", purchaseId)
      .maybeSingle();
    if (!purchase || purchase.status !== "paid" || !purchase.email) {
      return NextResponse.json({ packages: [] });
    }
    email = String(purchase.email).trim();
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
  }

  // kind: "country" — восстановление доступа к материалам страны (там нет
  // city_id, покупка привязана к country_slug). См. миграцию
  // 202609090900_purchases_country_packages.sql.
  const isCountry = payload.kind === "country";

  let rows: { package_type: string; email: string | null }[] | null = null;

  if (isCountry) {
    const res = await db
      .from("purchases")
      .select("package_type, email")
      .eq("country_slug", slug)
      .eq("status", "paid");
    // Если миграция ещё не применена — колонки нет; отвечаем пустым списком,
    // а не 500: восстанавливать всё равно нечего.
    if (res.error) return NextResponse.json({ packages: [] });
    rows = res.data;
  } else {
    const { data: city } = await db
      .from("cities")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!city) {
      return NextResponse.json({ packages: [] });
    }

    const res = await db
      .from("purchases")
      .select("package_type, email")
      .eq("city_id", city.id)
      .eq("status", "paid");
    if (res.error) {
      return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
    }
    rows = res.data;
  }

  const norm = email.toLowerCase();
  const packages = Array.from(
    new Set(
      (rows ?? [])
        .filter((r) => (r.email ?? "").trim().toLowerCase() === norm)
        .map((r) => r.package_type),
    ),
  ).filter((p) => isValidPackage(p));

  // email отдаем только при входе по ссылке: клиент сохранит его, и на этом
  // устройстве доступ дальше восстанавливается сам (VerifyOnReturn, путь 2).
  return NextResponse.json(
    payload.token !== undefined && packages.length ? { packages, email } : { packages },
  );
}

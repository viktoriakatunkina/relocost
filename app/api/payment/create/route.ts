import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createPayment,
  isYokassaConfigured,
  isValidPackage,
  PACKAGE_PRICES,
  PACKAGE_LABELS,
} from "@/lib/yokassa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/payment/create
 * Тело: { slug: string, pkg: PackageType, email: string }
 *
 * Создаёт запись purchases (status=pending) и платёж в ЮKassa.
 * Возвращает { confirmation_url } для редиректа на оплату.
 * Если ключи ЮKassa не настроены — возвращает { demo: true }, фронт работает в demo-режиме.
 */
export async function POST(req: Request) {
  let payload: { slug?: string; pkg?: string; email?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { slug, pkg, email } = payload;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Не указан город" }, { status: 400 });
  }
  if (!isValidPackage(pkg)) {
    return NextResponse.json({ error: "Неизвестный пакет" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
  }

  // Пока ключей нет — фронт сам разблокирует контент в demo-режиме.
  if (!isYokassaConfigured()) {
    return NextResponse.json({ demo: true });
  }

  const db = supabaseAdmin();

  // Город ищем на сервере — берём его id, название и признак зарубежного.
  const { data: city, error: cityErr } = await db
    .from("cities")
    .select("id, name_ru, is_foreign")
    .eq("slug", slug)
    .maybeSingle();

  if (cityErr) {
    return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
  }
  if (!city) {
    return NextResponse.json({ error: "Город не найден" }, { status: 404 });
  }

  // Гайд по жизни доступен только для зарубежных городов.
  if (pkg === "guide" && !city.is_foreign) {
    return NextResponse.json(
      { error: "Пакет недоступен для этого города" },
      { status: 400 },
    );
  }

  const amount = PACKAGE_PRICES[pkg];

  // Запись о покупке (источник правды на проде; подтверждается webhook'ом).
  const { data: purchase, error: insErr } = await db
    .from("purchases")
    .insert({
      city_id: city.id,
      package_type: pkg,
      email,
      amount,
      status: "pending",
    })
    .select("id")
    .single();

  if (insErr || !purchase) {
    return NextResponse.json({ error: "Не удалось создать заказ" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relocost.ru";
  const returnUrl = `${siteUrl}/city/${slug}?unlocked=${pkg}`;

  try {
    const payment = await createPayment({
      amountRub: amount,
      description: `Relocost: «${PACKAGE_LABELS[pkg]}» — ${city.name_ru}`,
      returnUrl,
      customerEmail: email,
      metadata: { purchase_id: purchase.id, slug, pkg },
    });

    const url = payment.confirmation?.confirmation_url;
    if (!url) {
      return NextResponse.json(
        { error: "ЮKassa не вернула ссылку на оплату" },
        { status: 502 },
      );
    }
    return NextResponse.json({ confirmation_url: url, payment_id: payment.id });
  } catch (e) {
    // Помечаем заказ как failed, чтобы не висел в pending.
    await db.from("purchases").update({ status: "failed" }).eq("id", purchase.id);
    const msg = e instanceof Error ? e.message : "Ошибка оплаты";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

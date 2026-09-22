import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createPayment,
  isYokassaConfigured,
  receiptsEnabled,
  buildNpdReceipt,
} from "@/lib/yokassa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = ["ru", "en", "uz"] as const;

// Бандл «Бюджет» на ДВА города сразу — 299 ₽ вместо 398 ₽ (2×199 ₽).
// См. lib/packages.ts (CITY_PAIR_BUDGET_BUNDLE) — там же объяснение, почему
// это отдельный маршрут, а не расширение /api/payment/create.
const BUNDLE_PRICE = 299;
const BUNDLE_PKG = "budget" as const;
// Сумма по двум записям purchases должна сложиться в BUNDLE_PRICE, а не в
// обычную цену budget (199 ₽ каждая) — иначе сумма по БД разъедется с тем,
// что реально списала ЮKassa (один платеж на 299 ₽).
const SPLIT_A = 150;
const SPLIT_B = 149;

/** См. app/api/payment/create/route.ts — тот же хелпер, продублирован
 *  намеренно: этот маршрут не должен зависеть от того файла и не должен его
 *  менять (единственная сейчас работающая монетизация — риск нулевой). */
function localePrefix(locale: unknown): string {
  return typeof locale === "string" &&
    (LOCALES as readonly string[]).includes(locale) &&
    locale !== "ru"
    ? `/${locale}`
    : "";
}

/**
 * POST /api/payment/create-bundle
 * Тело: { slugA: string, slugB: string, email: string, locale?: string }
 *
 * Создает ДВЕ обычные записи purchases (package_type='budget', по одной на
 * каждый город, status=pending) и ОДИН платеж в ЮKassa на 299 ₽. Оба
 * purchase_id кладутся в metadata платежа (purchase_id / purchase_id_2) —
 * webhook и /api/payment/verify помечают paid обе записи (см. их код).
 *
 * Намеренно НЕ трогает purchases.package_type / схему — обе строки это
 * самостоятельные budget-покупки, полностью совместимые с существующей
 * логикой разблокировки (isUnlocked, /api/payment/access, RestoreAccess).
 */
export async function POST(req: Request) {
  let payload: {
    slugA?: string;
    slugB?: string;
    email?: string;
    locale?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { slugA, slugB, email, locale } = payload;

  if (!slugA || typeof slugA !== "string" || !slugB || typeof slugB !== "string") {
    return NextResponse.json({ error: "Не указаны города" }, { status: 400 });
  }
  if (slugA === slugB) {
    return NextResponse.json({ error: "Города должны быть разными" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
  }

  // Пока ключей нет — фронт сам разблокирует контент в demo-режиме (тот же
  // паттерн, что и в /api/payment/create).
  if (!isYokassaConfigured()) {
    return NextResponse.json({ demo: true });
  }

  const db = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relocost.ru";
  const prefix = localePrefix(locale);

  const { data: cities, error: cityErr } = await db
    .from("cities")
    .select("id, slug, name_ru")
    .in("slug", [slugA, slugB]);

  if (cityErr) {
    return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
  }
  const cityA = cities?.find((c) => c.slug === slugA);
  const cityB = cities?.find((c) => c.slug === slugB);
  if (!cityA || !cityB) {
    return NextResponse.json({ error: "Город не найден" }, { status: 404 });
  }

  // Две независимые записи purchases — по одной на город. Тот же самый вид
  // строки, что при обычной одиночной покупке budget, поэтому вся логика
  // восстановления доступа (/api/payment/access, hasAccess и т.п.) работает
  // без единой строчки изменений.
  const [insA, insB] = await Promise.all([
    db
      .from("purchases")
      .insert({
        city_id: cityA.id,
        package_type: BUNDLE_PKG,
        email,
        amount: SPLIT_A,
        status: "pending",
      })
      .select("id")
      .single(),
    db
      .from("purchases")
      .insert({
        city_id: cityB.id,
        package_type: BUNDLE_PKG,
        email,
        amount: SPLIT_B,
        status: "pending",
      })
      .select("id")
      .single(),
  ]);

  if (insA.error || !insA.data || insB.error || !insB.data) {
    // Лучшая попытка не оставлять висячую pending-запись, если вставилась
    // только одна из двух.
    if (insA.data) {
      await db.from("purchases").update({ status: "failed" }).eq("id", insA.data.id);
    }
    if (insB.data) {
      await db.from("purchases").update({ status: "failed" }).eq("id", insB.data.id);
    }
    return NextResponse.json({ error: "Не удалось создать заказ" }, { status: 500 });
  }

  const purchaseIdA = insA.data.id as string;
  const purchaseIdB = insB.data.id as string;

  const description = `Relocost: «Бюджет» — ${cityA.name_ru} + ${cityB.name_ru} (2 города)`;
  const returnUrl = `${siteUrl}${prefix}/compare/${slugA}-vs-${slugB}`;

  try {
    const payment = await createPayment({
      amountRub: BUNDLE_PRICE,
      description,
      returnUrl,
      customerEmail: email,
      metadata: {
        purchase_id: purchaseIdA,
        purchase_id_2: purchaseIdB,
        slug: slugA,
        slug2: slugB,
        pkg: BUNDLE_PKG,
        kind: "city_pair_bundle",
      },
      receipt: receiptsEnabled()
        ? buildNpdReceipt({ email, description, amountRub: BUNDLE_PRICE })
        : undefined,
    });

    const url = payment.confirmation?.confirmation_url;
    if (!url) {
      return NextResponse.json(
        { error: "ЮKassa не вернула ссылку на оплату" },
        { status: 502 },
      );
    }
    return NextResponse.json({
      confirmation_url: url,
      payment_id: payment.id,
      purchase_id: purchaseIdA,
      purchase_id_2: purchaseIdB,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка оплаты";
    console.error("[payment/create-bundle] createPayment failed", {
      purchaseIdA,
      purchaseIdB,
      error: msg,
    });
    await db.from("purchases").update({ status: "failed" }).eq("id", purchaseIdA);
    await db.from("purchases").update({ status: "failed" }).eq("id", purchaseIdB);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { COUNTRY_NAMES_RU } from "@/lib/countries-content";
import {
  createPayment,
  isYokassaConfigured,
  isValidPackage,
  PACKAGE_PRICES,
  PACKAGE_LABELS,
  receiptsEnabled,
  buildNpdReceipt,
} from "@/lib/yokassa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = ["ru", "en", "uz"] as const;
const COUNTRY_PACKAGES = ["country_cities", "country_overview"] as const;

/** Возврат с ЮKassa — на страницу той же локали, с которой ушли.
 *  У ru префикса нет (localePrefix: "as-needed"), у en/uz — есть.
 *  Без этого англоязычный покупатель возвращался на русскую версию. */
function localePrefix(locale: unknown): string {
  return typeof locale === "string" &&
    (LOCALES as readonly string[]).includes(locale) &&
    locale !== "ru"
    ? `/${locale}`
    : "";
}

/**
 * POST /api/payment/create
 * Тело: { slug: string, pkg: PackageType, email: string }
 *
 * Создает запись purchases (status=pending) и платеж в ЮKassa.
 * Возвращает { confirmation_url } для редиректа на оплату.
 * Если ключи ЮKassa не настроены — возвращает { demo: true }, фронт работает в demo-режиме.
 */
export async function POST(req: Request) {
  let payload: {
    slug?: string;
    pkg?: string;
    email?: string;
    locale?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { slug, pkg, email, locale } = payload;

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
  const isCountry = (COUNTRY_PACKAGES as readonly string[]).includes(pkg);
  const amount = PACKAGE_PRICES[pkg];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relocost.ru";
  const prefix = localePrefix(locale);

  // -------------------------------------------------------------------------
  // Пакеты СТРАН (country_overview 29 ₽ / country_cities 49 ₽)
  // -------------------------------------------------------------------------
  //
  // 2026-09-09: раньше сюда вообще нельзя было дойти — маршрут искал город по
  // slug и на любой стране («georgia», «serbia», …) отдавал 404 «Город не
  // найден». Проверено боем: POST /api/payment/create {"slug":"georgia",
  // "pkg":"country_overview"} → 404. То есть оба страновых пакета были
  // физически некупляемы с момента запуска страниц стран.
  //
  // Записываем такую покупку через country_slug (город тут ни при чём).
  // ВАЖНО: требует миграции 202609090900_purchases_country_packages.sql —
  // без неё БД отвергает и country_* в package_type (check constraint), и
  // city_id = null (not null). Если миграция не применена, отвечаем понятной
  // ошибкой, а не молчаливым 500 и не ложным «Город не найден».
  let purchaseId: string;
  let description: string;
  let returnUrl: string;

  if (isCountry) {
    const countryName = COUNTRY_NAMES_RU[slug];
    if (!countryName) {
      return NextResponse.json({ error: "Страна не найдена" }, { status: 404 });
    }

    const { data: purchase, error: insErr } = await db
      .from("purchases")
      .insert({
        city_id: null,
        country_slug: slug,
        package_type: pkg,
        email,
        amount,
        status: "pending",
      })
      .select("id")
      .single();

    if (insErr || !purchase) {
      return NextResponse.json(
        {
          error:
            "Оплата материалов о стране временно недоступна. Попробуйте позже.",
        },
        { status: 503 },
      );
    }

    purchaseId = purchase.id;
    description = `Relocost: «${PACKAGE_LABELS[pkg]}» — ${countryName}`;
    returnUrl = `${siteUrl}${prefix}/country/${slug}`;
  } else {
    // -----------------------------------------------------------------------
    // Пакеты ГОРОДОВ
    // -----------------------------------------------------------------------
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

    purchaseId = purchase.id;
    description = `Relocost: «${PACKAGE_LABELS[pkg]}» — ${city.name_ru}`;
    // Возврат на чистый URL: разблокировку решает серверная проверка платежа
    // (VerifyOnReturn → /api/payment/verify), а не параметр в адресе.
    returnUrl = `${siteUrl}${prefix}/city/${slug}`;
  }

  try {
    const payment = await createPayment({
      amountRub: amount,
      description,
      returnUrl,
      customerEmail: email,
      metadata: { purchase_id: purchaseId, slug, pkg },
      // Чек НПД — только при включенной фискализации на стороне ЮKassa.
      receipt: receiptsEnabled()
        ? buildNpdReceipt({ email, description, amountRub: amount })
        : undefined,
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
    await db.from("purchases").update({ status: "failed" }).eq("id", purchaseId);
    const msg = e instanceof Error ? e.message : "Ошибка оплаты";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

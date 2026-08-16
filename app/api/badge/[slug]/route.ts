import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { monthlyBudgetFrom } from "@/lib/city-budget";
import {
  getMoscowBaseline,
  cityVsMoscow,
  moscowCostIndex,
} from "@/lib/moscow-baseline";
import { getPricesByCity } from "@/lib/prices";

// SVG-бейдж «Индекс стоимости [город]» для вставки на блоги.
// Генерирует реальные обратные ссылки на relocost.ru.
// Пример кода для вставки:
//   <a href="https://relocost.ru/city/tbilisi">
//     <img src="https://relocost.ru/api/badge/tbilisi" width="360" height="90">
//   </a>

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  const { data: city } = await supabase
    .from("cities")
    .select("id, name_ru, country_ru, flag_emoji")
    .eq("slug", slug)
    .maybeSingle();

  if (!city) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Бюджет и индекс стоимости vs Москвы
  const [prices, moscowBaseline] = await Promise.all([
    getPricesByCity(city.id),
    getMoscowBaseline(),
  ]);

  const rows = Object.values(prices).flat();
  const { monthly_from } = monthlyBudgetFrom(rows);

  let costIdx: number | null = null;
  if (slug === "moscow") {
    costIdx = 100;
  } else if (moscowBaseline) {
    const comp = cityVsMoscow(prices, moscowBaseline);
    if (comp) costIdx = moscowCostIndex(comp.avgDiff);
  }

  const fmtRub = (n: number) =>
    new Intl.NumberFormat("ru-RU").format(n);

  const name = city.name_ru;
  const country = city.country_ru ?? "";
  const flag = city.flag_emoji ?? "";
  const budgetLine = monthly_from > 0
    ? `от ${fmtRub(monthly_from)} ₽/мес`
    : "";
  const indexLine = costIdx !== null
    ? `Индекс: ${costIdx} (Москва = 100)`
    : "";

  // Ширина 360px, высота 90px — стандартный «кнопочный» баннер.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="90" viewBox="0 0 360 90" role="img" aria-label="Стоимость жизни в ${esc(name)} — Relocost">
  <title>Стоимость жизни в ${esc(name)} — Relocost</title>

  <!-- Фон -->
  <rect width="360" height="90" rx="10" fill="#1A2105"/>
  <!-- Медная акцентная полоса слева -->
  <rect x="0" y="0" width="4" height="90" rx="2" fill="#E89B6E"/>

  <!-- RELOCOST (верхний лейбл) -->
  <text x="18" y="22" font-family="system-ui, -apple-system, sans-serif"
        font-size="10" font-weight="600" letter-spacing="3" fill="#E89B6E"
        text-rendering="optimizeLegibility">RELOCOST</text>

  <!-- Флаг + название города -->
  <text x="18" y="55" font-family="Georgia, 'Times New Roman', serif"
        font-size="26" fill="#F6F1E8"
        text-rendering="optimizeLegibility">${esc(flag)} ${esc(name)}</text>

  <!-- Страна -->
  <text x="18" y="76" font-family="system-ui, -apple-system, sans-serif"
        font-size="12" fill="#E6CFA8"
        text-rendering="optimizeLegibility">${esc(country)}</text>

  <!-- Бюджет (правая сторона) -->
  ${budgetLine ? `<text x="350" y="45" font-family="system-ui, -apple-system, sans-serif"
        font-size="18" font-weight="700" fill="#E89B6E" text-anchor="end"
        text-rendering="optimizeLegibility">${esc(budgetLine)}</text>` : ""}

  <!-- Индекс vs Москвы -->
  ${indexLine ? `<text x="350" y="67" font-family="system-ui, -apple-system, sans-serif"
        font-size="11" fill="#E6CFA8" text-anchor="end"
        text-rendering="optimizeLegibility">${esc(indexLine)}</text>` : ""}

  <!-- Домен (якорь для ссылки) -->
  <text x="350" y="84" font-family="system-ui, -apple-system, sans-serif"
        font-size="10" fill="#6A784D" text-anchor="end"
        text-rendering="optimizeLegibility">relocost.ru</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Сутки кешируем в CDN — данные обновляются редко.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}

// Экранируем специсимволы для SVG-текста.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

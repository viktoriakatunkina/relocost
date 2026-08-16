import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import { monthlyBudgetFrom } from "@/lib/city-budget";

export const runtime = "nodejs";
export const alt = "Relocost — стоимость жизни в городе";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG-картинки рендерятся по запросу краулеров, не при сборке.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export default async function OG({ params }: { params: { slug: string } }) {
  const { data: city } = await supabase
    .from("cities")
    .select("id, name_ru, country_ru, flag_emoji, unsplash_url, image_url")
    .eq("slug", params.slug)
    .maybeSingle();

  const name = city?.name_ru ?? "Город";
  const country = city?.country_ru ?? "";
  const flag = city?.flag_emoji ?? "";
  const bg = city?.image_url
    ? city.image_url
    : city?.unsplash_url
      ? `${city.unsplash_url}&w=1200&h=630&fit=crop&auto=format&q=80`
      : null;

  // Минимальный бюджет из цен города — ключевая цифра для шеринга.
  let monthlyFrom = 0;
  if (city?.id) {
    const { data: priceRows } = await supabase
      .from("prices")
      .select("item_name_ru, price_min")
      .eq("city_id", city.id)
      .in("category", ["rent", "food", "transport", "utilities"]);
    const { monthly_from } = monthlyBudgetFrom(priceRows ?? []);
    monthlyFrom = monthly_from;
  }

  const budgetStr = monthlyFrom > 0
    ? `от ${new Intl.NumberFormat("ru-RU").format(monthlyFrom)} ₽/мес`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "Georgia, serif",
          color: "#F5F0E8",
          position: "relative",
        }}
      >
        {bg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, objectFit: "cover" }}
          />
        ) : null}

        {/* Тёмный градиент — читабельность текста поверх фото */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(26,33,5,0.5) 0%, rgba(26,33,5,0.88) 60%, rgba(26,33,5,0.97) 100%)",
          }}
        />

        {/* Верхняя строка: лого + страна */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#E89B6E",
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            Relocost
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#E6CFA8",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {country}
          </span>
        </div>

        {/* Центральный блок: флаг + название + бюджет */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            gap: 36,
          }}
        >
          {flag ? (
            <span style={{ fontSize: 140, lineHeight: 1 }}>{flag}</span>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span
              style={{
                color: "#E6CFA8",
                fontSize: 26,
                marginBottom: 8,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Стоимость жизни в
            </span>
            <span style={{ fontSize: 96, lineHeight: 1 }}>{name}</span>
            {budgetStr ? (
              <span
                style={{
                  fontSize: 52,
                  color: "#E89B6E",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 700,
                  marginTop: 16,
                  letterSpacing: -1,
                }}
              >
                {budgetStr}
              </span>
            ) : null}
          </div>
        </div>

        {/* Нижняя строка: подпись */}
        <div
          style={{
            position: "relative",
            color: "#E6CFA8",
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Калькулятор · виза · лучшие места · отзывы переехавших</span>
          <span style={{ color: "#E89B6E", fontSize: 20 }}>relocost.ru</span>
        </div>
      </div>
    ),
    size,
  );
}

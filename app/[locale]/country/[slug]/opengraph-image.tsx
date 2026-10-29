import { ImageResponse } from "next/og";
import { getCountryMeta } from "@/lib/countries";
import { getCountryCost } from "@/lib/country-cost";
import { countryIn } from "@/lib/country-prepositional";
import { formatRub } from "@/lib/cities";

export const runtime = "nodejs";
export const alt = "Relocost — стоимость жизни в стране";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG-картинки рендерятся по запросу краулеров, не при сборке — тот же
// паттерн, что у city/[slug] и blog/[slug] (см. комментарии там).
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export default async function OG({ params }: { params: { slug: string } }) {
  const meta = await getCountryMeta(params.slug);
  const name = meta?.country_ru ?? "Страна";
  const flag = meta?.flag_emoji ?? "";
  const nameIn = meta ? countryIn(params.slug, name) : name;

  // Один реальный факт из агрегата цен по стране — та же методика (медиана
  // по городам страны), что на самой странице /country/[slug].
  const cost = await getCountryCost(params.slug);
  const budgetStr =
    cost && cost.monthlySolo > 0 ? `от ${formatRub(cost.monthlySolo)}/мес` : null;
  const cityCountStr =
    cost && cost.cityCount > 0
      ? `${cost.cityCount} ${cost.cityCount === 1 ? "город" : "городов"}`
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
          background:
            "linear-gradient(135deg, #33432B 0%, #202808 55%, #5A3D2A 100%)",
          padding: "72px",
          fontFamily: "Georgia, serif",
          color: "#F5F0E8",
        }}
      >
        {/* Верхняя строка: лого + за рубежом/по России */}
        <div
          style={{
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
            {meta?.is_foreign ? "За рубежом" : "По России"}
          </span>
        </div>

        {/* Центральный блок: флаг + название страны + бюджет */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 36 }}>
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
            <span style={{ fontSize: 80, lineHeight: 1.05, maxWidth: 1000 }}>
              {nameIn}
            </span>
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
            color: "#E6CFA8",
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>
            {cityCountStr
              ? `${cityCountStr} · виза · бюджет на месяц`
              : "Калькулятор · виза · бюджет на месяц"}
          </span>
          <span style={{ color: "#E89B6E", fontSize: 20 }}>relocost.ru</span>
        </div>
      </div>
    ),
    size,
  );
}

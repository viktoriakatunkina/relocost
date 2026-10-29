import { ImageResponse } from "next/og";
import { loadCompare, parsePair, compareDelta } from "@/lib/compare";
import {
  loadCountryCompare,
  countryCompareDelta,
} from "@/lib/compare-countries";

export const runtime = "nodejs";
export const alt = "Relocost — сравнение стоимости жизни";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG-картинки рендерятся по запросу краулеров, не при сборке — тот же
// паттерн, что у city/[slug] и blog/[slug] (см. комментарии там).
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export default async function OG({ params }: { params: { pair: string } }) {
  // /compare/[pair] обслуживает и пары городов, и пары стран (lib/compare и
  // lib/compare-countries) — та же развилка, что в generateMetadata страницы.
  let title = "Сравнение стоимости жизни";
  let flagA = "";
  let flagB = "";

  const parsed = parsePair(params.pair);
  if (parsed) {
    const [slugA, slugB] = parsed;
    const cityData = await loadCompare(slugA, slugB);
    if (cityData) {
      flagA = cityData.a.flag_emoji ?? "";
      flagB = cityData.b.flag_emoji ?? "";
      const delta = compareDelta(cityData);
      title = delta
        ? `${delta.cheaper === "a" ? cityData.a.name_ru : cityData.b.name_ru} дешевле ${
            delta.cheaper === "a" ? cityData.b.name_ru : cityData.a.name_ru
          } на ${delta.pct}%`
        : `${cityData.a.name_ru} vs ${cityData.b.name_ru}`;
    } else {
      const countryData = await loadCountryCompare(slugA, slugB);
      if (countryData) {
        flagA = countryData.a.flag_emoji ?? "";
        flagB = countryData.b.flag_emoji ?? "";
        const delta = countryCompareDelta(countryData);
        title = delta
          ? `${delta.cheaper === "a" ? countryData.a.name_ru : countryData.b.name_ru} дешевле ${
              delta.cheaper === "a" ? countryData.b.name_ru : countryData.a.name_ru
            } на ${delta.pct}%`
          : `${countryData.a.name_ru} vs ${countryData.b.name_ru}`;
      }
    }
  }

  // Заголовок — переменной длины («Тбилиси дешевле Дубая на 42%» против
  // «Казахстан vs Узбекистан»), поэтому размер шрифта подстраивается под длину.
  const titleSize = title.length > 34 ? 58 : 76;

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
        {/* Верхняя строка: лого + метка */}
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
            Сравнение
          </span>
        </div>

        {/* Центральный блок: флаги + заголовок-вывод */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {flagA || flagB ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                fontSize: 64,
              }}
            >
              <span>{flagA}</span>
              <span
                style={{
                  fontSize: 30,
                  color: "#8A9A6E",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                vs
              </span>
              <span>{flagB}</span>
            </div>
          ) : null}
          <div style={{ fontSize: titleSize, lineHeight: 1.15, maxWidth: 1050 }}>
            {title}
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
          <span>Калькулятор переезда · реальные цены</span>
          <span style={{ color: "#E89B6E", fontSize: 20 }}>relocost.ru</span>
        </div>
      </div>
    ),
    size,
  );
}

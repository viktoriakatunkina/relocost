import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Relocost — калькулятор стоимости жизни для переезжающих";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
            "radial-gradient(ellipse at 30% 20%, #6A784D 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, #C4866D 0%, transparent 50%), #202808",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            color: "#C4866D",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Relocost
        </div>
        <div
          style={{
            color: "#F5F0E8",
            fontSize: 92,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Сколько стоит переехать в другой город или страну?
        </div>
        <div
          style={{
            color: "#DEC59E",
            fontSize: 28,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Калькулятор · 10+ направлений · реальные цены
        </div>
      </div>
    ),
    size,
  );
}

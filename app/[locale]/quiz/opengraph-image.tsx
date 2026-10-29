import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Relocost — тест: куда переехать";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Результат теста — клиентское состояние (6 ответов пользователя), поэтому
// персонализировать картинку на уровне статического OG нельзя. Вместо
// générик-фолбэка главной — одна тематическая картинка под сам инструмент
// (тот же подход, что у /match, /rating, /checklist, /search, /tariffs).
export default function OG() {
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
        <div
          style={{
            color: "#C4866D",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Relocost · Тест
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <span style={{ fontSize: 150, lineHeight: 1 }}>🧭</span>
          <div style={{ fontSize: 78, lineHeight: 1.1, maxWidth: 820 }}>
            Куда Вам переехать?
          </div>
        </div>
        <div
          style={{
            color: "#DEC59E",
            fontSize: 26,
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>6 вопросов · бюджет, климат и приоритеты</span>
          <span style={{ color: "#E89B6E", fontSize: 20 }}>relocost.ru</span>
        </div>
      </div>
    ),
    size,
  );
}

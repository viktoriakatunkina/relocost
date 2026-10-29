import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Relocost — тарифы и пакеты";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Статичная тематическая картинка вместо генерик-фолбэка главной (тот же
// подход, что у /quiz). Пакеты и эмодзи — те же, что в lib/packages.ts
// (единственный источник истины по ценам), цены здесь не упоминаем, чтобы
// картинка не протухала при изменении цены без обновления этого файла.
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
          Relocost · Тарифы
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.1, maxWidth: 950 }}>
          Тарифы и пакеты
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 28,
              color: "#E6CFA8",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <span>📍 Места</span>
            <span>📊 Расходы</span>
            <span>🎁 Все включено</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#DEC59E",
              fontSize: 26,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <span>Сравнение пакетов по пунктам, а не только по цене</span>
            <span style={{ color: "#E89B6E", fontSize: 20 }}>relocost.ru</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

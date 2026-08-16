import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#C4866D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 8c-9.9 0-18 7.9-18 17.7 0 13.2 18 30.3 18 30.3s18-17.1 18-30.3C50 15.9 41.9 8 32 8z"
            fill="#1A2105"
          />
          <circle cx="32" cy="25" r="7" fill="#C4866D" />
        </svg>
      </div>
    ),
    size,
  );
}

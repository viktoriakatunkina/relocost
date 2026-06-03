import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "Relocost — стоимость жизни в городе";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const { data } = await supabase.from("cities").select("slug");
  return (data ?? []).map((c) => ({ slug: c.slug }));
}

export default async function OG({ params }: { params: { slug: string } }) {
  const { data: city } = await supabase
    .from("cities")
    .select("name_ru, country_ru, flag_emoji, unsplash_url")
    .eq("slug", params.slug)
    .maybeSingle();

  const name = city?.name_ru ?? "Город";
  const country = city?.country_ru ?? "";
  const flag = city?.flag_emoji ?? "";
  const bg = city?.unsplash_url
    ? `${city.unsplash_url}&w=1200&h=630&fit=crop&auto=format&q=80`
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
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(32,40,8,0.4) 0%, rgba(32,40,8,0.85) 100%)",
          }}
        />

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
              color: "#C4866D",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Relocost
          </span>
          <span style={{ fontSize: 32, color: "#DEC59E" }}>{country}</span>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            gap: 40,
          }}
        >
          <span style={{ fontSize: 180, lineHeight: 1 }}>{flag}</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#DEC59E", fontSize: 28, marginBottom: 6 }}>
              Стоимость жизни в
            </span>
            <span style={{ fontSize: 120, lineHeight: 1 }}>{name}</span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            color: "#DEC59E",
            fontSize: 26,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Калькулятор · виза · лучшие места · отзывы переехавших
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "Relocost блог";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export default async function OG({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, tag, read_time")
    .eq("slug", params.slug)
    .maybeSingle();

  const title = post?.title ?? "Статья Relocost";
  const tag = post?.tag ?? "Блог";
  const readTime = post?.read_time;

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
            "radial-gradient(ellipse at 20% 10%, #33432B 0%, transparent 60%), radial-gradient(ellipse at 90% 90%, #C4866D 0%, transparent 55%), #202808",
          padding: "72px",
          fontFamily: "Georgia, serif",
          color: "#F5F0E8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              color: "#C4866D",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Relocost · {tag}
          </span>
          {readTime ? (
            <span
              style={{
                color: "#8A9A6E",
                fontSize: 22,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              · {readTime} мин чтения
            </span>
          ) : null}
        </div>

        <div style={{ fontSize: 78, lineHeight: 1.1, maxWidth: 1050 }}>
          {title}
        </div>

        <div
          style={{
            color: "#DEC59E",
            fontSize: 26,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          relocost.ru
        </div>
      </div>
    ),
    size,
  );
}

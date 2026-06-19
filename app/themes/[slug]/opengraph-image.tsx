import { ImageResponse } from "next/og";
import { getThemeBySlug } from "@/src/lib/themes";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);

  const title = theme?.nameAr ?? "موضوع إسلامي";
  const subtitle = theme
    ? `${theme.ayahs.length} آية · ${theme.hadiths.length} حديث`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              color: "#666666",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#999999",
          }}
        >
          SHK Islam
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

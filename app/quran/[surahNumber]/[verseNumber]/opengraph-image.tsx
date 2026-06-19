import { ImageResponse } from "next/og";
import { getAyahBySurahAndVerse } from "@/src/lib/quran";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({
  params,
}: {
  params: Promise<{ surahNumber: string; verseNumber: string }>;
}) {
  const { surahNumber, verseNumber } = await params;
  const surahNum = parseInt(surahNumber);
  const verseNum = parseInt(verseNumber);

  const [ayah] = await getAyahBySurahAndVerse(surahNum, verseNum);

  const title = ayah
    ? `سورة ${ayah.surahNameAr} - الآية ${ayah.numberInSurah}`
    : "آية قرآنية";
  const text = ayah
    ? ayah.textUthmani.slice(0, 100) + (ayah.textUthmani.length > 100 ? "…" : "")
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
            fontSize: 36,
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {title}
        </div>
        {text && (
          <div
            style={{
              fontSize: 24,
              color: "#444444",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 900,
              direction: "rtl",
            }}
          >
            {text}
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

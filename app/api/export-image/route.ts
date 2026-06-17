import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { getTemplate } from "@/src/lib/export-templates";
import { readFileSync } from "fs";
import { join } from "path";

// Read and cache font at module load time
const FONT_PATH = join(process.cwd(), "public/fonts/KFGQPC-Uthmanic-HAFS.otf");
const fontBase64 = readFileSync(FONT_PATH).toString("base64");
const FONT_DATA_URI = `data:font/otf;base64,${fontBase64}`;

export async function POST(request: NextRequest) {
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "Export to image is not available on serverless (Vercel). Use localhost instead." },
      { status: 501 }
    );
  }

  try {
    const body = await request.json();
    const { text, type, source, templateSlug } = body;

    if (!text || !source || !templateSlug) {
      return NextResponse.json(
        { error: "text, source, and templateSlug are required" },
        { status: 400 }
      );
    }

    const template = getTemplate(templateSlug);
    if (!template) {
      return NextResponse.json(
        { error: "Invalid template slug" },
        { status: 400 }
      );
    }

    const html = template.html(text, source, FONT_DATA_URI);

    const browser = await chromium.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.setContent(html, { waitUntil: "networkidle" });

    // Wait for fonts to load
    await page.waitForTimeout(1000);

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    await browser.close();

    return new NextResponse(new Uint8Array(screenshot), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="shk-islam-${type}-${Date.now()}.png"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export image" },
      { status: 500 }
    );
  }
}

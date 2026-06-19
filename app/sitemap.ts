import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/seo";
import { getAllSurahs } from "@/src/lib/quran";
import { getAllThemesForSitemap } from "@/src/lib/themes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/quran`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/hadith`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/themes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const surahs = await getAllSurahs();
  const surahPages: MetadataRoute.Sitemap = surahs.map((s) => ({
    url: `${SITE_URL}/quran/${s.number}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const themes = await getAllThemesForSitemap();
  const themePages: MetadataRoute.Sitemap = themes.map((t) => ({
    url: `${SITE_URL}/themes/${t.slug}`,
    lastModified: t.updatedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ponytail: ayah and hadith detail pages excluded — ~13k pages, massive competition, low ROI
  return [...staticPages, ...surahPages, ...themePages];
}

import { searchAyahs } from "./quran";
import { searchHadiths } from "./hadith";
import { getAllThemes, getThemeBySlug } from "./themes";
import { ArabicServices } from "arabic-services";

export type SearchType = "quran" | "hadith" | "all";
export type SearchMode = "literal" | "thematic";

export interface SearchResult {
  type: "quran" | "hadith";
  id: number;
  title: string;
  subtitle: string;
  text: string;
  snippet: string | null;
  rank: number;
  // Additional fields for citation
  surahName?: string;
  surahNumber?: number;
  verseNumber?: number;
  bookNameAr?: string;
  bookSlug?: string;
  hadithNumber?: number;
  narrator?: string;
  // Theme info for curated results
  themeSlug?: string;
  themeName?: string;
  isCurated?: boolean;
}

export async function unifiedSearch(
  query: string,
  type: SearchType = "all",
  mode: SearchMode = "literal"
) {
  if (mode === "thematic") {
    return thematicSearch(query, type);
  }
  return literalSearch(query, type);
}

async function literalSearch(query: string, type: SearchType) {
  const results: SearchResult[] = [];

  if (type === "quran" || type === "all") {
    const ayahResults = await searchAyahs(query);
    for (const ayah of ayahResults) {
      results.push({
        type: "quran",
        id: ayah.id,
        title: `${ayah.surahNameAr} - سورة ${ayah.surahNumber}`,
        subtitle: `الآية ${ayah.numberInSurah}`,
        text: ayah.textUthmani,
        snippet: ayah.snippet ?? null,
        rank: ayah.rank,
        surahName: ayah.surahNameAr,
        surahNumber: ayah.surahNumber,
        verseNumber: ayah.numberInSurah,
      });
    }
  }

  if (type === "hadith" || type === "all") {
    const hadithResults = await searchHadiths(query);
    for (const hadith of hadithResults) {
      results.push({
        type: "hadith",
        id: hadith.id,
        title: hadith.bookNameAr,
        subtitle: `حديث رقم ${hadith.number}${hadith.narrator ? ` - ${hadith.narrator}` : ""}`,
        text: hadith.text,
        snippet: hadith.snippet ?? null,
        rank: hadith.rank,
        bookNameAr: hadith.bookNameAr,
        bookSlug: hadith.bookSlug,
        hadithNumber: hadith.number,
        narrator: hadith.narrator ?? undefined,
      });
    }
  }

  return results.sort((a, b) => b.rank - a.rank);
}

/**
 * Calculate trigram-like similarity between two Arabic strings in JS.
 * Simple character n-gram approach for theme name matching.
 */
function jsSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const strippedA = ArabicServices.removeTashkeel(a).toLowerCase();
  const strippedB = ArabicServices.removeTashkeel(b).toLowerCase();

  if (strippedA === strippedB) return 1;
  if (strippedA.includes(strippedB) || strippedB.includes(strippedA)) return 0.8;

  // Bigram overlap
  const getBigrams = (s: string): Set<string> => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.add(s.substring(i, i + 2));
    }
    return bigrams;
  };

  const bigramsA = getBigrams(strippedA);
  const bigramsB = getBigrams(strippedB);

  let overlap = 0;
  for (const bg of bigramsA) {
    if (bigramsB.has(bg)) overlap++;
  }

  const total = Math.max(bigramsA.size, bigramsB.size);
  return total === 0 ? 0 : overlap / total;
}

async function thematicSearch(query: string, type: SearchType) {
  const results: SearchResult[] = [];

  // Get all published themes
  const allThemes = await getAllThemes();

  // Check if query matches any theme name (using trigram-like similarity)
  const matchingThemes = allThemes.filter((theme) => {
    const sim = Math.max(
      jsSimilarity(theme.nameAr, query),
      jsSimilarity(theme.nameEn, query)
    );
    return sim > 0.3;
  });

  // Add curated results from matching themes
  for (const theme of matchingThemes) {
    const themeWithContent = await getThemeBySlug(theme.slug);
    if (!themeWithContent) continue;

    // Add ayahs from this theme
    if (type === "quran" || type === "all") {
      for (const ayah of themeWithContent.ayahs) {
        results.push({
          type: "quran",
          id: ayah.ayahId,
          title: `${ayah.surahName} - سورة ${ayah.surahNumber}`,
          subtitle: `الآية ${ayah.numberInSurah}`,
          text: ayah.textUthmani,
          snippet: null,
          rank: 1000, // High rank for curated results
          surahName: ayah.surahName,
          surahNumber: ayah.surahNumber,
          verseNumber: ayah.numberInSurah,
          themeSlug: theme.slug,
          themeName: theme.nameAr,
          isCurated: true,
        });
      }
    }

    // Add hadiths from this theme
    if (type === "hadith" || type === "all") {
      for (const hadith of themeWithContent.hadiths) {
        results.push({
          type: "hadith",
          id: hadith.hadithId,
          title: hadith.bookNameAr,
          subtitle: `حديث رقم ${hadith.hadithNumber}${hadith.narrator ? ` - ${hadith.narrator}` : ""}`,
          text: hadith.text,
          snippet: null,
          rank: 1000, // High rank for curated results
          bookNameAr: hadith.bookNameAr,
          hadithNumber: hadith.hadithNumber,
          narrator: hadith.narrator ?? undefined,
          themeSlug: theme.slug,
          themeName: theme.nameAr,
          isCurated: true,
        });
      }
    }
  }

  // Also run literal search for additional results
  const literalResults = await literalSearch(query, type);
  
  // Merge results: curated first, then literal (excluding duplicates)
  const curatedIds = new Set(results.map((r) => `${r.type}-${r.id}`));
  
  for (const literalResult of literalResults) {
    const id = `${literalResult.type}-${literalResult.id}`;
    if (!curatedIds.has(id)) {
      results.push(literalResult);
    }
  }

  return results.sort((a, b) => b.rank - a.rank);
}

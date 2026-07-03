import {
  search,
  loadQuranData,
  loadMorphology,
  loadWordMap,
  LRUCache,
  type SearchResponse,
  type QuranText,
} from "quran-search-engine";

// ponytail: singleton — loaded once per process, reused across all requests
type Engine = {
  quranData: Map<number, QuranText>;
  morphologyMap: Map<number, import("quran-search-engine").MorphologyAya>;
  wordMap: import("quran-search-engine").WordMap;
  cache: LRUCache<string, SearchResponse<QuranText>>;
};

let engine: Engine | null = null;

async function getEngine(): Promise<Engine> {
  if (engine) return engine;

  const [quranData, morphologyMap, wordMap] = await Promise.all([
    loadQuranData(),
    loadMorphology(),
    loadWordMap(),
  ]);

  engine = {
    quranData,
    morphologyMap,
    wordMap,
    cache: new LRUCache<string, SearchResponse<QuranText>>(100),
  };

  return engine;
}

export interface AyahSearchResult {
  id: number;
  textUthmani: string;
  numberInSurah: number;
  surahNameAr: string;
  surahNumber: number;
  rank: number;
  snippet: string | null;
}

// ponytail: engine text uses extended Arabic diacritics (U+08F0-08F2) that the
// KFGQPC Uthmanic font doesn't support — map to standard equivalents so text matches
// the verse detail pages (which use DB data with standard chars).
function normalizeEngineText(text: string): string {
  return text
    .replace(/\u08F0/g, "\u064B") // open fathatan → fathatan
    .replace(/\u08F1/g, "\u064C") // open dammatan → dammatan
    .replace(/\u08F2/g, "\u064D") // open kasratan → kasratan
    .replace(/\u0305/g, "\u0670"); // combining overline → superscript alef
}

export async function searchQuranAyahs(
  query: string,
): Promise<AyahSearchResult[]> {
  if (!query.trim()) return [];

  const { quranData, morphologyMap, wordMap, cache } = await getEngine();

  const response = search(
    query.trim(),
    { quranData, morphologyMap, wordMap },
    { lemma: true, root: true },
    { page: 1, limit: 50 },
    undefined,
    cache,
  );

  return response.results.map((v) => ({
    id: v.gid,
    textUthmani: normalizeEngineText(v.uthmani),
    numberInSurah: v.aya_id,
    surahNameAr: v.sura_name,
    surahNumber: v.sura_id,
    rank: v.matchScore,
    snippet: null,
  }));
}

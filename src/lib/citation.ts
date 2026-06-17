/**
 * Strips Arabic diacritics (tashkeel) from text.
 */
export function stripDiacritics(text: string): string {
  return text.replace(
    /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g,
    "",
  );
}

export function formatVerseCitation(
  verseText: string,
  surahName: string,
  verseNumber: number,
): string {
  return `${verseText} ﴿${surahName}: ${verseNumber}﴾`;
}

export function formatHadithCitation(
  hadithText: string,
  bookName: string,
  hadithNumber: number,
  narrator?: string | null,
): string {
  let citation = `${hadithText}\n${bookName}، حديث رقم ${hadithNumber}`;
  if (narrator) {
    citation += `، عن ${narrator}`;
  }
  return citation;
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const [bare, indexMap] = stripDiacriticsWithMap(text);
  const words = query.split(/\s+/).filter(Boolean);

  // Collect all match ranges in bare-text coordinates
  const ranges: [number, number][] = [];
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    let m: RegExpExecArray | null;
    while ((m = regex.exec(bare)) !== null) {
      ranges.push([m.index, m.index + m[0].length]);
    }
  }

  if (ranges.length === 0) return text;

  // Sort by start, then by end descending (longer first)
  ranges.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

  // Merge overlapping ranges
  const merged: [number, number][] = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i][0] <= last[1]) {
      last[1] = Math.max(last[1], ranges[i][1]);
    } else {
      merged.push(ranges[i]);
    }
  }

  // Build result: map bare ranges → original positions, wrap in <mark>
  let result = "";
  let bareIdx = 0;

  for (const [start, end] of merged) {
    // Text before this match
    result += text.slice(
      bareIdx < indexMap.length ? indexMap[bareIdx] : text.length,
      indexMap[start],
    );
    // Matched text (original, with diacritics)
    const matchEnd = end <= indexMap.length ? indexMap[end] : text.length;
    result += `<mark>${text.slice(indexMap[start], matchEnd)}</mark>`;
    bareIdx = end;
  }

  // Trailing text after last match
  if (bareIdx < indexMap.length) {
    result += text.slice(indexMap[bareIdx]);
  }

  return result;
}

/**
 * Strips Arabic diacritics (tashkeel) and builds an index map back to original positions.
 */
function stripDiacriticsWithMap(text: string): [string, number[]] {
  const diacriticRegex =
    /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/;
  const bareChars: string[] = [];
  const indexMap: number[] = [];

  for (let i = 0; i < text.length; i++) {
    if (!diacriticRegex.test(text[i])) {
      bareChars.push(text[i]);
      indexMap.push(i);
    }
  }

  return [bareChars.join(""), indexMap];
}

/**
 * Transition patterns that mark the handoff from sanad (chain) to matn (content).
 * Each pattern is a regex matched against diacritic-stripped text.
 * We take the LAST match across all patterns (closest to the actual matn).
 *
 * After stripping diacritics: النَّبِيُّ → النبي, رَسُولُ اللَّهِ → رسول الله,
 * صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ → صلى الله عليه وسلم
 */
const TRANSITION_PATTERNS: RegExp[] = [
  // قال/يقول رسول الله (optional salawat)?
  /(?:قال|يقول)\s+رسول\s+الله\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?\s*:?/g,
  // عن/أن النبي (optional salawat)? قال
  /(?:عن|أن)\s+النبي\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?\s*قال\s*:?/g,
  // salawat then قال/يقول
  /(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)\s*(?:قال|يقول)\s*:?/g,
  // سمعت رسول الله (optional salawat)? يقول
  /سمعت\s+رسول\s+الله\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?\s*يقول\s*:?/g,
  // قال/يقول النبي (optional salawat)?
  /(?:قال|يقول)\s+النبي\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?\s*:?/g,
  // كان رسول الله/النبي (optional salawat)?
  /كان\s+(?:رسول\s+الله|النبي)\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?/g,
  // عن/أن رسول الله (optional salawat)? قال
  /(?:عن|أن)\s+رسول\s+الله\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?\s*قال\s*:?/g,
  // نهى رسول الله/النبي
  /نهى\s+(?:رسول\s+الله|النبي)\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?/g,
  // بلغ النبي/رسول الله
  /بلغ\s+(?:رسول\s+الله|النبي)\s*(?:صل\S+\s+الله\s+عليه\s+وسلم|صلعم|ﷺ)?/g,
];

/**
 * Splits an Arabic hadith text into sanad (chain of narrators) and matn (hadith content).
 * Strips diacritics for pattern matching, takes the LAST Prophet-mention match
 * across all transition patterns, and maps the split back to the original text.
 */
export function separateSanadAndMatn(text: string | null): {
  sanad: string;
  matn: string;
} {
  if (!text) return { sanad: "", matn: "" };

  const trimmed = text.trim();
  const [bare, indexMap] = stripDiacriticsWithMap(trimmed);

  let bestEndBare: number | null = null;

  for (const pattern of TRANSITION_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(bare)) !== null) {
      if (bestEndBare === null || m.index + m[0].length > bestEndBare) {
        bestEndBare = m.index + m[0].length;
      }
    }
  }

  if (bestEndBare !== null) {
    const origEnd =
      bestEndBare >= indexMap.length ? trimmed.length : indexMap[bestEndBare];

    const sanad = trimmed.slice(0, origEnd).trim();
    const matn = trimmed
      .slice(origEnd)
      .replace(/^[\s:\u061B،,]+/, "")
      .trim();
    return { sanad, matn };
  }

  // Fallback 1: explicit quote marks "..."
  const firstQuoteIdx = trimmed.indexOf('"');
  if (firstQuoteIdx !== -1) {
    return {
      sanad: trimmed.slice(0, firstQuoteIdx).trim(),
      matn: trimmed.slice(firstQuoteIdx).trim(),
    };
  }

  // Fallback 2: last "قَالَ" before content (skip chain patterns)
  const lastQalIdx = trimmed.lastIndexOf("قَالَ");
  if (lastQalIdx > 5) {
    const afterQal = trimmed.slice(lastQalIdx + "قَالَ".length).trim();
    if (afterQal.length > 3 && !afterQal.startsWith("حَدَّثَ")) {
      return {
        sanad: trimmed.slice(0, lastQalIdx + "قَالَ".length).trim(),
        matn: afterQal,
      };
    }
  }

  // Fallback 3: last "، أَنْ" introducing content
  const lastAnIdx = trimmed.lastIndexOf("، أَنْ");
  if (lastAnIdx > 20) {
    return {
      sanad: trimmed.slice(0, lastAnIdx + 1).trim(),
      matn: trimmed.slice(lastAnIdx + 1).trim(),
    };
  }

  // Fallback: entire text is sanad
  return { sanad: trimmed, matn: "" };
}

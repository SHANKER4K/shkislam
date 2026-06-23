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

  // Build result: map bare ranges -> original positions, wrap in <mark>
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

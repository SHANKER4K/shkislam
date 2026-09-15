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

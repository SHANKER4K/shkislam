export const SITE_URL = "https://shkislam.vercel.app";
export const SITE_NAME = "SHK Islam";

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export function verseTitle(surahNameAr: string, verseNumber: number): string {
  return `تفسير الآية ${verseNumber} - سورة ${surahNameAr} | ${SITE_NAME}`;
}

export function hadithTitle(bookNameAr: string, hadithNumber: number): string {
  return `حديث رقم ${hadithNumber} - ${bookNameAr} | ${SITE_NAME}`;
}

export function themeTitle(nameAr: string): string {
  return `${nameAr} | ${SITE_NAME}`;
}

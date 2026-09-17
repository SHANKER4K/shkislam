export const COLLECTIONS = [
  "quran",
  "hadith",
  "tafsir",
  "books",
  "sunnah",
] as const;

export type Collection = (typeof COLLECTIONS)[number];

export const COLLECTION_LABELS: Record<Collection, string> = {
  quran: "القرآن الكريم",
  hadith: "الحديث النبوي",
  tafsir: "التفسير",
  books: "الكتب",
  sunnah: "السنة والآثار",
};

export const FILTER_SCHEMA: Record<
  Collection,
  Record<string, "int" | "str">
> = {
  quran: { surah_number: "int", surah: "str" },
  hadith: { book: "str", grade: "str" },
  tafsir: { surah_number: "int", surah: "str", ayah_number: "int" },
  books: {
    book_id: "int",
    book_name: "str",
    category_name: "str",
    all_authors: "str",
    author_death: "int",
    book_date: "int",
  },
  sunnah: {
    book_id: "int",
    book_name: "str",
    category_name: "str",
    all_authors: "str",
    author_death: "int",
    book_date: "int",
    athar_number: "int",
  },
};

export const DISPLAY_FIELDS: Record<
  Collection,
  { key: string; label: string }[]
> = {
  quran: [
    { key: "surah", label: "السورة" },
    { key: "ayah_number", label: "رقم الآية" },
  ],
  hadith: [
    { key: "book", label: "الكتاب" },
    { key: "hadith_number", label: "رقم الحديث" },
    { key: "grade", label: "الدرجة" },
  ],
  tafsir: [
    { key: "tafsir_book", label: "كتاب التفسير" },
    { key: "surah", label: "السورة" },
    { key: "ayah_number", label: "رقم الآية" },
    { key: "source", label: "المصدر" },
  ],
  books: [
    { key: "book_name", label: "الكتاب" },
    { key: "category_name", label: "التصنيف" },
    { key: "all_authors", label: "المؤلف" },
    { key: "page", label: "الصفحة" },
  ],
  sunnah: [
    { key: "book_name", label: "الكتاب" },
    { key: "category_name", label: "التصنيف" },
    { key: "all_authors", label: "المؤلف" },
    { key: "page", label: "الصفحة" },
    { key: "source", label: "المصدر" },
  ],
};

export function buildFiltersPayload(
  collection: Collection,
  raw: Record<string, string>,
): Record<string, string | number> {
  const schema = FILTER_SCHEMA[collection];
  const out: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (!(key in schema) || value.trim() === "") continue;
    out[key] = schema[key] === "int" ? Number(value) : value.trim();
  }

  return out;
}

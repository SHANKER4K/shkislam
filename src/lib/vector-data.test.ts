import { expect, test } from "bun:test";
import { buildFiltersPayload } from "./vector-data";

test("buildFiltersPayload drops unknown/empty values and coerces int keys", () => {
  expect(
    buildFiltersPayload("quran", { surah: "الفاتحة", surah_number: "7", bogus: "x", empty: "  " })
  ).toEqual({ surah: "الفاتحة", surah_number: 7 });
  expect(buildFiltersPayload("hadith", { book: "", grade: "صحيح" })).toEqual({ grade: "صحيح" });
});

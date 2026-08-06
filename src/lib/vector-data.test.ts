import { expect, test } from "bun:test";
import { buildFiltersPayload, buildSearchUrl } from "./vector-data";

test("buildFiltersPayload drops unknown/empty values and coerces int keys", () => {
  expect(
    buildFiltersPayload("quran", { surah: "الفاتحة", surah_number: "7", bogus: "x", empty: "  " })
  ).toEqual({ surah: "الفاتحة", surah_number: 7 });
  expect(buildFiltersPayload("hadith", { book: "", grade: "صحيح" })).toEqual({ grade: "صحيح" });
});

test("buildSearchUrl sets params; pool only for hybrid; filters as JSON", () => {
  const hybrid = buildSearchUrl("hybrid", {
    collection: "quran",
    query_text: "نور",
    top_k: 5,
    pool: 50,
    filters: { surah_number: { gte: 2 } },
  });
  expect(hybrid).toContain("http://localhost:8000/hybrid_search");
  expect(hybrid).toContain("collection=quran");
  expect(hybrid).toContain("query_text=" + encodeURIComponent("نور"));
  expect(hybrid).toContain("top_k=5");
  expect(hybrid).toContain("pool=50");
  expect(hybrid).toContain("filters=" + encodeURIComponent(JSON.stringify({ surah_number: { gte: 2 } })));

  const dense = buildSearchUrl("dense", {
    collection: "hadith", query_text: "x", top_k: 10, pool: 50, filters: {},
  });
  expect(dense).not.toContain("pool=");
  expect(dense).not.toContain("filters=");
});

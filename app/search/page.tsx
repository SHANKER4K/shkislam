import type { Metadata } from "next";
import { GlobalSearchBar } from "@/src/components/global-search-bar";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-8">
        <GlobalSearchBar initialQuery={q || ""} initialType={type || "all"} />
      </div>

      {q && (
        <div className="max-w-3xl mx-auto">
          <h2 className="font-arabic text-xl font-semibold mb-4">
            نتائج البحث عن: {q}
          </h2>
          <SearchResults query={q} initialType={type || "all"} />
        </div>
      )}
    </main>
  );
}

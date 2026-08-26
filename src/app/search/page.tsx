import type { Metadata } from "next";
import { VectorSearchTool } from "./vector-search";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">البحث المتجه</h1>
        <VectorSearchTool />
      </div>
    </main>
  );
}

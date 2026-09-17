import type { Metadata } from "next";
import { VectorSearchTool } from "./vector-search";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8 max-w-2xl">
          <h1 className="font-arabic text-3xl font-bold text-foreground md:text-4xl">
            ابحث في المكتبة
          </h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            ابحث في القرآن والحديث والتفسير والكتب من مكان واحد.
          </p>
        </header>
        <VectorSearchTool />
      </div>
    </main>
  );
}

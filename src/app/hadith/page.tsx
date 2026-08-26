import type { Metadata } from "next";
import { getAllBooks } from "@/lib/hadith";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "الأحاديث النبوية",
  description:
    "تصفّح الأحاديث النبوية الصحيحة من صحيح البخاري وصحيح مسلم.",
};

export default async function HadithPage() {
  const books = await getAllBooks();

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: "الأحاديث النبوية" }]} />

      <div className="mt-6 mb-10">
        <p className="text-xs text-muted-foreground font-medium mb-1">كتب السنة</p>
        <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          الأحاديث النبوية
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {books.map((book) => (
          <Link key={book.id} href={`/hadith/${book.slug}`}>
            <div className="bg-card rounded-xl p-8 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer h-full flex flex-col items-start gap-4">
              <div className="size-14 rounded-lg bg-muted flex items-center justify-center">
                <BookMarked className="size-7 text-primary stroke-[1.5]" />
              </div>
              <div>
                <h2 className="font-arabic text-2xl font-bold text-foreground">{book.nameAr}</h2>
                <p className="text-sm text-muted-foreground mt-1">{book.nameEn}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

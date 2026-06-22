import type { Metadata } from "next";
import { getAllBooks } from "@/src/lib/hadith";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookMarked } from "lucide-react";
import { Breadcrumbs } from "@/src/components/breadcrumbs";

export const metadata: Metadata = {
  title: "الأحاديث النبوية",
  description:
    "تصفّح الأحاديث النبوية الصحيحة من صحيح البخاري وصحيح مسلم.",
};

export default async function HadithPage() {
  const books = await getAllBooks();

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "الأحاديث النبوية" }]} />
        <h1 className="font-arabic text-3xl font-bold mb-6 text-center">
          الأحاديث النبوية
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {books.map((book) => (
            <Link key={book.id} href={`/hadith/${book.slug}`}>
              <Card className="card-hover hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookMarked className="size-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-arabic text-xl font-semibold">{book.nameAr}</h2>
                    <p className="text-sm text-muted-foreground">{book.nameEn}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
  );
}

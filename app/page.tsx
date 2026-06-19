import type { Metadata } from "next";
import { GlobalSearchBar } from "@/src/components/global-search-bar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BookMarked } from "lucide-react";
import { SITE_URL } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "SHK Islam - منصة إسلامية للدعاة والخطباء",
  description:
    "منصة إسلامية متخصصة لطلاب العلم والدعاة والخطباء. تصفّح القرآن الكريم مع التفسير، والأحاديث النبوية الصحيحة، ومواضيع إسلامية متنوعة.",
  openGraph: {
    title: "SHK Islam - منصة إسلامية للدعاة والخطباء",
    description:
      "منصة إسلامية متخصصة لطلاب العلم والدعاة والخطباء. تصفّح القرآن الكريم مع التفسير، والأحاديث النبوية الصحيحة.",
    url: SITE_URL,
    siteName: "SHK Islam",
    images: ["/assets/logo.png"],
    locale: "ar",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-arabic text-4xl md:text-5xl font-bold mb-4">
            SHK Islam
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            منصة إسلامية متخصصة لطلاب العلم والدعاة والخطباء
          </p>
        </div>

        <div className="mb-16">
          <GlobalSearchBar showTabs />
        </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/quran">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="size-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-arabic text-xl font-semibold">القرآن الكريم</h2>
                    <p className="text-sm text-muted-foreground">
                      تصفّح 114 سورة مع التفسير
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/hadith">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookMarked className="size-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-arabic text-xl font-semibold">الأحاديث النبوية</h2>
                    <p className="text-sm text-muted-foreground">
                      صحيح البخاري ومسلم
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
  );
}

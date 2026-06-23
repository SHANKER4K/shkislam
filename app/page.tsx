import type { Metadata } from "next";
import { GlobalSearchBar } from "@/src/components/global-search-bar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BookMarked, Library } from "lucide-react";
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
      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="text-center mb-10">
          <h1 className="font-arabic text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
            SHK Islam
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            منصة إسلامية متخصصة لطلاب العلم والدعاة والخطباء
          </p>
        </div>
        <div className="mb-8 md:mb-12">
          <GlobalSearchBar showTabs />
        </div>
      </section>

      {/* Bentō grid — ponytail: CSS grid with varied spans, no JS layout lib */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Quran — large card spanning 2 cols */}
          <Link href="/quran" className="md:col-span-2 group">
            <Card className="card-hover border-border/60 h-full cursor-pointer overflow-hidden relative">
              {/* Top accent bar */}
              <div className="h-1 bg-primary/20" />
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-5">
                  <div className="size-14 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
                    <BookOpen className="size-7 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-arabic text-2xl font-bold mb-1.5">القرآن الكريم</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      تصفّح 114 سورة مع التفسير الميسر والنص العثماني
                    </p>
                    <span className="text-xs font-medium text-primary/70 group-hover:text-primary transition-colors inline-flex items-center gap-1">
                      تصفّح السور
                      <span className="text-lg leading-none">←</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Hadith — right side */}
          <Link href="/hadith" className="group">
            <Card className="border-border/60 h-full cursor-pointer overflow-hidden">
              <div className="h-1 bg-secondary/40" />
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-start gap-4">
                  <div className="size-14 rounded-xl bg-secondary/30 flex items-center justify-center shrink-0 ring-1 ring-border">
                    <BookMarked className="size-7 text-foreground/80" />
                  </div>
                  <div>
                    <h2 className="font-arabic text-xl font-bold mb-1.5">الأحاديث النبوية</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      صحيح البخاري ومسلم
                    </p>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                      تصفّح الأحاديث
                      <span className="text-lg leading-none">←</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Themes — full width on mobile, third column on desktop */}
          <Link href="/themes" className="md:col-start-1 group">
            <Card className="border-border/60 h-full cursor-pointer overflow-hidden">
              <div className="h-1 bg-accent/40" />
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-start gap-4">
                  <div className="size-14 rounded-xl bg-accent/30 flex items-center justify-center shrink-0 ring-1 ring-border">
                    <Library className="size-7 text-foreground/80" />
                  </div>
                  <div>
                    <h2 className="font-arabic text-xl font-bold mb-1.5">المواضيع</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      مواضيع إسلامية متنوعة مع نصوص من القرآن والسنة
                    </p>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                      استعرض المواضيع
                      <span className="text-lg leading-none">←</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Quick search hint — right side */}
          <div className="md:col-span-2 md:col-start-2 group">
            <Card className="border-dashed border-border/40 bg-muted/30 h-full">
              <CardContent className="p-6 md:p-8 text-center">
                <p className="text-sm text-muted-foreground/70 font-arabic">
                  ابحث في القرآن والأحاديث — تجد الآيات والأحاديث المتعلقة بموضوعك
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

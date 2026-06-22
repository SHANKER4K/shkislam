import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getAllThemes } from "@/src/lib/themes";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "المواضيع",
  description: "تصفح المواضيع الإسلامية المتنوعة مع نصوص من القرآن الكريم والسنة النبوية.",
};

export default async function ThemesPage() {
  const themes = await getAllThemes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-arabic mb-2">المواضيع</h1>
        <p className="text-muted-foreground font-arabic">
          مواضيع إسلامية متنوعة مع نصوص من القرآن الكريم والسنة النبوية
        </p>
      </div>

      {themes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-arabic">
          لا توجد مواضيع متاحة حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <Link key={theme.id} href={`/themes/${theme.slug}`}>
              <Card className="card-hover hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold font-arabic mb-2">
                    {theme.nameAr}
                  </h2>
                  <p className="text-sm text-muted-foreground font-arabic mb-3">
                    {theme.nameEn}
                  </p>
                  {theme.description && (
                    <p className="text-sm text-muted-foreground font-arabic line-clamp-2">
                      {theme.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="size-4" />
                    <span className="font-arabic">تصفح الموضوع</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

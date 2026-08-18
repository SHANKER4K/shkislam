import Link from "next/link";
import { getAllThemes } from "@/src/lib/themes";

export const metadata = {
  title: "المواضيع",
  description: "تصفح المواضيع الإسلامية المتنوعة مع نصوص من القرآن الكريم والسنة النبوية.",
};

export default async function ThemesPage() {
  const themes = await getAllThemes();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          المواضيع
        </h1>
        <p className="text-muted-foreground font-arabic mt-2">
          مواضيع إسلامية متنوعة مع نصوص من القرآن الكريم والسنة النبوية
        </p>
      </div>

      {themes.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground font-arabic">
          لا توجد مواضيع متاحة حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme, index) => (
            <Link key={theme.id} href={`/themes/${theme.slug}`} className={index === 0 && themes.length >= 4 ? "lg:col-span-2" : ""}>
              <div className="bg-card rounded-xl p-6 border-t-2 border-primary/20 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer h-full">
                <span className="text-[40px] text-muted-foreground/10 font-arabic leading-none block mb-2">
                  {theme.nameAr.charAt(0)}
                </span>
                <h2 className="text-xl font-bold font-arabic mb-2 text-foreground">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

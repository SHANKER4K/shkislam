import type { Metadata } from "next";
import { BookOpen, BookMarked } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "عن المنصة",
  description:
    "تعرف على منصة SHK Islam، مصادر البيانات، ومنهجية المراجعة العلمية.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: "عن المنصة" }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          عن المنصة
        </h1>
        <p className="text-muted-foreground font-arabic leading-relaxed max-w-[65ch]">
          منصة SHK Islam هي منصة إسلامية متخصصة موجهة لطلاب العلم والدعاة
          والخطباء. توفر المنصة نصوص القرآن الكريم مع التفسير الميسر،
          والأحاديث النبوية الصحيحة من كتب موثوقة، فضلاً عن مواضيع إسلامية
          متنوعة تجمع الآيات والأحاديث في سياق واحد.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="font-arabic text-2xl font-bold mb-4">مصادر البيانات</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-6 border border-transparent hover:border-border transition-all duration-150">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <BookOpen className="size-5 text-primary stroke-[1.5]" />
            </div>
            <h3 className="font-arabic font-bold text-foreground mb-1">القرآن الكريم</h3>
            <p className="text-sm text-muted-foreground font-arabic leading-relaxed">
              النصوص القرآنية مأخوذة من خادم القرآن API (quran.com)، وتشمل النص العثماني والتفسير الميسر.
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-transparent hover:border-border transition-all duration-150">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <BookMarked className="size-5 text-primary stroke-[1.5]" />
            </div>
            <h3 className="font-arabic font-bold text-foreground mb-1">الأحاديث النبوية</h3>
            <p className="text-sm text-muted-foreground font-arabic leading-relaxed">
              الأحاديث مأخوذة من خادم الحديث API (hadeethenc.com)، وتشمل صحيح البخاري وصحيح مسلم.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-t border-border">
        <p className="text-center text-muted-foreground font-arabic text-sm">
          SHK Islam — مصدر موثوق لطلاب العلم والدعاة
        </p>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { Breadcrumbs } from "@/src/components/breadcrumbs";

export const metadata: Metadata = {
  title: "عن المنصة",
  description:
    "تعرف على منصة SHK Islam، مصادر البيانات، ومنهجية المراجعة العلمية.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Breadcrumbs items={[{ label: "عن المنصة" }]} />
          <h1 className="font-arabic text-3xl font-bold mb-4">عن المنصة</h1>
          <p className="text-muted-foreground font-arabic leading-relaxed">
            منصة SHK Islam هي منصة إسلامية متخصصة موجهة لطلاب العلم والدعاة
            والخطباء. توفر المنصة نصوص القرآن الكريم مع التفسير الميسر،
            والأحاديث النبوية الصحيحة من كتب موثوقة، فضلاً عن مواضيع إسلامية
            متنوعة تجمع الآيات والأحاديث في سياق واحد.
          </p>
        </div>

        <section>
          <h2 className="font-arabic text-2xl font-bold mb-3">مصادر البيانات</h2>
          <ul className="space-y-2 text-muted-foreground font-arabic">
            <li>
              <strong>القرآن الكريم:</strong> النصوط القرآنية مأخوذة من خادم
              القرآن API (quran.com)، وتشمل النص العثماني والتفسير الميسر.
            </li>
            <li>
              <strong>الأحاديث النبوية:</strong> الأحاديث مأخوذة من خادم الحديث
              API (hadeethenc.com)، وتشمل صحيح البخاري وصحيح مسلم.
            </li>
          </ul>
        </section>
{/* 
        <section>
          <h2 className="font-arabic text-2xl font-bold mb-3">منهجية المراجعة</h2>
          <p className="text-muted-foreground font-arabic leading-relaxed">
            تتم مراجعة النصوص علمياً لضمان الدقة والمطابقة للمصادر الأصلية.
            placeholder: reviewer credentials to be added by user
          </p>
        </section> */}
        
      </div>
    </main>
  );
}

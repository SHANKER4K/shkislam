import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            الرئيسية
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronLeft className="size-3 shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

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
          <Link href="/" className="hover:text-foreground transition-colors px-2 py-0.5 rounded-full hover:bg-muted">
            الرئيسية
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronLeft className="size-3 shrink-0 text-muted-foreground/50" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors px-2 py-0.5 rounded-full hover:bg-muted">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium px-2 py-0.5">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

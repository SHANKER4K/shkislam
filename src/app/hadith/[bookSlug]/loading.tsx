import { Skeleton } from "@/components/ui/skeleton";

export default function HadithBookLoading() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-32 mb-6" />

      <div className="text-center mb-8">
        <Skeleton className="h-9 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>

      <div className="max-w-3xl mx-auto space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function QuranLoading() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <Skeleton className="h-9 w-48 mx-auto mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

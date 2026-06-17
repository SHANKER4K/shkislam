import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function VerseDetailLoading() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <Skeleton className="h-7 w-40 mx-auto mb-1" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6 mx-auto" />
            <div className="border-t pt-4 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="border-t pt-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

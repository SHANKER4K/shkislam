import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function HadithDetailLoading() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-40 mb-6" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <Skeleton className="h-7 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto mt-1" />
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="border-t pt-4 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-[144px]">
      {/* Hero skeleton */}
      <div className="w-full min-h-[50vh] flex items-end justify-center pb-12 md:pb-24 px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-16 md:h-24 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-full shrink-0" />
          </div>
        </div>
      </div>
      {/* Tabs skeleton */}
      <div className="py-8 md:py-12 px-4 md:px-6 flex justify-center">
        <Skeleton className="h-11 w-96 rounded-full" />
      </div>
      {/* Content + sidebar skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-15">
          <div className="lg:col-span-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="break-inside-avoid space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6 pb-12 max-w-[1920px] mx-auto">
        {/* Header skeleton */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Featured creators skeleton */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="break-inside-avoid space-y-3">
              <Skeleton className="w-full rounded-sm" style={{ aspectRatio: i % 2 === 0 ? '3/4' : '4/3' }} />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

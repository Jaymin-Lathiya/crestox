"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ScrollImagesReveal from "../ScrollImagesReveal";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getVerifiedArtworks,
    type VerifiedArtwork,
    type VerifiedArtworkSort,
} from "@/apis/artwork/artworkActions";

const PAGE_SIZE = 20;

const ASPECT_CYCLE = [
    "aspect-[3/4]",
    "aspect-[1/1]",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[1/1]",
] as const;

function useColumns() {
    const [cols, setCols] = useState(4);
    useEffect(() => {
        const update = () => setCols(window.innerWidth < 768 ? 2 : 4);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return cols;
}

/** Masonry skeleton grid matching ScrollImagesReveal layout. */
function ArtworkGridSkeleton({
    count = 12,
    compact = false,
}: {
    count?: number;
    /** Tighter top padding when appending below existing artworks */
    compact?: boolean;
}) {
    const cols = useColumns();
    const columnStaggerY = cols === 2 ? 24 : 40;

    const columns = Array.from({ length: cols }, () => [] as string[]);
    Array.from({ length: count }, (_, i) => {
        columns[i % cols].push(ASPECT_CYCLE[i % ASPECT_CYCLE.length]);
    });

    return (
        <div
            className={`relative w-full overflow-hidden bg-background ${compact ? "pb-8" : "pb-24"}`}
            aria-busy="true"
            aria-label="Loading artworks"
        >
            <div className="relative w-full">
                <section className="relative flex justify-center">
                    <div
                        className={`relative flex w-full max-w-[1480px] mx-auto gap-6 md:gap-10 items-start ${
                            compact ? "pt-2 pb-8" : "py-20"
                        }`}
                    >
                        {columns.map((colItems, colIndex) => (
                            <div
                                key={colIndex}
                                className="flex flex-col gap-6 md:gap-10 flex-1 min-w-0"
                                style={{ marginTop: compact ? 0 : `${colIndex * columnStaggerY}px` }}
                            >
                                {colItems.map((aspect, rowIndex) => (
                                    <div key={rowIndex} className="w-full">
                                        <figure className="relative z-10 m-0">
                                            <div
                                                className={`relative ${aspect} w-full overflow-hidden rounded-xl bg-card/45 border border-border/40 shadow-2xl`}
                                            >
                                                <Skeleton className="absolute inset-0 w-full h-full opacity-60" />
                                            </div>
                                        </figure>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

interface ScrollRevealGridProps {
    sortBy?: VerifiedArtworkSort;
}

export default function ScrollRevealGrid({ sortBy = "relevance" }: ScrollRevealGridProps) {
    const [artworks, setArtworks] = useState<VerifiedArtwork[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isError, setIsError] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isFetchingRef = useRef(false);
    const nextCursorRef = useRef<number | null>(null);
    const hasMoreRef = useRef(true);

    useEffect(() => {
        nextCursorRef.current = nextCursor;
        hasMoreRef.current = hasMore;
    }, [nextCursor, hasMore]);

    const fetchPage = useCallback(
        async (opts: { cursor?: number | null; reset?: boolean }) => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            if (opts.reset) {
                setIsInitialLoading(true);
                setIsError(false);
            } else {
                setIsFetchingMore(true);
            }

            try {
                const page = await getVerifiedArtworks({
                    take: PAGE_SIZE,
                    cursor: opts.cursor ?? undefined,
                    sort: sortBy,
                })();

                if (opts.reset) {
                    setArtworks(page.list);
                } else {
                    setArtworks((prev) => {
                        const seen = new Set(prev.map((a) => a.artwork_id));
                        const fresh = page.list.filter((a) => !seen.has(a.artwork_id));
                        return [...prev, ...fresh];
                    });
                }

                setNextCursor(page.next_cursor);
                setHasMore(page.next_cursor != null);
            } catch (error) {
                console.error("Failed to fetch verified artworks", error);
                setIsError(true);
                if (opts.reset) {
                    setArtworks([]);
                    setHasMore(false);
                    setNextCursor(null);
                }
            } finally {
                isFetchingRef.current = false;
                setIsInitialLoading(false);
                setIsFetchingMore(false);
            }
        },
        [sortBy]
    );

    useEffect(() => {
        setArtworks([]);
        setNextCursor(null);
        setHasMore(true);
        nextCursorRef.current = null;
        hasMoreRef.current = true;
        fetchPage({ reset: true });
    }, [fetchPage]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) return;
                if (!hasMoreRef.current || isFetchingRef.current) return;
                if (nextCursorRef.current == null) return;

                fetchPage({ cursor: nextCursorRef.current });
            },
            { root: null, rootMargin: "400px 0px", threshold: 0 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [fetchPage, isInitialLoading]);

    // After skeletons appear/disappear below the grid, remasure scroll triggers.
    useEffect(() => {
        if (isInitialLoading) return;
        const id = requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("crestox:explore-layout"));
        });
        return () => cancelAnimationFrame(id);
    }, [isFetchingMore, isInitialLoading]);

    if (!isInitialLoading && artworks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] bg-background text-muted-foreground font-serif text-center px-6 py-20">
                <p className="text-2xl md:text-3xl">
                    {isError ? "Couldn't load artworks" : "Not any verified artwork yet"}
                </p>
                {isError && (
                    <p className="mt-3 text-sm font-sans">
                        Something went wrong while loading the gallery. Please try again later.
                    </p>
                )}
            </div>
        );
    }

    return (
        <>
            {isInitialLoading ? (
                <ArtworkGridSkeleton count={PAGE_SIZE} />
            ) : (
                artworks.length > 0 && (
                    <ScrollImagesReveal bgClass="bg-background" artworks={artworks} />
                )
            )}

            {/* Sentinel for infinite scroll — only fetches when visible and hasMore */}
            <div ref={loadMoreRef} className="w-full h-1" aria-hidden />

            {isFetchingMore && <ArtworkGridSkeleton count={PAGE_SIZE} compact />}

            {!isInitialLoading && !hasMore && artworks.length > 0 && !isFetchingMore && (
                <p className="text-center text-muted-foreground text-xs font-mono uppercase tracking-widest py-6">
                    End of gallery
                </p>
            )}
        </>
    );
}

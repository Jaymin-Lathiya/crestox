import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";
import ScrollImagesReveal, { ASPECT_RATIOS, ImageOrientation } from "../ScrollImagesReveal";

import { cn } from "@/lib/utils";
import instance from "@/utils/apiCalls";
import { Skeleton } from "@/components/ui/skeleton";

const COLS = 5;
const ROWS = 3;
const TOTAL = COLS * ROWS; // 15

/**
 * Pyramid Y offset: center columns sit high, edges are pushed far down.
 */
function getColumnOffset(col: number): number {
    const center = (COLS - 1) / 2; // 2
    const distance = Math.abs(col - center);
    return distance * distance * 55;
}

// Add this hook
import { useEffect, useState } from "react";

function useColumns() {
    const [cols, setCols] = useState(5);
    useEffect(() => {
        const update = () => setCols(window.innerWidth < 768 ? 2 : 5);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return cols;
}

/**
 * Center columns are slightly larger in the scattered state.
 */
function getColumnScale(col: number): number {
    const center = (COLS - 1) / 2;
    const distance = Math.abs(col - center);
    return 1 - distance * 0.04;
}

/**
 * Each subsequent row is pushed further down in the scattered state.
 */
function getRowOffset(row: number): number {
    return row * 60;
}

// ─── Individual card ────────────────────────────────────────────────
function GridCard({
    src,
    artwork_id,
    isLoading,
    col,
    row,
    cols,
    scrollYProgress,
    image_size
}: {
    src?: string;
    artwork_id?: number;
    isLoading?: boolean;
    col: number;
    row: number;
    cols: number;
    scrollYProgress: MotionValue<number>;
    image_size: ImageOrientation
}) {
    const center = (cols - 1) / 2;
    const distance = Math.abs(col - center);

    // Stronger offsets on mobile (2 cols) to keep the pyramid feel
    const colMultiplier = cols === 2 ? 120 : 55;
    const rowMultiplier = cols === 2 ? 50 : 25;

    const yOffset = distance * distance * colMultiplier + row * rowMultiplier;
    const scaleStart = 1 - distance * 0.04;

    const y = useTransform(scrollYProgress, [0, 0.55], [yOffset, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.55], [scaleStart, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 0.55], [14, 4]);

    return (
        <Link href={artwork_id ? `/art/${artwork_id}` : "#"} className={cn("block relative w-full", isLoading && "pointer-events-none")}>
            <motion.div
                className={cn("relative overflow-hidden bg-card w-full", ASPECT_RATIOS[image_size])}
                style={{ y, scale, borderRadius }}
            >
                {isLoading ? (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                ) : (
                    <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover absolute inset-0"
                        loading="lazy"
                        draggable={false}
                    />
                )}
            </motion.div>
        </Link>
    );
}

function ScrollRevealGridSkeleton() {
    const [cols, setCols] = useState(4);
    useEffect(() => {
        const update = () => setCols(window.innerWidth < 768 ? 2 : 4);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const columnStaggerY = cols === 2 ? 24 : 40;

    // Define standard mock items to generate a beautiful, realistic staggered skeleton layout
    const aspectRatios = [
        "aspect-[3/4]",  // Portrait
        "aspect-[1/1]",  // Square
        "aspect-[4/3]",  // Landscape
        "aspect-[3/4]",  // Portrait
        "aspect-[1/1]",  // Square
    ];

    // Build grid columns (round-robin)
    const columns = Array.from({ length: cols }, (_, colIdx) => {
        return Array.from({ length: 3 }, (_, rowIdx) => {
            const aspectIndex = (colIdx + rowIdx) % aspectRatios.length;
            return aspectRatios[aspectIndex];
        });
    });

    return (
        <div className="relative w-full overflow-hidden pb-24 bg-background">
            <div className="relative w-full">
                <section className="relative flex justify-center">
                    <div className="relative flex w-full max-w-[1480px] mx-auto gap-6 md:gap-10 py-20 items-start">
                        {columns.map((colItems, colIndex) => (
                            <div
                                key={colIndex}
                                className="flex flex-col gap-6 md:gap-10 flex-1 min-w-0"
                                style={{ marginTop: `${colIndex * columnStaggerY}px` }}
                            >
                                {colItems.map((aspect, rowIndex) => (
                                    <div key={rowIndex} className="w-full">
                                        <figure className="relative z-10 m-0" style={{ perspective: "1200px" }}>
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

// ─── Main component ─────────────────────────────────────────────────
export default function ScrollRevealGrid() {
    // const containerRef = useRef<HTMLDivElement>(null);
    const cols = useColumns(); // 👈
    const rows = cols === 2 ? 5 : 3;
    const total = cols * rows;

    const [artworks, setArtworks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const fetchArtworks = async () => {
            setIsError(false);
            try {
                const allArtworks: any[] = [];
                let nextCursor: string | null = null;

                // Load every page BEFORE committing to state. Otherwise each
                // intermediate setArtworks remounts/re-runs the heavy GSAP
                // ScrollTrigger setup in ScrollImagesReveal (and calls
                // ScrollTrigger.refresh() on every page), which is the main
                // source of lag during initial load.
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const res = await instance.get('/artwork/verified', {
                        params: {
                            take: 20,
                            ...(nextCursor ? { cursor: nextCursor } : {})
                        }
                    });

                    if (cancelled) return;

                    const data = res.data?.data || res.data;
                    let list: any[] = [];
                    if (data && data.list) {
                        list = data.list;
                    } else if (Array.isArray(data)) {
                        list = data;
                    }

                    allArtworks.push(...list);

                    if (data?.next_cursor) {
                        nextCursor = data.next_cursor;
                    } else {
                        break;
                    }
                }

                if (cancelled) return;
                setArtworks(allArtworks);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch verified artworks", error);
                if (!cancelled) {
                    setIsError(true);
                    setIsLoading(false);
                }
            }
        };
        fetchArtworks();
        return () => {
            cancelled = true;
        };
    }, []);

    // const { scrollYProgress } = useScroll({
    //     target: containerRef,
    //     offset: ["start start", "end end"],
    // });

    if (!isLoading && artworks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-muted-foreground font-serif text-center px-6">
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

    const halfLength = Math.ceil(artworks.length / 2);
    const firstHalfList = artworks.slice(0, halfLength);
    const secondHalfList = artworks.slice(halfLength);

    const items = isLoading
        ? Array.from({ length: total }).map((_, i) => ({ isPlaceholder: true }))
        : firstHalfList;

    // Create masonry columns
    const columns = Array.from({ length: cols }, () => [] as any[]);
    items.forEach((item, i) => {
        columns[i % cols].push(item);
    });


    return (
        <>
            {/*
            <div ref={containerRef} className="relative h-[350vh] bg-background">
                <div className="sticky top-0 flex flex-col items-center justify-center overflow-hidden">
                    <div className="flex gap-4 px-4 w-full max-w-[95vw] mx-auto items-start">
                        {columns.map((colItems, colIndex) => (
                            <div key={colIndex} className="flex flex-col gap-4 flex-1">
                                {colItems.map((item, rowIndex) => (
                                    <GridCard
                                        key={`${colIndex}-${rowIndex}`}
                                        src={item.primary_image_url}
                                        artwork_id={item.artwork_id}
                                        isLoading={isLoading || item.isPlaceholder}
                                        col={colIndex}
                                        row={rowIndex}
                                        cols={cols}
                                        scrollYProgress={scrollYProgress}
                                        image_size={item.primary_image_orientation}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            */}
            {isLoading ? (
                <ScrollRevealGridSkeleton />
            ) : (
                artworks.length > 0 && (
                    <ScrollImagesReveal bgClass="bg-background" artworks={artworks} />
                )
            )}
        </>
    );
}
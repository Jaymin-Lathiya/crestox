import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import ScrollImagesReveal, { aspect, image_size } from "../ScrollImagesReveal";

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
    image_size: image_size
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
                className={cn("relative overflow-hidden bg-card w-full", aspect[image_size])}
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

// ─── Main component ─────────────────────────────────────────────────
export default function ScrollRevealGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cols = useColumns(); // 👈
    const rows = cols === 2 ? 5 : 3;
    const total = cols * rows;

    const [artworks, setArtworks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                let allArtworks: any[] = [];
                let nextCursor: string | null = null;
                let isFetching = true;

                while (isFetching) {
                    const res = await instance.get('/artwork/verified', {
                        params: {
                            take: 20, // Fetch in chunks of 20
                            ...(nextCursor ? { cursor: nextCursor } : {})
                        }
                    });

                    const data = res.data?.data || res.data;
                    let list: any[] = [];
                    if (data && data.list) {
                        list = data.list;
                    } else if (Array.isArray(data)) {
                        list = data;
                    }

                    allArtworks = [...allArtworks, ...list];

                    // Update state incrementally so the UI starts displaying items as they come in.
                    setArtworks(allArtworks);

                    // Check for next_cursor indicating more pages. Break loop if null.
                    if (data?.next_cursor) {
                        nextCursor = data.next_cursor;
                    } else {
                        nextCursor = null;
                        isFetching = false;
                    }

                    // On the first chunk, we can disable the primary isLoading state.
                    if (isLoading) {
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch verified artworks", error);
                setIsLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    if (!isLoading && artworks.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-muted-foreground font-serif text-2xl md:text-3xl">
                Not any verified artwork yet
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

    console.log(columns[0]);


    return (
        <>
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
            {!isLoading && secondHalfList.length > 0 && (
                <ScrollImagesReveal bgClass="bg-background" artworks={secondHalfList} />
            )}
        </>
    );
}

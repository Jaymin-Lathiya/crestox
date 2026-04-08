import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ScrollImagesReveal, { aspect, image_size } from "../ScrollImagesReveal";

import { cn } from "@/lib/utils";
import instance from "@/utils/apiCalls";
import { Skeleton } from "@/components/ui/skeleton";

const COLS = 5;
const ROWS = 3;
const TOTAL = COLS * ROWS;
const EXPLORE_LAYOUT = "crestox:explore-layout";

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

// ─── Individual card ────────────────────────────────────────────────
function GridCard({
    src,
    artwork_id,
    isLoading,
    col,
    row,
    cols,
    scrollYProgress,
    orientation,
}: {
    src?: string;
    artwork_id?: number;
    isLoading?: boolean;
    col: number;
    row: number;
    cols: number;
    scrollYProgress: MotionValue<number>;
    orientation?: image_size;
}) {
    const center = (cols - 1) / 2;
    const distance = Math.abs(col - center);

    const colMultiplier = cols === 2 ? 120 : 55;
    const rowMultiplier = cols === 2 ? 50 : 25;

    const yOffset = distance * distance * colMultiplier + row * rowMultiplier;
    const scaleStart = 1 - distance * 0.04;

    const y = useTransform(scrollYProgress, [0, 0.55], [yOffset, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.55], [scaleStart, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 0.55], [14, 4]);

    const aspectKey = orientation && aspect[orientation] ? orientation : image_size.PORTRAIT;

    return (
        <Link href={artwork_id ? `/art/${artwork_id}` : "#"} className={cn("block relative w-full", isLoading && "pointer-events-none")}>
            <motion.div
                className={cn("relative overflow-hidden bg-card w-full", aspect[aspectKey])}
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

/** Isolated framer scroll track — remount on `layoutSync` so useScroll matches first-visit behavior after artists expand/collapse. */
function ScrollRevealFramerTrack({
    columns,
    isLoading,
    cols,
}: {
    columns: any[][];
    isLoading: boolean;
    cols: number;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
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
                                    orientation={item.primary_image_orientation}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main component ─────────────────────────────────────────────────
export default function ScrollRevealGrid() {
    const cols = useColumns();
    const total = cols === 2 ? 5 * 2 : ROWS * COLS;

    const [artworks, setArtworks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [layoutSync, setLayoutSync] = useState(0);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                let allArtworks: any[] = [];
                let nextCursor: string | null = null;
                let isFetching = true;

                while (isFetching) {
                    const res = await instance.get("/artwork/verified", {
                        params: {
                            take: 20,
                            ...(nextCursor ? { cursor: nextCursor } : {}),
                        },
                    });

                    const data = res.data?.data || res.data;
                    let list: any[] = [];
                    if (data && data.list) {
                        list = data.list;
                    } else if (Array.isArray(data)) {
                        list = data;
                    }

                    allArtworks = [...allArtworks, ...list];
                    setArtworks(allArtworks);

                    if (data?.next_cursor) {
                        nextCursor = data.next_cursor;
                    } else {
                        nextCursor = null;
                        isFetching = false;
                    }

                    setIsLoading((prev) => (prev ? false : prev));
                }
            } catch (error) {
                console.error("Failed to fetch verified artworks", error);
                setIsLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    useEffect(() => {
        const bump = () => setLayoutSync((v) => v + 1);
        window.addEventListener(EXPLORE_LAYOUT, bump);
        return () => window.removeEventListener(EXPLORE_LAYOUT, bump);
    }, []);

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

    const items = isLoading ? Array.from({ length: total }).map((_, i) => ({ isPlaceholder: true })) : firstHalfList;

    const columns = Array.from({ length: cols }, () => [] as any[]);
    items.forEach((item, i) => {
        columns[i % cols].push(item);
    });

    return (
        <>
            <ScrollRevealFramerTrack key={layoutSync} columns={columns} isLoading={isLoading} cols={cols} />
            {!isLoading && secondHalfList.length > 0 && (
                <ScrollImagesReveal layoutSync={layoutSync} bgClass="bg-background" artworks={secondHalfList} />
            )}
        </>
    );
}


import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Link from 'next/link';

const ARTWORK_IMAGES = [
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1579783902614-a3fb392796a5?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1531315630201-bb15dbef0390?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&fit=crop",
];

const COLS = 7;
const ROWS = 3;
const TOTAL = COLS * ROWS;

/**
 * Pyramid Y offset: center columns sit high, edges are pushed far down (off-screen).
 * This creates the staggered waterfall / pyramid layout at scroll = 0.
 */
function getColumnOffset(col: number): number {
    const center = (COLS - 1) / 2; // 3
    const distance = Math.abs(col - center);
    // Quadratic falloff for a more dramatic pyramid shape
    return distance * distance * 55;
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
    col,
    row,
    scrollYProgress,
}: {
    src: string;
    col: number;
    row: number;
    scrollYProgress: MotionValue<number>;
}) {
    const yOffset = getColumnOffset(col) + getRowOffset(row);
    const scaleStart = getColumnScale(col);

    // Scroll range: 0 → 0.55  maps  scattered → grid
    const y = useTransform(scrollYProgress, [0, 0.55], [yOffset, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.55], [scaleStart, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 0.55], [14, 4]);

    return (
        <Link href="/art" className="block relative aspect-square">
            <motion.div
                className="relative overflow-hidden bg-card w-full h-full"
                style={{ y, scale, borderRadius }}
            >
                <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    draggable={false}
                />
            </motion.div>
        </Link>
    );
}

// ─── Title that fades on scroll ─────────────────────────────────────
function ScrollTitle({
    scrollYProgress,
}: {
    scrollYProgress: MotionValue<number>;
}) {
    const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

    return (
        <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center"
            style={{ opacity }}
        >
            <p className="font-mono text-muted-foreground text-xs tracking-[0.4em] uppercase">
                Scroll
            </p>
            <p className="font-mono text-muted-foreground text-xs tracking-[0.4em] uppercase">
                Effect with
            </p>
            <p className="font-mono text-muted-foreground text-xs tracking-[0.4em] uppercase">
                Framer Motion
            </p>
            <div className="mx-auto mt-4 w-px h-10 bg-muted-foreground/40" />
        </motion.div>
    );
}

// ─── Main component ─────────────────────────────────────────────────
export default function ScrollRevealGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const items = ARTWORK_IMAGES.slice(0, TOTAL);

    return (
        <div ref={containerRef} className="relative h-[300vh] bg-background">
            {/* Sticky wrapper keeps the grid on-screen while the container scrolls */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                <ScrollTitle scrollYProgress={scrollYProgress} />

                <div
                    className="grid gap-2.5 px-3 w-full max-w-7xl"
                    style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
                >
                    {items.map((src, i) => {
                        const col = i % COLS;
                        const row = Math.floor(i / COLS);
                        return (
                            <GridCard
                                key={i}
                                src={src}
                                col={col}
                                row={row}
                                scrollYProgress={scrollYProgress}
                            />
                        );
                    })}
                </div>
            </div>
        </div >
    );
}
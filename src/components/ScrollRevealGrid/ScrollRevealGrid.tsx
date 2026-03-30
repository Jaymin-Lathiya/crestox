import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import ScrollImagesReveal from "../ScrollImagesReveal";

const ARTWORK_IMAGES = [
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1723952776528-b5f783f91127?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1516247524857-8dc5f4786cb3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=400&fit=crop",
    "https://plus.unsplash.com/premium_photo-1664438942574-e56510dc5ce5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=400&fit=crop",
    "https://plus.unsplash.com/premium_photo-1772277194095-ecaab9a3e7d3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=400&fit=crop",
    "https://plus.unsplash.com/premium_photo-1747851576159-8d483776648d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400&fit=crop",
];

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
    col,
    row,
    cols,
    scrollYProgress,
}: {
    src: string;
    col: number;
    row: number;
    cols: number;
    scrollYProgress: MotionValue<number>;
}) {
    const center = (cols - 1) / 2;
    const distance = Math.abs(col - center);

    // Stronger offsets on mobile (2 cols) to keep the pyramid feel
    const colMultiplier = cols === 2 ? 120 : 55;
    const rowMultiplier = cols === 2 ? 100 : 60;

    const yOffset = distance * distance * colMultiplier + row * rowMultiplier;
    const scaleStart = 1 - distance * 0.04;

    const y = useTransform(scrollYProgress, [0, 0.55], [yOffset, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.55], [scaleStart, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 0.55], [14, 4]);

    return (
        <Link href="/art" className="block relative w-full">
            <motion.div
                className="relative overflow-hidden bg-card w-full rounded-md shadow-md"
                style={{ y, scale, borderRadius }}
            >
                <img
                    src={src}
                    alt=""
                    className="w-full h-auto block"
                    loading="lazy"
                    draggable={false}
                />
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

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const items = ARTWORK_IMAGES.slice(0, total);

    return (
        <>
            <div ref={containerRef} className="relative h-[350vh] bg-background">
                <div className="sticky top-0 flex flex-col items-center justify-center overflow-hidden">
                    <div
                        className="flex gap-4 px-4 w-full max-w-[95vw] mx-auto items-start"
                    >
                        {Array.from({ length: cols }).map((_, c) => (
                            <div key={c} className="flex flex-col gap-4 flex-1">
                                {items.filter((_, i) => i % cols === c).map((src, r) => (
                                    <GridCard
                                        key={`${c}-${r}`}
                                        src={src}
                                        col={c}
                                        row={r}
                                        cols={cols}
                                        scrollYProgress={scrollYProgress}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ScrollImagesReveal bgClass="bg-background" />
        </>
    );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import { Menu, Grid, Layout } from "lucide-react";
import "./ScrollImage.css"

const IMAGES = [
    { src: "https://picsum.photos/seed/art1/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art2/1200/800", type: "landscape" },
    { src: "https://picsum.photos/seed/art3/800/800", type: "square" },
    { src: "https://picsum.photos/seed/art4/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art5/800/800", type: "square" },
    { src: "https://picsum.photos/seed/art6/1200/800", type: "landscape" },
    { src: "https://picsum.photos/seed/art7/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art8/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art9/1200/800", type: "landscape" },
    { src: "https://picsum.photos/seed/art10/800/800", type: "square" },
    { src: "https://picsum.photos/seed/art11/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art12/1200/800", type: "landscape" },
    { src: "https://picsum.photos/seed/art13/800/800", type: "square" },
    { src: "https://picsum.photos/seed/art14/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art15/1200/800", type: "landscape" },
    { src: "https://picsum.photos/seed/art16/800/800", type: "square" },
    { src: "https://picsum.photos/seed/art17/800/1200", type: "portrait" },
    { src: "https://picsum.photos/seed/art18/1200/800", type: "landscape" },
    { src: "https://picsum.photos/seed/art19/800/800", type: "square" },
    { src: "https://picsum.photos/seed/art20/800/1200", type: "portrait" },
];

export default function ScrollImage() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Split images into 4 columns for masonry effect
    const columns = [[], [], [], []] as any[][];
    IMAGES.forEach((item, index) => {
        columns[index % 4].push(item);
    });

    return (
        <div className="bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden" ref={containerRef}>
            {/* Scrollable Content - Masonry Layout with Extreme Vertical Curve */}
            <div className="relative z-10 py-[50vh] flex justify-center px-2 md:px-4">
                <div className="flex gap-2 md:gap-3 w-full max-w-[98vw] perspective-[1000px]">
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-1">
                            {col.map((item, itemIndex) => (
                                <GridItem
                                    key={`${colIndex}-${itemIndex}`}
                                    src={item.src}
                                    index={itemIndex}
                                    type={item.type}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface GridItemProps {
    src: string;
    index: number;
    type: string;
    key?: any;
}

function GridItem({ src, index, type }: GridItemProps) {
    const itemRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start end", "end start"]
    });

    // Roller tilt: Flat in the middle (0.2 to 0.8), tilts sharply at the top and bottom
    const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);

    // Depth: Recede into distance only at the very edges to match the tilt
    const z = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [-300, 0, 0, -300]);

    // Removed vertical bunching and scale as size shouldn't change
    const y = useTransform(scrollYProgress, [0, 1], [0, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1]);

    // Atmospheric depth only at the edge of the roller
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    const blur = useTransform(
        scrollYProgress,
        [0, 0.15, 0.85, 1],
        ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]
    );

    const aspectClass =
        type === "portrait" ? "aspect-[2/3]" :
            type === "landscape" ? "aspect-[3/2]" :
                "aspect-square";

    return (
        <motion.div
            ref={itemRef}
            style={{
                rotateX,
                z,
                y,
                scale,
                opacity,
                filter: blur,
                transformStyle: "preserve-3d",
            }}
            className={`relative ${aspectClass} col-span-1 overflow-hidden rounded-sm bg-white/5 group shadow-[0_50px_100px_rgba(0,0,0,1)]`}
        >
            <img
                src={src}
                alt={`Gallery item ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
            />
            {/* Dark overlay specifically for the tilted edges */}
            <motion.div
                style={{
                    opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 0, 0, 0.8])
                }}
                className="absolute inset-0 bg-black pointer-events-none"
            />
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}

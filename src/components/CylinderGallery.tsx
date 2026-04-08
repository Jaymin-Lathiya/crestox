import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export const aspect = {
    PORTRAIT: "aspect-[3/4]",
    LANDSCAPE: "aspect-[4/3]",
    SQUARE: "aspect-[1/1]",
};

// Mock Data structure: grouped by rows to animate together
const GALLERY_ROWS = [
    {
        id: "row-1",
        images: [
            { src: "https://picsum.photos/600/800?random=1", ratio: aspect.PORTRAIT },
            { src: "https://picsum.photos/800/600?random=2", ratio: aspect.LANDSCAPE },
            { src: "https://picsum.photos/600/600?random=3", ratio: aspect.SQUARE },
            { src: "https://picsum.photos/600/800?random=4", ratio: aspect.PORTRAIT },
        ],
    },
    {
        id: "row-2",
        images: [
            { src: "https://picsum.photos/800/600?random=5", ratio: aspect.LANDSCAPE },
            { src: "https://picsum.photos/600/600?random=6", ratio: aspect.SQUARE },
            { src: "https://picsum.photos/600/800?random=7", ratio: aspect.PORTRAIT },
            { src: "https://picsum.photos/800/600?random=8", ratio: aspect.LANDSCAPE },
        ],
    },
    {
        id: "row-3",
        images: [
            { src: "https://picsum.photos/600/800?random=9", ratio: aspect.PORTRAIT },
            { src: "https://picsum.photos/600/800?random=10", ratio: aspect.PORTRAIT },
            { src: "https://picsum.photos/800/600?random=11", ratio: aspect.LANDSCAPE },
            { src: "https://picsum.photos/600/600?random=12", ratio: aspect.SQUARE },
        ],
    },
    {
        id: "row-4",
        images: [
            { src: "https://picsum.photos/600/600?random=13", ratio: aspect.SQUARE },
            { src: "https://picsum.photos/800/600?random=14", ratio: aspect.LANDSCAPE },
            { src: "https://picsum.photos/600/800?random=15", ratio: aspect.PORTRAIT },
            { src: "https://picsum.photos/600/800?random=16", ratio: aspect.PORTRAIT },
        ],
    },
    {
        id: "row-5",
        images: [
            { src: "https://picsum.photos/800/600?random=17", ratio: aspect.LANDSCAPE },
            { src: "https://picsum.photos/600/600?random=18", ratio: aspect.SQUARE },
            { src: "https://picsum.photos/600/800?random=19", ratio: aspect.PORTRAIT },
            { src: "https://picsum.photos/800/600?random=20", ratio: aspect.LANDSCAPE },
        ],
    },
];

const CylinderGallery = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // 1. Initialize Lenis for Smooth Scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        // Keep ScrollTrigger synced with Lenis
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // 2. GSAP Context for easy cleanup
        let ctx = gsap.context(() => {
            const rows = gsap.utils.toArray(".gallery-row");

            rows.forEach((row: any) => {
                const overlays = row.querySelectorAll(".image-overlay");

                // The timeline controls the journey of a single row from bottom of screen to top
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: row,
                        start: "top 100%", // Start animating when the top of the row hits the bottom of the viewport
                        end: "bottom 0%", // End when the bottom of the row leaves the top of the viewport
                        scrub: 0.5, // Smooth scrubbing
                    },
                });

                // Phase 1: Entering from the bottom (Rotated back, zoomed out, blurred, dark overlay)
                tl.fromTo(
                    row,
                    {
                        rotationX: -45, // Tilted away
                        z: -600, // Pushed back in 3D space
                        filter: "blur(10px)",
                        scale: 0.8,
                    },
                    {
                        rotationX: 0, // Flat to screen
                        z: 0,
                        filter: "blur(0px)",
                        scale: 1, // Slight bonus scaling at center
                        duration: 0.5,
                        ease: "power1.inOut",
                    }
                )
                    // Phase 2: Leaving towards the top (Rotated forward, zoomed out, blurred)
                    .to(
                        row,
                        {
                            rotationX: 45,
                            z: -600,
                            filter: "blur(10px)",
                            scale: 0.8,
                            duration: 0.5,
                            ease: "power1.inOut",
                        }
                    );

                // Animate the black overlays for depth illusion
                // Start dark -> transparent at center -> dark at top
                const overlayTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: row,
                        start: "top 100%",
                        end: "bottom 0%",
                        scrub: 0.5,
                    },
                });

                overlayTl
                    .fromTo(
                        overlays,
                        { opacity: 0.85 }, // Dark at bottom
                        { opacity: 0, duration: 0.5, ease: "power1.inOut" } // Clear at center
                    )
                    .to(
                        overlays,
                        { opacity: 0.85, duration: 0.5, ease: "power1.inOut" } // Dark at top
                    );
            });
        }, containerRef);

        // Cleanup phase
        return () => {
            ctx.revert();
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <div className="bg-neutral-950 min-h-screen w-full overflow-hidden text-white font-sans">
            {/* Header/Nav Spacer */}
            <header className="fixed top-0 w-full p-6 flex justify-between z-50 mix-blend-difference">
                <h1 className="text-xl font-medium tracking-tight">Gallery</h1>
                <button className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-md text-sm">
                    Menu
                </button>
            </header>

            {/* Top spacer to allow scrolling down into the first elements */}
            <div className="h-[40vh]"></div>

            {/* Main 3D Container */}
            <div
                ref={containerRef}
                className="w-full max-w-[1400px] mx-auto px-4 pb-[40vh]"
                style={{ perspective: "1500px" }} // Crucial for the 3D cylinder effect
            >
                {GALLERY_ROWS.map((row) => (
                    <div
                        key={row.id}
                        className="gallery-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 will-change-transform"
                        style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                    >
                        {row.images.map((img, idx) => (
                            <div
                                key={`${row.id}-${idx}`}
                                className={`relative overflow-hidden rounded-xl bg-neutral-900 ${img.ratio} flex items-center justify-center`}
                            >
                                {/* Image */}
                                <img
                                    src={img.src}
                                    alt={`Gallery img ${idx}`}
                                    className="object-cover w-full h-full"
                                    loading="lazy"
                                />

                                {/* The Overlay for Depth/Focus Illusion */}
                                <div className="image-overlay absolute inset-0 bg-black pointer-events-none will-change-opacity"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CylinderGallery;
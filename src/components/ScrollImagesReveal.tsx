"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9d1d?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=750&fit=crop",
];

import Link from "next/link";

export enum image_size {
    PORTRAIT = "PORTRAIT",
    LANDSCAPE = "LANDSCAPE",
    SQUARE = "SQUARE"
}

export const aspect = {
    [image_size.PORTRAIT]: "aspect-[3/4]",
    [image_size.LANDSCAPE]: "aspect-[4/3]",
    [image_size.SQUARE]: "aspect-[1/1]"
}

export default function ScrollImagesReveal({ bgClass = "bg-[#0a0a0a]", artworks }: { bgClass?: string, artworks?: any[] }) {
    const gridRef = useRef<HTMLDivElement>(null);

    // 1. Initialize Lenis smooth scroll once on mount
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        let rafId: number;
        const raf = (t: number) => {
            lenis.raf(t);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        gsap.ticker.lagSmoothing(0);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.globalTimeline.clear();
        };
    }, []);

    // 2. Apply GSAP animations progressively as new artworks are loaded
    useEffect(() => {
        // Delay to allow DOM layout to settle before calculating positions
        const timeout = setTimeout(() => {
            const gridWrappers = gridRef.current?.querySelectorAll<HTMLElement>(".grid-item-imgwrap:not(.gsap-applied)");
            if (!gridWrappers || gridWrappers.length === 0) return;

            gridWrappers.forEach((wrapper) => {
                wrapper.classList.add("gsap-applied");
                const img = wrapper.querySelector(".grid-item-img");
                const rect = wrapper.getBoundingClientRect();
                const isLeft = (rect.left + rect.width / 2) < (window.innerWidth / 2);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 95%",
                        end: "bottom 5%",
                        scrub: true,
                    }
                });

                tl.from(wrapper, {
                    startAt: { filter: "blur(0px) brightness(100%) contrast(100%)" },
                    duration: 1,
                    z: 300,
                    rotateX: 70,
                    rotateZ: isLeft ? 5 : -5,
                    xPercent: isLeft ? -40 : 40,
                    skewX: isLeft ? -20 : 20,
                    yPercent: 100,
                    filter: "blur(7px) brightness(0%) contrast(400%)",
                    ease: "sine.out"
                })
                    .to(wrapper, { duration: 1.5 }) // Holds the image in its crystal clear default state across the center of the screen
                    .to(wrapper, {
                        duration: 1,
                        z: 300,
                        rotateX: -50,
                        rotateZ: isLeft ? -1 : 1,
                        xPercent: isLeft ? -20 : 20,
                        skewX: isLeft ? 10 : -10,
                        filter: "blur(4px) brightness(0%) contrast(500%)",
                        ease: "sine.in"
                    });

                if (img) {
                    tl.from(img, { duration: 1, scaleY: 1.8, ease: "sine.out" }, 0)
                      .to(img, { duration: 1.5 }, ">")
                      .to(img, { duration: 1, scaleY: 1.8, ease: "sine.in" }, ">");
                }
            });
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, [artworks]);

    // 4 columns
    const COLS = 4;
    const dynamicImages = artworks.map(a => {
        return {
            src: a.primary_image_url,
            id: a.artwork_id,
            aspect: aspect[a.primary_image_orientation]
        }
    });

    // Repeat images if there are too few to fill the aesthetic correctly, or just use what we have
    const allImages = dynamicImages.length >= 20 ? dynamicImages : [...dynamicImages, ...dynamicImages, ...dynamicImages].slice(0, 20);
    const COL_ASPECTS = [
        ["aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/5]"],
        ["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/5]"],
        ["aspect-[4/5]", "aspect-[3/4]", "aspect-[4/5]", "aspect-[4/3]"],
        ["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/5]"],
        ["aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/5]"],
    ];

    // Group images into columns
    const columns: { src: string; aspect: string; id: number | null }[][] = Array.from({ length: COLS }, () => []);
    allImages.forEach(({ src, id, aspect }, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        columns[col].push({
            src,
            aspect,
            id
        });
    });

    return (
        <div className={`relative w-full overflow-hidden pb-24 top-0 ${bgClass}`}>
            <div className="relative w-full overflow-hidden">
                <section className="relative grid w-full place-items-center">
                    <div ref={gridRef} className="relative flex w-full max-w-[95vw] gap-6 sm:gap-9 py-10 px-4 items-start">
                        {columns.map((colItems, colIndex) => (
                            <div key={colIndex} className="flex flex-col gap-6 sm:gap-9 flex-1">
                                {colItems.map(({ src, aspect, id }, rowIndex) => {
                                    const content = (
                                        <figure className="relative z-10 m-0" style={{ perspective: "800px", willChange: "transform" }}>
                                            <div className={`grid-item-imgwrap relative ${aspect} w-full overflow-hidden rounded-sm will-change-[filter] bg-[#1c1c1c]`}>
                                                <div
                                                    className="grid-item-img absolute -left-0 -top-0 h-full w-full bg-cover bg-center will-change-transform"
                                                    style={{ backgroundImage: `url(${src})`, backfaceVisibility: "hidden" }}
                                                />
                                            </div>
                                        </figure>
                                    );

                                    return id ? (
                                        <Link key={`col-${colIndex}-row-${rowIndex}-id-${id}`} href={`/art/${id}`} className="block w-full">
                                            {content}
                                        </Link>
                                    ) : (
                                        <div key={`col-${colIndex}-row-${rowIndex}`}>{content}</div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
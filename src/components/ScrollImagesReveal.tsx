import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";

export enum ImageOrientation {
    PORTRAIT = "PORTRAIT",
    LANDSCAPE = "LANDSCAPE",
    SQUARE = "SQUARE"
}

export const ASPECT_RATIOS = {
    [ImageOrientation.PORTRAIT]: "aspect-[3/4]",
    [ImageOrientation.LANDSCAPE]: "aspect-[4/3]",
    [ImageOrientation.SQUARE]: "aspect-[1/1]"
}

interface Artwork {
    artwork_id: number;
    primary_image_url: string;
    primary_image_orientation: ImageOrientation;
}

interface ScrollImagesRevealProps {
    bgClass?: string;
    artworks?: Artwork[];
}

function useGridColumnCount() {
    const [cols, setCols] = useState(4);
    useEffect(() => {
        const update = () => setCols(window.innerWidth < 768 ? 2 : 4);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return cols;
}

export default function ScrollImagesReveal({ bgClass = "bg-[#030712]", artworks = [] }: ScrollImagesRevealProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const colCount = useGridColumnCount();

    // 1. Initialize Lenis smooth scroll once on mount
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: true
        });

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (t: number) => {
            lenis.raf(t);
            requestAnimationFrame(raf);
        };
        const rafId = requestAnimationFrame(raf);

        gsap.ticker.lagSmoothing(0);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    // 2. Apply GSAP animations progressively as new artworks are loaded
    useEffect(() => {
        if (!artworks.length) return;

        // Delay to allow DOM layout to settle
        const timeout = setTimeout(() => {
            const gridWrappers = gridRef.current?.querySelectorAll(".grid-item-imgwrap:not(.gsap-applied)") as NodeListOf<HTMLElement>;
            if (!gridWrappers || gridWrappers.length === 0) return;

            gridWrappers.forEach((wrapper) => {
                wrapper.classList.add("gsap-applied");
                const img = wrapper.querySelector<HTMLElement>(".grid-item-img");
                const rect = wrapper.getBoundingClientRect();
                const isLeft = (rect.left + rect.width / 2) < (window.innerWidth / 2);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom", // Start when top of element hits bottom of viewport
                        end: "bottom top",   // End when bottom of element hits top of viewport
                        scrub: 1,            // Smooth scrubbing
                    }
                });

                // Entrance Animation
                tl.fromTo(wrapper,
                    {
                        z: 200,
                        rotateX: 45,
                        rotateZ: isLeft ? 10 : -10,
                        xPercent: isLeft ? -30 : 30,
                        yPercent: 50,
                        opacity: 0,
                        filter: "blur(10px) brightness(0.5)",
                    },
                    {
                        z: 0,
                        rotateX: 0,
                        rotateZ: 0,
                        xPercent: 0,
                        yPercent: 0,
                        opacity: 1,
                        filter: "blur(0px) brightness(1)",
                        ease: "power2.out",
                        duration: 1
                    }
                )
                    // Middle Hold (Crystal Clear State)
                    .to(wrapper, { duration: 1 })
                    // Exit Animation
                    .to(wrapper,
                        {
                            z: 200,
                            rotateX: -45,
                            rotateZ: isLeft ? -5 : 5,
                            xPercent: isLeft ? -15 : 15,
                            yPercent: -50,
                            opacity: 0,
                            filter: "blur(10px) brightness(0.5)",
                            ease: "power2.in",
                            duration: 1
                        }
                    );

                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.4 },
                        {
                            scale: 1,
                            scrollTrigger: {
                                trigger: wrapper,
                                start: "top bottom",
                                end: "center center",
                                scrub: true
                            }
                        }
                    );

                    gsap.to(img, {
                        scale: 1.4,
                        scrollTrigger: {
                            trigger: wrapper,
                            start: "center center",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                }
            });
            ScrollTrigger.refresh();
        }, 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [artworks, colCount]);

    // Use artworks or fallback to empty array
    const dynamicImages = artworks.map(a => ({
        src: a.primary_image_url,
        id: a.artwork_id,
        aspect: ASPECT_RATIOS[a.primary_image_orientation] || ASPECT_RATIOS[ImageOrientation.SQUARE]
    }));

    // Ensure we have enough images for a good grid feel
    const allImages = dynamicImages.length === 0 ? [] :
        (dynamicImages.length >= 12 ? dynamicImages :
            [...dynamicImages, ...dynamicImages, ...dynamicImages].slice(0, 20));

    // Group images into columns (round-robin)
    const columns: { src: string; aspect: string; id: number | null }[][] = Array.from({ length: colCount }, () => []);
    allImages.forEach(({ src, id, aspect }, i) => {
        const col = i % colCount;
        columns[col].push({ src, aspect, id });
    });

    const columnStaggerY = colCount === 2 ? 24 : 40;

    return (
        <div className={`relative w-full overflow-hidden pb-24 ${bgClass}`}>
            <div className="relative w-full">
                <section className="relative flex justify-center">
                    <div ref={gridRef} className="relative flex w-full max-w-[1480px] mx-auto gap-6 md:gap-10 py-20 items-start">
                        {columns.map((colItems, colIndex) => (
                            <div
                                key={colIndex}
                                className="flex flex-col gap-6 md:gap-10 flex-1 min-w-0"
                                style={{ marginTop: `${colIndex * columnStaggerY}px` }}
                            >
                                {colItems.map(({ src, aspect, id }, rowIndex) => {
                                    const content = (
                                        <figure className="relative z-10 m-0" style={{ perspective: "1200px" }}>
                                            <div className={`grid-item-imgwrap relative ${aspect} w-full overflow-hidden rounded-xl bg-gray-900/50 border border-white/5 shadow-2xl transition-shadow duration-500 hover:shadow-white/10`}>
                                                <div
                                                    className="grid-item-img absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700"
                                                    style={{
                                                        backgroundImage: `url(${src})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                                            </div>
                                        </figure>
                                    );

                                    return id ? (
                                        <Link key={`col-${colIndex}-row-${rowIndex}-id-${id}`} href={`/art/${id}`} className="block w-full">
                                            {content}
                                        </Link>
                                    ) : (
                                        <div key={`col-${colIndex}-row-${rowIndex}`} className="w-full">{content}</div>
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
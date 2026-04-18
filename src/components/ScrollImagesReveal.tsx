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

        // NOTE: the original implementation only cancelled the first RAF id,
        // which left the recursive requestAnimationFrame chain running forever
        // after unmount (a memory/CPU leak that stacks on every HMR/route
        // change). We track the latest id so cleanup actually stops the loop.
        let rafId = 0;
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
        };
    }, []);

    // 2. Set up GSAP animations once after the artworks list is ready.
    // Using gsap.context so every tween/ScrollTrigger created here is
    // automatically reverted on cleanup instead of leaking across renders.
    useEffect(() => {
        if (!artworks.length || !gridRef.current) return;

        const ctx = gsap.context(() => {
            const gridWrappers = gridRef.current!.querySelectorAll<HTMLElement>(
                ".grid-item-imgwrap"
            );
            if (!gridWrappers.length) return;

            const viewportHalf = window.innerWidth / 2;

            gridWrappers.forEach((wrapper) => {
                const img = wrapper.querySelector<HTMLElement>(".grid-item-img");
                const rect = wrapper.getBoundingClientRect();
                const isLeft = rect.left + rect.width / 2 < viewportHalf;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: false,
                    },
                });

                tl.fromTo(
                    wrapper,
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
                        duration: 1,
                    }
                )
                    .to(wrapper, { duration: 1 })
                    .to(wrapper, {
                        z: 200,
                        rotateX: -45,
                        rotateZ: isLeft ? -5 : 5,
                        xPercent: isLeft ? -15 : 15,
                        yPercent: -50,
                        opacity: 0,
                        filter: "blur(10px) brightness(0.5)",
                        ease: "power2.in",
                        duration: 1,
                    });

                if (img) {
                    // Collapse the two image-scale ScrollTriggers into a single
                    // timeline. Each ScrollTrigger with scrub fires update
                    // callbacks on every scroll frame, so halving them roughly
                    // halves the per-frame work for the image zoom effect.
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: wrapper,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: false,
                        },
                    })
                        .fromTo(img, { scale: 1.4 }, { scale: 1, ease: "none", duration: 1 })
                        .to(img, { scale: 1.4, ease: "none", duration: 1 });
                }
            });

            // Refresh once at the end instead of per-item.
            ScrollTrigger.refresh();
        }, gridRef);

        return () => ctx.revert();
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
                                            <div
                                                className={`grid-item-imgwrap relative ${aspect} w-full overflow-hidden rounded-xl bg-gray-900/50 border border-white/5 shadow-2xl transition-shadow duration-500 hover:shadow-white/10`}
                                            >
                                                <div
                                                    className="grid-item-img absolute inset-0 h-full w-full bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${src})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
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
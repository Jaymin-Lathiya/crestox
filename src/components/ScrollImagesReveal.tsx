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
    artwork_name?: string;
    primary_image_url: string;
    primary_image_orientation: ImageOrientation;
    artist_name?: string | null;
    valuation?: string | number | null;
}

interface ScrollImagesRevealProps {
    bgClass?: string;
    artworks?: Artwork[];
}

function formatRupeeValuation(raw: string | number | null | undefined): string | null {
    if (raw == null || raw === "") return null;
    const n = Number.parseFloat(String(raw).replace(/,/g, ""));
    if (Number.isNaN(n)) return null;
    return `\u20B9${n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
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

function setupScrollTriggersForWrappers(wrappers: HTMLElement[]) {
    const viewportHalf = window.innerWidth / 2;
    // Cards whose top is already on screen (or just about to be) sit at low
    // scrub progress with opacity 0 — which looks like a blank first batch.
    // Keep those fully visible; reserve the full enter→exit reveal for cards
    // that start below the fold.
    const revealThreshold = window.innerHeight * 0.92;

    wrappers.forEach((wrapper) => {
        if (wrapper.dataset.stReady === "1") return;
        wrapper.dataset.stReady = "1";

        const img = wrapper.querySelector<HTMLElement>(".grid-item-img");
        const rect = wrapper.getBoundingClientRect();
        const isLeft = rect.left + rect.width / 2 < viewportHalf;
        const startsOnScreen = rect.top < revealThreshold;

        if (startsOnScreen) {
            gsap.set(wrapper, {
                opacity: 1,
                z: 0,
                rotateX: 0,
                rotateZ: 0,
                xPercent: 0,
                yPercent: 0,
                filter: "blur(0px) brightness(1)",
            });

            // Exit-only scrub so they still dissolve when scrolling past.
            const exitTl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 15%",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: false,
                },
            });
            exitTl
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
                gsap.fromTo(
                    img,
                    { scale: 1 },
                    {
                        scale: 1.4,
                        ease: "none",
                        scrollTrigger: {
                            trigger: wrapper,
                            start: "top 15%",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: false,
                        },
                    }
                );
            }
            return;
        }

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
}

export default function ScrollImagesReveal({ bgClass = "bg-[#030712]", artworks = [] }: ScrollImagesRevealProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const colCount = useGridColumnCount();
    const prevArtworkCountRef = useRef(0);
    const prevColCountRef = useRef(colCount);
    const hasInitialBoundRef = useRef(false);
    const artworkIdsKey = artworks.map((a) => a.artwork_id).join(",");

    // 1. Initialize Lenis smooth scroll once on mount (original wiring)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: true
        });

        lenis.on("scroll", ScrollTrigger.update);

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

    // 2. Bind GSAP when the gallery approaches the viewport (so the first
    //    batch isn't stuck at scrub progress 0 / opacity 0). Appended pages
    //    bind only after the initial bind — those cards start below the fold.
    useEffect(() => {
        if (!artworks.length || !gridRef.current) return;

        const grid = gridRef.current;
        const isReset =
            artworks.length < prevArtworkCountRef.current ||
            prevArtworkCountRef.current === 0;
        const colChanged = prevColCountRef.current !== colCount;
        const isAppend =
            !isReset && !colChanged && artworks.length > prevArtworkCountRef.current;

        if ((isReset && prevArtworkCountRef.current > 0) || colChanged) {
            hasInitialBoundRef.current = false;
            ScrollTrigger.getAll().forEach((t) => {
                const trigger = t.trigger;
                if (trigger instanceof HTMLElement && grid.contains(trigger)) {
                    t.kill();
                }
            });
            grid.querySelectorAll<HTMLElement>(".grid-item-imgwrap").forEach((el) => {
                delete el.dataset.stReady;
                gsap.set(el, { clearProps: "opacity,transform,filter" });
            });
        }

        const bindPending = () => {
            if (!gridRef.current) return;
            const wrappers = Array.from(
                gridRef.current.querySelectorAll<HTMLElement>(".grid-item-imgwrap")
            );
            const pending = wrappers.filter((w) => w.dataset.stReady !== "1");
            if (!pending.length) return;
            setupScrollTriggersForWrappers(pending);
            ScrollTrigger.refresh();
            hasInitialBoundRef.current = true;
        };

        prevArtworkCountRef.current = artworks.length;
        prevColCountRef.current = colCount;

        // Appended cards: bind immediately only if the first batch was already bound.
        if (isAppend) {
            if (hasInitialBoundRef.current) bindPending();
            return;
        }

        const gridRect = grid.getBoundingClientRect();
        const nearViewport = gridRect.top < window.innerHeight * 1.15;

        if (nearViewport) {
            const id = requestAnimationFrame(() => bindPending());
            return () => cancelAnimationFrame(id);
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                bindPending();
                io.disconnect();
            },
            { root: null, rootMargin: "20% 0px", threshold: 0 }
        );
        io.observe(grid);
        return () => io.disconnect();
    }, [artworkIdsKey, colCount, artworks.length]);

    // 3. Remeasure when creators section above changes height.
    //    Also rescue any on-screen cards left invisible after the shift.
    useEffect(() => {
        const onLayout = () => {
            ScrollTrigger.refresh();
            requestAnimationFrame(() => {
                const root = gridRef.current;
                if (!root) return;
                root.querySelectorAll<HTMLElement>(".grid-item-imgwrap").forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    const onScreen = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
                    if (!onScreen) return;
                    const opacity = Number.parseFloat(window.getComputedStyle(el).opacity);
                    if (opacity < 0.6) {
                        gsap.set(el, {
                            opacity: 1,
                            z: 0,
                            rotateX: 0,
                            rotateZ: 0,
                            xPercent: 0,
                            yPercent: 0,
                            filter: "blur(0px) brightness(1)",
                        });
                    }
                });
            });
        };
        window.addEventListener("crestox:explore-layout", onLayout);
        return () => window.removeEventListener("crestox:explore-layout", onLayout);
    }, []);

    const dynamicImages = artworks.map((a) => ({
        src: a.primary_image_url,
        id: a.artwork_id,
        title: a.artwork_name || "Artwork",
        artistName: a.artist_name?.trim() || null,
        valuation: a.valuation ?? null,
        aspect: ASPECT_RATIOS[a.primary_image_orientation] || ASPECT_RATIOS[ImageOrientation.SQUARE],
    }));

    const allImages =
        dynamicImages.length === 0
            ? []
            : dynamicImages.length >= 12 || artworks.length >= 12
              ? dynamicImages
              : [...dynamicImages, ...dynamicImages, ...dynamicImages].slice(0, 20);

    type GridItem = (typeof allImages)[number];
    const columns: GridItem[][] = Array.from({ length: colCount }, () => []);
    allImages.forEach((item, i) => {
        columns[i % colCount].push(item);
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
                                {colItems.map(({ src, aspect, id, title, artistName, valuation }, rowIndex) => {
                                    const valuationLabel = formatRupeeValuation(valuation);
                                    const content = (
                                        <figure className="relative z-10 m-0" style={{ perspective: "1200px" }}>
                                            <div
                                                className={`grid-item-imgwrap group relative ${aspect} w-full overflow-hidden rounded-xl bg-muted border border-border shadow-2xl transition-shadow duration-500 hover:shadow-foreground/10`}
                                            >
                                                <div
                                                    className="grid-item-img absolute inset-0 h-full w-full bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${src})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                />
                                                {/* Same detail overlay pattern as Curated Collection */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                                                <div className="absolute left-0 bottom-0 right-0 p-4 md:p-5 z-[11] pointer-events-none text-left opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                                    <h3 className="text-white font-serif font-bold text-base md:text-lg leading-snug">
                                                        {title}
                                                    </h3>
                                                    {artistName ? (
                                                        <p className="mt-1.5 font-serif text-sm md:text-base text-white/95 leading-snug">
                                                            <span className="font-normal">by </span>
                                                            {artistName}
                                                        </p>
                                                    ) : null}
                                                    {valuationLabel ? (
                                                        <p className="mt-1.5 font-serif font-bold text-sm md:text-base text-white leading-snug">
                                                            {valuationLabel}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </figure>
                                    );

                                    return id ? (
                                        <Link
                                            key={`art-${id}-col-${colIndex}-row-${rowIndex}`}
                                            href={`/art/${id}`}
                                            className="block w-full"
                                            aria-label={`View artwork: ${title}`}
                                        >
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

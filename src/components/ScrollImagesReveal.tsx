"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const IMAGES = [
    "https://images.unsplash.com/photo-1774280474652-c3bcfd423a0e?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1773493082457-ce42ded2b664?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1773698719619-51e67f93a39f?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1773814776704-6551ec7809ca?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1774279922162-7519ca5f0cdc?w=900&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1749499938590-40291c621d2d?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1773698709216-873151dc89ae?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1774008717634-4fe7961d0f59?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1774105618837-21ea179aef8a?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1774178149444-73bea28a0bab?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1774124916928-c2a97a29f1c7?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1774008593957-89bcc55ffcc4?w=900&auto=format&fit=crop&q=60",
];

function useColumns() {
    const [cols, setCols] = useState(5);

    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 768) setCols(2);
            else if (window.innerWidth < 1024) setCols(4);
            else setCols(5);
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return cols;
}

export default function ScrollImagesReveal({
    bgClass = "bg-background",
}: {
    bgClass?: string;
}) {
    const gridRef = useRef<HTMLDivElement>(null);
    const cols = useColumns();

    const allItems = [...IMAGES, ...IMAGES.slice(0, 8)];
    const columns = Array.from({ length: cols }, () => [] as string[]);

    allItems.forEach((item, i) => {
        columns[i % cols].push(item);
    });

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth < 768;

        // ✅ Lenis only on desktop
        let lenis: Lenis | null = null;

        if (!isMobile) {
            lenis = new Lenis({
                lerp: 0.08,
                smoothWheel: true,
            });

            const raf = (time: number) => {
                lenis!.raf(time);
                requestAnimationFrame(raf);
            };

            requestAnimationFrame(raf);
            lenis.on("scroll", ScrollTrigger.update);
        }

        const timeout = setTimeout(() => {
            const items =
                gridRef.current?.querySelectorAll<HTMLElement>(".grid-item") || [];

            items.forEach((wrapper) => {
                const isMobile = window.innerWidth < 768;
                const offset = isMobile ? 50 : 120;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: isMobile ? "top 95%" : "top 90%",
                        end: isMobile ? "top 60%" : "bottom top",

                        // 🔥 mobile vs desktop behavior
                        scrub: isMobile ? false : true,
                        toggleActions: isMobile
                            ? "play none none reverse"
                            : undefined,
                    },
                });

                // 🟢 ENTER
                tl.fromTo(
                    wrapper,
                    {
                        y: offset,
                        opacity: 0,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out",
                    }
                );

                // 🟡 + 🔴 Desktop only (stay + exit)
                if (!isMobile) {
                    tl.to(wrapper, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                    }).to(wrapper, {
                        y: offset,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in",
                    });
                }
            });

            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timeout);
            if (lenis) lenis.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <div className={`relative w-full pb-24 ${bgClass}`}>
            <section className="w-full">
                <div
                    ref={gridRef}
                    className="flex w-full max-w-[95vw] mx-auto gap-4 sm:gap-6 py-10 px-4 items-start"
                >
                    {columns.map((colItems, colIndex) => (
                        <div
                            key={colIndex}
                            className="flex flex-col gap-4 sm:gap-6 flex-1"
                        >
                            {colItems.map((src, rowIndex) => (
                                <figure
                                    key={`${colIndex}-${rowIndex}`}
                                    className="grid-item w-full overflow-hidden rounded-md"
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className="w-full h-auto object-cover"
                                    />
                                </figure>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
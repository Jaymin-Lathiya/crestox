"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const IMAGES = [

    "https://images.unsplash.com/photo-1774280474652-c3bcfd423a0e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D",

    "https://images.unsplash.com/photo-1773493082457-ce42ded2b664?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDcyfGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1773698719619-51e67f93a39f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D",

    "https://images.unsplash.com/photo-1773814776704-6551ec7809ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDgxfGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1774279922162-7519ca5f0cdc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D",

    "https://plus.unsplash.com/premium_photo-1749499938590-40291c621d2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUzfGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1773698709216-873151dc89ae?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D",

    "https://images.unsplash.com/photo-1774008717634-4fe7961d0f59?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ3fGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1774105618837-21ea179aef8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIzfGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1774178149444-73bea28a0bab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1774124916928-c2a97a29f1c7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMwfGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

    "https://images.unsplash.com/photo-1774008593957-89bcc55ffcc4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ2fGhtZW52UWhVbXhNfHxlbnwwfHx8fHw%3D",

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

export default function ScrollImagesReveal({ bgClass = "bg-background" }: { bgClass?: string }) {
    const gridRef = useRef<HTMLDivElement>(null);
    const cols = useColumns();

    const allItems = [...IMAGES, ...IMAGES.slice(0, 8)];
    const columns = Array.from({ length: cols }, () => [] as string[]);
    allItems.forEach((item, i) => columns[i % cols].push(item));

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Lenis smooth scroll
        const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        let rafId: number;
        const raf = (t: number) => {
            lenis.raf(t);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        gsap.ticker.lagSmoothing(0);

        // Delay to allow DOM layout to settle before calculating positions
        const timeout = setTimeout(() => {
            const gridWrappers = gridRef.current?.querySelectorAll<HTMLElement>(".grid-item-imgwrap");
            if (!gridWrappers) return;

            gridWrappers.forEach((wrapper) => {
                const img = wrapper.querySelector(".grid-item-img");
                const rect = wrapper.getBoundingClientRect();
                const isLeft = (rect.left + rect.width / 2) < (window.innerWidth / 2);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom+=10%",
                        end: "bottom top-=25%",
                        scrub: true,
                    }
                });

                tl.from(wrapper, {
                    startAt: { filter: "blur(0px) brightness(100%) contrast(100%)" },
                    z: 300,
                    rotateX: 70,
                    rotateZ: isLeft ? 5 : -5,
                    xPercent: isLeft ? -40 : 40,
                    skewX: isLeft ? -20 : 20,
                    yPercent: 100,
                    filter: "blur(7px) brightness(0%) contrast(400%)",
                    ease: "sine"
                })
                    .to(wrapper, {
                        z: 300,
                        rotateX: -50,
                        rotateZ: isLeft ? -1 : 1,
                        xPercent: isLeft ? -20 : 20,
                        skewX: isLeft ? 10 : -10,
                        filter: "blur(4px) brightness(0%) contrast(500%)",
                        ease: "sine.in"
                    });

                if (img) {
                    tl.from(img, { scaleY: 1.8, ease: "sine" }, 0)
                        .to(img, { scaleY: 1.8, ease: "sine.in" }, ">");
                }
            });
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(rafId);
            lenis.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.globalTimeline.clear();
        };
    }, []);

    return (
        <div className={`relative w-full overflow-hidden pb-24 top-0 ${bgClass}`}>
            <div className="relative w-full overflow-hidden">
                <section className="relative grid w-full place-items-center">
                    <div ref={gridRef} className="relative flex w-full max-w-[95vw] mx-auto gap-4 sm:gap-6 py-10 px-4 items-start">
                        {columns.map((colItems, colIndex) => (
                            <div key={colIndex} className="flex flex-col gap-4 sm:gap-6 flex-1">
                                {colItems.map((src, rowIndex) => (
                                    <figure key={`${colIndex}-${rowIndex}`} className="relative z-10 m-0 w-full" style={{ perspective: "800px", willChange: "transform" }}>
                                        <div className="grid-item-imgwrap relative w-full overflow-hidden rounded-[8px] sm:rounded-[4px] will-change-[filter] bg-muted dark:bg-card">
                                            <img src={src} alt="" className="w-full h-auto opacity-0 pointer-events-none" aria-hidden="true" />
                                            <div
                                                className="grid-item-img absolute inset-0 w-full h-full bg-cover bg-center will-change-transform"
                                                style={{ backgroundImage: `url(${src})`, backfaceVisibility: "hidden" }}
                                            />
                                        </div>
                                    </figure>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
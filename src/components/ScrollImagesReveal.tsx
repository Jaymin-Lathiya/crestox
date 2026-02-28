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

export default function ScrollImagesReveal({ bgClass = "bg-[#0a0a0a]" }: { bgClass?: string }) {
    const gridRef = useRef<HTMLDivElement>(null);

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
                    <div ref={gridRef} className="relative grid w-full max-w-[95vw] grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 py-10 px-4">
                        {[...IMAGES, ...IMAGES.slice(0, 8)].map((src, i) => (
                            <figure key={i} className="relative z-10 m-0" style={{ perspective: "800px", willChange: "transform" }}>
                                <div className="grid-item-imgwrap relative aspect-[4/5] w-full overflow-hidden rounded-[8px] sm:rounded-[4px] will-change-[filter] bg-[#1c1c1c]">
                                    <div
                                        className="grid-item-img absolute -left-0 -top-0 h-full w-full bg-cover bg-center will-change-transform"
                                        style={{ backgroundImage: `url(${src})`, backfaceVisibility: "hidden" }}
                                    />
                                </div>
                            </figure>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
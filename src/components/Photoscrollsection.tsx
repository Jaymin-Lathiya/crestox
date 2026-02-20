"use client";

import { useEffect, useRef } from "react";

const IMAGES = [
    { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop", alt: "Fashion 1" },
    { src: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&h=400&fit=crop", alt: "Portrait 1" },
    { src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", alt: "Stars" },
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", alt: "Portrait 2" },
    { src: "https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&h=400&fit=crop", alt: "Horses" },
    { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", alt: "Shopping" },
    { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop", alt: "Porsche" },
    { src: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=400&fit=crop", alt: "Eye close" },
    { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop", alt: "Fashion 2" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop", alt: "Portrait 3" },
    { src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop", alt: "Eye macro" },
    { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", alt: "Mountain" },
    { src: "https://images.unsplash.com/photo-1614728263952-84ea256f9d1d?w=600&h=400&fit=crop", alt: "Abstract" },
    { src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop", alt: "Cassette" },
    { src: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=400&fit=crop", alt: "Aurora" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", alt: "Office" },
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop", alt: "Chrome" },
    { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop", alt: "Ocean" },
    { src: "https://images.unsplash.com/photo-1583394293214-6ff819cd23eb?w=600&h=400&fit=crop", alt: "Ice cubes" },
    { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", alt: "Blue arch" },
];

// Final 5x4 grid — each card center in vw/vh
const GRID = Array.from({ length: 20 }, (_, i) => ({
    cx: (i % 5) * 20 + 10,
    cy: Math.floor(i / 5) * 25 + 12.5,
    col: i % 5,
    row: Math.floor(i / 5),
}));

// Mid-scroll scattered organic positions (matches screenshots 3-5)
// These are approximate cx/cy in vw/vh with skew/rotation
const SCATTERED = [
    { cx: 19, cy: 38, rotate: -3, skewX: -8 },
    { cx: 36, cy: 62, rotate: -5, skewX: -10 },
    { cx: 50, cy: 32, rotate: 2, skewX: 4 },
    { cx: 50, cy: 58, rotate: 0, skewX: 0 },
    { cx: 66, cy: 38, rotate: 4, skewX: 8 },
    { cx: 14, cy: 52, rotate: -9, skewX: -14 },
    { cx: 35, cy: 50, rotate: -5, skewX: -9 },
    { cx: 45, cy: 45, rotate: -2, skewX: -4 },
    { cx: 61, cy: 52, rotate: 3, skewX: 6 },
    { cx: 76, cy: 46, rotate: 6, skewX: 11 },
    { cx: 19, cy: 68, rotate: -8, skewX: -12 },
    { cx: 31, cy: 74, rotate: -6, skewX: -8 },
    { cx: 50, cy: 76, rotate: -2, skewX: -4 },
    { cx: 67, cy: 70, rotate: 3, skewX: 6 },
    { cx: 83, cy: 62, rotate: 7, skewX: 12 },
    { cx: 87, cy: 38, rotate: 8, skewX: 13 },
    { cx: 22, cy: 82, rotate: -7, skewX: -10 },
    { cx: 38, cy: 42, rotate: -4, skewX: -6 },
    { cx: 62, cy: 80, rotate: 2, skewX: 4 },
    { cx: 89, cy: 78, rotate: 9, skewX: 14 },
];

function easeOutExpo(t: number) {
    return t === 0 ? 0 : t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}

export default function PhotoScrollSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const cards = Array.from(section.querySelectorAll<HTMLDivElement>(".pcard"));

        function tick() {
            const rect = section!.getBoundingClientRect();
            const scrollable = section!.offsetHeight - window.innerHeight;
            const scrolled = Math.max(0, -rect.top);
            const progress = clamp01(scrolled / scrollable);

            cards.forEach((card, i) => {
                const g = GRID[i];
                const s = SCATTERED[i] ?? { cx: 50, cy: 50, rotate: 0, skewX: 0 };

                // Distance from center of grid for stagger
                const dist = Math.sqrt(Math.pow(g.col - 2, 2) + Math.pow(g.row - 1.5, 2));
                const maxDist = Math.sqrt(4 + 2.25);
                const norm = dist / maxDist; // 0 = center, 1 = corner

                // Phase 1: 0 → 0.6  (emerge from vanishing point to scattered)
                // Phase 2: 0.5 → 1  (scattered to flat grid)
                const p1Delay = norm * 0.18; // center cards emerge first
                const p1 = easeOutExpo(clamp01((progress - p1Delay) / (0.6 - p1Delay)));

                const p2Start = 0.45 + norm * 0.1; // corner cards snap to grid last
                const p2 = easeInOutCubic(clamp01((progress - p2Start) / (1 - p2Start)));

                // Positions
                const cx = p2 < 0.001
                    ? lerp(50, s.cx, p1)
                    : lerp(s.cx, g.cx, p2);
                const cy = p2 < 0.001
                    ? lerp(92, s.cy, p1)
                    : lerp(s.cy, g.cy, p2);

                // Rotation
                const rotate = p2 < 0.001
                    ? lerp(0, s.rotate, p1)
                    : lerp(s.rotate, 0, p2);

                // SkewX (perspective warp)
                const skewX = p2 < 0.001
                    ? lerp(0, s.skewX, p1)
                    : lerp(s.skewX, 0, p2);

                // Scale: starts tiny, grows to scattered (~0.5), then full (1)
                const scale = p2 < 0.001
                    ? lerp(0.04, 0.5, p1)
                    : lerp(0.5, 1, p2);

                // rotateX: heavy 3D tilt early, flattens to 0 by phase 2
                const rotateX = p2 < 0.001
                    ? lerp(60, 20, p1)
                    : lerp(20, 0, p2);

                // Opacity
                const opacity = clamp01(p1 * 4);

                card.style.left = `${cx}vw`;
                card.style.top = `${cy}vh`;
                card.style.opacity = `${opacity}`;
                card.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotateX}deg) rotate(${rotate}deg) skewX(${skewX}deg) scale(${scale})`;
                card.style.zIndex = `${Math.round(20 - norm * 10)}`;
            });
        }

        window.addEventListener("scroll", tick, { passive: true });
        tick();
        return () => window.removeEventListener("scroll", tick);
    }, []);

    return (
        <div
            ref={sectionRef}
            style={{ height: "110vh", background: "#0a0a0a" }}
            className="relative"
        >
            <div
                className="sticky top-0 w-full overflow-hidden"
                style={{ height: "100vh" }}
            >
                <div className="absolute inset-0">
                    {IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className="pcard absolute"
                            style={{
                                width: "19vw",
                                height: "23vh",
                                left: "50vw",
                                top: "92vh",
                                transform: "translate(-50%, -50%) scale(0.04)",
                                opacity: 0,
                                willChange: "transform, opacity, left, top",
                                transformOrigin: "center center",
                            }}
                        >
                            <div
                                className="w-full h-full overflow-hidden"
                                style={{ borderRadius: "3px" }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover block select-none"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edge vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 25%, rgba(10,10,10,0.55) 100%)",
                        zIndex: 99,
                    }}
                />
            </div>
        </div>
    );
}
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PAD_X = 24;

interface Image {
  src: string;
  alt: string;
  title?: string;
  /** When set, the tile navigates to this path (e.g. `/art/123`) */
  href?: string;
}

interface PhotoScrollSectionProps {
  bgClass?: string;
  images: Image[];
}

export default function PhotoScrollSection({
  bgClass = "bg-black",
  images,
}: PhotoScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Wait for all images to load to accurately calculate their *true original* sizes
    const cardNodes = cardsRef.current.filter(Boolean);
    if (!cardNodes.length) return;

    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= cardNodes.length) {
        setImagesLoaded(true);
      }
    };

    // Failsafe timeout so the gallery never stays hidden for long
    const timeoutId = setTimeout(() => setImagesLoaded(true), 250);

    cardNodes.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) {
        checkAllLoaded();
        return;
      }
      if (img.complete) {
        checkAllLoaded();
      } else {
        const handleLoad = () => checkAllLoaded();
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleLoad);
      }
    });

    return () => clearTimeout(timeoutId);
  }, [images]);

  // Native `scroll-behavior: smooth` on <html> fights ScrollTrigger scrub and causes stutter.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  useEffect(() => {
    // Only run GSAP after original sizes are known!
    if (!imagesLoaded || images.length === 0) return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    function computeLayout(): {
      layout: { x: number; y: number; cw: number; ch: number }[];
      totalH: number;
    } {
      // Masonry Layout logic to strictly preserve the exact original image aspect ratio!
      const cols = window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4;
      const colHeights = new Array(cols).fill(0);

      const gap = 24;
      const availableW = window.innerWidth - PAD_X * 2 - (cols - 1) * gap;
      const cw = availableW / cols;

      const layout = Array.from({ length: images.length }).map((_, i) => {
        const cardNode = cardsRef.current[i];
        const imgNode = cardNode?.querySelector("img");

        // Exact original aspect ratio
        let ratio = 1;
        if (imgNode && imgNode.naturalWidth && imgNode.naturalHeight) {
          ratio = imgNode.naturalWidth / imgNode.naturalHeight;
        } else {
          // Fallback array if somehow natural size fails
          const aspectRatios = [1.5, 0.8, 1.25, 0.66, 1, 1.77, 0.75, 1.33, 0.8, 1.5];
          ratio = aspectRatios[i % aspectRatios.length];
        }

        // Height calculates natively based on cell width and true ratio
        const ch = Math.floor(cw / ratio);

        // Find shortest column to place the next image (Masonry stacking)
        let smallestCol = 0;
        let minH = colHeights[0];
        for (let c = 1; c < cols; c++) {
          if (colHeights[c] < minH) {
            minH = colHeights[c];
            smallestCol = c;
          }
        }

        const x = smallestCol * (cw + gap) - (cols * cw + (cols - 1) * gap) / 2 + cw / 2;
        const y = colHeights[smallestCol] + ch / 2;

        colHeights[smallestCol] += ch + gap;

        return { x, y, cw, ch };
      });

      const totalH = Math.max(...colHeights) - gap;
      const centered = layout.map(item => ({
        ...item,
        y: item.y - totalH / 2,
      }));
      return { layout: centered, totalH };
    }

    function applyLayout(
      layout: { x: number; y: number; cw: number; ch: number }[]
    ) {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const { x, y, cw, ch } = layout[i];
        gsap.set(card, { x, y, width: cw, height: ch });
      });
    }

    let { layout, totalH } = computeLayout();
    const vh = window.innerHeight;
    // When masonry is taller than the viewport, pan the wrapper so scroll reveals top → bottom
    const excess = Math.max(0, totalH - vh);
    const panYTop = excess > 0 ? totalH / 2 - vh / 2 : 0;
    const panYBottom = excess > 0 ? vh / 2 - totalH / 2 : 0;

    // Set initial state — keep cards partially visible so section doesn't look empty
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const { x, y, cw, ch } = layout[i];
      gsap.set(card, {
        x,
        y,
        width: cw,
        height: ch,
        scale: 0.65,
        opacity: 0.35,
        transformOrigin: "center center",
        force3D: true,
      });
    });

    gsap.set(wrapper, {
      y: panYTop,
      scale: 1.8,
      transformOrigin: "center center",
      force3D: true,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const h = window.innerHeight;
            const { totalH: th } = computeLayout();
            const ex = Math.max(0, th - h);
            return "+=" + (h * 2.5 + ex * 1.25);
          },
          pin: true,
          // Light smoothing — large values (e.g. 2) lag behind scroll and feel stepped
          scrub: 0.55,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        wrapper,
        { scale: 1.8, y: panYTop, transformOrigin: "center center", force3D: true },
        { scale: 1, y: panYTop, ease: "power1.inOut", duration: 0.28, force3D: true },
        0
      );

      if (excess > 0) {
        tl.fromTo(
          wrapper,
          { y: panYTop, force3D: true },
          { y: panYBottom, ease: "none", duration: 0.72, force3D: true },
          0.28
        );
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const { x, y, cw, ch } = layout[i];
        tl.fromTo(
          card,
          {
            x,
            y,
            width: cw,
            height: ch,
            scale: 0.65,
            opacity: 0.35,
            transformOrigin: "center center",
            force3D: true,
          },
          {
            x,
            y,
            width: cw,
            height: ch,
            scale: 1,
            opacity: 1,
            ease: "expo.out",
            duration: 1,
            force3D: true,
          },
          0
        );
      });
    }, section);

    const onResize = () => {
      const next = computeLayout();
      layout = next.layout;
      totalH = next.totalH;
      applyLayout(layout);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, [imagesLoaded, images]);

  return (
    <div
      ref={sectionRef}
      className={`relative ${bgClass}`}
      style={{ height: "100vh" }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden flex items-center justify-center transition-opacity duration-1000"
        style={{ height: "100vh", opacity: imagesLoaded ? 1 : 0.8 }}
      >
        <div
          ref={wrapperRef}
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {images.map((img, i) => (
              <div
                key={i}
                ref={(el) => { if (el) cardsRef.current[i] = el; }}
                className={`${img.href ? "cursor-pointer" : ""} group`}
                style={{
                  position: "absolute",
                  borderRadius: "12px",
                  overflow: "hidden",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5 z-[11] pointer-events-none opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <h3 className="text-white font-serif text-base md:text-xl leading-tight">
                    {img.title ?? img.alt}
                  </h3>
                </div>
                {img.href ? (
                  <Link
                    href={img.href}
                    className="absolute inset-0 z-20"
                    aria-label={`View artwork: ${img.alt}`}
                    prefetch={false}
                  >
                    <span className="sr-only">View artwork</span>
                  </Link>
                ) : null}
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
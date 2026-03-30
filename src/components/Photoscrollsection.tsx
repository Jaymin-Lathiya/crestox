"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL = 20;
const PAD_X = 24;

interface Image {
  src: string;
  alt: string;
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

    // Failsafe timeout so the gallery never stays hidden
    const timeoutId = setTimeout(() => setImagesLoaded(true), 800);

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

  useEffect(() => {
    // Only run GSAP after original sizes are known!
    if (!imagesLoaded) return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    function computeLayout() {
      // Masonry Layout logic to strictly preserve the exact original image aspect ratio!
      const cols = window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4;
      const colHeights = new Array(cols).fill(0);

      const gap = 24;
      const availableW = window.innerWidth - PAD_X * 2 - (cols - 1) * gap;
      const cw = availableW / cols;

      const layout = Array.from({ length: TOTAL }).map((_, i) => {
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
      return layout.map(item => ({
        ...item,
        y: item.y - totalH / 2
      }));
    }

    function applyLayout(layout: ReturnType<typeof computeLayout>) {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const { x, y, cw, ch } = layout[i];
        gsap.set(card, { x, y, width: cw, height: ch });
      });
    }

    let layout = computeLayout();

    // Set initial state
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const { x, y } = layout[i];
      gsap.set(card, { x, y, width: 1, height: 1, opacity: 0 });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        wrapper,
        { scale: 4, transformOrigin: "center center" },
        { scale: 1, ease: "power1.inOut", duration: 0.5 },
        0
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const { x, y, cw, ch } = layout[i];
        tl.fromTo(
          card,
          { x, y, width: 1, height: 1, opacity: 0 },
          { x, y, width: cw, height: ch, opacity: 1, ease: "expo.out", duration: 1 },
          0
        );
      });
    }, section);

    const onResize = () => {
      layout = computeLayout();
      applyLayout(layout);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, [imagesLoaded]);

  return (
    <div
      ref={sectionRef}
      className={`relative ${bgClass}`}
      style={{ height: "100vh" }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden flex items-center justify-center transition-opacity duration-1000"
        style={{ height: "100vh", opacity: imagesLoaded ? 1 : 0 }}
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
          }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const img = images[i % images.length];
            return (
              <div
                key={i}
                ref={(el) => { if (el) cardsRef.current[i] = el; }}
                style={{
                  position: "absolute",
                  borderRadius: "12px",
                  overflow: "hidden",
                  willChange: "transform, width, height, opacity",
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
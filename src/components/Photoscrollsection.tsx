"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COLS  = 5;
const ROWS  = 4;
const TOTAL = COLS * ROWS;
const GAP   = 10;
const PAD_X = 24;

interface Image {
  src: string;
  alt: string;
}

interface PhotoScrollSectionProps {
  bgClass?: string;
  images: Image[];
}

// Responsive vertical padding — more padding on tall screens, less on short/mobile
function getResponsivePadY(): number {
  const h = window.innerHeight;
  if (h < 600)  return 8;   // very small (mobile landscape)
  if (h < 768)  return 14;  // small tablets / phones
  if (h < 900)  return 20;  // medium
  return 28;                 // large desktop
}

// Responsive gap — tighter on small screens
function getResponsiveGap(): number {
  const h = window.innerHeight;
  if (h < 600) return 6;
  if (h < 768) return 8;
  return GAP;
}

export default function PhotoScrollSection({
  bgClass = "bg-black",
  images,
}: PhotoScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    function computeLayout() {
      const padY = getResponsivePadY();
      const gap  = getResponsiveGap();

      const cw = Math.floor((window.innerWidth  - PAD_X * 2 - (COLS - 1) * gap) / COLS);
      const ch = Math.floor((window.innerHeight - padY  * 2 - (ROWS - 1) * gap) / ROWS);
      // const ch = Math.floor(cw * (4 / 3));

      const totalW = COLS * cw + (COLS - 1) * gap;
      const totalH = ROWS * ch + (ROWS - 1) * gap;

      return Array.from({ length: TOTAL }).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x   = col * (cw + gap) - totalW / 2 + cw / 2;
        const y   = row * (ch + gap) - totalH / 2 + ch / 2;
        return { x, y, cw, ch };
      });
    }

    function applyLayout(layout: ReturnType<typeof computeLayout>) {
      cardsRef.current.forEach((card, i) => {
        const { x, y, cw, ch } = layout[i];
        gsap.set(card, { x, y, width: cw, height: ch });
      });
    }

    let layout = computeLayout();

    // Set initial state — all cards as 1px dots
    cardsRef.current.forEach((card, i) => {
      const { x, y } = layout[i];
      gsap.set(card, { x, y, width: 1, height: 1, opacity: 0 });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       section,
          start:         "top top",
          end:           "+=250%",
          pin:           true,
          scrub:         2,
          anticipatePin: 1,
        },
      });

      // Wrapper zoom out
      tl.fromTo(
        wrapper,
        { scale: 4, transformOrigin: "center center" },
        { scale: 1, ease: "power1.inOut", duration: 0.5 },
        0
      );

      // Cards grow from 1px dot to full size
      cardsRef.current.forEach((card, i) => {
        const { x, y, cw, ch } = layout[i];
        tl.fromTo(
          card,
          { x, y, width: 1,  height: 1,  opacity: 0 },
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
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative ${bgClass}`}
      style={{ height: "100vh" }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden flex items-center justify-center"
        style={{ height: "100vh" }}
      >
        <div
          ref={wrapperRef}
          style={{
            position:        "relative",
            width:           "100vw",
            height:          "100vh",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
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
                  position:   "absolute",
                  borderRadius: "6px",
                  overflow:   "hidden",
                  willChange: "transform, width, height, opacity",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width:         "100%",
                    height:        "100%",
                    objectFit:     "cover",
                    display:       "block",
                    pointerEvents: "none",
                    userSelect:    "none",
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
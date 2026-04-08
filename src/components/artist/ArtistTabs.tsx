"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type TabType = "artworks" | "analytics" | "achievements" | "history" | "collectors";

interface ArtistTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "artworks", label: "Artworks" },
  { id: "analytics", label: "Analytics" },
  { id: "achievements", label: "Achievements" },
  { id: "history", label: "History" },
  { id: "collectors", label: "Collectors" },
];

const ArtistTabs: React.FC<ArtistTabsProps> = ({ activeTab, onTabChange }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const updateScrollHints = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const epsilon = 4;
    const scrollable = scrollWidth > clientWidth + epsilon;
    setIsScrollable(scrollable);
    setCanScrollLeft(scrollable && scrollLeft > epsilon);
    setCanScrollRight(scrollable && scrollLeft < maxScroll - epsilon);
  }, []);

  useEffect(() => {
    updateScrollHints();
    const el = scrollerRef.current;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollHints) : null;
    if (el) ro?.observe(el);

    const onResize = () => updateScrollHints();
    window.addEventListener("resize", onResize);

    let raf = 0;
    const afterLayout = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        requestAnimationFrame(updateScrollHints);
      });
    };
    afterLayout();

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [updateScrollHints, activeTab]);

  return (
    <div className="w-full">
      <div className="relative md:static">
        {/* Mobile: left edge — more content off-screen to the left */}
        <div
          className={`pointer-events-none absolute left-0 top-0 z-[1] h-11 w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-200 md:hidden ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />

        {/* Mobile: right edge — more tabs ahead */}
        <div
          className={`pointer-events-none absolute right-0 top-0 z-[1] h-11 w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 md:hidden ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />

        {/* Nudge icon when there is overflow on the right */}
        {isScrollable && canScrollRight && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            aria-hidden
            className="pointer-events-none absolute right-1 z-[2] flex h-11 -translate-y-1/2 items-center md:hidden"
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground/70 drop-shadow-sm" strokeWidth={2} />
          </motion.div>
        )}

        <div
          ref={scrollerRef}
          className="-mx-4 flex overflow-x-auto px-4 pb-2 scrollbar-hide md:mx-0 md:justify-center md:px-0"
          onScroll={updateScrollHints}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex h-11 min-w-max shrink-0 items-center rounded-full border border-border bg-card/80 p-1 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`relative whitespace-nowrap rounded-full px-3 py-2 font-mono text-xs font-medium transition-colors duration-200 md:px-5 ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-muted"
                    layoutId="activeTabBg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {isScrollable && (
        <p className="mt-1.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:hidden">
          Scroll sideways for more tabs
        </p>
      )}
    </div>
  );
};

export default ArtistTabs;

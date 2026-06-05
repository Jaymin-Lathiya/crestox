"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

const tabs = ["Artworks", "Artists", "Portfolios"];

export default function RecommendationsSection() {
  const [activeTab, setActiveTab] = useState("Artworks");

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Header row */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
          <div>
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary mb-3">
              YOUR CURATED FEED
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight">
              Recommendations
            </h2>
          </div>

          {/* Tab row */}
          <div className="inline-flex gap-1 bg-muted/60 dark:bg-muted/40 border border-border rounded-xl p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 rounded-lg text-[13px] font-medium border-0 transition-all duration-200 cursor-pointer ${
                  activeTab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Empty canvas */}
        <div className="relative bg-card border border-dashed border-border/80 rounded-3xl p-8 overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-[20%] w-[40%] h-[40%] bg-primary/4 rounded-full blur-[80px]" />
          </div>

          {/* Banner */}
          <div className="relative flex items-center gap-3.5 px-5 py-4 mb-7 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-0.5">
                Awaiting your first prompt
              </h4>
              <p className="text-[13px] text-muted-foreground m-0">
                Tell CreAI what you're looking for above, or pick a suggested
                theme. Personalized artworks, artists and portfolios will
                populate here — each with an explanation of{" "}
                <em className="italic">why</em> it was recommended.
              </p>
            </div>
          </div>

          {/* Skeleton grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Skeleton card ───────────────────────────────────────── */
function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div className="bg-card/50 dark:bg-card/30 border border-border rounded-2xl p-3.5">
      {/* Image placeholder */}
      <div
        className="aspect-[4/5] rounded-xl relative overflow-hidden"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.3) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Text lines */}
      <div
        className="h-2.5 rounded-md bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer mt-3.5 w-[80%]"
        style={{ animationDelay: `${delay + 0.1}s` }}
      />
      <div
        className="h-2.5 rounded-md bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer mt-2.5 w-[55%]"
        style={{ animationDelay: `${delay + 0.2}s` }}
      />

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div
          className="w-[60px] h-[22px] rounded-full bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer"
          style={{ animationDelay: `${delay + 0.3}s` }}
        />
        <div
          className="w-[92px] h-[30px] rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 bg-[length:200%_100%] animate-shimmer"
          style={{ animationDelay: `${delay + 0.3}s` }}
        />
      </div>
    </div>
  );
}

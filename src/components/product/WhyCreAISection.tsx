"use client";

import React from "react";
import { Asterisk, TrendingUp, Globe } from "lucide-react";

const features = [
  {
    icon: Asterisk,
    title: "Explainable Recommendations",
    desc: 'Every artwork, artist, and portfolio includes a plain-English "why this was recommended" rationale — no black box.',
  },
  {
    icon: TrendingUp,
    title: "Market-Aware Signals",
    desc: "Live fractal demand, liquidity, grade and appreciation history feed the engine — recommendations evolve with the market.",
  },
  {
    icon: Globe,
    title: "One-Click Acquisition",
    desc: "Collect entire baskets in a single transaction — CreAI auto-resolves inventory across primary and secondary markets.",
  },
];

export default function WhyCreAISection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Section header */}
        <p className="text-center font-mono text-xs tracking-[0.22em] uppercase text-primary mb-3">
          WHY CREAI
        </p>
        <h2 className="text-center text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mb-3">
          More than search.
          <br />A{" "}
          <em className="italic text-primary font-serif font-medium">
            digital advisor
          </em>
          .
        </h2>
        <p className="text-center text-muted-foreground max-w-[620px] mx-auto mb-10 text-base">
          Built for collectors who want guided discovery without losing
          transparency or control.
        </p>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-card border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-[22px] font-medium mt-4 mb-2 text-foreground">
                  {f.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed m-0">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

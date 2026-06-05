"use client";

import React from "react";
import {
  MessageSquare,
  Clock,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "STEP 01",
    title: "Describe Intent",
    desc: "Natural-language prompt, suggested chips, or advanced filters covering budget, risk, horizon, grade and style.",
  },
  {
    icon: Clock,
    step: "STEP 02",
    title: "AI Analyzes Signals",
    desc: "Engine blends user history, holdings, artwork metadata, grading and live marketplace data into a ranked match score.",
  },
  {
    icon: LayoutGrid,
    step: "STEP 03",
    title: "Curated Output",
    desc: "Three recommendation types: individual artworks, artists to follow, and ready-made fractional portfolios.",
  },
  {
    icon: ShieldCheck,
    step: "STEP 04",
    title: "Save · Share · Collect",
    desc: "Save to your AI Collections, share a public link, regenerate, or collect the entire basket in a single transaction.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Section header */}
        <p className="text-center font-mono text-xs tracking-[0.22em] uppercase text-primary mb-3">
          THE METHOD
        </p>
        <h2 className="text-center text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mb-3">
          How{" "}
          <em className="italic text-primary font-serif font-medium">CreAI</em>{" "}
          Curates
        </h2>
        <p className="text-center text-muted-foreground max-w-[620px] mx-auto mb-10 text-base">
          A transparent, AI-assisted advisory layer that sits between
          exploration and acquisition.
        </p>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                {/* Step label */}
                <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground mb-1.5">
                  {s.step}
                </p>
                <h3 className="font-semibold text-base text-foreground mb-1.5">
                  {s.title}
                </h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed m-0">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

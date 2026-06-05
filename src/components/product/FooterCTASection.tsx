"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import GradientButton from "@/components/ui/gradiant-button";

export default function FooterCTASection() {
  return (
    <section className="max-w-[1180px] mx-auto px-6 pb-24">
      <div className="bg-card border border-border rounded-3xl py-14 px-7 text-center shadow-lg">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-primary bg-primary/5 border border-primary/20 px-3.5 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.18)]" />
          POWERED BY CRESTOX AI
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-medium mb-3">
          Begin your{" "}
          <em className="italic text-primary font-serif font-medium">
            AI-Curated
          </em>{" "}
          Collection
        </h2>
        <p className="text-muted-foreground max-w-[520px] mx-auto mb-6">
          Join 1,200+ collectors using CreAI to discover, evaluate, and build
          personalized fractional art portfolios.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <GradientButton
            label="Start with CreAI"
            variant="primary"
            className="h-12 px-6 text-sm"
          />
          <button className="h-12 px-6 rounded-xl bg-card border border-border text-foreground font-semibold text-sm transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30 cursor-pointer">
            Learn how it works
          </button>
        </div>
      </div>
    </section>
  );
}

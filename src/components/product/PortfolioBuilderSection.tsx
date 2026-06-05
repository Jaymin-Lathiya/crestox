"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import GradientButton from "@/components/ui/gradiant-button";

const portfolios = [
  {
    tag: "STARTER",
    title: "First Collection",
    budget: "From ₹10,000",
    meta: [
      { value: "3", label: "Artists" },
      { value: "150", label: "Fractals" },
      { value: "Low", label: "Risk" },
    ],
    bullets: [
      "Entry-level emerging artists",
      "Diversified across 2 style families",
      "Curated for first-time collectors",
    ],
    featured: false,
  },
  {
    tag: "GROWTH · POPULAR",
    title: "Momentum Basket",
    budget: "From ₹50,000",
    meta: [
      { value: "5", label: "Artists" },
      { value: "15", label: "Artworks" },
      { value: "Balanced", label: "Risk" },
    ],
    bullets: [
      "Mix of emerging + AAA-rated artists",
      "Optimised for 1–3 year horizon",
    ],
    diversificationScore: "8.4 / 10",
    featured: true,
  },
  {
    tag: "PRESTIGE",
    title: "Blue Chip Vault",
    budget: "From ₹2,00,000",
    meta: [
      { value: "7", label: "Artists" },
      { value: "AAA", label: "Grade" },
      { value: "Stable", label: "Risk" },
    ],
    bullets: [
      "Top-rated, blue-chip masters only",
      "Strong historical appreciation",
      "Audit-ready provenance trail",
    ],
    featured: false,
  },
];

export default function PortfolioBuilderSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Section header */}
        <p className="text-center font-mono text-xs tracking-[0.22em] uppercase text-primary mb-3">
          PORTFOLIO BUILDER
        </p>
        <h2 className="text-center text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mb-3">
          Ready-Made{" "}
          <em className="italic text-primary font-serif font-medium">
            AI Collections
          </em>
        </h2>
        <p className="text-center text-muted-foreground max-w-[620px] mx-auto mb-10 text-base">
          Diversified baskets built by CreAI across budgets and risk profiles.
          Pick one, customize it, and acquire in a single flow.
        </p>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portfolios.map((pf) => (
            <div
              key={pf.title}
              className={`relative bg-card border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 ${
                pf.featured
                  ? "bg-gradient-to-b from-card to-primary/5 border-primary/20"
                  : ""
              }`}
            >
              {/* Tag */}
              <span className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mb-4">
                {pf.tag}
              </span>

              {/* Title */}
              <h3 className="font-serif text-[28px] leading-[1.1] font-medium text-foreground mb-1.5">
                {pf.title}
              </h3>

              {/* Budget */}
              <p className="text-primary font-semibold text-sm mb-5">
                {pf.budget}
              </p>

              {/* Meta row */}
              <div className="flex gap-5 py-3.5 border-t border-b border-border mb-5">
                {pf.meta.map((m) => (
                  <div key={m.label} className="text-xs text-muted-foreground">
                    <strong className="block text-foreground text-lg font-semibold font-serif mb-0.5">
                      {m.value}
                    </strong>
                    {m.label}
                  </div>
                ))}
              </div>

              {/* Bullets */}
              <ul className="list-none p-0 m-0 mb-5 text-[13.5px] text-muted-foreground space-y-1.5">
                {pf.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-primary shrink-0" />
                    {b}
                  </li>
                ))}
                {pf.diversificationScore && (
                  <li className="flex items-center gap-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-primary shrink-0" />
                    Diversification score:{" "}
                    <strong className="text-primary">
                      {pf.diversificationScore}
                    </strong>
                  </li>
                )}
              </ul>

              {/* CTA */}
              <GradientButton
                label="Preview Collection →"
                variant={pf.featured ? "primary" : "secondary"}
                className="w-full h-11 text-[13.5px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

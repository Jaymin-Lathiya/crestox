"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  MonitorSmartphone,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import GradientButton from "@/components/ui/gradiant-button";

/* ── Suggested prompt chips ──────────────────────────────── */
const chips = [
  { label: "✦ Emerging Artists", prompt: "Emerging contemporary Indian artists with strong appreciation history" },
  { label: "◆ Blue Chip Collections", prompt: "Blue-chip investment-grade portfolios with low risk" },
  { label: "◐ Abstract Art", prompt: "Modern abstract artworks with bold compositions" },
  { label: "❋ Cultural Heritage", prompt: "Cultural heritage artworks from Indian regional traditions" },
  { label: "₹ Under ₹10,000", prompt: "Quality artworks under ₹10,000 for first-time collectors" },
  { label: "₹ Under ₹50,000", prompt: "Diversified portfolios under ₹50,000" },
  { label: "↗ High Growth", prompt: "High-growth emerging opportunities" },
  { label: "◯ Low Risk", prompt: "Conservative, low-risk artworks from AAA-rated artists" },
  { label: "♀ Women Artists", prompt: "Women artists redefining Indian contemporary art" },
];

/* ── Style tags ──────────────────────────────────────────── */
const styleTags = [
  "Abstract", "Modern", "Contemporary", "Figurative", "Landscape",
  "Conceptual", "Minimalist", "Folk", "Cultural", "Experimental",
];
const defaultStyleTags = new Set(["Abstract", "Contemporary"]);

const gradeTags = ["AAA", "AA", "A+", "A", "B"];
const defaultGradeTags = new Set(["AAA", "AA"]);

const creatorTags = ["Artist", "Curator", "Owner"];
const defaultCreatorTags = new Set(["Artist"]);

/* ── Format INR ──────────────────────────────────────────── */
const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ══════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [budget, setBudget] = useState(50000);
  const [risk, setRisk] = useState("Balanced");
  const [horizon, setHorizon] = useState("1-3y");
  const [activeGrades, setActiveGrades] = useState(defaultGradeTags);
  const [activeCreators, setActiveCreators] = useState(defaultCreatorTags);
  const [activeStyles, setActiveStyles] = useState(defaultStyleTags);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleSet = useCallback(
    (setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) => {
      setter((prev) => {
        const next = new Set(prev);
        next.has(val) ? next.delete(val) : next.add(val);
        return next;
      });
    },
    []
  );

  const handleChip = (p: string) => {
    setPrompt(p);
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const budgetPct = ((budget - 1000) / (1000000 - 1000)) * 100;

  return (
    <section className="pt-36 md:pt-44 pb-14 text-center relative">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-primary bg-primary/5 dark:bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.18)]" />
          AI ART CURATOR · NEW
        </div>

        {/* Headline */}
        <h1 className="font-serif font-medium text-[clamp(44px,6.2vw,84px)] leading-[1.02] tracking-tight text-foreground mb-6">
          Discover Art Through
          <br />
          <span className="italic text-primary font-medium">Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[640px] mx-auto text-muted-foreground text-lg mb-9">
          Describe what inspires you — a mood, an artist, a budget, a strategy —
          and CreAI will build a personalized collection of artworks, artists,
          and fractional portfolios crafted for you.
        </p>

        {/* ── Prompt box ─────────────────────────────────── */}
        <div className="max-w-[820px] mx-auto bg-card border border-border rounded-3xl shadow-xl p-2.5 text-left relative">
          <div className="flex items-start gap-3.5 px-5 pt-5 pb-2">
            {/* AI bead */}
            <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-[0_6px_16px_hsl(var(--primary)/0.35)]">
              <Sparkles className="w-[18px] h-[18px]" />
            </div>

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                "Tell CreAI what kind of art, artists, themes or investments you are looking for...\ne.g. Emerging Indian contemporary artists under ₹25,000 with strong appreciation history"
              }
              className="flex-1 w-full border-0 outline-none resize-none bg-transparent text-[17px] text-foreground placeholder:text-muted-foreground/60 min-h-[78px] leading-relaxed"
            />
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-dashed border-border">
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 dark:bg-muted/40 border border-border rounded-lg px-3 py-2 hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5" />
                Visual search
                <em className="not-italic text-[10px] text-muted-foreground/60 ml-1">
                  soon
                </em>
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 dark:bg-muted/40 border border-border rounded-lg px-3 py-2 hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                <MonitorSmartphone className="w-3.5 h-3.5" />
                Conversation mode
                <em className="not-italic text-[10px] text-muted-foreground/60 ml-1">
                  soon
                </em>
              </button>
            </div>

            <GradientButton
              label="Generate Collection →"
              variant="primary"
              className="h-11 px-5 text-sm"
            />
          </div>
        </div>

        {/* ── Suggested chips ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-7 max-w-[820px] mx-auto">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={() => handleChip(c.prompt)}
              className="text-[13px] text-foreground/80 bg-card border border-border px-3.5 py-2 rounded-full transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:text-primary hover:-translate-y-0.5 cursor-pointer"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* ── Advanced filters ────────────────────────────── */}
        <div className="mt-14">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground bg-transparent border-0 px-3.5 py-2 cursor-pointer transition-colors"
          >
            Advanced filters
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>

          {filtersOpen && (
            <div className="mt-5 bg-card border border-border rounded-2xl p-7 shadow-lg max-w-[820px] mx-auto text-left animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget slider */}
                <div className="md:col-span-2">
                  <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                    Budget{" "}
                    <span className="font-mono text-[13px] normal-case tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded-md ml-1.5">
                      {fmtINR(budget)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={1000}
                    max={1000000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${budgetPct}%, hsl(var(--border)) ${budgetPct}%, hsl(var(--border)) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5 font-mono">
                    <span>₹1,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                {/* Risk */}
                <div>
                  <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                    Risk Preference
                  </label>
                  <SegmentedControl
                    options={["Conservative", "Balanced", "Aggressive"]}
                    value={risk}
                    onChange={setRisk}
                  />
                </div>

                {/* Horizon */}
                <div>
                  <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                    Investment Horizon
                  </label>
                  <SegmentedControl
                    options={["< 1 yr", "1–3 yrs", "3–5 yrs", "5+ yrs"]}
                    values={["<1y", "1-3y", "3-5y", "5y+"]}
                    value={horizon}
                    onChange={setHorizon}
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                    Artwork Grade Preference
                  </label>
                  <TagGroup
                    tags={gradeTags}
                    active={activeGrades}
                    onToggle={(v) => toggleSet(setActiveGrades, v)}
                  />
                </div>

                {/* Creator Type */}
                <div>
                  <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                    Creator Type
                  </label>
                  <TagGroup
                    tags={creatorTags}
                    active={activeCreators}
                    onToggle={(v) => toggleSet(setActiveCreators, v)}
                  />
                </div>

                {/* Style */}
                <div className="md:col-span-2">
                  <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                    Style Tags
                  </label>
                  <TagGroup
                    tags={styleTags}
                    active={activeStyles}
                    onToggle={(v) => toggleSet(setActiveStyles, v)}
                  />
                </div>
              </div>

              {/* Generate button */}
              <div className="flex justify-center mt-7">
                <GradientButton
                  label="✦ Generate Collection"
                  variant="primary"
                  className="h-12 px-7 text-[15px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function SegmentedControl({
  options,
  values,
  value,
  onChange,
}: {
  options: string[];
  values?: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const vals = values ?? options;
  return (
    <div className="inline-flex p-1 bg-muted/60 dark:bg-muted/40 border border-border rounded-xl gap-1 flex-wrap">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(vals[i])}
          className={`border-0 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
            vals[i] === value
              ? "bg-card text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TagGroup({
  tags,
  active,
  onToggle,
}: {
  tags: string[];
  active: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer select-none ${
            active.has(tag)
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

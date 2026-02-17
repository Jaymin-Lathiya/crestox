import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import CardFlip from "./ui/card-flip";

const STEPS = [
  {
    number: "01",
    title: "Discover & Authenticate",
    description: "Browse curated masterpieces verified through our AI authentication protocol. Each piece undergoes rigorous provenance analysis.",
  },
  {
    number: "02", 
    title: "Acquire Fractions",
    description: "Purchase fractional ownership tokens representing real shares of authenticated artworks. Start with as little as 0.1 ETH.",
  },
  {
    number: "03",
    title: "Trade & Govern",
    description: "Trade your fractions on secondary markets or participate in governance decisions about the physical artwork's future.",
  },
  {
    number: "04",
    title: "Collect Returns",
    description: "Earn from appreciation, exhibition royalties, and eventual sale proceeds distributed proportionally to token holders.",
  },
];

interface StepCardProps {
  step: typeof STEPS[0];
  index: number;
  isLeft: boolean;
}

const StepCard = ({ step, index, isLeft }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Card */}
      <div className="glass-dense rounded-lg p-8 max-w-md relative overflow-hidden group hover:border-gold/30 transition-colors duration-500">
        {/* Large background number */}
        <span className="absolute -top-4 -left-2 font-serif text-[120px] font-bold text-white/[0.03] leading-none pointer-events-none select-none">
          {step.number}
        </span>
        
        <div className="relative z-10">
          <span className="font-mono text-xs text-cyber tracking-widest mb-3 block">
            STEP_{step.number}
          </span>
          <h3 className="font-sans font-bold text-2xl text-ghost mb-3 tracking-tight">
            {step.title}
          </h3>
          <p className="font-sans text-ghost-dim leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Node connector */}
      <div className="relative flex-shrink-0">
        <div className="w-4 h-4 rounded-full bg-void border-2 border-gold shadow-[0_0_12px_rgba(212,175,55,0.5)]" />
      </div>
    </motion.div>
  );
};

export default function ProcessConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative py-32 bg-void overflow-hidden" ref={containerRef}>
      {/* Background wireframe decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-ghost tracking-tighter mb-4">
            HOW{" "}
            <span className="italic bg-gradient-to-r from-cyber to-cyber-dim bg-clip-text text-transparent">
              CRESTOX
            </span>
            {" "}WORKS
          </h2>
          <p className="font-mono text-sm text-ghost-dim tracking-widest uppercase">
            [ The Protocol in Four Steps ]
          </p>
        </motion.div>

        {/* Constellation Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Constellation Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2">
            {/* Background line */}
            <div className="absolute inset-0 bg-white/10" />
            {/* Animated fill */}
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gold via-gold to-cyber"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Steps */}
          {/* <div className="relative flex flex-col gap-24">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative">
                <StepCard 
                  step={step} 
                  index={index} 
                  isLeft={index % 2 === 0}
                />
              </div>
            ))}
          </div> */}
          {/* Steps */}
<div className="relative">
  {STEPS.map((item, index) => (
    <div
      key={item.number}
      className={cn(
        "relative flex items-center justify-between mb-24 last:mb-0",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Spacer for alternating layout */}
      <div className="hidden md:block w-1/2" />

      {/* Timeline Node */}
      <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-4 h-4">
        <div className="w-3 h-3 rounded-full bg-void border-2 border-gold shadow-[0_0_12px_rgba(212,175,55,0.5)] z-10" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className={cn(
          "w-full md:w-[45%] pl-16 md:pl-0",
          index % 2 === 0
            ? "md:pr-12 md:text-right"
            : "md:pl-12 md:text-left"
        )}
      >
        <CardFlip
          step={item.number}
          title={item.title}
          description={item.description}
        />
      </motion.div>
    </div>
  ))}
</div>


          {/* End Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-8"
          >
            <div className="w-6 h-6 rounded-full bg-cyber shadow-[0_0_20px_rgba(0,240,255,0.6)] animate-pulse-glow" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import RecommendationsSection from "./RecommendationsSection";
import PortfolioBuilderSection from "./PortfolioBuilderSection";
import WhyCreAISection from "./WhyCreAISection";
import FooterCTASection from "./FooterCTASection";

export default function CreAIPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <RecommendationsSection />
      <PortfolioBuilderSection />
      <WhyCreAISection />
      <FooterCTASection />
    </main>
  );
}

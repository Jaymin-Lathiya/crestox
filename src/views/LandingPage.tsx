"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import GradientButton from '@/components/ui/gradiant-button';
import { ArrowRight, Sparkles, TrendingUp, Users, Shield, Palette, BarChart3 } from 'lucide-react';



import GallerySection from '@/components/home/GallerySection';
import CompanySlider from '@/components/home/CompanySlider';
import TickerStream from '@/components/home/TickerStream';
import ArtistSpotlight from '@/components/home/ArtistSpotlight';
import TrustMatrix from '@/components/home/TrustMatrix';
import { HowItWorksTimeline } from '@/components/timeline/TimelineItem';
import ProcessConstellation from '@/components/ProcessConstellation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />



      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-mono text-sm tracking-widest">FRACTIONAL ART INVESTMENT</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-6 animate-fade-in-up delay-100">
            Own a Piece of
            <span className="block italic text-primary">Art History</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans animate-fade-in-up delay-200">
            Invest in masterpieces by owning fractional shares.
            Crestox democratizes fine art collecting through blockchain-powered fractionalization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <GradientButton
              variant="primary"
              className="group h-12"
              onClick={() => router.push('/app')}
              label="Create Collector Account"
            >
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </GradientButton>
            <GradientButton variant="secondary" onClick={() => router.push('/auth?mode=artist')} label='Join as Artist'>

            </GradientButton>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/30 animate-fade-in-up delay-400">
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-primary">₹2.5Cr+</p>
              <p className="text-muted-foreground font-mono text-sm mt-1">Trading Volume</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-foreground">1,200+</p>
              <p className="text-muted-foreground font-mono text-sm mt-1">Collectors</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-foreground">85+</p>
              <p className="text-muted-foreground font-mono text-sm mt-1">Artists</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-mono text-sm tracking-widest">THE CONCEPT</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4">What are Art Fractals?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background/50 border border-border p-8 group hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3">Original Artwork</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                A physical masterpiece valued at ₹50 lakhs is authenticated and securely stored in a vault.
              </p>
            </div>

            <div className="bg-background/50 border border-border p-8 group hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3">Fractionalized</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                The artwork is divided into 5,000 digital "fractals" - each representing verified ownership of a piece.
              </p>
            </div>

            <div className="bg-background/50 border border-border p-8 group hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3">Trade & Profit</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                Buy fractals starting at ₹1,000. Trade on our marketplace. Profit as the artwork appreciates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TickerStream />

      <CompanySlider />

      <section className="py-24 bg-white dark:bg-card transition-colors">
        <div className=" ">
          {/* <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">
              How Crestox Works
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 font-sans">
              Simple steps to get started with enterprise-grade security
            </p>
          </div>

          <div className="space-y-4">
            <HowItWorksTimeline
            />
          </div> */}
          <ProcessConstellation />
        </div>
      </section>



      <GallerySection />

      <ArtistSpotlight />

      <TrustMatrix />

      <div className="flex justify-center pb-24 bg-background transition-colors duration-300">
        <GradientButton
          variant="primary"
          onClick={() => router.push('/explore')}
          label="Explore Entire Collection"
          className="px-8"
        />
      </div>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-mono text-sm tracking-widest">FOR COLLECTORS</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6">Invest in Art Like Never Before</h2>
              <p className="text-muted-foreground font-sans mb-8">
                No longer reserved for the ultra-wealthy. Start your collection with any budget
                and build a diversified portfolio of blue-chip artworks.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold mb-1">Verified Authenticity</h4>
                    <p className="text-muted-foreground text-sm font-sans">Every artwork is authenticated and insured before fractionalization.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold mb-1">Real-time Valuations</h4>
                    <p className="text-muted-foreground text-sm font-sans">Track your portfolio value with live market data and analytics.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold mb-1">Secondary Market</h4>
                    <p className="text-muted-foreground text-sm font-sans">Buy and sell fractals instantly on our liquid marketplace.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-card border border-border p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-muted-foreground font-mono text-xs tracking-widest">YOUR PORTFOLIO</p>
                    <p className="text-3xl font-mono font-bold text-primary mt-2">₹4,52,000</p>
                    <p className="text-sm text-primary font-mono">+12.4% this month</p>
                  </div>
                  <div className="space-y-3">
                    {['The Liquid Abstract', 'Digital Renaissance', 'Void Symphony'].map((title, i) => (
                      <div key={title} className="flex justify-between items-center py-2 border-t border-border/50">
                        <span className="font-serif italic text-sm">{title}</span>
                        <span className="text-primary font-mono text-sm">+{8 + i * 3}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-square bg-background border border-border p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-muted-foreground font-mono text-xs tracking-widest">ARTIST EARNINGS</p>
                    <p className="text-3xl font-mono font-bold text-foreground mt-2">₹18,50,000</p>
                    <p className="text-sm text-muted-foreground font-mono">Lifetime earnings</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-mono">Primary Sales</span>
                      <span className="font-mono">₹15,00,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-mono">Secondary Royalties (5%)</span>
                      <span className="font-mono text-primary">₹3,50,000</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="text-priamry font-mono text-sm tracking-widest">FOR ARTISTS</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6">Fund Your Art, Keep Your Rights</h2>
              <p className="text-muted-foreground font-sans mb-8">
                Get funding for new works without giving up ownership.
                Earn royalties on every secondary sale, forever.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold mb-1">Access New Collectors</h4>
                    <p className="text-muted-foreground text-sm font-sans">Reach thousands of art enthusiasts who couldn't afford full pieces.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold mb-1">5% Perpetual Royalties</h4>
                    <p className="text-muted-foreground text-sm font-sans">Earn from every trade on the secondary market automatically.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold mb-1">Full Creative Control</h4>
                    <p className="text-muted-foreground text-sm font-sans">You decide pricing, edition size, and retain all IP rights.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <GradientButton
                  variant="secondary"
                  onClick={() => router.push('/auth?mode=artist')}
                  label="Apply as Artist"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl mb-6">Start Your Collection Today</h2>
          <p className="text-muted-foreground font-sans text-lg mb-10">
            Join 1,200+ collectors investing in the future of art.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GradientButton
              variant="primary"
              onClick={() => router.push('/auth?mode=signup')}
              label="Create Account"
            />
            {/* <Button variant="outline" size="lg" onClick={() => router.push('/app')}>
              Explore Marketplace
            </Button> */}

            <GradientButton
              variant="secondary"
              onClick={() => router.push('/app')}
              label="Explore Marketplace"
            />

          </div>
        </div>
      </section>


    </div>
  );
}

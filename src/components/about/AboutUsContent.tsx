'use client';

import { useState, type ReactNode } from 'react';
import {
  BarChart3,
  Palette,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FlipCard from '@/components/FlipCard';
import {
  FOR_ARTISTS,
  FOR_COLLECTORS,
  FRACTAL_FLIP_CARDS,
  FRACTAL_SECTION,
  HERO_STATS,
  HERO_TAGLINE,
  PROCESS_STEPS,
  TRUST_MATRIX_FEATURE_CONTENT,
  TRUST_MATRIX_SECTION,
} from '@/config/landingEducationalContent';
import { MemberCard, advisoryBoard, foundingPartners } from '@/components/about/artistCard';

const FRACTAL_ICON_MAP = {
  Palette,
  Sparkles,
  TrendingUp,
  Shield,
  BarChart3,
  Users,
} as const;

const TABS = [
  { id: 'crestox', label: 'Crestox' },
  { id: 'founding', label: 'Founding Partners' },
  { id: 'advisory', label: 'Advisory Board' },
  { id: 'careers', label: 'Careers' },
  { id: 'legal', label: 'Tax & Legal' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const CAREERS_COPY =
  'Join us in revolutionizing the art world. We are always looking for passionate, talented individuals to join our team. If you are excited by our mission, please check back for future job openings.';

const TAX_LEGAL_COPY =
  'Information on this site is for general purposes only and is not tax, legal, or investment advice. Fractional art offerings may involve risk; consult your own professional advisors before making decisions. For compliance or legal notices, contact us through the channels listed in the site footer.';

function SectionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm px-6 py-10 md:px-10 md:py-12',
        className,
      )}
    >
      {children}
    </div>
  );
}

function CrestoxTab() {
  return (
    <div className="space-y-10 md:space-y-14">
      <SectionShell>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{FRACTAL_SECTION.title}</h2>
          <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed">{HERO_TAGLINE}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 pb-10 border-b border-border/50">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={cn(
                  'text-lg sm:text-2xl font-mono font-bold',
                  stat.emphasize ? 'text-primary' : 'text-foreground',
                )}
              >
                {stat.value}
              </p>
              <p className="text-muted-foreground font-mono text-[10px] sm:text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-primary font-mono text-xs tracking-widest mb-4">{FRACTAL_SECTION.kicker}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {FRACTAL_FLIP_CARDS.map((card, idx) => {
            const Icon = FRACTAL_ICON_MAP[card.front.icon];
            return (
              <FlipCard
                key={idx}
                front={{
                  ...card.front,
                  icon: <Icon className="w-6 h-6 text-primary" />,
                }}
                back={card.back}
              />
            );
          })}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="text-center mb-10">
          <p className="text-primary font-mono text-xs tracking-[0.35em] mb-3">{TRUST_MATRIX_SECTION.kicker}</p>
          <h2 className="font-serif text-2xl md:text-3xl">
            {TRUST_MATRIX_SECTION.titleLine1}
            <span className="text-primary italic">{TRUST_MATRIX_SECTION.titleAccent}</span>
          </h2>
          <p className="text-muted-foreground font-sans text-sm mt-3 max-w-xl mx-auto">{TRUST_MATRIX_SECTION.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_MATRIX_FEATURE_CONTENT.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border/60 bg-background/40 p-5 flex flex-col gap-2"
            >
              <p className="font-serif text-base text-foreground">{f.title}</p>
              <p className="text-muted-foreground text-xs font-sans leading-relaxed flex-1">{f.description}</p>
              <div className="pt-3 border-t border-border/40">
                <p className="font-mono text-lg text-primary">{f.stat}</p>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{f.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Why Crestox?</h2>
          <p className="text-muted-foreground font-sans text-sm max-w-lg mx-auto">
            The same value propositions we highlight for collectors and artists on our homepage.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <p className="text-primary font-mono text-xs tracking-widest mb-2">{FOR_COLLECTORS.kicker}</p>
            <h3 className="font-serif text-xl md:text-2xl mb-3">{FOR_COLLECTORS.title}</h3>
            <p className="text-muted-foreground text-sm font-sans mb-6">{FOR_COLLECTORS.lead}</p>
            <ul className="space-y-5">
              {FOR_COLLECTORS.items.map((item) => {
                const Icon = FRACTAL_ICON_MAP[item.icon];
                return (
                  <li key={item.title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground text-xs font-sans mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className="text-primary font-mono text-xs tracking-widest mb-2">{FOR_ARTISTS.kicker}</p>
            <h3 className="font-serif text-xl md:text-2xl mb-3">{FOR_ARTISTS.title}</h3>
            <p className="text-muted-foreground text-sm font-sans mb-6">{FOR_ARTISTS.lead}</p>
            <ul className="space-y-5">
              {FOR_ARTISTS.items.map((item) => {
                const Icon = FRACTAL_ICON_MAP[item.icon];
                return (
                  <li key={item.title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground text-xs font-sans mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">How Crestox works</h2>
          <p className="text-muted-foreground font-sans text-sm max-w-xl mx-auto">
            The four-step flow from our homepage—authentication through to returns.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-lg border border-border/60 bg-background/30 p-6 relative overflow-hidden"
            >
              <span className="font-mono text-[10px] text-primary tracking-widest">STEP {step.number}</span>
              <h3 className="font-serif text-lg text-foreground mt-2 mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-xs font-sans leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

function TextPanel({ title, body }: { title: string; body: string }) {
  return (
    <SectionShell>
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">{title}</h2>
      <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed max-w-3xl">{body}</p>
    </SectionShell>
  );
}

export default function AboutUsContent() {
  const [tab, setTab] = useState<TabId>('crestox');

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-24 md:pt-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 md:mb-12 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">About Crestox</h1>
          <p className="mt-3 text-muted-foreground font-sans text-sm md:text-base max-w-2xl">
            Learn more about our mission, our team, and our vision for the future of art.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="About sections"
          className="flex flex-wrap justify-center sm:justify-start gap-1 p-1.5 rounded-xl border border-border/80 bg-muted/25 mb-10"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'font-serif text-sm px-4 py-2.5 rounded-lg transition-colors duration-200',
                'text-muted-foreground hover:text-foreground',
                tab === t.id &&
                  'bg-background text-foreground border border-border shadow-sm font-medium',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="min-h-[320px]">
          {tab === 'crestox' && <CrestoxTab />}
          {tab === 'founding' && (
            <SectionShell className="!py-10">
              <h2 className="font-serif text-2xl md:text-3xl mb-8">Founding partners</h2>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
                {foundingPartners.map((member) => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </div>
            </SectionShell>
          )}
          {tab === 'advisory' && (
            <SectionShell className="!py-10">
              <h2 className="font-serif text-2xl md:text-3xl mb-8">Advisory board</h2>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {advisoryBoard.map((member) => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </div>
            </SectionShell>
          )}
          {tab === 'careers' && <TextPanel title="Careers" body={CAREERS_COPY} />}
          {tab === 'legal' && <TextPanel title="Tax & Legal" body={TAX_LEGAL_COPY} />}
        </div>
      </div>
    </div>
  );
}

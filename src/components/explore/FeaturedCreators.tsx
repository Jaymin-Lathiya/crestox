"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, User, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CREATOR_TABS = [
    { id: 'artists', label: 'Featured Artists', icon: User },
    { id: 'curators', label: 'Featured Curators', icon: Award },
    { id: 'owners', label: 'Featured Owners', icon: ShieldCheck },
];

const MOCK_CREATORS = {
    artists: [
        {
            name: 'Priya Patel',
            role: 'Digital Surrealist',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            bio: 'An esteemed artist from Gujarat, known for a unique and captivating style that blends traditional motifs with modern digital...',
            stats: { label: 'Fractals Available', value: 795, max: 795 }
        },
        {
            name: 'Rohan Mehta',
            role: 'Abstract Painter',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
            bio: 'Master of texture and light, creating immersive abstract landscapes that challenge perception and reality.',
            stats: { label: 'Fractals Available', value: 490, max: 490 }
        },
        {
            name: 'Aarav Shah',
            role: 'NFT Pioneer',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
            bio: 'Bridging the gap between physical and digital ownership through innovative smart contract art.',
            stats: { label: 'Fractals Available', value: 365, max: 365 }
        },
        {
            name: 'Isha Joshi',
            role: 'Geometric Artist',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
            bio: 'Exploring the mathematical beauty of sacred geometry in the digital age.',
            stats: { label: 'Fractals Available', value: 405, max: 405 }
        },
        {
            name: 'David L.',
            role: 'Glitch Artist',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop',
            bio: 'Deconstructing digital signals to create visual noise that speaks volumes.',
            stats: { label: 'Fractals Available', value: 200, max: 500 }
        },
        {
            name: 'Maria G.',
            role: 'Traditional Fine Art',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
            bio: 'Classical techniques applied to contemporary subjects, preserving heritage in the blockchain.',
            stats: { label: 'Fractals Available', value: 150, max: 300 }
        },
    ],
    curators: [
        {
            name: 'Arthouse Global',
            role: 'Gallery',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
            bio: 'Curating the finest digital collections from around the globe for discerning investors.',
            stats: { label: 'Collections Managed', value: 45, max: 50 }
        },
        {
            name: 'MetaMuseum',
            role: 'Digital Archive',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
            bio: 'Preserving digital history through meticulous archiving and display.',
            stats: { label: 'Artworks Archived', value: 1200, max: 2000 }
        },
    ],
    owners: [
        {
            name: 'CryptoWhale',
            role: 'Collector',
            image: 'https://images.unsplash.com/photo-1522075469751-3a3694fb60ed?w=300&h=300&fit=crop',
            bio: 'Early adopter and major patron of the decentralized art movement.',
            stats: { label: 'Portfolio Value', value: 95, max: 100 } // percentage for visual
        },
        {
            name: 'ArtFlipper',
            role: 'Investor',
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop',
            bio: 'Analytical approach to art investment, focusing on emerging talent.',
            stats: { label: 'ROI YTD', value: 82, max: 100 }
        },
    ]
};

export function FeaturedCreators() {
    const [activeTab, setActiveTab] = useState('artists');
    const [isExpanded, setIsExpanded] = useState(false);
    const [displayedCreators, setDisplayedCreators] = useState<any[]>([]);

    useEffect(() => {
        const creators = MOCK_CREATORS[activeTab as keyof typeof MOCK_CREATORS];
        const shuffled = [...creators].sort(() => 0.5 - Math.random());
        setDisplayedCreators(shuffled);
    }, [activeTab]);

    const visibleCreators = isExpanded ? displayedCreators : displayedCreators.slice(0, 4);

    return (
        <section className="mb-16 animate-fade-in-up delay-100">
            <div className="flex items-center justify-center gap-8 mb-12 border-b border-border/40 pb-4 overflow-x-auto no-scrollbar">
                {CREATOR_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsExpanded(false); }}
                        className={cn(
                            "flex items-center gap-2 whitespace-nowrap text-sm tracking-[0.1em] uppercase transition-all duration-300 pb-2 relative",
                            activeTab === tab.id
                                ? "text-primary font-bold"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4 mb-0.5", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleCreators.map((creator, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-card/40 hover:bg-card/60 border border-border/50 hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full p-1 border border-border/50 group-hover:border-primary/50 transition-colors">
                                <img
                                    src={creator.image}
                                    alt={creator.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                {creator.name.slice(0, 2)}
                            </div>
                        </div>

                        <h3 className="font-serif text-xl font-medium mb-1 group-hover:text-primary transition-colors">
                            {creator.name}
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-3 min-h-[4.5em] font-sans">
                            {creator.bio}
                        </p>

                        <div className="w-full mt-auto mb-6">
                            <div className="flex justify-between items-end mb-2 text-xs">
                                <span className="text-muted-foreground">{creator.stats.label}</span>
                                <span className="font-mono font-medium text-foreground">
                                    {creator.stats.value} / {creator.stats.max}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_var(--primary)]"
                                    style={{ width: `${(creator.stats.value / creator.stats.max) * 100}%` }}
                                />
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-white/10 dark:border-white/10 hover:border-primary dark:hover:border-primary group-hover:bg-primary/5 transition-all"
                        >
                            View Profile
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest border border-border/50 rounded-full px-8 py-3 hover:bg-secondary/50 group"
                >
                    {isExpanded ? (
                        <>Collapse <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /></>
                    ) : (
                        <>Browse All {CREATOR_TABS.find(t => t.id === activeTab)?.label.replace('Featured ', '')}s <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /></>
                    )}
                </button>
            </div>
        </section>
    );
}

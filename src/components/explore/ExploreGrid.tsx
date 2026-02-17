"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ChevronRight, Menu, X, Sparkles, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Navigation from "@/components/layout/Navigation";
import { aborted } from "util";

// --- Mock Data ---
const TABS = [
    "Featured", "Graphic Design", "Art", "UI/UX", "Interior Design",
    "Typography", "Nature", "Fashion", "Architecture", "Love",
    "Motion", "Branding", "Cinema", "Portraiture", "Home Decor", "Quotes", "Spirituality"
];

const SELECTED_BY_COSMOS = [
    { id: 1, src: "https://images.unsplash.com/photo-1534237710431-e2fc69843c95?q=80&w=1000", title: "Woniza Core", user: "@woniza", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", elements: 124, followers: 46 },
    { id: 2, src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000", title: "[Graphic]", user: "@6", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100", elements: 89, followers: 23 },
    { id: 3, src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000", title: "ART DIRECTION", user: "@barbarburbur", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", elements: 42, followers: 12 },
    { id: 4, src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000", title: "Published Material", user: "@celindancel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", elements: 210, followers: 56 },
    { id: 5, src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000", title: "art inspo", user: "@pescadofristo", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", elements: 67, followers: 8 },
    { id: 6, src: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1000", title: "Graphic Design", user: "@aethereal", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100", elements: 156, followers: 92 },
]; aborted

const ELEMENTS_ITEMS = [
    { id: 5, src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000", title: "Golden Hour", user: "@emma" },
    { id: 6, src: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1000", title: "Deep Space", user: "@astro" },
    { id: 7, src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000", title: "Minimal Form", user: "@architect" },
    { id: 8, src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1000", title: "Blue Velvet", user: "@designer" },
];

export function ExploreGrid() {
    const [activeTab, setActiveTab] = useState("Graphic Design");

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 flex flex-col">

            {/* Global Header */}
            <Header />

            {/* --- Sub-Toolbar (Search & Filters) --- */}
            {/* Positioned below the global header (fixed or standard flow) */}
            <div className="sticky top-[72px] z-40 bg-black/90 backdrop-blur-md border-b border-white/5 py-3 pt-4 transition-all">
                <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-6">

                    {/* Filter Tabs (Horizontal Scroll) */}
                    <div className="flex-1 overflow-x-auto no-scrollbar mask-gradient-right flex justify-center md:justify-start">
                        <div className="flex items-center gap-8 pr-4">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "text-[13px] font-medium whitespace-nowrap transition-all duration-300 relative py-2",
                                        activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-white"
                                        />
                                    )}
                                </button>
                            ))}
                            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Search Bar - Minimal Pill */}
                    <div className="relative group w-full max-w-[300px] shrink-0 hidden lg:block">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Try 'celestial maps'"
                            className="w-full bg-zinc-900/50 text-[13px] text-white placeholder:text-zinc-600 rounded-full py-2 pl-9 pr-10 border border-white/5 focus:border-zinc-700 outline-none transition-all hover:bg-zinc-900"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <Globe className="h-3.5 w-3.5 text-zinc-600" />
                        </div>
                    </div>

                </div>
            </div>

            {/* --- Main Content --- */}
            <main className="px-8 pb-20 pt-10 mx-auto w-full max-w-[1700px] flex-grow">

                {/* Section: Selected by Cosmos */}
                <section className="mb-20">
                    <h2 className="text-[28px] font-serif text-zinc-200 mb-8 font-normal tracking-wide">Selected by Cosmos</h2>
                    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
                        {SELECTED_BY_COSMOS.map((item) => (
                            <CosmosCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                {/* Section: Elements */}
                <section>
                    <h2 className="text-[28px] font-serif text-zinc-200 mb-8 font-normal tracking-wide">Elements</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* Repeat mock data to fill grid */}
                        {[...ELEMENTS_ITEMS, ...ELEMENTS_ITEMS, ...ELEMENTS_ITEMS, ...ELEMENTS_ITEMS].map((item, idx) => (
                            <ElementCard key={`${item.id}-${idx}`} item={item} />
                        ))}
                    </div>
                </section>

            </main>

            {/* Global Footer */}
            <Footer />

            {/* Floating Navigation */}
            <Navigation />

        </div>
    );
}

// --- Sub Components ---

function CosmosCard({ item }: { item: typeof SELECTED_BY_COSMOS[0] }) {
    return (
        <div className="group min-w-[320px] md:min-w-[360px] snap-start cursor-pointer">
            <div className="overflow-hidden rounded-2xl aspect-[16/10] mb-3.5 relative bg-zinc-900 border border-white/5">
                <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-100 transition-opacity duration-300">
                    <div className="flex gap-8 text-center drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-white">{item.elements}</span>
                            <span className="text-[10px] uppercase tracking-widest text-white/70">elements</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-white">{item.followers}</span>
                            <span className="text-[10px] uppercase tracking-widest text-white/70">followers</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pl-1">
                <img src={item.avatar} alt={item.user} className="w-5 h-5 rounded-full border border-white/10" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-zinc-200 group-hover:text-white transition-colors">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] text-zinc-500">@{item.user.replace('@', '')}</span>

                        <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full flex items-center justify-center">
                            <svg className="w-1.5 h-1.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ElementCard({ item }: { item: typeof ELEMENTS_ITEMS[0] }) {
    return (
        <div className="group cursor-pointer relative">
            <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative bg-zinc-900 border border-white/5">
                <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white rounded-[1px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

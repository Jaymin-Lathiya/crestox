"use client";

import React, { useRef, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
    "Featured",
    "Graphic Design",
    "Art",
    "UI/UX",
    "Interior Design",
    "Typography",
    "Nature",
    "Fashion",
    "Architecture",
    "Love",
    "Motion",
    "3D",
    "Photography",
    "Branding"
];

export function ExploreHeader() {
    const [activeCategory, setActiveCategory] = useState("Featured");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full space-y-8 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                <div className="hidden md:flex items-center gap-6 font-medium text-sm text-muted-foreground">
                    <span className="text-foreground cursor-pointer">Explore</span>
                    {/* <span className="hover:text-foreground cursor-pointer transition-colors">Shop</span> */}
                </div>

                <div className="relative w-full max-w-xl group">
                    <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-background to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-background/80 hover:bg-background/90 transition-colors rounded-full px-4 py-3 border border-border hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-muted-foreground mr-3" />
                        <input
                            type="text"
                            placeholder="Try 'archival animations'..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                        />
                        <div className="bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full ml-2 cursor-pointer hover:scale-105 transition-all">
  <Search className="w-3.5 h-3.5 text-primary" />
</div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-4 py-2 border border-border/30">
                        <span className="text-xs text-muted-foreground font-mono uppercase">Sort By:</span>
                        <select className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors">
                            <option value="relevance">Relevance</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="performance">Performance</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-8 overflow-x-auto no-scrollbar px-8 py-2 w-full"
                >
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "whitespace-nowrap text-sm font-medium transition-all duration-200 relative pb-1",
                                activeCategory === category
                                    ? "text-foreground font-bold"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {category}
                            {activeCategory === category && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full layout-id-underline" />
                            )}
                        </button>
                    ))}
                </div>
            </div> */}
        </div>
    );
}

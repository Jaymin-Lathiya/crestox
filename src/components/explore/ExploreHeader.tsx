"use client";

import React, { useRef, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import type { VerifiedArtworkSort } from '@/apis/artwork/artworkActions';

interface ExploreHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: VerifiedArtworkSort;
    onSortChange: (value: VerifiedArtworkSort) => void;
}

export function ExploreHeader({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
}: ExploreHeaderProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchInput = (value: string) => {
        setLocalQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearchChange(value);
        }, 300);
    };

    const handleSearchSubmit = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearchChange(localQuery);
    };

    return (
        <div className="w-full space-y-8 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="hidden md:flex items-center gap-6 font-medium text-sm text-muted-foreground">
                    <span className="text-foreground cursor-pointer">Explore</span>
                </div>

                <div className="relative w-full max-w-xl group">
                    <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-background to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-background/80 hover:bg-background/90 transition-colors rounded-full px-4 py-3 border border-border hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-muted-foreground mr-3" />
                        <input
                            type="text"
                            value={localQuery}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit();
                            }}
                            placeholder="Search artists, curators, owners..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                            aria-label="Search artists, curators, and owners"
                        />
                        <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full ml-2 cursor-pointer hover:scale-105 transition-all"
                            aria-label="Search"
                        >
                            <Search className="w-3.5 h-3.5 text-primary" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                    <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-4 py-2 border border-border/30">
                        <span className="text-xs text-muted-foreground font-mono uppercase">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as VerifiedArtworkSort)}
                            className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors"
                            aria-label="Sort artworks"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="performance">Performance</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

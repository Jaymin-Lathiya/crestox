"use client";

import React, { useState } from 'react';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { FeaturedCreators } from '@/components/explore/FeaturedCreators';
import ScrollRevealGrid from '@/components/ScrollRevealGrid/ScrollRevealGrid';
import type { VerifiedArtworkSort } from '@/apis/artwork/artworkActions';

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<VerifiedArtworkSort>('relevance');

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 px-6 pb-12 max-w-[1920px] mx-auto">
                <ExploreHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <div className="mt-8">
                    <FeaturedCreators searchKeyword={searchQuery} />
                </div>

                <div className="mt-4">
                    <ScrollRevealGrid sortBy={sortBy} />
                </div>
            </main>
        </div>
    );
}

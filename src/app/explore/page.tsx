"use client";

import React from 'react';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { FeaturedCreators } from '@/components/explore/FeaturedCreators';
import ScrollRevealGrid from '@/components/ScrollRevealGrid/ScrollRevealGrid';

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 px-6 pb-12 max-w-[1920px] mx-auto">
                <ExploreHeader />

                <div className="mt-8">
                    <FeaturedCreators />
                </div>

                <div className="mt-8">
                    <ScrollRevealGrid />
                </div>
            </main>
        </div>
    );
}

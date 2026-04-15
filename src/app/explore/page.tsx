"use client";

import React, { useEffect, useState } from 'react';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { MasonryGrid } from '@/components/explore/MasonryGrid';
import { CosmosArtworkCard } from '@/components/explore/CosmosArtworkCard';
import { FeaturedCreators } from '@/components/explore/FeaturedCreators';
import { Header } from '@/components/layout/Header';
import ScrollRevealGrid from '@/components/ScrollRevealGrid/ScrollRevealGrid';



export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

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

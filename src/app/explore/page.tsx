"use client";

import React, { useEffect, useState } from 'react';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { MasonryGrid } from '@/components/explore/MasonryGrid';
import { CosmosArtworkCard } from '@/components/explore/CosmosArtworkCard';
import { FeaturedCreators } from '@/components/explore/FeaturedCreators';
import { Header } from '@/components/layout/Header';

const generateArtworks = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        title: ['The Void', 'Abstract Mind', 'Digital Soul', 'Neon Genesis', 'Chrome Heart', 'Liquid Dreams', 'Cyber Nature'][i % 7],
        artist: ['Elena V.', 'Marcus Chen', 'Sarah Jenkins', 'Alex K.', 'Maria G.', 'David L.', 'Priya S.'][i % 7],
        image: `https://images.unsplash.com/photo-${[
            '1541963463532-d68292c34b19',
            '1547891654-e66ed7ebb968',
            '1549490349-8643362247b5',
            '1550684848-fac1c5b4e853',
            '1515405295579-ba7b45403062',
            '1561214115-f2f134cc4912',
            '1558603668-6570496b66f8',
            '1579783902614-a3fb392796a5',
            '1536924940846-227afb31e2a5',
            '1513364776144-60967b0f800f',
            '1515405295579-ba7b45403062',
            '1531315630201-bb15dbef0390'
        ][i % 12]}?q=80&w=800&auto=format&fit=crop`
    }));
};

const ARTWORKS = generateArtworks(24);

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 px-4 pb-12 max-w-[1920px] mx-auto">
                <ExploreHeader />

                <div className="mt-8 px-4">
                    <FeaturedCreators />
                </div>

                <div className="mt-8 px-4">
                    <MasonryGrid>
                        {ARTWORKS.map((art) => (
                            <CosmosArtworkCard
                                key={art.id}
                                {...art}
                            />
                        ))}
                    </MasonryGrid>
                </div>
            </main>
        </div>
    );
}

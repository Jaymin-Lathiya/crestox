"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useAnimation, useMotionValue } from 'framer-motion';
import { ArtworkCard } from './ArtworkCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import ProcessConstellation from '../ProcessConstellation';
import PhotoScrollSection from '../Photoscrollsection';
import { IMAGES } from '@/views/LandingPage';

const ARTWORKS = [
    { id: 1, title: 'The Liquid Abstract', artist: 'Elena V.', price: '₹18,284.75', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/4]' },
    { id: 2, title: 'Void Symphony', artist: 'Marcus Chen', price: '₹22,150.00', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/5]' },
    { id: 3, title: 'Digital Renaissance', artist: 'Sarah Jenkins', price: '₹15,400.50', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[4/3]' },
    { id: 4, title: 'Neon Dreams', artist: 'Alex K.', price: '₹12,800.00', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/4]' },
    { id: 5, title: 'Urban Decay', artist: 'Maria G.', price: '₹9,500.25', image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/5]' },
    { id: 6, title: 'Geometric Soul', artist: 'David L.', price: '₹25,000.00', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/4]' },
    { id: 7, title: 'Chromatic Haze', artist: 'Priya S.', price: '₹19,200.75', image: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[4/5]' },
    { id: 8, title: 'Silent Echoes', artist: 'Ryan M.', price: '₹30,500.00', image: 'https://images.unsplash.com/photo-1579783902614-a3fb392796a5?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/4]' },
    { id: 9, title: 'Golden Hour', artist: 'Emma W.', price: '₹14,750.50', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1000&auto=format&fit=crop', aspectRatio: 'aspect-[3/5]' },
];

const COLUMN_1 = [ARTWORKS[0], ARTWORKS[3], ARTWORKS[6], ARTWORKS[1]];
const COLUMN_2 = [ARTWORKS[1], ARTWORKS[4], ARTWORKS[7], ARTWORKS[2]];
const COLUMN_3 = [ARTWORKS[2], ARTWORKS[5], ARTWORKS[8], ARTWORKS[0]];

const InfiniteColumn = ({
    artworks,
    duration = 20,
    className
}: {
    artworks: typeof ARTWORKS,
    duration?: number,
    className?: string
}) => {
    return (
        <div className={cn("relative h-[800px] overflow-hidden", className)}>
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

            <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                    duration: duration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                }}
                className="flex flex-col"
            >
                {[...artworks, ...artworks].map((art, idx) => (
                    <Link href="/art" key={`${art.id}-${idx}`} className="mb-10 block">
                        <ArtworkCard
                            {...art}
                        />
                    </Link>
                ))}
            </motion.div>
        </div>
    );
};

export function GallerySection() {

    return (
        <section className="py-24 overflow-hidden bg-background">
            <div className="container mx-auto px-4 mb-12 text-center">
                <span className="text-primary font-mono text-sm tracking-widest uppercase mb-2 block">Gallery</span>
                <h2 className="font-serif text-3xl md:text-5xl">Curated Masterpieces</h2>
            </div>

            <PhotoScrollSection />

            {/* <div className="md:hidden">
                <InfiniteColumn artworks={[...COLUMN_1, ...COLUMN_2]} duration={30} />
            </div>

            <div className="hidden md:grid grid-cols-3 gap-10 max-w-7xl mx-auto px-4 h-[800px]">
                <InfiniteColumn artworks={COLUMN_1} duration={45} className="mt-0" />
                <InfiniteColumn artworks={COLUMN_2} duration={55} className="-mt-12" />
                <InfiniteColumn artworks={COLUMN_3} duration={40} className="mt-8" />
            </div> */}
        </section>
    );
}

export default GallerySection;

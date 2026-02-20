"use client"
import HeroImmersive from "@/components/HeroImmersive";
import ExplodedCanvas from "@/components/canvas/ExplodedCanvas";
import { useState } from "react";
import FinancialHUD from "@/components/FinancialHUD";
import AnalyticsTab from '@/components/artist/AnalyticsTab';
import ManifestoBlock from "@/components/ManifestoBlock";
import TechSpecs from "@/components/TechSpecs";
import ArtistReel from "@/components/ArtistReel";
import NavigationPill from "@/components/NavigationPill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import heroArtwork from "@/assets/hero-artwork.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

// Mock Data
const artistStatement = `The genesis of this work began in the liminal space between computation and consciousness. I sought to capture the moment when pure mathematics crosses the threshold into aesthetic experience—when the algorithm becomes the artist. Each fractal is a fingerprint of infinity, a proof that beauty can emerge from the coldest logic. In an age where attention is currency, I offer you a meditation on permanence.`;

const metadata = [
    { label: "Medium", value: "Generative Algorithm / GPU Render" },
    { label: "Dimensions", value: "8192 × 8192 px (Native)" },
    { label: "Edition", value: "1 of 1 (Unique)" },
    { label: "Blockchain", value: "Ethereum Mainnet" },
    { label: "Token Standard", value: "ERC-721" },
    { label: "Creation Date", value: "2024-09-15T00:00:00Z" },
    { label: "Render Time", value: "72 Hours (4× A100 GPU)" },
];

const moreArtworks = [
    { id: "1", title: "Recursive Void I", imageUrl: gallery1, price: 45000 },
    { id: "2", title: "Chrome Meditation", imageUrl: gallery2, price: 62000 },
    { id: "3", title: "Data Portrait #7", imageUrl: gallery3, price: 38000 },
    { id: "4", title: "Impossible Cathedral", imageUrl: gallery4, price: 78000 },
];

const Index = () => {
    const [exploded, setExploded] = useState(false);

    const handleCollect = async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Fractal collected!");
    };

    return (
        <main className="bg-void min-h-screen relative">
            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Hero Section */}
            <div className="w-full h-[90vh] relative z-20">
                <ExplodedCanvas
                    exploded={exploded}
                    onToggle={() => setExploded(!exploded)}
                    artworkUrl={typeof heroArtwork === 'string' ? heroArtwork : (heroArtwork as any).src}
                />
            </div>

            {/* Financial HUD */}
            <FinancialHUD
                pricePerFractal={1250}
                totalValuation={125000}
                availableFractals={73}
                totalFractals={100}
                onCollect={handleCollect}
            />

            {/* Content Sections */}
            <div className="relative z-10 px-8 md:px-16 py-10 md:pr-[400px]">
                <Tabs defaultValue="analytics" className="w-full">
                    <TabsList className="mb-8 bg-black/40 border border-white/10 text-white/70">
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none">Analytics</TabsTrigger>
                        <TabsTrigger value="about" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none">About</TabsTrigger>
                        <TabsTrigger value="details" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics" className="mt-0">
                        {/* Price History Chart */}
                        <AnalyticsTab />
                    </TabsContent>

                    <TabsContent value="about" className="mt-0">
                        {/* Artist Statement */}
                        <ManifestoBlock statement={artistStatement} className="mb-24" />
                    </TabsContent>

                    <TabsContent value="details" className="mt-0">
                        {/* Technical Specs */}
                        <TechSpecs metadata={metadata} className="mb-24" />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Artist Reel */}
            <ArtistReel
                artworks={moreArtworks}
                artistName="Kaelo X"
                className="pb-32"
            />

            {/* Navigation Pill */}
            <NavigationPill />
        </main>
    );
};

export default Index;

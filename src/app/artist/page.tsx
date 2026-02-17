"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ArtistHero from '@/components/artist/ArtistHero';
import CollectModule from '@/components/artist/CollectModule';
import ArtistTabs from '@/components/artist/ArtistTabs';
import ArtworksGrid from '@/components/artist/ArtworksGrid';
import AnalyticsTab from '@/components/artist/AnalyticsTab';
import AchievementsTab from '@/components/artist/AchievementsTab';
import HistoryTab from '@/components/artist/HistoryTab';
import CollectorsTab from '@/components/artist/CollectorsTab';

type TabType = 'artworks' | 'analytics' | 'achievements' | 'history' | 'collectors';

const artistData = {
  name: "Julian V. Koda",
  bio: "Deconstructing the digital soul through algorithmic decay and renaissance composition. Exploring the tension between the infinite void and human finitude.",
  location: "Kyoto, Japan",
  profileImage: "/assets/artist-portrait.jpg",
  isVerified: true,
  rank: "Top 1% Global",
};

const artworksData = [
  { id: '1', title: 'Void Symphony #12', image: '/assets/artwork-1.jpg', valuation: 45000, roi: '+24%', aspectRatio: 'portrait' as const },
  { id: '2', title: 'Emerald Pulse', image: '/assets/artwork-2.jpg', valuation: 28500, roi: '+18%', aspectRatio: 'landscape' as const },
  { id: '3', title: 'Golden Dissolution', image: '/assets/artwork-3.jpg', valuation: 72000, roi: '+45%', aspectRatio: 'square' as const },
  { id: '4', title: 'Algorithmic Decay I', image: '/assets/artwork-1.jpg', valuation: 38000, roi: '+12%', aspectRatio: 'portrait' as const },
  { id: '5', title: 'Digital Finitude', image: '/assets/artwork-2.jpg', valuation: 52000, roi: '+31%', aspectRatio: 'landscape' as const },
  { id: '6', title: 'Renaissance Fragment', image: '/assets/artwork-3.jpg', valuation: 65000, roi: '+28%', aspectRatio: 'portrait' as const },
];

const ArtistPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('artworks');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'artworks':
        return <ArtworksGrid artworks={artworksData} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'achievements':
        return <AchievementsTab />;
      case 'history':
        return <HistoryTab />;
      case 'collectors':
        return <CollectorsTab />;
      default:
        return <ArtworksGrid artworks={artworksData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <ArtistHero artist={artistData} />

      <div className="py-8 md:py-12 px-4 md:px-6">
        <ArtistTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-15">

          <div className="lg:col-span-8 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 order-1 lg:order-last">
            <div className="sticky top-6">
              <CollectModule
                pricePerFractal={240.50}
                totalSupply={1000}
                available={142}
                estimatedYield="12.4%"
                lockupPeriod="12 M"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtistPage;

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ArtistHero from '@/components/artist/ArtistHero';
import CollectModule from '@/components/artist/CollectModule';
import ArtistTabs from '@/components/artist/ArtistTabs';
import ArtworksGrid from '@/components/artist/ArtworksGrid';
import AnalyticsTab from '@/components/artist/AnalyticsTab';
import AchievementsTab from '@/components/artist/AchievementsTab';
import HistoryTab from '@/components/artist/HistoryTab';
import CollectorsTab from '@/components/artist/CollectorsTab';
import {
  getArtistBasicDetails,
  getArtistAchievements,
  getArtistHistory,
  getArtistCollectors,
  getArtistPriceHistory,
  type ArtistBasicDetails,
  type ArtistAchievement,
  type ArtistHistory,
  type ArtistCollector,
  type ArtistPriceHistory,
} from '@/apis/artists/artistActions';
import { strings } from '@/utils/strings';

type TabType = 'artworks' | 'analytics' | 'achievements' | 'history' | 'collectors';

// Static artworks (no API for artist artworks)
const artworksData = [
  { id: '1', title: 'Void Symphony #12', image: '/assets/artwork-1.jpg', valuation: 45000, roi: '+24%', aspectRatio: 'portrait' as const },
  { id: '2', title: 'Emerald Pulse', image: '/assets/artwork-2.jpg', valuation: 28500, roi: '+18%', aspectRatio: 'landscape' as const },
  { id: '3', title: 'Golden Dissolution', image: '/assets/artwork-3.jpg', valuation: 72000, roi: '+45%', aspectRatio: 'square' as const },
  { id: '4', title: 'Algorithmic Decay I', image: '/assets/artwork-1.jpg', valuation: 38000, roi: '+12%', aspectRatio: 'portrait' as const },
  { id: '5', title: 'Digital Finitude', image: '/assets/artwork-2.jpg', valuation: 52000, roi: '+31%', aspectRatio: 'landscape' as const },
  { id: '6', title: 'Renaissance Fragment', image: '/assets/artwork-3.jpg', valuation: 65000, roi: '+28%', aspectRatio: 'portrait' as const },
];

const PLACEHOLDER_AVATAR = '/assets/artist-portrait.jpg';

function buildMediaUrl(filePath: string | null | undefined): string {
  if (!filePath) return PLACEHOLDER_AVATAR;
  if (filePath.startsWith('http')) return filePath;
  const base = strings.base_url?.replace(/\/api\/?$/, '') ?? '';
  return filePath.startsWith('/') ? `${base}${filePath}` : `${base}/${filePath}`;
}

const ArtistPage = () => {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [activeTab, setActiveTab] = useState<TabType>('artworks');
  const [basicDetails, setBasicDetails] = useState<ArtistBasicDetails | null>(null);
  const [achievements, setAchievements] = useState<ArtistAchievement[]>([]);
  const [history, setHistory] = useState<ArtistHistory[]>([]);
  const [collectors, setCollectors] = useState<ArtistCollector[]>([]);
  const [priceHistory, setPriceHistory] = useState<ArtistPriceHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [basic, achievementsData, historyData, collectorsData, priceData] = await Promise.all([
          getArtistBasicDetails(id)(),
          getArtistAchievements(id)(),
          getArtistHistory(id)(),
          getArtistCollectors(id)(),
          getArtistPriceHistory(id)(),
        ]);
        console.log('Artist basic details:', basic);
        console.log('Artist achievements data:', achievementsData);
        console.log('Artist history data:', historyData);
        console.log('Artist collectors data:', collectorsData);
        console.log('Artist price history data:', priceData);
        setBasicDetails(basic ?? null);
        setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setCollectors(Array.isArray(collectorsData) ? collectorsData : []);
        setPriceHistory(priceData ?? null);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Failed to load artist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const artistData = basicDetails
    ? {
        name: basicDetails.artist_name,
        bio: basicDetails.bio ?? '',
        location: basicDetails.location ?? 'Unknown',
        profileImage: basicDetails.avatar_url ?? PLACEHOLDER_AVATAR,
        isVerified: true,
        rank: 'Top 1% Global',
      }
    : null;

  const collectModuleProps = basicDetails
    ? {
        pricePerFractal: Number(basicDetails.current_share_value) || 240.5,
        totalSupply: Number(basicDetails.total_fractals) || 1000,
        available: Number(basicDetails.available_fractals) ?? 142,
        estimatedYield: '12.4%',
        lockupPeriod: '12 M',
      }
    : { pricePerFractal: 240.5, totalSupply: 1000, available: 142, estimatedYield: '12.4%', lockupPeriod: '12 M' };

  const achievementsForTab = Array.isArray(achievements)
    ? achievements.map((a) => ({
        id: String(a.id),
        title: a.title,
        year: a.created_at ? new Date(a.created_at).getFullYear().toString() : '',
        description: a.description ?? '',
        image: buildMediaUrl(a.media?.file_path),
      }))
    : [];

  const historyForTab = Array.isArray(history)
    ? history.map((h) => ({
        id: String(h.id),
        type: 'exhibition' as const,
        title: h.title,
        date: h.created_at ? new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        description: h.description ?? '',
        image: buildMediaUrl(h.media?.file_path),
      }))
    : [];

  const collectorsForTab = Array.isArray(collectors)
    ? collectors.map((c, idx) => ({
        id: String(idx),
        name: c.name,
        handle: '—',
        fractalsHeld: c.total_shares_held,
        joinedDate: c.started_holding_date,
      }))
    : [];

  const priceDataForAnalytics = Array.isArray(priceHistory?.history)
    ? priceHistory.history.map((h) => ({
        month: h.month?.split?.(' ')[0] ?? h.month ?? '',
        price: h.price,
      }))
    : [
        { month: 'Jan', price: 180 },
        { month: 'Feb', price: 195 },
        { month: 'Mar', price: 210 },
        { month: 'Apr', price: 198 },
        { month: 'May', price: 225 },
        { month: 'Jun', price: 240 },
      ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'artworks':
        return <ArtworksGrid artworks={artworksData} />;
      case 'analytics':
        return <AnalyticsTab priceData={priceDataForAnalytics} />;
      case 'achievements':
        return <AchievementsTab achievements={achievementsForTab} />;
      case 'history':
        return <HistoryTab history={historyForTab} />;
      case 'collectors':
        return <CollectorsTab collectors={collectorsForTab} />;
      default:
        return <ArtworksGrid artworks={artworksData} />;
    }
  };

  if (!id || isNaN(id)) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-24 flex items-center justify-center">
        <p className="font-mono text-muted-foreground">Invalid artist ID</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-24 flex items-center justify-center">
        <p className="font-mono text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading || !artistData) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-24 flex items-center justify-center">
        <p className="font-mono text-muted-foreground">Loading...</p>
      </div>
    );
  }

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

          <div className="lg:col-span-8 lg:order-1">
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

          <div className="lg:col-span-4 lg:order-last">
            <div className="sticky top-6">
              <CollectModule {...collectModuleProps} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtistPage;

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ArtistHero from '@/components/artist/ArtistHero';
import CollectModule from '@/components/artist/CollectModule';
import ArtistTabs from '@/components/artist/ArtistTabs';
import ArtworksGrid, { ArtworksGridSkeleton } from '@/components/artist/ArtworksGrid';
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
  getArtistArtworks,
} from '@/apis/artists/artistActions';
import { strings } from '@/utils/strings';
import { Skeleton } from '@/components/ui/skeleton';
import { addToWatchlist } from '@/apis/my-collection/myCollectionActions';
import { toast } from 'sonner';

type TabType = 'artworks' | 'analytics' | 'achievements' | 'history' | 'collectors';

function ArtistPageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-[144px]">
      {/* Hero skeleton */}
      <div className="w-full min-h-[50vh] flex items-end justify-center pb-12 md:pb-24 px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-16 md:h-24 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-full shrink-0" />
          </div>
        </div>
      </div>
      {/* Tabs skeleton */}
      <div className="py-8 md:py-12 px-4 md:px-6 flex justify-center">
        <Skeleton className="h-11 w-96 rounded-full" />
      </div>
      {/* Content + sidebar skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-15">
          <div className="lg:col-span-8">
            <ArtworksGridSkeleton />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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
  const [artworks, setArtworks] = useState<any[]>([]);
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
        const [basic, achievementsData, historyData, collectorsData, priceData, artworksResponse] = await Promise.all([
          getArtistBasicDetails(id)(),
          getArtistAchievements(id)(),
          getArtistHistory(id)(),
          getArtistCollectors(id)(),
          getArtistPriceHistory(id)(),
          getArtistArtworks(id)(),
        ]);
        console.log('Artist basic details:', basic);
        console.log('Artist achievements data:', achievementsData);
        console.log('Artist history data:', historyData);
        console.log('Artist collectors data:', collectorsData);
        console.log('Artist price history data:', priceData);
        console.log('Artist artworks data:', artworksResponse);
        setBasicDetails(basic ?? null);
        setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setCollectors(Array.isArray(collectorsData) ? collectorsData : []);
        setPriceHistory(priceData ?? null);
        const list = Array.isArray(artworksResponse) ? artworksResponse : [];
        const mapped = list.length > 0
          ? list.map((a: any) => {
              const item = a as Record<string, unknown>;
              const mediaList = item.artwork_media as Array<{ is_primary?: boolean; media?: { file_path?: string } }> | undefined;
              const primaryOrFirst = Array.isArray(mediaList)
                ? mediaList.find((m) => m.is_primary) ?? mediaList[0]
                : undefined;
              const imageUrl = primaryOrFirst?.media?.file_path ?? (item.image as string) ?? '/assets/artwork-1.jpg';
              return {
                id: String(item.id ?? ''),
                title: (item.name ?? item.title ?? 'Untitled') as string,
                image: imageUrl,
                valuation: Number(item.valuation ?? item.starting_price ?? 0),
                roi: (item.roi as string) ?? '+0%',
                aspectRatio: (item.aspect_ratio ?? item.aspectRatio ?? 'PORTRAIT') as 'PORTRAIT' | 'LANDSCAPE' | 'SQUARE',
              };
            })
          : [];
        setArtworks(mapped);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Failed to load artist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const refetchAfterCollect = useCallback(async () => {
    if (id == null || isNaN(id)) return;
    try {
      const [basic, collectorsData, artworksResponse] = await Promise.all([
        getArtistBasicDetails(id)(),
        getArtistCollectors(id)(),
        getArtistArtworks(id)(),
      ]);
      setBasicDetails(basic ?? null);
      setCollectors(Array.isArray(collectorsData) ? collectorsData : []);
      const list = Array.isArray(artworksResponse) ? artworksResponse : [];
      const mapped = list.length > 0
        ? list.map((a: any) => {
            const item = a as Record<string, unknown>;
            const mediaList = item.artwork_media as Array<{ is_primary?: boolean; media?: { file_path?: string } }> | undefined;
            const primaryOrFirst = Array.isArray(mediaList)
              ? mediaList.find((m) => m.is_primary) ?? mediaList[0]
              : undefined;
            const imageUrl = primaryOrFirst?.media?.file_path ?? (item.image as string) ?? '/assets/artwork-1.jpg';
            return {
              id: String(item.id ?? ''),
              title: (item.name ?? item.title ?? 'Untitled') as string,
              image: imageUrl,
              valuation: Number(item.valuation ?? item.starting_price ?? 0),
              roi: (item.roi as string) ?? '+0%',
              aspectRatio: (item.aspect_ratio ?? item.aspectRatio ?? 'portrait') as 'portrait' | 'landscape' | 'square',
            };
          })
        : [];
      setArtworks(mapped);
    } catch (_err) {
      // Optionally toast or ignore refetch errors
    }
  }, [id]);

  const artistData = basicDetails
    ? {
        name: basicDetails.artist_name,
        bio: basicDetails.bio ?? '',
        location: basicDetails.location ?? 'Unknown',
        profileImage: basicDetails.avatar_url ?? PLACEHOLDER_AVATAR,
        isVerified: true,
        rank: 'Top 1% Global',
        social_media_links: basicDetails.social_media_links ?? [],
      }
    : isLoading
      ? { name: '—', bio: '', location: '—', profileImage: PLACEHOLDER_AVATAR, isVerified: false, rank: '—', social_media_links: [] }
      : null;

  const firstArtworkId = artworks.length > 0 ? Number(artworks[0].id) : null;
  const collectModuleProps = basicDetails
    ? {
        pricePerFractal: Number(basicDetails.current_share_value) || 240.5,
        totalSupply: Number(basicDetails.total_fractals) || 1000,
        available: Number(basicDetails.available_fractals) ?? 142,
        estimatedYield: '12.4%',
        lockupPeriod: '12 M',
        available_fractals: Number(basicDetails.available_fractals) ?? 142,
        total_fractals: Number(basicDetails.total_fractals) || 1000,
        firstArtworkId,
        onCollectSuccess: refetchAfterCollect,
      }
    : { pricePerFractal: 240.5, totalSupply: 1000, available: 142, estimatedYield: '12.4%', lockupPeriod: '12 M', firstArtworkId, onCollectSuccess: refetchAfterCollect };

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
        if (isLoading) return <ArtworksGridSkeleton />;
        return <ArtworksGrid artworks={artworks} />;
      case 'analytics':
        return <AnalyticsTab priceData={priceDataForAnalytics} />;
      case 'achievements':
        return <AchievementsTab achievements={achievementsForTab} />;
      case 'history':
        return <HistoryTab history={historyForTab} />;
      case 'collectors':
        return <CollectorsTab collectors={collectorsForTab} />;
      default:
        return <ArtworksGrid artworks={artworks} />;
    }
  };

  if (!id || isNaN(id)) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-[144px] flex items-center justify-center">
        <p className="font-mono text-muted-foreground">Invalid artist ID</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-[144px] flex items-center justify-center">
        <p className="font-mono text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return <ArtistPageSkeleton />;
  }

  if (!artistData) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-[144px] flex items-center justify-center">
        <p className="font-mono text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-[144px]">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <ArtistHero
        artist={artistData}
        onWatchlistClick={() => {
          if (id == null || isNaN(id)) return;
          addToWatchlist({ artist_profile_id: id })
            .then(() => toast.success('Added to watchlist'))
            .catch((err: any) => toast.error(err?.response?.data?.message ?? 'Failed to add to watchlist'));
        }}
      />

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
              <CollectModule {...collectModuleProps} id={Number(id)} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtistPage;

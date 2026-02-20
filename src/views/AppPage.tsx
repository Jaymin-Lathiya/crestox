"use client";

import React from 'react';
import NoiseOverlay from '@/components/layout/NoiseOverlay';
import Navigation from '@/components/layout/Navigation';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ExplodedCanvas = dynamic(() => import('@/components/canvas/ExplodedCanvas'), { ssr: false });
const GalaxyMarketplace = dynamic(() => import('@/components/canvas/GalaxyMarketplace'), { ssr: false });
const VaultDashboard = dynamic(() => import('@/components/canvas/VaultDashboard'), { ssr: false });
const OrbitalHUD = dynamic(() => import('@/components/hud/OrbitalHUD'), { ssr: false });

function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-primary font-mono text-sm tracking-widest animate-pulse">
          LOADING ASSETS...
        </p>
      </div>
    </div>
  );
}

function HomeView() {
  const { selectedArtwork, isExploded, setIsExploded } = useAppStore();

  const handleToggle = () => {
    setIsExploded(!isExploded);
    if (!isExploded && selectedArtwork) {
      toast.success('Asset fractionalized', {
        description: `${selectedArtwork.totalShards.toLocaleString()} shards available for trading`,
        duration: 3000,
      });
    }
  };

  const handleBuyClick = () => {
    toast.info('Connect wallet to purchase', {
      description: 'Wallet integration coming soon',
      duration: 4000,
    });
  };

  if (!selectedArtwork) return null;

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <OrbitalHUD
          exploded={isExploded}
          onBuyClick={handleBuyClick}
          assetId={selectedArtwork.id}
          artistName={selectedArtwork.artist}
          artworkTitle={selectedArtwork.title}
          totalShards={selectedArtwork.totalShards}
          pricePerShard={selectedArtwork.pricePerShard}
          marketStatus="live"
        />
      </Suspense>
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <ExplodedCanvas
            exploded={isExploded}
            onToggle={handleToggle}
            artworkUrl={selectedArtwork.imageUrl}
          />
        </Suspense>
      </div>
    </>
  );
}

function MarketplaceView() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={<LoadingScreen />}>
        <GalaxyMarketplace />
      </Suspense>
    </div>
  );
}

function VaultView() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={<LoadingScreen />}>
        <VaultDashboard />
      </Suspense>
    </div>
  );
}

function DetailView() {
  const { selectedArtwork, isExploded, setIsExploded, setCurrentView } = useAppStore();

  const handleToggle = () => {
    setIsExploded(!isExploded);
    if (!isExploded && selectedArtwork) {
      toast.success('Asset fractionalized', {
        description: `${selectedArtwork.totalShards.toLocaleString()} shards available for trading`,
        duration: 3000,
      });
    }
  };

  const handleBuyClick = () => {
    toast.info('Connect wallet to purchase', {
      description: 'Wallet integration coming soon',
      duration: 4000,
    });
  };

  if (!selectedArtwork) {
    setCurrentView('marketplace');
    return null;
  }

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <OrbitalHUD
          exploded={isExploded}
          onBuyClick={handleBuyClick}
          assetId={selectedArtwork.id}
          artistName={selectedArtwork.artist}
          artworkTitle={selectedArtwork.title}
          totalShards={selectedArtwork.totalShards}
          pricePerShard={selectedArtwork.pricePerShard}
          marketStatus="live"
        />
      </Suspense>
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <ExplodedCanvas
            exploded={isExploded}
            onToggle={handleToggle}
            artworkUrl={selectedArtwork.imageUrl}
          />
        </Suspense>
      </div>
      <button
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-muted-foreground font-mono text-xs tracking-widest hover:text-primary transition-colors"
        onClick={() => setCurrentView('marketplace')}
      >
        ← BACK TO GALAXY
      </button>
    </>
  );
}

export default function AppPage() {
  const { currentView } = useAppStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <NoiseOverlay />
      <Navigation />

      {currentView === 'home' && <HomeView />}
      {/* {currentView === 'marketplace' && <MarketplaceView />} */}
      {/* {currentView === 'vault' && <VaultView />}
      {currentView === 'detail' && <DetailView />} */}
    </main>
  );
}

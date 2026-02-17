import React from 'react';
import { Button } from '@/components/ui/button';

interface OrbitalHUDProps {
  exploded: boolean;
  onBuyClick: () => void;
  assetId: string;
  artistName: string;
  artworkTitle: string;
  totalShards: number;
  pricePerShard: number;
  marketStatus: 'live' | 'closed' | 'pending';
}

export default function OrbitalHUD({
  exploded,
  onBuyClick,
  assetId,
  artistName,
  artworkTitle,
  totalShards,
  pricePerShard,
  marketStatus,
}: OrbitalHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* TOP LEFT - Brand Mark */}
      <div className="hud-corner hud-top-left">
        <div className="animate-fade-in-up">
          <h1 className="text-foreground text-2xl font-bold tracking-[0.3em] font-mono">
            CRESTOX
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="pulse-dot" />
            <span className="text-primary text-xs font-mono tracking-widest uppercase">
              {marketStatus === 'live' ? 'Market Live' : marketStatus === 'pending' ? 'Opening Soon' : 'Market Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* TOP RIGHT - Wallet & Asset Info */}
      <div className="hud-corner hud-top-right">
        <div className="animate-fade-in-up delay-100">
          <p className="text-muted-foreground text-xs font-mono tracking-widest">ASSET ID</p>
          <p className="text-foreground font-mono text-lg">{assetId}</p>
          <div className="mt-3 text-right">
            <p className="text-muted-foreground text-xs font-mono">PRICE PER SHARD</p>
            <p className="text-primary font-mono text-xl font-bold">
              ₹{pricePerShard.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* CENTER - Artwork Title (Only when not exploded) */}
      {!exploded && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto cursor-pointer">
          <div className="animate-fade-in-up delay-200">
            <p className="text-muted-foreground text-xs font-mono tracking-[0.3em] mb-2">
              BY {artistName.toUpperCase()}
            </p>
            <h2 className="text-foreground font-serif italic text-4xl md:text-5xl lg:text-6xl mb-4 opacity-90 hover:opacity-100 transition-opacity">
              "{artworkTitle}"
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="w-8 h-px bg-muted-foreground" />
              <span className="text-muted-foreground text-xs font-mono tracking-[0.2em] hover:text-primary transition-colors">
                CLICK TO FRACTIONALIZE
              </span>
              <span className="w-8 h-px bg-muted-foreground" />
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM LEFT - Data Stats */}
      <div className="hud-corner hud-bottom-left">
        <div className="animate-fade-in-up delay-300">
          <div className="space-y-1 font-mono text-xs text-muted-foreground">
            <p>
              TOTAL SHARDS: <span className="text-foreground">{totalShards.toLocaleString()}</span>
            </p>
            <p>
              AVAILABLE: <span className="text-primary">{(totalShards * 0.67).toLocaleString()}</span>
            </p>
            <p>
              SUPPLY: <span className="text-foreground">100%</span>
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT - Action Button */}
      <div className="hud-corner hud-bottom-right">
        <div
          className={`transition-all duration-700 transform ${exploded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <Button
            variant="hero"
            size="lg"
            className="pointer-events-auto"
            onClick={onBuyClick}
          >
            <span>BUY SHARDS</span>
          </Button>
          <p className="text-muted-foreground text-xs font-mono mt-3 tracking-widest">
            MIN ORDER: 10 SHARDS
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!exploded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator animate-fade-in-up delay-500">
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground" />
            <span className="text-muted-foreground text-xs font-mono tracking-widest">SCROLL</span>
          </div>
        </div>
      )}
    </div>
  );
}

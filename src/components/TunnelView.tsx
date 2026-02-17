import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface WatchlistItem {
  id: string;
  artistName: string;
  artworkUrl: string;
  yieldPercent: number;
  floorPrice: number;
  provenance: string;
}

interface TunnelViewProps {
  items: WatchlistItem[];
  onItemClick?: (id: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const TunnelCard: React.FC<{
  item: WatchlistItem;
  index: number;
  onClick?: () => void;
}> = ({ item, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ scale: 1.03, z: 50 }}
      onClick={onClick}
      className="relative group cursor-pointer perspective-[1000px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative overflow-hidden rounded-sm border border-border/30 hover:border-border transition-all duration-500">
        {/* Artwork */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={item.artworkUrl}
            alt={item.artistName}
            className="w-full h-full object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-700 animate-breath"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Targeting Reticle SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" viewBox="0 0 300 300">
            <line x1="0" y1="150" x2="300" y2="150" stroke="hsl(0 0% 90%)" strokeWidth="0.5" strokeDasharray="4 8" className="animate-reticle" />
            <line x1="150" y1="0" x2="150" y2="300" stroke="hsl(0 0% 90%)" strokeWidth="0.5" strokeDasharray="4 8" className="animate-reticle" />
            <circle cx="150" cy="150" r="60" fill="none" stroke="hsl(0 0% 90%)" strokeWidth="0.5" strokeDasharray="4 8" className="animate-reticle" />
            <rect x="80" y="80" width="140" height="140" fill="none" stroke="hsl(0 0% 90%)" strokeWidth="0.5" className="animate-reticle" />
          </svg>

          {/* Artist Name */}
          <div className="absolute bottom-4 left-4 z-10">
            <h3 className="font-editorial italic text-3xl text-foreground/90 leading-none mix-blend-difference">
              {item.artistName}
            </h3>
          </div>
        </div>

        {/* Analysis HUD */}
        <motion.div
          className="bg-card/80 backdrop-blur-sm p-4 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="grid grid-cols-3 gap-4 font-mono text-[10px] text-muted-foreground">
            <div>
              <span className="block tracking-widest uppercase mb-1">YIELD</span>
              <span className="text-verdigris text-sm font-semibold">{item.yieldPercent.toFixed(1)}%</span>
            </div>
            <div>
              <span className="block tracking-widest uppercase mb-1">FLOOR</span>
              <span className="text-foreground/80 text-sm">{formatCurrency(item.floorPrice)}</span>
            </div>
            <div>
              <span className="block tracking-widest uppercase mb-1">PROVENANCE</span>
              <span className="text-foreground/80 text-sm">{item.provenance}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TunnelView: React.FC<any> = ({ items, onItemClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
        {items.map((item, index) => (
          <TunnelCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => onItemClick?.(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TunnelView;

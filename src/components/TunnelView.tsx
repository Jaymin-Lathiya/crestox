import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export interface WatchlistItem {
  id: number;
  artist_avatar_url: string;
  artist_name: string;
  per_share_price: string;
}

interface TunnelViewProps {
  items: WatchlistItem[];
  loading?: boolean;
  onItemClick?: (id: number) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const TunnelCard: React.FC<{
  item: WatchlistItem;
  index: number;
  onClick?: () => void;
}> = ({ item, index, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const perShare = parseFloat(item.per_share_price) || 0;

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ scale: 1.03, z: 50 }}
      onClick={handleCardClick}
      className="relative group cursor-pointer perspective-[1000px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative overflow-hidden rounded-sm border border-border/30 hover:border-border transition-all duration-500">
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img
            src={item.artist_avatar_url}
            alt={item.artist_name}
            className="w-full h-full object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-700 animate-breath"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <svg className="hidden md:block absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" viewBox="0 0 300 300">
            <line x1="0" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" className="animate-reticle text-muted-foreground/30" />
            <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" className="animate-reticle text-muted-foreground/30" />
            <circle cx="150" cy="150" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" className="animate-reticle text-muted-foreground/30" />
            <rect x="80" y="80" width="140" height="140" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-reticle text-muted-foreground/30" />
          </svg>

          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
            <h3 className="font-editorial italic text-xl sm:text-3xl text-foreground leading-none drop-shadow-lg">
              {item.artist_name}
            </h3>
          </div>
        </div>

        <motion.div
          className="hidden md:block bg-card/80 backdrop-blur-sm p-3 sm:p-4 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">
            <span className="block tracking-widest uppercase mb-1">Per share</span>
            <span className="text-primary text-xs sm:text-sm font-semibold">{formatCurrency(perShare)}</span>
          </div>
        </motion.div>

        <motion.div
          className="md:hidden bg-card/80 backdrop-blur-sm p-3 border-t border-border/30 overflow-hidden"
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-mono text-[9px] text-muted-foreground">
            <span className="block tracking-widest uppercase mb-1 text-[8px]">Per share</span>
            <span className="text-primary text-xs font-semibold">{formatCurrency(perShare)}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function WatchlistSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative overflow-hidden rounded-sm border border-border/30">
            <Skeleton className="h-48 sm:h-64 w-full" />
            <div className="p-3 sm:p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TunnelView: React.FC<TunnelViewProps> = ({ items, loading = false, onItemClick }) => {
  if (loading) {
    return <WatchlistSkeleton />;
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-7xl mx-auto px-6">
        <span className="text-muted-foreground font-mono text-sm">No artists in watchlist</span>
        <p className="text-muted-foreground/50 text-xs mt-2 font-sans">Add artists from their profile to track them here.</p>
      </div>
    );
  }

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

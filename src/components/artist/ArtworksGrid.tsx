import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getBufferPriceOfArtwork } from '@/apis/artists/artistActions';
import { useRouter } from 'next/navigation';

export interface Artwork {
  id: string;
  title: string;
  image: string;
  valuation: number;
  roi: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

interface ArtworksGridProps {
  artworks: Artwork[];
}

export function ArtworksGridSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="break-inside-avoid space-y-3">
          <Skeleton className="aspect-[3/4] w-full rounded-sm" />
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artworks }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {artworks.length > 0 ? (
        <> {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="break-inside-avoid"
          >
            <ArtworkCard artwork={artwork} />
          </motion.div>
        ))}

        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No artworks found</p>
        </div>
      )}
     
    </div>
  );
};

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const artworkId = Number(artwork.id);
  const router = useRouter();
  const [bufferPrice, setBufferPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  // console.log("artworkId", artwork);

  useEffect(() => {
    if (!artworkId || isNaN(artworkId)) {
      setPriceLoading(false);
      return;
    }
    let cancelled = false;
    getBufferPriceOfArtwork(artworkId)()
      .then((price) => {
        if (!cancelled) {
          setBufferPrice(typeof price === 'number' ? price : Number(price) || 0);
        }
      })
      .catch(() => {
        if (!cancelled) setBufferPrice(null);
      })
      .finally(() => {
        if (!cancelled) setPriceLoading(false);
      });
    return () => { cancelled = true; };
  }, [artworkId]);

  const displayValue = bufferPrice ?? artwork.valuation;
  const aspectClass = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  }[artwork.aspectRatio || 'portrait'];

  return (
    <div className="group relative overflow-hidden rounded-sm cursor-pointer">
      {/* Image Container */}
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <img 
          src={artwork.image} 
          alt={artwork.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-void/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" onClick={()=>{
          router.push(`/art/${artwork.id}`);
        }} />
        
        {/* Glass Capsule - Financial Data */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 glass-subtle px-4 py-2.5 rounded-full flex items-center space-x-3 transition-all duration-300 group-hover:pr-6"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Value</span>
            <span className="font-mono text-sm text-foreground">
              {priceLoading ? '—' : `₹${displayValue.toLocaleString() || "-"}`}
            </span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center space-x-1">
            <TrendingUp size={12} className="text-primary" />
            <span className="font-mono text-xs text-primary">{artwork.roi}</span>
          </div>
        </motion.div>
      </div>
      
      {/* Title on Hover */}
      <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="font-display text-lg text-foreground italic">{artwork.title}</p>
      </div>
    </div>
  );
};

export default ArtworksGrid;

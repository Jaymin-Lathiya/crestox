import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface Artwork {
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

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artworks }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {artworks.map((artwork, index) => (
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
    </div>
  );
};

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
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
        <div className="absolute inset-0 bg-void/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glass Capsule - Financial Data */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 glass-subtle px-4 py-2.5 rounded-full flex items-center space-x-3 transition-all duration-300 group-hover:pr-6"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Value</span>
            <span className="font-mono text-sm text-foreground">${artwork.valuation.toLocaleString()}</span>
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

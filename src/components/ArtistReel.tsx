import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
}

interface ArtistReelProps {
  artworks: any;
  artistName: string;
  className?: string;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const ArtworkCard: React.FC<{ artwork: Artwork }> = ({ artwork }) => {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[300px] h-[450px] cursor-pointer group overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Image */}
      <Image
        src={artwork.imageUrl}
        alt={artwork.title}
        className="w-full h-full object-cover grayscale-[80%] contrast-[120%] group-hover:grayscale-0 transition-all duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="font-mono text-[10px] text-acid uppercase tracking-wider block mb-2">
          {formatCurrency(artwork.price)}
        </span>
        <h3 className="font-serif text-marble text-lg italic leading-tight">
          {artwork.title}
        </h3>
      </div>

      {/* Hover Border */}
      <div className="absolute inset-0 border border-transparent group-hover:border-acid/30 transition-colors duration-300" />
    </motion.div>
  );
};

const ArtistReel: React.FC<ArtistReelProps> = ({
  artworks,
  artistName,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  return (
    <motion.section
      className={`w-full ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 px-8 md:px-16">
        <div className="flex items-center gap-4">
          <span className="data-label">More from {artistName}</span>
          <motion.div
            className="h-px bg-border w-24"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Scroll Progress Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-24 h-[2px] bg-secondary relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-acid"
              style={{ width: useTransform(scrollXProgress, [0, 1], ['0%', '100%']) }}
            />
          </div>
          <span className="font-mono text-[10px] text-ghost">SCROLL</span>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto custom-scrollbar pb-8 px-8 md:px-16"
        style={{ scrollbarWidth: 'thin' }}
      >
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}

        {/* End Spacer */}
        <div className="flex-shrink-0 w-16" />
      </div>
    </motion.section>
  );
};

export default ArtistReel;

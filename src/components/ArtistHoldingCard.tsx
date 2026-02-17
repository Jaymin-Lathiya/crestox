import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Holding } from './DriftGrid';

interface ArtistHoldingCardProps {
  holding: Holding;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSellClick: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const ArtistHoldingCard: React.FC<ArtistHoldingCardProps> = ({
  holding,
  isHovered,
  onHover,
  onLeave,
  onSellClick,
}) => {
  const isPositive = holding.gainPercent >= 0;

  return (
    <div
      className="relative overflow-hidden cursor-pointer group rounded-sm"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Artwork Image with Breath + Desaturation */}
      <div className="relative overflow-hidden">
        <img
          src={holding.artworkUrl}
          alt={holding.artistName}
          className="w-full h-auto object-cover animate-breath transition-all duration-700 grayscale-[60%] group-hover:grayscale-0"
          loading="lazy"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />

        {/* Artist Name — Editorial / Emotional */}
        <motion.div
          className="absolute bottom-16 left-4 z-10"
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-editorial italic text-4xl md:text-5xl text-foreground/90 leading-none mix-blend-difference select-none">
            {holding.artistName}
          </h3>
        </motion.div>

        {/* Glass Capsule — Financial Data */}
        <motion.div
          className="absolute bottom-3 right-3 z-10 glass-capsule rounded-sm px-4 py-3"
          animate={{ height: isHovered ? 'auto' : 'auto' }}
        >
          <div className="flex items-center gap-4 font-sans text-xs">
            <div>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase block">Invested</span>
              <span className="text-foreground/80 font-mono">{formatCurrency(holding.invested)}</span>
            </div>
            <div className="w-[1px] h-8 bg-border" />
            <div>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase block">Current</span>
              <span className={`font-mono font-semibold ${isPositive ? 'text-verdigris' : 'text-destructive'}`}>
                {formatCurrency(holding.currentValue)}
              </span>
            </div>
          </div>

          {/* Reveal Sell Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between"
              >
                <span className="text-[10px] text-muted-foreground font-mono">
                  {holding.quantity} UNITS • {isPositive ? '+' : ''}{holding.gainPercent.toFixed(1)}%
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onSellClick(); }}
                  className="text-xs font-sans font-medium text-accent hover:text-accent/80 transition-colors tracking-wide"
                >
                  SELL →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtistHoldingCard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ArtistHoldingCard from './ArtistHoldingCard';

export interface Holding {
  id: string;
  artistName: string;
  artworkUrl: string;
  invested: number;
  currentValue: number;
  quantity: number;
  gainPercent: number;
}

interface DriftGridProps {
  holdings: Holding[];
  onSellClick: (holding: Holding) => void;
}

const DriftGrid: React.FC<DriftGridProps> = ({ holdings, onSellClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-6 max-w-7xl mx-auto">
      {holdings.map((holding, index) => (
        <motion.div
          key={holding.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="break-inside-avoid"
        >
          <ArtistHoldingCard
            holding={holding}
            isHovered={hoveredId === holding.id}
            onHover={() => setHoveredId(holding.id)}
            onLeave={() => setHoveredId(null)}
            onSellClick={() => onSellClick(holding)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DriftGrid;

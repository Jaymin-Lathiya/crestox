import React from 'react';
import { motion } from 'framer-motion';
import type { Holding } from './DriftGrid';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

interface ListedItem extends Holding {
  listedPrice: number;
  listedDate: string;
  expiresIn: string;
}

interface ListedGridProps {
  items: ListedItem[];
}

const ListedGrid: React.FC<ListedGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-7xl mx-auto px-6">
        <span className="text-muted-foreground font-mono text-sm">NO ACTIVE LISTINGS</span>
        <p className="text-muted-foreground/50 text-xs mt-2 font-sans">Items you list for resale will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="border border-border/50 divide-y divide-border/30">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 p-4 text-[10px] tracking-widest uppercase text-muted-foreground font-sans">
          <span>Asset</span>
          <span>Listed Price</span>
          <span>Quantity</span>
          <span>Status</span>
          <span>Expires</span>
        </div>

        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-card/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <img src={item.artworkUrl} alt={item.artistName} className="w-10 h-10 object-cover rounded-sm grayscale-[50%] group-hover:grayscale-0 transition-all" />
              <span className="font-editorial italic text-foreground/90">{item.artistName}</span>
            </div>
            <span className="font-mono text-sm text-foreground">{formatCurrency(item.listedPrice)}</span>
            <span className="font-mono text-sm text-muted-foreground">{item.quantity}</span>
            <span className="text-xs font-mono text-accent">● ACTIVE</span>
            <span className="text-xs font-mono text-muted-foreground">{item.expiresIn}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ListedGrid;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';

interface CollectModuleProps {
  pricePerFractal?: number;
  totalSupply?: number;
  available?: number;
  estimatedYield?: string;
  lockupPeriod?: string;
}

const CollectModule: React.FC<CollectModuleProps> = ({
  pricePerFractal = 240.50,
  totalSupply = 1000,
  available = 142,
  estimatedYield = "12.4%",
  lockupPeriod = "12 M",
}) => {
  const [quantity, setQuantity] = useState(1);
  
  const sold = totalSupply - available;
  const progressPercent = (sold / totalSupply) * 100;

  return (
    <motion.aside 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="w-full"
    >
      {/* Glass Vault Container */}
      <div className="relative overflow-hidden rounded-lg glass shadow-2xl shadow-black/50">
        
        {/* Header: Status & Current Valuation */}
        <div className="p-5 border-b border-border flex justify-between items-start">
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Current Valuation
            </h3>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-muted-foreground text-lg">$</span>
              <span className="font-mono text-3xl text-foreground font-medium tracking-tight">
                {pricePerFractal.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="flex items-center space-x-1.5 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded text-primary text-[10px] font-mono font-bold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span>Open</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground mt-1">Updates live</span>
          </div>
        </div>

        {/* Supply Visualization */}
        <div className="px-5 py-6 space-y-4">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">Minted Supply</span>
            <span className="text-foreground">{sold} / {totalSupply}</span>
          </div>
          
          {/* Custom Progress Bar */}
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="h-full bg-gradient-to-r from-muted-foreground/50 to-primary glow-emerald"
            />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-px bg-muted border border-border rounded overflow-hidden mt-4">
            <StatBox label="Yield (Est)" value={estimatedYield} highlight />
            <StatBox label="Lock-up" value={lockupPeriod} />
          </div>
        </div>

        {/* Action Area */}
        <div className="p-5 bg-card/50 border-t border-border space-y-4">
          
          {/* Quantity Input */}
          <div className="flex items-center justify-between bg-background border border-border rounded px-4 py-3">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Qty</span>
            <input 
              type="number" 
              min="1" 
              max={available}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(available, parseInt(e.target.value) || 1)))}
              className="w-24 bg-transparent text-right font-mono text-foreground text-xl focus:outline-none"
            />
          </div>

          {/* Total Display */}
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Total</span>
            <span className="font-mono text-lg text-foreground">
              ${(pricePerFractal * quantity).toFixed(2)}
            </span>
          </div>

          {/* Primary Button: Liquid Metal Style */}
          <button className="group relative w-full h-12 bg-primary overflow-hidden rounded-sm border-t border-foreground/10 border-b border-background transition-all duration-300 active:scale-[0.98]">
            {/* Hover Glow Border */}
            <div className="absolute inset-0 border border-primary/50 rounded-sm transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]" />
            
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <span className="font-sans font-medium text-sm text-primary-foreground tracking-wide group-hover:text-primary-foreground transition-colors">
                Collect Fractal
              </span>
              <ArrowRight size={16} className="text-primary-foreground/80 group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            
            {/* Subtle Gloss Sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent opacity-50 pointer-events-none" />
          </button>

          <p className="text-center font-mono text-[10px] text-muted-foreground flex items-center justify-center space-x-1.5">
            <Info size={10} />
            <span>Gas fees included in final calculation</span>
          </p>
        </div>

      </div>
    </motion.aside>
  );
};

// Sub-component for Stats
interface StatBoxProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, highlight }) => (
  <div className="bg-background p-4 flex flex-col items-center justify-center">
    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">{label}</span>
    <span className={`font-mono text-sm font-medium ${highlight ? 'text-primary' : 'text-foreground'}`}>
      {value}
    </span>
  </div>
);

export default CollectModule;

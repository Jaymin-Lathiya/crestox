import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const formatNumber = (val: number) =>
  new Intl.NumberFormat('en-US').format(val);

interface FinancialHUDProps {
  pricePerFractal: number;
  totalValuation: number;
  availableFractals: number;
  totalFractals: number;
  onCollect: () => Promise<void>;
}

const FinancialHUD: React.FC<FinancialHUDProps> = ({
  pricePerFractal,
  totalValuation,
  availableFractals,
  totalFractals,
  onCollect,
}) => {
  const [stock, setStock] = useState(availableFractals);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setStock(availableFractals);
  }, [availableFractals]);

  const handleCollectClick = async () => {
    if (stock <= 0) return;
    
    setIsCollecting(true);
    setStock((prev) => Math.max(0, prev - 1));

    try {
      await onCollect();
    } catch (error) {
      setStock((prev) => prev + 1);
      console.error("Transaction failed", error);
    } finally {
      setIsCollecting(false);
    }
  };

  const progressPercent = (stock / totalFractals) * 100;
  const isSoldOut = stock === 0;

  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 md:top-auto z-50 w-full md:w-[340px]"
    >
      <div 
        className="glass-panel p-6 md:rounded-none shadow-2xl relative overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle glow on hover */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-acid blur-[100px] opacity-0 transition-opacity duration-700 pointer-events-none ${isHovered ? 'opacity-10' : ''}`} />

        <div className="flex flex-col gap-6 relative z-10">
          
          {/* Valuation & Price */}
          <div className="flex justify-between items-end border-b border-border pb-4">
            <div className="flex flex-col gap-1">
              <span className="data-label">Artwork Valuation</span>
              <span className="font-mono text-lg text-ghost">{formatCurrency(totalValuation)}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="font-mono text-[10px] text-acid uppercase tracking-[0.2em]">Ask Price</span>
              <div className="font-mono text-2xl text-marble flex items-center gap-2 justify-end">
                {formatCurrency(pricePerFractal)}
                <span className="block w-1.5 h-1.5 rounded-full bg-acid animate-pulse-glow shadow-[0_0_8px_hsl(72_100%_50%)]" />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-mono text-[10px] text-ghost uppercase">
              <span>Availability</span>
              <span className={isSoldOut ? "text-destructive" : "text-marble"}>
                {formatNumber(stock)} / {formatNumber(totalFractals)} Fractals
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-[2px] w-full bg-secondary relative overflow-hidden">
              <motion.div 
                className={`absolute top-0 left-0 h-full ${isSoldOut ? 'bg-destructive' : 'bg-acid'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </div>
          </div>

          {/* Collect Button */}
          <button
            onClick={handleCollectClick}
            disabled={isCollecting || isSoldOut}
            className="cyber-button h-[56px] w-full flex items-center justify-center"
          >
            <AnimatePresence mode='wait'>
              {isCollecting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="block w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0s' }}/>
                  <span className="block w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0.1s' }}/>
                  <span className="block w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0.2s' }}/>
                </motion.div>
              ) : (
                <motion.span
                  key="label"
                  className="relative z-10"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                >
                  {isSoldOut ? "SOLD OUT" : "INITIATE COLLECT"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          {/* Terms Link */}
          <div className="text-center">
            <a href="#" className="font-mono text-[9px] text-ghost hover:text-muted-foreground underline decoration-from-font underline-offset-2 transition-colors">
              SEC Regulation D / View Offering Circular
            </a>
          </div>

        </div>
      </div>
    </motion.aside>
  );
};

export default FinancialHUD;

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

interface ResaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  maxQuantity: number;
  royaltyRate: number;
  onSubmit: (data: { price: number; quantity: number }) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);

const ResaleModal: React.FC<ResaleModalProps> = ({
  isOpen,
  onClose,
  artistName,
  maxQuantity,
  royaltyRate,
  onSubmit,
}) => {
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');

  const calculations = useMemo(() => {
    const numPrice = parseFloat(price) || 0;
    const numQty = parseInt(quantity) || 0;
    const safeQty = Math.min(numQty, maxQuantity);
    const gross = numPrice * safeQty;
    const platformFee = gross * 0.02;
    const royalty = gross * (royaltyRate / 100);
    const net = gross - platformFee - royalty;
    return { gross, platformFee, royalty, net, safeQty };
  }, [price, quantity, maxQuantity, royaltyRate]);

  const handleSubmit = () => {
    if (calculations.net > 0) {
      onSubmit({ price: parseFloat(price), quantity: calculations.safeQty });
      onClose();
    }
  };

  const isOverMax = parseInt(quantity) > maxQuantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-void-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-[#0A0A0C]/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative backdrop-blur-2xl">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-lime to-transparent opacity-50" />

              {/* Header */}
              <div className="flex justify-between items-start p-8 pb-4">
                <div>
                  <h2 className="font-renaissance text-2xl text-foreground tracking-wide">
                    Initiate Resale
                  </h2>
                  <p className="font-cyber text-xs text-muted-foreground mt-1">
                    ASSET: {artistName.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-alert-crimson transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                {/* Price Input */}
                <div>
                  <label className="block font-cyber text-[10px] text-cyber-lime uppercase tracking-widest mb-2">
                    Listing Price (per Fractal)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute  font-cyber text-2xl text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="holographic-input pl-8 w-full h-10"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <div className="flex justify-between">
                    <label className="block font-cyber text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                      Quantity (Max: {maxQuantity})
                    </label>
                    {isOverMax && (
                      <span className="font-cyber text-[10px] text-alert-crimson">
                        Insufficient Holdings
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    max={maxQuantity}
                    className={`holographic-input pl-5 w-full h-10 ${
                      isOverMax ? '!border-alert-crimson !text-alert-crimson' : ''
                    }`}
                  />
                </div>

                <div className="glass-panel p-6 space-y-3">
                  <div className="flex justify-between items-center font-cyber text-xs text-foreground/60">
                    <span>Gross Value</span>
                    <span>{formatCurrency(calculations.gross)}</span>
                  </div>
                  <div className="flex justify-between items-center font-cyber text-xs text-muted-foreground">
                    <span>Platform Fee (2%)</span>
                    <span>- {formatCurrency(calculations.platformFee)}</span>
                  </div>
                  <div className="flex justify-between items-center font-cyber text-xs text-muted-foreground">
                    <span>Artist Royalty ({royaltyRate}%)</span>
                    <span>- {formatCurrency(calculations.royalty)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="font-cyber text-xs text-cyber-lime uppercase tracking-widest">
                      Est. Net Payout
                    </span>
                    <motion.span
                      key={calculations.net}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="font-cyber text-xl font-bold text-cyber-lime text-glow-lime"
                    >
                      {formatCurrency(Math.max(0, calculations.net))}
                    </motion.span>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={handleSubmit}
                  disabled={calculations.net <= 0 || isOverMax}
                  className="w-full group relative px-6 py-4 bg-cyber-lime hover:brightness-90 disabled:bg-muted disabled:cursor-not-allowed transition-all duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-cyber text-primary-foreground font-bold tracking-widest uppercase">
                      Confirm Listing
                    </span>
                    <ArrowRight size={18} className="text-primary-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResaleModal;

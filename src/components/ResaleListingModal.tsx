import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ArtistData {
  id: string;
  name: string;
  artworkUrl: string;
  maxQuantity: number;
  currentFloorPrice: number;
}

interface ResaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: ArtistData | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const ResaleListingModal: React.FC<ResaleModalProps> = ({ isOpen, onClose, artist }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  const PLATFORM_FEE = 0.025;
  const ROYALTY = 0.05;

  const grossValue = quantity * price;
  const platformFee = grossValue * PLATFORM_FEE;
  const royaltyFee = grossValue * ROYALTY;
  const netPayout = grossValue - platformFee - royaltyFee;
  const isError = artist ? quantity > artist.maxQuantity : false;

  useEffect(() => {
    if (isOpen && artist) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setQuantity(1);
      setPrice(artist.currentFloorPrice);
      setHasError(false);
    }
  }, [isOpen, artist]);

  useEffect(() => {
    if (isError && !hasError) {
      setHasError(true);
      setTimeout(() => setHasError(false), 400);
    }
  }, [isError]);

  const handleSubmit = async () => {
    if (isError || !artist) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(onClose, 2000);
  };

  if (!artist) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-xl cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-background border border-border shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>

            {/* Left: Context */}
            <div className="w-full md:w-5/12 relative h-48 md:h-auto overflow-hidden group min-h-[300px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
                style={{ backgroundImage: `url(${artist.artworkUrl})` }}
              />
              <div className="absolute inset-0 bg-background/40" />
              <div className="absolute bottom-6 left-6 z-10">
                <span className="block text-muted-foreground font-sans text-xs tracking-widest uppercase mb-2">Selected Asset</span>
                <h2 className="font-editorial italic text-4xl text-foreground leading-none">{artist.name}</h2>
              </div>
            </div>

            {/* Right: Control Panel */}
            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-between bg-background">
              {!isSuccess ? (
                <>
                  <div className="space-y-8">
                    <div className="flex justify-between items-baseline border-b border-border pb-4">
                      <h3 className="text-xl font-sans font-medium text-foreground">List for Resale</h3>
                      <span className="text-xs font-mono text-muted-foreground">AVAILABLE: {artist.maxQuantity} UNITS</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">Quantity</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min={1}
                            max={artist.maxQuantity}
                            className={`w-full bg-input text-foreground font-mono text-lg p-3 border focus:outline-none transition-all ${isError ? 'border-destructive' : 'border-border focus:border-muted-foreground'} ${hasError ? 'animate-shake' : ''}`}
                          />
                          {isError && (
                            <span className="absolute -bottom-5 left-0 text-[10px] text-destructive flex items-center gap-1">
                              <AlertTriangle size={10} /> Max {artist.maxQuantity}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">Price per Unit (₹)</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full bg-input text-foreground font-mono text-lg p-3 border border-border focus:border-muted-foreground focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="bg-card/50 p-4 border border-border/50 space-y-2 font-mono text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Gross Sale Value</span><span className="text-foreground/80">{formatCurrency(grossValue)}</span></div>
                      <div className="flex justify-between"><span>Platform Fee (2.5%)</span><span>- {formatCurrency(platformFee)}</span></div>
                      <div className="flex justify-between"><span>Artist Royalty (5.0%)</span><span>- {formatCurrency(royaltyFee)}</span></div>
                      <div className="h-[1px] bg-border my-2" />
                      <div className="flex justify-between text-sm font-bold text-primary">
                        <span>Net Estimated Payout</span>
                        <span>{formatCurrency(netPayout)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-2 text-[10px] text-muted-foreground font-sans leading-tight">
                      <Info size={12} className="shrink-0 mt-[2px]" />
                      <p>Listing duration is set to 7 days by default. Unsold items return to your wallet automatically.</p>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isError}
                      className="liquid-metal w-full h-14 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2 text-foreground font-sans font-medium tracking-wide">
                        {isSubmitting ? (
                          <span className="animate-pulse">PROCESSING BLOCK...</span>
                        ) : (
                          <>CONFIRM LISTING <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" /></>
                        )}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-accent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary"
                  >
                    <CheckCircle2 size={32} className="text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-sans font-medium text-foreground mb-2">Listing Active</h3>
                    <p className="text-muted-foreground font-mono text-sm max-w-xs mx-auto">
                      Your fractals have been digitized and placed on the secondary market.
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-dashed border-border font-mono text-xs text-muted-foreground">
                    ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResaleListingModal;

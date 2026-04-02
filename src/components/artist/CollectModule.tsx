import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { getBufferPriceQuote, initiateBuyOrder, completeBuyOrder } from '@/apis/artists/artistActions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import GradientButton from '../ui/gradiant-button';

// Feature flag: Set to true when Razorpay is configured
const ENABLE_RAZORPAY = false;

// Razorpay types (for when ENABLE_RAZORPAY is true)
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CollectModuleProps {
  pricePerFractal?: number;
  totalSupply?: number;
  available?: number;
  estimatedYield?: string;
  lockupPeriod?: string;
  available_fractals?: number;
  total_fractals?: number;
  firstArtworkId?: number | null;
  onCollectSuccess?: () => void;
  id?: number | null;
  isAtwork?: boolean;
}

const CollectModule: React.FC<CollectModuleProps> = ({
  pricePerFractal = 240.50,
  totalSupply = 1000,
  available = 142,
  estimatedYield = "12.4%",
  lockupPeriod = "12 M",
  available_fractals = 142,
  total_fractals = 1000,
  firstArtworkId = null,
  id = null,
  onCollectSuccess,
  isAtwork = false,
}) => {
  const [quantity, setQuantity] = useState<any>(1);
  const [quote, setQuote] = useState<{ current_price: number; buffer_percent: number | null } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script (only when ENABLE_RAZORPAY is true)
  useEffect(() => {
    if (ENABLE_RAZORPAY) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      // In demo mode, mark as "loaded" immediately
      setRazorpayLoaded(true);
    }
  }, []);

  useEffect(() => {
    const id = firstArtworkId != null && !isNaN(firstArtworkId) ? firstArtworkId : null;
    if (id == null) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    setQuoteLoading(true);
    getBufferPriceQuote(id, quantity)()
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {
        if (!cancelled) setQuote(null);
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => { cancelled = true; };
  }, [firstArtworkId, quantity]);

  const sold = totalSupply - available;
  const progressPercent = (sold / totalSupply) * 100;

  const currentPrice = quote?.current_price ?? pricePerFractal;
  const bufferPercent = quote?.buffer_percent ?? 0;

  const parsedQty = parseInt(String(quantity), 10);
  const effectiveQty = !isAtwork ? 0 : (quantity === "" ? 0 : (Number.isNaN(parsedQty) ? 0 : Math.max(0, parsedQty)));

  const baseAmount = effectiveQty * currentPrice;
  const bufferAdjustment = baseAmount * (bufferPercent / 100);
  const subTotal = baseAmount;
  const gst = subTotal * 0.18;
  const total = gst + subTotal;

  const artist_profile_id = typeof window !== 'undefined' ? localStorage.getItem("artist_profile_id") : null;

  const formatCurrencyWithSmallDecimals = (val: number) => {
    const parts = val.toFixed(2).split('.');
    if (parts.length !== 2) return val.toFixed(2);
    return (
      <>
        {parts[0]}<span className="text-[0.7em] opacity-70">.{parts[1]}</span>
      </>
    );
  };

  const handleCollectConfirm = async () => {
    const artworkId = firstArtworkId != null && !isNaN(firstArtworkId) ? firstArtworkId : null;
    if (artworkId == null) {
      toast.error('No artwork selected');
      return;
    }

    setCollecting(true);
    setConfirmOpen(false);

    try {
      // Step 1: Initiate buy order
      const orderData = await initiateBuyOrder({
        artwork_id: artworkId,
        quantity: effectiveQty,
        max_slippage_pct: 5,
        quoted_price: currentPrice,
      })();

      if (ENABLE_RAZORPAY) {
        // ─── RAZORPAY FLOW (Production) ───────────────────────────────────
        // Step 2: Open Razorpay checkout
        const options = {
          key: orderData.razorpay_key_id,
          amount: parseFloat(orderData.amount) * 100, // Convert to paise
          currency: orderData.currency,
          name: 'Crestox',
          description: `Purchase ${effectiveQty} fractals`,
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              // Step 3: Complete the order after successful payment
              await completeBuyOrder({
                artwork_id: artworkId,
                quantity: effectiveQty,
                razorpay_order_id: orderData.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                max_slippage_pct: 5,
                quoted_price: currentPrice,
              })();

              toast.success('Fractals collected successfully');
              if (onCollectSuccess) onCollectSuccess();
            } catch (err: any) {
              toast.error(err?.response?.data?.message ?? 'Failed to complete purchase');
            } finally {
              setCollecting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setCollecting(false);
              toast.info('Payment cancelled');
            },
          },
          theme: {
            color: '#3B82F6',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // ─── DEMO MODE (Bypass Razorpay) ──────────────────────────────────
        // Step 2: Simulate successful payment
        toast.info('Processing payment...');
        
        // Generate mock payment credentials
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockSignature = `mock_signature_${Date.now()}`;

        // Step 3: Complete the order with mock payment data
        await completeBuyOrder({
          artwork_id: artworkId,
          quantity: effectiveQty,
          razorpay_order_id: orderData.razorpay_order_id,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
          max_slippage_pct: 5,
          quoted_price: currentPrice,
        })();

        toast.success('Fractals collected successfully');
        if (onCollectSuccess) onCollectSuccess();
        setCollecting(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to complete purchase');
      setCollecting(false);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-[#1E293B] p-6 flex flex-col gap-6 shadow-2xl">

        {/* Header: Status & Current Valuation */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans text-sm font-medium tracking-wide text-blue-600 dark:text-[#3B82F6] uppercase">
              Current Valuation
            </h3>
            <div className="flex items-baseline space-x-1">
              <span className="font-sans text-4xl text-slate-900 dark:text-white font-bold tracking-tight">
                ₹{quoteLoading ? '—' : currentPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-[#1E3A8A]/40 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-blue-500 dark:bg-[#60A5FA] rounded-full" />
              <span className="text-blue-600 dark:text-[#60A5FA] text-xs font-medium uppercase tracking-wide">
                Open
              </span>
            </div>
          </div>
        </div>

        {/* Supply Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-sans">
            <span className="text-slate-500 dark:text-zinc-400">Minted Supply</span>
            <span className="text-slate-500 dark:text-zinc-400">{available} / {totalSupply}</span>
          </div>

          <div className="h-2 w-full bg-slate-200 dark:bg-[#1E293B] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 dark:to-[#3B82F6] rounded-full"
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Yield */}
          <div className="bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#1E293B] rounded-xl p-4 flex flex-col justify-center">
            <span className="text-sm font-sans text-slate-500 dark:text-zinc-400 mb-1">Yield (Est)</span>
            <span className="font-sans text-2xl font-semibold text-blue-600 dark:text-[#3B82F6]">
              {estimatedYield}
            </span>
          </div>
          {/* Lock-up */}
          <div className="bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-[#1E293B] rounded-xl p-4 flex flex-col justify-center">
            <span className="text-sm font-sans text-slate-500 dark:text-zinc-400 mb-1">Lock-up</span>
            <span className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
              {lockupPeriod}
            </span>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-sm text-slate-500 dark:text-zinc-400">Quantity</span>
          <div className="bg-white dark:bg-transparent border border-slate-200 dark:border-[#1E293B] rounded-lg px-4 py-3 flex items-center shadow-sm dark:shadow-none">
            <input
              type="number"
              disabled={!isAtwork}
              max={Math.max(1, available)}
              value={quantity}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setQuantity("");
                  return;
                }
                const num = Number(raw);
                if (!Number.isNaN(num) && num >= 0) {
                  setQuantity(num);
                }
              }}
              className="w-full bg-transparent font-sans text-slate-900 dark:text-white text-base focus:outline-none"
            />
          </div>
        </div>

        {/* Sub total & Total Display */}
        <div className="flex flex-col gap-3 font-sans pt-2">
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400">
            <span className="text-sm">Sub Total</span>
            <div className="flex items-center gap-1">
              {quoteLoading ? <Skeleton className="h-5 w-16" /> : (
                <>
                  <span className="text-slate-900 dark:text-white">₹{formatCurrencyWithSmallDecimals(subTotal)}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                    +-{bufferPercent.toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400">
            <span className="text-sm">GST (18%)</span>
            {quoteLoading ? <Skeleton className="h-5 w-16" /> : <span className="text-slate-900 dark:text-white">₹{formatCurrencyWithSmallDecimals(gst)}</span>}
          </div>
          <div className="w-full h-px bg-slate-200 dark:bg-[#1E293B] my-1" />
          <div className="flex justify-between items-center">
            <span className="text-base text-slate-600 dark:text-zinc-300">Total</span>
            <div className="flex items-center gap-2">
              {quoteLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <>
                  <span className="text-xl text-slate-900 dark:text-white font-bold tracking-tight">
                    ₹{formatCurrencyWithSmallDecimals(total)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wider font-medium">
                    +-{bufferPercent.toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Primary Button */}
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          // disabled={firstArtworkId == null || (Number(artist_profile_id) === id) || !isAtwork || !razorpayLoaded}
          className="group w-full h-12 bg-blue-500 dark:bg-[#3B82F6] hover:bg-blue-600 dark:hover:bg-[#2563EB] text-white rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
        >
          <span className="font-sans font-medium text-base">
            {!razorpayLoaded ? 'Loading...' : 'Collect Fractal'}
          </span>
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <p className="text-center font-sans text-xs text-slate-400 dark:text-zinc-500">
          {ENABLE_RAZORPAY ? 'Secure payment via Razorpay' : 'Payment processing (Demo mode)'}
        </p>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Collect fractal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to collect {effectiveQty} fractal(s)? 
                {ENABLE_RAZORPAY 
                  ? ' You will be redirected to Razorpay to complete the payment securely.'
                  : ' Payment will be processed automatically (Demo mode).'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex justify-end items-center gap-2'>
              <AlertDialogCancel disabled={collecting} className='rounded-lg h-11'>Cancel</AlertDialogCancel>
              <GradientButton variant='primary' label={collecting ? 'Collecting…' : 'Confirm'} onClick={handleCollectConfirm} disabled={collecting} />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </motion.aside>
  );
};

export default CollectModule;

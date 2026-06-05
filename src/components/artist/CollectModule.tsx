import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import {
  getBufferPriceQuote,
  initiateBuyOrder,
  completeBuyOrder,
  type BufferPriceQuote,
  type CompleteBuyOrderResponse,
} from '@/apis/artists/artistActions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getCookie } from '@/utils/cookieUtils';
import { cn } from '@/lib/utils';

const NOT_LOGGED_IN_BUY_MESSAGE =
  'You are not logged in. Log in to buy the fractal.';

function hasAuthToken(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(getCookie('token')?.trim());
}

const ENABLE_RAZORPAY = true;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type CollectModuleLayout = 'sidebar' | 'floating';

interface CollectModuleProps {
  pricePerFractal?: number;
  totalSupply?: number;
  available?: number;
  available_fractals?: number;
  total_fractals?: number;
  firstArtworkId?: number | null;
  onCollectSuccess?: (result?: CompleteBuyOrderResponse) => void;
  isAtwork?: boolean;
  /** Shown in the collect dialog title: "Collect from {collectContextLabel}" */
  collectContextLabel?: string;
  layout?: CollectModuleLayout;
  className?: string;
}

const CollectModule: React.FC<CollectModuleProps> = ({
  pricePerFractal = 240.5,
  totalSupply = 1000,
  available = 142,
  available_fractals = 142,
  total_fractals = 1000,
  firstArtworkId = null,
  onCollectSuccess,
  isAtwork = false,
  collectContextLabel = 'Artist',
  layout = 'sidebar',
  className,
}) => {
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [quote, setQuote] = useState<BufferPriceQuote | null>(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [dialogQuoteLoading, setDialogQuoteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const prevArtworkIdRef = useRef<number | null>(null);
  const prevDialogOpenRef = useRef(false);
  const quoteRequestRef = useRef(0);

  const total = total_fractals || totalSupply;
  const showMarketSkeleton = marketLoading && quote == null;
  const showDialogQuoteSkeleton = dialogQuoteLoading || showMarketSkeleton;

  // Artwork pages pass per-artwork availability; artist pages pass portfolio-wide totals.
  const displayAvailable =
    available_fractals != null && Number.isFinite(Number(available_fractals))
      ? Number(available_fractals)
      : available != null && Number.isFinite(Number(available))
        ? Number(available)
        : null;

  const availShow =
    displayAvailable != null
      ? displayAvailable
      : quote?.total_available_shares != null && Number.isFinite(quote.total_available_shares)
        ? quote.total_available_shares
        : 0;

  const showAvailabilitySkeleton =
    displayAvailable == null && showMarketSkeleton && firstArtworkId != null;
  const availableBarPercent = total > 0 ? (availShow / total) * 100 : 0;

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
    }
    setRazorpayLoaded(true);
    return undefined;
  }, []);

  type QuoteFetchMode = 'initial' | 'silent' | 'dialog';

  const fetchQuote = useCallback(async (artworkId: number, qty: number, mode: QuoteFetchMode) => {
    const requestId = ++quoteRequestRef.current;
    if (mode === 'initial') {
      setMarketLoading(true);
    } else if (mode === 'dialog') {
      setDialogQuoteLoading(true);
    }

    try {
      const data = await getBufferPriceQuote(artworkId, qty)();
      if (requestId !== quoteRequestRef.current) return;
      setQuote(data);
    } catch {
      if (requestId !== quoteRequestRef.current) return;
      if (mode === 'initial') setQuote(null);
    } finally {
      if (requestId !== quoteRequestRef.current) return;
      if (mode === 'initial') setMarketLoading(false);
      if (mode === 'dialog') setDialogQuoteLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = firstArtworkId != null && !isNaN(firstArtworkId) ? firstArtworkId : null;
    if (id == null) {
      quoteRequestRef.current += 1;
      setQuote(null);
      setMarketLoading(false);
      setDialogQuoteLoading(false);
      prevArtworkIdRef.current = null;
      return;
    }

    const artworkChanged = prevArtworkIdRef.current !== id;
    prevArtworkIdRef.current = id;
    if (artworkChanged) {
      setQuote(null);
    }

    const dialogJustClosed = !dialogOpen && prevDialogOpenRef.current;
    prevDialogOpenRef.current = dialogOpen;
    if (dialogJustClosed && !artworkChanged) {
      return;
    }

    const q = quantity === '' ? 1 : quantity;
    const mode: QuoteFetchMode = artworkChanged
      ? 'initial'
      : dialogOpen
        ? 'dialog'
        : 'silent';
    void fetchQuote(id, q, mode);
  }, [firstArtworkId, quantity, dialogOpen, fetchQuote]);

  const maxQty = Math.max(0, availShow);

  useEffect(() => {
    if (!dialogOpen || maxQty <= 0) return;
    setQuantity((prev) => {
      const n = prev === '' ? 1 : prev;
      return Math.min(maxQty, Math.max(1, n));
    });
  }, [dialogOpen, maxQty]);

  const currentPrice = quote?.current_price ?? 0;
  const bufferPercent = quote?.buffer_percent ?? 0;

  const parsedQty = parseInt(String(quantity), 10);
  const effectiveQty =
    !isAtwork ? 0 : quantity === '' ? 0 : Number.isNaN(parsedQty) ? 0 : Math.max(0, parsedQty);

  const baseAmount = effectiveQty * currentPrice;
  const hasFillPreview =
    Boolean(quote?.fill_breakdown?.length) &&
    quote?.fill_subtotal_pre_tax != null &&
    quote?.fill_total_buyer_pays != null;
  const subTotalPreTax = hasFillPreview
    ? parseFloat(quote!.fill_subtotal_pre_tax!)
    : baseAmount;
  const fallbackGst = baseAmount * 0.18;
  const totalPayableInr = hasFillPreview
    ? parseFloat(quote!.fill_total_buyer_pays!)
    : baseAmount + fallbackGst;
  const taxesAndFeesAmount = hasFillPreview
    ? Math.max(0, totalPayableInr - subTotalPreTax)
    : fallbackGst;

  const formatCurrencyWithSmallDecimals = (val: number) => {
    const parts = val.toFixed(2).split('.');
    if (parts.length !== 2) return val.toFixed(2);
    return (
      <>
        {parts[0]}<span className="text-[0.7em] opacity-70">.{parts[1]}</span>
      </>
    );
  };

  const canInteract = Boolean(firstArtworkId != null && !isNaN(firstArtworkId) && isAtwork && maxQty > 0);

  const bumpQuantity = (delta: number) => {
    setQuantity((prev) => {
      const base = prev === '' ? 0 : prev;
      const next = Math.min(maxQty || 1, Math.max(1, base + delta));
      return next;
    });
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === '') {
      setQuantity('');
      return;
    }
    if (!/^\d+$/.test(raw)) return;
    const n = parseInt(raw, 10);
    if (n > maxQty) {
      setQuantity(maxQty);
      return;
    }
    setQuantity(n);
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || quantity === 0) {
      setQuantity(1);
    }
  };

  const fillSourceLabel = (source: 'SECONDARY_SALE' | 'PRIMARY_SALE') =>
    source === 'SECONDARY_SALE' ? 'Reseller' : 'Artist';

  const quoteFromComplete = useCallback(
    (complete: CompleteBuyOrderResponse): BufferPriceQuote => {
      const p = parseFloat(complete.fractal_price_after);
      const price = Number.isFinite(p) ? p : 0;
      const rawAvail =
        complete.artwork_available_shares_after ?? complete.available_shares_after;
      const nextAvail =
        typeof rawAvail === 'number' && Number.isFinite(rawAvail) ? rawAvail : 0;
      return {
        current_price: price,
        buffer_percent: null,
        fill_breakdown: [],
        fill_subtotal_pre_tax: null,
        fill_total_buyer_pays: null,
        total_available_shares: nextAvail,
        sufficient_for_quantity: nextAvail >= 1,
      };
    },
    [],
  );

  const refreshAfterPurchase = useCallback(
    async (artworkId: number, complete: CompleteBuyOrderResponse) => {
      setQuantity(1);
      setCollecting(false);

      setQuote(quoteFromComplete(complete));
      setMarketLoading(false);

      toast.success('Fractals collected successfully');
      onCollectSuccess?.(complete);

      await fetchQuote(artworkId, 1, dialogOpen ? 'dialog' : 'silent');
    },
    [onCollectSuccess, quoteFromComplete, fetchQuote, dialogOpen],
  );

  const openDialog = () => {
    if (!canInteract) {
      toast.error('No fractals available to collect for this artwork yet.');
      return;
    }
    setDialogOpen(true);
  };

  const inventoryShort =
    quote?.sufficient_for_quantity === false && quote?.total_available_shares != null;

  const handleCollectConfirm = async () => {
    if (!hasAuthToken()) {
      toast.error(NOT_LOGGED_IN_BUY_MESSAGE);
      return;
    }

    const artworkId = firstArtworkId != null && !isNaN(firstArtworkId) ? firstArtworkId : null;
    if (artworkId == null) {
      toast.error('No artwork selected');
      return;
    }

    if (effectiveQty < 1) {
      toast.error('Choose a quantity of at least 1');
      return;
    }

    if (quote?.sufficient_for_quantity === false) {
      toast.error(
        quote.total_available_shares != null
          ? `Only ${quote.total_available_shares} fractal(s) available at this price mix.`
          : 'Not enough fractals available for this quantity.',
      );
      return;
    }

    const quotedFractalPrice = quote?.current_price ?? 0;

    setCollecting(true);

    try {
      const orderData = await initiateBuyOrder({
        artwork_id: artworkId,
        quantity: effectiveQty,
        max_slippage_pct: 5,
        quoted_price: quotedFractalPrice,
      })();

      if (ENABLE_RAZORPAY) {
        const options = {
          key: orderData.razorpay_key_id,
          amount: parseFloat(orderData.amount) * 100,
          currency: orderData.currency,
          name: 'Crestox',
          description: `Purchase ${effectiveQty} fractals`,
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              const completed = await completeBuyOrder({
                artwork_id: artworkId,
                quantity: effectiveQty,
                razorpay_order_id: orderData.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                max_slippage_pct: 5,
                quoted_price: quotedFractalPrice,
                payment_response: response,
              })();
              await refreshAfterPurchase(artworkId, completed);
            } catch (err: any) {
              const s = err?.response?.status;
              toast.error(
                s === 401 || s === 403
                  ? NOT_LOGGED_IN_BUY_MESSAGE
                  : err?.response?.data?.message ?? 'Failed to complete purchase',
              );
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

        setDialogOpen(false);

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.info('Processing payment...');

        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockSignature = `mock_signature_${Date.now()}`;

        const completed = await completeBuyOrder({
          artwork_id: artworkId,
          quantity: effectiveQty,
          razorpay_order_id: orderData.razorpay_order_id,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
          max_slippage_pct: 5,
          quoted_price: quotedFractalPrice,
        })();

        await refreshAfterPurchase(artworkId, completed);
      }
    } catch (err: any) {
      const s = err?.response?.status;
      toast.error(
        s === 401 || s === 403
          ? NOT_LOGGED_IN_BUY_MESSAGE
          : err?.response?.data?.message ?? 'Failed to complete purchase',
      );
      setCollecting(false);
    }
  };

  const asideClass =
    layout === 'floating'
      ? 'relative lg:fixed lg:left-auto lg:right-8 lg:bottom-8 lg:top-auto z-50 w-full lg:w-[340px]'
      : 'w-full';

  const innerSurface =
    layout === 'floating'
      ? 'glass-panel border border-foreground/10 bg-background/80'
      : 'bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-[#1E293B]';

  const summaryHeadingCls =
    layout === 'floating'
      ? 'text-[#60A5FA]'
      : 'text-blue-600 dark:text-[#3B82F6]';
  const summaryPriceCls =
    layout === 'floating' ? 'text-white' : 'text-slate-900 dark:text-white';
  const summaryMutedCls =
    layout === 'floating' ? 'text-zinc-400' : 'text-slate-500 dark:text-zinc-400';
  const summaryBarTrackCls =
    layout === 'floating' ? 'bg-white/10' : 'bg-slate-200 dark:bg-[#1E293B]';
  const summaryHintCls =
    layout === 'floating' ? 'text-zinc-500' : 'text-slate-400 dark:text-zinc-500';

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: layout === 'floating' ? 50 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: layout === 'floating' ? 0.5 : 0.4, duration: 0.8 }}
        className={cn(asideClass, className)}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl p-6 flex flex-col gap-6 shadow-2xl w-full text-left',
            innerSurface,
            !canInteract || !razorpayLoaded ? 'opacity-60' : '',
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h3 className={cn('font-sans text-sm font-medium tracking-wide uppercase', summaryHeadingCls)}>
                Current Valuation
              </h3>
              <div className="flex items-baseline space-x-1 min-h-[2.5rem]">
                {showMarketSkeleton && firstArtworkId != null ? (
                  <Skeleton
                    className={cn(
                      'h-10 w-40 rounded-lg',
                      layout === 'floating'
                        ? 'bg-white/15'
                        : 'bg-slate-200 dark:bg-zinc-700',
                    )}
                  />
                ) : (
                  <span className={cn('font-sans text-4xl font-bold tracking-tight', summaryPriceCls)}>
                    {'\u20B9'}
                    {currentPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-sans min-h-[1.25rem]">
              <span className={summaryMutedCls}>Available fractals</span>
              {showAvailabilitySkeleton ? (
                <Skeleton
                  className={cn(
                    'h-4 w-28 rounded',
                    layout === 'floating'
                      ? 'bg-white/15'
                      : 'bg-slate-200 dark:bg-zinc-700',
                  )}
                />
              ) : (
                <span className={summaryMutedCls}>
                  {availShow.toLocaleString()} / {total.toLocaleString()}
                </span>
              )}
            </div>

            <div className={cn('h-2 w-full rounded-full overflow-hidden', summaryBarTrackCls)}>
              {showAvailabilitySkeleton ? (
                <Skeleton
                  className={cn(
                    'h-full w-full rounded-full',
                    layout === 'floating'
                      ? 'bg-white/15'
                      : 'bg-slate-200 dark:bg-zinc-700',
                  )}
                />
              ) : (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${availableBarPercent}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 dark:to-[#3B82F6] rounded-full"
                />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={openDialog}
            disabled={!canInteract || !razorpayLoaded}
            className="group w-full h-12 shrink-0 bg-blue-500 dark:bg-[#3B82F6] hover:bg-blue-600 dark:hover:bg-[#2563EB] text-white rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <span className="font-sans font-medium text-base">
              {!razorpayLoaded ? 'Loading...' : 'Collect fractal'}
            </span>
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <p className={cn('text-center font-sans text-xs', summaryHintCls)}>
            {ENABLE_RAZORPAY ? 'Secure payment via Razorpay' : 'Payment processing (Demo mode)'}
          </p>
        </div>
      </motion.aside>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={cn(
            'sm:max-w-md gap-0 overflow-hidden border-border bg-card p-0 text-card-foreground shadow-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            '[&>button]:text-muted-foreground [&>button]:hover:text-foreground',
          )}
        >
          <div className="max-h-[90vh] overflow-y-auto p-6 pb-8">
            <DialogHeader className="space-y-3 pr-8 text-left">
              <DialogTitle className="font-serif text-2xl font-normal tracking-tight text-foreground">
                Collect from {collectContextLabel}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Acquire fractals at the best available price. All amounts are in Indian Rupees (INR), including taxes as shown.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quantity</span>
                <div className="flex items-stretch gap-2 rounded-xl border border-border bg-muted p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground"
                    onClick={() => bumpQuantity(-1)}
                    disabled={effectiveQty <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="Number of fractals to buy"
                    value={quantity === '' ? '' : String(quantity)}
                    onChange={handleQuantityInputChange}
                    onBlur={handleQuantityBlur}
                    className="h-11 min-w-0 flex-1 border-0 bg-transparent px-2 text-center font-mono text-lg text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground"
                    onClick={() => bumpQuantity(1)}
                    disabled={effectiveQty >= maxQty}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {maxQty.toLocaleString()} available
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Order breakdown</span>
                {showDialogQuoteSkeleton ? (
                  <Skeleton className="h-24 w-full rounded-xl bg-muted" />
                ) : quote?.fill_breakdown?.length ? (
                  <div className="space-y-2 rounded-xl bg-muted px-4 py-3 border border-border">
                    {quote.fill_breakdown.map((line, idx) => (
                      <div
                        key={`${line.source}-${idx}-${line.quantity}-${line.price_per_share}`}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <span className="text-foreground/80">
                          <span className="font-mono tabular-nums text-foreground">{line.quantity}</span>
                          <span className="text-muted-foreground"> × </span>
                          @ {'\u20B9'}
                          {parseFloat(line.price_per_share).toFixed(2)}
                        </span>
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          {fillSourceLabel(line.source)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3 border border-border">
                    <span className="text-sm text-zinc-300">
                      {effectiveQty} × @ {'\u20B9'}
                      {currentPrice.toFixed(2)}
                      <span className="ml-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        ±{bufferPercent.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-zinc-400">—</span>
                  </div>
                )}
              </div>

              {inventoryShort ? (
                <p className="text-xs text-amber-400/90">
                  Only {quote!.total_available_shares!.toLocaleString()} fractal(s) available for this order.
                  Lower the quantity or try again later.
                </p>
              ) : null}

              <div className="space-y-3 border-t border-border pt-4 font-sans">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal (pre-tax)</span>
                  <div className="flex items-center gap-2">
                    {showDialogQuoteSkeleton ? <Skeleton className="h-5 w-20 bg-muted" /> : (
                      <span className="text-foreground inline-flex items-baseline gap-px">
                        <span>{'\u20B9'}</span>
                        {formatCurrencyWithSmallDecimals(subTotalPreTax)}
                      </span>
                    )}
                    {!showDialogQuoteSkeleton && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        ±{bufferPercent.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{hasFillPreview ? 'Taxes & fees' : 'G.S.T. (18%)'}</span>
                  {showDialogQuoteSkeleton ? <Skeleton className="h-5 w-16 bg-muted" /> : (
                    <span className="text-foreground inline-flex items-baseline gap-px">
                      <span>{'\u20B9'}</span>
                      {formatCurrencyWithSmallDecimals(taxesAndFeesAmount)}
                    </span>
                  )}
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-primary">Total payable</span>
                  <div className="flex items-center gap-2">
                    {showDialogQuoteSkeleton ? <Skeleton className="h-6 w-24 bg-muted" /> : (
                      <span className="text-primary inline-flex items-baseline gap-px">
                        <span>{'\u20B9'}</span>
                        {formatCurrencyWithSmallDecimals(totalPayableInr)}
                      </span>
                    )}
                    {!showDialogQuoteSkeleton && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        ±{bufferPercent.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 flex flex-row justify-end gap-2 sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-lg border border-border bg-accent text-accent-foreground hover:bg-accent/80"
                onClick={() => setDialogOpen(false)}
                disabled={collecting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-11 rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                disabled={
                  collecting ||
                  !razorpayLoaded ||
                  showDialogQuoteSkeleton ||
                  effectiveQty < 1 ||
                  quote?.sufficient_for_quantity === false
                }
                onClick={handleCollectConfirm}
              >
                {collecting ? 'Collecting…' : !razorpayLoaded ? 'Loading…' : 'Confirm collection'}
              </Button>
            </DialogFooter>

            <p className="mt-4 text-center text-[10px] text-muted-foreground">
              {ENABLE_RAZORPAY ? 'Secure payment via Razorpay' : 'Payment processing (Demo mode)'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CollectModule;

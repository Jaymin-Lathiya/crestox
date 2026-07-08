import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';
import { getAvailableWithdrawalAmount } from '@/apis/withdrawal/withdrawalActions';

interface PortfolioMetric {
  label: string;
  value: number;
  delta: number;
  isCurrency?: boolean;
}

interface PortfolioHUDProps {
  metrics: {
    totalValue: number;
    invested: number;
    gainLoss: number;
    gainLossPercent: number;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  onWithdrawClick?: () => void;
}

const Counter = ({ value, isCurrency = false }: { value: number; isCurrency?: boolean }) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: isCurrency ? 'currency' : 'decimal',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="inline-block"
    >
      {formatter.format(value)}
    </motion.span>
  );
};

const MetricCard = ({ label, value, delta, isCurrency = true }: PortfolioMetric) => {
  const isPositive = delta >= 0;

  return (
    <div className="group/card relative flex flex-col justify-center p-4 transition-all duration-500 ease-out hover:!opacity-100 group-hover/grid:opacity-30 cursor-crosshair">
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-sans font-medium mb-1">
        {label}
      </span>
      <div className="text-3xl font-mono font-medium text-foreground tracking-tight flex items-baseline gap-3">
        <Counter value={value} isCurrency={isCurrency} />
        {delta !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold tracking-normal ${isPositive ? 'text-verdigris' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{isPositive ? '+' : ''}{delta.toFixed(1)}%</span>
            {isPositive && (
              <span className="absolute w-2 h-2 rounded-full bg-verdigris/20 blur-md animate-pulse ml-8" />
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover/card:w-full opacity-50" />
    </div>
  );
};

const PortfolioHUD: React.FC<PortfolioHUDProps> = ({ metrics, activeTab, onTabChange, onWithdrawClick }) => {
  const tabs = ['My Holdings', 'Listed for Sale', 'Watchlist'];
  const [availableWithdrawal, setAvailableWithdrawal] = useState<string | null>(null);
  const [loadingWithdrawal, setLoadingWithdrawal] = useState(true);

  const fetchWithdrawalAmount = useCallback(async () => {
    try {
      const data = await getAvailableWithdrawalAmount('collector');
      setAvailableWithdrawal(data.available_to_withdraw);
    } catch {
      setAvailableWithdrawal('0.00');
    } finally {
      setLoadingWithdrawal(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawalAmount();
  }, [fetchWithdrawalAmount]);

  const withdrawalValue = parseFloat(availableWithdrawal ?? '0');

  return (
    <>
     <div className=" inset-0 bg-background/80 -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 mt-[80px]">
        <div className="group/grid grid grid-cols-1 md:grid-cols-4 gap-4 md:divide-x md:divide-border/50 pt-10">
          <MetricCard label="Total Portfolio Value" value={metrics.totalValue} delta={metrics.gainLossPercent} />
          <MetricCard label="Invested Amount" value={metrics.invested} delta={0} />
          <MetricCard label="Total Gain/Loss" value={metrics.gainLoss} delta={metrics.gainLossPercent} />
          <div className="hidden md:flex flex-col justify-center pl-6 transition-opacity duration-500 group-hover/grid:opacity-30 hover:!opacity-100">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-sans font-medium mb-1">
              Available to Withdraw
            </span>
            {loadingWithdrawal ? (
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                <Loader2 size={14} className="animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-2xl font-mono font-medium text-foreground tracking-tight">
                  <Counter value={withdrawalValue} isCurrency />
                </div>
                {onWithdrawClick && (
                  <button
                    onClick={onWithdrawClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-verdigris/40 bg-verdigris/10 text-verdigris hover:bg-verdigris/20 transition-colors"
                  >
                    <Wallet size={12} />
                    Withdraw
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative flex items-center p-1 bg-background/90 border border-border rounded-full shadow-2xl shadow-background/50 mb-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`relative px-6 py-2 text-sm font-medium transition-colors duration-200 z-10 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIsland"
                      className="absolute inset-0 bg-secondary rounded-full border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20 font-sans tracking-wide">{tab}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </>
  );
};

export default PortfolioHUD;

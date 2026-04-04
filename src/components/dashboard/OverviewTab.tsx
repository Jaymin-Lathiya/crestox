"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MetricCard } from "./MetricCard";
import {
  getPortfolioDashboard,
  type PortfolioDashboard,
} from "@/apis/my-portfolio/myPortfolioActions";
import { useUserStore } from "@/store/useUserStore";

function formatTxDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export const OverviewTab = () => {
  const { user } = useUserStore();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["portfolio-dashboard"],
    queryFn: async () => {
      const res = await getPortfolioDashboard()();
      const payload = res?.data as { data?: PortfolioDashboard };
      return payload?.data as PortfolioDashboard;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!isError || !error) return;
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return;
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Failed to load portfolio dashboard";
    toast.error(msg, { id: "portfolio-dashboard-error" });
  }, [isError, error]);

  const notFound =
    isError &&
    (error as { response?: { status?: number } })?.response?.status === 404;

  const showLoading = (!!user && isLoading) || (!!user && isFetching && !data);

  if (!user) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to see your portfolio analytics.
          </p>
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            No artist profile is linked to this account yet. Complete artist onboarding to
            unlock your dashboard.
          </p>
        </motion.div>
      </div>
    );
  }

  if (showLoading && !data) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm">Loading dashboard…</p>
        </motion.div>
      </div>
    );
  }

  if (isError && !notFound && !data) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            Something went wrong loading your dashboard. Please try again.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const d = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
          Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          Real-time portfolio analytics and market performance
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Portfolio Valuation"
          value={d.portfolio_valuation}
          prefix="$"
          delay={0}
        />
        <MetricCard
          label="Total Earnings"
          value={d.total_earnings}
          prefix="$"
          delay={0.1}
        />
        <MetricCard
          label="Fractal Price"
          value={d.fractal_price}
          prefix="$"
          decimals={2}
          delay={0.2}
        />
        <MetricCard
          label="Fractals Sold"
          value={d.fractals_sold}
          delay={0.3}
        />
      </div>

      {/* Secondary Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="glass-capsule p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-label mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {d.recent_transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed sales yet.</p>
            ) : (
              d.recent_transactions.map((tx, i) => (
                <motion.div
                  key={tx.transaction_id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div>
                    <p className="text-sm text-foreground">
                      {tx.artwork?.name ?? "Artwork"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTxDate(tx.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-accent">
                      {`+$${tx.artist_net_after_platform_fee.toFixed(2)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.share_quantity} fractals
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="glass-capsule p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-label mb-4">Portfolio Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Live Artworks</span>
              <span className="text-sm font-mono text-foreground">
                {d.live_artwork_count}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <span className="text-sm font-mono text-primary">
                {d.pending_approval_artwork_count}
              </span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Collectors</span>
              <span className="text-sm font-mono text-foreground">
                {d.total_collectors}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Hold Time</span>
              <span className="text-sm font-mono text-foreground">Left to implement</span>
            </div>
            <div className="h-px bg-border my-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

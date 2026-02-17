import { motion } from "framer-motion";
import { MetricCard } from "./MetricCard";

// Mock data for the overview
const mockMetrics = {
  valuation: 2847500,
  earnings: 156420,
  fractalPrice: 42.50,
  totalSold: 3847,
  chartData: [10, 15, 12, 25, 22, 30, 28, 35, 32, 42, 38, 45],
};

export const OverviewTab = () => {
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
          value={mockMetrics.valuation}
          prefix="$"
          change={12.5}
          chartData={mockMetrics.chartData}
          delay={0}
        />
        <MetricCard
          label="Total Earnings"
          value={mockMetrics.earnings}
          prefix="$"
          change={8.3}
          delay={0.1}
        />
        <MetricCard
          label="Fractal Price (Avg)"
          value={mockMetrics.fractalPrice}
          prefix="$"
          decimals={2}
          change={-2.1}
          delay={0.2}
        />
        <MetricCard
          label="Fractals Sold"
          value={mockMetrics.totalSold}
          change={15.7}
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
            {[
              { buyer: "Collector #4891", artwork: "Ethereal Dawn", fractals: 12, price: 510 },
              { buyer: "Collector #2234", artwork: "Midnight Bloom", fractals: 5, price: 212.50 },
              { buyer: "Collector #7721", artwork: "Urban Decay III", fractals: 25, price: 1062.50 },
            ].map((tx, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div>
                  <p className="text-sm text-foreground">{tx.artwork}</p>
                  <p className="text-xs text-muted-foreground">{tx.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-accent">+${tx.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{tx.fractals} fractals</p>
                </div>
              </motion.div>
            ))}
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
              <span className="text-sm font-mono text-foreground">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <span className="text-sm font-mono text-primary">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Draft</span>
              <span className="text-sm font-mono text-foreground">5</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Collectors</span>
              <span className="text-sm font-mono text-foreground">847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Hold Time</span>
              <span className="text-sm font-mono text-foreground">47 days</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

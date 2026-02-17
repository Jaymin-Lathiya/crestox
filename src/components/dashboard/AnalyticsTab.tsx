import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, Wallet } from "lucide-react";
import { MiniChart } from "./MiniChart";

const mockAnalyticsData = {
  viewsData: [120, 145, 132, 178, 195, 210, 198, 225, 240, 258, 270, 295],
  salesData: [5, 8, 6, 12, 15, 11, 18, 22, 19, 25, 28, 32],
  collectorsData: [45, 52, 58, 67, 72, 89, 95, 110, 125, 142, 158, 175],
};

export const AnalyticsTab = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm">
          Deep insights into your portfolio performance
        </p>
      </motion.div>

      {/* Main Chart */}
      <motion.div
        className="glass-capsule p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-label mb-1">Portfolio Performance</h3>
            <p className="text-2xl font-light text-foreground">
              $2,847,500 <span className="text-sm text-accent">+12.5%</span>
            </p>
          </div>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((period, i) => (
              <button
                key={period}
                className={`px-3 py-1 text-xs uppercase tracking-wider ${
                  i === 2 
                    ? "bg-zinc-800 text-foreground border border-zinc-700" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 flex items-end">
          <MiniChart 
            data={mockAnalyticsData.viewsData} 
            width={800} 
            height={200}
          />
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: "Avg. Daily Views", value: "1,247", change: "+18%" },
          { icon: Wallet, label: "Revenue (30d)", value: "$42,580", change: "+12%" },
          { icon: Users, label: "New Collectors", value: "156", change: "+24%" },
          { icon: Clock, label: "Avg. Time to Sale", value: "4.2 days", change: "-15%" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            className="glass-capsule p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <metric.icon className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-label mb-2">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-foreground">{metric.value}</span>
              <span className={`text-xs font-mono ${metric.change.startsWith('+') ? 'text-accent' : 'text-primary'}`}>
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Performing Artworks */}
      <motion.div
        className="glass-capsule p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-label mb-4">Top Performing Artworks</h3>
        <div className="space-y-4">
          {[
            { title: "Ethereal Dawn", views: 4521, sales: 67, revenue: 2847.50 },
            { title: "The Observer", views: 3892, sales: 100, revenue: 8500 },
            { title: "Solitude", views: 2847, sales: 89, revenue: 4628 },
          ].map((artwork, i) => (
            <div 
              key={artwork.title}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground w-6">
                  #{i + 1}
                </span>
                <span className="text-sm text-foreground">{artwork.title}</span>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-sm font-mono text-foreground">{artwork.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sales</p>
                  <p className="text-sm font-mono text-foreground">{artwork.sales}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-mono text-accent">${artwork.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { MiniChart } from "./MiniChart";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  chartData?: number[];
  decimals?: number;
  delay?: number;
}

export const MetricCard = ({
  label,
  value,
  prefix = "",
  suffix = "",
  change,
  changeLabel = "vs last month",
  chartData,
  decimals = 0,
  delay = 0,
}: MetricCardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      className="glass-capsule p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Label */}
      <span className="text-label block mb-3">{label}</span>

      {/* Main Value */}
      <div className="text-metric mb-2">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-mono",
              isPositive ? "text-accent" : "text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      )}

      {/* Mini Chart */}
      {chartData && chartData.length > 0 && (
        <div className="absolute bottom-0 right-0 opacity-80">
          <MiniChart data={chartData} width={120} height={50} />
        </div>
      )}
    </motion.div>
  );
};

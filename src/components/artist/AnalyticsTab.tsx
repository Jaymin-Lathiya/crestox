import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArtworkAnalyticsPayload } from "@/apis/artwork/artworkActions";
import type { ArtistAnalyticsPayload } from "@/apis/artists/artistActions";

const GRADE_STYLES: Record<string, string> = {
  AAA: "hsl(44, 100%, 50%)",
  AA: "hsl(44, 70%, 45%)",
  "A+": "hsl(44, 45%, 55%)",
  A: "hsl(0, 0%, 70%)",
  B: "hsl(0, 0%, 50%)",
  "B-": "hsl(0, 0%, 38%)",
};

const GRADE_ORDER = ["AAA", "AA", "A+", "A", "B", "B-"] as const;

const DEMO_PRICE_DATA = [
  { month: "Jan", price: 180 },
  { month: "Feb", price: 195 },
  { month: "Mar", price: 210 },
  { month: "Apr", price: 198 },
  { month: "May", price: 225 },
  { month: "Jun", price: 240 },
  { month: "Jul", price: 235 },
  { month: "Aug", price: 258 },
  { month: "Sep", price: 275 },
  { month: "Oct", price: 290 },
  { month: "Nov", price: 310 },
  { month: "Dec", price: 340 },
];

const DEMO_GRADES_UI = (
  [
    ["AAA", 12],
    ["AA", 28],
    ["A+", 0],
    ["A", 45],
    ["B", 15],
    ["B-", 0],
  ] as const
).map(([grade, count]) => ({
  grade,
  count,
  color: GRADE_STYLES[grade] ?? "hsl(240, 5%, 46%)",
}));

const DEMO_METRICS = {
  hold: "8.2 mo",
  collectors: "342",
  fractal: "\u20B9180",
  portfolio: "\u20B912.5Cr",
};

function formatInr(n: number, compact?: boolean): string {
  if (!Number.isFinite(n)) return "—";
  if (compact && (n >= 100000 || n <= -100000)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

function formatHoldMonths(days: number | null): string {
  if (days == null || !Number.isFinite(days)) return "—";
  const mo = days / 30.44;
  if (mo < 0.05) return "<0.1 mo";
  return `${mo.toFixed(1)} mo`;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-3 py-2 rounded text-xs font-mono">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground">{formatInr(Number(payload[0].value))}</p>
      </div>
    );
  }
  return null;
};

export interface AnalyticsTabProps {
  loading?: boolean;
  error?: string | null;
  /** Artwork detail: GET /artwork/:id/analytics (chart = valuation) */
  analytics?: ArtworkAnalyticsPayload | null;
  /** Artist detail: GET /artists/:id/analytics (chart = fractal price) */
  artistAnalytics?: ArtistAnalyticsPayload | null;
  /** Demos / legacy: chart points only when no API payload */
  priceData?: { month: string; price: number }[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  loading = false,
  error = null,
  analytics = null,
  artistAnalytics = null,
  priceData: legacyPriceData,
}) => {
  const gradientId = useId().replace(/:/g, "");

  const useArtworkLive = analytics != null;
  const useArtistLive = artistAnalytics != null;
  const useLiveApi = useArtworkLive || useArtistLive;

  const chartRows = useMemo(() => {
    if (analytics != null) {
      if (!analytics.valuation_history?.length) return [];
      return analytics.valuation_history.map(({ label, price }) => ({
        month: label,
        price,
      }));
    }
    if (artistAnalytics != null) {
      if (!artistAnalytics.fractal_price_history?.length) return [];
      return artistAnalytics.fractal_price_history.map(({ label, price }) => ({
        month: label,
        price,
      }));
    }
    if (legacyPriceData && legacyPriceData.length > 0) {
      return legacyPriceData;
    }
    return DEMO_PRICE_DATA;
  }, [analytics, artistAnalytics, legacyPriceData]);

  const gradesForUi = useMemo(() => {
    if (useLiveApi) {
      const fromApi =
        analytics != null
          ? analytics.grade_distribution ?? []
          : artistAnalytics != null
            ? artistAnalytics.grade_distribution ?? []
            : [];
      const map = new Map(fromApi.map((g) => [g.grade, g.count]));
      return GRADE_ORDER.map((grade) => ({
        grade,
        count: map.get(grade) ?? 0,
        color: GRADE_STYLES[grade] ?? "hsl(240, 5%, 46%)",
      }));
    }
    return DEMO_GRADES_UI;
  }, [analytics, artistAnalytics, useLiveApi]);

  const maxCount = Math.max(1, ...gradesForUi.map((g) => g.count));

  const metrics = useMemo(() => {
    if (analytics != null) {
      return {
        hold: formatHoldMonths(analytics.avg_hold_days),
        collectors: analytics.unique_collectors.toLocaleString("en-IN"),
        fractal: formatInr(analytics.fractal_price),
        portfolio: formatInr(analytics.total_portfolio_value, true),
      };
    }
    if (artistAnalytics != null) {
      return {
        hold: formatHoldMonths(artistAnalytics.avg_hold_days),
        collectors: artistAnalytics.unique_collectors.toLocaleString("en-IN"),
        fractal: formatInr(artistAnalytics.fractal_price),
        portfolio: formatInr(artistAnalytics.total_portfolio_value, true),
      };
    }
    return DEMO_METRICS;
  }, [analytics, artistAnalytics]);

  const chartTitle = useArtworkLive
    ? "Valuation history"
    : useArtistLive
      ? "Fractal price history"
      : "Price history";

  const emptyChartCopy = useArtworkLive
    ? "No valuation data for this artwork yet."
    : useArtistLive
      ? "No fractal price history yet."
      : "No chart data.";

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-lg bg-white/5" />
        <Skeleton className="h-80 rounded-lg bg-white/5" />
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground font-mono" role="alert">
        {error}
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="glass p-6 rounded-lg">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          {chartTitle}
        </h3>
        <div className="h-64">
          {chartRows.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartRows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                  tick={{ fill: "hsl(240, 5%, 46%)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  angle={chartRows.length > 14 ? -40 : -35}
                  textAnchor="end"
                  height={chartRows.length > 14 ? 56 : 52}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(240, 5%, 46%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickFormatter={(v) => `\u20B9${v}`}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  isAnimationActive={chartRows.length < 50}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs font-mono text-muted-foreground h-full flex items-center justify-center">
              {useLiveApi ? emptyChartCopy : "No chart data."}
            </p>
          )}
        </div>
      </div>

      <div className="glass p-6 rounded-lg">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Grade Distribution
        </h3>
        <div className="space-y-5">
          {gradesForUi.map((grade) => (
            <div key={grade.grade} className="space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className="font-mono text-sm text-foreground">{grade.grade}</span>
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {grade.count} works
                </span>
              </div>
              <div className="h-0.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(grade.count / maxCount) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: grade.color,
                    boxShadow: grade.count > 0 ? `0 0 10px ${grade.color}` : undefined,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Portfolio value" value={metrics.portfolio} />
        <MetricCard label="Avg. hold time" value={metrics.hold} />
        <MetricCard label="Unique collectors" value={metrics.collectors} />
        <MetricCard label="Floor price" value={metrics.fractal} />
      </div>
    </motion.div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, className }) => (
  <div className={`glass p-5 rounded-lg ${className ?? ""}`}>
    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
      {label}
    </span>
    <div className="flex items-baseline space-x-2 mt-2 min-w-0">
      <span className="font-mono text-xl sm:text-2xl text-foreground font-medium truncate" title={value}>
        {value}
      </span>
      {change ? <span className="font-mono text-xs text-primary shrink-0">{change}</span> : null}
    </div>
  </div>
);

export default AnalyticsTab;

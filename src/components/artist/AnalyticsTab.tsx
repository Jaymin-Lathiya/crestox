import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const priceData = [
  { month: 'Jan', price: 180 },
  { month: 'Feb', price: 195 },
  { month: 'Mar', price: 210 },
  { month: 'Apr', price: 198 },
  { month: 'May', price: 225 },
  { month: 'Jun', price: 240 },
  { month: 'Jul', price: 235 },
  { month: 'Aug', price: 258 },
  { month: 'Sep', price: 275 },
  { month: 'Oct', price: 290 },
  { month: 'Nov', price: 310 },
  { month: 'Dec', price: 340 },
];

const gradeDistribution = [
  { grade: 'AAA', count: 12, color: 'hsl(44, 100%, 50%)' },
  { grade: 'AA', count: 28, color: 'hsl(44, 70%, 45%)' },
  { grade: 'A', count: 45, color: 'hsl(0, 0%, 70%)' },
  { grade: 'B', count: 15, color: 'hsl(0, 0%, 50%)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-3 py-2 rounded text-xs font-mono">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsTab: React.FC = () => {
  const maxCount = Math.max(...gradeDistribution.map(g => g.count));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Price History Chart */}
      <div className="glass p-6 rounded-lg">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Price History (12M)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(240, 5%, 46%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(240, 5%, 46%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="glass p-6 rounded-lg">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Grade Distribution
        </h3>
        <div className="space-y-5">
          {gradeDistribution.map((grade) => (
            <div key={grade.grade} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-foreground">{grade.grade}</span>
                <span className="font-mono text-xs text-muted-foreground">{grade.count} works</span>
              </div>
              <div className="h-0.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(grade.count / maxCount) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: grade.color,
                    boxShadow: `0 0 10px ${grade.color}`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Volume" value="$2.4M" change="+24%" />
        <MetricCard label="Avg. Hold Time" value="8.2M" />
        <MetricCard label="Unique Collectors" value="342" change="+12%" />
        <MetricCard label="Floor Price" value="$180" change="+8%" />
      </div>
    </motion.div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change }) => (
  <div className="glass p-5 rounded-lg">
    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
    <div className="flex items-baseline space-x-2 mt-2">
      <span className="font-mono text-2xl text-foreground font-medium">{value}</span>
      {change && (
        <span className="font-mono text-xs text-primary">{change}</span>
      )}
    </div>
  </div>
);

export default AnalyticsTab;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface DataPoint {
  timestamp: string;
  price: number;
}

interface AssetPerformanceChartProps {
  historyData: DataPoint[];
  className?: string;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-3 border border-border">
        <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-1">{label}</p>
        <p className="font-mono text-lg text-acid">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const AssetPerformanceChart: React.FC<AssetPerformanceChartProps> = ({
  historyData,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      onViewportEnter={() => setIsVisible(true)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="data-label">Price History</span>
        <motion.div 
          className="h-px bg-acid flex-1"
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : {}}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>

      {/* Chart Container */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="acidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(72, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(72, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="timestamp" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#444', fontSize: 10, fontFamily: 'Space Mono' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#444', fontSize: 10, fontFamily: 'Space Mono' }}
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CCFF00', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <ReferenceLine y={historyData[0]?.price} stroke="#333" strokeDasharray="4 4" />
            
            <Line
              type="stepAfter"
              dataKey="price"
              stroke="hsl(72, 100%, 50%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#CCFF00', stroke: '#030304', strokeWidth: 2 }}
              fill="url(#acidGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AssetPerformanceChart;

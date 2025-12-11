import React from 'react';
import { DashboardMetrics } from '../types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricsPanelProps {
  metrics: DashboardMetrics;
}

// Mock data for sparklines
const data = [
  { v: 10 }, { v: 12 }, { v: 8 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }
];

const MetricCard: React.FC<{
  title: string;
  value: string;
  subValue: string;
  trend?: string;
  trendUp?: boolean;
}> = ({ title, value, subValue, trend, trendUp }) => (
  <div className="bg-surface border border-border px-3 py-2.5 shadow-card flex flex-col justify-between h-20 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-[10px] uppercase tracking-wider font-semibold text-secondary mb-0.5">{title}</h3>
        <div className="text-xl font-bold text-charcoal tracking-tight leading-none">{value}</div>
      </div>
      <div className="w-12 h-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="v" 
              stroke={trendUp ? '#22C55E' : '#EF4444'} 
              strokeWidth={1.5} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="flex items-center gap-2 mt-1">
        <div className={`text-[10px] font-bold ${trendUp ? 'text-success' : 'text-danger'} flex items-center`}>
          {trendUp ? '▲' : '▼'} {trend}
        </div>
        <div className="text-[10px] text-secondary border-l border-gray-200 pl-2">{subValue}</div>
    </div>
  </div>
);

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
      <MetricCard
        title="Active Jobs"
        value={metrics.activeJobs.toString()}
        subValue="+2 today"
        trend="12.5%"
        trendUp={true}
      />
      <MetricCard
        title="Revenue YTD"
        value={`€${(metrics.revenueToDate / 1000).toFixed(1)}k`}
        subValue="Vs €12k"
        trend="8.2%"
        trendUp={true}
      />
      <MetricCard
        title="Avg Response"
        value={`${metrics.avgResponseTime}m`}
        subValue="Target 40m"
        trend="2.4%"
        trendUp={false} 
      />
      <MetricCard
        title="Efficiency"
        value={`${metrics.fleetEfficiency}%`}
        subValue="Utilization"
        trend="1.8%"
        trendUp={true}
      />
      <MetricCard
        title="Billable Hrs"
        value={`${metrics.billableHours}`}
        subValue="MTD Total"
        trend="4.1%"
        trendUp={true}
      />
    </div>
  );
};
import React from 'react';
import { Technician } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface PerformancePanelProps {
  technicians: Technician[];
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({ technicians }) => {
  const topTechs = [...technicians].sort((a, b) => b.efficiencyScore - a.efficiencyScore).slice(0, 3);
  
  const chartData = technicians.map(t => ({
      name: t.id.split('-')[1],
      efficiency: t.efficiencyScore,
      completed: t.jobsCompletedToday
  }));

  return (
    <div className="bg-surface border border-border shadow-card flex flex-col h-1/2 min-h-[150px]">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50">
        <h2 className="text-sm font-bold text-charcoal">Daily Efficiency</h2>
      </div>
      
      <div className="flex-1 p-3 flex flex-col gap-2">
        {/* Chart */}
        <div className="h-20 w-full shrink-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      tick={{fill: '#6B7280', fontSize: 9}} 
                      axisLine={false} 
                      tickLine={false}
                      dy={5}
                      interval={0}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '10px', padding: '4px' }}
                        itemStyle={{ color: '#111827' }}
                        cursor={{fill: '#F3F4F6'}}
                    />
                    <Bar dataKey="efficiency" radius={[2, 2, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.efficiency > 90 ? '#111827' : '#D1D5DB'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Top Techs */}
        <div className="flex-1 overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase text-secondary tracking-wider mb-2">
                Top 3 Techs
            </h3>
            <div className="space-y-1.5">
                {topTechs.map((tech, i) => (
                    <div key={tech.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {i + 1}
                            </div>
                            <span className="text-xs text-charcoal font-medium truncate max-w-[80px]">{tech.name}</span>
                        </div>
                        <div className="text-xs font-bold text-charcoal">{tech.efficiencyScore}%</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
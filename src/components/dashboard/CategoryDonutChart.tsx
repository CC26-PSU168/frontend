'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatIDR } from '@/lib/formatters';
import type { CategoryBreakdown } from '@/types/transaction';

interface CategoryDonutChartProps {
  data: CategoryBreakdown[];
  isLoading: boolean;
}

const COLORS = ['#BCFF4F', '#FF4F4F', '#4F9EFF', '#FFD700', '#FF6B9D', '#50E3C2', '#B06AFF', '#FF8C42', '#888888', '#FF5252'];

export default function CategoryDonutChart({ data, isLoading }: CategoryDonutChartProps) {
  if (isLoading) {
    return (
      <Card className="bg-[#141414] border border-[#BCFF4F]/10 p-8 rounded-2xl">
        <Skeleton className="h-5 w-[200px] bg-[#2A2A2A] mb-6" />
        <Skeleton className="h-[280px] w-full bg-[#1C1C1C] rounded-xl" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-[#141414] border border-[#BCFF4F]/10 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[380px]">
        <span className="material-symbols-outlined text-4xl text-[#333] mb-3">donut_small</span>
        <p className="text-[#888888] font-bold text-sm">Belum ada data kategori</p>
      </Card>
    );
  }

  const chartData = data.map((d, i) => ({
    name: d.category,
    value: d.amount,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <Card className="bg-[#141414] border border-[#BCFF4F]/10 p-8 rounded-2xl">
      <h4 className="text-lg font-[900] text-white mb-6">Pengeluaran per Kategori</h4>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(188,255,79,0.15)', borderRadius: 12, color: '#F4F4F0', fontSize: 13 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => formatIDR(value as number)}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex-1 space-y-3 max-h-[200px] overflow-y-auto">
          {data.map((cat, i) => (
            <div key={cat.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[#F4F4F0] font-medium truncate max-w-[120px]">{cat.category}</span>
              </div>
              <span className="text-[#888888] font-bold shrink-0">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

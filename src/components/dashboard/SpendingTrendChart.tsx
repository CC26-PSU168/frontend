'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { MonthlyTrend } from '@/types/transaction';

interface SpendingTrendChartProps {
  data: MonthlyTrend[];
  isLoading: boolean;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function SpendingTrendChart({ data, isLoading }: SpendingTrendChartProps) {
  if (isLoading) {
    return (
      <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15 flex flex-col justify-between min-h-[320px]">
        <Skeleton className="h-4 w-[160px] bg-[#2A2A2A] mb-6" />
        <div className="flex-1 flex items-end gap-2 px-2">
          {Array.from({ length: 6 }).map((_, _i) => (
            <Skeleton key={_i} className="flex-1 bg-[#1C1B1B] rounded-t-sm" style={{ height: `${30 + ((_i * 17) % 50)}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const maxExpense = Math.max(...data.map((d) => d.expense), 1);

  return (
    <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15 flex flex-col justify-between min-h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <span className="font-black tracking-widest uppercase text-xs text-[#888888]">Spending Trend</span>
        <span className="material-symbols-outlined text-[#BCFF4F]">insights</span>
      </div>
      <div className="flex-1 flex items-end gap-2 px-2">
        {data.map((d) => {
          const pct = Math.max((d.expense / maxExpense) * 100, 5);
          const isMax = d.expense === maxExpense && d.expense > 0;
          return (
            <div
              key={d.month}
              className={`flex-1 rounded-t-sm transition-all duration-500 relative group cursor-pointer ${
                isMax ? 'bg-[#BCFF4F]' : 'bg-[#1C1B1B]'
              }`}
              style={{ height: `${pct}%` }}
            >
              {!isMax && (
                <div className="absolute inset-0 bg-[#BCFF4F] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
              )}
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0A0A0A] text-[#BCFF4F] text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Rp {(d.expense / 1000).toFixed(0)}K
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-black text-[#888888]">
        {data.map((d) => {
          const [, m] = d.month.split('-');
          return <span key={d.month}>{MONTH_NAMES[parseInt(m, 10) - 1]}</span>;
        })}
      </div>
    </div>
  );
}

'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { MonthlyTrend } from '@/types/transaction';

interface SpendingTrendChartProps {
  data: MonthlyTrend[];
  isLoading: boolean;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatK(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return `${value}`;
}

export default function SpendingTrendChart({ data, isLoading }: SpendingTrendChartProps) {
  if (isLoading) {
    return (
      <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15 flex flex-col justify-between min-h-[320px]">
        <Skeleton className="h-4 w-[160px] bg-[#2A2A2A] mb-6" />
        <div className="flex-1 flex items-end gap-2 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 bg-[#1C1B1B] rounded-t-sm" style={{ height: `${30 + (i * 17) % 50}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const hasData = data.some(d => d.expense > 0);
  const maxExpense = Math.max(...data.map(d => d.expense), 1);

  return (
    <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15 flex flex-col justify-between min-h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <span className="font-black tracking-widest uppercase text-xs text-[#888888]">Spending Trend</span>
        <span className="material-symbols-outlined text-[#BCFF4F]">insights</span>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <span className="material-symbols-outlined text-[#2A2A2A] text-5xl">bar_chart</span>
          <p className="text-[#888888] text-xs font-bold">Belum ada data pengeluaran</p>
          <p className="text-[#555555] text-[10px]">Catat transaksi untuk melihat tren</p>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-end gap-2 px-2" style={{ height: '200px' }}>
            {data.map((d) => {
              const pct = d.expense > 0 ? Math.max((d.expense / maxExpense) * 100, 8) : 0;
              const isMax = d.expense === maxExpense && d.expense > 0;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-end justify-end h-full group cursor-pointer">
                  {d.expense === 0 ? (
                    <div className="w-full h-[2px] bg-white/10 rounded-full" />
                  ) : (
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 relative ${
                        isMax ? 'bg-[#BCFF4F]' : 'bg-[#2A2A2A] group-hover:bg-[#BCFF4F]/60'
                      }`}
                      style={{ height: `${pct}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0A0A0A] text-[#BCFF4F] text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#BCFF4F]/20 z-10">
                        {formatK(d.expense)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-black">
            {data.map((d) => {
              const [, m] = d.month.split('-');
              return (
                <span key={d.month} className={d.expense > 0 ? 'text-[#BCFF4F]' : 'text-[#888888]'}>
                  {MONTH_NAMES[parseInt(m, 10) - 1]}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

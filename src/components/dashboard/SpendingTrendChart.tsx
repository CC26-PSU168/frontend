'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { MonthlyTrend } from '@/types/transaction';

interface SpendingTrendChartProps {
  data: MonthlyTrend[];
  isLoading: boolean;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatK(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return `${value}`;
}

export default function SpendingTrendChart({ data, isLoading }: SpendingTrendChartProps) {
  if (isLoading) {
    return (
      <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15 min-h-[320px] flex flex-col">
        <Skeleton className="h-4 w-[160px] bg-[#2A2A2A] mb-6" />
        <div className="flex-1 flex items-end gap-2 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 bg-[#1C1B1B] rounded-t-sm"
              style={{ height: `${30 + (i * 17) % 50}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const hasData = data.some(d => Number(d.expense) > 0);
  const maxExpense = Math.max(...data.map(d => Number(d.expense)), 1);
  const CHART_HEIGHT = 180; // fixed pixel height for bars

  return (
    <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15 min-h-[320px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-black tracking-widest uppercase text-xs text-[#888888]">
          Spending Trend
        </span>
        <span className="material-symbols-outlined text-[#BCFF4F]">insights</span>
      </div>

      {!hasData ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <span className="material-symbols-outlined text-[#2A2A2A] text-5xl">bar_chart</span>
          <p className="text-[#888888] text-xs font-bold">Belum ada data pengeluaran</p>
          <p className="text-[#555555] text-[10px]">Catat transaksi untuk melihat tren</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Bars — fixed pixel height container, bars grow from bottom via absolute */}
          <div
            className="flex items-end gap-2 px-1 w-full"
            style={{ height: `${CHART_HEIGHT}px` }}
          >
            {data.map((d) => {
              const expense = Number(d.expense);
              const pct = expense > 0
                ? Math.max((expense / maxExpense) * 100, 8)
                : 0;
              const barHeight = Math.round((pct / 100) * CHART_HEIGHT);
              const isMax = expense === maxExpense && expense > 0;

              return (
                <div
                  key={d.month}
                  className="flex-1 relative group cursor-pointer"
                  style={{ height: `${CHART_HEIGHT}px` }}
                >
                  {expense === 0 ? (
                    /* Empty month — show a thin base line */
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 rounded-full"
                    />
                  ) : (
                    /* Bar grows from bottom */
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-700 ${
                        isMax
                          ? 'bg-[#BCFF4F]'
                          : 'bg-[#2A2A2A] group-hover:bg-[#BCFF4F]/60'
                      }`}
                      style={{ height: `${barHeight}px` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0A0A0A] text-[#BCFF4F] text-[9px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#BCFF4F]/20 z-10">
                        {formatK(expense)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Month labels */}
          <div className="mt-3 flex justify-between px-1 text-[10px] font-black">
            {data.map((d) => {
              const [, m] = d.month.split('-');
              const hasExpense = Number(d.expense) > 0;
              return (
                <span
                  key={d.month}
                  className={hasExpense ? 'text-[#BCFF4F]' : 'text-[#888888]'}
                >
                  {MONTH_NAMES[parseInt(m, 10) - 1]}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

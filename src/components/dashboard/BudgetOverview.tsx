'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { formatCompact } from '@/lib/formatters';
import { useBudgetOverview } from '@/hooks/useBudgets';
import Link from 'next/link';

export default function BudgetOverview() {
  const now = new Date();
  const { data: overview, isLoading } = useBudgetOverview(now.getMonth() + 1, now.getFullYear());

  if (isLoading) {
    return (
      <div className="bg-[#F4F4F0] p-8 rounded-xl min-h-[200px]">
        <Skeleton className="h-5 w-[180px] bg-[#0A0A0A]/10 mb-6" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-5">
            <Skeleton className="h-3 w-full bg-[#0A0A0A]/10 mb-2" />
            <Skeleton className="h-3 w-full bg-[#0A0A0A]/5" />
          </div>
        ))}
      </div>
    );
  }

  const budgets = overview?.categories || [];

  return (
    <div className="bg-[#F4F4F0] p-8 rounded-xl flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black tracking-widest uppercase text-sm text-[#0A0A0A]">Budget Limits</h3>
        <Link href="/budgeting">
          <button className="bg-[#0A0A0A] text-[#F4F4F0] rounded-full p-2 flex items-center justify-center hover:bg-[#1C1C1C] transition-colors">
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </Link>
      </div>
      <div className="space-y-6 flex-1">
        {budgets.length > 0 ? (
          budgets.slice(0, 4).map((budget) => {
            const spent = budget.spent;
            const pct = Math.min(budget.percentage, 100);
            const isOver = budget.percentage >= 100;

            return (
              <div key={budget.id}>
                <div className="flex justify-between text-[10px] font-black uppercase text-[#0A0A0A]/40 mb-2">
                  <span>{budget.category}</span>
                  <span className={isOver ? 'text-red-500' : 'text-[#0A0A0A]'}>
                    {formatCompact(spent)} / {formatCompact(budget.limitAmount)}
                  </span>
                </div>
                <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${isOver ? 'bg-red-500' : 'bg-[#0A0A0A]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#0A0A0A]/30">account_balance_wallet</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0A0A0A]/50">Belum ada budget</span>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { formatCompact } from '@/lib/formatters';
import { useCategoryBreakdown } from '@/hooks/useTransactions';

// Hardcoded budgets (dynamic in Phase 3)
const DEMO_BUDGETS = [
  { category: 'Makanan & Minuman', limitAmount: 1500000 },
  { category: 'Transportasi', limitAmount: 400000 },
  { category: 'Hiburan & Lifestyle', limitAmount: 400000 },
];

export default function BudgetOverview() {
  const { data: categories, isLoading } = useCategoryBreakdown();

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

  return (
    <div className="bg-[#F4F4F0] p-8 rounded-xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black tracking-widest uppercase text-sm text-[#0A0A0A]">Budget Limits</h3>
        <button className="bg-[#0A0A0A] text-[#F4F4F0] rounded-full p-2 flex items-center justify-center hover:bg-[#1C1C1C] transition-colors">
          <span className="material-symbols-outlined text-xs">add</span>
        </button>
      </div>
      <div className="space-y-6">
        {DEMO_BUDGETS.map((budget) => {
          const spent = categories?.find((c) => c.category === budget.category)?.amount || 0;
          const pct = Math.min(Math.round((spent / budget.limitAmount) * 100), 100);
          const isOver = spent > budget.limitAmount;

          return (
            <div key={budget.category}>
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
        })}
      </div>
    </div>
  );
}

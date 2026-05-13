'use client';

import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import SpendingTrendChart from '@/components/dashboard/SpendingTrendChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionSummary, useMonthlyTrend, useCategoryBreakdown } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavings';
import { useAuthStore } from '@/store/authStore';
import { formatCompact } from '@/lib/formatters';

// Color palette for donut chart categories
const DONUT_COLORS = [
  '#BCFF4F', '#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7',
  '#FF8A5C', '#A8E6CF', '#FF6F91', '#67C6E3', '#E8D5B7',
];

// Generate dynamic SVG sparkline path from trend data
function generateSparklinePath(values: number[]): string {
  if (!values.length) return 'M0 20 L100 20';
  const max = Math.max(...values, 1);
  const step = 100 / Math.max(values.length - 1, 1);
  return values.map((v, i) => {
    const x = Math.round(i * step);
    const y = Math.round(20 - (v / max) * 18); // Scale to 2..20
    return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ');
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(6);
  const { data: savingsGoals, isLoading: savingsLoading } = useSavingsGoals();
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBreakdown();

  const firstName = user?.name?.split(' ')[0] || 'Sobat Cuan';
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Dynamic sparkline paths from monthly trend data
  const incomeSparkline = trend ? generateSparklinePath(trend.map(t => t.income)) : '';
  const expenseSparkline = trend ? generateSparklinePath(trend.map(t => t.expense)) : '';

  // Dynamic AI insight text from actual data
  const topCategory = categoryData && categoryData.length > 0 ? categoryData[0] : null;
  const expenseRatio = summary && summary.income > 0
    ? Math.round((summary.expense / summary.income) * 100) : 0;

  // Donut chart calculations
  const totalCategoryAmount = categoryData?.reduce((sum, c) => sum + c.amount, 0) || 0;

  return (
    <AppLayout>
      {/* Hero Greeting */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-[-0.04em] leading-none mb-2">
            Hei, {firstName}.
          </h1>
          <p className="text-[#888888] font-bold tracking-widest uppercase text-xs md:text-sm">
            Welcome back to the terminal.
          </p>
        </div>
        <div className="bg-[#BCFF4F] text-[#0A0A0A] px-6 py-2 rounded-full font-black text-sm tracking-tighter uppercase italic hidden lg:block">
          {dateStr}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* ROW 1 */}
        {/* Large Balance Card (lime) — 5 col */}
        <div className="col-span-12 lg:col-span-5 bg-[#BCFF4F] p-8 rounded-xl flex flex-col justify-between min-h-[320px] transition-transform hover:scale-[1.01] cursor-pointer group">
          <div className="flex justify-between items-start">
            <span className="font-black tracking-widest uppercase text-xs text-[#0A0A0A]/60">Total Saldo Aktif</span>
            <span className="material-symbols-outlined text-[#0A0A0A]">account_balance_wallet</span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#0A0A0A]/40 mb-1">IDR</div>
            {summaryLoading ? (
              <Skeleton className="h-16 w-[260px] bg-[#0A0A0A]/10" />
            ) : (
              <div className="text-5xl md:text-7xl font-[900] tracking-[-0.04em] text-[#0A0A0A] truncate">
                {summary ? new Intl.NumberFormat('id-ID').format(summary.balance) : '0'}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {summary && (
              <div className="bg-[#0A0A0A] text-[#BCFF4F] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                {summary.balanceChange >= 0 ? '+' : ''}{summary.balanceChange}% MoM
              </div>
            )}
          </div>
        </div>

        {/* Spending Trend — 4 col */}
        <div className="col-span-12 lg:col-span-4">
          <SpendingTrendChart data={trend || []} isLoading={trendLoading} />
        </div>

        {/* Savings Card — 3 col */}
        <div className="col-span-12 lg:col-span-3 bg-[#1C1B1B] p-8 rounded-xl flex flex-col justify-between min-h-[320px] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#BCFF4F]/5 blur-3xl rounded-full" />
          
          <div className="z-10">
            <span className="font-black tracking-widest uppercase text-xs text-[#888888]">Target Tabungan</span>
            {savingsLoading ? (
               <Skeleton className="h-10 w-[150px] bg-[#2A2A2A] mt-4 mb-2" />
            ) : savingsGoals && savingsGoals.length > 0 ? (
              <>
                <div className="text-4xl font-[900] tracking-[-0.04em] mt-4">{formatCompact(savingsGoals[0].targetAmount)}</div>
                <div className="text-xs font-bold text-[#BCFF4F] mt-2 uppercase tracking-widest truncate">{savingsGoals[0].name}</div>
              </>
            ) : (
              <div className="text-sm font-bold text-[#888888] mt-4">Belum ada target tabungan</div>
            )}
          </div>
          
          <div className="z-10">
            {savingsGoals && savingsGoals.length > 0 ? (
              <>
                <div className="flex justify-between text-[10px] font-black mb-2 uppercase text-[#888888]">
                  <span>Progress</span>
                  <span>{savingsGoals[0].percentage}%</span>
                </div>
                <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full">
                  <div 
                    className="bg-[#BCFF4F] h-full rounded-full shadow-[0_0_15px_rgba(188,255,79,0.3)] transition-all duration-1000" 
                    style={{ width: `${Math.min(savingsGoals[0].percentage, 100)}%` }} 
                  />
                </div>
              </>
            ) : (
              <Link href="/savings">
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-full w-full transition-colors uppercase tracking-widest">
                  Buat Target
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* ROW 2 */}
        {/* Recent Transactions — 7 col */}
        <div className="col-span-12 lg:col-span-7">
          <RecentTransactions />
        </div>

        {/* AI Insight Card (lime) — 5 col — DYNAMIC */}
        <div className="col-span-12 lg:col-span-5 bg-[#BCFF4F] p-10 rounded-xl flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-6xl text-[#0A0A0A]/10" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <div className="z-10">
            <div className="bg-[#0A0A0A] text-[#BCFF4F] inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              INSIGHT
            </div>
            {summaryLoading ? (
              <Skeleton className="h-12 w-full bg-[#0A0A0A]/10" />
            ) : summary && topCategory ? (
              <h2 className="text-4xl font-[900] tracking-[-0.04em] text-[#0A0A0A] leading-[1.1]">
                {expenseRatio > 80
                  ? `Hati-hati! Kamu sudah pakai ${expenseRatio}% dari pemasukanmu.`
                  : expenseRatio > 50
                  ? `Pengeluaran terbesar: ${topCategory.category} (${topCategory.percentage}%).`
                  : summary.expense === 0
                  ? 'Belum ada pengeluaran bulan ini. Mulai catat!'
                  : `Keuangan stabil, hanya ${expenseRatio}% terpakai bulan ini.`
                }
              </h2>
            ) : (
              <h2 className="text-4xl font-[900] tracking-[-0.04em] text-[#0A0A0A] leading-[1.1]">
                Mulai catat transaksi untuk dapat insight.
              </h2>
            )}
          </div>
          <div className="z-10 mt-8">
            {topCategory && (
              <p className="text-[#0A0A0A]/70 text-sm font-bold mb-6">
                Kategori terbesar bulan ini: <strong>{topCategory.category}</strong> dengan total {formatCompact(topCategory.amount)} ({topCategory.percentage}% dari total pengeluaran).
              </p>
            )}
            <Link href="/financial-health">
              <button className="bg-[#0A0A0A] text-[#BCFF4F] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest w-full hover:bg-black transition-colors">
                Analisis Lengkap
              </button>
            </Link>
          </div>
        </div>

        {/* ROW 3 */}
        {/* Pemasukan Sparkline — 3 col — DYNAMIC */}
        <div className="col-span-12 lg:col-span-3 bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black tracking-widest uppercase text-[10px] text-[#888888]">Pemasukan</span>
            <span className={`material-symbols-outlined ${summary && summary.incomeChange >= 0 ? 'text-[#BCFF4F]' : 'text-red-400'}`}>
              {summary && summary.incomeChange >= 0 ? 'trending_up' : 'trending_down'}
            </span>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-[120px] bg-[#2A2A2A]" />
          ) : (
            <div className="text-2xl font-black tracking-[-0.04em]">
              {summary ? formatCompact(summary.income) : 'Rp 0'}
            </div>
          )}
          {summary && (
            <div className="text-xs font-bold text-[#888888] mt-1">
              {summary.incomeChange >= 0 ? '+' : ''}{summary.incomeChange}% vs bulan lalu
            </div>
          )}
          <div className="h-12 w-full mt-4 bg-gradient-to-r from-transparent via-[#BCFF4F]/10 to-transparent flex items-end">
            {trend && trend.length > 0 ? (
              <svg className="w-full h-full stroke-[#BCFF4F] fill-none stroke-2" viewBox="0 0 100 20">
                <path d={incomeSparkline} />
              </svg>
            ) : (
              <svg className="w-full h-full stroke-[#BCFF4F]/30 fill-none stroke-2" viewBox="0 0 100 20">
                <path d="M0 10 L100 10" />
              </svg>
            )}
          </div>
        </div>

        {/* Pengeluaran Sparkline — 3 col — DYNAMIC */}
        <div className="col-span-12 lg:col-span-3 bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black tracking-widest uppercase text-[10px] text-[#888888]">Pengeluaran</span>
            <span className={`material-symbols-outlined ${summary && summary.expenseChange <= 0 ? 'text-[#BCFF4F]' : 'text-red-400'}`}>
              {summary && summary.expenseChange > 0 ? 'trending_up' : 'trending_down'}
            </span>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-[120px] bg-[#2A2A2A]" />
          ) : (
            <div className="text-2xl font-black tracking-[-0.04em]">
              {summary ? formatCompact(summary.expense) : 'Rp 0'}
            </div>
          )}
          {summary && (
            <div className="text-xs font-bold text-[#888888] mt-1">
              {summary.expenseChange >= 0 ? '+' : ''}{summary.expenseChange}% vs bulan lalu
            </div>
          )}
          <div className="h-12 w-full mt-4 bg-gradient-to-r from-transparent via-red-500/10 to-transparent flex items-end">
            {trend && trend.length > 0 ? (
              <svg className="w-full h-full stroke-red-400 fill-none stroke-2" viewBox="0 0 100 20">
                <path d={expenseSparkline} />
              </svg>
            ) : (
              <svg className="w-full h-full stroke-red-400/30 fill-none stroke-2" viewBox="0 0 100 20">
                <path d="M0 10 L100 10" />
              </svg>
            )}
          </div>
        </div>

        {/* Category Donut Chart — 6 col — NEW */}
        <div className="col-span-12 lg:col-span-6 bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
          <div className="flex justify-between items-center mb-6">
            <span className="font-black tracking-widest uppercase text-xs text-[#888888]">Pengeluaran per Kategori</span>
            <span className="material-symbols-outlined text-[#BCFF4F]">donut_small</span>
          </div>
          {categoryLoading ? (
            <div className="flex items-center justify-center h-48">
              <Skeleton className="h-40 w-40 rounded-full bg-[#2A2A2A]" />
            </div>
          ) : categoryData && categoryData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* SVG Donut */}
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {(() => {
                    let cumulativePercent = 0;
                    return categoryData.slice(0, 6).map((cat, i) => {
                      const percent = totalCategoryAmount > 0 ? (cat.amount / totalCategoryAmount) * 100 : 0;
                      const dashArray = `${percent} ${100 - percent}`;
                      const offset = -cumulativePercent;
                      cumulativePercent += percent;
                      return (
                        <circle
                          key={cat.category}
                          cx="50" cy="50" r="38"
                          fill="transparent"
                          stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                          strokeWidth="12"
                          strokeDasharray={dashArray}
                          strokeDashoffset={offset}
                          pathLength="100"
                          className="transition-all duration-700"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-[900] text-white">{formatCompact(totalCategoryAmount)}</span>
                  <span className="text-[10px] text-[#888888] font-bold">TOTAL</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex-1 space-y-2 w-full">
                {categoryData.slice(0, 6).map((cat, i) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                      <span className="text-xs font-bold text-[#F4F4F0] truncate max-w-[120px]">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#888888]">{cat.percentage}%</span>
                      <span className="text-xs font-[900] text-white">{formatCompact(cat.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-[#888888] text-sm font-bold">
              Belum ada data pengeluaran bulan ini.
            </div>
          )}
        </div>

        {/* Budget Limits — 6 col */}
        <div className="col-span-12 lg:col-span-6">
          <BudgetOverview />
        </div>
      </div>
    </AppLayout>
  );
}

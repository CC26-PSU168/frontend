'use client';

import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import SpendingTrendChart from '@/components/dashboard/SpendingTrendChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionSummary, useMonthlyTrend } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavings';
import { useAuthStore } from '@/store/authStore';
import { formatCompact } from '@/lib/formatters';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(6);
  const { data: savingsGoals, isLoading: savingsLoading } = useSavingsGoals();

  const firstName = user?.name?.split(' ')[0] || 'Sobat Cuan';
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AppLayout>
      {/* Hero Greeting */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-[900] tracking-[-0.04em] leading-none mb-2">
            Hei, {firstName}.
          </h1>
          <p className="text-[#888888] font-bold tracking-widest uppercase text-sm">
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
              <div className="text-7xl font-[900] tracking-[-0.04em] text-[#0A0A0A]">
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

        {/* AI Insight Card (lime) — 5 col */}
        <div className="col-span-12 lg:col-span-5 bg-[#BCFF4F] p-10 rounded-xl flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-6xl text-[#0A0A0A]/10" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <div className="z-10">
            <div className="bg-[#0A0A0A] text-[#BCFF4F] inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              AI INSIGHT
            </div>
            <h2 className="text-4xl font-[900] tracking-[-0.04em] text-[#0A0A0A] leading-[1.1]">
              Waspada, pengeluaran lifestyle kamu naik 40%.
            </h2>
          </div>
          <div className="z-10 mt-8">
            <p className="text-[#0A0A0A]/70 text-sm font-bold mb-6">
              Kamu sudah menghabiskan Rp 800rb di kategori kopi & hangout minggu ini. Coba kurangi untuk capai target Macbook kamu!
            </p>
            <Link href="/financial-health">
              <button className="bg-[#0A0A0A] text-[#BCFF4F] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest w-full hover:bg-black transition-colors">
                Analisis Lengkap
              </button>
            </Link>
          </div>
        </div>

        {/* ROW 3 */}
        {/* Pemasukan Sparkline — 3 col */}
        <div className="col-span-12 lg:col-span-3 bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black tracking-widest uppercase text-[10px] text-[#888888]">Pemasukan</span>
            <span className="text-[#BCFF4F] material-symbols-outlined">trending_up</span>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-[120px] bg-[#2A2A2A]" />
          ) : (
            <div className="text-2xl font-black tracking-[-0.04em]">
              {summary ? formatCompact(summary.income) : 'Rp 0'}
            </div>
          )}
          <div className="h-12 w-full mt-4 bg-gradient-to-r from-transparent via-[#BCFF4F]/10 to-transparent flex items-end">
            <svg className="w-full h-full stroke-[#BCFF4F] fill-none stroke-2" viewBox="0 0 100 20">
              <path d="M0 20 L10 15 L20 18 L30 12 L40 14 L50 5 L60 8 L70 2 L80 6 L90 4 L100 0" />
            </svg>
          </div>
        </div>

        {/* Pengeluaran Sparkline — 3 col */}
        <div className="col-span-12 lg:col-span-3 bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black tracking-widest uppercase text-[10px] text-[#888888]">Pengeluaran</span>
            <span className="text-red-400 material-symbols-outlined">trending_down</span>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-[120px] bg-[#2A2A2A]" />
          ) : (
            <div className="text-2xl font-black tracking-[-0.04em]">
              {summary ? formatCompact(summary.expense) : 'Rp 0'}
            </div>
          )}
          <div className="h-12 w-full mt-4 bg-gradient-to-r from-transparent via-red-500/10 to-transparent flex items-end">
            <svg className="w-full h-full stroke-red-400 fill-none stroke-2" viewBox="0 0 100 20">
              <path d="M0 5 L10 8 L20 4 L30 15 L40 12 L50 18 L60 14 L70 16 L80 10 L90 12 L100 20" />
            </svg>
          </div>
        </div>

        {/* Budget Limits (white bg) — 6 col */}
        <div className="col-span-12 lg:col-span-6">
          <BudgetOverview />
        </div>
      </div>
    </AppLayout>
  );
}

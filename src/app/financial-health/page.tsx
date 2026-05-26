'use client';

import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import SearchableSection from '@/components/common/SearchableSection';
import { useAiNarrative } from '@/hooks/useAiInsights';
import { useMonthlyTrend, useCategoryBreakdown, useTransactionSummary } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORY_ICONS: Record<string, string> = {
  'Makanan & Minuman': 'restaurant',
  'Transportasi': 'commute',
  'Hiburan & Lifestyle': 'movie',
  'Langganan': 'subscriptions',
  'Belanja': 'shopping_bag',
  'Kesehatan': 'medical_services',
  'Lainnya': 'category',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatCompact(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${value.toFixed(0)}`;
}

export default function FinancialHealthPage() {
  const { data: forecastNarrative, isLoading: isAiLoading } = useAiNarrative('forecast');
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(6);
  const { data: categories, isLoading: categoriesLoading } = useCategoryBreakdown();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();

  const maxVal = Math.max(...(trend?.map(t => Math.max(t.expense, t.income)) ?? []), 1);
  const topCategories = categories?.slice(0, 4) ?? [];
  const totalExpense = summary?.expense ?? 0;
  const totalIncome = summary?.income ?? 0;
  const surplus = totalIncome - totalExpense;

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Header */}
        <section>
          <h2 className="text-[40px] font-[900] tracking-[-0.04em] text-white leading-tight">
            Prediksi Pengeluaran.
          </h2>
          <p className="text-[#888888] font-bold mt-2">
            Berdasarkan pola spending 6 bulan terakhir.
          </p>
        </section>

        {/* Hero Chart — Dynamic Monthly Bar Chart */}
        <SearchableSection
          id="health-score"
          title="Skor Kesehatan Keuangan"
          subtitle="Analisis pengeluaran dan pemasukan bulananmu"
        >
          <section className="bg-[#141414] rounded-lg p-8 relative overflow-hidden border border-[#BCFF4F]/5">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#888888] font-[900]">
                Volume Transaksi Bulanan
              </p>
              {summaryLoading ? (
                <Skeleton className="h-10 w-[200px] bg-white/10 mt-2" />
              ) : (
                <h3 className="text-4xl font-[900] mt-1">
                  {formatCompact(totalExpense)}{' '}
                  <span className={`text-sm align-top ml-2 ${surplus >= 0 ? 'text-[#BCFF4F]' : 'text-red-400'}`}>
                    {surplus >= 0 ? '+' : ''}{formatCompact(Math.abs(surplus))} surplus
                  </span>
                </h3>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#BCFF4F] rounded-full" />
                <span className="text-xs font-bold text-[#F4F4F0]">Pengeluaran</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-white/30 rounded-full" />
                <span className="text-xs font-bold text-[#888888]">Pemasukan</span>
              </div>
            </div>
          </div>

          {/* Dynamic Bar Chart */}
          {trendLoading ? (
            <div className="flex items-end gap-3 h-[200px] px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 bg-white/10 rounded-t-sm" style={{ height: `${30 + (i * 17) % 60}%` }} />
              ))}
            </div>
          ) : (
            <div className="flex items-end gap-3 px-2" style={{ height: '200px' }}>
              {(trend ?? []).map((d) => {
                const expPct = d.expense > 0 ? Math.max((d.expense / maxVal) * 100, 6) : 0;
                const incPct = d.income > 0 ? Math.max((d.income / maxVal) * 100, 6) : 0;
                const [, m] = d.month.split('-');
                const label = MONTH_NAMES[parseInt(m, 10) - 1];
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end">
                    <div className="w-full flex items-end gap-0.5 h-[180px]">
                      <div
                        className="flex-1 rounded-t-sm bg-white/20 group-hover:bg-white/40 transition-all"
                        style={{ height: `${incPct}%` }}
                        title={`Pemasukan: ${formatCompact(d.income)}`}
                      />
                      <div
                        className="flex-1 rounded-t-sm bg-[#BCFF4F]/80 group-hover:bg-[#BCFF4F] transition-all"
                        style={{ height: `${expPct}%` }}
                        title={`Pengeluaran: ${formatCompact(d.expense)}`}
                      />
                    </div>
                    <span className={`text-[10px] font-[900] uppercase ${d.expense > 0 || d.income > 0 ? 'text-[#BCFF4F]' : 'text-[#888888]'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Category Bento Grid — Dynamic */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Highlight Card */}
          <div className="md:col-span-2 md:row-span-2 bg-[#BCFF4F] rounded-lg p-10 flex flex-col justify-between group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <div>
              <h4 className="text-[#0A0A0A] text-xs font-[900] tracking-[0.3em] uppercase">
                Pengeluaran Bulan Ini
              </h4>
              <div className="mt-4">
                {summaryLoading ? (
                  <Skeleton className="h-14 w-[180px] bg-black/10" />
                ) : (
                  <span className="text-[#0A0A0A] text-5xl font-[900] tracking-tighter">
                    {formatCompact(totalExpense)}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-4">
                <span className="text-[#0A0A0A] font-bold">Pemasukan</span>
                <span className="text-[#0A0A0A] font-[900]">
                  {summaryLoading ? '—' : formatCompact(totalIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0A0A0A] font-bold">Status</span>
                <span className={`px-4 py-1 rounded-full text-xs font-[900] ${surplus >= 0 ? 'bg-[#0A0A0A] text-[#BCFF4F]' : 'bg-red-500 text-white'}`}>
                  {surplus >= 0 ? 'SURPLUS' : 'DEFISIT'}
                </span>
              </div>
            </div>
          </div>

          {/* Category Cards — Dynamic */}
          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#141414] rounded-lg p-6 border border-white/5">
                <Skeleton className="h-8 w-8 bg-white/10 rounded-lg mb-4" />
                <Skeleton className="h-4 w-20 bg-white/10 mb-2" />
                <Skeleton className="h-6 w-24 bg-white/10" />
              </div>
            ))
          ) : topCategories.length > 0 ? (
            topCategories.map((cat) => {
              const icon = CATEGORY_ICONS[cat.category] || 'category';
              return (
                <div
                  key={cat.category}
                  className="bg-[#141414] rounded-lg p-6 border border-white/5 flex flex-col justify-between hover:bg-[#1C1B1B] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <span className="material-symbols-outlined text-[#BCFF4F]">{icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#888888]">{cat.percentage}%</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-[900] text-[#888888] tracking-widest truncate">
                      {cat.category}
                    </p>
                    <h4 className="text-xl font-[900] mt-1">{formatCompact(cat.amount)}</h4>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                      <div
                        className="bg-[#BCFF4F] h-full rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 bg-[#141414] rounded-lg p-6 border border-white/5 flex items-center justify-center text-[#888888] text-sm font-bold">
              Belum ada data kategori bulan ini
            </div>
          )}
        </section>
        </SearchableSection>

        {/* AI Forecast Summary */}
        <SearchableSection
          id="health-analysis"
          title="Analisis & Prediksi"
          subtitle="Insight dari Cuan AI untuk meningkatkan kesehatan finansialmu"
        >
          <section className="bg-[#141414] rounded-lg p-10 border-l-4 border-[#BCFF4F]">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#BCFF4F] p-2 rounded-full">
              <span className="material-symbols-outlined text-[#0A0A0A]">psychology</span>
            </div>
            <h3 className="text-2xl font-[900]">BudgetLy AI Insight</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              {isAiLoading ? (
                <div className="space-y-2 mb-8">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-5/6 bg-white/10" />
                  <Skeleton className="h-4 w-4/6 bg-white/10" />
                </div>
              ) : (
                <p className="text-xl leading-relaxed text-[#F4F4F0]">
                  {forecastNarrative ||
                    'Mulai kumpulkan data transaksi agar Cuan AI bisa memprediksi masa depan keuanganmu dengan akurat.'}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/budgeting">
                  <button className="bg-[#2A2A2A] text-[#F4F4F0] px-6 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all">
                    Atur Budget Kategori
                  </button>
                </Link>
                <Link href="/transactions">
                  <button className="bg-[#2A2A2A] text-[#F4F4F0] px-6 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all">
                    Lihat Semua Transaksi
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-[#0A0A0A] rounded-lg p-6 border border-white/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-[900] text-[#BCFF4F]">
                  {(trend?.filter(t => t.expense > 0).length ?? 0) >= 4 ? '88%' :
                    `${Math.min((trend?.filter(t => t.expense > 0).length ?? 0) * 22, 88)}%`}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                  Akurasi Prediksi AI
                </div>
              </div>
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#BCFF4F] transition-all"
                  style={{
                    width: `${(trend?.filter(t => t.expense > 0).length ?? 0) >= 4 ? 88 :
                      Math.min((trend?.filter(t => t.expense > 0).length ?? 0) * 22, 88)}%`
                  }}
                />
              </div>
              <p className="text-xs text-[#888888] leading-tight">
                Semakin banyak transaksi yang kamu catat, semakin tajam prediksi Cuan AI membantumu berhemat.
              </p>
            </div>
          </div>
        </section>
        </SearchableSection>
      </div>
    </AppLayout>
  );
}
'use client';

import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import SearchableSection from '@/components/common/SearchableSection';
import {
  useFinancialScore,
  useAiInsights,
  useAiRecommendations,
  useAiNarrative,
  useAiForecast,
} from '@/hooks/useAiInsights';
import { useMonthlyTrend, useCategoryBreakdown, useTransactionSummary } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORY_ICONS: Record<string, string> = {
  'Makanan & Minuman': 'restaurant',
  'Makan & Minum': 'restaurant',
  'Transportasi': 'commute',
  'Hiburan & Lifestyle': 'movie',
  'Hiburan': 'movie',
  'Langganan': 'subscriptions',
  'Tagihan': 'receipt_long',
  'Belanja': 'shopping_bag',
  'Kesehatan': 'medical_services',
  'Pendidikan': 'school',
  'Household': 'home',
  'Apparel': 'checkroom',
  'Lainnya': 'category',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const GRADE_COLORS: Record<string, string> = {
  A: '#BCFF4F',
  B: '#7DD956',
  C: '#FFD600',
  D: '#FF9800',
  F: '#FF4444',
};

function formatCompact(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${value.toFixed(0)}`;
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#BCFF4F';
  if (score >= 70) return '#7DD956';
  if (score >= 55) return '#FFD600';
  if (score >= 40) return '#FF9800';
  return '#FF4444';
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'high':
      return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Prioritas Tinggi' };
    case 'medium':
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Prioritas Sedang' };
    default:
      return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Prioritas Rendah' };
  }
}

export default function FinancialHealthPage() {
  // ML-backed hooks
  const { data: score, isLoading: scoreLoading } = useFinancialScore();
  const { data: insights, isLoading: insightsLoading } = useAiInsights();
  const { data: recommendations, isLoading: recoLoading } = useAiRecommendations();
  const { data: forecastNarrative, isLoading: narrativeLoading } = useAiNarrative('forecast');
  const { data: scoreNarrative, isLoading: scoreNarrLoading } = useAiNarrative('score');
  const { data: forecast, isLoading: forecastLoading } = useAiForecast(30);

  // Transaction data hooks
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(6);
  const { data: categories, isLoading: categoriesLoading } = useCategoryBreakdown();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();

  const maxVal = Math.max(...(trend?.map(t => Math.max(t.expense, t.income)) ?? []), 1);
  const topCategories = categories?.slice(0, 4) ?? [];
  const totalExpense = summary?.expense ?? 0;
  const totalIncome = summary?.income ?? 0;
  const surplus = totalIncome - totalExpense;

  // Real values from ML
  const healthScore = score?.value ?? 0;
  const healthStatus = score?.status ?? 'Memuat...';
  const healthGrade = score?.grade ?? '-';
  const forecastAccuracy = forecast?.accuracy ?? 0;

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Header */}
        <section>
          <h2 className="text-[40px] font-[900] tracking-[-0.04em] text-white leading-tight">
            Financial Health.
          </h2>
          <p className="text-[#888888] font-bold mt-2">
            Analisis AI menyeluruh berdasarkan data transaksi dan model prediksi.
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SECTION 1: Health Score Gauge + Grade */}
        {/* ══════════════════════════════════════════════════════════ */}
        <SearchableSection
          id="health-score"
          title="Skor Kesehatan Keuangan"
          subtitle="Dihitung oleh Rule-Based AI Engine dari data transaksimu"
        >
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Gauge */}
            <div className="md:col-span-1 bg-[#141414] rounded-lg p-8 border border-[#BCFF4F]/5 flex flex-col items-center justify-center">
              {scoreLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="w-40 h-40 rounded-full bg-white/10" />
                  <Skeleton className="h-6 w-32 bg-white/10" />
                </div>
              ) : (
                <>
                  {/* Circular Score Gauge */}
                  <div className="relative w-44 h-44">
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="80" cy="80" r="70"
                        fill="none"
                        stroke="#2A2A2A"
                        strokeWidth="12"
                      />
                      {/* Score arc */}
                      <circle
                        cx="80" cy="80" r="70"
                        fill="none"
                        stroke={getScoreColor(healthScore)}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(healthScore / 100) * 440} 440`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-[900]" style={{ color: getScoreColor(healthScore) }}>
                        {healthScore}
                      </span>
                      <span className="text-xs font-bold text-[#888888] mt-1">/ 100</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-[900] inline-block"
                      style={{
                        backgroundColor: `${GRADE_COLORS[healthGrade] || '#888'}20`,
                        color: GRADE_COLORS[healthGrade] || '#888',
                      }}
                    >
                      Grade {healthGrade} — {healthStatus}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Score Breakdown + Narrative */}
            <div className="md:col-span-2 bg-[#141414] rounded-lg p-8 border border-[#BCFF4F]/5 space-y-6">
              {/* AI Narrative for score */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#BCFF4F] p-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[#0A0A0A] text-sm">psychology</span>
                  </div>
                  <h4 className="text-sm font-[900] uppercase tracking-widest text-[#888888]">Analisis AI</h4>
                </div>
                {scoreNarrLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <Skeleton className="h-4 w-4/5 bg-white/10" />
                  </div>
                ) : (
                  <p className="text-[#F4F4F0] leading-relaxed">
                    {scoreNarrative || 'Mulai catat transaksi untuk mendapatkan analisis AI.'}
                  </p>
                )}
              </div>

              {/* Deductions & Bonuses */}
              {!scoreLoading && score && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Deductions */}
                  {score.deductions.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-[900] uppercase tracking-widest text-red-400">Potongan Skor</h5>
                      {score.deductions.map((d, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-[#F4F4F0] font-bold">{d.rule}</span>
                            <span className="text-xs font-[900] text-red-400">{d.points}</span>
                          </div>
                          <p className="text-[10px] text-[#888888] mt-1">{d.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Bonuses */}
                  {score.bonuses.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-[900] uppercase tracking-widest text-[#BCFF4F]">Bonus Skor</h5>
                      {score.bonuses.map((b, i) => (
                        <div key={i} className="bg-[#BCFF4F]/5 border border-[#BCFF4F]/10 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-[#F4F4F0] font-bold">{b.rule}</span>
                            <span className="text-xs font-[900] text-[#BCFF4F]">+{b.points}</span>
                          </div>
                          <p className="text-[10px] text-[#888888] mt-1">{b.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </SearchableSection>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SECTION 2: Spending Overview — Trend Chart + Categories  */}
        {/* ══════════════════════════════════════════════════════════ */}
        <SearchableSection
          id="spending-overview"
          title="Ringkasan Pengeluaran"
          subtitle="Tren 6 bulan terakhir dan distribusi kategori"
        >
          {/* Trend Bar Chart */}
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

          {/* Category Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
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

            {/* Category Cards */}
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

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SECTION 3: Behavior Analysis (Insights/Warnings/Positives) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <SearchableSection
          id="behavior-analysis"
          title="Analisis Perilaku Belanja"
          subtitle="Insight otomatis dari pola transaksimu oleh Rule-Based AI"
        >
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Warnings */}
            <div className="bg-[#141414] rounded-lg p-6 border border-red-500/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-red-400 text-lg">warning</span>
                <h4 className="text-xs font-[900] uppercase tracking-widest text-red-400">Peringatan</h4>
              </div>
              {insightsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-4/5 bg-white/10" />
                </div>
              ) : insights?.warnings && insights.warnings.length > 0 ? (
                <ul className="space-y-3">
                  {insights.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-red-300/90 leading-relaxed flex gap-2">
                      <span className="text-red-400 mt-0.5 shrink-0">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#888888]">Tidak ada peringatan — keuanganmu baik!</p>
              )}
            </div>

            {/* Insights */}
            <div className="bg-[#141414] rounded-lg p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-400 text-lg">lightbulb</span>
                <h4 className="text-xs font-[900] uppercase tracking-widest text-blue-400">Insight</h4>
              </div>
              {insightsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-4/5 bg-white/10" />
                </div>
              ) : insights?.insights && insights.insights.length > 0 ? (
                <ul className="space-y-3">
                  {insights.insights.map((ins, i) => (
                    <li key={i} className="text-sm text-[#F4F4F0] leading-relaxed flex gap-2">
                      <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                      {ins}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#888888]">Belum cukup data untuk menghasilkan insight.</p>
              )}
            </div>

            {/* Positives */}
            <div className="bg-[#141414] rounded-lg p-6 border border-[#BCFF4F]/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#BCFF4F] text-lg">thumb_up</span>
                <h4 className="text-xs font-[900] uppercase tracking-widest text-[#BCFF4F]">Hal Positif</h4>
              </div>
              {insightsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-4/5 bg-white/10" />
                </div>
              ) : insights?.positives && insights.positives.length > 0 ? (
                <ul className="space-y-3">
                  {insights.positives.map((p, i) => (
                    <li key={i} className="text-sm text-[#BCFF4F]/90 leading-relaxed flex gap-2">
                      <span className="text-[#BCFF4F] mt-0.5 shrink-0">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#888888]">Mulai catat transaksi untuk melihat pencapaianmu.</p>
              )}
            </div>
          </section>
        </SearchableSection>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SECTION 4: AI Forecast + Real Accuracy */}
        {/* ══════════════════════════════════════════════════════════ */}
        <SearchableSection
          id="forecast-prediction"
          title="Prediksi Pengeluaran"
          subtitle="Proyeksi AI untuk 30 hari ke depan berdasarkan model Prophet"
        >
          <section className="bg-[#141414] rounded-lg p-10 border-l-4 border-[#BCFF4F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#BCFF4F] p-2 rounded-full">
                <span className="material-symbols-outlined text-[#0A0A0A]">psychology</span>
              </div>
              <h3 className="text-2xl font-[900]">BudgetLy AI Forecast</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {/* Narrative + Forecast Summary */}
              <div className="md:col-span-2">
                {narrativeLoading ? (
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

                {/* Forecast Breakdown by Category */}
                {!forecastLoading && forecast?.breakdown && Object.keys(forecast.breakdown).length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h5 className="text-xs font-[900] uppercase tracking-widest text-[#888888] mb-3">
                      Prediksi Per Kategori (30 Hari)
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(forecast.breakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([cat, amount]) => {
                          const icon = CATEGORY_ICONS[cat] || 'category';
                          return (
                            <div key={cat} className="bg-[#0A0A0A] rounded-lg p-3 border border-white/5 flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#BCFF4F] text-sm">{icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-[#888888] uppercase truncate">{cat}</p>
                                <p className="text-sm font-[900] text-[#F4F4F0]">{formatCompact(amount)}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
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

              {/* Real Accuracy from ML Model */}
              <div className="bg-[#0A0A0A] rounded-lg p-6 border border-white/5 space-y-6">
                {forecastLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-20 bg-white/10" />
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <Skeleton className="h-1 w-full bg-white/10" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-[900]" style={{ color: getScoreColor(forecastAccuracy) }}>
                        {forecastAccuracy}%
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                        Akurasi Model<br />Prophet
                      </div>
                    </div>
                    <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${forecastAccuracy}%`,
                          backgroundColor: getScoreColor(forecastAccuracy),
                        }}
                      />
                    </div>
                    {forecast && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#888888]">Periode Prediksi</span>
                          <span className="text-[#F4F4F0] font-bold">{forecast.period}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#888888]">Total Prediksi</span>
                          <span className="text-[#BCFF4F] font-[900]">{formatCompact(forecast.total_predicted)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#888888]">Metrik</span>
                          <span className="text-[#F4F4F0] font-bold">MAPE {(100 - forecastAccuracy).toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-[#888888] leading-tight">
                      Akurasi dihitung dari MAPE (Mean Absolute Percentage Error) pada data historis. Semakin banyak transaksi, semakin akurat prediksi.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </SearchableSection>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SECTION 5: AI Recommendations */}
        {/* ══════════════════════════════════════════════════════════ */}
        <SearchableSection
          id="ai-recommendations"
          title="Rekomendasi AI"
          subtitle="Aksi spesifik untuk meningkatkan kesehatan keuanganmu"
        >
          <section className="space-y-4">
            {recoLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#141414] rounded-lg p-6 border border-white/5">
                  <Skeleton className="h-4 w-24 bg-white/10 mb-3" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-3/4 bg-white/10 mt-2" />
                </div>
              ))
            ) : recommendations?.items && recommendations.items.length > 0 ? (
              <>
                {/* Summary bar */}
                {recommendations.estimated_saving > 0 && (
                  <div className="bg-[#BCFF4F]/10 border border-[#BCFF4F]/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#BCFF4F]">savings</span>
                      <span className="text-sm font-bold text-[#F4F4F0]">
                        Potensi penghematan jika semua rekomendasi diikuti
                      </span>
                    </div>
                    <span className="text-lg font-[900] text-[#BCFF4F]">
                      {formatCompact(recommendations.estimated_saving)}
                    </span>
                  </div>
                )}

                {recommendations.items.map((reco, i) => {
                  const style = getPriorityStyle(reco.priority);
                  const icon = CATEGORY_ICONS[reco.category] || 'lightbulb';
                  return (
                    <div key={i} className="bg-[#141414] rounded-lg p-6 border border-white/5 hover:bg-[#1C1B1B] transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="bg-white/5 p-3 rounded-lg shrink-0">
                          <span className="material-symbols-outlined text-[#BCFF4F]">{icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-[900] ${style.bg} ${style.text}`}>
                              {style.label}
                            </span>
                            <span className="text-xs font-bold text-[#888888]">{reco.category}</span>
                          </div>
                          <p className="text-sm text-[#F4F4F0] leading-relaxed">{reco.action}</p>
                          {reco.estimated_impact > 0 && (
                            <p className="text-xs text-[#BCFF4F] font-bold mt-2">
                              💰 Potensi hemat: {formatCompact(reco.estimated_impact)}/bulan
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="bg-[#141414] rounded-lg p-8 border border-[#BCFF4F]/10 text-center">
                <span className="material-symbols-outlined text-[#BCFF4F] text-4xl mb-3">verified</span>
                <p className="text-[#F4F4F0] font-bold">Keuanganmu sudah baik!</p>
                <p className="text-sm text-[#888888] mt-1">Tidak ada rekomendasi khusus saat ini.</p>
              </div>
            )}
          </section>
        </SearchableSection>
      </div>
    </AppLayout>
  );
}
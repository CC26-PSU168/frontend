'use client';

import AppLayout from '@/components/layout/AppLayout';
import { useInvestmentPrices } from '@/hooks/useInvestment';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function InvestmentPage() {
  const { data: prices, isLoading, isError } = useInvestmentPrices();

  if (isLoading) {
    return <AppLayout><div className="text-[#F4F4F0] animate-pulse">Memuat data investasi...</div></AppLayout>;
  }

  if (isError || !prices) {
    return <AppLayout><div className="text-red-500 font-bold">Gagal memuat data investasi. Coba lagi nanti.</div></AppLayout>;
  }

  return (
    <AppLayout>
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-[900] tracking-[-0.04em] text-[#F4F4F0]">
          Pantau Investasi<span className="text-[#BCFF4F]">.</span>
        </h1>
        <p className="text-[#888888] mt-2 font-bold">Data real-time untuk referensi edukasi finansialmu.</p>
      </div>

      <div className="flex items-center gap-2 bg-[#1A1A1A] p-4 rounded-xl border border-white/5 w-fit">
        <span className="material-symbols-outlined text-[#BCFF4F] animate-pulse">sensors</span>
        <p className="text-xs font-bold text-[#F4F4F0]">
          Diperbarui {formatDistanceToNow(new Date(prices.lastUpdated), { addSuffix: true, locale: id })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emas */}
        <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FFD700]/10 rounded-full blur-2xl group-hover:bg-[#FFD700]/20 transition-all" />
          <h3 className="text-[#888888] font-black tracking-widest text-[10px] uppercase mb-4">Emas (Gram)</h3>
          <p className="text-3xl font-[900] tracking-tight text-[#F4F4F0]">
            {formatIDR(prices.gold.price)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[#BCFF4F]">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-sm font-bold">+{prices.gold.change24h}% (24h)</span>
          </div>
          <div className="mt-6 h-12 w-full bg-[#1A1A1A] rounded-xl flex flex-col justify-end overflow-hidden">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full opacity-50">
              <path d="M0 30 L0 15 L20 10 L40 25 L60 5 L80 15 L100 5 L100 30 Z" fill="#FFD700" />
            </svg>
          </div>
        </div>

        {/* Bitcoin */}
        <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F7931A]/10 rounded-full blur-2xl group-hover:bg-[#F7931A]/20 transition-all" />
          <h3 className="text-[#888888] font-black tracking-widest text-[10px] uppercase mb-4">Bitcoin (BTC)</h3>
          <p className="text-3xl font-[900] tracking-tight text-[#F4F4F0]">
            {formatIDR(prices.bitcoin.price)}
          </p>
          <div className={`flex items-center gap-1 mt-2 ${prices.bitcoin.change24h >= 0 ? 'text-[#BCFF4F]' : 'text-red-500'}`}>
            <span className="material-symbols-outlined text-sm">
              {prices.bitcoin.change24h >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span className="text-sm font-bold">{Math.abs(prices.bitcoin.change24h).toFixed(2)}% (24h)</span>
          </div>
          <div className="mt-6 h-12 w-full bg-[#1A1A1A] rounded-xl flex flex-col justify-end overflow-hidden">
             <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full opacity-50">
              <path d="M0 30 L0 25 L20 15 L40 20 L60 10 L80 15 L100 0 L100 30 Z" fill="#F7931A" />
            </svg>
          </div>
        </div>

        {/* USD */}
        <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00A86B]/10 rounded-full blur-2xl group-hover:bg-[#00A86B]/20 transition-all" />
          <h3 className="text-[#888888] font-black tracking-widest text-[10px] uppercase mb-4">Dolar AS (USD)</h3>
          <p className="text-3xl font-[900] tracking-tight text-[#F4F4F0]">
            {formatIDR(prices.usd.price)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[#888888]">
            <span className="material-symbols-outlined text-sm">horizontal_rule</span>
            <span className="text-sm font-bold">Flat (24h)</span>
          </div>
          <div className="mt-6 h-12 w-full bg-[#1A1A1A] rounded-xl flex flex-col justify-end overflow-hidden">
             <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full opacity-50">
              <path d="M0 30 L0 15 L20 16 L40 14 L60 15 L80 14 L100 15 L100 30 Z" fill="#00A86B" />
            </svg>
          </div>
        </div>
      </div>

      {/* Edukasi */}
      <div className="bg-[#BCFF4F]/10 border border-[#BCFF4F]/20 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-6 mt-12">
        <div className="w-16 h-16 bg-[#BCFF4F] rounded-2xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-black text-3xl font-black">school</span>
        </div>
        <div>
          <h3 className="text-xl font-[900] tracking-tight text-[#F4F4F0] mb-2">Panduan Investasi Pemula</h3>
          <p className="text-[#888888] font-bold text-sm leading-relaxed max-w-2xl">
            Harga aset di atas ditampilkan secara real-time untuk tujuan edukasi. Sebelum mulai berinvestasi, pastikan kamu sudah memiliki <strong>Dana Darurat</strong> yang cukup (minimal 3-6 kali pengeluaran bulananmu).
          </p>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}

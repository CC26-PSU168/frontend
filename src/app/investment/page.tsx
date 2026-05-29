'use client';

import AppLayout from '@/components/layout/AppLayout';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ── Live prices hook (all public APIs, no backend needed) ────────────────────
// Gold  : gold-api.com       → XAU/USD   (free, no key, CORS ok)
// BTC   : api.binance.com    → BTCUSDT   (free, no key, CORS ok)
// USD   : open.er-api.com    → USD/IDR   (free, no key, CORS ok)
interface LivePrices {
  gold: { price: number; change24h: number };
  bitcoin: { price: number; change24h: number };
  usd: { price: number; change24h: number };
  lastUpdated: string;
}

function useLivePrices() {
  const [prices, setPrices] = useState<LivePrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        type GoldApiResponse = {
          price: number;
          price_gram_24k?: number;
          ch?: number;
          chp?: number;
        };
        type FxResponse = { rates: Record<string, number> };
        type BinanceTickerResponse = {
          symbol: string;
          priceChange: string;
          priceChangePercent: string;
          lastPrice: string;
        };

        const [goldRes, fxRes, btcRes] = await Promise.all([
          fetch('https://api.gold-api.com/price/XAU', { headers: { Accept: 'application/json' } }),
          fetch('https://open.er-api.com/v6/latest/USD'),
          fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
        ]);

        if (!goldRes.ok) throw new Error(`gold-api: ${goldRes.status}`);
        if (!fxRes.ok) throw new Error(`fx: ${fxRes.status}`);
        if (!btcRes.ok) throw new Error(`binance: ${btcRes.status}`);

        const goldData: GoldApiResponse = await goldRes.json();
        const fxData: FxResponse = await fxRes.json();
        const btcData: BinanceTickerResponse = await btcRes.json();

        const usdToIdr = fxData.rates['IDR'] ?? 16000;

        // Gold
        const priceUsdPerGram = goldData.price_gram_24k ?? goldData.price / 31.1035;
        const goldPriceIdr = Math.round(priceUsdPerGram * usdToIdr);
        const goldChangePct =
          goldData.chp !== undefined
            ? goldData.chp
            : goldData.ch !== undefined && goldData.price > 0
            ? Number(((goldData.ch / (goldData.price - goldData.ch)) * 100).toFixed(2))
            : 0;

        // Bitcoin — Binance gives BTCUSDT, convert to IDR
        const btcPriceUsd = parseFloat(btcData.lastPrice);
        const btcPriceIdr = Math.round(btcPriceUsd * usdToIdr);
        const btcChange = Number(parseFloat(btcData.priceChangePercent).toFixed(2));

        // USD/IDR
        const usdPriceIdr = Math.round(usdToIdr);

        if (!cancelled) {
          setPrices({
            gold: { price: goldPriceIdr, change24h: Number(goldChangePct.toFixed(2)) },
            bitcoin: { price: btcPriceIdr, change24h: btcChange },
            usd: { price: usdPriceIdr, change24h: 0 },
            lastUpdated: new Date().toISOString(),
          });
          setLoading(false);
        }
      } catch (err) {
        console.warn('[useLivePrices] fetch failed:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { prices, loading, error };
}

// ── Investment tips data ─────────────────────────────────────────────────────
const investmentTips = [
  {
    icon: 'savings',
    color: '#BCFF4F',
    title: 'Mulai dari yang Kecil',
    desc: 'Tidak perlu modal besar. Mulai dengan Rp 10.000–50.000/bulan dan tingkatkan seiring waktu.',
  },
  {
    icon: 'diversity_3',
    color: '#60A5FA',
    title: 'Diversifikasi Portofolio',
    desc: 'Jangan taruh semua telur dalam satu keranjang. Sebar investasi di beberapa aset berbeda.',
  },
  {
    icon: 'trending_up',
    color: '#F97316',
    title: 'Investasi Jangka Panjang',
    desc: 'Pasar bisa naik-turun. Investasi dengan horizon 5–10 tahun biasanya memberikan hasil lebih stabil.',
  },
  {
    icon: 'menu_book',
    color: '#A78BFA',
    title: 'Terus Belajar',
    desc: 'Pahami instrumen sebelum berinvestasi. Baca laporan keuangan, ikuti berita ekonomi terkini.',
  },
];

// ── Risk profile cards ───────────────────────────────────────────────────────
const riskProfiles = [
  {
    level: 'Konservatif',
    emoji: '🛡️',
    color: '#60A5FA',
    description: 'Cocok untuk pemula. Pilih deposito, reksa dana pasar uang, atau obligasi pemerintah (ORI/SBN).',
    expectedReturn: '5–7% / tahun',
  },
  {
    level: 'Moderat',
    emoji: '⚖️',
    color: '#BCFF4F',
    description: 'Campuran saham & obligasi. Reksa dana campuran atau ETF indeks adalah pilihan populer.',
    expectedReturn: '8–12% / tahun',
  },
  {
    level: 'Agresif',
    emoji: '🚀',
    color: '#F97316',
    description: 'Siap terima risiko tinggi demi potensi return besar. Saham individual, kripto, atau startup.',
    expectedReturn: '15%+ / tahun',
  },
];

// ── Comparison table data ────────────────────────────────────────────────────
const instruments = [
  { name: 'Deposito Bank', risk: 'Sangat Rendah', liquidity: 'Rendah', minModal: 'Rp 1 juta', pajak: 'Ya (20%)', emoji: '🏦' },
  { name: 'Reksa Dana Pasar Uang', risk: 'Rendah', liquidity: 'Tinggi', minModal: 'Rp 10 ribu', pajak: 'Tidak', emoji: '📊' },
  { name: 'Obligasi / SBN', risk: 'Rendah', liquidity: 'Sedang', minModal: 'Rp 1 juta', pajak: 'Ya (10%)', emoji: '📄' },
  { name: 'Emas', risk: 'Sedang', liquidity: 'Sedang', minModal: 'Rp 5 ribu', pajak: 'Tidak', emoji: '🥇' },
  { name: 'Reksa Dana Saham', risk: 'Tinggi', liquidity: 'Tinggi', minModal: 'Rp 10 ribu', pajak: 'Tidak', emoji: '📈' },
  { name: 'Saham', risk: 'Tinggi', liquidity: 'Tinggi', minModal: 'Rp 100 ribu', pajak: 'Tidak*', emoji: '💹' },
  { name: 'Bitcoin/Kripto', risk: 'Sangat Tinggi', liquidity: 'Sangat Tinggi', minModal: 'Rp 10 ribu', pajak: 'Ya (0.1%)', emoji: '₿' },
];

const riskColor = (risk: string) => {
  if (risk.includes('Sangat Rendah')) return 'text-[#60A5FA]';
  if (risk.includes('Rendah')) return 'text-[#BCFF4F]';
  if (risk.includes('Sedang')) return 'text-yellow-400';
  if (risk.includes('Sangat Tinggi')) return 'text-red-500';
  if (risk.includes('Tinggi')) return 'text-orange-400';
  return 'text-[#888888]';
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function InvestmentPage() {
  const { prices, loading, error } = useLivePrices();

  if (loading) {
    return <AppLayout><div className="text-[#F4F4F0] animate-pulse">Memuat data investasi...</div></AppLayout>;
  }

  if (error || !prices) {
    return <AppLayout><div className="text-red-500 font-bold">Gagal memuat data investasi. Coba lagi nanti.</div></AppLayout>;
  }

  return (
    <AppLayout>
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Header ── */}
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

      {/* ── Asset price cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emas */}
        <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FFD700]/10 rounded-full blur-2xl group-hover:bg-[#FFD700]/20 transition-all" />
          <h3 className="text-[#888888] font-black tracking-widest text-[10px] uppercase mb-4">Emas (Gram)</h3>
          <p className="text-3xl font-[900] tracking-tight text-[#F4F4F0]">
            {formatIDR(prices.gold.price)}
          </p>
          <div className={`flex items-center gap-1 mt-2 ${prices.gold.change24h >= 0 ? 'text-[#BCFF4F]' : 'text-red-500'}`}>
            <span className="material-symbols-outlined text-sm">
              {prices.gold.change24h >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span className="text-sm font-bold">
              {prices.gold.change24h >= 0 ? '+' : ''}{prices.gold.change24h}% (24h)
            </span>
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

      {/* ── Edukasi (original) ── */}
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

      {/* ── Tips Investasi ── */}
      <div>
        <h2 className="text-2xl font-[900] tracking-[-0.03em] text-[#F4F4F0] mb-6">
          Tips Investasi<span className="text-[#BCFF4F]">.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {investmentTips.map((tip) => (
            <div
              key={tip.title}
              className="bg-[#141414] border border-white/5 rounded-[20px] p-5 flex gap-4 items-start hover:border-white/10 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${tip.color}20`, border: `1px solid ${tip.color}30` }}
              >
                <span className="material-symbols-outlined text-xl" style={{ color: tip.color }}>
                  {tip.icon}
                </span>
              </div>
              <div>
                <p className="font-[900] text-[#F4F4F0] text-sm mb-1">{tip.title}</p>
                <p className="text-[#888888] text-xs font-bold leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Profil Risiko ── */}
      <div>
        <h2 className="text-2xl font-[900] tracking-[-0.03em] text-[#F4F4F0] mb-2">
          Kenali Profil Risiko<span className="text-[#BCFF4F]">.</span>
        </h2>
        <p className="text-[#888888] text-sm font-bold mb-6">
          Pilih strategi yang sesuai dengan toleransi risiko dan tujuan finansialmu.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskProfiles.map((profile) => (
            <div
              key={profile.level}
              className="bg-[#141414] border border-white/5 rounded-[20px] p-6 flex flex-col gap-3 hover:border-white/10 transition-colors"
            >
              <div className="text-3xl">{profile.emoji}</div>
              <div>
                <p className="font-[900] text-[#F4F4F0] text-base">{profile.level}</p>
                <p
                  className="text-xs font-black mt-1"
                  style={{ color: profile.color }}
                >
                  {profile.expectedReturn}
                </p>
              </div>
              <p className="text-[#888888] text-xs font-bold leading-relaxed">{profile.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Perbandingan Instrumen Investasi ── */}
      <section id="instrument-comparison">
        <h2 className="text-2xl font-[900] tracking-[-0.03em] text-[#F4F4F0] mb-2">
          Perbandingan Instrumen<span className="text-[#BCFF4F]">.</span>
        </h2>
        <p className="text-[#888888] text-sm font-bold mb-6">
          Ringkasan populer pilihan investasi di Indonesia.
        </p>
        <div className="bg-[#141414] border border-white/5 rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-4 text-[#888888] font-black text-[10px] uppercase tracking-widest">Instrumen</th>
                  <th className="text-left px-5 py-4 text-[#888888] font-black text-[10px] uppercase tracking-widest">Risiko</th>
                  <th className="text-left px-5 py-4 text-[#888888] font-black text-[10px] uppercase tracking-widest">Likuiditas</th>
                  <th className="text-left px-5 py-4 text-[#888888] font-black text-[10px] uppercase tracking-widest">Min. Modal</th>
                  <th className="text-left px-5 py-4 text-[#888888] font-black text-[10px] uppercase tracking-widest">Kena Pajak</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((inst, i) => (
                  <tr
                    key={inst.name}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                  >
                    <td className="px-5 py-4 font-[900] text-[#F4F4F0] whitespace-nowrap">
                      <span className="mr-2">{inst.emoji}</span>{inst.name}
                    </td>
                    <td className={`px-5 py-4 font-bold ${riskColor(inst.risk)}`}>{inst.risk}</td>
                    <td className="px-5 py-4 text-[#888888] font-bold">{inst.liquidity}</td>
                    <td className="px-5 py-4 text-[#888888] font-bold whitespace-nowrap">{inst.minModal}</td>
                    <td className="px-5 py-4 text-[#888888] font-bold">{inst.pajak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#555555] font-bold px-5 py-3 border-t border-white/5">
            * Pajak capital gain saham 0.1% dari nilai transaksi jual. Data bersifat umum & dapat berubah.
          </p>
        </div>
      </section>

      {/* ── Rumus Investasi ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule of 72 */}
        <div className="bg-[#141414] border border-white/5 rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#BCFF4F]/10 border border-[#BCFF4F]/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#BCFF4F] text-xl">calculate</span>
            </div>
            <h3 className="font-[900] text-[#F4F4F0]">Aturan 72</h3>
          </div>
          <p className="text-[#888888] text-sm font-bold leading-relaxed mb-4">
            Hitung berapa tahun uangmu akan berlipat ganda: bagi <span className="text-[#BCFF4F]">72</span> dengan return tahunanmu.
          </p>
          <div className="bg-[#1A1A1A] rounded-xl p-4 font-mono text-center">
            <p className="text-[#888888] text-xs font-bold mb-1">Contoh: return 8%/tahun</p>
            <p className="text-[#BCFF4F] text-xl font-[900]">72 ÷ 8 = <span className="text-[#F4F4F0]">9 Tahun</span></p>
          </div>
        </div>

        {/* DCA Explanation */}
        <div className="bg-[#141414] border border-white/5 rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#60A5FA] text-xl">repeat</span>
            </div>
            <h3 className="font-[900] text-[#F4F4F0]">Dollar Cost Averaging (DCA)</h3>
          </div>
          <p className="text-[#888888] text-sm font-bold leading-relaxed mb-4">
            Investasi rutin dengan jumlah tetap setiap bulan. Cara paling sederhana untuk mengurangi risiko volatilitas pasar.
          </p>
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#888888]">Beli setiap bulan</span>
              <span className="text-[#60A5FA]">Rp 500.000</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[40, 60, 30, 75, 50, 85, 65, 90, 55, 70, 80, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${h * 0.4}px`, backgroundColor: `rgba(96,165,250,${0.3 + h / 200})` }}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#555555] font-bold mt-2">Ilustrasi pertumbuhan DCA selama 12 bulan</p>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-[20px] p-5 flex gap-3 items-start">
        <span className="material-symbols-outlined text-[#888888] text-xl shrink-0 mt-0.5">info</span>
        <p className="text-[#555555] text-xs font-bold leading-relaxed">
          <span className="text-[#888888]">Disclaimer:</span> Seluruh informasi dan data harga di halaman ini bersifat edukatif dan bukan merupakan saran investasi. Harga aset dapat berubah sewaktu-waktu. Lakukan riset mandiri (<em>DYOR – Do Your Own Research</em>) sebelum mengambil keputusan investasi.
        </p>
      </div>

    </div>
    </AppLayout>
  );
}
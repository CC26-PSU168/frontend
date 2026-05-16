'use client';

import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';

export default function FinancialHealthPage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <section>
          <h2 className="text-[40px] font-[900] tracking-[-0.04em] text-white leading-tight">
            Prediksi Pengeluaran.
          </h2>
          <p className="text-[#888888] font-bold mt-2">
            Berdasarkan pola spending 6 bulan terakhir.
          </p>
        </section>

        {/* Hero Chart Card */}
        <section className="bg-[#141414] rounded-lg p-8 relative overflow-hidden border border-[#BCFF4F]/5">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#888888] font-[900]">
                Volume Transaksi Bulanan
              </p>
              <h3 className="text-4xl font-[900] mt-1">
                Rp 4.250.000{' '}
                <span className="text-[#BCFF4F] text-sm align-top ml-2">+12%</span>
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#BCFF4F] rounded-full" />
                <span className="text-xs font-bold text-[#F4F4F0]">Aktual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 border border-white border-dashed rounded-full" />
                <span className="text-xs font-bold text-[#888888]">Prediksi</span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="h-[400px] w-full relative flex items-end justify-between px-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-t border-[#888888] w-full" />
              <div className="border-t border-[#888888] w-full" />
              <div className="border-t border-[#888888] w-full" />
              <div className="border-t border-[#888888] w-full" />
            </div>

            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 1000 400"
            >
              {/* Confidence Interval Shading */}
              <path
                d="M 600 250 L 700 200 L 800 230 L 900 180 L 1000 150 L 1000 280 L 900 310 L 800 350 L 700 320 L 600 250"
                fill="white"
                fillOpacity="0.05"
              />
              {/* Prediction Dashed Line */}
              <path
                d="M 600 250 L 700 260 L 800 290 L 900 240 L 1000 210"
                fill="none"
                stroke="white"
                strokeDasharray="10,10"
                strokeWidth="3"
              />
              {/* Actual Solid Lime Line */}
              <path
                d="M 0 350 L 100 300 L 200 320 L 300 220 L 400 240 L 500 180 L 600 250"
                fill="none"
                stroke="#BCFF4F"
                strokeWidth="5"
              />
            </svg>

            {/* Month Labels */}
            <div className="absolute bottom-[-32px] w-full flex justify-between px-2 text-[10px] font-[900] text-[#888888] tracking-widest uppercase">
              <span>Nov</span>
              <span>Des</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span className="text-[#BCFF4F]">Mei</span>
            </div>
          </div>
        </section>

        {/* Forecast By Category Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Highlight Card */}
          <div className="md:col-span-2 md:row-span-2 bg-[#BCFF4F] rounded-lg p-10 flex flex-col justify-between group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <div>
              <h4 className="text-[#0A0A0A] text-xs font-[900] tracking-[0.3em] uppercase">
                Total Prediksi Mei
              </h4>
              <div className="mt-4">
                <span className="text-[#0A0A0A] text-6xl font-[900] tracking-tighter">
                  Rp 3.8M
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-4">
                <span className="text-[#0A0A0A] font-bold">Limit Anggaran</span>
                <span className="text-[#0A0A0A] font-[900]">Rp 4.5M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0A0A0A] font-bold">Status</span>
                <span className="bg-[#0A0A0A] text-[#BCFF4F] px-4 py-1 rounded-full text-xs font-[900]">
                  AMAN
                </span>
              </div>
            </div>
          </div>

          {/* Food & Drink */}
          <div className="bg-[#141414] rounded-lg p-6 border border-white/5 flex flex-col justify-between hover:bg-[#1C1B1B] transition-colors">
            <div className="flex justify-between items-start">
              <div className="bg-white/5 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[#BCFF4F]">restaurant</span>
              </div>
              <span className="text-[10px] font-bold text-red-400">+18%</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-[900] text-[#888888] tracking-widest">
                Food &amp; Drink
              </p>
              <h4 className="text-xl font-[900] mt-1">Rp 1.250k</h4>
              <p className="text-[10px] text-[#888888] mt-2">Bulan lalu: Rp 1.059k</p>
            </div>
          </div>

          {/* Transport */}
          <div className="bg-[#141414] rounded-lg p-6 border border-white/5 flex flex-col justify-between hover:bg-[#1C1B1B] transition-colors">
            <div className="flex justify-between items-start">
              <div className="bg-white/5 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[#BCFF4F]">commute</span>
              </div>
              <span className="text-[10px] font-bold text-[#BCFF4F]">-5%</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-[900] text-[#888888] tracking-widest">
                Transport
              </p>
              <h4 className="text-xl font-[900] mt-1">Rp 450k</h4>
              <p className="text-[10px] text-[#888888] mt-2">Bulan lalu: Rp 473k</p>
            </div>
          </div>

          {/* Entertainment */}
          <div className="bg-[#141414] rounded-lg p-6 border border-white/5 flex flex-col justify-between hover:bg-[#1C1B1B] transition-colors">
            <div className="flex justify-between items-start">
              <div className="bg-white/5 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[#BCFF4F]">movie</span>
              </div>
              <span className="text-[10px] font-bold text-[#BCFF4F]">-12%</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-[900] text-[#888888] tracking-widest">
                Entertainment
              </p>
              <h4 className="text-xl font-[900] mt-1">Rp 600k</h4>
              <p className="text-[10px] text-[#888888] mt-2">Bulan lalu: Rp 680k</p>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-[#141414] rounded-lg p-6 border border-white/5 flex flex-col justify-between hover:bg-[#1C1B1B] transition-colors">
            <div className="flex justify-between items-start">
              <div className="bg-white/5 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[#BCFF4F]">subscriptions</span>
              </div>
              <span className="text-[10px] font-bold text-[#888888]">STABIL</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-[900] text-[#888888] tracking-widest">
                Subskripsi
              </p>
              <h4 className="text-xl font-[900] mt-1">Rp 150k</h4>
              <p className="text-[10px] text-[#888888] mt-2">Bulan lalu: Rp 150k</p>
            </div>
          </div>
        </section>

        {/* AI Forecast Summary */}
        <section className="bg-[#141414] rounded-lg p-10 border-l-4 border-[#BCFF4F]">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#BCFF4F] p-2 rounded-full">
              <span className="material-symbols-outlined text-[#0A0A0A]">psychology</span>
            </div>
            <h3 className="text-2xl font-[900]">Cuan AI Insight</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <p className="text-xl leading-relaxed text-[#F4F4F0]">
                Hai Sobat Cuan! Berdasarkan data bulan April, pengeluaran kamu di kategori{' '}
                <span className="text-[#BCFF4F] font-bold">Food &amp; Drink</span> cenderung
                naik saat weekend sebesar 25%. Kami memprediksi bulan Mei kamu bisa menghemat
                hingga{' '}
                <span className="text-[#BCFF4F] font-bold">Rp 350.000</span> jika membatasi
                &apos;ngopi senja&apos; di hari kerja.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/budgeting">
                  <button className="bg-[#2A2A2A] text-[#F4F4F0] px-6 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all">
                    Atur Limit Makan
                  </button>
                </Link>
                <button className="bg-[#2A2A2A] text-[#F4F4F0] px-6 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all">
                  Lihat Detail Weekend
                </button>
                <button className="bg-[#2A2A2A] text-[#F4F4F0] px-6 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all">
                  Export Report
                </button>
              </div>
            </div>
            <div className="bg-[#0A0A0A] rounded-lg p-6 border border-white/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-[900] text-[#BCFF4F]">88%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                  Akurasi Prediksi AI
                </div>
              </div>
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-[#BCFF4F] w-[88%]" />
              </div>
              <p className="text-xs text-[#888888] leading-tight">
                Semakin banyak transaksi yang kamu catat, semakin tajam prediksi Cuan AI
                membantumu berhemat.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
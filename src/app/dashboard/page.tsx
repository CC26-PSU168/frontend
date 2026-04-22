import AppLayout from '@/components/layout/AppLayout';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <section className="mb-8">
        <h2 className="text-[56px] font-[900] tracking-[-0.04em] text-white leading-none">
          Dashboard.
        </h2>
        <p className="text-[#888888] text-lg mt-4 font-medium">
          Selamat datang kembali, Sobat Cuan! 👋
        </p>
      </section>

      {/* Placeholder content — will be built in Phase 2 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Saldo Card */}
        <div className="bg-[#BCFF4F] p-8 rounded-2xl">
          <p className="text-[#0A0A0A] font-bold text-[11px] tracking-widest uppercase">TOTAL SALDO</p>
          <h3 className="text-[#0A0A0A] text-4xl font-[900] tracking-[-0.04em] mt-2">Rp 2.350.000</h3>
          <p className="text-[#0A0A0A]/60 text-sm font-bold mt-4 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +12% vs bulan lalu
          </p>
        </div>

        {/* Pengeluaran Card */}
        <div className="bg-[#141414] p-8 rounded-2xl border border-[#BCFF4F]/10">
          <p className="text-[#888888] font-bold text-[11px] tracking-widest uppercase">PENGELUARAN BULAN INI</p>
          <h3 className="text-[#FF4F4F] text-4xl font-[900] tracking-[-0.04em] mt-2">Rp 2.150.000</h3>
          <p className="text-[#888888] text-sm font-bold mt-4">Terbesar: Makanan & Minuman</p>
        </div>

        {/* Health Score Card */}
        <div className="bg-[#141414] p-8 rounded-2xl border border-[#BCFF4F]/10">
          <p className="text-[#888888] font-bold text-[11px] tracking-widest uppercase">FINANCIAL HEALTH</p>
          <h3 className="text-[#BCFF4F] text-4xl font-[900] tracking-[-0.04em] mt-2">78/100</h3>
          <div className="mt-4 h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
            <div className="h-full bg-[#BCFF4F] w-[78%]" />
          </div>
        </div>
      </div>

      {/* AI Insight Placeholder */}
      <div className="bg-[#141414] p-8 rounded-2xl border-l-4 border-[#BCFF4F]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-[#BCFF4F] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#0A0A0A]">psychology</span>
          </div>
          <h4 className="text-xl font-[900] text-white">Cuan AI Insight</h4>
        </div>
        <p className="text-[#888888] leading-relaxed">
          Hai Sobat Cuan! Pengeluaran kamu untuk <span className="text-[#BCFF4F] font-bold">Makanan & Minuman</span> sudah mencapai 65% dari budget. 
          Pertimbangkan untuk meal prep di rumah untuk menghemat hingga <span className="text-[#BCFF4F] font-bold">Rp 350.000</span> bulan ini.
        </p>
      </div>
    </AppLayout>
  );
}

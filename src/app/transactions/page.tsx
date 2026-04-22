import AppLayout from '@/components/layout/AppLayout';

export const metadata = { title: 'Transaksi' };

export default function TransactionsPage() {
  return (
    <AppLayout>
      <section className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-[56px] font-[900] tracking-[-0.04em] text-white leading-none">Transaksi.</h2>
          <p className="text-[#888888] text-lg mt-4 font-medium">Riwayat pemasukan & pengeluaranmu</p>
        </div>
        <button className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-4 rounded-full font-[900] text-lg flex items-center gap-2 active:scale-95 transition-transform">
          Tambah Transaksi <span className="material-symbols-outlined">add</span>
        </button>
      </section>
      <div className="bg-[#141414] rounded-2xl p-12 border border-[#BCFF4F]/5 text-center">
        <span className="material-symbols-outlined text-6xl text-[#888888] mb-4">swap_horiz</span>
        <p className="text-[#888888] font-bold">Halaman ini akan diimplementasi di Phase 2</p>
      </div>
    </AppLayout>
  );
}

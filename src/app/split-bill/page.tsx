import AppLayout from '@/components/layout/AppLayout';

export const metadata = { title: 'Split Bill' };

export default function SplitBillPage() {
  return (
    <AppLayout>
      <section className="mb-12">
        <h2 className="text-[56px] font-[900] tracking-[-0.04em] text-white leading-none">Split Bill.</h2>
        <p className="text-[#888888] text-lg mt-4 font-medium">Bagi tagihan bersama teman</p>
      </section>
      <div className="bg-[#141414] rounded-2xl p-12 border border-[#BCFF4F]/5 text-center">
        <span className="material-symbols-outlined text-6xl text-[#888888] mb-4">call_split</span>
        <p className="text-[#888888] font-bold">Halaman ini akan diimplementasi di Phase 3</p>
      </div>
    </AppLayout>
  );
}

import AppLayout from '@/components/layout/AppLayout';

export const metadata = { title: 'Cuan AI' };

export default function ChatbotPage() {
  return (
    <AppLayout>
      <section className="mb-12">
        <h2 className="text-[56px] font-[900] tracking-[-0.04em] text-white leading-none">
          Cuan <span className="text-[#BCFF4F]">AI.</span>
        </h2>
        <p className="text-[#888888] text-lg mt-4 font-medium">Asisten keuangan pintar berbasis AI</p>
      </section>
      <div className="bg-[#141414] rounded-2xl p-12 border border-[#BCFF4F]/5 text-center">
        <span className="material-symbols-outlined text-6xl text-[#888888] mb-4">psychology</span>
        <p className="text-[#888888] font-bold">Halaman ini akan diimplementasi di Phase 6</p>
      </div>
    </AppLayout>
  );
}

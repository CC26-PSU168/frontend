import AppLayout from '@/components/layout/AppLayout';

export const metadata = { title: 'Profile & Settings' };

export default function ProfilePage() {
  return (
    <AppLayout>
      <section className="mb-12">
        <h2 className="text-[56px] font-[900] tracking-[-0.04em] text-white leading-none uppercase">Profile & Settings</h2>
        <div className="w-24 h-2 bg-[#BCFF4F] mt-4" />
      </section>
      <div className="bg-[#141414] rounded-2xl p-12 border border-[#BCFF4F]/5 text-center">
        <span className="material-symbols-outlined text-6xl text-[#888888] mb-4">settings</span>
        <p className="text-[#888888] font-bold">Halaman ini akan diimplementasi di Phase 7</p>
      </div>
    </AppLayout>
  );
}

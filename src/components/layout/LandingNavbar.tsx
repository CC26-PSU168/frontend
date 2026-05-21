import Link from 'next/link';

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl bg-black/70">
      <nav className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#BCFF4F]">account_balance_wallet</span>
          <span className="text-2xl font-[900] tracking-tighter text-[#F4F4F0]">Budgetly.</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-[#BCFF4F] font-bold border-b-2 border-[#BCFF4F] pb-1 uppercase text-xs tracking-widest" href="#features">Fitur</a>
          <a className="text-[#888888] font-medium hover:text-[#BCFF4F] transition-colors duration-300 uppercase text-xs tracking-widest" href="#edukasi">Edukasi</a>
          <a className="text-[#888888] font-medium hover:text-[#BCFF4F] transition-colors duration-300 uppercase text-xs tracking-widest" href="#komunitas">Komunitas</a>
        </div>
        <Link href="/auth/register" className="bg-[#BCFF4F] text-[#0A0A0A] px-6 py-2 rounded-full font-bold text-sm active:scale-90 transition-transform uppercase">
          Mulai Gratis
        </Link>
      </nav>
    </header>
  );
}

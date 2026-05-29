"use client";

import Link from 'next/link';
import LogoImage from '@/components/common/LogoImage';

type LandingNavbarProps = {
  activeSection?: string;
};

export default function LandingNavbar({ activeSection }: LandingNavbarProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl bg-black/70">
      <nav className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div 
          onClick={scrollToTop}
          className="flex items-center gap-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:drop-shadow-[0_0_12px_rgba(188,255,79,0.5)] cursor-pointer"
        >
          <LogoImage className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
          <span className="text-3xl md:text-4xl font-[900] tracking-tighter text-[#F4F4F0]">
            Budgetly.
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a onClick={(e) => handleScroll(e, 'features')} className={`cursor-pointer transition-colors duration-300 uppercase text-xs tracking-widest ${activeSection === 'fitur' || activeSection === 'features' ? 'text-[#BCFF4F] font-bold border-b-2 border-[#BCFF4F] pb-1' : 'text-[#888888] font-medium hover:text-[#BCFF4F]'}`}>Fitur</a>
          <a onClick={(e) => handleScroll(e, 'edukasi')} className={`cursor-pointer transition-colors duration-300 uppercase text-xs tracking-widest ${activeSection === 'edukasi' ? 'text-[#BCFF4F] font-bold border-b-2 border-[#BCFF4F] pb-1' : 'text-[#888888] font-medium hover:text-[#BCFF4F]'}`}>Edukasi</a>
          <a onClick={(e) => handleScroll(e, 'komunitas')} className={`cursor-pointer transition-colors duration-300 uppercase text-xs tracking-widest ${activeSection === 'komunitas' ? 'text-[#BCFF4F] font-bold border-b-2 border-[#BCFF4F] pb-1' : 'text-[#888888] font-medium hover:text-[#BCFF4F]'}`}>Komunitas</a>
          <a onClick={(e) => handleScroll(e, 'bantuan')} className={`cursor-pointer transition-colors duration-300 uppercase text-xs tracking-widest ${activeSection === 'bantuan' ? 'text-[#BCFF4F] font-bold border-b-2 border-[#BCFF4F] pb-1' : 'text-[#888888] font-medium hover:text-[#BCFF4F]'}`}>Bantuan</a>
        </div>
        <Link href="/auth/register" className="bg-[#BCFF4F] text-[#0A0A0A] px-6 py-2 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(188,255,79,0.3)] uppercase">
          Mulai Gratis
        </Link>
      </nav>
    </header>
  );
}

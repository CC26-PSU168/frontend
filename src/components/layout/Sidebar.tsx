'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { useUIStore } from '@/store/uiStore';
import LogoImage from '@/components/common/LogoImage';

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu, isDesktopSidebarOpen } = useUIStore();

  return (
    <aside className={`
      h-screen w-72 fixed left-0 top-0 border-r border-[#BCFF4F]/10 bg-[#0A0A0A] flex flex-col py-8 z-50 transition-transform duration-300
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      ${isDesktopSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="px-5 mb-12 mt-2 group">
        <Link href="/dashboard" className="flex items-center gap-3 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          <LogoImage className="w-15 h-15 rounded-full object-cover" />
          <div className="flex flex-col">
            <h1 className="text-3xl font-[900] tracking-[-0.04em] text-[#BCFF4F] leading-none mb-1">
              {APP_NAME}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#888888] font-bold leading-none">
              {APP_TAGLINE}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-6 py-4 flex items-center gap-4 transition-colors duration-200
                ${isActive
                  ? 'text-[#BCFF4F] font-bold border-l-4 border-[#BCFF4F] bg-[#141414]'
                  : 'text-[#888888] hover:bg-[#1C1B1B] hover:text-[#F4F4F0]'
                }
              `}
              onClick={closeMobileMenu}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Button */}
      {/* <div className="px-6 mb-8">
        <button className="w-full bg-[#BCFF4F] text-[#0A0A0A] font-bold py-4 rounded-full active:scale-95 transition-transform duration-200">
          Upgrade to Pro
        </button>
      </div> */}

      {/* Bottom Links */}
      <div className="border-t border-[#BCFF4F]/5 pt-4">
        <Link
          href="/profile"
          onClick={closeMobileMenu}
          className={`px-6 py-4 flex items-center gap-4 transition-colors ${
            pathname === '/profile'
              ? 'text-[#BCFF4F] font-bold border-l-4 border-[#BCFF4F] bg-[#141414]'
              : 'text-[#888888] hover:text-[#F4F4F0]'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-bold text-sm uppercase tracking-tighter">Settings</span>
        </Link>
        <button
          suppressHydrationWarning
          className="text-[#888888] px-6 py-4 flex items-center gap-4 hover:text-[#F4F4F0] transition-colors w-full"
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
          }}
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-bold text-sm uppercase tracking-tighter">Logout</span>
        </button>
      </div>
    </aside>
  );
}
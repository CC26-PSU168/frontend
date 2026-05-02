'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 border-r border-[#BCFF4F]/10 bg-[#0A0A0A] flex flex-col py-8 z-50">
      {/* Logo */}
      <div className="px-8 mb-12">
        <Link href="/dashboard">
          <h1 className="text-3xl font-[900] tracking-[-0.04em] text-[#BCFF4F]">
            {APP_NAME}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#888888] mt-1 font-bold">
            {APP_TAGLINE}
          </p>
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

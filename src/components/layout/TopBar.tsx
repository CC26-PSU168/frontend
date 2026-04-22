'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function TopBar() {
  const { user } = useAuthStore();

  return (
    <header className="flex justify-between items-center h-20 px-8 sticky top-0 bg-[#0A0A0A]/70 backdrop-blur-3xl z-40">
      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-[#141414] px-6 py-2 rounded-full border border-white/5">
        <span className="material-symbols-outlined text-[#888888]">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-bold text-[#F4F4F0] w-64 placeholder:text-[#888888]"
          placeholder="Search..."
          type="text"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Link
          href="#"
          className="text-[#F4F4F0] hover:text-[#BCFF4F] transition-all font-bold text-sm uppercase tracking-widest"
        >
          Support
        </Link>

        <div className="h-8 w-[1px] bg-white/10" />

        <button className="flex items-center gap-2 bg-[#BCFF4F] text-[#0A0A0A] px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Funds
        </button>

        {/* Notifications */}
        <div className="relative">
          <span className="material-symbols-outlined text-[#F4F4F0] cursor-pointer hover:text-[#BCFF4F] transition-colors">
            notifications
          </span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#BCFF4F] rounded-full" />
        </div>

        {/* User Avatar */}
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full border-2 border-[#BCFF4F] bg-[#2A2A2A] flex items-center justify-center overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-[#BCFF4F] font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

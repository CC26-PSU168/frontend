'use client';

import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isMobileMenuOpen, closeMobileMenu, isDesktopSidebarOpen } = useUIStore();
  const { fetchProfile, user } = useAuthStore();

  // Re-hydrate user session on every page load / navigation
  useEffect(() => {
    if (!user) {
      fetchProfile().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background Gears (decorative) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <span className="material-symbols-outlined animate-gear absolute top-20 left-[10%] text-[120px] text-white opacity-[0.06]">
          settings
        </span>
        <span className="material-symbols-outlined animate-gear-reverse absolute top-[40%] right-[5%] text-[200px] text-white opacity-[0.04]">
          settings
        </span>
        <span className="material-symbols-outlined animate-gear absolute bottom-[10%] left-[20%] text-[150px] text-white opacity-[0.05]">
          settings
        </span>
      </div>

      <Sidebar />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <main className={`min-h-screen relative z-10 transition-all duration-300 ${isDesktopSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
        <TopBar />
        <div className="p-4 md:p-8 pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}

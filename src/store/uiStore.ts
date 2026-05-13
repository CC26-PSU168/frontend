import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isDesktopSidebarOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleDesktopSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isDesktopSidebarOpen: true,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleDesktopSidebar: () => set((state) => ({ isDesktopSidebarOpen: !state.isDesktopSidebarOpen })),
}));

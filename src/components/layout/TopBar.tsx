'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification, Notification } from '@/hooks/useNotifications';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useUIStore } from '@/store/uiStore';

const NOTIF_ICON_MAP: Record<string, { icon: string; color: string }> = {
  BUDGET_ALERT: { icon: 'warning', color: 'text-red-500' },
  ANOMALY_DETECTED: { icon: 'troubleshoot', color: 'text-orange-500' },
  BILL_REMINDER: { icon: 'event_upcoming', color: 'text-sky-400' },
  SAVINGS_MILESTONE: { icon: 'emoji_events', color: 'text-yellow-400' },
  WEEKLY_REPORT: { icon: 'summarize', color: 'text-purple-400' },
  SYSTEM: { icon: 'info', color: 'text-[#BCFF4F]' },
};

export default function TopBar() {
  const { user } = useAuthStore();
  const { data: notifData } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotif = useDeleteNotification();
  const { toggleMobileMenu, toggleDesktopSidebar, isDesktopSidebarOpen } = useUIStore();

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  const handleNotificationClick = (n: Notification) => {
    if (!n.isRead) {
      markAsRead.mutate(n.id);
    }
  };

  const getNotifIcon = (type: string) => {
    const mapping = NOTIF_ICON_MAP[type] || { icon: 'notifications', color: 'text-white' };
    return <span className={`material-symbols-outlined ${mapping.color}`}>{mapping.icon}</span>;
  };

  return (
    <header className="flex justify-between items-center h-20 px-4 md:px-8 sticky top-0 bg-[#0A0A0A]/70 backdrop-blur-3xl z-40 gap-4">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden p-2 text-[#F4F4F0] hover:text-[#BCFF4F] transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Desktop Menu Button */}
      <button 
        onClick={toggleDesktopSidebar}
        className="hidden lg:block p-2 text-[#F4F4F0] hover:text-[#BCFF4F] transition-colors mr-2"
      >
        <span className="material-symbols-outlined">{isDesktopSidebarOpen ? 'menu_open' : 'menu'}</span>
      </button>

      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-4 bg-[#141414] px-6 py-2 rounded-full border border-white/5 flex-1 max-w-md">
        <span className="material-symbols-outlined text-[#888888]">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-bold text-[#F4F4F0] w-64 placeholder:text-[#888888]"
          placeholder="Search..."
          type="text"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <Link
          href="#"
          className="hidden md:block text-[#F4F4F0] hover:text-[#BCFF4F] transition-all font-bold text-sm uppercase tracking-widest"
        >
          Support
        </Link>

        <div className="hidden md:block h-8 w-[1px] bg-white/10" />

        <button className="hidden sm:flex items-center gap-2 bg-[#BCFF4F] text-[#0A0A0A] px-4 md:px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="hidden md:inline">Add Funds</span>
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="relative cursor-pointer">
              <span className="material-symbols-outlined text-[#F4F4F0] hover:text-[#BCFF4F] transition-colors">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-2.5 -right-3 min-w-[20px] h-5 bg-[#BCFF4F] rounded-full border-2 border-[#0A0A0A] flex items-center justify-center px-1">
                  <span className="text-[10px] font-[900] text-black leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] bg-[#141414] border border-[#BCFF4F]/15 rounded-2xl p-0 shadow-2xl overflow-hidden mt-4">
            <div className="p-4 flex justify-between items-center bg-[#1A1A1A] border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="font-[900] text-sm text-[#F4F4F0] tracking-widest uppercase">Notifikasi</span>
                {unreadCount > 0 && (
                  <span className="bg-[#BCFF4F] text-black text-[10px] font-[900] px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead.mutate()}
                  className="text-xs text-[#BCFF4F] hover:underline font-bold"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#888888] text-xs font-bold flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-3xl text-[#333]">notifications_off</span>
                  Belum ada notifikasi
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`group p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${n.isRead ? 'opacity-50' : 'bg-[#BCFF4F]/5'}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-sm font-bold truncate ${!n.isRead ? 'text-[#F4F4F0]' : 'text-[#888888]'}`}>{n.title}</h4>
                        <span className="text-[10px] text-[#888888] whitespace-nowrap shrink-0">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: id })}
                        </span>
                      </div>
                      <p className="text-xs text-[#888888] leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotif.mutate(n.id); }}
                      className="text-[#888888] hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100 self-center"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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

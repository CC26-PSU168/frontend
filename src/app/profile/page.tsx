'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useProfile, useUpdateProfile, useUpdatePassword, useUpdateNotifications, useDeleteAccount } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';
import { APP_NAME, APP_VERSION } from '@/lib/constants';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const updateNotifs = useUpdateNotifications();
  const deleteAccount = useDeleteAccount();

  // Local states for forms
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [monthlyAllowance, setMonthlyAllowance] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Initialize form when profile loads — using useEffect to avoid infinite re-renders
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setUniversity(profile.university || '');
      setMonthlyAllowance(profile.monthlyAllowance?.toString() || '');
    }
  }, [profile]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-[#888888] font-bold text-sm animate-pulse">Memuat profil...</div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) return <AppLayout><div /></AppLayout>;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        name,
        university,
        monthlyAllowance: Number(monthlyAllowance) || undefined,
      });
      toast.success('Profil berhasil diperbarui');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePassword.mutateAsync({ currentPassword, newPassword });
      toast.success('Password berhasil diubah');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/transactions/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Data transaksi berhasil di-export');
    } catch (error) {
      toast.error('Gagal mengekspor data');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync(profile.provider === 'CREDENTIALS' ? deletePassword : undefined);
      toast.success('Akun berhasil dihapus. Selamat tinggal!');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus akun');
    }
  };

  return (
    <AppLayout>
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-[900] tracking-[-0.04em] text-[#F4F4F0]">
          Profil & Pengaturan<span className="text-[#BCFF4F]">.</span>
        </h1>
        <p className="text-[#888888] mt-2 font-bold">Kelola data diri dan preferensi aplikasimu.</p>
      </div>

      {/* ===== Header Profil ===== */}
      <div className="bg-[#141414] border border-white/5 rounded-[24px] p-8 shadow-2xl flex items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full border-3 border-[#BCFF4F] bg-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-[#BCFF4F] font-[900] text-3xl">
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-[900] tracking-tight text-[#F4F4F0] truncate">{profile.name}</h2>
          <p className="text-[#888888] font-bold text-sm truncate">{profile.email}</p>
          {profile.university && (
            <p className="text-[#888888] text-xs mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">school</span>
              {profile.university}
            </p>
          )}
        </div>
        {/* Provider badge */}
        <div className={`px-4 py-2 rounded-full border font-bold text-xs uppercase tracking-widest shrink-0 ${
          profile.provider === 'GOOGLE' 
            ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' 
            : 'border-[#BCFF4F]/30 text-[#BCFF4F] bg-[#BCFF4F]/10'
        }`}>
          {profile.provider === 'GOOGLE' ? '🔗 Google' : '🔐 Credentials'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ===== Profile Form ===== */}
        <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl">
          <h2 className="text-xl font-[900] tracking-tight text-[#F4F4F0] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BCFF4F]">person</span>
            Informasi Pribadi
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2 block">Email</label>
              <Input value={profile.email} disabled className="bg-[#1A1A1A] border-none text-white/50 py-6" />
            </div>
            <div>
              <label className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2 block">Nama Lengkap</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-[#1A1A1A] border-none text-white py-6 focus:ring-1 focus:ring-[#BCFF4F]" 
                required 
              />
            </div>
            <div>
              <label className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2 block">Universitas</label>
              <Input 
                value={university} 
                onChange={(e) => setUniversity(e.target.value)} 
                className="bg-[#1A1A1A] border-none text-white py-6 focus:ring-1 focus:ring-[#BCFF4F]" 
              />
            </div>
            <div>
              <label className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2 block">Uang Bulanan (Target)</label>
              <Input 
                type="number"
                value={monthlyAllowance} 
                onChange={(e) => setMonthlyAllowance(e.target.value)} 
                className="bg-[#1A1A1A] border-none text-white py-6 focus:ring-1 focus:ring-[#BCFF4F]" 
              />
            </div>
            <Button type="submit" disabled={updateProfile.isPending} className="w-full bg-[#BCFF4F] text-black font-[900] py-6 rounded-xl hover:scale-[0.98] transition-all">
              {updateProfile.isPending ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
            </Button>
          </form>
        </div>

        <div className="space-y-8">
          {/* ===== Security Form ===== */}
          <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl">
            <h2 className="text-xl font-[900] tracking-tight text-[#F4F4F0] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF4F4F]">lock</span>
              Keamanan Akun
            </h2>
            {profile.provider === 'GOOGLE' ? (
              <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-center gap-4">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-8 h-8" />
                <div>
                  <p className="text-white font-bold text-sm">Terhubung dengan Google</p>
                  <p className="text-[#888888] text-xs">Password dikelola oleh Google.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <Input 
                    type="password"
                    placeholder="Password Saat Ini"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="bg-[#1A1A1A] border-none text-white py-6 focus:ring-1 focus:ring-[#BCFF4F]" 
                    required 
                  />
                </div>
                <div>
                  <Input 
                    type="password"
                    placeholder="Password Baru"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="bg-[#1A1A1A] border-none text-white py-6 focus:ring-1 focus:ring-[#BCFF4F]" 
                    required 
                  />
                </div>
                <Button type="submit" disabled={updatePassword.isPending} className="w-full border border-white/10 text-white font-[900] py-6 rounded-xl hover:bg-white/5 transition-all">
                  {updatePassword.isPending ? 'MENGUBAH...' : 'UBAH PASSWORD'}
                </Button>
              </form>
            )}
          </div>

          {/* ===== Preferences & Data ===== */}
          <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl">
            <h2 className="text-xl font-[900] tracking-tight text-[#F4F4F0] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#BCFF4F]">tune</span>
              Preferensi & Data
            </h2>
            
            <div className="space-y-4">
              {/* Budget Alert Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-bold text-sm">Peringatan Budget</h4>
                  <p className="text-[#888888] text-xs">Alert jika pengeluaran mendekati limit.</p>
                </div>
                <button 
                  onClick={() => updateNotifs.mutate({ notifBudgetAlert: !profile.notifBudgetAlert })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${profile.notifBudgetAlert ? 'bg-[#BCFF4F]' : 'bg-[#333]'}`}
                >
                  <div className={`w-4 h-4 bg-black rounded-full absolute top-1 transition-transform ${profile.notifBudgetAlert ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Weekly Report Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-bold text-sm">Laporan Mingguan</h4>
                  <p className="text-[#888888] text-xs">Dapatkan ringkasan pengeluaran mingguan.</p>
                </div>
                <button 
                  onClick={() => updateNotifs.mutate({ notifWeeklyReport: !profile.notifWeeklyReport })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${profile.notifWeeklyReport ? 'bg-[#BCFF4F]' : 'bg-[#333]'}`}
                >
                  <div className={`w-4 h-4 bg-black rounded-full absolute top-1 transition-transform ${profile.notifWeeklyReport ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Export CSV */}
              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-bold text-sm">Export Transaksi</h4>
                  <p className="text-[#888888] text-xs">Download semua riwayat dalam format CSV.</p>
                </div>
                <Button 
                  onClick={handleExportCSV}
                  className="bg-transparent border border-white/10 text-white hover:bg-white/5 font-bold"
                >
                  <span className="material-symbols-outlined mr-2 text-sm">download</span>
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tentang Aplikasi ===== */}
      <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl">
        <h2 className="text-xl font-[900] tracking-tight text-[#F4F4F0] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#BCFF4F]">info</span>
          Tentang Aplikasi
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">{APP_NAME} — {APP_VERSION}</p>
            <p className="text-[#888888] text-xs mt-1">Fintech dashboard untuk mahasiswa Indonesia.</p>
          </div>
          <div className="flex gap-4 text-xs text-[#888888]">
            <a href="#" className="hover:text-[#BCFF4F] transition-colors font-bold">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-[#BCFF4F] transition-colors font-bold">Kebijakan Privasi</a>
          </div>
        </div>
      </div>

      {/* ===== Danger Zone — Hapus Akun ===== */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-[24px] p-6">
        <h2 className="text-xl font-[900] tracking-tight text-red-400 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-red-400">warning</span>
          Zona Berbahaya
        </h2>
        <p className="text-[#888888] text-xs font-bold mb-4">
          Menghapus akun bersifat permanen. Seluruh data transaksi, budget, savings, dan split bill akan ikut terhapus.
        </p>
        <Button 
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-[900] py-5 px-6 rounded-full transition-all"
        >
          <span className="material-symbols-outlined mr-2">delete_forever</span>
          HAPUS AKUN SAYA
        </Button>
      </div>

      {/* ===== Delete Account Modal ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-red-500/20 rounded-[24px] p-8 w-full max-w-md shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
              </div>
              <h3 className="text-2xl font-[900] tracking-[-0.04em] text-white mb-3">Hapus Akun?</h3>
              <p className="text-[#888888] font-bold text-sm mb-6">
                Tindakan ini tidak bisa dibatalkan. Semua data akan dihapus secara permanen.
              </p>
              
              {profile.provider === 'CREDENTIALS' && (
                <div className="w-full mb-6">
                  <Input
                    type="password"
                    placeholder="Masukkan password untuk konfirmasi"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="bg-[#1A1A1A] border-none text-white py-6 focus:ring-1 focus:ring-red-500 w-full"
                  />
                </div>
              )}
              
              <div className="flex gap-4 w-full">
                <Button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                  disabled={deleteAccount.isPending}
                  className="flex-1 border border-white/10 text-white font-[900] py-4 rounded-full hover:bg-white/5 transition-all h-auto"
                >
                  BATAL
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteAccount.isPending || (profile.provider === 'CREDENTIALS' && !deletePassword)}
                  className="flex-1 bg-red-500 text-white font-[900] py-4 rounded-full hover:bg-red-600 transition-all h-auto disabled:opacity-50"
                >
                  {deleteAccount.isPending ? 'MENGHAPUS...' : 'HAPUS AKUN'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
  );
}

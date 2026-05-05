'use client';

import { useState } from 'react';
import { useProfile, useUpdateProfile, useUpdatePassword, useUpdateNotifications } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const updateNotifs = useUpdateNotifications();

  // Local states for forms
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [monthlyAllowance, setMonthlyAllowance] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Initialize form when profile loads
  if (profile && !name && !isLoading) {
    setName(profile.name);
    setUniversity(profile.university || '');
    setMonthlyAllowance(profile.monthlyAllowance?.toString() || '');
  }

  if (isLoading) {
    return <div className="p-8 text-[#F4F4F0]">Loading profile...</div>;
  }

  if (!profile) return null;

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

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-[900] tracking-[-0.04em] text-[#F4F4F0]">
          Profil & Pengaturan<span className="text-[#BCFF4F]">.</span>
        </h1>
        <p className="text-[#888888] mt-2 font-bold">Kelola data diri dan preferensi aplikasimu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Form */}
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
          {/* Security Form */}
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

          {/* Preferences & Data */}
          <div className="bg-[#141414] border border-white/5 rounded-[24px] p-6 shadow-2xl">
            <h2 className="text-xl font-[900] tracking-tight text-[#F4F4F0] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#BCFF4F]">tune</span>
              Preferensi & Data
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-bold text-sm">Notifikasi Peringatan Budget</h4>
                  <p className="text-[#888888] text-xs">Dapatkan alert jika pengeluaran mendekati limit.</p>
                </div>
                <button 
                  onClick={() => updateNotifs.mutate({ notifBudgetAlert: !profile.notifBudgetAlert })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${profile.notifBudgetAlert ? 'bg-[#BCFF4F]' : 'bg-[#333]'}`}
                >
                  <div className={`w-4 h-4 bg-black rounded-full absolute top-1 transition-transform ${profile.notifBudgetAlert ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-bold text-sm">Export Data Transaksi</h4>
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
    </div>
  );
}

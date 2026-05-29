'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useSavingsGoals, useCreateGoal, useDeposit, useDeleteGoal } from '@/hooks/useSavings';
import { formatIDR } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import SearchableSection from '@/components/common/SearchableSection';
import { toast } from 'sonner';

export default function SavingsPage() {
  const { data: goals, isLoading } = useSavingsGoals();
  const createMutation = useCreateGoal();
  const depositMutation = useDeposit();
  const deleteMutation = useDeleteGoal();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState<string | null>(null);

  // Add goal form
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Deposit form
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  const totalSaved = goals?.reduce((sum, g) => sum + g.currentAmount, 0) || 0;
  const totalTarget = goals?.reduce((sum, g) => sum + g.targetAmount, 0) || 0;
  const totalPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleCreateGoal = async () => {
    if (!goalName || !goalTarget) return;
    try {
      await createMutation.mutateAsync({
        name: goalName,
        targetAmount: parseFloat(goalTarget),
        deadline: goalDeadline || null,
      });
      toast.success('Goal berhasil ditambahkan!');
      setShowAddModal(false);
      setGoalName('');
      setGoalTarget('');
      setGoalDeadline('');
    } catch {
      toast.error('Gagal menambahkan goal');
    }
  };

  const handleDeposit = async () => {
    if (!showDepositModal || !depositAmount) return;
    try {
      await depositMutation.mutateAsync({
        goalId: showDepositModal,
        amount: parseFloat(depositAmount),
        note: depositNote || undefined,
      });
      toast.success('Dana berhasil ditambahkan!');
      setShowDepositModal(null);
      setDepositAmount('');
      setDepositNote('');
    } catch {
      toast.error('Gagal menambahkan dana');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Goal berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus goal');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mb-12">
          <Skeleton className="h-14 w-80 bg-[#2A2A2A] mb-4" />
          <Skeleton className="h-6 w-64 bg-[#2A2A2A]" />
        </div>
        <Skeleton className="h-64 w-full bg-[#1C1B1B] rounded-[2rem] mb-12" />
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-[480px] bg-[#1C1B1B] rounded-[2rem]" />
          <Skeleton className="h-[240px] bg-[#1C1B1B] rounded-[2rem]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-4xl md:text-[56px] font-[900] tracking-[-0.04em] leading-none text-white break-all sm:break-normal">Target Tabungan.</h2>
          <p className="text-[#888888] text-base md:text-lg mt-4 font-medium italic">
            {formatIDR(totalSaved)} terkumpul dari semua goal
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#BCFF4F] text-[#0A0A0A] px-8 md:px-10 py-4 md:py-5 rounded-full font-[900] tracking-[-0.04em] text-base md:text-lg hover:bg-[#99D929] transition-colors flex items-center justify-center gap-2 w-full md:w-auto h-auto whitespace-nowrap"
        >
          Tambah Goal <span className="material-symbols-outlined font-black">add</span>
        </button>
      </section>

      {/* Hero Card */}
      <section className="mb-12">
        <div className="bg-[#BCFF4F] rounded-[2rem] p-6 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[#0A0A0A] font-bold text-xs tracking-[0.2em] uppercase mb-4 block">TOTAL TERSIMPAN</span>
            <h3 className="text-5xl md:text-[84px] font-[900] tracking-[-0.04em] text-[#0A0A0A] leading-none mb-4 md:mb-8 truncate">{formatIDR(totalSaved)}</h3>
            <div className="w-full bg-[#0A0A0A]/10 h-3 rounded-full overflow-hidden max-w-2xl">
              <div className="bg-[#0A0A0A] h-full transition-all duration-700" style={{ width: `${Math.min(totalPercentage, 100)}%` }} />
            </div>
            <p className="text-[#0A0A0A] font-bold mt-4 uppercase text-sm tracking-tighter">
              {totalPercentage}% Terisi dari target total
            </p>
          </div>
          <div className="relative z-10 text-left md:text-right mt-8 md:mt-0">
            <span className="text-7xl md:text-[120px] font-[900] tracking-[-0.04em] text-[#0A0A0A] leading-none block">{totalPercentage}%</span>
            <span className="text-[#0A0A0A] font-bold text-sm tracking-widest block opacity-60">
              {totalPercentage >= 80 ? 'HAMPIR TERCAPAI' : 'ON TRACK'}
            </span>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#0A0A0A]/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
        </div>
      </section>

      {/* Goal Cards Grid */}
      <SearchableSection
        id="savings-goals"
        title="Target Tabungan"
        subtitle="Kelola semua goal tabunganmu di sini"
      >
        {goals && goals.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-16">
          {goals.map((goal, index) => {
            const circumference = 2 * Math.PI * 40;
            const strokeOffset = circumference - (goal.percentage / 100) * circumference;
            const isCompleted = goal.isCompleted;

            // Featured card for the first item (tall)
            if (index === 0) {
              return (
                <div
                  key={goal.id}
                  className="bg-[#141414] rounded-[2rem] p-10 flex flex-col justify-between h-[480px] border border-[#BCFF4F]/5 hover:border-[#BCFF4F]/20 transition-all group relative"
                >
                  <button onClick={() => handleDeleteGoal(goal.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#888888] hover:text-red-400">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-[#BCFF4F]/10 text-[#BCFF4F] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4 inline-block">
                        {isCompleted ? '✅ Tercapai!' : 'Aktif'}
                      </span>
                      <h4 className="text-4xl font-[900] tracking-[-0.04em] text-white">{goal.name}</h4>
                      <p className="text-[#888888] mt-2 font-medium">Target: {formatIDR(goal.targetAmount)}</p>
                    </div>
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="#0A0A0A" strokeWidth="8" />
                        <circle
                          cx="48" cy="48" r="40" fill="transparent"
                          stroke="#BCFF4F" strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffset}
                          className="transition-all duration-700"
                        />
                      </svg>
                      <span className="absolute text-[#BCFF4F] font-black text-xl">{goal.percentage}%</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-[32px] font-[900] tracking-[-0.04em] text-white">{formatIDR(goal.currentAmount)}</span>
                      <span className="text-[#888888] font-bold text-sm">{formatIDR(goal.targetAmount - goal.currentAmount)} LEFT</span>
                    </div>
                    <button
                      onClick={() => setShowDepositModal(goal.id)}
                      className="w-full border-2 border-[#BCFF4F] text-[#BCFF4F] py-4 rounded-full font-bold hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all"
                    >
                      Top Up Goal
                    </button>
                  </div>
                </div>
              );
            }

            // Compact cards for the rest
            return (
              <div
                key={goal.id}
                className={`${
                  isCompleted
                    ? 'bg-[#BCFF4F] border-[#BCFF4F] shadow-[0_0_50px_rgba(188,255,79,0.15)]'
                    : 'bg-[#141414] border-[#BCFF4F]/5 hover:border-[#BCFF4F]/20'
                } rounded-[2rem] p-6 sm:p-8 border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center group relative gap-4 sm:gap-0`}
              >
                <button onClick={() => handleDeleteGoal(goal.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`material-symbols-outlined text-sm ${isCompleted ? 'text-[#0A0A0A]/40 hover:text-red-600' : 'text-[#888888] hover:text-red-400'}`}>delete</span>
                </button>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${isCompleted ? 'text-[#0A0A0A]/60' : 'text-[#888888]'}`}>
                    {isCompleted ? '✅ Tercapai' : 'Aktif'}
                  </span>
                  <h4 className={`text-3xl font-[900] tracking-[-0.04em] ${isCompleted ? 'text-[#0A0A0A]' : 'text-white'}`}>{goal.name}</h4>
                  <p className={`text-sm mt-1 ${isCompleted ? 'text-[#0A0A0A]/60' : 'text-[#888888]'}`}>
                    {formatIDR(goal.currentAmount)} / {formatIDR(goal.targetAmount)}
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                  <span className={`text-5xl font-[900] tracking-[-0.04em] block ${isCompleted ? 'text-[#0A0A0A] opacity-30' : 'text-[#BCFF4F]'}`}>
                    {goal.percentage}%
                  </span>
                  {!isCompleted && (
                    <button
                      onClick={() => setShowDepositModal(goal.id)}
                      className="mt-2 text-[#BCFF4F] text-xs font-bold uppercase tracking-widest hover:underline"
                    >
                      Top Up →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="bg-[#141414] rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border border-[#BCFF4F]/15 mb-16">
          <span className="material-symbols-outlined text-[#888888] text-6xl mb-4">savings</span>
          <h4 className="text-2xl font-[900] text-white mb-2">Belum Ada Goals</h4>
          <p className="text-[#888888] mb-8">Mulai rencanakan tabunganmu!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-4 rounded-full font-black"
          >
            Buat Goal Pertama
          </button>
        </section>
      )}
      </SearchableSection>

      {/* Progres Menabung Section */}
      <SearchableSection
        id="savings-progress"
        title="Progres Menabung"
        subtitle="Tips dan insights untuk membantumu mencapai target"
      >
        <div className="bg-[#141414] rounded-[2rem] p-12 relative overflow-hidden border border-[#BCFF4F]/15">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#BCFF4F] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0A0A0A] font-black">psychology</span>
            </div>
            <h3 className="text-3xl font-[900] tracking-[-0.04em] text-white">AI Saving Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="bg-[#0A0A0A] p-8 rounded-[1rem] border-l-4 border-[#BCFF4F] flex gap-6 items-start">
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl">lightbulb</span>
              <div>
                <h5 className="text-xl font-[900] tracking-[-0.04em] text-white mb-2">Optimalkan Pengeluaran</h5>
                <p className="text-[#888888] leading-relaxed">
                  Tips AI akan tersedia setelah kamu memiliki cukup data transaksi. Mulai catat pengeluaranmu untuk mendapatkan <span className="text-[#BCFF4F]">rekomendasi personal</span>.
                </p>
              </div>
            </div>
            <div className="bg-[#0A0A0A] p-8 rounded-[1rem] border-l-4 border-[#BCFF4F] flex gap-6 items-start">
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl">trending_up</span>
              <div>
                <h5 className="text-xl font-[900] tracking-[-0.04em] text-white mb-2">Konsistensi Menabung</h5>
                <p className="text-[#888888] leading-relaxed">
                  Menabung secara rutin, meskipun nominal kecil, akan membantu kamu mencapai <span className="text-[#BCFF4F]">goal lebih cepat</span>.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#BCFF4F]/5 rounded-full blur-[100px]" />
        </div>
      </SearchableSection>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#141414] w-full max-w-lg rounded-[2rem] p-10 border border-[#BCFF4F]/15" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-[900] text-white mb-8">Buat Goal Baru</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Nama Goal</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Contoh: Beli Laptop"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Target (Rp)</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="Contoh: 5000000"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Deadline (Opsional)</label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 border border-[#BCFF4F]/30 text-[#BCFF4F] py-4 rounded-full font-bold hover:bg-[#BCFF4F]/10 transition-all">
                  Batal
                </button>
                <button onClick={handleCreateGoal} disabled={createMutation.isPending} className="flex-1 bg-[#BCFF4F] text-[#0A0A0A] py-4 rounded-full font-black hover:scale-95 transition-transform disabled:opacity-50">
                  {createMutation.isPending ? 'Menyimpan...' : 'Buat Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center" onClick={() => setShowDepositModal(null)}>
          <div className="bg-[#141414] w-full max-w-lg rounded-[2rem] p-10 border border-[#BCFF4F]/15" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-[900] text-white mb-8">Tambah Dana</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Nominal (Rp)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Contoh: 100000"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Catatan (Opsional)</label>
                <input
                  type="text"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="Contoh: Dari uang jajan"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowDepositModal(null)} className="flex-1 border border-[#BCFF4F]/30 text-[#BCFF4F] py-4 rounded-full font-bold hover:bg-[#BCFF4F]/10 transition-all">
                  Batal
                </button>
                <button onClick={handleDeposit} disabled={depositMutation.isPending} className="flex-1 bg-[#BCFF4F] text-[#0A0A0A] py-4 rounded-full font-black hover:scale-95 transition-transform disabled:opacity-50">
                  {depositMutation.isPending ? 'Menyimpan...' : 'Tambah Dana'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

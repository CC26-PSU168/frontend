'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useBudgetOverview, useCreateBudget, useDeleteBudget } from '@/hooks/useBudgets';
import { useScheduledPayments, useCreateScheduledPayment, useDeleteScheduledPayment, useMarkPaidScheduledPayment } from '@/hooks/useScheduledPayments';
import { formatIDR } from '@/lib/formatters';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function BudgetingPage() {
  const now = new Date();
  const [activeTab, setActiveTab] = useState<'budget' | 'calendar'>('budget');
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: overview, isLoading: isBudgetLoading } = useBudgetOverview(month, year);
  const { data: scheduledPayments, isLoading: isPaymentsLoading } = useScheduledPayments();
  
  const createMutation = useCreateBudget();
  const deleteMutation = useDeleteBudget();
  
  const createPaymentMutation = useCreateScheduledPayment();
  const deletePaymentMutation = useDeleteScheduledPayment();
  const markPaidMutation = useMarkPaidScheduledPayment();

  // Add budget modal state
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  // Add scheduled payment modal state
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentName, setPaymentName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCategory, setPaymentCategory] = useState('');
  const [paymentDueDay, setPaymentDueDay] = useState('');

  const handleAddBudget = async () => {
    if (!newCategory || !newLimit) return;
    try {
      await createMutation.mutateAsync({
        category: newCategory,
        limitAmount: parseFloat(newLimit),
        month,
        year,
      });
      toast.success('Budget berhasil ditambahkan!');
      setShowAddModal(false);
      setNewCategory('');
      setNewLimit('');
    } catch {
      toast.error('Gagal menambahkan budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Budget berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus budget');
    }
  };

  const handleAddPayment = async () => {
    if (!paymentName || !paymentAmount || !paymentCategory || !paymentDueDay) return;
    try {
      await createPaymentMutation.mutateAsync({
        name: paymentName,
        amount: parseFloat(paymentAmount),
        category: paymentCategory,
        dueDay: parseInt(paymentDueDay, 10),
        frequency: 'MONTHLY',
      });
      toast.success('Tagihan berhasil ditambahkan!');
      setShowAddPaymentModal(false);
      setPaymentName('');
      setPaymentAmount('');
      setPaymentCategory('');
      setPaymentDueDay('');
    } catch {
      toast.error('Gagal menambahkan tagihan');
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await deletePaymentMutation.mutateAsync(id);
      toast.success('Tagihan berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus tagihan');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaidMutation.mutateAsync(id);
      toast.success('Tagihan berhasil ditandai lunas! Transaksi pengeluaran otomatis tercatat.');
    } catch {
      toast.error('Gagal menandai tagihan lunas');
    }
  };

  // Calendar data
  const calendarDays = (() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const totalDays = lastDay.getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  })();

  const getCategoryIcon = (category: string) => {
    return TRANSACTION_CATEGORIES.find((c) => c.value === category)?.icon || 'category';
  };

  if (isBudgetLoading || isPaymentsLoading) {
    return (
      <AppLayout>
        <div className="mb-12">
          <Skeleton className="h-14 w-64 bg-[#2A2A2A] mb-4" />
          <Skeleton className="h-6 w-48 bg-[#2A2A2A]" />
        </div>
        <Skeleton className="h-64 w-full bg-[#1C1B1B] rounded-[2rem] mb-12" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-80 bg-[#1C1B1B] rounded-[2rem]" />
          <Skeleton className="h-80 bg-[#1C1B1B] rounded-[2rem]" />
          <Skeleton className="h-80 bg-[#1C1B1B] rounded-[2rem]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header Section */}
      <section className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-[56px] font-[900] tracking-[-0.04em] leading-tight text-white">Budgeting.</h2>
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-[#1C1B1B] text-[#BCFF4F] text-[10px] font-bold rounded uppercase tracking-tighter">
              {SHORT_MONTHS[month - 1]} {year}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#141414] p-1 rounded-full">
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'budget' ? 'bg-[#BCFF4F] text-[#0A0A0A]' : 'text-[#888888] hover:text-white'
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'calendar' ? 'bg-[#BCFF4F] text-[#0A0A0A]' : 'text-[#888888] hover:text-white'
              }`}
            >
              Kalender
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#BCFF4F] text-[#0A0A0A] px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:scale-95 transition-transform"
          >
            Tambah Kategori <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>
      </section>

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div>
          {/* Overview Card */}
          <div className="w-full bg-[#BCFF4F] rounded-[2rem] p-12 flex flex-col md:flex-row justify-between items-center mb-12 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#0A0A0A]/5 rounded-full blur-3xl" />
            <div className="flex-1 w-full md:w-auto">
              <span className="text-[#0A0A0A] text-[11px] font-black uppercase tracking-[0.2em] block mb-2">
                BUDGET BULAN INI
              </span>
              <h3 className="text-[#0A0A0A] text-[64px] font-[900] tracking-[-0.04em] leading-none mb-8">
                {formatIDR(overview?.totalBudget || 0)}
              </h3>
              <div className="w-full max-w-md h-2 bg-[#0A0A0A]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A0A0A] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(overview?.percentage || 0, 100)}%` }}
                />
              </div>
              <p className="text-[#0A0A0A] text-xs font-bold mt-4 uppercase tracking-widest">
                Terpakai: {formatIDR(overview?.totalSpent || 0)} ({overview?.percentage || 0}%)
              </p>
            </div>
            <div className="flex flex-col items-end mt-8 md:mt-0">
              <span className="text-[#0A0A0A] text-[100px] font-[900] tracking-[-0.06em] leading-none opacity-90">
                {overview?.percentage || 0}%
              </span>
              <p className="text-[#0A0A0A] text-sm font-black -mt-4 uppercase tracking-tighter italic">
                {(overview?.percentage || 0) >= 100
                  ? 'OVERBUDGET!'
                  : (overview?.percentage || 0) >= 80
                    ? `Warning: ${100 - (overview?.percentage || 0)}% sisa`
                    : `${100 - (overview?.percentage || 0)}% sisa`
                }
              </p>
            </div>
          </div>

          {/* Bento Category Grid */}
          {overview?.categories && overview.categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overview.categories.map((budget, index) => {
                const isOverbudget = budget.percentage >= 100;
                const isFirstOrFull = index === 0 || overview.categories.length <= 2;

                if (isOverbudget) {
                  // White card for overbudget
                  return (
                    <div
                      key={budget.id}
                      className="md:col-span-1 bg-white rounded-[2rem] p-10 flex flex-col justify-between min-h-[340px] relative group"
                    >
                      <button onClick={() => handleDeleteBudget(budget.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0A0A0A]/40 hover:text-red-500">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="material-symbols-outlined text-[#0A0A0A] text-3xl">{getCategoryIcon(budget.category)}</span>
                          <span className="bg-[#0A0A0A] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                            OVERBUDGET
                          </span>
                        </div>
                        <h4 className="text-2xl font-[900] text-[#0A0A0A] mt-6">{budget.category}</h4>
                      </div>
                      <div>
                        <div className="text-4xl font-[900] text-[#0A0A0A] leading-tight">{formatIDR(budget.spent)}</div>
                        <p className="text-red-600 font-black text-[10px] uppercase mt-1 tracking-tighter">
                          +{formatIDR(budget.spent - budget.limitAmount)} dari limit
                        </p>
                      </div>
                    </div>
                  );
                }

                // Full-width dark card for first item
                if (isFirstOrFull) {
                  return (
                    <div
                      key={budget.id}
                      className="md:col-span-3 bg-[#141414] rounded-[2rem] p-10 border border-[#BCFF4F]/15 flex flex-col md:flex-row justify-between items-center group hover:bg-[#1C1B1B] transition-all relative"
                    >
                      <button onClick={() => handleDeleteBudget(budget.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#888888] hover:text-red-400">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-full bg-[#BCFF4F]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[#BCFF4F] text-4xl">{getCategoryIcon(budget.category)}</span>
                        </div>
                        <div>
                          <h4 className="text-3xl font-[900] text-white">{budget.category}</h4>
                          <p className="text-[#888888] font-bold mt-1">{budget.percentage}% terpakai</p>
                        </div>
                      </div>
                      <div className="text-right mt-6 md:mt-0">
                        <div className="text-4xl font-[900] text-[#BCFF4F]">{formatIDR(budget.spent)}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#888888] mt-1">
                          Target: {formatIDR(budget.limitAmount)}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard dark card
                return (
                  <div
                    key={budget.id}
                    className={`${index % 3 === 1 ? 'md:col-span-1' : 'md:col-span-2'} bg-[#141414] rounded-[2rem] p-10 border border-[#BCFF4F]/15 flex flex-col justify-between min-h-[280px] group relative`}
                  >
                    <button onClick={() => handleDeleteBudget(budget.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#888888] hover:text-red-400">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <div className="flex justify-between">
                      <div>
                        <span className="material-symbols-outlined text-[#BCFF4F] text-3xl">{getCategoryIcon(budget.category)}</span>
                        <h4 className="text-3xl font-[900] text-white mt-6">{budget.category}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-black text-[#888888] uppercase tracking-widest mb-1">PROGRESS</div>
                        <div className="text-2xl font-[900] text-[#BCFF4F]">{budget.percentage}%</div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-4xl font-[900] text-white">{formatIDR(budget.spent)}</div>
                        <p className="text-[#888888] font-bold text-xs mt-1">Sisa: {formatIDR(budget.remaining)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#141414] rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border border-[#BCFF4F]/15">
              <span className="material-symbols-outlined text-[#888888] text-6xl mb-4">account_balance_wallet</span>
              <h4 className="text-2xl font-[900] text-white mb-2">Belum Ada Budget</h4>
              <p className="text-[#888888] mb-8">Mulai atur anggaran bulananmu dengan menambah kategori budget.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-4 rounded-full font-black"
              >
                Tambah Budget Pertama
              </button>
            </div>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-[#141414] rounded-[2rem] p-8 border border-[#BCFF4F]/15 overflow-hidden relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-[900] text-white">{MONTH_NAMES[month - 1]} {year}</h3>
              <button
                onClick={() => setShowAddPaymentModal(true)}
                className="bg-[#1C1B1B] text-[#BCFF4F] px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#2A2A2A] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span> Tambah Tagihan
              </button>
            </div>
            <div className="grid grid-cols-7 gap-px bg-[#BCFF4F]/5 rounded-xl overflow-hidden">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
                <div key={d} className="bg-[#1C1B1B] p-4 text-center text-[10px] font-black text-[#888888] uppercase tracking-widest">
                  {d}
                </div>
              ))}
              {calendarDays.map((day, i) => {
                const dayPayments = day ? scheduledPayments?.filter(p => p.dueDay === day) || [] : [];
                return (
                  <div
                    key={i}
                    className={`bg-[#141414] min-h-[100px] p-3 text-sm font-bold flex flex-col gap-1 ${
                      day ? 'text-white' : 'text-[#333]'
                    } ${day === now.getDate() ? 'ring-1 ring-inset ring-[#BCFF4F] bg-[#1C1B1B]' : ''}`}
                  >
                    <span>{day || ''}</span>
                    {dayPayments.map((p) => (
                      <div key={p.id} className="text-[10px] bg-[#BCFF4F]/10 text-[#BCFF4F] px-2 py-1 rounded truncate flex items-center gap-1 group relative">
                        <span className="material-symbols-outlined text-[10px]">{getCategoryIcon(p.category)}</span>
                        {p.name}
                        <button onClick={(e) => { e.stopPropagation(); handleDeletePayment(p.id); }} className="absolute right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-1 bg-[#141414] rounded-[2rem] p-8 border border-[#BCFF4F]/15 flex flex-col">
            <h5 className="text-white font-[900] uppercase text-[11px] tracking-widest mb-6">Daftar Tagihan</h5>
            {scheduledPayments && scheduledPayments.length > 0 ? (
              <div className="space-y-4 overflow-y-auto pr-2">
                {scheduledPayments.map(p => (
                  <div key={p.id} className="bg-[#1C1B1B] p-4 rounded-xl border border-white/5 relative group">
                    <button onClick={() => handleDeletePayment(p.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[#888888] hover:text-red-400">
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#BCFF4F] text-sm">{getCategoryIcon(p.category)}</span>
                        <span className="font-bold text-white text-sm">{p.name}</span>
                      </div>
                    </div>
                    <div className="text-[#BCFF4F] font-black">{formatIDR(p.amount)}</div>
                    <div className="text-[#888888] text-[10px] font-bold uppercase tracking-widest mt-2">Tiap Tgl {p.dueDay}</div>
                    <button
                      onClick={() => handleMarkPaid(p.id)}
                      disabled={markPaidMutation.isPending}
                      className="w-full mt-3 bg-[#BCFF4F]/10 text-[#BCFF4F] py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#BCFF4F] hover:text-[#0A0A0A] transition-all disabled:opacity-50"
                    >
                      ✓ Tandai Lunas
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#888888] text-sm italic">Belum ada tagihan terjadwal. Tambahkan tagihan seperti uang kos atau internet bulanan.</p>
            )}
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#141414] w-full max-w-lg rounded-[2rem] p-10 border border-[#BCFF4F]/15" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-[900] text-white mb-8">Tambah Budget</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                >
                  <option value="">Pilih kategori...</option>
                  {TRANSACTION_CATEGORIES.filter((c) => c.value !== 'Uang Saku' && c.value !== 'Freelance').map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Limit Bulanan</label>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  placeholder="Contoh: 500000"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-[#BCFF4F]/30 text-[#BCFF4F] py-4 rounded-full font-bold hover:bg-[#BCFF4F]/10 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddBudget}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#BCFF4F] text-[#0A0A0A] py-4 rounded-full font-black hover:scale-95 transition-transform disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Scheduled Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center" onClick={() => setShowAddPaymentModal(false)}>
          <div className="bg-[#141414] w-full max-w-lg rounded-[2rem] p-10 border border-[#BCFF4F]/15" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-[900] text-white mb-8">Tambah Tagihan</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Nama Tagihan</label>
                <input
                  type="text"
                  value={paymentName}
                  onChange={(e) => setPaymentName(e.target.value)}
                  placeholder="Contoh: Uang Kos"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Nominal</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Rp 0"
                  className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Kategori</label>
                  <select
                    value={paymentCategory}
                    onChange={(e) => setPaymentCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                  >
                    <option value="">Kategori...</option>
                    {TRANSACTION_CATEGORIES.filter((c) => c.value !== 'Uang Saku' && c.value !== 'Freelance').map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Tanggal Jatuh Tempo</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={paymentDueDay}
                    onChange={(e) => setPaymentDueDay(e.target.value)}
                    placeholder="Tgl 1-31"
                    className="w-full bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:border-[#BCFF4F]"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="flex-1 border border-[#BCFF4F]/30 text-[#BCFF4F] py-4 rounded-full font-bold hover:bg-[#BCFF4F]/10 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={createPaymentMutation.isPending}
                  className="flex-1 bg-[#BCFF4F] text-[#0A0A0A] py-4 rounded-full font-black hover:scale-95 transition-transform disabled:opacity-50"
                >
                  {createPaymentMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

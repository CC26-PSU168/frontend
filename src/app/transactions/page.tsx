'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import TransactionFilter from '@/components/transactions/TransactionFilter';
import TransactionList from '@/components/transactions/TransactionList';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import SearchableSection from '@/components/common/SearchableSection';
import { useTransactions, useTransactionSummary, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useTransactions';
import { formatIDR } from '@/lib/formatters';
import { toast } from 'sonner';
import type { Transaction, TransactionFilters } from '@/types/transaction';
import type { TransactionFormData } from '@/validators/transactionSchema';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function TransactionsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || undefined;

  const now = new Date();
  // AFTER — no useEffect needed, search is already in the initial state
  const [filters, setFilters] = useState<TransactionFilters>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    page: 1,
    limit: 20,
    search: search ?? undefined,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const { data, isLoading } = useTransactions(filters);
  const { data: summary } = useTransactionSummary(filters.month, filters.year);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleFilterChange = useCallback((partial: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleMonthNav = (dir: -1 | 1) => {
    setFilters((prev) => {
      let m = (prev.month || now.getMonth() + 1) + dir;
      let y = prev.year || now.getFullYear();
      if (m < 1) { m = 12; y -= 1; }
      if (m > 12) { m = 1; y += 1; }
      return { ...prev, month: m, year: y, page: 1 };
    });
  };

  const handleOpenCreate = () => { setEditingTx(null); setModalOpen(true); };
  const handleItemClick = (tx: Transaction) => { setEditingTx(tx); setModalOpen(true); };

  const handleSubmit = async (formData: TransactionFormData) => {
    try {
      if (editingTx) {
        await updateMutation.mutateAsync({ id: editingTx.id, data: formData });
        toast.success('Transaksi berhasil diperbarui');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Transaksi berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditingTx(null);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal menyimpan transaksi');
      } else {
        toast.error('Gagal menyimpan transaksi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Transaksi berhasil dihapus');
      setModalOpen(false);
      setEditingTx(null);
    } catch {
      toast.error('Gagal menghapus transaksi');
    }
  };

  const totalPages = data?.pagination.totalPages || 1;
  const currentMonth = filters.month || now.getMonth() + 1;
  const currentYear = filters.year || now.getFullYear();
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

  return (
    <AppLayout>
      {/* TOP ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <h2 className="text-[40px] font-black text-[#F4F4F0] tracking-[-0.04em] leading-none">
            Transaksi.
          </h2>
          <div className="flex items-center gap-6 text-[#888888] font-bold text-base">
            <button onClick={() => handleMonthNav(-1)} className="material-symbols-outlined text-[#BCFF4F] hover:scale-110 transition-transform">
              arrow_back_ios
            </button>
            <span>{MONTH_NAMES[prevMonth - 1]}</span>
            <span className="text-[#F4F4F0] text-lg">{MONTH_NAMES[currentMonth - 1]} {currentYear}</span>
            <span>{MONTH_NAMES[nextMonth - 1]}</span>
            <button onClick={() => handleMonthNav(1)} className="material-symbols-outlined text-[#BCFF4F] hover:scale-110 transition-transform">
              arrow_forward_ios
            </button>
          </div>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#BCFF4F] text-[#0A0A0A] font-bold py-3 md:py-4 px-8 rounded-full flex items-center justify-center gap-2 active:scale-95 duration-150 uppercase text-sm tracking-wider hover:bg-[#a8e640] w-full md:w-auto h-auto whitespace-nowrap"
        >
          Tambah Transaksi
          <span className="material-symbols-outlined text-base">add</span>
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Pemasukan - lime */}
        <div className="bg-[#BCFF4F] p-8 rounded-lg flex flex-col justify-between h-[180px]">
          <span className="text-[#0A0A0A] font-bold text-xs tracking-widest uppercase opacity-70">TOTAL PEMASUKAN</span>
          <div>
            <h3 className="text-[#0A0A0A] text-3xl md:text-4xl font-black tracking-tighter truncate">{summary ? formatIDR(summary.income) : 'Rp 0'}</h3>
            {summary && summary.incomeChange !== 0 && (
              <p className="text-[#0A0A0A] font-bold text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  {summary.incomeChange >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                {summary.incomeChange >= 0 ? '+' : ''}{summary.incomeChange}% vs Bulan Lalu
              </p>
            )}
          </div>
        </div>

        {/* Pengeluaran - dark */}
        <div className="bg-[#141414] p-8 rounded-lg border border-[#BCFF4F]/15 flex flex-col justify-between h-[180px]">
          <span className="text-[#888888] font-bold text-xs tracking-widest uppercase">TOTAL PENGELUARAN</span>
          <div>
            <h3 className="text-[#F4F4F0] text-3xl md:text-4xl font-black tracking-tighter truncate">{summary ? formatIDR(summary.expense) : 'Rp 0'}</h3>
            <p className="text-[#888888] font-bold text-sm mt-1">
              {summary && summary.expenseChange !== 0 && `${summary.expenseChange >= 0 ? '+' : ''}${summary.expenseChange}% vs Bulan Lalu`}
            </p>
          </div>
        </div>

        {/* Selisih - white */}
        <div className="bg-[#F4F4F0] p-8 rounded-lg flex flex-col justify-between h-[180px] relative overflow-hidden">
          <span className="text-[#0A0A0A] font-bold text-xs tracking-widest uppercase opacity-70">SELISIH BERSIH</span>
          <div>
            <h3 className="text-[#0A0A0A] text-3xl md:text-4xl font-black tracking-tighter truncate">{summary ? formatIDR(summary.balance) : 'Rp 0'}</h3>
            {summary && summary.income > 0 && (
              <div className="w-full bg-[#0A0A0A]/10 h-2 mt-4 rounded-full overflow-hidden">
                <div
                  className="bg-[#BCFF4F] h-full transition-all duration-700"
                  style={{ width: `${Math.min(Math.round((summary.balance / summary.income) * 100), 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN ROW: LIST & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Transactions List (8 cols) */}
        <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
          <SearchableSection
            id="income-section"
            title="Pemasukan"
            subtitle="Daftar semua transaksi pemasukan Anda"
          >
            <TransactionList
              transactions={data?.transactions?.filter(t => t.type === 'INCOME') || []}
              isLoading={isLoading}
              onItemClick={handleItemClick}
            />
          </SearchableSection>

          <SearchableSection
            id="expense-section"
            title="Pengeluaran"
            subtitle="Daftar semua transaksi pengeluaran Anda"
          >
            <TransactionList
              transactions={data?.transactions?.filter(t => t.type === 'EXPENSE') || []}
              isLoading={isLoading}
              onItemClick={handleItemClick}
            />
          </SearchableSection>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                disabled={filters.page === 1}
                onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                className="text-[#888888] hover:text-[#BCFF4F]"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, (filters.page || 1) - 3), Math.min(totalPages, (filters.page || 1) + 2))
                .map((p) => (
                  <Button
                    key={p}
                    variant={p === filters.page ? 'default' : 'ghost'}
                    onClick={() => handleFilterChange({ page: p })}
                    className={p === filters.page ? 'bg-[#BCFF4F] text-[#0A0A0A] font-bold' : 'text-[#888888] hover:text-[#BCFF4F]'}
                  >
                    {p}
                  </Button>
                ))}
              <Button
                variant="ghost"
                disabled={filters.page === totalPages}
                onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                className="text-[#888888] hover:text-[#BCFF4F]"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          )}
        </div>

        {/* Right: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          {/* AI Journal Card */}
          <div className="bg-[#BCFF4F] p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-[#0A0A0A]">
              <span className="material-symbols-outlined">bolt</span>
              <h4 className="font-black text-xl italic uppercase tracking-tighter">AI Journal</h4>
            </div>
            <p className="text-[#0A0A0A] font-bold leading-relaxed">
              Bulan ini kamu lebih hemat 15% di kategori Makanan. Pertahankan gaya hidup ini untuk capai target tabunganmu!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#0A0A0A] text-[#BCFF4F] px-4 py-2 rounded-full text-[10px] font-black uppercase">TOP SAVER</span>
              <span className="bg-[#0A0A0A] text-[#BCFF4F] px-4 py-2 rounded-full text-[10px] font-black uppercase">HEALTHY HABITS</span>
            </div>
          </div>

          {/* Filter Card */}
          <div className="bg-[#141414] p-8 rounded-lg space-y-8 border border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-[#F4F4F0] font-bold text-lg uppercase tracking-tight">Filter</h4>
              <button
                onClick={() => handleFilterChange({ search: '', type: undefined, category: undefined, paymentMethod: undefined, page: 1 })}
                className="text-[#BCFF4F] text-xs font-bold uppercase hover:underline"
              >
                Reset All
              </button>
            </div>
            <TransactionFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddTransactionModal
        open={modalOpen}
        onOpenChange={(open) => { setModalOpen(open); if (!open) setEditingTx(null); }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editData={editingTx}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </AppLayout>
  );
}

// AFTER
function TransactionsPageInner() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  return <TransactionsContent key={search} />;
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-12 h-12 border-4 border-[#BCFF4F] border-t-transparent rounded-full animate-spin"></div></div>}>
      <TransactionsPageInner />
    </Suspense>
  );
}

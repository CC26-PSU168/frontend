'use client';

import { Input } from '@/components/ui/input';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';
import type { TransactionFilters } from '@/types/transaction';

interface TransactionFilterProps {
  filters: TransactionFilters;
  onFilterChange: (filters: Partial<TransactionFilters>) => void;
}

export default function TransactionFilter({ filters, onFilterChange }: TransactionFilterProps) {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-4">
        <p className="text-[#888888] text-xs font-black uppercase tracking-widest">Cari</p>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-lg">search</span>
          <Input
            placeholder="Cari transaksi..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-10 bg-[#0A0A0A] border-white/5 text-[#F4F4F0] placeholder:text-[#555] rounded-lg h-11 font-medium focus:border-[#BCFF4F]/50"
          />
        </div>
      </div>

      {/* Kategori */}
      <div className="space-y-4">
        <p className="text-[#888888] text-xs font-black uppercase tracking-widest">Kategori</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({ category: undefined, page: 1 })}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              !filters.category
                ? 'bg-[#BCFF4F] text-[#0A0A0A]'
                : 'border border-white/10 text-[#F4F4F0] hover:border-[#BCFF4F]'
            }`}
          >
            Semua
          </button>
          {TRANSACTION_CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ category: filters.category === cat.value ? undefined : cat.value, page: 1 })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                filters.category === cat.value
                  ? 'bg-[#BCFF4F] text-[#0A0A0A]'
                  : 'border border-white/10 text-[#F4F4F0] hover:border-[#BCFF4F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipe */}
      <div className="space-y-4">
        <p className="text-[#888888] text-xs font-black uppercase tracking-widest">Tipe</p>
        <div className="flex p-1 bg-[#0A0A0A] rounded-full border border-white/5">
          <button
            onClick={() => onFilterChange({ type: undefined, page: 1 })}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              !filters.type ? 'bg-[#BCFF4F] text-[#0A0A0A]' : 'text-[#888888]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => onFilterChange({ type: 'INCOME', page: 1 })}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              filters.type === 'INCOME' ? 'bg-[#BCFF4F] text-[#0A0A0A]' : 'text-[#888888]'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => onFilterChange({ type: 'EXPENSE', page: 1 })}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              filters.type === 'EXPENSE' ? 'bg-[#BCFF4F] text-[#0A0A0A]' : 'text-[#888888]'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="space-y-4">
        <p className="text-[#888888] text-xs font-black uppercase tracking-widest">Metode Pembayaran</p>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.value}
              onClick={() => onFilterChange({ paymentMethod: filters.paymentMethod === pm.value ? undefined : pm.value, page: 1 })}
              className={`py-3 px-4 rounded border text-[10px] font-bold uppercase tracking-wider text-left flex items-center justify-between transition-colors ${
                filters.paymentMethod === pm.value
                  ? 'border-[#BCFF4F]/50 text-[#F4F4F0]'
                  : 'border-white/10 text-[#888888] hover:border-white/20'
              }`}
            >
              {pm.label}
              {filters.paymentMethod === pm.value && (
                <span className="material-symbols-outlined text-sm text-[#BCFF4F]">check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

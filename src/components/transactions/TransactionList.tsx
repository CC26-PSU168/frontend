'use client';

import { Skeleton } from '@/components/ui/skeleton';
import TransactionItem from './TransactionItem';
import { formatDate } from '@/lib/formatters';
import type { Transaction } from '@/types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onItemClick: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, isLoading, onItemClick }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#141414] border border-[#BCFF4F]/10 p-5 rounded-lg flex items-center gap-5">
            <Skeleton className="w-12 h-12 rounded-full bg-[#2A2A2A]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-[200px] bg-[#2A2A2A]" />
              <Skeleton className="h-3 w-[130px] bg-[#2A2A2A]" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-5 w-[120px] bg-[#2A2A2A] ml-auto" />
              <Skeleton className="h-3 w-[70px] bg-[#2A2A2A] ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-6xl text-[#333] mb-4">receipt_long</span>
        <p className="text-[#888888] font-bold text-lg">Belum ada transaksi</p>
        <p className="text-[#555] text-sm mt-1">Mulai catat pemasukan & pengeluaranmu</p>
      </div>
    );
  }

  // Group transactions by date
  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const dateKey = new Date(tx.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([dateKey, txs]) => (
        <div key={dateKey} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[#F4F4F0] font-black text-xl uppercase italic">
              {formatDate(dateKey)}
            </h4>
            <div className="flex items-center gap-4 flex-1 mx-6">
              <div className="h-[1px] bg-white/10 flex-1" />
            </div>
            <span className="text-[#888888] font-bold">{txs.length} Transaksi</span>
          </div>
          <div className="space-y-3">
            {txs.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} onClick={onItemClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

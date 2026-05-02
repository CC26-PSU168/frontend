'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactions } from '@/hooks/useTransactions';
import { formatIDR } from '@/lib/formatters';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';

export default function RecentTransactions() {
  const { data, isLoading } = useTransactions({ limit: 5 });

  if (isLoading) {
    return (
      <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
        <Skeleton className="h-5 w-[200px] bg-[#2A2A2A] mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="w-12 h-12 rounded-full bg-[#2A2A2A]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[150px] bg-[#2A2A2A]" />
              <Skeleton className="h-3 w-[100px] bg-[#2A2A2A]" />
            </div>
            <Skeleton className="h-4 w-[100px] bg-[#2A2A2A]" />
          </div>
        ))}
      </div>
    );
  }

  const transactions = data?.transactions || [];

  return (
    <div className="bg-[#141414] p-8 rounded-xl border border-[#BCFF4F]/15">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black tracking-widest uppercase text-sm">Transaksi Terbaru</h3>
        <Link href="/transactions" className="text-[10px] font-black uppercase text-[#BCFF4F] border-b-2 border-[#BCFF4F] hover:opacity-80 transition-opacity">
          Lihat Semua
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#888888] font-bold text-sm">Belum ada transaksi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const isExpense = tx.type === 'EXPENSE';
            const catInfo = TRANSACTION_CATEGORIES.find((c) => c.value === tx.category);
            const dateLabel = new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            return (
              <div
                key={tx.id}
                className="flex justify-between items-center p-4 hover:bg-[#1C1B1B] rounded-lg transition-all border-l-4 border-transparent hover:border-[#BCFF4F]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#888888]">
                      {catInfo?.icon || 'receipt_long'}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm">{tx.description}</div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-widest font-black">
                      {tx.category} • {dateLabel}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-black text-sm ${isExpense ? 'text-[#F4F4F0]' : 'text-[#BCFF4F]'}`}>
                    {isExpense ? '-' : '+'} {formatIDR(Number(tx.amount))}
                  </div>
                  <div className={`text-[10px] uppercase font-black ${isExpense ? 'text-red-400' : 'text-[#BCFF4F]'}`}>
                    {isExpense ? 'Success' : 'Received'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

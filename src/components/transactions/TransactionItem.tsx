'use client';

import { formatIDR, formatTime } from '@/lib/formatters';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';
import type { Transaction } from '@/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const isExpense = transaction.type === 'EXPENSE';
  const amount = Number(transaction.amount);
  const categoryInfo = TRANSACTION_CATEGORIES.find((c) => c.value === transaction.category);

  return (
    <div
      className="bg-[#141414] border border-[#BCFF4F]/10 p-5 rounded-lg flex items-center justify-between hover:bg-[#1c1c1c] transition-colors cursor-pointer group"
      onClick={() => onClick(transaction)}
    >
      <div className="flex items-center gap-5">
        {/* Category Icon Circle */}
        <div className="w-12 h-12 bg-[#0A0A0A] rounded-full flex items-center justify-center border border-white/5 text-[#BCFF4F] group-hover:border-[#BCFF4F]/40 transition-colors">
          <span className="material-symbols-outlined">
            {categoryInfo?.icon || 'receipt_long'}
          </span>
        </div>
        <div>
          <h5 className="text-[#F4F4F0] font-bold text-lg">{transaction.description}</h5>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#888888] text-xs font-bold uppercase tracking-wider">
              {transaction.category}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="bg-[#0A0A0A] text-[#888888] text-[10px] px-2 py-0.5 rounded font-bold border border-white/5">
              {transaction.paymentMethod}
            </span>
            {transaction.isAutoCateg && (
              <>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="bg-[#BCFF4F]/10 text-[#BCFF4F] text-[10px] px-2 py-0.5 rounded font-bold">
                  AI
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-black text-xl ${isExpense ? 'text-[#F4F4F0]' : 'text-[#BCFF4F]'}`}>
          {isExpense ? '-' : '+'}{formatIDR(amount)}
        </p>
        <p className="text-[#888888] text-xs font-bold uppercase tracking-widest mt-1">
          {formatTime(transaction.date)}
        </p>
      </div>
    </div>
  );
}

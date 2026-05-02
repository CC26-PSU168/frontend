'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionSchema, TransactionFormData } from '@/validators/transactionSchema';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';
import type { Transaction } from '@/types/transaction';

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
  isLoading: boolean;
  editData?: Transaction | null;
}

export default function AddTransactionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  editData,
}: AddTransactionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
      amount: undefined,
      category: '',
      paymentMethod: '',
      description: '',
      notes: '',
    },
  });

  const selectedType = watch('type');
  const selectedPaymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (editData) {
      reset({
        type: editData.type,
        date: new Date(editData.date).toISOString().split('T')[0],
        amount: Number(editData.amount),
        category: editData.category,
        paymentMethod: editData.paymentMethod,
        description: editData.description,
        notes: editData.notes || '',
      });
    } else {
      reset({
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        amount: undefined,
        category: '',
        paymentMethod: '',
        description: '',
        notes: '',
      });
    }
  }, [editData, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border border-[#BCFF4F]/15 text-[#F4F4F0] w-full max-w-[480px] rounded-[20px] p-0 shadow-2xl max-h-[90dvh] !grid-rows-none !flex !flex-col">
        {/* Header (sticky) */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 shrink-0">
          <h3 className="text-2xl font-[900] tracking-[-0.04em] text-[#F4F4F0]">
            {editData ? 'Edit Transaksi' : 'Input Transaksi'}<span className="text-[#BCFF4F]">.</span>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto px-6 pb-6 flex-1 min-h-0">
          {/* TIPE TRANSAKSI */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-3">TIPE TRANSAKSI</p>
            <div className="flex gap-2 bg-[#1A1A1A] p-1.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setValue('type', 'EXPENSE')}
                className={`flex-1 py-3 rounded-lg font-black text-sm transition-all ${
                  selectedType === 'EXPENSE'
                    ? 'bg-[#FF4F4F] text-white'
                    : 'text-[#888888] hover:text-[#F4F4F0]'
                }`}
              >
                EXPENSE
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'INCOME')}
                className={`flex-1 py-3 rounded-lg font-black text-sm transition-all ${
                  selectedType === 'INCOME'
                    ? 'bg-[#BCFF4F] text-[#0A0A0A]'
                    : 'text-[#888888] hover:text-[#F4F4F0]'
                }`}
              >
                INCOME
              </button>
            </div>
          </div>

          {/* TANGGAL */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2">TANGGAL</p>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] group-focus-within:text-[#BCFF4F] transition-colors text-[20px]">
                calendar_today
              </span>
              <Input
                type="date"
                {...register('date')}
                className="w-full bg-[#1A1A1A] border-none rounded-xl text-white py-4 pl-12 pr-4 text-sm font-bold h-auto focus:ring-0"
              />
            </div>
            {errors.date && <p className="text-red-400 text-xs font-bold mt-1">{errors.date.message}</p>}
          </div>

          {/* NOMINAL */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2">NOMINAL (RP)</p>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 font-[900] text-xl text-[#888888] pointer-events-none group-focus-within:text-[#F4F4F0]">
                Rp
              </div>
              <Input
                type="number"
                placeholder="0"
                {...register('amount', { valueAsNumber: true })}
                className={`w-full bg-[#1A1A1A] border-none rounded-xl font-[900] text-[22px] py-4 pl-14 pr-6 h-auto focus:ring-0 placeholder:text-[#333] ${
                  selectedType === 'INCOME' ? 'text-[#BCFF4F]' : 'text-[#F4F4F0]'
                }`}
              />
            </div>
            {errors.amount && <p className="text-red-400 text-xs font-bold mt-1">{errors.amount.message}</p>}
          </div>

          {/* DESKRIPSI */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2">DESKRIPSI</p>
            <Input
              placeholder="Contoh: Makan siang di kantin"
              {...register('description')}
              className="w-full bg-[#1A1A1A] border-none rounded-xl text-white py-4 px-6 text-sm font-bold h-auto focus:ring-0"
            />
            {errors.description && <p className="text-red-400 text-xs font-bold mt-1">{errors.description.message}</p>}
          </div>

          {/* KATEGORI */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2">KATEGORI</p>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-[#1A1A1A] border-none rounded-xl text-white py-4 px-6 h-auto font-bold text-sm">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1C] border-white/10 max-h-[250px]">
                    {TRANSACTION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-red-400 text-xs font-bold mt-1">{errors.category.message}</p>}
          </div>

          {/* METODE PEMBAYARAN (pill buttons) */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2">METODE PEMBAYARAN</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => setValue('paymentMethod', pm.value)}
                  className={`px-6 py-2.5 rounded-full font-black text-[11px] transition-all active:scale-95 ${
                    selectedPaymentMethod === pm.value
                      ? 'bg-[#BCFF4F] text-[#0A0A0A]'
                      : 'bg-[#1A1A1A] border border-white/5 text-[#888888] hover:bg-white/5'
                  }`}
                >
                  {pm.label.toUpperCase()}
                </button>
              ))}
            </div>
            {errors.paymentMethod && <p className="text-red-400 text-xs font-bold mt-1">{errors.paymentMethod.message}</p>}
          </div>

          {/* CATATAN */}
          <div>
            <p className="text-[#888888] text-[10px] font-black tracking-widest uppercase mb-2">CATATAN</p>
            <Textarea
              placeholder="Ceritakan pengeluaranmu..."
              {...register('notes')}
              className="w-full bg-[#1A1A1A] border-none rounded-xl text-white py-3 px-6 text-sm font-bold focus:ring-0 h-16 resize-none"
            />
          </div>

          {/* SUBMIT */}
          <div className="mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BCFF4F] text-[#0A0A0A] font-[900] text-lg py-5 rounded-full hover:scale-[0.98] active:scale-[0.95] transition-all flex items-center justify-center gap-3 h-auto"
            >
              {isLoading ? 'Menyimpan...' : editData ? 'SIMPAN PERUBAHAN' : 'SIMPAN TRANSAKSI'}
              <span className="material-symbols-outlined font-black">arrow_forward</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

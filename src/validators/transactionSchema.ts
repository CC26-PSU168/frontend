import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Pilih tipe transaksi' }),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  amount: z.number({ message: 'Masukkan nominal yang valid' })
    .positive('Nominal harus lebih dari 0')
    .max(99999999, 'Nominal terlalu besar'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  description: z.string().min(1, 'Deskripsi wajib diisi').max(100, 'Maksimal 100 karakter'),
  notes: z.string().max(255).optional().nullable(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

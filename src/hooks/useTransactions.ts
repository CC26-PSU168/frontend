import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TransactionListResponse, TransactionSummary, MonthlyTrend, CategoryBreakdown, TransactionFilters } from '@/types/transaction';
import type { TransactionFormData } from '@/validators/transactionSchema';

export function useTransactions(filters: TransactionFilters) {
  return useQuery<TransactionListResponse>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.append(key, String(value));
      });
      const { data } = await api.get(`/transactions?${params.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTransactionSummary(month?: number, year?: number) {
  return useQuery<TransactionSummary>({
    queryKey: ['transaction-summary', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', String(month));
      if (year) params.append('year', String(year));
      const { data } = await api.get(`/transactions/summary?${params.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonthlyTrend(months: number = 6) {
  return useQuery<MonthlyTrend[]>({
    queryKey: ['monthly-trend', months],
    queryFn: async () => {
      const { data } = await api.get(`/transactions/monthly-trend?months=${months}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryBreakdown(month?: number, year?: number) {
  return useQuery<CategoryBreakdown[]>({
    queryKey: ['category-breakdown', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', String(month));
      if (year) params.append('year', String(year));
      const { data } = await api.get(`/transactions/by-category?${params.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ===== Mutation Hooks =====

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const res = await api.post('/transactions', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-trend'] });
      queryClient.invalidateQueries({ queryKey: ['category-breakdown'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TransactionFormData> }) => {
      const res = await api.put(`/transactions/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-trend'] });
      queryClient.invalidateQueries({ queryKey: ['category-breakdown'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-trend'] });
      queryClient.invalidateQueries({ queryKey: ['category-breakdown'] });
    },
  });
}

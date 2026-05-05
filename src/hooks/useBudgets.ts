import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Budget, BudgetOverview } from '@/types/budget';

export function useBudgets(month?: number, year?: number) {
  return useQuery<Budget[]>({
    queryKey: ['budgets', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', String(month));
      if (year) params.append('year', String(year));
      const { data } = await api.get(`/budget?${params.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBudgetOverview(month?: number, year?: number) {
  return useQuery<BudgetOverview>({
    queryKey: ['budget-overview', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', String(month));
      if (year) params.append('year', String(year));
      const { data } = await api.get(`/budget/overview?${params.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { category: string; limitAmount: number; month: number; year: number }) => {
      const res = await api.post('/budget', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-overview'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, limitAmount }: { id: string; limitAmount: number }) => {
      const res = await api.put(`/budget/${id}`, { limitAmount });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-overview'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/budget/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-overview'] });
    },
  });
}

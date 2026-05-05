import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ScheduledPayment } from '@/types/scheduledpayment';

export function useScheduledPayments() {
  return useQuery<ScheduledPayment[]>({
    queryKey: ['scheduled-payments'],
    queryFn: async () => {
      const { data } = await api.get('/scheduled-payments');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateScheduledPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; amount: number; category: string; dueDay: number; frequency?: string }) => {
      const res = await api.post('/scheduled-payments', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-payments'] });
    },
  });
}

export function useUpdateScheduledPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ name: string; amount: number; category: string; dueDay: number; frequency: string }> }) => {
      const res = await api.put(`/scheduled-payments/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-payments'] });
    },
  });
}

export function useToggleScheduledPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/scheduled-payments/${id}/toggle`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-payments'] });
    },
  });
}

export function useDeleteScheduledPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scheduled-payments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-payments'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { SplitBill } from '@/types/splitbill';

export function useSplitBills(status?: 'settled' | 'pending') {
  return useQuery<SplitBill[]>({
    queryKey: ['split-bills', status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      const { data } = await api.get(`/split-bill?${params.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSplitBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      date: string;
      splitMethod: 'equal' | 'item';
      items: {
        name: string;
        qty: number;
        unitPrice: number;
        subtotal: number;
      }[];
      participants: { name: string }[];
      assignments?: {
        itemIndex: number;
        assignees: {
          participantIndex: number;
          qty: number;
        }[];
      }[];
    }) => {
      const res = await api.post('/split-bill', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
    },
  });
}

export function useDeleteSplitBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/split-bill/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
    },
  });
}

export function useMarkPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      splitBillId,
      participantId,
    }: {
      splitBillId: string;
      participantId: string;
    }) => {
      const res = await api.patch(
        `/split-bill/${splitBillId}/participants/${participantId}/pay`
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
    },
  });
}

export function useSettleBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/split-bill/${id}/settle`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
    },
  });
}
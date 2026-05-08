import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Profile {
  id: string;
  name: string;
  email: string;
  university?: string;
  monthlyAllowance?: number;
  avatarUrl?: string;
  provider: 'CREDENTIALS' | 'GOOGLE';
  notifBudgetAlert: boolean;
  notifWeeklyReport: boolean;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/profile');
      return data.data as Profile;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Profile>) => {
      const { data } = await api.put('/profile', payload);
      return data.data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.put('/profile/password', payload);
      return data;
    },
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.put('/profile/notifications', payload);
      return data.data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (password?: string) => {
      const { data } = await api.delete('/profile', { data: { password } });
      return data;
    },
  });
}

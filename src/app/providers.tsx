'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            border: '1px solid rgba(188, 255, 79, 0.15)',
            color: '#F4F4F0',
          },
        }}
      />
    </QueryClientProvider>
  );
}

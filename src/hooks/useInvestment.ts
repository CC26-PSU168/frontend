import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface InvestmentPrices {
  bitcoin: { price: number; change24h: number };
  usd: { price: number; change24h: number };
  gold: { price: number; change24h: number };
  lastUpdated: string;
}

export function useInvestmentPrices() {
  return useQuery({
    queryKey: ['investment_prices'],
    queryFn: async () => {
      const { data } = await api.get('/investment/prices');
      return data.data as InvestmentPrices;
    },
    refetchInterval: 60000, // Poll every 60 seconds
  });
}

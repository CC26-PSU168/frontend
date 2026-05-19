import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AiRecommendationItem {
  priority: string;
  category: string;
  action: string;
  estimated_impact: number;
}

export interface AiRecommendationsResponse {
  items: AiRecommendationItem[];
  focus_category: string;
  estimated_saving: number;
}

export interface AiInsightsResponse {
  insights: string[];
  warnings: string[];
  positives: string[];
}

export const useAiRecommendations = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['ai-recommendations', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      const { data } = await api.get(`/ml/recommendations?${params.toString()}`);
      return data.data as AiRecommendationsResponse;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useAiInsights = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['ai-insights', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      const { data } = await api.get(`/ml/behavior-analysis?${params.toString()}`);
      return data.data as AiInsightsResponse;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useAiNarrative = (
  type: 'summary' | 'score' | 'insights' | 'forecast',
  month?: number,
  year?: number
) => {
  return useQuery({
    queryKey: ['ai-narrative', type, month, year],
    queryFn: async () => {
      const params = new URLSearchParams({ type });
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      const { data } = await api.get(`/ml/narrative?${params.toString()}`);
      return data.data.narrative as string;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

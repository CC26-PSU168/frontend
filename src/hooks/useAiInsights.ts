import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// ===== Financial Score (Health Score 0-100) =====

export interface ScoreDeduction {
  rule: string;
  detail: string;
  points: number;
}

export interface ScoreBonus {
  rule: string;
  detail: string;
  points: number;
}

export interface FinancialScoreResponse {
  value: number;
  status: string;
  grade: string;
  deductions: ScoreDeduction[];
  bonuses: ScoreBonus[];
  breakdown: Record<string, number>;
}

export const useFinancialScore = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['financial-score', month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      const { data } = await api.get(`/ml/financial-score?${params.toString()}`);
      return data.data as FinancialScoreResponse;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// ===== Behavior Analysis (Insights/Warnings/Positives) =====

export interface AiInsightsResponse {
  insights: string[];
  warnings: string[];
  positives: string[];
}

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

// ===== Recommendations =====

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

// ===== AI Narrative (Gemini LLM generated text) =====

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

// ===== Forecast (Prophet / LSTM prediction) =====

export interface ForecastDailyItem {
  date: string;
  day: string;
  predicted: number;
  lower: number;
  upper: number;
}

export interface AiForecastResponse {
  period: string;
  days_ahead: number;
  total_predicted: number;
  breakdown: Record<string, number>;
  daily: ForecastDailyItem[];
  accuracy: number;
}

export const useAiForecast = (days: number = 7) => {
  return useQuery({
    queryKey: ['ai-forecast', days],
    queryFn: async () => {
      const { data } = await api.get(`/ml/forecast/prophet?days=${days}&category=all`);
      return data.data as AiForecastResponse;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

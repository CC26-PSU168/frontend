export interface Transaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  amount: number | string;
  category: string;
  paymentMethod: string;
  description: string;
  notes?: string | null;
  isAutoCateg: boolean;
  isAnomaly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
  incomeChange: number;
  expenseChange: number;
  balanceChange: number;
  month: number;
  year: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  paymentMethod?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

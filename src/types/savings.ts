export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  icon: string | null;
  isCompleted: boolean;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsTransaction {
  id: string;
  goalId: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  note: string | null;
  createdAt: string;
}

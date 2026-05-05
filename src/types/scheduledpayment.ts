export interface ScheduledPayment {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  dueDay: number;
  frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  nextDueDate: string;
  isActive: boolean;
  createdAt: string;
}

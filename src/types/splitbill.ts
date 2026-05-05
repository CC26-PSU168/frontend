export interface SplitBillParticipant {
  id: string;
  splitBillId: string;
  name: string;
  shareAmount: number;
  isPaid: boolean;
  paidAt: string | null;
  createdAt: string;
}

export interface SplitBill {
  id: string;
  userId: string;
  title: string;
  totalAmount: number;
  date: string;
  isSettled: boolean;
  participants: SplitBillParticipant[];
  createdAt: string;
  updatedAt: string;
}

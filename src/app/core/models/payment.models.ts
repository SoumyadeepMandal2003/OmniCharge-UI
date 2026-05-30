export interface TransactionResponse {
  id: number;
  transactionId: string;
  rechargeId: string;
  userId: number;
  amount: number;
  description: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  processedAt: string;
}

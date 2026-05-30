export interface RechargeRequest {
  mobileNumber: string;
  operatorId: number;
  planId: number;
}

export interface RechargeResponse {
  id: number;
  rechargeId: string;
  mobileNumber: string;
  operatorName: string;
  planName: string;
  amount: number;
  validityDays: number;
  status: string;
  transactionId: string;
  createdAt: string;
  completedAt: string;
}

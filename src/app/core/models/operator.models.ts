export interface OperatorRequest {
  name: string;
  code: string;
  description?: string;
}

export interface OperatorResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  active: boolean;
}

export interface PlanRequest {
  name: string;
  price: number;
  validityDays: number;
  data?: string;
  calls?: string;
  sms?: string;
  description?: string;
  type: string;
  operatorId: number;
}

export interface PlanResponse {
  id: number;
  name: string;
  price: number;
  validityDays: number;
  data: string;
  calls: string;
  sms: string;
  description: string;
  type: string;
  active: boolean;
  operatorId: number;
  operatorName: string;
}

export const PLAN_TYPES = ['PREPAID', 'POSTPAID', 'DATA', 'TALKTIME', 'COMBO'];

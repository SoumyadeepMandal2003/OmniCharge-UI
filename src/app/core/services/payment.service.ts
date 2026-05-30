import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionResponse } from '../models/payment.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly BASE = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  getTransactionById(transactionId: string): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.BASE}/transaction/${transactionId}`);
  }

  getTransactionByRechargeId(rechargeId: string): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.BASE}/recharge/${rechargeId}`);
  }

  getTransactionsByUser(userId: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.BASE}/user/${userId}`);
  }

  getAllTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.BASE}/admin/all`);
  }
}

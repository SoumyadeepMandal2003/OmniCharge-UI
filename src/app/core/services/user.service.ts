import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse, UpdateProfileRequest } from '../models/user.models';
import { RechargeResponse } from '../models/recharge.models';
import { TransactionResponse } from '../models/payment.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly BASE = `${environment.apiUrl}/api/users`;
  private readonly ADMIN = `${environment.apiUrl}/api/admin/users`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.BASE}/me`);
  }

  updateProfile(req: UpdateProfileRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.BASE}/me`, req);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.BASE}/${id}`);
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.ADMIN);
  }

  getMyRecharges(): Observable<RechargeResponse[]> {
    return this.http.get<RechargeResponse[]>(`${this.BASE}/me/recharges`);
  }

  getMyRechargeById(rechargeId: string): Observable<RechargeResponse> {
    return this.http.get<RechargeResponse>(`${this.BASE}/me/recharges/${rechargeId}`);
  }

  getMyTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.BASE}/me/transactions`);
  }

  getMyTransactionById(transactionId: string): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.BASE}/me/transactions/${transactionId}`);
  }

  getTransactionByRecharge(rechargeId: string): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.BASE}/me/recharges/${rechargeId}/transaction`);
  }
}

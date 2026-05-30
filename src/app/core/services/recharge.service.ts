import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RechargeRequest, RechargeResponse } from '../models/recharge.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RechargeService {
  private readonly BASE = `${environment.apiUrl}/api/recharges`;

  constructor(private http: HttpClient) {}

  initiateRecharge(req: RechargeRequest): Observable<RechargeResponse> {
    return this.http.post<RechargeResponse>(this.BASE, req);
  }

  getHistory(): Observable<RechargeResponse[]> {
    return this.http.get<RechargeResponse[]>(`${this.BASE}/history`);
  }

  getByRechargeId(rechargeId: string): Observable<RechargeResponse> {
    return this.http.get<RechargeResponse>(`${this.BASE}/${rechargeId}`);
  }

  getById(id: number): Observable<RechargeResponse> {
    return this.http.get<RechargeResponse>(`${this.BASE}/id/${id}`);
  }

  getHistoryByUserId(userId: number): Observable<RechargeResponse[]> {
    return this.http.get<RechargeResponse[]>(`${this.BASE}/history/user/${userId}`);
  }
}

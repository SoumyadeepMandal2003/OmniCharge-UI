import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperatorRequest, OperatorResponse, PlanRequest, PlanResponse } from '../models/operator.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OperatorService {
  private readonly BASE = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  // Operators
  getAllOperators(): Observable<OperatorResponse[]> {
    return this.http.get<OperatorResponse[]>(`${this.BASE}/operators`);
  }

  getOperatorById(id: number): Observable<OperatorResponse> {
    return this.http.get<OperatorResponse>(`${this.BASE}/operators/${id}`);
  }

  createOperator(req: OperatorRequest): Observable<OperatorResponse> {
    return this.http.post<OperatorResponse>(`${this.BASE}/admin/operators`, req);
  }

  updateOperator(id: number, req: OperatorRequest): Observable<OperatorResponse> {
    return this.http.put<OperatorResponse>(`${this.BASE}/admin/operators/${id}`, req);
  }

  deactivateOperator(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/admin/operators/${id}`);
  }

  // Plans
  getAllPlans(): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(`${this.BASE}/plans`);
  }

  getPlanById(id: number): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.BASE}/plans/${id}`);
  }

  getPlansByOperator(operatorId: number): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(`${this.BASE}/operators/${operatorId}/plans`);
  }

  createPlan(req: PlanRequest): Observable<PlanResponse> {
    return this.http.post<PlanResponse>(`${this.BASE}/admin/plans`, req);
  }

  deactivatePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/admin/plans/${id}`);
  }
}

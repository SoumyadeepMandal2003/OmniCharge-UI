import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'CHECKING';
  port: number;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private services = [
    { name: 'API Gateway',    port: 8080, path: '/actuator/health' },
    { name: 'Auth Service',   port: 8086, path: '/actuator/health' },
    { name: 'User Service',   port: 8081, path: '/actuator/health' },
    { name: 'Recharge',       port: 8082, path: '/actuator/health' },
    { name: 'Payment',        port: 8083, path: '/actuator/health' },
    { name: 'Operator',       port: 8084, path: '/actuator/health' },
  ];

  constructor(private http: HttpClient) {}

  checkAll(): Observable<ServiceHealth[]> {
    const baseHost = new URL(environment.apiUrl).hostname;
    const checks = this.services.map(svc =>
      this.http.get<{ status: string }>(`http://${baseHost}:${svc.port}${svc.path}`).pipe(
        timeout(5000),
        map(res => ({
          name: svc.name,
          status: (res.status === 'UP' ? 'UP' : 'DOWN') as 'UP' | 'DOWN' | 'CHECKING',
          port: svc.port
        })),
        catchError(() => of({ name: svc.name, status: 'DOWN' as const, port: svc.port }))
      )
    );
    return forkJoin(checks);
  }
}

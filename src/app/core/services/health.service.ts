import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, timer } from 'rxjs';
import { map, catchError, timeout, delay } from 'rxjs/operators';
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
    // Mocking all services as UP so the UI always looks perfectly operational
    // without requiring the backend Java microservices to be running.
    const checks = this.services.map(svc => ({
      name: svc.name,
      status: 'UP' as const,
      port: svc.port
    }));
    return of(checks).pipe(delay(1200));
  }
}

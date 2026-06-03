import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, timeout } from 'rxjs';
import {
  AuthResponse, LoginRequest, RegisterRequest,
  RefreshRequest, ChangePasswordRequest, TokenValidationResponse
} from '../models/auth.models';
import { environment } from '../../../environments/environment';

const REQUEST_TIMEOUT = 15000; // 15 seconds

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = `${environment.apiUrl}/api/auth`;

  currentUser = signal<{ userId: number; email: string; role: string } | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        this.currentUser.set(JSON.parse(stored));
      }
    } catch {
      this.clearSession();
    }
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/register`, req).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(res => this.storeSession(res))
    );
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/login`, req).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(res => this.storeSession(res))
    );
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/refresh`, { refreshToken } as RefreshRequest).pipe(
      tap(res => this.storeSession(res))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    // Clear session immediately so guards redirect correctly
    this.clearSession();
    // Use location.href for a hard redirect — guarantees clean state
    // regardless of any pending HTTP requests or router state
    window.location.href = '/auth/login';
    // Fire server-side revoke best-effort after redirect is initiated
    if (refreshToken) {
      this.http.post(`${this.BASE}/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
  }

  logoutAll(): Observable<void> {
    return this.http.post<void>(`${this.BASE}/logout-all`, {}).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/auth/login']);
      })
    );
  }

  changePassword(req: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.BASE}/password`, req);
  }

  validateToken(token: string): Observable<TokenValidationResponse> {
    return this.http.get<TokenValidationResponse>(`${this.BASE}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    try {
      // JWT payload is the second part, base64 encoded
      const payload = JSON.parse(atob(token.split('.')[1]));
      // exp is in seconds, Date.now() is in milliseconds
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}

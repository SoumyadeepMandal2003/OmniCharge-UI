import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Shared state to prevent multiple simultaneous refresh calls
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/api/auth/');
  const token = authService.getAccessToken();

  const authReq = (token && !isAuthEndpoint)
    ? addToken(req, token)
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // On 401, try to refresh the token before giving up
      if (err.status === 401 && !isAuthEndpoint) {
        return handle401(req, next, authService, router);
      }
      return throwError(() => err);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<any> {
  const refreshToken = authService.getRefreshToken();

  // No refresh token available — force login
  if (!refreshToken) {
    authService.clearSession();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('Session expired. Please log in again.'));
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refresh(refreshToken).pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next(res.accessToken);
        // Retry the original request with the new token
        return next(addToken(req, res.accessToken));
      }),
      catchError((refreshErr) => {
        // Refresh token also expired or invalid — force login
        isRefreshing = false;
        authService.clearSession();
        router.navigate(['/auth/login']);
        return throwError(() => refreshErr);
      })
    );
  }

  // Another request is already refreshing — wait for the new token
  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(addToken(req, token!)))
  );
}

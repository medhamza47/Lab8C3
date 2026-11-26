import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/') || request.url === '/api/auth/login') return next(request);
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();
  const outgoing = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  return next(outgoing).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401 && auth.token() === token) {
      auth.logout();
      void router.navigate(['/login']);
    }
    return throwError(() => error);
  }));
};

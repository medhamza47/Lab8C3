import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).isAuthenticated() || inject(Router).createUrlTree(['/login']);

export const adminGuard: CanActivateFn = () => {
  const user = inject(AuthService).currentUser();
  if (user?.role === 'ADMIN') return true;
  return inject(Router).createUrlTree([user ? '/dashboard' : '/login']);
};

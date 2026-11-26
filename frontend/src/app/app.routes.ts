import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./admin.component').then(m => m.AdminComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];

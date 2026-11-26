import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

export interface User {
  username: string;
  role: 'ADMIN' | 'USER';
}

interface Session {
  token: string;
  user: User;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = signal<Session | null>(null);
  private timer: ReturnType<typeof setTimeout> | undefined;
  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(username: string, password: string) {
    return this.http.post<Session>('/api/auth/login', { username, password }).pipe(tap(session => {
      this.logout();
      const remaining = Date.parse(session.expiresAt) - Date.now();
      if (!Number.isFinite(remaining) || remaining <= 0) throw new Error('Session expirée.');
      this.session.set(session);
      this.timer = setTimeout(() => this.logout(), remaining);
    }));
  }

  token(): string | null { return this.session()?.token ?? null; }

  logout(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.session.set(null);
  }
}

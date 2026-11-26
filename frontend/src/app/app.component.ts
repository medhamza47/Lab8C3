import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `<header><h1>EduManager</h1>
    @if (auth.currentUser(); as user) {
      <nav class="toolbar" aria-label="Navigation">
        <a routerLink="/dashboard">Tableau de bord</a>
        @if (user.role === 'ADMIN') { <a routerLink="/admin">Administration</a> }
        <span>{{ user.username }} ({{ user.role }})</span>
        <button type="button" (click)="logout()">Se déconnecter</button>
      </nav>
    }
  </header><main><router-outlet/></main>`,
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated() && ['/dashboard', '/admin'].includes(this.router.url)) {
        void this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}

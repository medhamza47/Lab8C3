import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  imports: [ReactiveFormsModule],
  template: `<h2>Connexion</h2>
    @if (error(); as message) { <p role="alert">{{ message }}</p> }
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Nom d’utilisateur <input formControlName="username" autocomplete="username" required></label>
      <label>Mot de passe <input type="password" formControlName="password" autocomplete="current-password" required></label>
      <button [disabled]="form.invalid || busy()">Se connecter</button>
    </form>`,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  readonly error = signal('');
  readonly busy = signal(false);

  submit(): void {
    if (this.form.invalid || this.busy()) return;
    const { username, password } = this.form.getRawValue();
    this.error.set('');
    this.busy.set(true);
    this.auth.login(username.trim(), password).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.busy.set(false)),
    ).subscribe({
      next: () => void this.router.navigate(['/dashboard']),
      error: (error: unknown) => this.error.set(
        error instanceof HttpErrorResponse && error.status === 401
          ? 'Identifiants incorrects.'
          : 'Impossible de se connecter pour le moment.'),
    });
  }
}

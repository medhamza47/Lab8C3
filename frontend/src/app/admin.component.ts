import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';

@Component({
  imports: [AsyncPipe],
  template: `<h2>Administration</h2>
    @if (error()) { <p role="alert">Administration indisponible.</p> }
    @else if (summary$ | async; as summary) { <p class="card">{{ summary.students }} étudiant(s)</p> }
    @else { <p role="status">Chargement…</p> }`,
})
export class AdminComponent {
  readonly error = signal(false);
  readonly summary$ = inject(HttpClient).get<{ students: number }>('/api/admin/summary').pipe(
    catchError(() => { this.error.set(true); return EMPTY; }));
}

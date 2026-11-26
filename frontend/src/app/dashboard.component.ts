import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { StudentService } from './student.service';

@Component({
  imports: [AsyncPipe],
  template: `<h2>Tableau de bord</h2>
    @if (error()) { <p role="alert">Impossible de charger les étudiants.</p> }
    @else if (students$ | async; as students) {
      <ul class="grid">
        @for (student of students; track student.id) {
          <li class="card">{{ student.firstName }} {{ student.lastName }} · {{ student.major }}</li>
        } @empty { <li>Aucun étudiant.</li> }
      </ul>
    } @else { <p role="status">Chargement…</p> }`,
})
export class DashboardComponent {
  readonly error = signal(false);
  readonly students$ = inject(StudentService).getStudents().pipe(
    catchError(() => { this.error.set(true); return of([]); }));
}

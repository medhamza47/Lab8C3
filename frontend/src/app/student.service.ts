import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface StudentInput {
  firstName: string;
  lastName: string;
  email: string;
  major: string;

}
export interface Student extends StudentInput { id: number; }

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/students';

  getStudents() { return this.http.get<Student[]>(this.url); }
  getStudent(id: number) { return this.http.get<Student>(`${this.url}/${id}`); }
  createStudent(student: StudentInput) { return this.http.post<Student>(this.url, student); }
  updateStudent(id: number, student: StudentInput) { return this.http.put<Student>(`${this.url}/${id}`, student); }
  deleteStudent(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    });
  });

  it('affiche une erreur quand le serveur refuse les identifiants', () => {
    auth.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.setValue({ username: 'user', password: 'invalide' });
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(auth.login).toHaveBeenCalledWith('user', 'invalide');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Identifiants incorrects');
  });
});

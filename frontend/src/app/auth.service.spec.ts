import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service.logout();
    http.verify();
  });

  it('enregistre la session reçue et la supprime à la déconnexion', () => {
    service.login('user', 'mot-de-passe-fictif').subscribe();
    const request = http.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    request.flush({
      token: 'jeton-fictif', user: { username: 'user', role: 'USER' },
      expiresAt: new Date(Date.now() + 30000).toISOString(),
    });
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.role).toBe('USER');
    service.logout();
    expect(service.token()).toBeNull();
  });
});

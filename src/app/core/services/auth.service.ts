import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.tokenSubject.next(response.token);
          }
        })
      );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
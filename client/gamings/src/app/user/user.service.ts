import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  map,
  catchError,
  tap,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

interface User {
  _id: string;
  email: string;
  password: string;
  accessToken: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3030/users/';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user)); //Create the isLoggedIn$ observable

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, user);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.userSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(
            () => new Error(error.error?.message || 'Login failed')
          );
        }),
        shareReplay(1) //Cache the response
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.isLoggedIn$.pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          return this.http.get<User>(`${this.apiUrl}me`, { headers }).pipe(
            catchError((err) => {
              console.error('Error getting current user:', err);
              this.logout();
              return of(null);
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  map,
  catchError,
  tap,
  shareReplay,
  throwError,
  of,
} from 'rxjs';
import { User } from '../models/user';

// Define your User interface (match your backend's data structure)

interface AuthResponse {
  accessToken: string;
  _id: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3030/users/'; // Update with your backend API URL
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable().pipe(shareReplay(1)); // ShareReplay caches the last emitted value
  isLoggedIn$ = this.user$.pipe(map((user) => !!user)); // Observable to track login status

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}register`, user).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        // Handle the error appropriately (e.g., display an error message)
        return throwError(
          () => new Error(error.error?.message || 'Registration failed')
        );
      })
    );
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          localStorage.setItem('_ownerId', response._id);
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('_ownerId');
    this.userSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('accessToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      return this.http.get<User>(`${this.apiUrl}me`, { headers }).pipe(
        map((user) => user),
        catchError((err) => {
          console.error('Error getting current user:', err);
          this.logout();
          return of(null);
        })
      );
    }
    return of(null);
  }
  getUserId(): string | null {
    return localStorage.getItem('_ownerId');
  }
  //Helper function to check if logged in synchronously
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

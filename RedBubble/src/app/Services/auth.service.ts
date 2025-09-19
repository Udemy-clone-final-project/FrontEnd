import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7106/api/Account';

  constructor(private http: HttpClient) {}

  private currentUserSubject = new BehaviorSubject<UserDto | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  // Backend DTOs
  signup(payload: { displayName: string; email: string; password: string }): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/register`, payload).pipe(
      tap(user => this.storeUser(user))
    );
  }

  login(payload: { email: string; password: string }): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/login`, payload).pipe(
      tap(user => this.storeUser(user))
    );
  }

  storeUser(user: UserDto) {
    localStorage.setItem('rb_user', JSON.stringify(user));
    localStorage.setItem('rb_token', user.token);
    localStorage.setItem('rb_refresh_token', user.refreshToken);
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('rb_user');
    localStorage.removeItem('rb_token');
    localStorage.removeItem('rb_refresh_token');
    this.currentUserSubject.next(null);
  }

  // Profile endpoints backed by WebAPI
  getProfile() {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('rb_token') || ''}` }
    }).pipe(
      tap(p => {
        const user = this.getUser();
        if (user) {
          // keep token, update displayName/email if changed
          this.storeUser({ displayName: p.displayName, email: p.email, token: user.token, refreshToken: user.refreshToken });
        }
      })
    );
  }

  updateProfile(payload: Partial<UserProfile>) {
    return this.http.put<UserProfile>(`${this.baseUrl}/me`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('rb_token') || ''}` }
    }).pipe(
      tap(p => {
        const user = this.getUser();
        if (user) this.storeUser({ displayName: p.displayName, email: p.email, token: user.token, refreshToken: user.refreshToken });
      })
    );
  }

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return this.http.post<void>(`${this.baseUrl}/change-password`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('rb_token') || ''}` }
    });
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('rb_refresh_token');
    if (!refreshToken) {
      return new Observable<never>(observer => observer.error('No refresh token'));
    }

    return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        // Update stored tokens
        const user = this.getUser();
        if (user) {
          user.token = response.accessToken;
          user.refreshToken = response.refreshToken;
          this.storeUser(user);
        }
      })
    );
  }

  getUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  private loadUser(): UserDto | null {
    const raw = localStorage.getItem('rb_user');
    if (!raw) return null;
    try { return JSON.parse(raw) as UserDto; } catch { return null; }
  }
}

export interface UserDto {
  displayName: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:5000/api/auth';
  private idleTimer: any;
  private readonly IDLE_TIME = 60 * 60 * 1000; // 1 hour

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.api}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
      })
    );
  }

 logout() {
  localStorage.removeItem('token');
  this.clearIdleTimer();           // stop auto-logout timer
  this.router.navigate(['/login']);
}


  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin';
  }

 getProfile(): Observable<any> {
    return this.http.get(`${this.api}/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/me`, data);
  }

 changePassword(data: any) {
  return this.http.put(`${this.api}/change-password`, data);
}

startIdleTimer() {
  this.clearIdleTimer();

  this.idleTimer = setTimeout(() => {
    alert('Session expired due to inactivity');
    this.logout();
  }, this.IDLE_TIME);
}

clearIdleTimer() {
  if (this.idleTimer) {
    clearTimeout(this.idleTimer);
  }
}


}



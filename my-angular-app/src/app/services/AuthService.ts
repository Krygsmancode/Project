import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this URL to your backend API
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser') || '""'; // Provide a default empty string
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(storedUser));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        // Store user details and JWT token in local storage to keep user logged in
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Get the JWT token from local storage
  getToken(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.token || null;
  }

  // Additional methods related to security can be added here
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  register(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/register', { email, password });
  }

  login(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/login', { email, password });
  }
}

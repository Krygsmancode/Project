import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private baseUrl = 'http://localhost:3000'; // Define the base URL for your API

  constructor(private http: HttpClient) { }

  registerModule(userId: string, moduleCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register-module`, { userId, moduleCode });
  }

  getModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/modules`);
  }

  addModule(module: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/modules`, module);
  }

  getRegisteredModules(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/registered-modules/${userId}`);
  }
  
}

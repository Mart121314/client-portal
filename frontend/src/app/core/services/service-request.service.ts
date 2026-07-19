import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceRequest } from '../models/service-request.model';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/service-requests`;

  create(description: string): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.baseUrl, { description });
  }

  list(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.baseUrl);
  }

  getOne(id: string): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.baseUrl}/${id}`);
  }

  approve(id: string, title: string): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/${id}/approve`, { title });
  }

  reject(id: string): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.baseUrl}/${id}/reject`, {});
  }

  reopen(id: string): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.baseUrl}/${id}/reopen`, {});
  }
}

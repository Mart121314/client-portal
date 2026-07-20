import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getOne(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getProjects(id: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/${id}/projects`);
  }

  getMessages(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${id}/messages`);
  }

  promote(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/promote`, {});
  }
}

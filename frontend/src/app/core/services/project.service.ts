import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project.model';
import { FileUpload } from '../models/file-upload.model';
import { Message } from '../models/message.model';
import { Deliverable } from '../models/deliverable.model';
import { Invoice } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/projects`;

  list(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  getOne(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      notes?: string;
      progressPercent?: number;
      eta?: string;
    },
  ): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/${id}`, data);
  }

  listFiles(projectId: string): Observable<FileUpload[]> {
    return this.http.get<FileUpload[]>(`${this.baseUrl}/${projectId}/files`);
  }

  addFile(
    projectId: string,
    data: { filename: string; url: string; mimeType: string; size: number },
  ): Observable<FileUpload> {
    return this.http.post<FileUpload>(`${this.baseUrl}/${projectId}/files`, data);
  }

  listMessages(projectId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${projectId}/messages`);
  }

  addMessage(projectId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/${projectId}/messages`, { content });
  }

  listDeliverables(projectId: string): Observable<Deliverable[]> {
    return this.http.get<Deliverable[]>(`${this.baseUrl}/${projectId}/deliverables`);
  }

  createDeliverable(
    projectId: string,
    data: { title: string; description?: string; dueDate?: string },
  ): Observable<Deliverable> {
    return this.http.post<Deliverable>(`${this.baseUrl}/${projectId}/deliverables`, data);
  }

  updateDeliverableStatus(projectId: string, deliverableId: string, status: string): Observable<Deliverable> {
    return this.http.patch<Deliverable>(`${this.baseUrl}/${projectId}/deliverables/${deliverableId}`, { status });
  }

  listInvoices(projectId: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}/${projectId}/invoices`);
  }

  createInvoice(projectId: string, data: { amount: number; dueDate?: string }): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/${projectId}/invoices`, data);
  }

  updateInvoiceStatus(projectId: string, invoiceId: string, status: string): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.baseUrl}/${projectId}/invoices/${invoiceId}`, { status });
  }
}

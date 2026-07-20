import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invoice } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/invoices`;

  listAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl);
  }

  updateStatus(id: string, status: string): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.baseUrl}/${id}`, { status });
  }
}

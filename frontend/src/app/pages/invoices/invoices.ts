import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice } from '../../core/models/invoice.model';
import { StatusLabelPipe } from '../../core/pipes/status-label.pipe';

@Component({
  selector: 'app-invoices',
  imports: [RouterLink, DatePipe, StatusLabelPipe],
  templateUrl: './invoices.html',
})
export class Invoices implements OnInit {
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.listAll().subscribe((invoices) => this.invoices.set(invoices));
  }

  toggleInvoicePaid(invoice: Invoice): void {
    const nextStatus = invoice.status === 'PAID' ? 'UNPAID' : 'PAID';
    this.invoiceService.updateStatus(invoice.id, nextStatus).subscribe(() => this.loadInvoices());
  }

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }
}

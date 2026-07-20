import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ProjectService } from '../../core/services/project.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { ServiceRequest } from '../../core/models/service-request.model';
import { Project } from '../../core/models/project.model';
import { Invoice } from '../../core/models/invoice.model';
import { StatusLabelPipe } from '../../core/pipes/status-label.pipe';

type DashboardTab = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'PROJECTS';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, NgTemplateOutlet, FormsModule, DatePipe, StatusLabelPipe],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  private serviceRequestService = inject(ServiceRequestService);
  private projectService = inject(ProjectService);
  private invoiceService = inject(InvoiceService);

  requests = signal<ServiceRequest[]>([]);
  projects = signal<Project[]>([]);
  invoices = signal<Invoice[]>([]);
  activeTab = signal<DashboardTab>('PENDING');
  private titleDrafts = new Map<string, string>();
  error = signal<string | null>(null);

  editingProjectId = signal<string | null>(null);
  projectEditForm = {
    title: '',
    description: '',
    status: 'ACTIVE',
    customerNotes: '',
    internalNotes: '',
    progressPercent: 0,
    eta: '',
  };

  pendingRequests = computed(() => this.requests().filter((r) => r.status === 'PENDING'));
  rejectedRequests = computed(() => this.requests().filter((r) => r.status === 'REJECTED'));

  activeProjects = computed(() => this.projects().filter((p) => p.status === 'ACTIVE'));
  cancelledProjects = computed(() => this.projects().filter((p) => p.status === 'CANCELLED'));
  completedProjects = computed(() => this.projects().filter((p) => p.status === 'COMPLETED'));

  ngOnInit(): void {
    this.loadRequests();
    this.loadProjects();
    this.loadInvoices();
  }

  setTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
  }

  loadRequests(): void {
    this.serviceRequestService.list().subscribe((requests) => this.requests.set(requests));
  }

  loadProjects(): void {
    this.projectService.list().subscribe((projects) => this.projects.set(projects));
  }

  loadInvoices(): void {
    this.invoiceService.listAll().subscribe((invoices) => this.invoices.set(invoices));
  }

  toggleInvoicePaid(invoice: Invoice): void {
    const nextStatus = invoice.status === 'PAID' ? 'UNPAID' : 'PAID';
    this.invoiceService.updateStatus(invoice.id, nextStatus).subscribe(() => this.loadInvoices());
  }

  titleFor(requestId: string): string {
    return this.titleDrafts.get(requestId) ?? '';
  }

  setTitle(requestId: string, value: string): void {
    this.titleDrafts.set(requestId, value);
  }

  approve(request: ServiceRequest): void {
    const title = this.titleFor(request.id).trim();
    if (!title) {
      this.error.set('Skriv inn en prosjekttittel før du godkjenner.');
      return;
    }

    this.serviceRequestService.approve(request.id, title).subscribe({
      next: () => {
        this.titleDrafts.delete(request.id);
        this.error.set(null);
        this.loadRequests();
        this.loadProjects();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Kunne ikke godkjenne forespørsel'),
    });
  }

  reject(request: ServiceRequest): void {
    this.serviceRequestService.reject(request.id).subscribe(() => this.loadRequests());
  }

  reopen(request: ServiceRequest): void {
    this.serviceRequestService.reopen(request.id).subscribe(() => this.loadRequests());
  }

  startEditProject(project: Project): void {
    this.projectEditForm = {
      title: project.title,
      description: project.description ?? '',
      status: project.status,
      customerNotes: project.customerNotes ?? '',
      internalNotes: project.internalNotes ?? '',
      progressPercent: project.progressPercent,
      eta: project.eta ? project.eta.slice(0, 10) : '',
    };
    this.editingProjectId.set(project.id);
  }

  cancelEditProject(): void {
    this.editingProjectId.set(null);
  }

  saveEditProject(projectId: string): void {
    if (!this.projectEditForm.title.trim()) return;

    this.projectService.update(projectId, this.projectEditForm).subscribe({
      next: () => {
        this.editingProjectId.set(null);
        this.loadProjects();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Kunne ikke oppdatere prosjekt'),
    });
  }

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }

  removalDate(cancelledAt: string): Date {
    const date = new Date(cancelledAt);
    date.setDate(date.getDate() + 30);
    return date;
  }
}

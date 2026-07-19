import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ProjectService } from '../../core/services/project.service';
import { ServiceRequest } from '../../core/models/service-request.model';
import { Project } from '../../core/models/project.model';

type RequestTab = 'PENDING' | 'APPROVED' | 'REJECTED';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  private serviceRequestService = inject(ServiceRequestService);
  private projectService = inject(ProjectService);

  requests = signal<ServiceRequest[]>([]);
  projects = signal<Project[]>([]);
  activeTab = signal<RequestTab>('PENDING');
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
  approvedRequests = computed(() => this.requests().filter((r) => r.status === 'APPROVED'));
  rejectedRequests = computed(() => this.requests().filter((r) => r.status === 'REJECTED'));

  ngOnInit(): void {
    this.loadRequests();
    this.loadProjects();
  }

  setTab(tab: RequestTab): void {
    this.activeTab.set(tab);
  }

  loadRequests(): void {
    this.serviceRequestService.list().subscribe((requests) => this.requests.set(requests));
  }

  loadProjects(): void {
    this.projectService.list().subscribe((projects) => this.projects.set(projects));
  }

  titleFor(requestId: string): string {
    return this.titleDrafts.get(requestId) ?? '';
  }

  setTitle(requestId: string, value: string): void {
    this.titleDrafts.set(requestId, value);
  }

  projectFor(requestId: string): Project | undefined {
    return this.projects().find((p) => p.serviceRequestId === requestId);
  }

  approve(request: ServiceRequest): void {
    const title = this.titleFor(request.id).trim();
    if (!title) {
      this.error.set('Enter a project title before approving.');
      return;
    }

    this.serviceRequestService.approve(request.id, title).subscribe({
      next: () => {
        this.titleDrafts.delete(request.id);
        this.error.set(null);
        this.loadRequests();
        this.loadProjects();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Could not approve request'),
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
      error: (err) => this.error.set(err?.error?.error ?? 'Could not update project'),
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

import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ProjectService } from '../../core/services/project.service';
import { ServiceRequest } from '../../core/models/service-request.model';
import { Project } from '../../core/models/project.model';

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
  private titleDrafts = new Map<string, string>();
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRequests();
    this.loadProjects();
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

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }
}

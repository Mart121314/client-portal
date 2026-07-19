import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ProjectService } from '../../core/services/project.service';
import { ServiceRequest } from '../../core/models/service-request.model';
import { Project } from '../../core/models/project.model';
import { StatusLabelPipe } from '../../core/pipes/status-label.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, DatePipe, StatusLabelPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private serviceRequestService = inject(ServiceRequestService);
  private projectService = inject(ProjectService);

  requests = signal<ServiceRequest[]>([]);
  projects = signal<Project[]>([]);
  description = '';
  submitting = signal(false);
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

  submit(): void {
    if (!this.description.trim()) return;
    this.submitting.set(true);
    this.error.set(null);

    this.serviceRequestService.create(this.description).subscribe({
      next: () => {
        this.description = '';
        this.submitting.set(false);
        this.loadRequests();
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err?.error?.error ?? 'Kunne ikke sende forespørsel');
      },
    });
  }

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }
}

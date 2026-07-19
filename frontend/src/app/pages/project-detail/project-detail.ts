import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { Project } from '../../core/models/project.model';
import { Message } from '../../core/models/message.model';
import { FileUpload } from '../../core/models/file-upload.model';
import { Deliverable } from '../../core/models/deliverable.model';
import { Invoice } from '../../core/models/invoice.model';

type Tab = 'messages' | 'files' | 'deliverables' | 'invoices';

@Component({
  selector: 'app-project-detail',
  imports: [FormsModule, DatePipe],
  templateUrl: './project-detail.html',
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  projectId = this.route.snapshot.paramMap.get('id')!;

  project = signal<Project | null>(null);
  messages = signal<Message[]>([]);
  files = signal<FileUpload[]>([]);
  deliverables = signal<Deliverable[]>([]);
  invoices = signal<Invoice[]>([]);

  activeTab = signal<Tab>('messages');

  isAdmin = computed(() => this.authService.currentUser()?.role === 'ADMIN');

  isEditing = signal(false);
  editForm = {
    title: '',
    description: '',
    status: 'ACTIVE',
    customerNotes: '',
    internalNotes: '',
    progressPercent: 0,
    eta: '',
  };

  newMessage = '';
  newFile = { filename: '', url: '', mimeType: '', size: 0 };
  newDeliverable = { title: '', description: '' };
  newInvoice = { amount: 0 };

  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProject();
    this.loadMessages();
    this.loadFiles();
    this.loadDeliverables();
    this.loadInvoices();
  }

  loadProject(): void {
    this.projectService.getOne(this.projectId).subscribe((project) => this.project.set(project));
  }

  startEdit(): void {
    const project = this.project();
    if (!project) return;

    this.editForm = {
      title: project.title,
      description: project.description ?? '',
      status: project.status,
      customerNotes: project.customerNotes ?? '',
      internalNotes: project.internalNotes ?? '',
      progressPercent: project.progressPercent,
      eta: project.eta ? project.eta.slice(0, 10) : '',
    };
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveEdit(): void {
    if (!this.editForm.title.trim()) return;

    this.projectService.update(this.projectId, this.editForm).subscribe({
      next: (project) => {
        this.project.set(project);
        this.isEditing.set(false);
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Could not update project'),
    });
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  loadMessages(): void {
    this.projectService.listMessages(this.projectId).subscribe((messages) => this.messages.set(messages));
  }

  loadFiles(): void {
    this.projectService.listFiles(this.projectId).subscribe((files) => this.files.set(files));
  }

  loadDeliverables(): void {
    this.projectService.listDeliverables(this.projectId).subscribe((deliverables) =>
      this.deliverables.set(deliverables),
    );
  }

  loadInvoices(): void {
    this.projectService.listInvoices(this.projectId).subscribe((invoices) => this.invoices.set(invoices));
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    this.projectService.addMessage(this.projectId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Could not send message'),
    });
  }

  addFile(): void {
    if (!this.newFile.filename || !this.newFile.url || !this.newFile.mimeType || !this.newFile.size) return;
    this.projectService.addFile(this.projectId, this.newFile).subscribe({
      next: () => {
        this.newFile = { filename: '', url: '', mimeType: '', size: 0 };
        this.loadFiles();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Could not add file'),
    });
  }

  createDeliverable(): void {
    if (!this.newDeliverable.title) return;
    this.projectService.createDeliverable(this.projectId, this.newDeliverable).subscribe({
      next: () => {
        this.newDeliverable = { title: '', description: '' };
        this.loadDeliverables();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Could not create deliverable'),
    });
  }

  toggleDeliverable(deliverable: Deliverable): void {
    const nextStatus = deliverable.status === 'PENDING' ? 'DELIVERED' : 'PENDING';
    this.projectService.updateDeliverableStatus(this.projectId, deliverable.id, nextStatus).subscribe(() => {
      this.loadDeliverables();
    });
  }

  createInvoice(): void {
    if (!this.newInvoice.amount) return;
    this.projectService.createInvoice(this.projectId, this.newInvoice).subscribe({
      next: () => {
        this.newInvoice = { amount: 0 };
        this.loadInvoices();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Could not create invoice'),
    });
  }

  markInvoicePaid(invoice: Invoice): void {
    const nextStatus = invoice.status === 'PAID' ? 'UNPAID' : 'PAID';
    this.projectService.updateInvoiceStatus(this.projectId, invoice.id, nextStatus).subscribe(() => {
      this.loadInvoices();
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

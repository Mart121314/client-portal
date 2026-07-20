import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ProjectService } from '../../core/services/project.service';
import { ConversationService } from '../../core/services/conversation.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ServiceRequest } from '../../core/models/service-request.model';
import { Project } from '../../core/models/project.model';
import { Conversation } from '../../core/models/conversation.model';
import { Message } from '../../core/models/message.model';
import { User } from '../../core/models/user.model';
import { StatusLabelPipe } from '../../core/pipes/status-label.pipe';

type DashboardTab = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MESSAGES' | 'USERS';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, FormsModule, DatePipe, StatusLabelPipe],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  private serviceRequestService = inject(ServiceRequestService);
  private projectService = inject(ProjectService);
  private conversationService = inject(ConversationService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  requests = signal<ServiceRequest[]>([]);
  projects = signal<Project[]>([]);
  activeTab = signal<DashboardTab>('PENDING');
  private titleDrafts = new Map<string, string>();
  error = signal<string | null>(null);

  conversations = signal<Conversation[]>([]);
  unreadCount = signal(0);
  openConversationProjectId = signal<string | null>(null);
  conversationMessages = signal<Message[]>([]);
  newConversationMessage = '';

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

  users = signal<User[]>([]);
  isSuperAdmin = computed(() => this.authService.currentUser()?.isSuperAdmin === true);

  pendingRequests = computed(() => this.requests().filter((r) => r.status === 'PENDING'));
  approvedRequests = computed(() => this.requests().filter((r) => r.status === 'APPROVED'));
  rejectedRequests = computed(() => this.requests().filter((r) => r.status === 'REJECTED'));

  ngOnInit(): void {
    this.loadRequests();
    this.loadProjects();
    this.loadUnreadCount();
  }

  setTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
    if (tab === 'MESSAGES') {
      this.openConversationProjectId.set(null);
      this.loadConversations();
    }
    if (tab === 'USERS') {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.userService.list().subscribe((users) => this.users.set(users));
  }

  promoteUser(user: User): void {
    this.userService.promote(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => this.error.set(err?.error?.error ?? 'Kunne ikke gjøre bruker til admin'),
    });
  }

  loadRequests(): void {
    this.serviceRequestService.list().subscribe((requests) => this.requests.set(requests));
  }

  loadProjects(): void {
    this.projectService.list().subscribe((projects) => this.projects.set(projects));
  }

  loadUnreadCount(): void {
    this.conversationService.unreadCount().subscribe((res) => this.unreadCount.set(res.count));
  }

  loadConversations(): void {
    this.conversationService.list().subscribe((conversations) => this.conversations.set(conversations));
  }

  openConversation(conversation: Conversation): void {
    this.openConversationProjectId.set(conversation.projectId);
    this.projectService.listMessages(conversation.projectId).subscribe((messages) => {
      this.conversationMessages.set(messages);
    });

    if (conversation.unreadCount > 0) {
      this.projectService.markMessagesRead(conversation.projectId).subscribe(() => {
        this.loadConversations();
        this.loadUnreadCount();
      });
    }
  }

  closeConversation(): void {
    this.openConversationProjectId.set(null);
    this.conversationMessages.set([]);
  }

  sendConversationMessage(): void {
    const projectId = this.openConversationProjectId();
    if (!projectId || !this.newConversationMessage.trim()) return;

    this.projectService.addMessage(projectId, this.newConversationMessage).subscribe({
      next: () => {
        this.newConversationMessage = '';
        this.projectService.listMessages(projectId).subscribe((messages) => this.conversationMessages.set(messages));
        this.loadConversations();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Kunne ikke sende melding'),
    });
  }

  conversationTitleFor(projectId: string): string {
    return this.conversations().find((c) => c.projectId === projectId)?.projectTitle ?? '';
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

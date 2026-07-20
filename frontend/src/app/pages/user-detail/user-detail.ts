import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Project } from '../../core/models/project.model';
import { Message } from '../../core/models/message.model';
import { StatusLabelPipe } from '../../core/pipes/status-label.pipe';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, FormsModule, DatePipe, StatusLabelPipe],
  templateUrl: './user-detail.html',
})
export class UserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  userId = this.route.snapshot.paramMap.get('id')!;

  user = signal<User | null>(null);
  projects = signal<Project[]>([]);
  messages = signal<Message[]>([]);

  isSuperAdmin = computed(() => this.authService.currentUser()?.isSuperAdmin === true);

  newPassword = '';
  passwordError = signal<string | null>(null);
  passwordSuccess = signal<string | null>(null);

  ngOnInit(): void {
    this.userService.getOne(this.userId).subscribe((user) => this.user.set(user));
    this.userService.getProjects(this.userId).subscribe((projects) => this.projects.set(projects));
    this.userService.getMessages(this.userId).subscribe((messages) => this.messages.set(messages));
  }

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }

  changePassword(): void {
    this.passwordError.set(null);
    this.passwordSuccess.set(null);

    this.userService.setPassword(this.userId, this.newPassword).subscribe({
      next: () => {
        this.newPassword = '';
        this.passwordSuccess.set('Passordet er oppdatert.');
      },
      error: (err) => this.passwordError.set(err?.error?.error ?? 'Kunne ikke oppdatere passordet'),
    });
  }
}

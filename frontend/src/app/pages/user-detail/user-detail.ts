import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Project } from '../../core/models/project.model';
import { Message } from '../../core/models/message.model';
import { StatusLabelPipe } from '../../core/pipes/status-label.pipe';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, DatePipe, StatusLabelPipe],
  templateUrl: './user-detail.html',
})
export class UserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userId = this.route.snapshot.paramMap.get('id')!;

  user = signal<User | null>(null);
  projects = signal<Project[]>([]);
  messages = signal<Message[]>([]);

  ngOnInit(): void {
    this.userService.getOne(this.userId).subscribe((user) => this.user.set(user));
    this.userService.getProjects(this.userId).subscribe((projects) => this.projects.set(projects));
    this.userService.getMessages(this.userId).subscribe((messages) => this.messages.set(messages));
  }

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }
}

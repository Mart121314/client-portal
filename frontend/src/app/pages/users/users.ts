import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  imports: [DatePipe, RouterLink],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  error = signal<string | null>(null);

  isSuperAdmin = computed(() => this.authService.currentUser()?.isSuperAdmin === true);

  ngOnInit(): void {
    this.loadUsers();
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
}

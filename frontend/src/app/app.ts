import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { ConversationService } from './core/services/conversation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected authService = inject(AuthService);
  private conversationService = inject(ConversationService);
  private router = inject(Router);

  unreadCount = signal(0);

  ngOnInit(): void {
    if (this.authService.isLoggedIn() && !this.authService.currentUser()) {
      this.authService.loadCurrentUser().subscribe({
        next: (user) => {
          if (user.role === 'ADMIN') this.loadUnreadCount();
        },
        error: () => {},
      });
    } else if (this.authService.currentUser()?.role === 'ADMIN') {
      this.loadUnreadCount();
    }

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.authService.currentUser()?.role === 'ADMIN') {
        this.loadUnreadCount();
      }
    });
  }

  loadUnreadCount(): void {
    this.conversationService.unreadCount().subscribe((res) => this.unreadCount.set(res.count));
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}

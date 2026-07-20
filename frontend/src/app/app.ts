import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { MessagesPopover } from './components/messages-popover/messages-popover';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MessagesPopover],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn() && !this.authService.currentUser()) {
      this.authService.loadCurrentUser().subscribe({ error: () => {} });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}

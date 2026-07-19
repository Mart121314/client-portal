import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);

  submit(): void {
    this.error.set(null);
    this.loading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.loadCurrentUser().subscribe({
          next: (user) => {
            this.loading.set(false);
            this.router.navigate([user.role === 'ADMIN' ? '/admin' : '/dashboard']);
          },
          error: () => {
            this.loading.set(false);
            this.router.navigate(['/dashboard']);
          },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.error ?? 'Login failed');
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private authService = inject(AuthService);
  private router = inject(Router);

  token = '';
  newPassword = '';
  error = signal<string | null>(null);
  success = signal(false);
  loading = signal(false);

  submit(): void {
    this.error.set(null);
    this.loading.set(true);

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.error ?? 'Reset failed');
      },
    });
  }
}

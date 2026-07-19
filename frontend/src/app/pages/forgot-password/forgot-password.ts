import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private authService = inject(AuthService);

  email = '';
  message = signal<string | null>(null);
  resetToken = signal<string | null>(null);
  loading = signal(false);

  submit(): void {
    this.loading.set(true);
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.message.set(res.message);
        this.resetToken.set(res.resetToken ?? null);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Something went wrong.');
      },
    });
  }
}

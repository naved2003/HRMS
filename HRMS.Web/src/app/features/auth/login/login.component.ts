import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginRequest } from '../../../core/models';

/**
 * LoginComponent — full-page login card. Uses a typed ReactiveForm
 * (non-nullable FormBuilder). On success redirects to the originally
 * requested URL (or /dashboard).
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  private readonly _submitting = signal(false);
  readonly submitting = this._submitting.asReadonly();

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = this.form.getRawValue();
    this._submitting.set(true);

    this.auth.login(payload).subscribe({
      next: () => {
        const returnUrl = this.snapshotReturnUrl();
        void this.router.navigateByUrl(returnUrl || '/dashboard');
      },
      error: () => {
        // The error interceptor already shows a snackbar.
        this._submitting.set(false);
      },
      complete: () => this._submitting.set(false),
    });
  }

  private snapshotReturnUrl(): string {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('returnUrl') ?? '';
    } catch {
      return '';
    }
  }
}

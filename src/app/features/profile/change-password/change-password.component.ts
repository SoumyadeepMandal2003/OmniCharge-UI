import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="animate-fade-in" style="max-width:480px;">
      <div class="page-header">
        <h1 class="page-title">Change Password</h1>
        <p class="page-subtitle">Update your account password</p>
      </div>

      <div class="card">
        @if (success()) {
          <div class="alert-success">
            ✅ Password changed successfully! You can now sign in with your new password.
          </div>
        }
        @if (error()) {
          <div class="alert-error">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="label">Current Password</label>
            <input type="password" formControlName="currentPassword" class="input-field"
              [class.input-error]="f['currentPassword'].invalid && f['currentPassword'].touched"
              placeholder="Your current password" autocomplete="current-password"/>
            @if (f['currentPassword'].invalid && f['currentPassword'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Current password is required</p>
            }
          </div>

          <div class="form-group">
            <label class="label">New Password</label>
            <input type="password" formControlName="newPassword" class="input-field"
              [class.input-error]="f['newPassword'].invalid && f['newPassword'].touched"
              placeholder="Minimum 8 characters" autocomplete="new-password"/>
            @if (f['newPassword'].invalid && f['newPassword'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">New password must be at least 8 characters</p>
            }
          </div>

          <div class="form-group">
            <label class="label">Confirm New Password</label>
            <input type="password" formControlName="confirmPassword" class="input-field"
              [class.input-error]="form.errors?.['mismatch'] && f['confirmPassword'].touched"
              placeholder="Repeat new password" autocomplete="new-password"/>
            @if (form.errors?.['mismatch'] && f['confirmPassword'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Passwords do not match</p>
            }
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="submit" class="btn-primary" [disabled]="loading()">
              @if (loading()) {
                <span style="display:inline-flex;align-items:center;gap:6px;">
                  <span class="spinner-gradient sm animate-spin"></span> Changing...
                </span>
              } @else {
                🔑 Change Password
              }
            </button>
            <a routerLink="/profile" class="btn-secondary">← Back to Profile</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ChangePasswordComponent {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(false);
  error   = signal('');
  success = signal(false);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatch });

  get f() { return this.form.controls; }

  passwordMatch(group: any) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    this.success.set(false);
    this.auth.changePassword({
      currentPassword: this.form.value.currentPassword!,
      newPassword: this.form.value.newPassword!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.form.reset();
        this.toast.success('Password changed!');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Failed to change password.');
      }
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UserResponse } from '../../core/models/user.models';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent],
  template: `
    <div class="animate-fade-in" style="max-width:600px;">
      <div class="page-header">
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Manage your account information</p>
      </div>

      @if (loading()) {
        <app-spinner label="Loading profile..."/>
      } @else {
        <!-- Profile Header Card -->
        <div class="glass-card" style="margin-bottom:20px;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1));border-color:rgba(99,102,241,0.3);">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;flex-shrink:0;">
              {{ userInitial() }}
            </div>
            <div>
              <h2 style="font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">{{ profile()?.fullName }}</h2>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span [ngClass]="profile()?.role === 'ADMIN' ? 'badge-info' : 'badge-purple'">{{ profile()?.role }}</span>
                <span [ngClass]="profile()?.enabled ? 'badge-success' : 'badge-danger'">{{ profile()?.enabled ? 'Active' : 'Disabled' }}</span>
                <span style="font-size:12px;color:var(--text-muted);">ID #{{ profile()?.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="card" style="margin-bottom:20px;">
          <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:20px;">Account Details</h3>

          <form [formGroup]="form" (ngSubmit)="onSave()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="label">Full Name</label>
                <input type="text" formControlName="fullName" class="input-field"
                  [class.input-error]="f['fullName'].invalid && f['fullName'].touched"/>
                @if (f['fullName'].invalid && f['fullName'].touched) {
                  <p style="color:var(--danger);font-size:12px;margin-top:5px;">2–100 characters required</p>
                }
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="label">Mobile Number</label>
                <input type="tel" formControlName="mobile" class="input-field"
                  [class.input-error]="f['mobile'].invalid && f['mobile'].touched" maxlength="10"/>
                @if (f['mobile'].invalid && f['mobile'].touched) {
                  <p style="color:var(--danger);font-size:12px;margin-top:5px;">Valid 10-digit mobile required</p>
                }
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="label">Email Address</label>
                <input type="email" [value]="profile()?.email" class="input-field" disabled/>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="label">Account ID</label>
                <input type="text" [value]="'#' + profile()?.id" class="input-field" disabled/>
              </div>
            </div>

            @if (saveError()) {
              <div class="alert-error" style="margin-top:16px;">{{ saveError() }}</div>
            }

            <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
              <button type="submit" class="btn-primary" [disabled]="saving()">
                @if (saving()) {
                  <span style="display:inline-flex;align-items:center;gap:6px;">
                    <span class="spinner-gradient sm animate-spin"></span> Saving...
                  </span>
                } @else {
                  💾 Save Changes
                }
              </button>
              <a routerLink="/profile/change-password" class="btn-secondary">🔑 Change Password</a>
            </div>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="card" style="border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.05);">
          <h3 style="font-size:15px;font-weight:700;color:#ef4444;margin-bottom:8px;">⚠️ Session Management</h3>
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;line-height:1.6;">
            Sign out from all devices. This revokes all active sessions and tokens.
          </p>
          <button class="btn-danger btn-sm" (click)="onLogoutAll()" [disabled]="loggingOut()">
            @if (loggingOut()) {
              <span style="display:inline-flex;align-items:center;gap:6px;">
                <span class="spinner-gradient sm animate-spin"></span> Signing out...
              </span>
            } @else {
              🚪 Sign Out All Devices
            }
          </button>
        </div>
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private fb          = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toast       = inject(ToastService);

  loading    = signal(true);
  saving     = signal(false);
  loggingOut = signal(false);
  saveError  = signal('');
  profile    = signal<UserResponse | null>(null);

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    mobile:   ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
  });

  get f() { return this.form.controls; }

  userInitial(): string {
    return (this.profile()?.fullName ?? this.profile()?.email ?? '?').charAt(0).toUpperCase();
  }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.form.patchValue({ fullName: data.fullName, mobile: data.mobile });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.saveError.set('');
    this.userService.updateProfile(this.form.value as any).subscribe({
      next: (data) => { this.profile.set(data); this.saving.set(false); this.toast.success('Profile updated!'); },
      error: (err) => { this.saving.set(false); this.saveError.set(err.error?.message ?? 'Failed to update profile'); }
    });
  }

  onLogoutAll(): void {
    this.loggingOut.set(true);
    this.authService.logoutAll().subscribe({
      next: () => this.toast.success('Signed out from all devices'),
      error: () => { this.loggingOut.set(false); this.toast.error('Failed to sign out'); }
    });
  }
}

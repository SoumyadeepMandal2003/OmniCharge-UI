import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card" style="max-width:460px;">

        <!-- Brand -->
        <div style="text-align:center;margin-bottom:28px;">
          <div style="width:52px;height:52px;border-radius:14px;background:var(--glass-bg);border:1px solid var(--glass-border);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.15);margin:0 auto 14px;">
            <img src="mobile-app.png" alt="OmniCharge" class="brand-logo-img" style="width:36px;height:36px;object-fit:contain;border-radius:6px;"/>
          </div>
          <h1 style="font-size:26px;font-weight:800;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px;">
            OmniCharge
          </h1>
          <p style="color:var(--text-secondary);font-size:14px;">Create your account</p>
        </div>

        @if (error()) {
          <div class="alert-error">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="label">Full Name</label>
            <input type="text" formControlName="fullName" class="input-field"
              [class.input-error]="f['fullName'].invalid && f['fullName'].touched"
              placeholder="John Doe" autocomplete="name"/>
            @if (f['fullName'].invalid && f['fullName'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Name must be 2–100 characters</p>
            }
          </div>

          <div class="form-group">
            <label class="label">Email Address</label>
            <input type="email" formControlName="email" class="input-field"
              [class.input-error]="f['email'].invalid && f['email'].touched"
              placeholder="you@example.com" autocomplete="email"/>
            @if (f['email'].invalid && f['email'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Enter a valid email address</p>
            }
          </div>

          <div class="form-group">
            <label class="label">Mobile Number</label>
            <input type="tel" formControlName="mobile" class="input-field"
              [class.input-error]="f['mobile'].invalid && f['mobile'].touched"
              placeholder="9876543210" maxlength="10" autocomplete="tel"/>
            @if (f['mobile'].invalid && f['mobile'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Enter a valid 10-digit Indian mobile number</p>
            }
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <input type="password" formControlName="password" class="input-field"
              [class.input-error]="f['password'].invalid && f['password'].touched"
              placeholder="Minimum 8 characters" autocomplete="new-password"/>
            @if (f['password'].invalid && f['password'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Password must be at least 8 characters</p>
            }
          </div>

          <div class="form-group">
            <label class="label">Account Type</label>
            <select formControlName="role" class="input-field">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" class="btn-primary btn-lg" style="width:100%;margin-top:4px;" [disabled]="loading()">
            @if (loading()) {
              <span style="display:inline-flex;align-items:center;gap:8px;">
                <span class="spinner-gradient sm animate-spin"></span> Creating account...
              </span>
            } @else {
              Create Account
            }
          </button>
        </form>

        <p style="margin-top:20px;font-size:13px;color:var(--text-secondary);text-align:center;">
          Already have an account?
          <a routerLink="/auth/login" style="color:#a78bfa;font-weight:600;text-decoration:none;">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);
  error   = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email:    ['', [Validators.required, Validators.email]],
    mobile:   ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role:     ['USER']
  });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.form.value as any).subscribe({
      next: () => { this.toast.success('Account created!'); this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading.set(false);
        const body = err.error;
        let msg = 'Registration failed. Please try again.';
        if (err.name === 'TimeoutError') msg = 'Request timed out.';
        else if (err.status === 0)       msg = 'Cannot connect to server.';
        else if (err.status === 409)     msg = body?.message ?? 'Email or mobile already registered.';
        else if (err.status === 400)     msg = body?.message ?? 'Please check your details.';
        else if (err.status >= 500)      msg = body?.message ?? 'Server error. Try again.';
        else if (body?.message)          msg = body.message;
        this.error.set(msg);
      }
    });
  }
}

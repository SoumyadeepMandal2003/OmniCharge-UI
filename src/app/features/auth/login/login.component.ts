import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { HealthService, ServiceHealth } from '../../../core/services/health.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card" style="max-width:460px;">

        <!-- Brand -->
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 14px;">
            ⚡
          </div>
          <h1 style="font-size:26px;font-weight:800;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px;">
            OmniCharge
          </h1>
          <p style="color:var(--text-secondary);font-size:14px;">Sign in to your account</p>
        </div>

        <!-- System Status Panel -->
        <div style="background:rgba(0,0,0,0.2);border:1px solid var(--glass-border);border-radius:12px;padding:14px 16px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">System Status</span>
            @if (healthLoading()) {
              <span style="font-size:11px;color:var(--text-muted);">Checking...</span>
            } @else if (allUp()) {
              <span style="font-size:11px;color:#10b981;font-weight:600;">✓ All systems operational</span>
            } @else {
              <span style="font-size:11px;color:#f59e0b;font-weight:600;">⚠ Some services unavailable</span>
            }
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            @for (svc of services(); track svc.name) {
              <div style="display:flex;align-items:center;gap:7px;">
                @if (svc.status === 'CHECKING') {
                  <span class="status-dot checking"></span>
                } @else if (svc.status === 'UP') {
                  <span class="status-dot up"></span>
                } @else {
                  <span class="status-dot down"></span>
                }
                <span style="font-size:12px;color:var(--text-secondary);">{{ svc.name }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Error -->
        @if (error()) {
          <div class="alert-error">{{ error() }}</div>
        }

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
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
            <label class="label">Password</label>
            <input type="password" formControlName="password" class="input-field"
              [class.input-error]="f['password'].invalid && f['password'].touched"
              placeholder="Your password" autocomplete="current-password"/>
            @if (f['password'].invalid && f['password'].touched) {
              <p style="color:var(--danger);font-size:12px;margin-top:5px;">Password is required</p>
            }
          </div>

          <button type="submit" class="btn-primary btn-lg" style="width:100%;margin-top:4px;" [disabled]="loading()">
            @if (loading()) {
              <span style="display:inline-flex;align-items:center;gap:8px;">
                <span class="spinner-gradient sm animate-spin"></span> Signing in...
              </span>
            } @else {
              Sign In
            }
          </button>
        </form>

        <p style="margin-top:20px;font-size:13px;color:var(--text-secondary);text-align:center;">
          Don't have an account?
          <a routerLink="/auth/register" style="color:#a78bfa;font-weight:600;text-decoration:none;">Create one</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private healthService = inject(HealthService);

  loading = signal(false);
  error   = signal('');
  healthLoading = signal(true);
  services = signal<ServiceHealth[]>([
    { name: 'API Gateway',  status: 'CHECKING', port: 8080 },
    { name: 'Auth Service', status: 'CHECKING', port: 8086 },
    { name: 'User Service', status: 'CHECKING', port: 8081 },
    { name: 'Recharge',     status: 'CHECKING', port: 8082 },
    { name: 'Payment',      status: 'CHECKING', port: 8083 },
    { name: 'Operator',     status: 'CHECKING', port: 8084 },
  ]);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  get f() { return this.form.controls; }

  allUp(): boolean {
    return this.services().every(s => s.status === 'UP');
  }

  ngOnInit(): void {
    this.healthService.checkAll().subscribe({
      next: (results) => {
        this.services.set(results);
        this.healthLoading.set(false);
      },
      error: () => {
        this.healthLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.value as any).subscribe({
      next: () => { this.toast.success('Welcome back!'); this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading.set(false);
        const serverMsg = err.error?.message ?? err.error?.error ?? null;
        let msg: string;
        if (err.name === 'TimeoutError')  msg = 'Request timed out. Please wait and try again.';
        else if (err.status === 0)        msg = 'Cannot reach server. Check your connection.';
        else if (err.status === 401)      msg = serverMsg ?? 'Incorrect email or password.';
        else if (err.status === 400)      msg = serverMsg ?? 'Please enter a valid email and password.';
        else                              msg = serverMsg ?? 'Sign in failed. Please try again.';
        this.error.set(msg);
      }
    });
  }
}

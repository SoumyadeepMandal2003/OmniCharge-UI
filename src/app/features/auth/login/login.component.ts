import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { HealthService, ServiceHealth } from '../../../core/services/health.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styles: [`
    :host { display: block; min-height: 100vh; }
    .login-page { min-height: 100vh; display: flex; }

    /* ── LEFT PANEL ── */
    .login-left {
      flex: 1;
      background: #141230;
      background-image:
        radial-gradient(circle at 80% 90%, #6d28d9 0%, #4c1d95 20%, transparent 60%),
        radial-gradient(circle at 75% 55%, rgba(99, 102, 241, 0.25) 0%, transparent 45%),
        radial-gradient(circle at 20% 15%, #1e1b4b 0%, transparent 50%);
      display: flex;
      flex-direction: column;
      padding: 44px 52px;
      position: relative;
      min-height: 100vh;
    }

    .left-content-inner {
      width: 100%;
      max-width: 480px;
      margin: auto;
      display: flex;
      flex-direction: column;
    }

    /* top row */
    .left-top-row {
      display: flex; align-items: center; justify-content: space-between;
      position: relative; z-index: 5; margin-bottom: 48px;
    }
    .brand-row { display: flex; align-items: center; gap: 12px; }
    .brand-icon-wrap {
      width: 52px; height: 52px; border-radius: 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .brand-logo-img {
      filter: invert(1);
      transition: filter 0.2s ease;
    }
    :host-context([data-theme="light"]) .brand-logo-img {
      filter: invert(0);
    }
    .success-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border-radius: 12px; padding: 10px 16px;
      display: flex; align-items: center; gap: 10px;
      color: #fff; flex-shrink: 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
    .success-check {
      width: 22px; height: 22px; border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      color: #10b981;
    }

    /* headline */
    .left-headline { position: relative; z-index: 5; margin-bottom: 40px; }
    .headline-title {
      font-size: 46px; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    .text-smarter { color: #fff; }
    .text-faster {
      background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .headline-sub {
      color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; max-width: 360px;
    }

    /* ── STACKED CARDS AREA ── */
    .cards-area {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 480px;
      height: 280px;
    }
    
    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 380px;
      margin: 0 auto;
      position: relative;
      z-index: 3;
    }

    .fc {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 16px 20px;
      display: flex; align-items: center; gap: 16px;
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* Glowing active state for Card 1 */
    .fc.active {
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.4);
      box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .fi {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
    }
    
    .fc.active .fi {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
    }

    /* Active Plans — BEHIND cards, peeking from bottom-left */
    .active-plans-float {
      position: absolute;
      left: -50px;
      top: 68px;
      z-index: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px 28px 16px 20px;
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 12px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05);
      width: auto;
      min-width: 140px;
    }

    /* All systems — BEHIND cards, peeking from top-right */
    .systems-float {
      position: absolute;
      right: -80px;
      top: -30px;
      z-index: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 10px 20px 10px 28px;
      font-size: 12px; color: #fff; font-weight: 500;
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }
    .systems-float.disrupted {
      background: rgba(239, 68, 68, 0.06);
      border-color: rgba(239, 68, 68, 0.25);
      box-shadow: 0 8px 32px rgba(239, 68, 68, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    .systems-float.checking {
      background: rgba(245, 158, 11, 0.04);
      border-color: rgba(245, 158, 11, 0.2);
    }

    /* Status dot */
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0;
    }
    .status-dot.up      { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.6); }
    .status-dot.down    { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.6); }
    .status-dot.checking { background: #f59e0b; animation: pulse 1.2s ease-in-out infinite; }

    /* ── RIGHT PANEL ── */
    .login-right {
      flex: 1; display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      padding: 48px 56px; background: #0c0e17; min-height: 100vh;
      position: relative;
    }
    .login-right-inner { width: 100%; max-width: 380px; }

    .dark-input {
      display: block; width: 100%; padding: 14px 16px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; font-size: 14px; font-family: inherit;
      color: #f1f5f9;
      transition: all 0.2s; outline: none;
    }
    .dark-input::placeholder { color: rgba(255,255,255,0.25); }
    .dark-input:focus {
      border-color: rgba(99,102,241,0.6);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
      background: rgba(255,255,255,0.05);
    }
    .dark-input.input-error { border-color: #ef4444; }
    .dark-label { display: block; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); margin-bottom: 8px; }

    .sign-in-btn {
      width: 100%; padding: 14px; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #fff;
      border: none; border-radius: 10px; font-size: 15px; font-weight: 600;
      font-family: inherit; cursor: pointer;
      transition: all 0.2s; margin-top: 18px;
      box-shadow: 0 4px 20px rgba(99,102,241,0.3);
    }
    .sign-in-btn:hover:not(:disabled) {
      opacity: 0.95;
      box-shadow: 0 6px 24px rgba(99,102,241,0.45);
    }
    .sign-in-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .theme-toggle-btn {
      position: fixed; top: 24px; right: 24px; width: 52px; height: 28px;
      border-radius: 14px; border: none; cursor: pointer;
      display: flex; align-items: center; padding: 3px;
      transition: background 0.3s; z-index: 200;
    }
    .theme-toggle-knob {
      width: 22px; height: 22px; border-radius: 50%; background: #fff;
      transition: transform 0.3s; display: flex; align-items: center;
      justify-content: center; font-size: 11px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.25);
    }
    @media (max-width: 768px) {
      .login-left { display: none; }
      .login-right { padding: 32px 24px; }
      .theme-toggle-btn { position: fixed; }
    }

    /* ── LIGHT THEME OVERRIDES ── */
    :host-context([data-theme="light"]) .login-left {
      background: #f8fafc;
      background-image:
        radial-gradient(circle at 80% 90%, #e0e7ff 0%, #c7d2fe 20%, transparent 60%),
        radial-gradient(circle at 75% 55%, rgba(99, 102, 241, 0.1) 0%, transparent 45%),
        radial-gradient(circle at 20% 15%, #f1f5f9 0%, transparent 50%);
    }
    :host-context([data-theme="light"]) .login-right {
      background: #ffffff;
    }
    :host-context([data-theme="light"]) .brand-row span,
    :host-context([data-theme="light"]) .headline-title,
    :host-context([data-theme="light"]) .text-smarter,
    :host-context([data-theme="light"]) .login-right-inner h2 {
      color: #1e1b4b !important;
    }
    :host-context([data-theme="light"]) .headline-sub,
    :host-context([data-theme="light"]) .login-right-inner p,
    :host-context([data-theme="light"]) .dark-label {
      color: #4f46e5 !important;
    }
    :host-context([data-theme="light"]) .fc,
    :host-context([data-theme="light"]) .active-plans-float,
    :host-context([data-theme="light"]) .systems-float,
    :host-context([data-theme="light"]) .success-pill,
    :host-context([data-theme="light"]) .fi,
    :host-context([data-theme="light"]) .brand-icon-wrap {
      background: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    :host-context([data-theme="light"]) .fc.active {
      background: rgba(99, 102, 241, 0.1);
      border-color: rgba(99, 102, 241, 0.4);
    }
    :host-context([data-theme="light"]) .active-plans-float div,
    :host-context([data-theme="light"]) .systems-float span,
    :host-context([data-theme="light"]) .fc div,
    :host-context([data-theme="light"]) .success-pill div {
      color: #1e1b4b !important;
    }
    :host-context([data-theme="light"]) .dark-input {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }
    :host-context([data-theme="light"]) .dark-input::placeholder { color: #94a3b8; }
    :host-context([data-theme="light"]) .dark-input:focus {
      border-color: #6366f1;
      background: #ffffff;
    }
  `],
  template: `
    <button class="theme-toggle-btn"
      [style.background]="themeService.isDark() ? '#4f46e5' : '#cbd5e1'"
      (click)="themeService.toggle()">
      <span class="theme-toggle-knob"
        [style.transform]="themeService.isDark() ? 'translateX(24px)' : 'translateX(0)'">
        @if (themeService.isDark()) {
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15" stroke="#eab308" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        } @else {
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        }
      </span>
    </button>

    <div class="login-page">
      <!-- ══ LEFT PANEL ══ -->
      <div class="login-left">
        <div class="left-content-inner">

          <!-- Top row -->
          <div class="left-top-row">
            <div class="brand-row">
              <div class="brand-icon-wrap">
                <img src="mobile-app.png" alt="OmniCharge" class="brand-logo-img" style="width:36px;height:36px;object-fit:contain;border-radius:6px;"/>
              </div>
              <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;">OmniCharge</span>
            </div>
            <div class="success-pill">
              <div class="success-check">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div style="font-size:12px;font-weight:700;line-height:1.3;color:#fff;">Recharge Successful</div>
                <div style="font-size:10px;font-weight:400;color:rgba(255,255,255,0.6);">Jio 599 · ₹599</div>
              </div>
            </div>
          </div>

          <!-- Headline -->
          <div class="left-headline">
            <h1 class="headline-title">
              Recharge<br>
              <span class="text-smarter">Smarter, </span><span class="text-faster">Faster.</span>
            </h1>
            <p class="headline-sub">
              The all-in-one mobile recharge platform for all operators, all plans, all in one place.
            </p>
          </div>

          <!-- Stacked cards area with floating badges -->
          <div class="cards-area">

            <!-- Cards Stack (arranged vertically in flex list) -->
            <div class="cards-list">
              <!-- Card 1 — glowing / active state -->
              <div class="fc fc-1 active">
                <div class="fi">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div>
                  <div style="font-weight:700;color:#fff;font-size:13px;margin-bottom:2px;">Instant Recharge</div>
                  <div style="font-size:12px;color:rgba(255,255,255,0.6);">Process in under 3 seconds</div>
                </div>
              </div>

              <!-- Card 2 -->
              <div class="fc fc-2">
                <div class="fi">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <div style="font-weight:700;color:#fff;font-size:13px;margin-bottom:2px;">Secure Payments</div>
                  <div style="font-size:12px;color:rgba(255,255,255,0.6);">Bank-grade encryption</div>
                </div>
              </div>

              <!-- Card 3 -->
              <div class="fc fc-3">
                <div class="fi">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a10 10 0 0 1 10 10"/>
                    <path d="M12 6a6 6 0 0 1 6 6"/>
                    <circle cx="12" cy="12" r="2"/>
                    <path d="M12 14v8"/>
                    <path d="M8 22h8"/>
                  </svg>
                </div>
                <div>
                  <div style="font-weight:700;color:#fff;font-size:13px;margin-bottom:2px;">All Operators</div>
                  <div style="font-size:12px;color:rgba(255,255,255,0.6);">Jio, Airtel, VI, BSNL &amp; more</div>
                </div>
              </div>
            </div>

            <!-- Active Plans — floats left, overlapping Card 2 and 3 -->
            <div class="active-plans-float">
              <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;white-space:nowrap;">ACTIVE PLANS</div>
              <div style="font-size:26px;font-weight:800;color:#fff;line-height:1;white-space:nowrap;">2,400+</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;line-height:1.2;white-space:nowrap;">across all operators</div>
            </div>

            <!-- All systems operational — floats right, overlapping Card 1 and 2 -->
            <div class="systems-float" [class.disrupted]="!healthLoading() && !allUp()" [class.checking]="healthLoading()">
              @if (healthLoading()) {
                <span class="status-dot checking"></span>
                <span style="color: rgba(255,255,255,0.85);">Checking system status...</span>
              } @else if (allUp()) {
                <span class="status-dot up"></span>
                <span style="color: rgba(255,255,255,0.85);">All systems operational</span>
              } @else {
                <span class="status-dot down"></span>
                <span style="color: rgba(255,255,255,0.85);">Service disruptions detected</span>
              }
            </div>

          </div>

        </div>
      </div>

      <!-- ══ RIGHT PANEL ══ -->
      <div class="login-right">
        <div class="login-right-inner">
          <h2 style="font-size:28px;font-weight:800;color:#fff;margin-bottom:6px;letter-spacing:-0.01em;">Welcome back</h2>
          <p style="color:rgba(255,255,255,0.45);font-size:14px;margin-bottom:32px;">Sign in to your account to continue</p>

          @if (error()) {
            <div style="padding:12px 16px;border-radius:10px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#ef4444;font-size:13px;margin-bottom:16px;">
              {{ error() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div style="margin-bottom:18px;">
              <label class="dark-label">Email address</label>
              <input type="email" formControlName="email" class="dark-input"
                [class.input-error]="f['email'].invalid && f['email'].touched"
                placeholder="you@example.com" autocomplete="email"/>
              @if (f['email'].invalid && f['email'].touched) {
                <p style="color:#ef4444;font-size:12px;margin-top:5px;">Enter a valid email address</p>
              }
            </div>

            <div style="margin-bottom:18px;position:relative;">
              <label class="dark-label">Password</label>
              <input [type]="showPassword() ? 'text' : 'password'" formControlName="password"
                class="dark-input"
                [class.input-error]="f['password'].invalid && f['password'].touched"
                placeholder="••••••••" autocomplete="current-password" style="padding-right:44px;"/>
              <button type="button" (click)="showPassword.set(!showPassword())"
                style="position:absolute;right:12px;top:38px;background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;">
                @if (showPassword()) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                }
              </button>
              @if (f['password'].invalid && f['password'].touched) {
                <p style="color:#ef4444;font-size:12px;margin-top:5px;">Password is required</p>
              }
            </div>

            <button type="submit" class="sign-in-btn" [disabled]="loading()">
              @if (loading()) {
                <span style="display:inline-flex;align-items:center;gap:8px;justify-content:center;">
                  <span class="spinner-gradient sm animate-spin"></span> Signing in...
                </span>
              } @else {
                Sign In
              }
            </button>
          </form>

          <p style="margin-top:22px;font-size:13px;color:rgba(255,255,255,0.4);text-align:center;">
            Don't have an account?
            <a routerLink="/auth/register" style="color:#818cf8;font-weight:600;text-decoration:none;margin-left:4px;">Create one</a>
          </p>
        </div>
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
  themeService = inject(ThemeService);

  loading = signal(false);
  error   = signal('');
  showPassword = signal(false);
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

  allUp(): boolean { return this.services().every(s => s.status === 'UP'); }

  ngOnInit(): void {
    this.healthService.checkAll().subscribe({
      next: (results) => { this.services.set(results); this.healthLoading.set(false); },
      error: () => { this.healthLoading.set(false); }
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

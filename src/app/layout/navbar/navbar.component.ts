import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header style="
      background: var(--sidebar-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      padding: 0 24px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    ">
      <div style="display:flex;align-items:center;gap:12px;">
        <button (click)="toggleMobile.emit()"
          style="background:none;border:none;color:var(--text-primary);cursor:pointer;font-size:20px;padding:4px;line-height:1;">
          ☰
        </button>
        <a routerLink="/dashboard"
          style="text-decoration:none;font-weight:800;font-size:16px;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          OmniCharge
        </a>
      </div>

      <div style="display:flex;align-items:center;gap:12px;">
        @if (auth.isAdmin()) {
          <span class="badge-purple">Admin</span>
        }

        <!-- Theme toggle -->
        <button (click)="themeService.toggle()"
          style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;padding:6px 10px;font-size:16px;color:var(--text-primary);transition:background 0.2s;"
          [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          {{ themeService.isDark() ? '☀️' : '🌙' }}
        </button>

        <!-- User avatar -->
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;">
            {{ userInitial() }}
          </div>
          <span style="font-size:13px;color:var(--text-secondary);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            {{ auth.currentUser()?.email }}
          </span>
        </div>

        <button (click)="auth.logout()"
          style="background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:8px;cursor:pointer;padding:6px 12px;font-size:13px;font-weight:600;font-family:inherit;transition:background 0.2s;">
          Sign Out
        </button>
      </div>
    </header>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  themeService = inject(ThemeService);
  @Output() toggleMobile = new EventEmitter<void>();

  userInitial(): string {
    const email = this.auth.currentUser()?.email ?? '';
    return email.charAt(0).toUpperCase() || '?';
  }
}

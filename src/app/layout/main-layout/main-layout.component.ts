import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent, ToastComponent],
  styles: [`
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 32px 0;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .hamburger-btn {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-primary);
      font-size: 16px;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .hamburger-btn:hover {
      background: var(--glass-hover);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .theme-toggle {
      width: 48px;
      height: 26px;
      border-radius: 13px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 3px;
      transition: background 0.3s;
      flex-shrink: 0;
    }
    .theme-knob {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
    }
    @media (max-width: 768px) {
      .top-header { padding: 12px 16px 0; }
    }
  `],
  template: `
    <div class="app-shell">
      <!-- Sidebar: shown when sidebarOpen = true -->
      @if (sidebarOpen()) {
        <app-sidebar (close)="sidebarOpen.set(false)"/>
      }

      <div class="main-content">
        <!-- Top Header -->
        <div class="top-header">
          <div class="header-left">
            <!-- Hamburger — only shown when sidebar is closed -->
            @if (!sidebarOpen()) {
              <button class="hamburger-btn" (click)="sidebarOpen.set(true)" title="Open menu">
                ☰
              </button>
            }
            <div>
              <h1 style="font-size:22px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">
                {{ greeting() }}, {{ displayName() }} 👋
              </h1>
              <p style="color:var(--text-secondary);font-size:13px;">Here's what's happening with your account today.</p>
            </div>
          </div>
          <div class="header-actions">
            <!-- Theme Toggle -->
            <button class="theme-toggle"
              [style.background]="themeService.isDark() ? '#6366f1' : '#e2e8f0'"
              (click)="themeService.toggle()">
              <span class="theme-knob"
                [style.transform]="themeService.isDark() ? 'translateX(22px)' : 'translateX(0)'">
                {{ themeService.isDark() ? '🌙' : '☀️' }}
              </span>
            </button>
            <!-- New Recharge Button -->
            <a routerLink="/recharge" class="btn-primary" style="white-space:nowrap;">
              ⚡ New Recharge
            </a>
          </div>
        </div>

        <main class="page-content">
          <router-outlet/>
        </main>
      </div>
    </div>

    <app-toast/>
  `
})
export class MainLayoutComponent implements OnInit {
  sidebarOpen = signal(true);  // open by default on desktop
  auth = inject(AuthService);
  themeService = inject(ThemeService);

  ngOnInit(): void {}

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  displayName(): string {
    const email = this.auth.currentUser()?.email ?? '';
    return email.split('@')[0] || 'User';
  }
}

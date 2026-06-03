import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem { label: string; route: string; icon: string; exact?: boolean; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <aside class="sidebar-panel" [class.mobile-open]="mobileOpen">
      <!-- Brand + Close -->
      <div style="padding:20px 20px 18px;border-bottom:1px solid var(--glass-border);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
              <img src="mobile-app.png" alt="OmniCharge" class="brand-logo-img" style="width:26px;height:26px;object-fit:contain;"/>
            </div>
            <span style="font-weight:800;font-size:17px;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
              OmniCharge
            </span>
          </div>
          <button (click)="close.emit()"
            style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);font-size:13px;font-family:inherit;transition:background 0.2s;flex-shrink:0;line-height:1;"
            title="Close sidebar">
            ✕
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav style="flex:1;padding:12px 0;min-height:0;overflow-y:auto;">
        <p class="sidebar-section-title">Main</p>
        @for (item of mainItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="sidebar-link-active"
             [routerLinkActiveOptions]="{ exact: !!item.exact }"
             class="sidebar-link"
             (click)="close.emit()">
            <span style="font-size:16px;width:20px;text-align:center;flex-shrink:0;">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }

        @if (auth.isAdmin()) {
          <p class="sidebar-section-title" style="margin-top:8px;">Admin</p>
          @for (item of adminItems; track item.route) {
            <a [routerLink]="item.route"
               routerLinkActive="sidebar-link-active"
               class="sidebar-link"
               (click)="close.emit()">
              <span style="font-size:16px;width:20px;text-align:center;flex-shrink:0;">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        }
      </nav>

      <!-- User info + actions -->
      <div style="padding:16px;border-top:1px solid var(--glass-border);">
        <!-- Theme toggle -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;">🌙</span>
            <span style="font-size:13px;color:var(--text-secondary);">{{ themeService.isDark() ? 'Dark Mode' : 'Light Mode' }}</span>
          </div>
          <button (click)="themeService.toggle()"
            style="width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;transition:background 0.3s;flex-shrink:0;"
            [style.background]="themeService.isDark() ? '#6366f1' : '#e2e8f0'">
            <span style="width:20px;height:20px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;transition:transform 0.3s;"
              [style.transform]="themeService.isDark() ? 'translateX(20px)' : 'translateX(0)'">
              {{ themeService.isDark() ? '🌙' : '☀️' }}
            </span>
          </button>
        </div>

        <!-- User info -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0;">
            {{ userInitial() }}
          </div>
          <div style="min-width:0;">
            <p style="font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              {{ auth.currentUser()?.email }}
            </p>
            <p style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">{{ auth.currentUser()?.role }}</p>
          </div>
        </div>

        <button (click)="onSignOut()"
          style="width:100%;padding:9px;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:background 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() mobileOpen = false;
  @Output() close = new EventEmitter<void>();

  auth = inject(AuthService);
  themeService = inject(ThemeService);

  mainItems: NavItem[] = [
    { label: 'Dashboard',        route: '/dashboard',        icon: '🏠', exact: true },
    { label: 'New Recharge',     route: '/recharge',         icon: '⚡', exact: true },
    { label: 'Recharge History', route: '/recharge/history', icon: '📋', exact: true },
    { label: 'Transactions',     route: '/transactions',     icon: '💳' },
    { label: 'Operators',        route: '/operators',        icon: '📡' },
    { label: 'Plans',            route: '/plans',            icon: '📦' },
    { label: 'My Profile',       route: '/profile',          icon: '👤' },
  ];

  adminItems: NavItem[] = [
    { label: 'Manage Users',     route: '/admin/users',        icon: '👥' },
    { label: 'Manage Operators', route: '/admin/operators',    icon: '🏢' },
    { label: 'Manage Plans',     route: '/admin/plans',        icon: '🗂️' },
    { label: 'All Transactions', route: '/admin/transactions', icon: '📊' },
  ];

  onSignOut(): void {
    this.auth.logout();
  }

  userInitial(): string {
    const email = this.auth.currentUser()?.email ?? '';
    return email.charAt(0).toUpperCase() || '?';
  }
}

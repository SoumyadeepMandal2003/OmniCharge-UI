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
      <!-- Brand -->
      <div style="padding:24px 20px 20px;border-bottom:1px solid var(--glass-border);">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
            ⚡
          </div>
          <span style="font-weight:800;font-size:17px;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
            OmniCharge
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav style="flex:1;padding:12px 0;overflow-y:auto;">
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
        <button (click)="themeService.toggle()"
          style="width:100%;display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;cursor:pointer;color:var(--text-secondary);font-size:13px;font-family:inherit;margin-bottom:10px;transition:background 0.2s;">
          <span style="font-size:16px;">{{ themeService.isDark() ? '☀️' : '🌙' }}</span>
          <span>{{ themeService.isDark() ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>

        <!-- User info -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0;">
            {{ userInitial() }}
          </div>
          <div style="min-width:0;">
            <p style="font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              {{ auth.currentUser()?.email }}
            </p>
            <p style="font-size:11px;color:var(--text-muted);">{{ auth.currentUser()?.role }}</p>
          </div>
        </div>

        <button (click)="auth.logout()"
          style="width:100%;padding:9px;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:background 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() mobileOpen = false;
  @Input() desktopCollapsed = false;
  @Output() close = new EventEmitter<void>();
  @Output() toggleDesktop = new EventEmitter<void>();

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

  userInitial(): string {
    const email = this.auth.currentUser()?.email ?? '';
    return email.charAt(0).toUpperCase() || '?';
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-shell">
      <!-- Sidebar overlay for mobile -->
      <div class="sidebar-overlay" [class.visible]="sidebarOpen()" (click)="sidebarOpen.set(false)"></div>

      <app-sidebar [mobileOpen]="sidebarOpen()" (close)="sidebarOpen.set(false)"/>

      <div class="main-content">
        <!-- Mobile top bar -->
        <header class="mobile-topbar">
          <button (click)="sidebarOpen.set(true)"
            style="background:none;border:none;color:var(--text-primary);cursor:pointer;font-size:20px;padding:4px;line-height:1;">
            ☰
          </button>
          <span style="font-weight:700;font-size:16px;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
            OmniCharge
          </span>
        </header>

        <main class="page-content">
          <router-outlet/>
        </main>
      </div>
    </div>

    <app-toast/>
  `
})
export class MainLayoutComponent {
  sidebarOpen = signal(false);
}

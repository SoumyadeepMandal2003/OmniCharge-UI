import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UserResponse } from '../../../core/models/user.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  template: `
    <div class="animate-fade-in">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 class="page-title">Manage Users</h1>
          <p class="page-subtitle">All registered users</p>
        </div>
        <span class="badge-info">Admin</span>
      </div>

      <!-- Filters -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center;">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
          class="input-field" style="width:260px;" placeholder="🔍 Search name, email, mobile..."/>
        <select [(ngModel)]="roleFilter" (ngModelChange)="applyFilter()" class="input-field" style="width:140px;">
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <span style="font-size:13px;color:var(--text-muted);">{{ filtered().length }} users</span>
      </div>

      <div class="card">
        @if (loading()) {
          <app-spinner label="Loading users..."/>
        } @else if (filtered().length === 0) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">👥</div>
            <p style="color:var(--text-secondary);">No users found.</p>
          </div>
        } @else {
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th class="table-header">ID</th>
                  <th class="table-header">Name</th>
                  <th class="table-header">Email</th>
                  <th class="table-header">Mobile</th>
                  <th class="table-header">Role</th>
                  <th class="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (u of filtered(); track u.id) {
                  <tr class="table-row">
                    <td class="table-cell" style="color:var(--text-muted);font-size:12px;">#{{ u.id }}</td>
                    <td class="table-cell">
                      <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;">
                          {{ u.fullName.charAt(0).toUpperCase() }}
                        </div>
                        <strong style="color:var(--text-primary);">{{ u.fullName }}</strong>
                      </div>
                    </td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ u.email }}</td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ u.mobile }}</td>
                    <td class="table-cell">
                      <span [ngClass]="u.role === 'ADMIN' ? 'badge-info' : 'badge-gray'">{{ u.role }}</span>
                    </td>
                    <td class="table-cell">
                      <span [ngClass]="u.enabled ? 'badge-success' : 'badge-danger'">{{ u.enabled ? 'Active' : 'Disabled' }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);

  loading    = signal(true);
  users      = signal<UserResponse[]>([]);
  filtered   = signal<UserResponse[]>([]);
  searchTerm = '';
  roleFilter = '';

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => { this.users.set(data); this.filtered.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    let result = this.users();
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.mobile.includes(term)
      );
    }
    if (this.roleFilter) result = result.filter(u => u.role === this.roleFilter);
    this.filtered.set(result);
  }
}

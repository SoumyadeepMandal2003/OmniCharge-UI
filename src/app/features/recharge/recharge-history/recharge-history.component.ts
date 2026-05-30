import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RechargeService } from '../../../core/services/recharge.service';
import { RechargeResponse } from '../../../core/models/recharge.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { LocalDatePipe } from '../../../shared/utils/local-date.pipe';
import { retry } from 'rxjs';

@Component({
  selector: 'app-recharge-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent, LocalDatePipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 class="page-title">Recharge History</h1>
          <p class="page-subtitle">All your past recharges</p>
        </div>
        <a routerLink="/recharge" class="btn-primary">⚡ New Recharge</a>
      </div>

      <!-- Filters -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center;">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
          class="input-field" style="width:260px;" placeholder="🔍 Search mobile, operator, plan..."
          [ngModelOptions]="{standalone: true}"/>
        <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()"
          class="input-field" style="width:150px;" [ngModelOptions]="{standalone: true}">
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <span style="font-size:13px;color:var(--text-muted);">{{ filtered().length }} records</span>
      </div>

      <div class="card">
        @if (loading()) {
          <app-spinner label="Loading history..."/>
        } @else if (error()) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
            <p style="color:var(--text-secondary);margin-bottom:16px;">Could not load recharge history.</p>
            <button (click)="loadHistory()" class="btn-secondary">Retry</button>
          </div>
        } @else if (filtered().length === 0) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">📋</div>
            <p style="color:var(--text-secondary);margin-bottom:16px;">No recharges found.</p>
            <a routerLink="/recharge" class="btn-primary">Make a recharge</a>
          </div>
        } @else {
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th class="table-header">Recharge ID</th>
                  <th class="table-header">Mobile</th>
                  <th class="table-header">Operator</th>
                  <th class="table-header">Plan</th>
                  <th class="table-header">Amount</th>
                  <th class="table-header">Validity</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                @for (r of filtered(); track r.id) {
                  <tr class="table-row">
                    <td class="table-cell" style="font-family:monospace;font-size:11px;color:var(--text-muted);">{{ r.rechargeId }}</td>
                    <td class="table-cell" style="font-weight:600;">{{ r.mobileNumber }}</td>
                    <td class="table-cell">{{ r.operatorName }}</td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ r.planName }}</td>
                    <td class="table-cell"><strong style="color:var(--text-primary);">₹{{ r.amount }}</strong></td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ r.validityDays }}d</td>
                    <td class="table-cell"><span [ngClass]="statusBadge(r.status)">{{ r.status }}</span></td>
                    <td class="table-cell" style="color:var(--text-secondary);white-space:nowrap;">{{ r.createdAt | localDate }}</td>
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
export class RechargeHistoryComponent implements OnInit {
  private rechargeService = inject(RechargeService);

  loading   = signal(true);
  recharges = signal<RechargeResponse[]>([]);
  filtered  = signal<RechargeResponse[]>([]);
  error     = signal(false);
  searchTerm = '';
  statusFilter = '';

  ngOnInit(): void { this.loadHistory(); }

  loadHistory(): void {
    this.loading.set(true);
    this.error.set(false);
    this.rechargeService.getHistory().pipe(retry({ count: 2, delay: 2000 })).subscribe({
      next: (data) => { this.recharges.set(data); this.filtered.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set(true); }
    });
  }

  applyFilter(): void {
    let result = this.recharges();
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(r =>
        r.mobileNumber.includes(term) ||
        r.operatorName.toLowerCase().includes(term) ||
        r.planName.toLowerCase().includes(term) ||
        r.rechargeId.toLowerCase().includes(term)
      );
    }
    if (this.statusFilter) result = result.filter(r => r.status === this.statusFilter);
    this.filtered.set(result);
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      'COMPLETED': 'badge-success', 'SUCCESS': 'badge-success',
      'PENDING': 'badge-warning', 'PROCESSING': 'badge-info', 'FAILED': 'badge-danger'
    };
    return map[status] ?? 'badge-gray';
  }
}

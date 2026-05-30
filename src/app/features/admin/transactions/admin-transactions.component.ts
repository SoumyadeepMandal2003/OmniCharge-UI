import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { TransactionResponse } from '../../../core/models/payment.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { LocalDatePipe } from '../../../shared/utils/local-date.pipe';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent, LocalDatePipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 class="page-title">All Transactions</h1>
          <p class="page-subtitle">System-wide payment history</p>
        </div>
        <span class="badge-info">Admin</span>
      </div>

      <!-- Stat Cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:28px;">
        <div class="stat-card">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(99,102,241,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">📊</div>
          <div>
            <div style="font-size:24px;font-weight:800;color:var(--text-primary);">{{ transactions().length }}</div>
            <div style="font-size:12px;color:var(--text-secondary);">Total</div>
          </div>
        </div>
        <div class="stat-card">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">✅</div>
          <div>
            <div style="font-size:24px;font-weight:800;color:#10b981;">{{ countByStatus('SUCCESS') }}</div>
            <div style="font-size:12px;color:var(--text-secondary);">Success</div>
          </div>
        </div>
        <div class="stat-card">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(239,68,68,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">❌</div>
          <div>
            <div style="font-size:24px;font-weight:800;color:#ef4444;">{{ countByStatus('FAILED') }}</div>
            <div style="font-size:12px;color:var(--text-secondary);">Failed</div>
          </div>
        </div>
        <div class="stat-card">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">💰</div>
          <div>
            <div style="font-size:24px;font-weight:800;color:#a78bfa;">₹{{ totalRevenue() | number:'1.0-0' }}</div>
            <div style="font-size:12px;color:var(--text-secondary);">Revenue</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center;">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
          class="input-field" style="width:260px;" placeholder="🔍 Search by transaction ID, user ID..."/>
        <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()" class="input-field" style="width:150px;">
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <span style="font-size:13px;color:var(--text-muted);">{{ filtered().length }} records</span>
      </div>

      <div class="card">
        @if (loading()) {
          <app-spinner label="Loading transactions..."/>
        } @else if (filtered().length === 0) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">💳</div>
            <p style="color:var(--text-secondary);">No transactions found.</p>
          </div>
        } @else {
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th class="table-header">Transaction ID</th>
                  <th class="table-header">Recharge ID</th>
                  <th class="table-header">User ID</th>
                  <th class="table-header">Amount</th>
                  <th class="table-header">Method</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                @for (t of filtered(); track t.id) {
                  <tr class="table-row">
                    <td class="table-cell" style="font-family:monospace;font-size:11px;color:var(--text-muted);">{{ t.transactionId }}</td>
                    <td class="table-cell" style="font-family:monospace;font-size:11px;color:var(--text-muted);">{{ t.rechargeId }}</td>
                    <td class="table-cell" style="color:var(--text-secondary);">#{{ t.userId }}</td>
                    <td class="table-cell"><strong style="color:var(--text-primary);">₹{{ t.amount }}</strong></td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ t.paymentMethod || '—' }}</td>
                    <td class="table-cell"><span [ngClass]="statusBadge(t.status)">{{ t.status }}</span></td>
                    <td class="table-cell" style="color:var(--text-secondary);white-space:nowrap;">{{ t.createdAt | localDate }}</td>
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
export class AdminTransactionsComponent implements OnInit {
  private paymentService = inject(PaymentService);

  loading      = signal(true);
  transactions = signal<TransactionResponse[]>([]);
  filtered     = signal<TransactionResponse[]>([]);
  searchTerm   = '';
  statusFilter = '';

  ngOnInit(): void {
    this.paymentService.getAllTransactions().subscribe({
      next: (data) => { this.transactions.set(data); this.filtered.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    let result = this.transactions();
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.transactionId.toLowerCase().includes(term) ||
        t.rechargeId.toLowerCase().includes(term) ||
        String(t.userId).includes(term)
      );
    }
    if (this.statusFilter) result = result.filter(t => t.status === this.statusFilter);
    this.filtered.set(result);
  }

  countByStatus(status: string): number {
    return this.transactions().filter(t => t.status === status).length;
  }

  totalRevenue(): number {
    return this.transactions().filter(t => t.status === 'SUCCESS').reduce((sum, t) => sum + Number(t.amount), 0);
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      'SUCCESS': 'badge-success', 'PENDING': 'badge-warning',
      'FAILED': 'badge-danger', 'REFUNDED': 'badge-info'
    };
    return map[status] ?? 'badge-gray';
  }
}

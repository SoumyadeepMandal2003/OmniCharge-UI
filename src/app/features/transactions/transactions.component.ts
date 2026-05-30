import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { TransactionResponse } from '../../core/models/payment.models';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { LocalDatePipe } from '../../shared/utils/local-date.pipe';
import { retry } from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent, LocalDatePipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">My Transactions</h1>
        <p class="page-subtitle">Payment history for all your recharges</p>
      </div>

      <!-- Filters -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center;">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
          class="input-field" style="width:260px;" placeholder="🔍 Search by transaction ID..."/>
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
        } @else if (error()) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
            <p style="color:var(--text-secondary);margin-bottom:16px;">Could not load transactions.</p>
            <button (click)="loadTransactions()" class="btn-secondary">Retry</button>
          </div>
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
export class TransactionsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService    = inject(AuthService);

  loading      = signal(true);
  transactions = signal<TransactionResponse[]>([]);
  filtered     = signal<TransactionResponse[]>([]);
  error        = signal(false);
  searchTerm   = '';
  statusFilter = '';

  ngOnInit(): void { this.loadTransactions(); }

  loadTransactions(): void {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) { this.loading.set(false); this.error.set(true); return; }
    this.loading.set(true);
    this.error.set(false);
    this.paymentService.getTransactionsByUser(userId).pipe(retry({ count: 2, delay: 2000 })).subscribe({
      next: (data) => { this.transactions.set(data); this.filtered.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set(true); }
    });
  }

  applyFilter(): void {
    let result = this.transactions();
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.transactionId.toLowerCase().includes(term) ||
        t.rechargeId.toLowerCase().includes(term)
      );
    }
    if (this.statusFilter) result = result.filter(t => t.status === this.statusFilter);
    this.filtered.set(result);
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      'SUCCESS': 'badge-success', 'PENDING': 'badge-warning',
      'FAILED': 'badge-danger', 'REFUNDED': 'badge-info'
    };
    return map[status] ?? 'badge-gray';
  }
}
